import { f7, Icon, Navbar, Page } from "framework7-react";
import React, { useEffect, useRef, useState } from "react";
import { fetchWithTimeout } from "../components/fetchWithTimeout.module";

function ServerPlayer(props){

    const kickBtn = useRef (null);
    const banBtn = useRef (null);
    const banIpBtn = useRef (null);

    const effectBlocker = false;

    useEffect (() => {
        kickBtn.current.addEventListener ('click', () => {
            f7.dialog.prompt ("Are you sure, you want to kick player " + props.playerName + "?\n Reason:", "Kick player...", async (reason) => {
                f7.dialog.preloader ("Kicking player...");

                let result;

                try {
                    result = await fetchWithTimeout ('https://' + props.serverAddress + '/KICK', {method: 'POST', body: JSON.stringify({sessionKey: props.sessionKey, uuid: props.playerUuid, reason: reason})});
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
                f7.dialog.alert ("Player successfully kicked", "Success...");
            });
        });
    }, [effectBlocker]);

    return(
        <div className="serverPlayer" style={props.isOffline ? {opacity: 0.85} : {}}>
            <div className="playerName">
                {props.playerName}
            </div>
            <div className="buttonsWrapper">
                <div className="actionButton" ref={kickBtn} style={props.isOffline ? {display: 'none'} : {}}>
                    <Icon material="person_remove" />
                </div>
                <div className="actionButton" ref={banBtn}>
                    <Icon material="gavel" />
                </div>
                <div className="actionButton" ref={banIpBtn} style={props.isOffline ? {display: 'none'} : {}}>
                    <Icon material="gavel" color="red"/>
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
                f7.dialog.preloader ("Fetching players ...");
            }
    
            let response;
            let json;
    
            try {
                response = await fetchWithTimeout ('https://' + props.serverAddress + '/PLAYERS', {method: 'POST', body: sessionKey});
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
            json.online.forEach(player => {
                players.push (<ServerPlayer playerName={player.name} playerUuid={player.uuid} isOffline={false} />);
            });

            json.offline.forEach(player => {
                players.push (<ServerPlayer playerName={player} isOffline={true} />);
            });

            setServerPlayers ([...players]);
            if (!fetched) f7.dialog.close ();
            setTimeout (() => {setFectherClock (!fetcherClock)}, 2000);
        }

        loader ();
    }, [fetcherClock]);

    return (
        <Page name="playerManagement">
            <Navbar title={'(Players Management) ' + serverName} backLink="Back" />

            <div className="playersWrapper">
                {serverPlayers}
            </div>
        </Page>
    );
}