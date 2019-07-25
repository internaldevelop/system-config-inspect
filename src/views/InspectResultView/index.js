import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import HttpRequest from '../../utils/HttpRequest';
import { GetBackEndRootUrl } from '../../global/environment'
import { observer, inject } from 'mobx-react'
import { userType } from '../../global/enumeration/UserType'
import { TrimStr } from '../../utils/StringUtils'

import { Skeleton, Table, Icon, Button, Row, Col, Tabs, Input, Select } from 'antd'

import { columns as Column } from './Column'

const TabPane = Tabs.TabPane;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
    antInput: {
        width: 300,
    },
});

const Option = Select.Option;

@observer
@inject('userStore')
class InspectResultView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: Column,
            resultRecordData: '',
            inputValue: '',//输入框输入值
            selectValue: '',
        }
        this.findTasksResults();
    }

    generateResultList(result) {
        const listData = [];
        if ((typeof result === "undefined") || (result.length === 0)) {
            return listData;
        }

        for (let i = 0; i < result.length; i++) {
            listData.push({
                key: i,
                index: i + 1,
                task_name: result[i].task_name,
                task_id: result[i].task_id,
                target_name: result[i].assets_name,
                target_ip: result[i].assets_ip,
                risk_type: result[i].policy_name,
                risk_desc: result[i].description,
                risk_level: result[i].risk_level,
                solution: result[i].solutions,
            })
        }
        return listData;
    }

    getResultsCB = (data) => {
        this.setState({
            resultRecordData: this.generateResultList(data.payload),
        });
    }

    handleGetInputValue = (event) => {
        this.setState({
            inputValue: event.target.value,
        })
    };

    findTasksResults = () => {
        const { inputValue } = this.state;
        HttpRequest.asyncGet(this.getResultsCB, '/tasks/results/all', { taskNameIpType: TrimStr(inputValue) });
    };

    handleChange = (value) => {
        const { selectValue } = this.state;
        this.setState({
            selectValue: value,
        });
        console.log(selectValue);
    }

    // 导出
    exportTasksResults = () => {
        const { inputValue, selectValue } = this.state;
        window.location.href = GetBackEndRootUrl() + '/tasks/results/export?taskNameIpType=' + inputValue + '&type=' + selectValue;
    }

    callback = (key) => {
        console.log(key);
    }

    rowDetails = (record) => {
        // return <p style={{ margin: 0 }}>{record.solution}</p>;
        return (
            <Tabs defaultActiveKey="1" onChange={this.callback} >
                <TabPane tab="任务名称" key="1">{record.task_name}</TabPane>
                <TabPane tab="检测目标" key="2">{record.target_name}</TabPane>
                <TabPane tab="问题描述" key="3">{record.risk_desc}</TabPane>
                <TabPane tab="建议方案" key="4">{record.solution}</TabPane>
            </Tabs>
        );
    }

    render() {
        const { columns, resultRecordData } = this.state;
        const { classes } = this.props;
        const userStore = this.props.userStore;
        return (
            <div>
                <Skeleton loading={userStore.isAdminUser} active avatar>
                    <Row>
                        <Col span={3}><Typography variant="h6">检测结果</Typography></Col>
                        <Col span={13} align="left">
                            <Input className={classes.antInput} size="large" value={this.state.inputValue} onChange={this.handleGetInputValue} placeholder="任务名称、目标IP、问题类型" />
                            <Button className={classes.iconButton} type="primary" size="large" onClick={this.findTasksResults} ><Icon type="search" />查询</Button>
                        </Col>
                        <Col span={8} align="right">
                            <Select defaultValue='Excel' size="large" onChange={this.handleChange}>
                                <Option value='Excel'>Excel</Option>
                                <Option value='Word'>Word</Option>
                                <Option value='Pdf'>Pdf</Option>
                                <Option value='Html'>Html</Option>
                            </Select>
                            <Button className={classes.iconButton} type="primary" size="large" onClick={this.exportTasksResults} ><Icon type="export" />导出</Button>
                        </Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={resultRecordData}
                        bordered={true}
                        scroll={{ x: 1600, y: 400 }}
                        expandedRowRender={record => this.rowDetails(record)}
                        pagination={{
                            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                            pageSizeOptions: ['10', '20', '30', '40'],
                            defaultPageSize: 10,
                            showQuickJumper: true,
                            showSizeChanger: true,
                        }}
                    />
                </Skeleton>
            </div>
        )

    }
}

InspectResultView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(InspectResultView);