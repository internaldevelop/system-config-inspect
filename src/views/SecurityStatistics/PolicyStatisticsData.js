import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import HttpRequest from '../../utils/HttpRequest';

import { Table, Icon, Button, Row, Col, Tabs, Input } from 'antd'

const TabPane = Tabs.TabPane;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

const columns = [
    {
        title: '序号', width: 90, dataIndex: 'index', key: 'index',
        sorter: (a, b) => a.index - b.index,
    },
    // {
    //     title: '检测任务名称', width: 150, dataIndex: 'task_name', key: 'task_name',
    //     sorter: (a, b) => a.task_name.localeCompare(b.task_name, "zh"),
    // },
    // {
    //     title: '任务号', width: 80, dataIndex: 'task_id', key: 'task_id',
    //     sorter: (a, b) => a.task_id.localeCompare(b.task_id, "zh"),
    // },
    // {
    //     title: '检测目标', width: 100, dataIndex: 'target_name', key: 'target_name',
    //     sorter: (a, b) => a.target_name.localeCompare(b.target_name, "zh"),
    // },
    {
        title: '目标IP', width: 120, dataIndex: 'target_ip', key: 'target_ip',
        sorter: (a, b) => a.target_ip.localeCompare(b.target_ip, "zh"),
    },
    {
        title: '未安装漏洞数', width: 150, dataIndex: 'patch_num', key: 'patch_num',
        sorter: (a, b) => a.patch_num.localeCompare(b.patch_num, "zh"),
    },
    {
        title: '结果报告', dataIndex: 'results', key: 'results',
        sorter: (a, b) => a.results.localeCompare(b.results, "zh"),
    },
    // {
    //     title: '问题类型', width: 150, dataIndex: 'risk_type', key: 'risk_type',
    //     sorter: (a, b) => a.risk_type.localeCompare(b.risk_type, "zh"),
    // },
    // {
    //     title: '问题描述', width: 150, dataIndex: 'risk_desc', key: 'risk_desc',
    // },
    // {
    //     title: '危害等级', width: 100, dataIndex: 'risk_level', key: 'risk_level',
    //     sorter: (a, b) => a.risk_level.localeCompare(b.risk_level, "zh"),
    // },
];

class PolicyStatisticsData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: columns,
            resultRecordData: '',
            code:1,
        }
        const {code} = this.props; 
		this.getTasksResults(code);
    }
    
    // componentWillReceiveProps周期是存在期用改变的props
    componentWillReceiveProps(nextProps) {
        const newCode = nextProps.code
        this.getTasksResults(newCode);  // 刷新页面
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
                patch_num: result[i].patch_num + '',  // int 不支持排序
                results: result[i].results,

            })
        }
        return listData;
    }
    
    getResultsCB = (data) => {
        this.setState({
            resultRecordData: this.generateResultList(data.payload),
        });
    }

    getTasksResults(code) {
        this.setState({
            resultRecordData: [],
        });
        HttpRequest.asyncGet(this.getResultsCB, '/policies/statistics-report', {code: code});
    }
    
    callback = (key) => {
        console.log(key);
    }

    rowDetails = (record) => {
        return (
            <Tabs defaultActiveKey="1" onChange={this.callback} >
                <TabPane tab="建议方案" key="1">{record.solution}</TabPane>
            </Tabs>
        );
    }

    render() {
        const { columns, resultRecordData } = this.state;
        const { classes } = this.props;
        return (
            <Table
                columns={columns}
                dataSource={resultRecordData}
                bordered={true}
                scroll={{ x: 1600, y: 330 }}
                expandedRowRender={record => this.rowDetails(record)}
                pagination={{
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                    pageSizeOptions: ['10', '20', '30', '40'],
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                }}
            />
        )

    }
}

PolicyStatisticsData.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(PolicyStatisticsData);