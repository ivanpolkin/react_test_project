import React, {Component} from 'react';
import './App.css';
import ConnectButton from "./components/ConnectButton";
import SubNewBlocksButton from "./components/SubNewBlocksButton";
import SubUnconfirmedButton from "./components/SubUnconfirmedButton";
import LogArea from "./components/LogArea";

import CSSTransition from 'react-addons-css-transition-group'
import connect from "react-redux/es/connect/connect";
import {clear as wsClear, toggleLog, toggleLogScroll} from "./redux/actions";
import Counters from "./components/Counters";

class App extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <CSSTransition
                transitionName={"AppearTransition"}
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionLeaveTimeout={0}
                transitionEnterTimeout={0}

            >
                <div className="App">
                    <b style={{fontSize: "20px", color: "#2196f3"}}>Blockchain online</b>
                    <div className="App-header">
                        <ConnectButton/>
                        <SubUnconfirmedButton/>
                        <SubNewBlocksButton/>
                    </div>
                    <Counters/>
                    <LogArea/>
                </div>
            </CSSTransition>

        );
    }
}

let mapStateToProps = state => {
    return {
        connectedBefore: state.connectedBefore
    }
};

export default connect(
    mapStateToProps,
    {wsClear, toggleLog, toggleLogScroll}
)(App);

