import React, {Component} from 'react';
import './App.css';

import {applyMiddleware, createStore} from 'redux';

import reducer from './reducer';
import websocketMiddleware from './websocket';
import {clear as wsClear, connect as wsConnect, disconnect as wsDisconnect, send as wsSend} from './actions'

import blue from '@material-ui/core/colors/blue'
import pink from '@material-ui/core/colors/pink'
import Button from '@material-ui/core/Button';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField/TextField";


const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {main: blue["500"]},
        secondary: {main: pink["500"]},
        // secondary: {main: red["500"]},
    },
    overrides: {
        MuiButton: {
            root: {
                margin: "5px 5px 5px 0",
            }
        },
        MuiFormControl: {
            root: {
                margin: "5px 5px 5px 0",
            }
        }
    },
});

let initialState = {
    isConnected: false,
    isConnecting: false,
    messages: [],
    transactionsSum: 0,
    transactionsCount: 0,
    unconfirmed_sub: false,
    blocks_sub: false,
    blocksCount: 0,
    showLog: true,
    logAutoScroll: true,
};

// store for websocket info and received messages
const store = createStore(reducer, initialState, applyMiddleware(websocketMiddleware));

// connect on load
store.dispatch(wsConnect(() => {
    store.dispatch(wsSend({"op": "unconfirmed_sub"}));
    store.dispatch({type: 'WEBSOCKET:unconfirmed_sub'});
    store.dispatch(wsSend({"op": "blocks_sub"}));
    store.dispatch({type: 'WEBSOCKET:blocks_sub'});
}));


class ConnectButton extends Component {

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    connect = () => {
        store.dispatch(wsConnect(() => {
            store.dispatch(wsSend({"op": "unconfirmed_sub"}));
            store.dispatch({type: 'WEBSOCKET:unconfirmed_sub'});
            store.dispatch(wsSend({"op": "blocks_sub"}));
            store.dispatch({type: 'WEBSOCKET:blocks_sub'});
        }));
    };

    disconnect = () => {
        store.dispatch(wsDisconnect());

    };

    render() {
        let button;
        let state = store.getState();

        // conditional render to show user the state of connection
        if (state.isConnecting) {
            button = <Button variant="outlined" disabled>Connecting...</Button>
        } else if (state.isConnected) {
            button = <Button variant="outlined" color={"secondary"} onClick={this.disconnect}>Disconnect</Button>
        } else {
            button = <Button variant="outlined" color={"primary"} onClick={this.connect}>Connect</Button>
        }
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    {button}
                </MuiThemeProvider>
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
        let state = store.getState();
        let disabled = !state.isConnected || (this.type !== 'ping' && (state.unconfirmed_sub || state.blocks_sub || state.addr_sub));

        return (
            <MuiThemeProvider theme={theme}>
                <Button id={this.type} variant={"outlined"} color={"primary"} onClick={this.handleClick}
                        disabled={disabled}>
                    {this.type}
                </Button>
            </MuiThemeProvider>
        );
    }
}

class SubUnconfirmedButton extends Component {

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleClick = () => {
        if (!store.getState().unconfirmed_sub) {
            store.dispatch(wsSend({"op": "unconfirmed_sub"}));
            store.dispatch({type: 'WEBSOCKET:unconfirmed_sub'});
        } else {
            store.dispatch(wsSend({"op": "unconfirmed_unsub"}));
            store.dispatch({type: 'WEBSOCKET:unconfirmed_unsub'});
        }
    };

    render() {
        let state = store.getState();
        let disabled = !state.isConnected || state.addr_sub;
        let transactions;
        if (state.transactionsCount)
            transactions = <span
                style={{fontSize: "18 !important"}}><b>{state.transactionsSum.toFixed(8)}</b> BTC in <b>{state.transactionsCount}</b> transactions</span>;
        else if (state.unconfirmed_sub)
            transactions = "Waiting for new transactions...";

        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <Button id={this.type} variant={"outlined"} color={state.unconfirmed_sub ? "secondary" : "primary"}
                            onClick={this.handleClick} disabled={disabled}>
                        {state.unconfirmed_sub ? 'Unsubscribe from' : 'Subscribe to'} Unconfirmed transactions
                    </Button>
                </MuiThemeProvider>

                <div style={{display: 'inline'}}>{transactions}</div>
            </div>
        );
    }
}

