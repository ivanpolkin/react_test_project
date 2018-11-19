import React, {Component} from "react";
import {MuiThemeProvider} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import muiTheme from "./muiTheme";
import {connect} from "react-redux";
import {txSub, txUnsub} from "../redux/actions";

class SubUnconfirmedButton extends Component {

    handleClick = () => {
        if (!this.props.unconfirmed_sub) {
            this.props.txSub();
        } else {
            this.props.txUnsub();
        }
    };

    render() {
        let disabled = !this.props.isConnected || this.props.addr_sub;
        let transactions;
        if (this.props.transactionsCount)
            transactions = <span
                style={{fontSize: "18 !important"}}><b>{this.props.transactionsSum.toFixed(8)}</b> BTC in <b>{this.props.transactionsCount}</b> transactions</span>;
        else if (this.props.unconfirmed_sub)
            transactions = "Waiting for new transactions...";

        return (
            <div>
                <MuiThemeProvider theme={muiTheme}>
                    <Button id={this.type} variant={"outlined"}
                            color={this.props.unconfirmed_sub ? "secondary" : "primary"}
                            onClick={this.handleClick} disabled={disabled}>
                        {this.props.unconfirmed_sub ? 'Unsubscribe from' : 'Subscribe to'} Unconfirmed transactions
                    </Button>
                </MuiThemeProvider>

                <div style={{display: 'inline'}}>{transactions}</div>
            </div>
        );
    }
}

let mapStateToProps = state => {
    return {
        isConnected: state.isConnected,
        transactionsCount: state.transactionsCount,
        transactionsSum: state.transactionsSum,
        unconfirmed_sub: state.unconfirmed_sub,
        addr_sub: state.addr_sub,
    }
};

export default connect(
    mapStateToProps,
    {txSub, txUnsub}
)(SubUnconfirmedButton);
