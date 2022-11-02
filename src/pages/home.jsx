import React from 'react';
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
  Popup
} from 'framework7-react';
import Framework7 from 'framework7/types';
import { animate } from 'dom7';



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

      <Button fill onClick={() => {f7.toast.show ({text: "Dupa"})}}>Siema</Button>
    </Block>

    <Block strong>
      <p>Powiadomienie</p>
    <Button fill onClick={() => {
        /*var popupNew = f7.popup.create(
          {content: <div className='popup'>TO BYĆ POPUP</div>}
          )
        popupNew.open()*/
        var notification = f7.notification.create({
          title: 'UWAGA!!!',
          text: 'Serwer został zaatakowany przez złych kosmitów',
          on: {
            opened: function () {
              console.log('Notification opened')
            }
          }
        })
        notification.open(animate)
      }
    }>KLIK
    </Button>
    </Block>
    
    <Block strong>
      <p>Popup</p>
    <Button fill onClick={() => {
        /*var popupNew = f7.popup.create(
          {content: <div className='popup'>TO BYĆ POPUP</div>}
          )
        popupNew.open()*/
        	var popup = f7.popup.create({
            content: '<div class="popup">OTO POPUP JEST, CO ROBI NWM, ALE DZIAŁA ^_^</div>',
            on: {
              opened: function () {
                console.log('Popup opened')
              }
            }
          })
        popup.open(animate)
      }
    }>KLIK
    </Button>
    </Block>
  </Page>
);
export default HomePage;