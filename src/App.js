import React, {Component} from 'react';
import './App.css';

import {applyMiddleware, createStore} from 'redux';

import reducer from './reducer';
import websocketMiddleware from './websocket';
import {clear as wsClear, connect as wsConnect, disconnect as wsDisconnect, send as wsSend} from './actions'

let initialState = {
    isConnected: false,
    isConnecting: false,
    messages: []
};

// store for websocket info and received messages
const store = createStore(reducer, initialState, applyMiddleware(websocketMiddleware));


class ConnectButton extends Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            console.log('forceUpdate');
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    connect = () => {
        store.dispatch(wsConnect());
    };

    disconnect = () => {
        store.dispatch(wsDisconnect());

    };

    handleClick = () => {
        // if (!this.state.connecting && !this.state.connected) {
        //     this.setState({
        //         connecting: true
        //     });
        //
        //     this.connect();
        // }

        // this.setState({
        //     buttonState: false
        // });

        // this.setState((state, props) => ({
        //     buttonState: !state.buttonState
        // }));
    };

    render() {
        let button;
        let state = store.getState();

        // conditional render to show user the state of connection
        if (state.isConnecting) {
            button = <button disabled>Connecting...</button>
        } else if (state.isConnected) {
            button = <button onClick={this.disconnect}>Disconnect</button>
        } else {
            button = <button onClick={this.connect}>Connect</button>
        }
        return (
            <div>
                {button}
            </div>
        );
    }
}

class PingButton extends Component {
    constructor(props) {
        super(props);
        this.type = props.type || 'ping';
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }


    handleClick = () => {
        store.dispatch(wsSend({"op": this.type}));
    };

    render() {
        return (
            <div>
                <button onClick={this.handleClick} disabled={!store.getState().isConnected}>
                    {this.type}
                </button>
            </div>
        );
    }
}

class SubUnconfirmedButton extends Component {
    constructor(props) {
        super(props);
        this.isSubscribed = false;
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            if (!store.getState().isConnected) {
                this.isSubscribed = false;
            }
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleClick = () => {
        if (!this.isSubscribed) {
            store.dispatch(wsSend({"op": "unconfirmed_sub"}));
        } else {
            store.dispatch(wsSend({"op": "unconfirmed_unsub"}));
        }
        this.isSubscribed = !this.isSubscribed;
    };

    render() {
        return (
            <div>
                <button onClick={this.handleClick} disabled={!store.getState().isConnected}>
                    {this.isSubscribed ? 'Unsubscribe from' : 'Subscribe to'} Unconfirmed transactions
                </button>
            </div>
        );
    }
}

class SubNewBlocksButton extends Component {
    constructor(props) {
        super(props);
        this.isSubscribed = false;
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            if (!store.getState().isConnected) {
                this.isSubscribed = false;
            }
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleClick = () => {
        if (!this.isSubscribed) {
            store.dispatch(wsSend({"op": "blocks_sub"}));
        } else {
            store.dispatch(wsSend({"op": "blocks_unsub"}));
        }
        this.isSubscribed = !this.isSubscribed;
    };

    render() {
        return (
            <div>
                <button onClick={this.handleClick} disabled={!store.getState().isConnected}>
                    {this.isSubscribed ? 'Unsubscribe from' : 'Subscribe to'} new Blocks
                </button>
            </div>
        );
    }
}

class SubAddressButton extends Component {
    constructor(props) {
        super(props);
        this.isSubscribed = false;
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            if (!store.getState().isConnected) {
                this.isSubscribed = false;
            }
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleClick = () => {
        if (!this.isSubscribed) {
            store.dispatch(wsSend({"op": "addr_sub", "addr": this.address.value}));
            this.isSubscribed = true;
        } else {
            store.dispatch(wsSend({"op": "addr_unsub", "addr": this.address.value}));
            this.isSubscribed = false;
            // this.address.value = "";
        }
    };

    render() {
        return (
            <div>
                <input ref={(el) => this.address = el} disabled={this.isSubscribed || !store.getState().isConnected}
                       value="3422VtS7UtCvXYxoXMVp6eZupR252z85oC"/>
                <button onClick={this.handleClick} disabled={!store.getState().isConnected}>
                    {this.isSubscribed ? 'Unsubscribe from' : 'Subscribe to'} address
                </button>
            </div>
        );
    }
}

class LogArea extends Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date(), buttonState: true};
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate()
        });
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    };

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleClick = () => {
        store.dispatch(wsClear());
    };

    render() {
        let messages = [];

        for (var message of store.getState().messages || []) {
            messages.push(<p style={{"overflowWrap": "break-word"}}>{message}</p>);
        }

        return (
            <div>
                <div id="log">
                    {messages}
                    <div ref={(el) => this.messagesEnd = el}/>
                </div>
                <button onClick={this.handleClick}>Clear log</button>
            </div>

        );
    }
}


class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <ConnectButton/>
                    <PingButton/>
                    <PingButton type="ping_block"/>
                    <PingButton type="ping_tx"/>
                    <SubUnconfirmedButton/>
                    <SubNewBlocksButton/>
                    <SubAddressButton/>
                </header>
                <LogArea/>
            </div>
        );
    }
}

export default App;
