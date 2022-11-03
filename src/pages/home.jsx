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
  Searchbar
} from 'framework7-react';
import Framework7 from 'framework7/types';
import { animate } from 'dom7';



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
    <Searchbar e backdrop={true} className='searchBar' disableButton={false}>
      <Button className='addBtn'>abc</Button>
    </Searchbar>
    </div>
    <img src='/static/BackgroundThing.png' style={{width: "100%", position: "absolute", bottom: 0}} />
  </Page>)
};
export default HomePage;