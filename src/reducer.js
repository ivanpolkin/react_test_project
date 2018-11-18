import React from 'react';

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
            newState.messages.push([new Date().getTime(), <b>Connection opened.<br/></b>]);
            return newState;
        case 'WEBSOCKET:CLOSE':
            newState = Object.assign({}, state, {
                isConnected: false,
                isConnecting: false,
                unconfirmed_sub: false,
                blocks_sub: false,
            });
            newState.messages.push([new Date().getTime(), <b>Connection closed.<br/></b>]);
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
                let sum = 0;
                let to = x.out.map((i) => {
                    sum += i.value / 100000000; // to BTC
                    return i.addr;
                });
                if (state.unconfirmed_sub) {
                    newState.transactionsSum += sum;
                    newState.transactionsCount++;
                }
                let href1 = "https://www.blockchain.com/btc/tx/" + x.hash;
                transactionMessage = <div>
                    <b><a href={href1} target="_blank" rel="noopener noreferrer">Transaction</a> of {sum.toFixed(8)} BTC</b>
                    {/*<div><b>Hash:</b> </div>*/}
                    <div><b>From:</b> {from.join(', ')}</div>
                    <div><b>To:</b> {to.join(', ')}</div>
                </div>;
            } else if (data.op === 'block') {
                let x = data.x;
                let n = x.height;
                newState.blocksCount++;
                let href = "https://www.blockchain.com/btc/block/" + x.hash;
                // let foundBy = <a href={x.foundBy.link} target="_blank">{x.foundBy.description}</a>;
                transactionMessage = <div>
                    <b>New Block <a href={href} target="_blank" rel="noopener noreferrer">#{n}</a></b> was found
                </div>;
            } else if (data.op === 'pong') {
                transactionMessage = <b>pong<br/></b>;
            }
            let transactionUID = new Date().getTime();
            newState.messages.push([transactionUID, transactionMessage]);
            newState.messages = newState.messages.slice(-1000); // limit log buffer

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
