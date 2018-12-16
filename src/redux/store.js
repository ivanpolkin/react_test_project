import {applyMiddleware, createStore} from "redux";
import reducer from "./reducer";
import webSocketMiddleware from "../websocket";

let initialState = {
    isConnected: false,
    isConnecting: false,
    messages: [],
    transactionsSum: 0,
    transactionsCount: 0,
    unconfirmed_sub: false,
    blocks_sub: false,
    blocksCount: 0,
    showLog: false,
    logAutoScroll: true,
};

export default createStore(reducer, initialState, applyMiddleware(webSocketMiddleware));
