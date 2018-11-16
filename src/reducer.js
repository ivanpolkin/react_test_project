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
            newState.messages.push('Connection opened.');
            return newState;
        case 'WEBSOCKET:CLOSE':
            newState = Object.assign({}, state, {
                isConnecting: false,
                isConnected: false,
            });
            newState.messages.push('Connection closed.');
            return newState;
        case 'WEBSOCKET:CLEAR':
            return Object.assign({}, state, {
                messages: []
            });
        case 'WEBSOCKET:MESSAGE':
            console.log(state);
            // const data = JSON.parse(action.payload.data);
            // return {...state, ...data};
            newState = Object.assign({}, state);
            if (newState.messages) {
                newState.messages.push(action.payload.data);
            } else {
                newState.messages = [action.payload.data];
            }
            return newState;
        default:
            return state
    }
};

export default reducer;
