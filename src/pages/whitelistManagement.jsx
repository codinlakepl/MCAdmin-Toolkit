import { Button, Checkbox, f7, Icon, Navbar, Page } from "framework7-react";
import React, { useEffect, useRef, useState } from "react";
import { fetchWithTimeout } from "../components/fetchWithTimeout.module";

function ServerPlayer(props){

    //const removeBtn = useRef (null);

    //const effectBlocker = false;

    //useEffect (() => {
    const clickHandler = () => {
        f7.dialog.confirm ("Are you sure, you want to remove player " + props.playerName + " from whitelist?", "Removing player from whitelist...", async () => {
            f7.dialog.preloader ("Removing player from whitelist...");

            let result;

            try {
                console.log (props);
                //result = await fetchWithTimeout ('https://' + props.serverAddress + '/UNBAN', {method: 'POST', body: JSON.stringify({sessionKey: props.sessionKey, name: props.playerName, reason: reason})});
                result = await fetchWithTimeout ('https://' + props.serverAddress + '/WHITEREMOVE', {method: 'POST', body: JSON.stringify({sessionKey: props.sessionKey, username: props.playerName})});
                console.log (props.playerName);
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
            f7.dialog.alert ("Player successfully removed from whitelist", "Success...");
        });
    };
    //}, [effectBlocker]);

    return(
        <div className="serverPlayer">
            <div className="playerName">
                {props.playerName}
            </div>
            <div className="buttonsWrapper">
                <div className="actionButton" onClick={clickHandler}>
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

    const [isEnabled, setIsEnabled] = useState (false);

    useEffect (() => {

        const loader = async () => {
            if (!fetched) {
                f7.dialog.preloader ("Fetching whitelist...");
            }
    
            let response;
            let json;
    
            try {
                response = await fetchWithTimeout ('https://' + props.serverAddress + '/WHITELIST', {method: 'POST', body: sessionKey});
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

            setIsEnabled (json.isEnabled);

            if (!fetched) f7.dialog.close ();

            setServerPlayers ([...players]);
            setTimeout (() => {setFectherClock (!fetcherClock)}, 2000);
        }

        loader ();
    }, [fetcherClock]);

    const addHandler = () => {
        f7.dialog.prompt ("Nick: ", "Add player to whitelist...", async (player) => {
            f7.dialog.preloader ("Adding player to whitelist...");

            let result;

            try {
                console.log (props);
                result = await fetchWithTimeout ('https://' + props.serverAddress + '/WHITEADD', {method: 'POST', body: JSON.stringify({sessionKey: props.sessionKey, username: player})});
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
            f7.dialog.alert ("Player successfully added to whitelist", "Success...");
        });
    }

    return (
        <Page name="playerManagement">
            <Navbar title={'(Whitelist Management) ' + serverName} backLink="Back" />
            <div className="whitelistEnabler">
                <span>Whitelist state: <span><Checkbox checked={isEnabled} onChange={async (e) => {
                    if (e.target.checked) {
                        f7.dialog.preloader ("Enabling whitelist...");

                        let result;

                        try {
                            result = await fetchWithTimeout ("https://" + props.serverAddress + "/WHITEON", {method: 'POST', body: props.sessionKey});
                        } catch {
                            f7.dialog.close ();
                            f7.dialog.alert ("Can't connnect to server", "Something went wrong...");
                            setIsEnabled (false);
                            return;
                        }
        
                        let text = await result.text ();
        
                        if (text != 'Success') {
                            f7.dialog.close ();
                            f7.dialog.alert ("Your session has expired or you don't have enough permissions", "Something went wrong...");
                            setIsEnabled (false);
                            return;
                        }

                        setIsEnabled (true);
        
                        f7.dialog.close ();
                        f7.dialog.alert ("Whitelist successfully enabled", "Success...");
                        return;
                    }
                    f7.dialog.preloader ("Disabling whitelist...");

                    let result;

                    try {
                        result = await fetchWithTimeout ("https://" + props.serverAddress + "/WHITEOFF", {method: 'POST', body: props.sessionKey});
                    } catch {
                        f7.dialog.close ();
                        f7.dialog.alert ("Can't connnect to server", "Something went wrong...");
                        setIsEnabled (true);
                        return;
                    }
    
                    let text = await result.text ();
    
                    if (text != 'Success') {
                        f7.dialog.close ();
                        f7.dialog.alert ("Your session has expired or you don't have enough permissions", "Something went wrong...");
                        setIsEnabled (true);
                        return;
                    }

                    setIsEnabled (false);
    
                    f7.dialog.close ();
                    f7.dialog.alert ("Whitelist successfully disabled", "Success...");
                }}></Checkbox></span></span>
                <span>
                    <Button className="addBtn" onClick={addHandler}>
                        <Icon f7="plus" />
                    </Button>
                </span>
            </div>

            <div className="playersWrapper">
                {serverPlayers}
            </div>
        </Page>
    );
}