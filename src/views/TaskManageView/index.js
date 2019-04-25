import React from 'react'
import PropTypes from 'prop-types';
import { Table, Icon, Button, Row, Col } from 'antd'
import { columns as Column } from './Column'
// import { TaskData } from './TaskData'
// import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { observer, inject } from 'mobx-react'
// import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
// import RunTaskIcon from '@material-ui/icons/PlayCircleOutline'
// import EditTaskIcon from '@material-ui/icons/DescriptionOutlined'

// import NewTaskPopup from './NewTaskPopup'
import TaskParamsConfig from './TaskParamsConfig'
import { GetNowTimeMyStr } from '../../utils/TimeUtils'
import HttpRequest from '../../utils/HttpRequest';


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

@inject('taskStore')
@observer
class TaskManageView extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         tasks: {},
    //         tasksDataReady: false,
    //     };
    //     this.getAllTaksCB();
    // }
    constructor(props) {
        super(props);
        this.state = {
            isNewRecord: false,
            recordChangeID: -1,
            columns: Column,
            tasks: [],
            tasksDataReady: false,
        }
        const { columns, } = this.state;
        const { classes } = this.props;
        // columns[8].render = (text, record, index) => (
        columns[9].render = (text, record, index) => (
            <div>
                <Button className={classes.actionButton} type="danger" size="small" dataindex={index} onClick={this.handleDel.bind(this)}>删除</Button>
                <Button className={classes.actionButton} size="small" type="primary" dataindex={index} onClick={this.handleEdit.bind(this)}>编辑</Button>
                <Button className={classes.actionButton} type="primary" size="small" dataindex={index} onClick={this.handleRun.bind(this)}>运行<Icon type="caret-right" /></Button>
            </div>
        )
        this.setState({ columns: columns });

        this.getAllTasks();
    }

    getAllTaksCB = (data) => {
        let taskStatus = ["无效", "有效", "运行中"];
        let tasksList = [];
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array))
            return;

        // 把响应数据转换成 table 数据
        tasksList = data.payload.map((task, index) => {
            let taskItem = {};
            taskItem.key = index + 1;
            taskItem.index = index + 1;
            taskItem.task_name = task.name;
            taskItem.run_status = [taskStatus[task.status]];
            taskItem.host_name = "待补充";
            taskItem.host_ip = "待补充";
            taskItem.host_port = "待补充";
            taskItem.os_type = "待补充";
            taskItem.os_ver = "待补充";
            taskItem.os_type = "待补充";
            taskItem.change_time = "待补充";
            return taskItem;
        })
        this.setState({
            tasks: tasksList,
            tasksDataReady: true,
        });
    }

    getAllTasks = () => {
        HttpRequest.asyncGet(this.getAllTaksCB, '/tasks/all');
    }
    handleDel = (event) => {
        // dataIndex为表中数据的行索引，配置columns时已指定属性dataIndex的数据来源
        let rowIndex = event.target.getAttribute('dataindex')
        const delDataSource = this.state.tasks;
        // rowIndex为行索引，后面的1为一次去除几行
        delDataSource.splice(rowIndex, 1);
        this.setState({
            dataSource: delDataSource,
        });
    }
    handleEdit = (event) => {
        let rowIndex = event.target.getAttribute('dataindex')
        const editDataSource = this.state.tasks[rowIndex];
        this.setState({ recordChangeID: rowIndex });

        const taskStore = this.props.taskStore;
        taskStore.setTaskAction(2);
        taskStore.setTaskProcName('编辑任务参数');
        let configItem = {
            // rowId: rowIndex,
            index: editDataSource.index,
            taskName: editDataSource['task_name'],
            hostName: editDataSource['host_name'],
            hostIP: editDataSource['host_ip'],
            hostPort: editDataSource['host_port'],
            osType: editDataSource['os_type'],
            osVer: editDataSource['os_ver'],
        };
        taskStore.initTaskParams(configItem);

        this.props.taskStore.switchShow(true);
    }
    handleRun = (event) => {
        // let rowIndex = event.target.getAttribute('dataindex')
        // const DelDataSource = this.state.taskRecordData;

    }
    handleNewTask = (event) => {
        const taskStore = this.props.taskStore;
        taskStore.setTaskAction(1);
        taskStore.setTaskProcName('新建任务');
        let configItem = {
            taskName: '新建任务',
            taskDesc: '',
            hostName: '本机',
            hostIP: '127.0.0.1',
            hostPort: '8192',
            loginUser: 'root',
            loginPwd: '',
            osType: 'Ubuntu',
            osVer: 'V16.0',
        };
        taskStore.initTaskParams(configItem);
        this.props.taskStore.switchShow(true);
    }

    autoReaction = () => {
        let change = this.props.taskStore.taskPopupShow;
        console.log("==================autoReaction: " + change);
    }


    addTaskData = () => {
        const { tasks } = this.state;
        const configItem = this.props.taskStore.configItem;
        tasks.unshift({
            key: tasks.length + 1,
            index: (tasks.length + 1).toString(),
            task_name: configItem.taskName,
            run_status: ['已完成'],
            host_name: configItem.hostName,
            host_ip: configItem.hostIP,
            host_port: configItem.hostPort,
            os_type: configItem.osType,
            os_ver: configItem.osVer,
            change_time: GetNowTimeMyStr(),
        });
        this.props.taskStore.clearStatus();
    }

    editTaskParams = () => {
        const { tasks, recordChangeID } = this.state;
        const configItem = this.props.taskStore.configItem;

        let record = tasks[recordChangeID];
        record.task_name = configItem.taskName;
        record.host_name = configItem.hostName;
        record.host_ip = configItem.hostIP;
        record.host_port = configItem.hostPort;
        record.os_type = configItem.osType;
        record.os_ver = configItem.osVer;
        record.change_time = GetNowTimeMyStr();
        this.props.taskStore.clearStatus();
    }

    render() {
        const { columns, tasks } = this.state;
        let isAdded = this.props.taskStore.status.isAdded;
        if (isAdded)
            this.addTaskData();
        let isChanged = this.props.taskStore.status.isChanged;
        if (isChanged)
            this.editTaskParams();

        // var taskParamsConfig = new TaskParamsConfig;
        return (
            <div>
                <Row>
                    <Col span={8}><Typography variant="h6">任务管理</Typography></Col>
                    <Col span={8} offset={8} align="right"><Button type="primary" size="large" onClick={this.handleNewTask.bind(this)}><Icon type="plus-circle-o" />新建任务</Button></Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={tasks}
                    bordered={true}
                    scroll={{ x: 1600, y: 400 }}
                    // style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', }}
                    pagination={{
                        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                        pageSizeOptions: ['10', '20', '30', '40'],
                        defaultPageSize: 10,
                        showQuickJumper: true,
                        showSizeChanger: true,
                    }}
                />
                {/* {taskParamsConfig} */}
                <TaskParamsConfig id="TaskParamsConfig" />
            </div>
        )
    }
}


TaskManageView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(TaskManageView);
