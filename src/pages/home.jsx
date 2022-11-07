import React, { useEffect } from 'react';
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
  Icon
} from 'framework7-react';

function ServerBlock (props) {
  return (
      <div className="serverBlock">
          <div className="image">
              <img src={props.image} />
          </div>
          <div className="paragraph">
              <h4>{props.title}</h4>
              <br />
              {props.text}
          </div>
      </div>
  );
}

const HomePage = () => {
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
      <Button style={{marginLeft: 10}} className='addBtn'><Icon f7="plus"></Icon></Button>
    </Searchbar>
    </div>

    <ServerBlock image="/static/walterWhite.jpg" title="test" text="loremIpsum" />

    <img src='/static/BackgroundThing.png' style={{width: "100%", position: "absolute", bottom: 0}} />
  </Page>)
};
export default HomePage;