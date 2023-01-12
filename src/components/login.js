import config from '../config.json'
import { fetchWithTimeout } from './fetchWithTimeout.module';

export async function login (f7, user, password) {
    f7.dialog.preloader ('Logging in');

    let result;

    try {
        result = await fetchWithTimeout (config.consoleBaseUrl + '/login', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify ({email: user, password: password})
    });
    } catch {
        f7.dialog.close ();
        f7.dialog.alert ('Something went wrong', 'Error...');
        return;
    }

    let json;

    try {
        json = await result.json ();
    } catch {
        f7.dialog.close ();
        f7.dialog.alert ('Something went wrong', 'Error...');
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