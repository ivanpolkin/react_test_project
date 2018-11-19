import React, {Component} from 'react';
import './App.css';
import ConnectButton from "./components/ConnectButton";
import SubAddressButton from "./components/SubAddressButton";
import SubNewBlocksButton from "./components/SubNewBlocksButton";
import PingButton from "./components/PingButton";
import SubUnconfirmedButton from "./components/SubUnconfirmedButton";
import LogArea from "./components/LogArea";


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
