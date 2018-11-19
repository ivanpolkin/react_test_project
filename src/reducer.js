import uuidv4 from 'uuid/v4';

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
        case 'WEBSOCKET:CONNECT':
            newState = Object.assign({}, state, {
                isConnecting: true,
            });
            return Object.assign({}, state, {
                isConnecting: true,
            });
        case 'WEBSOCKET:DISCONNECT':
            return Object.assign({}, state, {
                isConnecting: false,
                isConnected: false
            });
        case 'WEBSOCKET:OPEN':
            newState = Object.assign({}, state, {
                isConnecting: false,
                isConnected: true
            });
            newState.messages.push([uuidv4(), {type: 'conn', status: 'opened', time: dateTimeToString(new Date())}]);
            return newState;
        case 'WEBSOCKET:CLOSE':
            newState = Object.assign({}, state, {
                isConnected: false,
                isConnecting: false,
                unconfirmed_sub: false,
                blocks_sub: false,
            });
            newState.messages.push([uuidv4(), {type: 'conn', status: 'closed', time: dateTimeToString(new Date())}]);
            return newState;
        case 'WEBSOCKET:CLEAR':
            return Object.assign({}, state, {
                messages: []
            });
        case 'WEBSOCKET:MESSAGE':
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
        case 'WEBSOCKET:unconfirmed_sub':
            return Object.assign({}, state, {transactionsSum: 0, transactionsCount: 0, unconfirmed_sub: true});
        case 'WEBSOCKET:unconfirmed_unsub':
            return Object.assign({}, state, {unconfirmed_sub: false});
        case 'WEBSOCKET:blocks_sub':
            return Object.assign({}, state, {blocksCount: 0, blocks_sub: true});
        case 'WEBSOCKET:blocks_unsub':
            return Object.assign({}, state, {blocks_sub: false});
        case 'WEBSOCKET:addr_sub':
            return Object.assign({}, state, {addr_sub: true});
        case 'WEBSOCKET:addr_unsub':
            return Object.assign({}, state, {addr_sub: false});
        case 'WEBSOCKET:toggle_log':
            return Object.assign({}, state, {showLog: !state.showLog});
        case 'WEBSOCKET:toggle_log_scroll':
            return Object.assign({}, state, {logAutoScroll: !state.logAutoScroll});
        default:
            return state
    }
};

export default reducer;
