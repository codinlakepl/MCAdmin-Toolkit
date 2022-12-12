import React, { useEffect, useRef, useState } from 'react';
import {
  Page,
  Navbar,
  NavTitle,
  NavTitleLarge,
  Link,
  Toolbar,
  Block,
  Button,
  f7,
  Popup,
  Searchbar,
  Icon,
  Input,
  List,
  ListItem,
  Preloader
} from 'framework7-react';

import { fetchWithTimeout } from '../components/fetchWithTimeout.module';

function ServerBlock (props) {

  var sessionKey = "";
  var fetched = false;

  const blocker = null;

  const [text, setText] = useState (props.text);
  const [imgHolderContent, setImgContentHolder] = useState (1);
  const [img, setImg] = useState ('/static/DefaultServerIcon.png');
  const rootElem = useRef (null);
  const removeBtn = useRef (null);

  const loader = async () => {

    console.log ('test czy drugi effect działa');

    var responseWasFetched = false;

    removeBtn.current.addEventListener ('click', () => {
      props.removeServerFunc (props.title);
      console.log ("testAbc");
    });

    try {
      var response = await fetchWithTimeout ("https://" + props.address + "/LOGIN", {method: 'POST', body: props.authkey});
      if (response.status >= 400 && response.status < 600) {
        throw '';
      } else responseWasFetched = true;

      var body = await response.json ();
    } catch {
      setText (responseWasFetched ? "wrong auth key" : "error");
      setImgContentHolder (3);
      rootElem.current.addEventListener ('click', () => {
        f7.dialog.alert ("Server is offline or auth key is wrong", "Error");
      });
      return;
    }

    rootElem.current.addEventListener ('click', () => {
      f7.view.main.router.navigate ({name: 'server', params: {serverName: props.title, serverType: body.serverType, serverAddress: props.address, sessionKey: body.sessionKey}});
      console.log ("działa");
    });

    if (body.icon != "none") {
      setImg ("data:image/png;base64," + body.icon);
    }

    setImgContentHolder (2);

    setText (<span>Server type: {body.serverType}<br />Players: {body.players}</span>);
    sessionKey = body.sessionKey;
    fetched = true;
  }

  useEffect (() => {loader ()}, [blocker]);

  return (
      <div className="serverBlock">
          <div className='serverInfo' ref={rootElem}>
            <div className="image">
                <Preloader style={{display: imgHolderContent == 1 ? 'block' : 'none'}} size={42} />
                <img style={{display: imgHolderContent == 2 ? 'block' : 'none', minWidth: '100%'}} src={img} />
            </div>
            <div className="paragraph">
                <h3>{props.title}</h3>
                {text}
            </div>
          </div>
          <div className='removeLane' ref={removeBtn}>
            <Icon material='delete' color='red' />
          </div>
      </div>
  );
}

