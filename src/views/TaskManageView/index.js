import React from 'react'
import PropTypes from 'prop-types';
import { Table, Icon, Button, Row, Col, Popconfirm } from 'antd'
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
            isNewRecord: false, // TODO
            recordChangeID: -1, // TODO
            columns: Column,    // 列定义
            tasks: [],          // 本页面的任务数据集合
            currentPage: 1,     // Table中当前页码（从 1 开始）
            pageSize: DEFAULT_PAGE_SIZE,
            showTaskConfig: false,  // 是否显示任务数据编辑窗口
        }

        // 设置操作列的渲染
        this.initActionColumn();

        // 从后台获取任务数据的集合
        this.getAllTasks();
    }

    /** 初始化操作列，定义渲染效果 */
    initActionColumn() {
        const { columns, } = this.state;
        const { classes } = this.props;
        if (columns.length === 0)
            return;

        // 操作列默认为最后一列
        columns[columns.length - 1].render = (text, record, index) => (
            <div>
                <Popconfirm title="确定要删除该任务吗？" onConfirm={this.handleDel(index).bind(this)} okText="确定" cancelText="取消">
                    <Button className={classes.actionButton} type="danger" size="small">删除</Button>
                </Popconfirm>
                <Button className={classes.actionButton} type="primary" size="small" onClick={this.handleEdit(index).bind(this)}>编辑</Button>
                <Button className={classes.actionButton} type="primary" size="small" onClick={this.handleRun(index).bind(this)}>运行<Icon type="caret-right" /></Button>
            </div>
        )
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
        this.setState({recordChangeID: dataIndex, showTaskConfig: true});
    }

    /** 处理运行任务的操作 */
    handleRun = (rowIndex) => (event) => {
        // let rowIndex = event.target.getAttribute('dataindex')
        // const DelDataSource = this.state.taskRecordData;

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
        this.setState({showTaskConfig: true});
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
        this.setState({showTaskConfig: false});
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
        this.setState({currentPage, pageSize});
    }

    render() {
        const { columns, tasks, showTaskConfig } = this.state;
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
                    scroll={{ x: 1600, y: 400 }}
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
                { showTaskConfig && <TaskParamsConfig id="TaskParamsConfig" actioncb={this.taskActionCB}/> }
            </div>
        )
    }
}


TaskManageView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(TaskManageView);
