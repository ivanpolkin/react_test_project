import React, {Component} from "react";
import {blockSub, blockUnsub} from "../redux/actions";
import {MuiThemeProvider} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import {connect} from "react-redux";
import muiTheme from "./muiTheme";

class SubNewBlocksButton extends Component {

    handleClick = () => {
        if (!this.props.blocks_sub) {
            this.props.blockSub();
        } else {
            this.props.blockUnsub();
        }
    };

    render() {
        let disabled = !this.props.isConnected;

        return (
            <div>
                <MuiThemeProvider theme={muiTheme}>
                    <Button id={this.type}
                            className={"blocks-button"}
                            variant={"outlined"}
                            color={this.props.blocks_sub ? "secondary" : "primary"}
                            onClick={this.handleClick} disabled={disabled}>
                        {this.props.blocks_sub ? 'Unsubscribe from' : 'Subscribe to'} new Blocks
                    </Button>
                </MuiThemeProvider>
            </div>
        );
    }
}

let mapStateToProps = state => {
    return {
        isConnected: state.isConnected,
        blocks_sub: state.blocks_sub,
    }
};

export default connect(
    mapStateToProps,
    {blockSub, blockUnsub}
)(SubNewBlocksButton);