const HomePage = () => {

  const [loginPopupOpened, setLoginPopupOpened] = useState (false);

  const localStorage = window.localStorage;
  var value = localStorage.getItem ('servers');

  const [reloadClock, setReloadClock] = useState (false);
  const [firstLoaded, setFirstLoaded] = useState (false);
  const [reloadClock2, setReloadClock2] = useState (false);

  const [items, setItems] = useState ([]);

  const blocker = null;

  const removeServer = (serverName) => {
    f7.dialog.confirm ("Do you really want to remove server " + serverName + "?", () => {
      
      let arr = [];

      JSON.parse (value).forEach(server => {
        if (server.title != serverName) {
          arr.push (server);
        }
      });

      let arrString = JSON.stringify (arr);

      localStorage.setItem ('servers', arrString);

      value = JSON.stringify (arrString);

      setReloadClock2 (!reloadClock2);
    });
  }

  const handleDownloadBtn = () => {
    f7.dialog.prompt ("Enter download code", async (code) => {
      f7.dialog.preloader ("Downloading authkey...");

      let address = document.querySelector ('#address').value;
      let port = document.querySelector ('#port').value;

      let result;

      try {
        result = await fetchWithTimeout ('https://' + address + ':' + port + '/GETAUTHKEY', {method: 'POST', body: code});

        if (!result.ok) {
          throw '';
        }
      } catch {
        f7.dialog.close ();
        f7.dialog.alert ("Could not download authkey, please make sure you have entered correct address, port and download code", "Error...");
      }

      let authkey = await result.text ();

      document.querySelector ('#authkey').value = authkey;

      f7.dialog.close ();
    });
  }

  useEffect (() => {
    if (!firstLoaded) return;

    setItems (<span></span>);
    setReloadClock (!reloadClock);
  }, [reloadClock2]);

  useEffect (() => {
    if (value != null) {
      let savedItems = JSON.parse (value);
      let toDisplayItems = [];
      savedItems.forEach(savedItem => {
        toDisplayItems.push (<ListItem><ServerBlock image="/static/walterWhite.jpg" title={savedItem.title} text="Fetching" address={savedItem.address} authkey={savedItem.authkey} removeServerFunc={removeServer} /></ListItem>)
      });
  
      setItems ([...toDisplayItems]);
      setFirstLoaded (true);
    }
  }, [reloadClock]);

  useEffect (() => {
    console.log ((window.innerHeight - document.querySelector ('.servers').getBoundingClientRect ().top) + 'px');
    document.querySelector ('.servers').style.height = (window.innerHeight - document.querySelector ('.servers').getBoundingClientRect ().top) + 'px';
    //console.log ((window.innerHeight - document.querySelector ('.servers').offsetHeight) + 'px');
  }, [blocker]);

  return (<Page name="home" style={{overflow: 'hidden', maxHeight: '100vh'}} onPageAfterIn={() => {
    if (!firstLoaded) return;
    setReloadClock2 (!reloadClock2);
  }}>
    {/* Top Navbar */}
    {/*<Navbar large>
      <NavTitle>MCAdmin-Toolkit</NavTitle>
      <NavTitleLarge>MCAdmin-Toolkit</NavTitleLarge>
</Navbar>*/}
    {/* Toolbar */}
    {/*<Toolbar bottom>
      <Link>Left Link</Link>
      <Link>Right Link</Link>
</Toolbar>*/}
    {/* Page content */}
    <div className='searchBar'>
    <Searchbar searchContainer=".servers" searchIn='h3' backdrop={true} className='searchBar' disableButton={false}>
      <Button style={{marginLeft: 10}} className='addBtn' onClick={() => {setLoginPopupOpened(true)}}><Icon f7="plus"></Icon></Button>
    </Searchbar>
    </div>

    <Button className='reloadBtn' onClick={() => {setReloadClock2 (!reloadClock2)}}><Icon f7='arrow_2_circlepath' /> Reload</Button>

    <List className='servers'>
      {items}
    </List>

    <img src='/static/BackgroundThing.png' style={{width: "100%", position: "absolute", bottom: 0}} />

    <Popup className='loginPopup' opened={loginPopupOpened} onPopupClosed={() => {setLoginPopupOpened (false)}}>
      <Page>
        <div className='loginField'>
          <Input outline type='text' placeholder='Server Name' inputId="serverName" />
          <Input outline type='text' placeholder='Server Address' inputId="address" />
          <Input outline type='number' placeholder='MCAdmin-Toolkit-Connector Port' inputId="port" />
          <div className='authKeySection'>
            <Input outline type='text' placeholder='AuthKey' inputId="authkey" />
            <Button className='downloadAuthKeyBtn' onClick={handleDownloadBtn}><Icon f7='arrow_down_to_line' /></Button>
          </div>
          <div className='buttons'>
            <Button className='backBtn' onClick={() => {setLoginPopupOpened (false)}}><Icon f7='chevron_left' /><span>Back</span></Button>
            <Button className='loginBtn' onClick={() => {
              let serverNameEl = document.querySelector ('#serverName');
              let addressEl = document.querySelector ('#address');
              let portEl = document.querySelector ('#port');
              let authkeyEl = document.querySelector ('#authkey');

              if (serverNameEl.value == "" || addressEl.value == "" || portEl.value == "" || authkeyEl.value == "") {
                f7.toast.show ({text: "Please fill all inputs"});
                return;
              }

              let val = localStorage.getItem ("servers");

              let arr = [];

              if (val != null) {
                arr = JSON.parse (val);
              }
              let itemsToDisplay = items;
              itemsToDisplay.push (<ListItem><ServerBlock image="/static/walterWhite.jpg" title={serverNameEl.value} text="Fetching" address={addressEl.value + ":" + portEl.value} authkey={authkeyEl.value} removeServerFunc={removeServer} /></ListItem>);
              arr.push ({title: serverNameEl.value, address: addressEl.value + ":" + portEl.value, authkey: authkeyEl.value});
              localStorage.setItem ("servers", JSON.stringify (arr));
              setItems ([...itemsToDisplay]);
              setLoginPopupOpened (false);
            }}><span>Add Server</span><Icon f7='checkmark_alt' /></Button>
          </div>
        </div>
      </Page>
    </Popup>
  </Page>)
};
export default HomePage;