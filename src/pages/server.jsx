import { f7, Icon, Navbar, Page } from "framework7-react";
import React, { useEffect, useRef, useState } from "react";

import { fetchWithTimeout } from "../components/fetchWithTimeout.module";

export default function (props) {

    const [serverStats, setServerStats] = useState ("loading");
    const [fetcherClock, setFectherClock] = useState (false);
    const [fetched, setFetched] = useState (false);

    const playerManagementBtn = useRef (null);
    const banManagementBtn = useRef (null);
    const whitelistManagementBtn = useRef (null);

    const effectBlocker = false;

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
                if (!fetched) f7.dialog.close ();
                f7.dialog.alert ("Something went wrong", "Error...", () => {f7.view.main.router.back ()});
                return;
            }
    
            try {
                json = await response.json ();
            } catch {
                if (!fetched) f7.dialog.close ();
                f7.dialog.alert ("Session has expired", "Error...", () => {f7.view.main.router.back ()});
                return;
            }
    
            setFetched (true);
            setServerStats (<span>Cpu load: {json.cpuLoad}<br />Ram usage: {json.ramUsage}<br />Players online: {json.playersOnline}<br />Server type: {props.serverType}</span>);
            if (!fetched) f7.dialog.close ();
            setTimeout (() => {setFectherClock (!fetcherClock)}, 2000);
        }

        loader ();
    }, [fetcherClock]);

    useEffect (() => {
        playerManagementBtn.current.addEventListener ('click', () => {
            f7.view.main.router.navigate ({name: 'playerManagement', params: {serverName: props.serverName, serverAddress: props.serverAddress, sessionKey: props.sessionKey}});
        });

        banManagementBtn.current.addEventListener ('click', () => {
            f7.view.main.router.navigate ({name: 'banManagement', params: {serverName: props.serverName, serverAddress: props.serverAddress, sessionKey: props.sessionKey}});
        });
    }, [effectBlocker]);

    return (
        <Page name="server">
            <Navbar title={props.serverName} backLink="Back" />

            <div className="serverStats">
                {serverStats}
            </div>

            <div className="serverActionContainer">
                <div className="serverActionRow">
                    <div className="serverAction" ref={playerManagementBtn}>
                        <Icon material="people" size={60} />
                    </div>
                    <div className="serverAction" ref={banManagementBtn}>
                        <Icon material="gavel" size={60} />
                    </div>
                    <div className="serverAction" ref={whitelistManagementBtn}>
                        <Icon material="checklist" size={60} />
                    </div>
                </div>
            </div>


        </Page>
    )
}