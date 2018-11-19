import React, {Component} from "react";
import {MuiThemeProvider} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import {connect} from "react-redux";
import {addrSub, addUnsub} from "../redux/actions";
import muiTheme from "./muiTheme";

class SubAddressButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '3422VtS7UtCvXYxoXMVp6eZupR252z85oC'
        };
    }

    handleClick = () => {
        if (!this.props.addr_sub) {
            this.props.sub(this.state.address);
        } else {
            this.props.unsub(this.state.address);
        }
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        let disabledButton = !this.props.isConnected || this.props.unconfirmed_sub;
        let disabledInput = this.props.addr_sub || !this.props.isConnected || disabledButton;
        return (
            <div>
                <MuiThemeProvider theme={muiTheme}>
                    <TextField disabled={disabledInput}
                               value={this.state.address} onChange={this.handleChange('address')} style={{width: 310}}/>
                    <Button id={this.type} variant={"outlined"} color={this.props.addr_sub ? "secondary" : "primary"}
                            onClick={this.handleClick} disabled={disabledButton}>
                        {this.props.addr_sub ? 'Unsubscribe from' : 'Subscribe to'} address
                    </Button>
                </MuiThemeProvider>
            </div>
        );
    }
}

let mapStateToProps = state => {
    return {
        addr_sub: state.addr_sub,
        unconfirmed_sub: state.unconfirmed_sub,
        isConnected: state.isConnected,
    }
};

export default connect(
    mapStateToProps,
    {sub: addrSub, unsub: addUnsub}
)(SubAddressButton);