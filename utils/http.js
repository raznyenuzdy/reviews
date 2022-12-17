import inAppEvent from '../startup/events';

const internalError = (error) => {
    inAppEvent.emit('errorEvent', [500, error]);
}

export const httpDeleteComment = async (grants, data, callback) => {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${grants.token}`,
                'Content-type': 'application/json',
            }
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/comment/${data.id}`,
            options
        );
        const responseData = await response.json();
        const resp = (({ ok, redirected, status, statusText }) => ({ ok, redirected, status, statusText }))(response);
        if (response.status !== 200) {
            callback({response: resp, responseData}, null);
        } else {
            callback(null, {response: resp, responseData});
        }
    } catch (error) {
        internalError(error)
    }
}
