import { f7, Icon, Navbar, Page } from "framework7-react";
import React, { useEffect, useRef, useState } from "react";
import { fetchWithTimeout } from "../components/fetchWithTimeout.module";

function ServerPlayer(props){

    const removeBtn = useRef (null);

    const effectBlocker = false;

    useEffect (() => {
        removeBtn.current.addEventListener ('click', () => {
            f7.dialog.confirm ("Are you sure, you want to remove player " + props.playerName + " from whitelist?", "Removing player from whitelist...", async () => {
                f7.dialog.preloader ("Removing player from whitelist...");

                let result;

                try {
                    console.log (props);
                    //result = await fetchWithTimeout ('https://' + props.serverAddress + '/UNBAN', {method: 'POST', body: JSON.stringify({sessionKey: props.sessionKey, name: props.playerName, reason: reason})});
                    result = await fetchWithTimeout ('https://' + props.serverAddress + '/WHITEREMOVE', {method: 'POST', body: JSON.stringify({sessionKey: props.sessionKey, username: props.playerName})});
                } catch {
                    f7.dialog.close ();
                    f7.dialog.alert ("Can't connnect to server", "Something went wrong...");
                    return;
                }

                let text = await result.text ();

                if (text != 'Success') {
                    f7.dialog.close ();
                    f7.dialog.alert ("Your session has expired or you don't have enough permissions", "Something went wrong...");
                    return;
                }

                f7.dialog.close ();
                f7.dialog.alert ("Player successfully unbanned", "Success...");
            });
        });
    }, [effectBlocker]);

    return(
        <div className="serverPlayer">
            <div className="playerName">
                {props.playerName}
            </div>
            <div className="buttonsWrapper">
                <div className="actionButton" ref={removeBtn}>
                    <Icon material="delete" />
                </div>
            </div>
        </div>
    )
} 

export default function (props) {
    const serverName = props.serverName;
    const serverAddress = props.serverAddress;
    const sessionKey = props.sessionKey;

    const [serverPlayers, setServerPlayers] = useState ("loading");
    const [fetcherClock, setFectherClock] = useState (false);
    const [fetched, setFetched] = useState (false);

    useEffect (() => {

        const loader = async () => {
            if (!fetched) {
                f7.dialog.preloader ("Fetching bans...");
            }
    
            let response;
            let json;
    
            try {
                response = await fetchWithTimeout ('https://' + props.serverAddress + '/BANLIST', {method: 'POST', body: sessionKey});
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

            let players = [];
    
            setFetched (true);
            //se (<span>Cpu load: {json.cpuLoad}<br />Ram usage: {json.ramUsage}<br />Players online: {json.playersOnline}<br />Server type: {props.serverType}</span>);
            json.players.forEach(player => {
                players.push (<ServerPlayer playerName={player} serverAddress={props.serverAddress} sessionKey={props.sessionKey} />);
            });

            if (!fetched) f7.dialog.close ();

            setServerPlayers ([...players]);
            setTimeout (() => {setFectherClock (!fetcherClock)}, 2000);
        }

        loader ();
    }, [fetcherClock]);

    return (
        <Page name="playerManagement">
            <Navbar title={'(Bans Management) ' + serverName} backLink="Back" />

            <div className="playersWrapper">
                {serverPlayers}
            </div>
        </Page>
    );
}