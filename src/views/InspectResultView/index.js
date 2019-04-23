import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import HttpRequest from '../../utils/HttpRequest';

import { Table, Icon, Button, Row, Col, Tabs } from 'antd'

import { columns as Column } from './Column'
import { ResultData } from './ResultData'

const TabPane = Tabs.TabPane;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

class InspectResultView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: Column,
            resultRecordData: '',
        }
		this.getTasksResults();
    }

	generateResultList(result) {
        const listData = [];
        if ( (typeof result === "undefined") || (result.length === 0) ) {
            return listData;
        }
        
        for (let i = 0; i < result.length; i++) {
            listData.push({
                key: i,
                index: i+1, 
                task_name: result[i].task_name, 
                task_id: result[i].task_id, 
                target_name: result[i].assets_name, 
                target_ip: result[i].assets_ip, 
                risk_type: result[i].policie_name, 
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

    getTasksResults() {
        HttpRequest.asyncGet(this.getResultsCB, '/tasks/results/all');
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
        return (
            <div>
                <Row>
                    <Col span={8}><Typography variant="h6">检测结果</Typography></Col>
                    <Col span={8} offset={8} align="right">
                        <Button className={classes.iconButton} type="primary" size="large" ><Icon type="search" />查询</Button>
                        <Button className={classes.iconButton} type="primary" size="large" ><Icon type="export" />导出</Button>
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
            </div>
        )

    }
}

InspectResultView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(InspectResultView);