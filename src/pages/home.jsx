import React from 'react';
import {
  Page,
  Navbar,
  NavTitle,
  NavTitleLarge,
  Link,
  Toolbar,
  Block,
} from 'framework7-react';

const HomePage = () => (
  <Page name="home">
    {/* Top Navbar */}
    <Navbar large>
      <NavTitle>MCAdmin-Toolkit</NavTitle>
      <NavTitleLarge>MCAdmin-Toolkit</NavTitleLarge>
    </Navbar>
    {/* Toolbar */}
    <Toolbar bottom>
      <Link>Left Link</Link>
      <Link>Right Link</Link>
    </Toolbar>
    {/* Page content */}
    <Block strong>
      <p>Here is your blank Framework7 app. Let's see what we have here.</p>
    </Block>

  </Page>
);
export default HomePage;