import React, {Component} from "react";
import {clear as wsClear, toggleLog, toggleLogScroll} from "../redux/actions";
import Button from "@material-ui/core/Button/Button";
import {MuiThemeProvider} from "@material-ui/core";
import muiTheme from "./muiTheme";
import {connect} from "react-redux";
import LogContent from "./LogContent";

class LogArea extends Component {

    clearLog = () => {
        this.props.wsClear();
    };

    render() {
        let state = this.props;

        let log;
        if (state.showLog) {
            log = <>
                <LogContent/>

                <Button variant={"outlined"} color={"secondary"} onClick={this.clearLog}>Clear log</Button>

            </>;
        }
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Button variant={"outlined"} color={state.showLog ? "secondary" : "primary"}
                        onClick={this.toggleLog}>{state.showLog ? "Hide" : "Show"} log
                </Button>
                {log}
            </MuiThemeProvider>

        );
    }
}

let mapStateToProps = state => {
    return {
        messages: state.messages,
        showLog: state.showLog,
        logAutoScroll: state.logAutoScroll,
    }
};

export default connect(
    mapStateToProps,
    {wsClear, toggleLog, toggleLogScroll}
)(LogArea);
