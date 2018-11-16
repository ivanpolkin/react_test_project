// user actions

export const connect = (url = 'wss://ws.blockchain.info/inv') => ({
    type: 'WEBSOCKET:CONNECT',
    payload: {url}
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