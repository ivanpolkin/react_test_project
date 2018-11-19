import {
    WS_ADDR_SUB,
    WS_ADDR_UNSUB,
    WS_BLOCK_SUB,
    WS_BLOCK_UNSUB,
    WS_CONNECT,
    WS_DISCONNECT,
    WS_LOG_CLEAR,
    WS_SEND,
    WS_TOGGLE_LOG,
    WS_TOGGLE_LOG_SCROLL,
    WS_TX_SUB,
    WS_TX_UNSUB
} from "./actionTypes";
// user actions

export const connect = (callback, url = 'wss://ws.blockchain.info/inv') => ({
    type: WS_CONNECT,
    payload: {url, callback}
});

export const disconnect = () => ({
    type: WS_DISCONNECT,
});

export const send = (message) => ({
    type: WS_SEND,
    payload: message
});

export const clear = () => ({
    type: WS_LOG_CLEAR
});

export const txSub = () => ({
    type: WS_TX_SUB
});

export const txUnsub = () => ({
    type: WS_TX_UNSUB
});

export const blockSub = () => ({
    type: WS_BLOCK_SUB
});

export const blockUnsub = () => ({
    type: WS_BLOCK_UNSUB
});

export const addrSub = (address) => ({
    type: WS_ADDR_SUB,
    payload: {address}
});

export const addUnsub = (address) => ({
    type: WS_ADDR_UNSUB,
    payload: {address}
});

export const toggleLog = () => ({
    type: WS_TOGGLE_LOG,
});

export const toggleLogScroll = () => ({
    type: WS_TOGGLE_LOG_SCROLL,
});