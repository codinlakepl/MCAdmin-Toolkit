import { f7, Icon, Navbar, Page } from "framework7-react";
import React, { useEffect, useState } from "react";

import { fetchWithTimeout } from "../components/fetchWithTimeout.module";

export default function (props) {

    const [serverStats, setServerStats] = useState ("loading");
    const [fetcherClock, setFectherClock] = useState (false);
    const [fetched, setFetched] = useState (false);

    useEffect (() => {

        const loader = async () => {
            if (!fetched) {
                f7.dialog.preloader ("Fetching data...");
            }
    
            let response;
            let json;
    
            try {
                response = await fetchWithTimeout ('https://' + props.serverAddress + '/STATS', {method: 'POST', body: props.sessionKey});
            } catch {
                f7.dialog.close ();
                f7.dialog.alert ("Something went wrong", "Error...", () => {f7.view.main.router.back ()});
                return;
            }
    
            try {
                json = await response.json ();
            } catch {
                f7.dialog.close ();
                f7.dialog.alert ("Session has expired", "Error...", () => {f7.view.main.router.back ()});
                return;
            }
    
            setFetched (true);
            setServerStats (<span>Cpu load: {json.cpuLoad}<br />Ram usage: {json.ramUsage}<br />Players online: {json.playersOnline}<br />Server type: {props.serverType}</span>);
            f7.dialog.close ();
            setTimeout (() => {setFectherClock (!fetcherClock)}, 2000);
        }

        loader ();
    }, [fetcherClock]);

    return (
        <Page name="server">
            <Navbar title={props.serverName} backLink="Back" />

            <div className="serverStats">
                {serverStats}
            </div>

            <div className="serverActionContainer">
                <div className="serverActionRow">
                    <div className="serverAction">
                        <Icon material="people" size={60} />
                    </div>
                    <div className="serverAction">
                        <Icon material="gavel" size={60} />
                    </div>
                    <div className="serverAction">
                        <Icon material="checklist" size={60} />
                    </div>
                </div>
            </div>


        </Page>
    )
}