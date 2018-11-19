import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";

class LogContent extends Component {
    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        if (this.props.logAutoScroll)
            this.log.scrollTop = this.log.scrollHeight;
    }

    render() {
        let state = this.props;
        let storeMessages = state.messages;
        let messages = [];
        for (let i in storeMessages) {
            let obj = storeMessages[i];
            let key = obj[0];
            let msg = obj[1];

            let messageElement;

            if (msg.type === 'conn') {
                messageElement = <div><b>Connection {msg.status}.</b></div>
            } else if (msg.type === 'utx')
                messageElement = <div>
                    <b>
                        <a href={"https://www.blockchain.com/btc/tx/" + msg.hash} target="_blank"
                           rel="noopener noreferrer">Transaction</a> of {msg.value.toFixed(8)} BTC
                    </b>
                    {/*<div><b>Hash:</b> </div>*/}
                    <div><b>From:</b> {msg.from.join(', ')}</div>
                    <div><b>To:</b> {msg.to.join(', ')}</div>
                </div>;
            else if (msg.type === 'block') {
                messageElement = <div>
                    <b>
                        New Block <a href={"https://www.blockchain.com/btc/block/" + msg.hash}
                                     rel="noopener noreferrer"
                                     target="_blank">#{msg.n}</a>
                    </b> was found
                </div>
            } else if (msg.type === 'pong') {
                messageElement = <div><b>pong</b></div>
            }
            let time = msg.time;
            messages.push(<div key={key} style={{"overflowWrap": "break-word"}}>
                <div>{time}</div>
                {messageElement}<br/>
            </div>);
        }
        return <div id="log" ref={(el) => this.log = el}>{messages}</div>;
    }
}

let mapStateToProps = state => {
    return {
        messages: state.messages,
        logAutoScroll: state.logAutoScroll,
    }
};

export default connect(
    mapStateToProps,
    {}
)(LogContent);
