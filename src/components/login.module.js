import config from '../config.json'
import { fetchWithTimeout } from './fetchWithTimeout.module';

export async function login (f7, user, password) {
    f7.dialog.preloader ('Logging in');

    let result;

    try {
        result = await cordovaFetch (config.consoleBaseUrl + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify ({email: user, password: password}),
    });
    } catch (e) {
        f7.dialog.close ();
        f7.dialog.alert (e, 'Error...');
        return;
    }

    let json;

    try {
        json = await result.json ();
    } catch (e) {
        f7.dialog.close ();
        f7.dialog.alert (e, 'Error...');
        return;
    }

    if (json.error) {
        f7.dialog.close ();
        f7.dialog.alert (json.message, 'Error...');
        return;
    }

    localStorage.setItem ('loginCredentials', {email: user, password: password});

    f7.dialog.close ();
}