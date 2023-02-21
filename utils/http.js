import inAppEvent from '../startup/events';

const internalError = (error) => {
    inAppEvent.emit('errorEvent', [500, error]);
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
            body: JSON.stringify(body),
        }
        const response = await fetch(
            '/api/backend',
            options
        );/*
        const responseData = await response.json();
        if (response.status === 500) {
            inAppEvent.emit('errorEvent', [500, responseData]);
            return null;
        }
        if (response.status === 401) {
            inAppEvent.emit('errorEvent', [401, responseData]);
            inAppEvent.emit('forceLogout');
            forceLogout
            return null;
        }
        return responseData*/
    } catch (error) {
        inAppEvent.emit('errorEvent', [500, error]);
    }
}
