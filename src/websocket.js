import {
    WS_ADDR_SUB,
    WS_ADDR_UNSUB,
    WS_BLOCK_SUB,
    WS_BLOCK_UNSUB,
    WS_CLOSE,
    WS_CONNECT,
    WS_DISCONNECT,
    WS_ERROR,
    WS_MESSAGE,
    WS_OPEN,
    WS_SEND,
    WS_TX_SUB,
    WS_TX_UNSUB
} from "./redux/actionTypes";

var W3CWebSocket = require('websocket').w3cwebsocket;

var websocket;
var connectionAttempts = 0;

const websocketMiddleware = store => next => action => {
    switch (action.type) {
        case WS_CONNECT:
            websocket = new W3CWebSocket(action.payload.url);
            let callback = action.payload.callback;

            websocket.onopen = () => {
                connectionAttempts = 0;
                store.dispatch({type: WS_OPEN});
                if (callback) callback();
            };
            websocket.onclose = (event) => {
                if (!event.wasClean) {
                    if (connectionAttempts < 10) {
                        connectionAttempts++;
                        setTimeout(() => {
                            store.dispatch({
                                type: WS_CONNECT, payload: {
                                    url: event.currentTarget.url,
                                    callback: () => {
                                        store.dispatch({type: WS_TX_SUB, payload: event, noCountersReset: true});
                                        store.dispatch({type: WS_BLOCK_SUB, payload: event, noCountersReset: true});
                                    }
                                }
                            });
                        }, 1000);
                    } else {
                        connectionAttempts = 0;
                    }
                }
                store.dispatch({type: WS_CLOSE, payload: event, connectionAttempts});
            };
            websocket.onmessage = (event) => store.dispatch({type: WS_MESSAGE, payload: event});
            websocket.onerror = (event) => store.dispatch({type: WS_ERROR, payload: event});

            break;

        case WS_SEND:
            if (websocket) {
                websocket.send(JSON.stringify(action.payload));
            } else {
                console.error('WebSocket is closed.')
            }
            break;

        case WS_DISCONNECT:
            websocket.close();
            break;
        case WS_TX_SUB:
            websocket.send('{"op": "unconfirmed_sub"}');
            break;
        case WS_TX_UNSUB:
            websocket.send('{"op": "unconfirmed_unsub"}');
            break;
        case WS_BLOCK_SUB:
            websocket.send('{"op": "blocks_sub"}');
            break;
        case WS_BLOCK_UNSUB:
            websocket.send('{"op": "blocks_unsub"}');
            break;
        case WS_ADDR_SUB:
            console.log(action.payload);
            websocket.send(JSON.stringify({"op": "addr_sub", "addr": action.payload.address}));
            break;
        case WS_ADDR_UNSUB:
            websocket.send(JSON.stringify({"op": "addr_unsub", "addr": action.payload.address}));
            break;
        default:
            break;
    }

    return next(action);
};

export default websocketMiddleware;