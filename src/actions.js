// user actions

export const connect = (callback, url = 'wss://ws.blockchain.info/inv') => ({
    type: 'WEBSOCKET:CONNECT',
    payload: {url, callback}
});

export const disconnect = () => ({
    type: 'WEBSOCKET:DISCONNECT',
});

export const send = (message) => ({
    type: 'WEBSOCKET:SEND',
    payload: message
});

export const clear = () => ({
    type: 'WEBSOCKET:CLEAR'
});
