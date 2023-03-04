import inAppEvent from '../startup/events';
// import {getAccessToken, getSession} from '@auth0/nextjs-auth0';

const internalError = (error) => {
    inAppEvent.emit('errorEvent', [500, error]);
}

export const httpDeleteBlock = async (data, callback) => {
    try {
        // callback(null, data);
        const response = await httpApi('DELETE', `/api/block/${data.id}`);
        console.log("AT DELETE:", response);
        if (!response) return;
        if (response.status !== 200) {
            callback(response, null);
        } else {
            callback(null, data);
        }
    } catch (error) {
        internalError(error)
    }
}

export const httpDeleteComment = async (data, callback) => {
    try {
        const response = await httpApi('DELETE', `/api/comment/${data.id}`);
        if (!response) return;
        if (response.status !== 200) {
            callback(response, null);
        } else {
            callback(null, response);
        }
    } catch (error) {
        internalError(error)
    }
}

export const httpApi = async (method = 'GET', url, headers = {}, body) => {
    try {
        const options = {
            method,
            headers: { ...headers, url },
        }
        if (body) options.body = JSON.stringify(body);
        console.log("HTTPATICALL: opts", options);
        const response = await fetch(
            '/api/authrequired',
            options
        );
        console.log("HTTPAPICALL:", response);
        const responseData = await response.json();
        console.log("HTTPAPICALL.Data:", responseData);
        if (response.status !== 200) {//это ответ next серверной стороны
            inAppEvent.emit('errorEvent', [500, responseData]);
            return null;
        }

        if (responseData.status === 204) {
            inAppEvent.emit('errorEvent', [204, responseData.responseData]);
            return null;
        }
        if (responseData.status === 500) {
            inAppEvent.emit('errorEvent', [500, responseData.responseData]);
            return null;
        }
        if (responseData.status === 401) {
            inAppEvent.emit('errorEvent', [401, responseData.responseData]);
            inAppEvent.emit('forceLogout');
            return null;
        }
        return responseData
    } catch (error) {
        inAppEvent.emit('errorEvent', [500, error]);
    }
}

export const httpApiSoft = async (method = 'GET', url, headers = {}, body) => {
    try {
        console.log("AT SOFT");
        const options = {
            method,
            headers: { ...headers, url },
        }
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(
            '/api/backend',
            options
        );
        console.log("AT SOFT", response);
        const responseData = await response.json();
        console.log("AT SOFT", responseData);
        if (response.status === 500) {
            inAppEvent.emit('errorEvent', [500, responseData]);
            return null;
        }
        if (response.status === 401) {
            inAppEvent.emit('errorEvent', [401, responseData]);
            return null;
        }
        return responseData
    } catch (error) {
        console.log("ERROR:httpApiSoft", error);
        inAppEvent.emit('errorEvent', [500, error]);
    }
}

export const httpHeaderPrepare = (session, method = 'GET', headers = {}) => {
    // let accessToken;
    // try {
    //     accessToken = await getAccessToken(req, res);
    // } catch (error) {
    //     //подавим ошибку авторизации, здесь авторизация лишь для информации
    // }
    const options = {
        method,
        headers
    };
    if (session?.accessToken) options.headers['Authorization'] = `Bearer ${session?.accessToken}`;
    if (session?.idToken) options.headers['idToken'] = session?.idToken;
    if (req.headers?.key) options.headers.key = req.headers?.key;
    if (Object.keys(req.body).length > 0) options.body = req.body;
    console.log("OPTIONS:", options);
    return options;
}
