import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Button, Row, Col, Input, message, Checkbox } from 'antd';
import SockJsClient from 'react-stomp';
// import io from 'socket.io-client';

import HttpRequest from '../../utils/HttpRequest';

// let SockJS = require('sockjs');
// let Stomp = require('stomp-client');

const styles = theme => ({
    gridStyle: {
        width: '25%',
        textAlign: 'center',
    },
    actionButton: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
    }
});

const { TextArea } = Input;

class TestView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            receiveWsMsg: true,
            wsMsg: '',
        };
    }

    componentDidMount() {
        var socket;
        let self = this;
        if (typeof (WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
        } else {
            console.log("您的浏览器支持WebSocket");
            //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接  
            //等同于socket = new WebSocket("ws://localhost:8083/checkcentersys/websocket/20");  
            socket = new WebSocket("ws://localhost:8090/websocket/20");
            //打开事件  
            socket.onopen = function () {
                console.log("Socket 已打开");
                self.displayMessage("Socket 已打开");
                //socket.send("这是来自客户端的消息" + location.href + new Date());  
            };
            //获得消息事件  
            socket.onmessage = function (msg) {
                console.log(msg.data);
                //发现消息进入    开始处理前端触发逻辑
                self.displayMessage(msg.data);
            };
            //关闭事件  
            socket.onclose = function () {
                console.log("Socket已关闭");
                self.displayMessage("Socket已关闭");
            };
            //发生了错误事件  
            socket.onerror = function () {
                alert("Socket发生了错误");
                //此时可以尝试刷新页面
                self.displayMessage("Socket发生了错误");
            }
        }

        //     let ws = new WebSocket('ws://118.190.211.171:15674/ws');
        //   let client = Stomp.over(ws);
        //   client.debug = function(e) {
        //   };
        //   // default receive callback to get message from temporary queues
        //   client.onreceive = function(m) {
        //   }
        //   var on_connect = function(x) {
        //       let id = client.subscribe("/queue/test", function(m) {
        //         // reply by sending the reversed text to the temp queue defined in the "reply-to" header
        //         // var reversedText = m.body.split("").reverse().join("");
        //         // client.send(m.headers['reply-to'], {"content-type":"text/plain"}, reversedText);
        //       });
        //   };
        //   var on_error =  function() {
        //     console.log('error');
        //   };
        //   client.connect('guest', '123456', on_connect, on_error, '/');
        // var ws = new WebSocket('ws://118.190.211.171:15674/ws');
        //   var client = Stomp.over(ws);

        //     var Stomp = require('stomp-client');
        //     var destination = '/topic/run-status';
        //     var client = new Stomp('118.190.211.171', 5672, 'user', 'pass');

        //     client.connect(function (sessionId) {
        //         client.subscribe(destination, function (body, headers) {
        //             console.log('From MQ:', body);
        //         });

        //         client.publish(destination, 'Hello World!');
        //     });

        // // 初始化 ws 对象
        // let ws = new SockJS('http://118.190.211.171:5672/stomp');

        // // 获得Stomp client对象
        // let client = Stomp.over(ws);

        // // SockJS does not support heart-beat: disable heart-beats
        // client.heartbeat.outgoing = 0;
        // client.heartbeat.incoming = 0;
        // // 定义连接成功回调函数
        // var on_connect = function (x) {
        //     //data.body是接收到的数据
        //     client.subscribe("/topic.run-status", function (data) {
        //         var msg = data.body;
        //         console.log("---> 收到数据：" + msg);
        //     });
        // };

        // // 定义错误时回调函数
        // var on_error = function () {
        //     console.log('error');
        // };

        // // 连接RabbitMQ
        // client.connect('guest', 'guest', on_connect, on_error, '/');
        // console.log(">>>连接上http://118.190.211.171:5672/stomp");
    }

    displayMessage = (message) => {
        const { wsMsg, receiveWsMsg } = this.state;
        if (!receiveWsMsg)
            return;
        let newMsg = message + "\n" + wsMsg;
        this.setState({ wsMsg: newMsg });
    }

    getAllUsersCB = (data) => {
        console.log('getAllUsersCB payload:');//输出返回的数据
        console.log(data.payload);//输出返回的数据
        this.setState({ response: JSON.stringify(data.payload) });
    }
    getAllUsers() {
        HttpRequest.asyncGet(this.getAllUsersCB, '/users/all');
    }

    getPayloadCB = (data) => {
        console.log('getPayloadCB payload:');//输出返回的数据
        console.log(data.payload);//输出返回的数据
        this.setState({ response: JSON.stringify(data.payload) });
    }
    getUserByUuid() {
        let uuid = document.getElementById('test-params').value;
        if (uuid.length === 0) {
            message.error("请输入用户 UUID，例如：19c801a4-b0b5-4693-a85a-013bc4c5ab20");
            return;
        }

        HttpRequest.asyncGet(this.getPayloadCB, '/users/user-by-uuid', { uuid });
    }

    getUserByAccount() {
        let account = document.getElementById('test-params').value;
        if (account.length === 0) {
            message.error("请输入用户账号，例如：acc1 或 ytwei 或 ... ");
            return;
        }

        HttpRequest.asyncGet(this.getPayloadCB, '/users/user-by-account', { account });
    }

    onChangeCheckReceiveMQ = (e) => {
        this.setState({ receiveWsMsg: e.target.checked });
    }

    // onMessageReceive = (msg) => {
    //     console.log(msg);
    // }
    // onMqConnect = () => {
    //     console.log("onMqConnect");
    // }

    render() {
        const { classes } = this.props;
        const { response, wsMsg, receiveWsMsg } = this.state;
        const wsSourceUrl = window.location.protocol + "//" + window.location.host + "/websocket";
        return (
            <div>
                <Row>
                    <Input addonBefore="参数" placeholder="请输入参数" id="test-params" />
                </Row>
                <Row>
                    <Button className={classes.actionButton} onClick={this.getAllUsers.bind(this)}>所有用户</Button>
                    <Button className={classes.actionButton} onClick={this.getUserByUuid.bind(this)}>UUID ==> 用户</Button>
                    <Button className={classes.actionButton} onClick={this.getUserByAccount.bind(this)}>账号 ==> UUID</Button>
                    {/* <Button onClick={this.getAllUsers.bind(this)}>所有用户</Button> */}
                </Row>
                <Row>
                    <TextArea value={response} rows={6}></TextArea>
                </Row>
                <Row>
                    {/* <SockJsClient url={wsSourceUrl} topics={[]}
                        onMessage={this.onMessageReceive} 
                        // ref={(client) => { this.clientRef = client }}
                        onConnect={this.onMqConnect}
                        onDisconnect={() => { this.setState({ clientConnected: false }) }}
                        debug={false} /> */}
                    {/* <SockJsClient url='http://localhost:8090/websocket' topics={['/111']}
                        onConnect={this.onMqConnect} 
                        onMessage={this.onMqMessage}
                        // onMessage={(msg) => { console.log(msg); }}
                        ref={(client) => { this.clientRef = client }} /> */}
                    <Checkbox checked={receiveWsMsg} onChange={this.onChangeCheckReceiveMQ}>接收MQ消息</Checkbox>
                    <TextArea value={wsMsg} rows={6}></TextArea>
                </Row>
                {/* <Row>
                    <Col span={6}>
                        <Button onClick={this.getUserByUuid.bind(this)}>UUID ==> 用户</Button>
                    </Col>
                    <Col span={16}>
                    </Col>
                    <TextArea value={this.state.response} rows={4}></TextArea>
                </Row> */}
            </div>
        );
    }
}

TestView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(TestView);