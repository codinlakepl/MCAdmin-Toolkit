import { f7, Icon, Navbar, Page, Button } from "framework7-react";
import React, { useEffect, useRef, useState } from "react";

import { fetchWithTimeout } from "../components/fetchWithTimeout.module";

export default function (props) {

    const [serverStats, setServerStats] = useState ("loading");
    const [logs, setLogs] = useState ([]);
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

            let jsonLogs = [];

            json.logs.forEach(message => {
                jsonLogs.push (<span>{message}</span>);
            });
    
            setFetched (true);
            setServerStats (<span>Cpu load: {json.cpuLoad}<br />Ram usage: {json.ramUsage}<br />Players online: {json.playersOnline}<br />Server type: {props.serverType}</span>);
            setLogs ([...jsonLogs]);
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
        whitelistManagementBtn.current.addEventListener ('click', () => {
            f7.view.main.router.navigate ({name: 'whitelistManagement', params: {serverName: props.serverName, serverAddress: props.serverAddress, sessionKey: props.sessionKey}});
        });
    }, [effectBlocker]);

    const logsDownloadHandle = async () => {
        f7.dialog.preloader ("Downloading logs...");

        let response;
        let text;

        try {
            response = await fetchWithTimeout ('https://' + props.serverAddress + '/LOGS', {method: 'POST', body: props.sessionKey});
        } catch {
            f7.dialog.close ();
            f7.dialog.alert ("Something went wrong", "Error...");
            return;
        }

        try {
            text = await response.text ();
        } catch {
            f7.dialog.close ();
            f7.dialog.alert ("Something went wrong", "Error...");
            return;
        }

        f7.dialog.close ();

        let blob = new Blob([text], {type: 'text/plain'});

        let size = blob.size;
        let type = window.TEMPORARY;

        let currDate = new Date ();

        let year = currDate.getFullYear ();
        let month = (currDate.getMonth () + 1) < 10 ? "0" + (currDate.getMonth () + 1) : (currDate.getMonth () + 1);
        let day = currDate.getDate () < 10 ? "0" + currDate.getDate () : currDate.getDate ();

        let hour = currDate.getHours () < 10 ? "0" + currDate.getHours () : currDate.getHours ();
        let minutes = currDate.getMinutes < 10 ? "0" + currDate.getMinutes () : currDate.getMinutes ();
        let seconds = currDate.getSeconds < 10 ? "0" + currDate.getSeconds () : currDate.getSeconds ();

        let currDateString = `${year}-${month}-${day}_${hour}-${minutes}-${seconds}`;

        let filename = currDateString + '_logs_dump.txt';

        function successCallback (fs) {
            fs.root.getFile (filename, {create: true, exclusive: false}, function(fileEntry) {
                fileEntry.createWriter (function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        window.plugins.socialsharing.share(null, null, fileEntry.nativeURL, null);
                    }

                    fileWriter.onerror = function (e) {
                        f7.dialog.alert ("File writing error", "Error...");
                    }

                    fileWriter.write (blob);
                });
            }, () => {f7.dialog.alert ("File saving error", "Error...")});
        }

        function errorCallback () {
            f7.dialog.alert ("Requesting filesystem error", "Error...");
        }

        window.requestFileSystem (type, size, successCallback, errorCallback);
    }

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

            <div className="serverLogsBtnWrapper">
                <Button className='reloadBtn' onClick={logsDownloadHandle}><Icon f7='arrow_down_doc' /> Download all logs</Button>
            </div>

            <div className="serverLogsContainer">
                {logs}
            </div>


        </Page>
    )
}