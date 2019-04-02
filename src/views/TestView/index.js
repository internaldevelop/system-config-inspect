import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Button, Row, Col, Input, message } from 'antd'

import HttpRequest from '../../utils/HttpRequest'

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
        };
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

        HttpRequest.asyncGet(this.getPayloadCB, '/users/user-by-uuid', {uuid} );
    }

    getUserByAccount() {
        let account = document.getElementById('test-params').value;
        if (account.length === 0) {
            message.error("请输入用户账号，例如：acc1 或 ytwei 或 ... ");
            return;
        } 

        HttpRequest.asyncGet(this.getPayloadCB, '/users/user-by-account', {account} );
    }

    render() {
        const { classes } = this.props;
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
                    <TextArea value={this.state.response} rows={6}></TextArea>
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