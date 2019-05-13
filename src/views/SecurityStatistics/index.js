import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Table, Icon, Button, Row, Col, Select } from 'antd'
// import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react'

import PolicyStatisticsBar from './PolicyStatisticsBar'
import PolicyStatisticsData from './PolicyStatisticsData'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

const Option = Select.Option;

class SecurityStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selVal: 1,
        }
    }

    handleChange = (value) => {
        const { selVal } = this.state;
        this.setState({
            selVal:value,
        });
        console.log(selVal);
    }
    
    render() {
        const { columns, resultRecordData } = this.state;
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Select defaultValue='1' style={{ width: 200 }} onChange={this.handleChange}>
                            <Option value='1'>系统补丁安装统计</Option>
                            <Option value='2'>系统服务分析统计</Option>
                            <Option value='3'>系统文件安全防护分析统计</Option>
                            <Option value='4'>用户账号配置分析统计</Option>
                            <Option value='5'>口令策略配置分析统计</Option>
                            <Option value='6'>网络通信配置分析统计</Option>
                            <Option value='7'>日志审计统计</Option>
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <PolicyStatisticsData code={this.state.selVal}/>
                    </Col>
                </Row>
                {/* <Row>
                    <Col span={24}>
                        <PolicyStatisticsBar code={this.state.selVal}/>
                    </Col>
                </Row> */}
            </div>
        );

    }
}

SecurityStatistics.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SecurityStatistics);