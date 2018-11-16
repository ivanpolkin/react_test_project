var W3CWebSocket = require('websocket').w3cwebsocket;

var websocket;

const websocketMiddleware = store => next => action => {
    switch (action.type) {
        // User request to connect
        case 'WEBSOCKET:CONNECT':
            // Configure the object
            websocket = new W3CWebSocket(action.payload.url);

            // Attach the callbacks
            websocket.onopen = () => store.dispatch({ type: 'WEBSOCKET:OPEN' });
            websocket.onclose = (event) => store.dispatch({ type: 'WEBSOCKET:CLOSE', payload: event });
            websocket.onmessage = (event) => store.dispatch({ type: 'WEBSOCKET:MESSAGE', payload: event });
            websocket.onerror = (event) => store.dispatch({ type: 'WEBSOCKET:ERROR', payload: event });

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

        default: // We don't really need the default but ...
            break;
    }

    return next(action);
};
// class Websocket {
//
//     constructor(){
//         this.WSClient = new W3CWebSocket('wss://ws.blockchain.info/inv');
//
//         WSClient.onerror = function () {
//             console.log('Connection Error');
//         };
//     }
//
//
//
//
//         WSClient.onopen = function () {
//             console.log('WebSocket Client Connected');
//
//         };
//
//         WSClient.onclose = function () {
//             console.log('echo-protocol Client Closed');
//         };
//
//         WSClient.onmessage = function (e) {
//             if (typeof e.data === 'string') {
//                 console.log("Received: '" + e.data + "'");
//             }
//         };
//     });
//     }

export default websocketMiddleware;