import React, { useEffect, useState } from 'react';
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
  ListItem
} from 'framework7-react';

function ServerBlock (props) {

  var sessionKey = "";
  var fetched = false;

  const blocker = null;

  const [text, setText] = useState (props.text);

  const loader = async () => {
    console.log ("test123");
    console.log (props.authkey);
    var response = await fetch ("https://" + props.address + "/LOGIN", {method: 'POST', body: props.authkey});
    if (response.status >= 400 && response.status < 600) {
      setText ("error");
      console.log (response.status);
      console.log (props.address);
      return;
    }

    var body = JSON.parse (response.body);

    setText (<span>Server type: {body.serverType}<br />Players: {body.players}</span>);
    sessionKey = body.sessionKey;
    fetched = true;
  }

  useEffect (() => {loader ()}, [blocker]);

  return (
      <div className="serverBlock">
          <div className="image">
              <img src={props.image} />
          </div>
          <div className="paragraph">
              <h3>{props.title}</h3>
              {text}
          </div>
      </div>
  );
}

const HomePage = () => {

  const [loginPopupOpened, setLoginPopupOpened] = useState (false);

  const localStorage = window.localStorage;
  var value = localStorage.getItem ('servers');

  const [items, setItems] = useState ([]);

  const blocker = null;

  useEffect (() => {
    if (value != null) {
      let savedItems = JSON.parse (value);
      let toDisplayItems = [];
      savedItems.forEach(savedItem => {
        toDisplayItems.push (<ListItem><ServerBlock image="/static/walterWhite.jpg" title={savedItem.title} text="Fetching" address={savedItem.address} authkey={savedItem.authkey} /></ListItem>)
      });
  
      setItems ([...toDisplayItems]);
    }
  }, [blocker]);

  return (<Page name="home">
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
          <Input outline type='text' placeholder='AuthKey' inputId="authkey" />
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
              itemsToDisplay.push (<ListItem><ServerBlock image="/static/walterWhite.jpg" title={serverNameEl.value} text="Fetching" address={addressEl.value + ":" + portEl.value} authkey={authkeyEl.value} /></ListItem>);
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