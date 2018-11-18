var W3CWebSocket = require('websocket').w3cwebsocket;

var websocket;

const websocketMiddleware = store => next => action => {
    switch (action.type) {
        // User request to connect
        case 'WEBSOCKET:CONNECT':
            // Configure the object
            websocket = new W3CWebSocket(action.payload.url);
            let callback = action.payload.callback;

            // Attach the callbacks
            websocket.onopen = () => {
                store.dispatch({type: 'WEBSOCKET:OPEN'});
                if (callback) callback();
            };
            websocket.onclose = (event) => store.dispatch({type: 'WEBSOCKET:CLOSE', payload: event});
            websocket.onmessage = (event) => store.dispatch({type: 'WEBSOCKET:MESSAGE', payload: event});
            websocket.onerror = (event) => store.dispatch({type: 'WEBSOCKET:ERROR', payload: event});

            break;

        // User request to send a message
        case 'WEBSOCKET:SEND':
            if (websocket) {
                websocket.send(JSON.stringify(action.payload));
            } else {
                console.error('WebSocket is closed.')
            }
            break;

        // User request to disconnect
        case 'WEBSOCKET:DISCONNECT':
            websocket.close();
            break;

        default:
            break;
    }

    return next(action);
};

export default websocketMiddleware;