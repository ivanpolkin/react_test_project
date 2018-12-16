import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowAltCircleRight} from "@fortawesome/free-solid-svg-icons";
import {faBtc} from "@fortawesome/free-brands-svg-icons";
import CSSTransition from "react-addons-css-transition-group";

class LogContent extends Component {
    componentDidMount() {
        this.scrollToTop();
    }

    componentDidUpdate() {
        this.scrollToTop();
    }

    scrollToTop() {
        if (this.props.logAutoScroll)
            this.log.scrollTop = 0;
    }

    render() {
        let state = this.props;
        let storeMessages = state.messages.reverse();
        let messages = [];
        for (let i in storeMessages) {
            let obj = storeMessages[i];
            let key = obj[0];
            let msg = obj[1];

            let messageElement;

            if (msg.type === 'conn') {
                messageElement = <div><b>Connection {msg.status}.</b></div>
            } else if (msg.type === 'utx') {
                let from = [];
                for (let j = 0; j < msg.from.length; j++) {
                    let f = msg.from[j];
                    from.push(<div key={j}>{f}</div>);
                }

                let to = [];
                for (let j = 0; j < msg.to.length; j++) {
                    let t = msg.to[j];
                    to.push(<div key={j}>{t}</div>);
                }

                messageElement =
                    <div>
                        <div className={"message-container"}>
                            <div>
                                <b> <a href={"https://www.blockchain.com/btc/tx/" + msg.hash} target="_blank"
                                       rel="noopener noreferrer">Transaction</a>&nbsp;<FontAwesomeIcon
                                    icon={faBtc}/> {msg.value.toFixed(8)}
                                </b>
                            </div>
                            <div>{from}</div>
                            <div className={'icon'}><FontAwesomeIcon icon={faArrowAltCircleRight} color={"green"}
                                                                     style={{margin: '0 10px'}}/></div>
                            <div>{to}</div>
                        </div>
                        <hr className={"divider"}/>
                    </div>;
            }
            else if (msg.type === 'block') {
                messageElement = <div>
                    <b> New Block <a href={"https://www.blockchain.com/btc/block/" + msg.hash}
                                     rel="noopener noreferrer"
                                     target="_blank">#{msg.n}</a> </b> was found
                </div>
            } else if (msg.type === 'pong') {
                messageElement = <div><b>pong</b></div>
            }
            let time = msg.time;
            let message = <CSSTransition key={key}
                                         transitionName={"MessageAppearTransition"}
                                         transitionAppear={true}
                                         transitionAppearTimeout={250}
                                         transitionLeaveTimeout={0}
                                         transitionEnterTimeout={0}
            >
                <div style={{"overflowWrap": "break-word"}}>
                    <div>{time}</div>
                    {messageElement}<br/>
                </div>
            </CSSTransition>;
            messages.push(message);

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
