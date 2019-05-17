import React from 'react'
import PropTypes from 'prop-types';
import { Table, Icon, Button, Row, Col, Popconfirm, Progress } from 'antd'
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
import HttpRequest from '../../utils/HttpRequest';
import { actionType } from '../../global/enumeration/ActionType';
import { DeepClone, DeepCopy } from '../../utils/ObjUtils'
import { GetMainViewHeight } from '../../utils/PageUtils'
import { PushNew, DeleteElements } from '../../utils/ObjUtils'
import { stat } from 'fs';
import { taskRunStatus } from '../../global/enumeration/TaskRunStatus'

let timer1S = undefined;    // 1 秒的定时器
let timer300mS = undefined;    // 300 毫秒的定时器

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

const DEFAULT_PAGE_SIZE = 10;
@inject('taskStore')
@observer
class TaskManageView extends React.Component {
    // const DEFAULT_PAGE_SIZE = 10;
    constructor(props) {
        super(props);
        this.state = {
            recordChangeID: -1, // TODO
            columns: Column,    // 列定义
            tasks: [],          // 本页面的任务数据集合
            currentPage: 1,     // Table中当前页码（从 1 开始）
            pageSize: DEFAULT_PAGE_SIZE,
            showTaskConfig: false,  // 是否显示任务数据编辑窗口
            scrollWidth: 2000,        // 表格的 scrollWidth
            scrollHeight: 300,      // 表格的 scrollHeight
            runIndex: -1,       // 执行的任务在表格本页的索引
            runList: [],        // 执行的任务在数据源里的索引 index 集合（可以允许多个任务同时执行）
            statusList: [],     // 含多个执行中任务的状态数组
        }

        // 设置操作列的渲染
        this.redrawActionColumn();

        // 初始化运行状态列
        this.renderRunStatusColumn();

        // 从后台获取任务数据的集合
        this.getAllTasks();
    }

    componentDidMount() {
        // 增加监听器，侦测浏览器窗口大小改变
        window.addEventListener('resize', this.handleResize.bind(this));
        this.setState({ scrollHeight: GetMainViewHeight() });

        // 开启300毫秒的定时器
        timer300mS = setInterval(() => this.timer300msProcess(), 300);

        HttpRequest.asyncGet(this.getTasksRunStatusCB, '/tasks/run-status');

        // let arr = [1, 3, 5];
        // PushNew(arr, 1, 2, 3, 4, 5, 6, 7, 8);
        // DeleteElements(arr, 2, 6, 7);
    }

    componentWillUnmount() {
        // 组件卸装前，一定要移除监听器
        window.removeEventListener('resize', this.handleResize.bind(this));

        // 清除定时器
        clearInterval(timer300mS);
    }

    isRunning = (rowIndex) => {
        const { runList } = this.state;
        let dataIndex = this.transferDataIndex(rowIndex);
        return (runList.indexOf(dataIndex) >= 0);
    }

    /**
     * 从任务的UUID获取该任务在当前数据源中的索引位置
     */
    getIndexFromTaskUuid = (uuid) => {
        const { tasks } = this.state;
        for (let index in tasks) {
            if (tasks[index].uuid === uuid)
                return parseInt(index);
        }
        return -1;
    }

    /**
     * 从表格当前页的行号获取任务的执行状态数据
     */
    getTaskRunStatusFromRowIndex = (rowIndex) => {
        const { statusList, tasks } = this.state;
        let dataIndex = this.transferDataIndex(rowIndex);
        for (let index in statusList) {
            if (statusList[index].task_uuid === tasks[dataIndex].uuid)
                return statusList[index];
        }
        return null;
    }

