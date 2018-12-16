import uuidv4 from 'uuid/v4';
import {
    WS_ADDR_SUB,
    WS_ADDR_UNSUB,
    WS_BLOCK_SUB,
    WS_BLOCK_UNSUB,
    WS_CLOSE,
    WS_CONNECT,
    WS_DISCONNECT,
    WS_ERROR,
    WS_LOG_CLEAR,
    WS_MESSAGE,
    WS_OPEN,
    WS_TOGGLE_LOG,
    WS_TOGGLE_LOG_SCROLL,
    WS_TX_SUB,
    WS_TX_UNSUB
} from "./actionTypes";

function dateTimeToString(dt) {
    return dt.toLocaleString(undefined, {hour12: false}) + '.' + ('00' + dt.getMilliseconds()).slice(-3);
}

const reducer = (state = {}, action) => {
    // debug
    // console.log('reducer');
    // console.log(action);
    // console.log(state);

    var newState;
    switch (action.type) {
        case WS_CONNECT:
            newState = Object.assign({}, state, {
                isConnecting: true,
            });
            return Object.assign({}, state, {
                isConnecting: true,
            });
        case WS_DISCONNECT:
            return Object.assign({}, state, {
                isConnecting: false,
                isConnected: false
            });
        case WS_OPEN:
            newState = Object.assign({}, state, {
                isConnecting: false,
                isConnected: true
            });
            return newState;
        case WS_ERROR:
            console.error(action.payload);
            newState = Object.assign({}, state);
            newState.messages.push([uuidv4(), {
                type: 'conn',
                status: 'error',
                time: dateTimeToString(new Date())
            }]);
            return newState;
        case WS_CLOSE:
            newState = Object.assign({}, state, {
                isConnected: false,
                isConnecting: false,
                unconfirmed_sub: false,
                blocks_sub: false,
            });
            return newState;
        case WS_LOG_CLEAR:
            return Object.assign({}, state, {
                messages: []
            });
        case WS_MESSAGE:
            newState = Object.assign({}, state);
            let data = JSON.parse(action.payload.data);

            let transactionMessage;
            if (data.op === 'utx') {
                let x = data.x;
                let from = x.inputs.map((i) => {
                    return i.prev_out.addr;
                });
                let value = 0;
                let to = x.out.map((i) => {
                    value += i.value / 100000000; // to BTC
                    return i.addr;
                });
                if (state.unconfirmed_sub) {
                    newState.transactionsSum += value;
                    newState.transactionsCount++;
                }
                transactionMessage = {type: 'utx', from, to, hash: x.hash, value};
            } else if (data.op === 'block') {
                let x = data.x;
                let n = x.height;
                newState.blocksCount++;
                transactionMessage = {type: 'block', n, hash: x.hash}
            } else if (data.op === 'pong') {
                transactionMessage = {type: 'pong'};
            }
            transactionMessage['time'] = dateTimeToString(new Date());
            let uuid = uuidv4();
            newState.messages.push([uuid, transactionMessage]);
            newState.messages = newState.messages.slice(-100); // limit log buffer

            return newState;
        case WS_TX_SUB:
            return Object.assign({}, state, {transactionsSum: 0, transactionsCount: 0, unconfirmed_sub: true});
        case WS_TX_UNSUB:
            return Object.assign({}, state, {unconfirmed_sub: false});
        case WS_BLOCK_SUB:
            return Object.assign({}, state, {blocksCount: 0, blocks_sub: true});
        case WS_BLOCK_UNSUB:
            return Object.assign({}, state, {blocks_sub: false});
        case WS_ADDR_SUB:
            return Object.assign({}, state, {addr_sub: true});
        case WS_ADDR_UNSUB:
            return Object.assign({}, state, {addr_sub: false});
        case WS_TOGGLE_LOG:
            return Object.assign({}, state, {showLog: !state.showLog});
        case WS_TOGGLE_LOG_SCROLL:
            return Object.assign({}, state, {logAutoScroll: !state.logAutoScroll});
        default:
            return state
    }
};

export default reducer;
