import React from 'react'
import PropTypes from 'prop-types';
import { Skeleton, Table, Icon, Button, Row, Col, Popconfirm, Progress, message } from 'antd'
import { columns as Column } from './Column'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { observer, inject } from 'mobx-react'
import ProjectParamsConfig from './ProjectParamsConfig'
import HttpRequest from '../../utils/HttpRequest';
import { actionType } from '../../global/enumeration/ActionType';
import { DeepClone, DeepCopy } from '../../utils/ObjUtils'
import { GetMainViewHeight } from '../../utils/PageUtils'
import { generateUuidStr } from '../../utils/tools'
import { taskRunStatus } from '../../global/enumeration/TaskRunStatus'
import { userType } from '../../global/enumeration/UserType'
import { sockMsgType } from '../../global/enumeration/SockMsgType'
import { errorCode } from '../../global/error';
import { eng2chn } from '../../utils/StringUtils'

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
@inject('userStore')
@inject('projectStore')
@observer
class SecurityProjectView extends React.Component {
    // const DEFAULT_PAGE_SIZE = 10;
    constructor(props) {
        super(props);
        this.state = {
            recordChangeID: -1, // TODO
            columns: Column,    // 列定义
            projects: [],          // 本页面的项目数据集合
            currentPage: 1,     // Table中当前页码（从 1 开始）
            pageSize: DEFAULT_PAGE_SIZE,
            showProjectConfig: false,  // 是否显示项目数据编辑窗口
            scrollWidth: 2000,        // 表格的 scrollWidth
            scrollHeight: 300,      // 表格的 scrollHeight
            runIndex: -1,       // 执行的任务在表格本页的索引
            runList: [],        // 执行的任务在数据源里的索引 index 集合（可以允许多个任务同时执行）
            statusList: [],     // 含多个执行中任务的状态数组
        }

        // 设置操作列的渲染
        this.redrawActionColumn();

        // 从后台获取项目数据的集合
        this.getAllProjects();
    }

    componentDidMount() {
        // 增加监听器，侦测浏览器窗口大小改变
        window.addEventListener('resize', this.handleResize.bind(this));
        this.setState({ scrollHeight: GetMainViewHeight() });
        // move getAllTasksRunStatus and update the project status on server when this.getAllProjects();
        //HttpRequest.asyncGet(this.getAllTasksRunStatusCB, '/tasks/run-status');
        // 开启 websocket ，实时获取后台处理状态，比如任务运行状态
        //this.openWebsocket();
    }

