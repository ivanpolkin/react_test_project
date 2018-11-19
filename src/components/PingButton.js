import React, {Component} from "react";
import {send as wsSend} from "../redux/actions";
import {MuiThemeProvider} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import {connect} from "react-redux";
import muiTheme from "./muiTheme";

class PingButton extends Component {

    constructor(props) {
        super(props);
        this.type = this.props.type || 'ping';
    }

    handleClick = () => {
        this.props.wsSend({"op": this.type});
    };

    render() {
        let disabled = !this.props.isConnected || (this.type !== 'ping' && (this.props.unconfirmed_sub || this.props.blocks_sub || this.props.addr_sub));

        return (
            <MuiThemeProvider theme={muiTheme}>
                <Button id={this.type} variant={"outlined"} color={"primary"} onClick={this.handleClick}
                        disabled={disabled}>
                    {this.type}
                </Button>
            </MuiThemeProvider>
        );
    }
}

let mapStateToProps = state => {
    return {
        isConnected: state.isConnected,
        unconfirmed_sub: state.unconfirmed_sub,
        blocks_sub: state.blocks_sub,
        addr_sub: state.addr_sub,
    }
};

export default connect(
    mapStateToProps,
    {wsSend}
)(PingButton);
