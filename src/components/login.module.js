import config from '../config.json';

export async function login (f7, user, password) {
    f7.dialog.preloader ('Logging in');

    let result;

    try {
        result = await window.fetch (config.consoleBaseUrl + '/checkUserLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + window.btoa (user + ':' + password)
        },
        body: JSON.stringify ({email: user, password: password}),
    });
    } catch (e) {
        f7.dialog.close ();
        f7.dialog.alert (e, 'Error...');
        return false;
    }

    let json;

    try {
        json = await result.json ();
    } catch (e) {
        f7.dialog.close ();
        f7.dialog.alert (e, 'Error...');
        return false;
    }

    if (json.error) {
        f7.dialog.close ();
        f7.dialog.alert (json.message, 'Error...');
        return false;
    }

    window.localStorage.setItem ('loginCredentials', JSON.stringify ({email: user, password: password}));

    if (window.localStorage.getItem ('servers') == null) {
        window.localStorage.setItem ('servers', JSON.stringify ([]));
    }

    f7.dialog.close ();

    return true;
}