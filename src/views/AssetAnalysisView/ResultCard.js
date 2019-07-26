import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

import { Card, Skeleton, Select, Table, Statistic, Button, Row, Col, Icon, Collapse, message, Modal } from 'antd';
import lightBlue from '@material-ui/core/colors/lightBlue';
import CheckResultDetails from './CheckResultDetails'

// import EventEmitter from 'EventEmitter';
// var EventEmitter = require('events').EventEmitter;
// let emitter = new EventEmitter();

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class ResultCard extends React.Component {
    constructor(props) {
        super(props);

        let { name, success, fail, alias, checked } = this.props;

        if (typeof (name) === undefined) name = 'unknown';
        if (typeof (alias) === undefined) alias = '未知';
        if (typeof (success) === undefined) success = 0;
        if (typeof (fail) === undefined) fail = 0;

        this.state = {
            name: name,
            alias: alias,
            success: success,
            fail: fail,
            ready: false,
            scanUuid: '',
        };
    }

    componentDidMount() {
        // 注册事件
        global.myEventEmitter.addListener('RefreshCheckResult', this.refreshResult);
        global.myEventEmitter.addListener('ClearCheckResult', this.clearResult);
    }

    componentWillUnmount() {
        // 取消事件
        global.myEventEmitter.removeListener('RefreshCheckResult', this.refreshResult);
        global.myEventEmitter.removeListener('ClearCheckResult', this.clearResult);
    }

    clearResult = (groupName) => {
        const { name } = this.state;
        if (groupName === '' || groupName === name) {
            this.setState({
                success: 0,
                fail: 0,
                ready: false,
            });
        }
    }

    refreshResult = (payload) => {
        let stats = payload.statistics;
        if (!(stats instanceof Array))
            return;

        const { name } = this.state;
        let success = 0;
        let fail = 0;
        for (let stat of stats) {
            if (stat['config_type'] === name) {
                if (parseInt(stat['risk_level']) === 0) {
                    success += parseInt(stat['count']);
                } else {
                    fail += parseInt(stat['count']);
                }
            }
        }

        this.setState({
            success: success,
            fail: fail,
            ready: true,
            scanUuid: payload.recent.uuid,
        });
    }

    handleClick = () => {
        const { name, scanUuid } = this.state;
        // message.info("handleClick：" + name);
        Modal.info({
            keyboard: true,         // 是否支持键盘 esc 关闭
            destroyOnClose: true,   // 关闭时销毁 Modal 里的子元素
            closable: false,         // 是否显示右上角的关闭按钮
            width: 730,
            content: <CheckResultDetails scanuuid={scanUuid} group={name}/>,
            onOk() {
            },
        });

    }

    getCardTitle = () => {
        const { alias, ready } = this.state;
        if (ready) {
            return (
                <Link component="button" align="center" underline="always"
                    onClick={this.handleClick}
                >{alias}</Link>
            );
        } else {
            return alias;
        }
    }

    render() {
        const { alias, success, fail, ready } = this.state;
        return (
            <div>
                <Card title={this.getCardTitle()} loading={!ready} style={{ textAlign: 'center' }}>
                    <Statistic
                        value={success}
                        valueStyle={{ fontSize: 40, color: '#3f8600', textAlign: 'center' }}
                        prefix={<Icon type="check-circle" />}
                    />
                    <Statistic
                        value={fail}
                        valueStyle={{ fontSize: 40, color: '#cf1322', textAlign: 'center' }}
                        prefix={<Icon type="warning" />}
                    />
                </Card>
            </div>
        );
    }
}

ResultCard.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(ResultCard);

