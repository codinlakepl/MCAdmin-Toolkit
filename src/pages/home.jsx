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
  Input
} from 'framework7-react';

function ServerBlock (props) {
  return (
      <div className="serverBlock">
          <div className="image">
              <img src={props.image} />
          </div>
          <div className="paragraph">
              <h3>{props.title}</h3>
              {props.text}
          </div>
      </div>
  );
}

const HomePage = () => {

  const [loginPopupOpened, setLoginPopupOpened] = useState (false);

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
    <Searchbar backdrop={true} className='searchBar' disableButton={false}>
      <Button style={{marginLeft: 10}} className='addBtn' onClick={() => {setLoginPopupOpened(true)}}><Icon f7="plus"></Icon></Button>
    </Searchbar>
    </div>

    <ServerBlock image="/static/walterWhite.jpg" title="test" text="loremIpsum" />

    <img src='/static/BackgroundThing.png' style={{width: "100%", position: "absolute", bottom: 0}} />

    <Popup className='loginPopup' opened={loginPopupOpened} onPopupClosed={() => {setLoginPopupOpened (false)}}>
      <Page>
        <div className='loginField'>
          <Input outline type='text' placeholder='Server Name' />
          <Input outline type='text' placeholder='Server Address' />
          <Input outline type='number' placeholder='MCAdmin-Toolkit-Connector Port' />
          <Input outline type='text' placeholder='AuthKey' />
          <div className='buttons'>
            <Button className='backBtn' onClick={() => {setLoginPopupOpened (false)}}><Icon f7='chevron_left' /><span>Back</span></Button>
            <Button className='loginBtn'><span>Add Server</span><Icon f7='checkmark_alt' /></Button>
          </div>
        </div>
      </Page>
    </Popup>
  </Page>)
};
export default HomePage;