class SubNewBlocksButton extends Component {

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleClick = () => {
        if (!store.getState().blocks_sub) {
            store.dispatch(wsSend({"op": "blocks_sub"}));
            store.dispatch({type: 'WEBSOCKET:blocks_sub'});
        } else {
            store.dispatch(wsSend({"op": "blocks_unsub"}));
            store.dispatch({type: 'WEBSOCKET:blocks_unsub'});
        }
    };

    render() {
        let state = store.getState();
        let disabled = !state.isConnected;
        let blocks;
        if (state.blocks_sub)
            blocks = state.blocksCount ? <span><b>{state.blocksCount}</b> found </span> : "Waiting for new blocks...";
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <Button id={this.type} variant={"outlined"} color={state.blocks_sub ? "secondary" : "primary"}
                            onClick={this.handleClick} disabled={disabled}>
                        {state.blocks_sub ? 'Unsubscribe from' : 'Subscribe to'} new Blocks
                    </Button>
                </MuiThemeProvider>
                <div style={{display: 'inline'}}>{blocks}</div>
            </div>
        );
    }
}

class SubAddressButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '3422VtS7UtCvXYxoXMVp6eZupR252z85oC'
        };
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleClick = () => {
        if (!store.getState().addr_sub) {
            store.dispatch(wsSend({"op": "addr_sub", "addr": this.state.address}));
            store.dispatch({type: 'WEBSOCKET:addr_sub'});
        } else {
            store.dispatch(wsSend({"op": "addr_unsub", "addr": this.state.address}));
            store.dispatch({type: 'WEBSOCKET:addr_unsub'});
        }
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        let state = store.getState();
        let disabledButton = !state.isConnected || state.unconfirmed_sub;
        let disabledInput = state.addr_sub || !state.isConnected || disabledButton;
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <TextField ref={(el) => this.address = el} disabled={disabledInput}
                               value={this.state.address} onChange={this.handleChange('address')} style={{width: 310}}/>
                    <Button id={this.type} variant={"outlined"} color={state.addr_sub ? "secondary" : "primary"}
                            onClick={this.handleClick} disabled={disabledButton}>
                        {state.addr_sub ? 'Unsubscribe from' : 'Subscribe to'} address
                    </Button>
                </MuiThemeProvider>
            </div>
        );
    }
}

class LogArea extends Component {

    constructor(props) {
        super(props);
        this.state = {date: new Date(), buttonState: true};
        this.messagesEnd = null;
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidUpdate() {
        if (store.getState().logAutoScroll)
            this.scrollToBottom();
    }

    scrollToBottom = () => {
        if (this.log)
            this.log.scrollTop = this.log.scrollHeight;
    };

    clearLog = () => {
        store.dispatch(wsClear());
    };

    toggleLog = () => {
        store.dispatch({type: "WEBSOCKET:toggle_log"});
    };

    toggleLogScroll = () => {
        store.dispatch({type: "WEBSOCKET:toggle_log_scroll"});
    };

    render() {
        let state = store.getState();

        let log;
        if (state.showLog) {
            let storeMessages = state.messages;
            let messages = [];
            for (let i in storeMessages) {
                let obj = storeMessages[i];
                let key = obj[0];
                let message = obj[1];
                messages.push(<div key={key} style={{"overflowWrap": "break-word"}}>{message}<br/></div>);
            }
            log = <>
                <div id="log" ref={(el) => this.log = el}>
                    {messages}
                </div>
                <Button variant={"outlined"} color={"secondary"} onClick={this.clearLog}>Clear log</Button>
                <Button variant={"outlined"} color={state.logAutoScroll ? "secondary" : "primary"}
                        onClick={this.toggleLogScroll}>
                    Turn {state.logAutoScroll ? "off" : "on"} log auto scroll
                </Button>
            </>;
        }
        return (
            <MuiThemeProvider theme={theme}>
                <Button variant={"outlined"} color={state.showLog ? "secondary" : "primary"}
                        onClick={this.toggleLog}>{state.showLog ? "Hide" : "Show"} log
                </Button>
                {log}
            </MuiThemeProvider>

        );
    }
}


class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div style={{display: "inline-block"}}>
                        <ConnectButton/>
                        <PingButton/>
                        <PingButton type="ping_block"/>
                        <PingButton type="ping_tx"/>
                    </div>
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
