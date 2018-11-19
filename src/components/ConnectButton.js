import React, {Component} from "react";
import {blockSub, connect as wsConnect, disconnect as wsDisconnect, txSub} from "../redux/actions";
import Button from "@material-ui/core/Button/Button";
import {MuiThemeProvider} from "@material-ui/core";
import {connect} from "react-redux";
import muiTheme from "./muiTheme";

class ConnectButton extends Component {

    connect = () => {
        this.props.wsConnect(() => {
            this.props.txSub();
            this.props.blockSub()
        });
    };

    disconnect = () => {
        this.props.wsDisconnect()
    };

    render() {
        let button;

        // conditional render to show user the state of connection
        if (this.props.isConnecting) {
            button = <Button variant="outlined" disabled>Connecting...</Button>
        } else if (this.props.isConnected) {
            button = <Button variant="outlined" color={"secondary"} onClick={this.disconnect}>Disconnect</Button>
        } else {
            button = <Button variant="outlined" color={"primary"} onClick={this.connect}>Connect</Button>
        }
        return (
            <div>
                <MuiThemeProvider theme={muiTheme}>
                    {button}
                </MuiThemeProvider>
            </div>
        );
    }
}


let mapStateToProps = state => {
    return {
        isConnecting: state.isConnecting,
        isConnected: state.isConnected
    }
};

export default connect(
    mapStateToProps,
    {wsConnect, wsDisconnect, txSub, blockSub}
)(ConnectButton);