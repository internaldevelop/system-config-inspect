import React from 'react'
import { Table, Icon, Button, Row, Col } from 'antd'
import { columns as Column } from './Column'
import { TaskData } from './TaskData'
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import NewTaskDialog from '../../pages/task-manage/NewTaskDialog'
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import RunTaskIcon from '@material-ui/icons/PlayCircleOutline'
import EditTaskIcon from '@material-ui/icons/DescriptionOutlined'

import NewTaskPopup from './NewTaskPopup'


const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
    actionButton: {
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0,
        marginTop: 0,
    },
    runButton: {
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0,
        marginTop: 0,
        backgroundColor: "green",
    },
});

class TaskManageView extends React.Component {
    handleDel = (event) => {
        // dataIndex为表中数据的行索引，配置columns时已指定属性dataIndex的数据来源
        let rowIndex = event.target.getAttribute('dataIndex')
        const DelDataSource = this.state.taskRecordData;
        // rowIndex为行索引，后面的1为一次去除几行
        DelDataSource.splice(rowIndex, 1);
        this.setState({
            dataSource: DelDataSource,
        });
    }
    handleEdit = (event) => {
        let rowIndex = event.target.getAttribute('dataIndex')
        const DelDataSource = this.state.taskRecordData;

    }
    handleRun = (event) => {
        let rowIndex = event.target.getAttribute('dataIndex')
        const DelDataSource = this.state.taskRecordData;

    }
    handleNewTask = (event) => {
        this.setState({ newTaskVisible: true })
    }
    constructor(props) {
        super(props);
        this.state = {
            columns: Column,
            taskRecordData: TaskData,
            newTaskVisible: false,
        }
        const { columns, } = this.state;
        const { classes } = this.props;
        columns[4].render = (text, record, index) => (
            <div>
                <Button className={classes.actionButton} type="danger" size="small" dataIndex={index} onClick={this.handleDel.bind(this)}>删除</Button>
                <Button className={classes.actionButton} size="small" type="primary" dataIndex={index} onClick={this.handleEdit.bind(this)}>编辑</Button>
                <Button className={classes.actionButton} type="primary" size="small" dataIndex={index} onClick={this.handleRun.bind(this)}>运行<Icon type="caret-right" /></Button>
            </div>
        )
        this.setState({ columns: columns });
    }
    render() {
        const { columns, taskRecordData, newTaskVisible } = this.state;
        return (
            <div>
                <Row>
                    <Col span={8}><Typography variant="h6">任务管理</Typography></Col>
                    <Col span={8} offset={8} align="right"><Button type="primary" size="large" onClick={this.handleNewTask.bind(this)}><Icon type="plus-circle-o" />新建任务</Button></Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={taskRecordData}
                    bordered={true}
                    scroll={{ x: 1300, y: 400 }}
                    pagination={{
                        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                        pageSizeOptions: ['10', '20', '30', '40'],
                        defaultPageSize: 10,
                        showQuickJumper: true,
                        showSizeChanger: true,
                    }}
                />
                <NewTaskPopup visible={newTaskVisible} />
            </div>
        )
    }
}

export default withStyles(styles)(TaskManageView);