    getTasksRunStatusCB = (data) => {
        let statusList = [];
        let runList = this.state.runList;
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array))
            return;

        // 拷贝任务执行状态的数据
        statusList = data.payload.map((status, index) => {
            // 如果任务完成100%，或者任务中断，则移除该任务
            if (status.done_rate === 100 || status.run_status === taskRunStatus.INTERRUPTED) {
                let id = this.getIndexFromTaskUuid(status.task_uuid);
                DeleteElements(runList, id);
            }
            let statusItem = DeepClone(status);
            return statusItem;
        })

        // 更新 任务状态
        this.setState({ statusList });

        this.renderRunStatusColumn();
    }

    timer300msProcess = () => {
        // 获取所有运行过的任务的状态信息
        const { runList, tasks } = this.state;
        if (runList.length > 0) {
            HttpRequest.asyncGet(
                this.getTasksRunStatusCB,
                '/tasks/run-status'
            );
        }

        // 检查是否有正在执行中的任务
        // const { runList, tasks } = this.state;
        // if (runList.length > 0) {
        //     // 提取执行中任务的 UUID
        //     let uuidList = "";
        //     for (let id of runList)
        //         uuidList += tasks[id].uuid + ",";
        //     // let uuidList = runList.map((id, index) => tasks[id].uuid);
        //     // 向后台请求任务的执行状态
        //     HttpRequest.asyncGet(
        //         this.getTasksRunStatusCB,
        //         '/tasks/run-status',
        //         { uuid_list: uuidList }
        //     );
        // }
    }

    handleResize = e => {
        console.log('浏览器窗口大小改变事件', e.target.innerWidth, e.target.innerHeight);
        this.setState({ scrollHeight: GetMainViewHeight() });
    }

    /** 初始化操作列，定义渲染效果 */
    redrawActionColumn = () => {
        const { columns, runIndex } = this.state;
        const { classes } = this.props;
        if (columns.length === 0)
            return;

        // 操作列默认为最后一列
        columns[columns.length - 1].render = (text, record, index) => (
            <div>
                {this.isRunning(index) ?
                    <Button className={classes.actionButton} disabled={true} type="danger" size="small">删除</Button> :
                    <Popconfirm title="确定要删除该任务吗？" onConfirm={this.handleDel(index).bind(this)} okText="确定" cancelText="取消">
                        <Button className={classes.actionButton} type="danger" size="small">删除</Button>
                    </Popconfirm>
                }
                <Button className={classes.actionButton} disabled={this.isRunning(index)} type="primary" size="small" onClick={this.handleEdit(index).bind(this)}>编辑</Button>
                <Button className={classes.actionButton} disabled={this.isRunning(index)} type="primary" size="small" onClick={this.handleRun(index).bind(this)}>运行<Icon type="caret-right" /></Button>
            </div>
        )
        this.setState({ columns });
    }

    renderRunStatusColumn = () => {
        const { columns } = this.state;
        let progressSize = 40;

        // TODO: 需改进 columns[2] 的写法
        columns[2].render = (text, record, index) => {
            let runStatus = this.getTaskRunStatusFromRowIndex(index);
            if (runStatus === null) {
                return (<Progress type="circle" percent={0} width={progressSize} format={() => '空闲'} />)
            } else {
                return (
                    <div>
                        {
                            runStatus.run_status === taskRunStatus.INTERRUPTED ?
                                <Progress type="circle" width={progressSize} percent={runStatus.done_rate} status="exception" /> :
                                <Progress type="circle" width={progressSize} percent={runStatus.done_rate} />
                        }
                    </div>
                )
            }
        }

        this.setState({ columns });
    }

    /** 从后台请求所有任务数据，请求完成后的回调 */
    getAllTaksCB = (data) => {
        let tasks = [];
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array))
            return;

        // 从响应数据生成 table 数据源
        tasks = data.payload.map((task, index) => {
            let taskItem = DeepClone(task);
            // antd 表格需要数据源中含 key 属性
            taskItem.key = index + 1;
            // 表格中索引列（后台接口返回数据中没有此属性）
            taskItem.index = index + 1;
            // taskItem.status = [task.status];
            return taskItem;
        })

        // 更新 tasks 数据源
        this.setState({ tasks });
    }

    /** 从后台请求所有任务数据 */
    getAllTasks = () => {
        // 从后台获取任务的详细信息，含任务表的数据和关联表的数据
        HttpRequest.asyncGet(this.getAllTaksCB, '/tasks/all-task-details');
    }

    /** 向后台发起删除任务数据请求的完成回调 
     *  因调用请求函数时，默认参数只返回成功请求，所以此处不需要判断后台是否成功删除任务
    */
    deleteTaskCB = (dataIndex) => (data) => {
        const { tasks } = this.state;
        // rowIndex 为行索引，第二个参数 1 为一次去除几行
        tasks.splice(dataIndex, 1);
        this.setState({ tasks });
    }

    /**
     * 将数据所在页的行索引转换成整个数据列表中的索引
     * @param {} rowIndex 数据在表格当前页的行索引
     */
    transferDataIndex(rowIndex) {
        // currentPage 为 Table 中当前页码（从 1 开始）
        const { currentPage, pageSize } = this.state;
        let dataIndex = (currentPage - 1) * pageSize + rowIndex;
        return dataIndex;
    }

    /** 处理删除操作
     * rowIndex 为当前页所含记录中的第几行（base:0），不是所有记录中的第几条
     * 需要根据当前 pagination 的属性，做变换
     */
    handleDel = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);

        // 向后台提交删除该任务
        const { tasks } = this.state;
        HttpRequest.asyncPost(this.deleteTaskCB(dataIndex), '/tasks/remove', { uuid: tasks[dataIndex].task_uuid });
    }

    /** 处理编辑操作 */
    handleEdit = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);

        // 获取需要编辑的任务数据
        const taskItem = this.state.tasks[dataIndex];

        // 利用仓库保存任务操作类型、操作窗口名称、任务数据
        const taskStore = this.props.taskStore;
        taskStore.setTaskAction(actionType.ACTION_EDIT);
        taskStore.setTaskProcName('编辑任务参数');
        taskStore.initTaskItem(taskItem);

        // 保存待编辑的数据索引，并打开任务数据操作窗口
        this.setState({ recordChangeID: dataIndex, showTaskConfig: true });
    }

    runTaskCB = (rowIndex) => (data) => {
        let runList = this.state.runList;
        // 记录执行状态中的任务索引
        PushNew(runList, this.transferDataIndex(rowIndex));

        // 通过记录运行任务的索引，设置操作按钮为 disabled
        this.setState({ runList });

        // 重新初始化操作列，以使按钮失效
        this.redrawActionColumn();

        // 
    }

    /** 处理运行任务的操作 */
    handleRun = (rowIndex) => (event) => {
        console.log("===> handleRun", this.state.runList);
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);

        // 向后台提交任务执行
        const { tasks } = this.state;
        // let params = {};
        // Object.assign(params, { uuid: tasks[dataIndex].task_uuid });
        // HttpRequest.asyncPost(this.runTaskCB(rowIndex), '/tasks/execute', params);
        HttpRequest.asyncPost(this.runTaskCB(rowIndex), '/tasks/execute', { uuid: tasks[dataIndex].uuid });

    }

    /** 处理新建任务 */
    handleNewTask = (event) => {
        const taskStore = this.props.taskStore;
        // 在任务仓库中保存操作类型、窗口名称和缺省任务数据
        taskStore.setTaskAction(actionType.ACTION_NEW);
        taskStore.setTaskProcName('新建任务');
        let taskItem = {
            name: '新建任务',
            description: '',
            asset_name: '本机',
            asset_ip: '127.0.0.1',
            asset_port: '8192',
            asset_login_user: 'root',
            asset_login_pwd: 'root',
            asset_os_type: 'Ubuntu',
            asset_os_ver: 'V16.0',
            policy_groups: [],
        };
        taskStore.initTaskItem(taskItem);

        // 打开任务数据操作窗口
        this.setState({ showTaskConfig: true });
    }

    /** 新建/编辑任务窗口完成的回调处理 */
    taskActionCB = (isOk, task) => {
        const taskStore = this.props.taskStore;
        if (isOk) {
            if (taskStore.taskAction === actionType.ACTION_NEW) {
                this.addTaskData();
            } else if (taskStore.taskAction === actionType.ACTION_EDIT) {
                this.editTaskParams();
            }
        }

        // 关闭任务数据操作窗口
        this.setState({ showTaskConfig: false });
    }

    /** 添加任务数据到前端缓存的数据列表中 */
    addTaskData = () => {
        const { tasks } = this.state;
        // 从仓库中取出新建的任务对象，设置 key 和 index 属性
        const taskItem = this.props.taskStore.taskItem;
        taskItem.key = tasks.length + 1;
        taskItem.index = (tasks.length + 1).toString();

        // 将新建任务对象添加到任务数据源中（数据源的首位）
        tasks.unshift(taskItem);
    }

    /** 确认修改任务后，在任务列表中修改指定数据 */
    editTaskParams = () => {
        const { tasks, recordChangeID } = this.state;
        const taskItem = this.props.taskStore.taskItem;

        // 从仓库中取出编辑后的任务对象，深拷贝到源数据中
        let record = tasks[recordChangeID];
        DeepCopy(record, taskItem);
    }

    /** 处理页面变化（页面跳转/切换/每页记录数变化） */
    handlePageChange = (currentPage, pageSize) => {
        this.setState({ currentPage, pageSize });
    }

    render() {
        const { columns, tasks, showTaskConfig, scrollWidth, scrollHeight } = this.state;
        let self = this;

        // var taskParamsConfig = new TaskParamsConfig;
        return (
            <div>
                <Row>
                    <Col span={8}><Typography variant="h6">任务管理</Typography></Col>
                    <Col span={8} offset={8} align="right"><Button type="primary" size="large" onClick={this.handleNewTask.bind(this)}><Icon type="plus-circle-o" />新建任务</Button></Col>
                </Row>
                <Table
                    id="tasksListTable"
                    columns={columns}
                    dataSource={tasks}
                    bordered={true}
                    scroll={{ x: scrollWidth, y: scrollHeight }}
                    rowKey={record => record.task_uuid}
                    // style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', }}
                    pagination={{
                        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                        pageSizeOptions: [DEFAULT_PAGE_SIZE.toString(), '20', '30', '40'],
                        defaultPageSize: DEFAULT_PAGE_SIZE,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange(current, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                            self.handlePageChange(current, pageSize);
                        },
                        onChange(current, pageSize) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                            self.handlePageChange(current, pageSize);
                        },
                    }}
                />
                {showTaskConfig && <TaskParamsConfig id="TaskParamsConfig" actioncb={this.taskActionCB} />}
            </div>
        )
    }
}


TaskManageView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(TaskManageView);