    componentWillUnmount() {
        // 组件卸装前，一定要移除监听器
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    isRunning = (rowIndex) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);
        const { projects } = this.state;
        if (projects instanceof Array) {
            if (projects[dataIndex].process_flag === taskRunStatus.RUNNING) {
                return true;
            }
        }
        return false;
    }

    requestUpdateProjectProcessFlagCB = (action) => (data) => {
        if (data.code === errorCode.ERROR_OK) {
            const { projects } = this.state;
            for (let project of projects) {
                if (project.uuid === data.project_uuid) {
                    project.process_flag = data.process_flag;
                    this.setState({ projects });
                    this.renderRunStatusColumn();
                    break;
                }
            }
        } else {
            message.error(eng2chn(data.error));
        }
    }

    getAllTasksForProject = (tasks) => {
        let jsonTasks;
        try {
            jsonTasks = JSON.parse(tasks);
        }
        catch (err) {
            return null;
        }
        return jsonTasks;
    }

    updateProjectInfoBackFromSocket = (data) => {
        let jsonTasks;
        const { projects } = this.state;
        for (let project of projects) {
            if (project.uuid === data.project_uuid) {
                jsonTasks = this.getAllTasksForProject(project.tasks);
                if (data.done_rate === 100 || data.run_status === taskRunStatus.FINISHED || data.run_status === taskRunStatus.INTERRUPTED) {
                    if (this.checkProjectAllTasksIfDone(jsonTasks, project)) {
                        HttpRequest.asyncPost(this.requestUpdateProjectProcessFlagCB, '/projects/update',
                            {
                                uuid: project.uuid, process_flag: taskRunStatus.FINISHED,
                            },
                            false
                        );
                    }
                }
                break;
            }
        }
    }

    checkProjectAllTasksIfDone(jsonTasks, project) {
        if (jsonTasks instanceof Array) {
            let taskUuidList;
            for (let task of jsonTasks) {
                taskUuidList = taskUuidList + "," + task.uuid;
            }
            HttpRequest.asyncGet(this.getAllTasksRunStatusCB, '/tasks/run-status', { uuid_list: taskUuidList });
        }
    }

    processSockMessage = (data) => {
        let message = JSON.parse(data);
        if (message.type === sockMsgType.MULTIPLE_TASK_RUN_INFO) {
            // 处理多任务运行状态
            this.processMultipleTaskRunStatusInfo(message.payload);
        } else if (message.type === sockMsgType.SINGLE_TASK_RUN_INFO) {
            // 处理单任务运行状态
            this.processSingleTaskRunStatusInfo(message.payload)
        } else {
            // 其它消息类型不做处理
        }
    }

    openWebsocket = () => {
        var socket;
        let self = this;
        if (typeof (WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
        } else {
            console.log("您的浏览器支持WebSocket");
            //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接  
            //等同于socket = new WebSocket("ws://localhost:8083/checkcentersys/websocket/20");  
            socket = new WebSocket("ws://localhost:8090/websocket/");// + generateUuidStr()
            //打开事件  
            socket.onopen = function () {
                console.log("Socket 已打开");
                //socket.send("这是来自客户端的消息" + location.href + new Date());  
            };
            //获得消息事件  
            socket.onmessage = function (msg) {
                console.log(msg.data);
                self.processSockMessage(msg.data);
                //发现消息进入    开始处理前端触发逻辑
            };
            //关闭事件  
            socket.onclose = function () {
                console.log("Socket已关闭");
            };
            //发生了错误事件  
            socket.onerror = function () {
                message.error("Socket发生了错误");
                //此时可以尝试刷新页面
            }
        }

    }

    getAllTasksRunStatusCB = (data) => {
        const { projects } = this.state;
        let needsUpdateProjectStatusList = [];
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array))
            return;

        for (let project of projects) {
            let doneNumber = 0;
            for (let status of data) {
                if (project.uuid === taskRunStatus.project_uuid) {
                    if ((status.done_rate === 100 || status.run_status === taskRunStatus.INTERRUPTED)) {
                        doneNumber++;
                    } else {
                        break;
                    }
                }
            }
            if (doneNumber === project.task_number) {
                needsUpdateProjectStatusList.PushNew(project.uuid);
            } else {
                break;
            }
        }
        //TODO if considering update projects status on server
        if (needsUpdateProjectStatusList instanceof Array && needsUpdateProjectStatusList.length > 0) {
            HttpRequest.asyncPost(null, '/projects/update-list',
                {
                    uuids: needsUpdateProjectStatusList,
                },
                false
            );
        }
    }

    handleResize = e => {
        console.log('浏览器窗口大小改变事件', e.target.innerWidth, e.target.innerHeight);
        this.setState({ scrollHeight: GetMainViewHeight() });
    }

    /** 初始化操作列，定义渲染效果 */
    redrawActionColumn = () => {
        const { columns } = this.state;
        const { classes } = this.props;
        if (columns.length === 0)
            return;

        // 操作列默认为最后一列
        columns[columns.length - 1].render = (text, record, index) => (
            <div>
                {this.isRunning(index) ?
                    <Button className={classes.actionButton} disabled={true} type="danger" size="small">删除</Button> :
                    <Popconfirm title="确定要删除该项目吗？" onConfirm={this.handleDel(index).bind(this)} okText="确定" cancelText="取消">
                        <Button className={classes.actionButton} type="danger" size="small">删除</Button>
                    </Popconfirm>
                }
                <Button className={classes.actionButton} disabled={this.isRunning(index)} type="primary" size="small" onClick={this.handleEdit(index).bind(this)}>编辑</Button>
                <Button className={classes.actionButton} disabled={this.isRunning(index)} type="primary" size="small" onClick={this.handleRun(index).bind(this)}>运行<Icon type="caret-right" /></Button>
            </div>
        )
        this.setState({ columns });
    }

    getRunStatus = (flag) => {
        if (flag === taskRunStatus.IDLE) {
            return '空闲状态';
        } else if (flag === taskRunStatus.RUNNING) {
            return '正在运行';
        } else {
            return '已经完成';
        }
    }

    /** 从后台请求所有项目数据，请求完成后的回调 */
    getAllProjectsCB = (data) => {
        let projects = [];
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array))
            return;

        // 从响应数据生成 table 数据源
        projects = data.payload.map((project, index) => {
            let projectItem = DeepClone(project);
            // antd 表格需要数据源中含 key 属性
            projectItem.key = index + 1;
            // 表格中索引列（后台接口返回数据中没有此属性）
            projectItem.index = index + 1;
            //projectItem.run_status = this.getRunStatus(project.process_flag);
            return projectItem;
        })

        // 更新 projects 数据源
        this.setState({ projects });
    }

    /** 从后台请求所有项目详细数据 */
    getAllProjects = () => {
        HttpRequest.asyncGet(this.getAllProjectsCB, '/projects/all');
    }

    /** 向后台发起删除任务数据请求的完成回调 
     *  因调用请求函数时，默认参数只返回成功请求，所以此处不需要判断后台是否成功删除任务
    */
    deleteProjectCB = (dataIndex) => (data) => {
        const { projects } = this.state;
        // rowIndex 为行索引，第二个参数 1 为一次去除几行
        projects.splice(dataIndex, 1);
        this.setState({ projects });
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

        // 向后台提交删除该项目
        const { projects } = this.state;
        HttpRequest.asyncPost(this.deleteProjectCB(dataIndex), '/projects/remove', { uuid: projects[dataIndex].uuid });
    }

    /** 处理编辑操作 */
    handleEdit = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);

        // 获取需要编辑的任务数据
        const projectItem = this.state.projects[dataIndex];

        // 利用仓库保存任务操作类型、操作窗口名称、任务数据
        const projectStore = this.props.projectStore;
        projectStore.setProjectAction(actionType.ACTION_EDIT);
        projectStore.setProjectProcName('编辑项目参数');
        projectStore.initProjectItem(projectItem);

        // 保存待编辑的数据索引，并打开任务数据操作窗口
        this.setState({ recordChangeID: dataIndex, showProjectConfig: true });
    }

    runProjectCB = (dataIndex) => (data) => {
        const projectItem = this.state.projects[dataIndex];

        // 重新初始化操作列，以使按钮失效
        this.redrawActionColumn();
    }

    /** 处理运行项目的操作 */
    handleRun = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);

        // 向后台提交任务执行
        const { projects } = this.state;
        HttpRequest.asyncPost(this.runProjectCB(dataIndex), '/tasks/execute-project-task', { uuid: projects[dataIndex].uuid, tasks: projects[dataIndex].tasks, run_time_mode: projects[dataIndex].run_time_mode, process_flag: taskRunStatus.RUNNING });

    }

    /** 处理新建任务 */
    handleNewProject = (event) => {
        const projectStore = this.props.projectStore;
        projectStore.setProjectAction(actionType.ACTION_NEW);
        projectStore.setProjectProcName('新建项目');
        let projectItem = {
            name: '新建项目',
            process_flag: taskRunStatus.IDLE,
        };
        projectStore.initProjectItem(projectItem);

        // 打开项目数据操作窗口
        this.setState({ showProjectConfig: true });
    }

    /** 新建/编辑项目窗口完成的回调处理 */
    projectActionCB = (isOk, task) => {
        const projectStore = this.props.projectStore;
        if (isOk) {
            if (projectStore.projectAction === actionType.ACTION_NEW) {
                this.addProjectData();
            } else if (projectStore.projectAction === actionType.ACTION_EDIT) {
                this.editProjectParams();
            }
        }

        // 关闭任务数据操作窗口
        this.setState({ showProjectConfig: false });
    }

    /** 添加任务数据到前端缓存的数据列表中 */
    addProjectData = () => {
        const { projects } = this.state;
        // 从仓库中取出新建的项目对象，设置 key 和 index 属性
        const projectItem = this.props.projectStore.projectItem;
        projectItem.key = projects.length + 1;
        projectItem.index = (projects.length + 1).toString();

        // 将新建项目对象添加到项目数据源中（数据源的首位）
        projects.unshift(projectItem);
    }

    /** 确认修改项目后，在项目列表中修改指定数据 */
    editProjectParams = () => {
        const { projects, recordChangeID } = this.state;
        const projectItem = this.props.projectStore.projectItem;

        // 从仓库中取出编辑后的任务对象，深拷贝到源数据中
        let record = projects[recordChangeID];
        DeepCopy(record, projectItem);
    }

    /** 处理页面变化（页面跳转/切换/每页记录数变化） */
    handlePageChange = (currentPage, pageSize) => {
        this.setState({ currentPage, pageSize });
    }

    hasModifyRight = () => {
        const { userGroup } = this.props.userStore.loginInfo;
        if (userGroup === userType.TYPE_NORMAL_USER) {
            //return true;
        }
        return false;
    }

    render() {
        const { columns, projects, showProjectConfig, scrollWidth, scrollHeight } = this.state;
        let self = this;

        return (
            <div>
                <Skeleton loading={!this.hasModifyRight()} active avatar>
                    <Row>
                        <Col span={8}><Typography variant="h6">项目管理</Typography></Col>
                        <Col span={8} offset={8} align="right"><Button type="primary" size="large" onClick={this.handleNewTask.bind(this)}><Icon type="plus-circle-o" />新建项目</Button></Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={projects}
                        bordered={true}
                        scroll={{ x: scrollWidth, y: scrollHeight }}
                        rowKey={record => record.uuid}
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
                    {showProjectConfig && <ProjectParamsConfig id="ProjectParamsConfig" actioncb={this.projectActionCB} />}
                </Skeleton>
            </div>
        )
    }
}


SecurityProjectView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(SecurityProjectView);
