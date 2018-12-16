import React, {Component} from "react";
import {connect} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBtc} from "@fortawesome/free-brands-svg-icons";

class Counters extends Component {

    render() {
        let transactions;
        let transactionsSum;
        let blocks;
        blocks = <b>{this.props.blocksCount}</b>;
        transactions = <b>{this.props.transactionsCount}</b>;
        transactionsSum = <span> <b> <FontAwesomeIcon
            icon={faBtc}/> {this.props.transactionsSum ? this.props.transactionsSum.toFixed(8) : 0}
                    </b></span>;

        return (
            <div className={"counters"}>
                <span>Transactions sum: {transactionsSum}</span>
                <span>Transactions count: {transactions}</span>
                <span>Blocks count: {blocks}</span>
            </div>
        );
    }
}

let mapStateToProps = state => {
    return {
        isConnected: state.isConnected,
        blocksCount: state.blocksCount,
        transactionsCount: state.transactionsCount,
        transactionsSum: state.transactionsSum,
    }
};

export default connect(
    mapStateToProps,
    {}
)(Counters);
