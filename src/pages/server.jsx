import { Button, f7, Icon, Navbar, Page } from "framework7-react";
import React, { useEffect, useRef, useState } from "react";

import { fetchWithTimeout } from "../components/fetchWithTimeout.module";

import config from '../config.json';

export default function (props) {

    const [serverStats, setServerStats] = useState ("loading");
    const [fetcherClock, setFectherClock] = useState (false);
    const [fetched, setFetched] = useState (false);
    const [logs, setLogs] = useState ([]);

    const playerManagementBtn = useRef (null);
    const banManagementBtn = useRef (null);
    const whitelistManagementBtn = useRef (null);

    const effectBlocker = false;

    const loadLogs = async () => {
        if (props.isFromServer != 'yes') {
            console.log (props.isFromServer);
            return;
        }

        let result;

        let accountData = JSON.parse (localStorage.getItem('loginCredentials'));

        try {
            result = await window.fetch (config.consoleBaseUrl + '/getServerLogsForUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + window.btoa (accountData.email + ':' + accountData.password)
                },
                body: JSON.stringify ({email: props.serverName})
            });
        } catch {
            if (fetched) f7.dialog.close ();
            f7.dialog.alert ("Something went wrong", "Error...");
            return;
        }

        let json;
        try {
          json = await result.json ();
        } catch {
            if (fetched) f7.dialog.close ();
            f7.dialog.alert ('Something went wrong', 'Error...');
            return;
        }

        if (json.error) {
            if (fetched) f7.dialog.close ();
            f7.dialog.alert (json.message, 'Error...');
            return;
        }

        console.log('test czy logi działają');

        let logsTmp = [];

        json.forEach(log => {
            let date = new Date (log.issueTime);
            let formattedDate = `${date.getFullYear ()}-${date.getMonth () < 10 ? '0' : ''}${date.getMonth () + 1}-${date.getDate () < 10 ? '0' : ''}${date.getDate ()} ${date.getHours () < 10 ? '0' : ''}${date.getHours ()}:${date.getMinutes () < 10 ? '0' : ''}${date.getMinutes ()}:${date.getSeconds () < 10 ? '0' : ''}${date.getSeconds ()}`;
            logsTmp.push (<span>{'[' + formattedDate + '] [' + log.user + '] ' + log.logMessage}<br /></span>);
        });

        setLogs ([...logsTmp]);
        if (fetched) f7.dialog.close ();
    }

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
            if (!fetched) {
                f7.dialog.close ();
                loadLogs ();
            }
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
        whitelistManagementBtn.current.addEventListener ('click', () => {
            f7.view.main.router.navigate ({name: 'whitelistManagement', params: {serverName: props.serverName, serverAddress: props.serverAddress, sessionKey: props.sessionKey}});
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

            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end', gap: '10px', marginTop: '30px', marginRight: '15px'}} >
                <Button className='reloadBtn' onClick={async () => {
                    f7.dialog.preloader ('Reloading logs');
                    await loadLogs ();
                }}><Icon f7='arrow_2_circlepath' /> Reload logs</Button>
            </div>

            <div className="logs" style={{marginTop: '30px'}}>
                {logs}
            </div>


        </Page>
    )
}