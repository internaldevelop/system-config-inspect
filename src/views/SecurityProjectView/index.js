import React from 'react'
import PropTypes from 'prop-types';
import { AutoComplete, Skeleton, Table, Icon, Button, Row, Col, Popconfirm, message } from 'antd'
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
import { runTimeModeNames } from '../../global/enumeration/RumTimeMode';
import { outputModeNames } from '../../global/enumeration/OutputMode';
import { errorCode } from '../../global/error';
import { eng2chn } from '../../utils/StringUtils'
import ProjectCard from './ProjectCard'

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

@inject('projectStore')
@inject('userStore')
@observer
class SecurityProjectView extends React.Component {
    // const DEFAULT_PAGE_SIZE = 10;
    constructor(props) {
        super(props);
        this.state = {
            projects: [],          // 本页面的项目数据集合
            projectNames: [],
            showProjectConfig: false,  // 是否显示项目数据编辑窗口
            showProjectCard: false,    // 显示项目Card页面
            statusList: [],     // 含多个执行中任务的状态数组
            inputValue: ''
        }
        // 从后台获取项目数据的集合
        this.getAllProjects();
    }

    componentDidMount() {
        // 增加监听器，侦测浏览器窗口大小改变
        window.addEventListener('resize', this.handleResize.bind(this));
        this.setState({ scrollHeight: GetMainViewHeight() });
        // move getAllTasksRunStatus and update the project status on server when this.getAllProjects();
        // HttpRequest.asyncGet(this.getAllTasksRunStatusCB, '/tasks/run-status');
        // 开启 websocket ，实时获取后台处理状态，比如任务运行状态
        //this.openWebsocket();
    }

    componentWillUnmount() {
        // 组件卸装前，一定要移除监听器
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    isRunning = () => {
        const projectItem = this.props.projectStore.projectItem;
        if (projectItem.process_flag === taskRunStatus.RUNNING) {
            return true;
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

    handleResize = e => {
        console.log('浏览器窗口大小改变事件', e.target.innerWidth, e.target.innerHeight);
        this.setState({ scrollHeight: GetMainViewHeight() });
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
        let projectNames = [];
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array) || data.payload.length <= 0)
            return;

        // 从响应数据生成 table 数据源
        projects = data.payload.map((project, index) => {
            let projectItem = DeepClone(project);
            // antd 表格需要数据源中含 key 属性
            projectItem.key = index + 1;
            // 表格中索引列（后台接口返回数据中没有此属性）
            projectItem.index = index + 1;
            //projectItem.run_status = this.getRunStatus(project.process_flag);
            projectItem.run_time_mode_name = runTimeModeNames[project.run_time_mode - 1].name;
            projectItem.output_mode_name = outputModeNames[project.output_mode - 1].name;
            projectItem.run_status = this.getRunStatus(project.process_flag);
            projectNames.push(project.name);
            return projectItem;
        })
        // 更新 projects 数据源
        this.setState({ projects, projectNames });
        // 设置默认项目
        if (projectNames.length > 0) {
            this.setState({ inputValue: projectNames[0] });
            this.onSelectProject(projectNames[0]);
        }
    }

    /** 从后台请求所有项目详细数据 */
    getAllProjects = () => {
        HttpRequest.asyncGet(this.getAllProjectsCB, '/projects/all');
    }

    /** 向后台发起删除任务数据请求的完成回调 
    */
    deleteProjectCB = (data) => {
        const { projects, projectNames } = this.state;
        for (let index in projects) {
            if (data.payload.uuid === projects[index].uuid) {
                projects.splice(index, 1);
                projectNames.splice(index, 1);
                break;
            }
        }
        this.setState({ projects, projectNames });

        // 显示默认项目
        if (projectNames.length > 0) {
            this.setState({ inputValue: projectNames[0] });
            this.onSelectProject(projectNames[0]);
        }
    }

    /** 处理删除操作
     */
    handleDel = (event) => {
        const projectItem = this.props.projectStore.projectItem;
        // 向后台提交删除该项目
        HttpRequest.asyncPost(this.deleteProjectCB, '/projects/remove', { uuid: projectItem.uuid });
    }

    handleEdit = (event) => {
        const projectStore = this.props.projectStore;
        const projectItem = this.props.projectStore.projectItem;
        projectStore.initProjectOldItem(projectItem);
        // 利用仓库保存任务操作类型、操作窗口名称、任务数据
        projectStore.setProjectAction(actionType.ACTION_EDIT);
        projectStore.setProjectProcName('编辑项目参数');
        projectStore.initProjectItem(projectItem);

        // 打开项目数据操作窗口
        this.setState({ showProjectConfig: true });
    }

    runProjectCB = (data) => {
        const projectItem = this.props.projectStore.projectItem;
        if (projectItem.process_flag !== taskRunStatus.RUNNING) {
            projectItem.process_flag = taskRunStatus.RUNNING;
            projectItem.run_status = this.getRunStatus(taskRunStatus.RUNNING);
            this.updateProjectProcessFlag();
            // 重新刷新Card页面，以使按钮失效
            this.setState({ showProjectCard: true });
        }
    }

    /** 处理运行项目的操作 */
    handleRun = (event) => {
        // 向后台提交任务执行
        const projectItem = this.props.projectStore.projectItem;
        HttpRequest.asyncPost(this.runProjectCB(), '/tasks/execute-project-task', { uuid: projectItem.uuid, tasks: projectItem.tasks, run_time_mode: projectItem.run_time_mode, process_flag: taskRunStatus.RUNNING });
    }

    /** 处理新建项目 */
    handleNewProject = (event) => {
        const projectStore = this.props.projectStore;
        projectStore.initProjectOldItem(this.props.projectStore.projectItem);
        projectStore.setProjectAction(actionType.ACTION_NEW);
        projectStore.setProjectProcName('新建项目');
        let projectItem = {
            name: '新建项目',
            run_time_mode: runTimeModeNames[0].index,
            run_time_mode_name: runTimeModeNames[0].name,
            output_mode: outputModeNames[0].index,
            output_mode_name: outputModeNames[0].name,
            process_flag: taskRunStatus.IDLE,
            run_status: '空闲状态',
        };
        projectStore.initProjectItem(projectItem);

        // 打开项目数据操作窗口
        this.setState({ showProjectConfig: true, });
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
            this.getTasksStatus();
        } else {
            const projectOldItem = this.props.projectStore.projectOldItem;
            const projectStore = this.props.projectStore;
            if (projectOldItem !== null && projectOldItem.uuid !== null) {
                projectStore.initProjectItem(projectOldItem);
                // 关闭项目数据操作窗口
                this.setState({ showProjectCard: true, });
            }
        }
        this.setState({ showProjectConfig: false });
    }

    /** 添加项目数据到前端显示 */
    addProjectData = () => {
        const { projects, projectNames } = this.state;
        const projectItem = this.props.projectStore.projectItem;
        // 将新建项目对象添加到项目数据源中（数据源的首位）
        projects.unshift(projectItem);
        projectNames.push(projectItem.name);
        this.setState({ projects, projectNames });
    }

    /** 确认修改项目后，更新列表 */
    editProjectParams = () => {
        const { projects } = this.state;
        let projectNames = [];
        const projectItem = this.props.projectStore.projectItem;

        for (let project of projects) {
            projectNames.push(project.name);
            if (project.uuid === projectItem.uuid) {
                // 从仓库中取出编辑后的项目对象，深拷贝到源数据中
                DeepCopy(project, projectItem);
            }
        }
        this.setState({ projects, projectNames });
    }

    onSelectProject = (projectName) => {
        const { projects, inputValue } = this.state;
        for (let project of projects) {
            if (project.name === projectName) {
                const projectStore = this.props.projectStore;
                projectStore.setProjectAction(actionType.ACTION_EDIT);
                projectStore.setProjectProcName('编辑项目参数');
                projectStore.initProjectItem(project);
                this.setState({ inputValue });
                this.getTasksStatus();
                break;
            }
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

    getTaskName = (uuid) => {
        const projectItem = this.props.projectStore.projectItem;
        let jsonTasks = this.getAllTasksForProject(projectItem.tasks);
        for (let task of jsonTasks) {
            if (uuid === task.uuid) {
                return task.name;
            }
        }
    }

    getTasksStatus = () => {
        //let statusList = [];
        const projectStore = this.props.projectStore;
        //if (projectStore.projectAction === actionType.ACTION_EDIT) {
        const projectItem = this.props.projectStore.projectItem;
        let jsonTasks = this.getAllTasksForProject(projectItem.tasks);
        let taskUuidList = '';
        if (jsonTasks instanceof Array && jsonTasks.length > 0) {
            for (let task of jsonTasks) {
                // let taskRunStatusItem = {};
                // taskRunStatusItem.name = task.name;
                // taskRunStatusItem.execute_uuid = null;
                // taskRunStatusItem.project_uuid = projectItem.uuid
                // taskRunStatusItem.task_uuid = task.uuid;
                // taskRunStatusItem.run_status = taskRunStatus.IDLE;
                // taskRunStatusItem.done_rate = 0;
                // statusList.push(taskRunStatusItem);

                taskUuidList = taskUuidList + "," + task.uuid;
            }
            //this.setState({ statusList });
            HttpRequest.asyncGet(this.getAllTasksRunStatusCB, '/tasks/run-status', { uuid_list: taskUuidList });
        } else {
            this.setState({ statusList: [] });
        }
        //}
    }

    requestProjectCB = (action) => (data) => {
        //
    }

    updateProjectProcessFlag = () => {
        const { uuid, name, tasks, run_time_mode, output_mode, task_number, process_flag } = this.props.projectStore.projectItem;
        const { userUuid } = this.props.userStore.loginUser;
        // 向后台发送请求，更新策略数据
        HttpRequest.asyncPost(this.requestProjectCB('update'), '/projects/update',
            {
                uuid, name, code: "TODO", tasks, run_time_mode, output_mode, task_number, process_flag, create_user_uuid: userUuid,
            },
            false
        );
    }

    getAllTasksRunStatusCB = (data) => {
        const projectItem = this.props.projectStore.projectItem;
        let jsonTasks = this.getAllTasksForProject(projectItem.tasks);
        let statusList = [];
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array) || data.payload.length <= 0)
            return;

        let taskDoneNumber = 0;
        // 拷贝任务执行状态的数据
        for (let status of data.payload) {
            if (status !== null) {//&& status.execute_uuid !== null && projectItem.uuid === status.project_uuid
                let statusItem = DeepClone(status);
                statusItem.name = this.getTaskName(status.task_uuid);
                statusList.push(statusItem);
                if (status.done_rate === 100 || status.run_status === taskRunStatus.FINISHED || status.run_status === taskRunStatus.INTERRUPTED) {
                    taskDoneNumber++;
                }
            }
        }
        if (taskDoneNumber === projectItem.task_number) {
            if (projectItem.process_flag !== taskRunStatus.FINISHED) {
                projectItem.process_flag = taskRunStatus.FINISHED;
                projectItem.run_status = this.getRunStatus(taskRunStatus.FINISHED);
                this.updateProjectProcessFlag();
            }
        }
        // 部分任务可能没有执行状态
        if (statusList.length < projectItem.task_number) {
            if (jsonTasks instanceof Array && jsonTasks.length > 0) {
                for (let task of jsonTasks) {
                    let needAdded = true;
                    if (statusList.length > 0) {
                        for (let resultStatus of statusList) {
                            // resultStatusList里面已经有当前任务的任务状态
                            if (task.uuid === resultStatus.task_uuid) {
                                needAdded = false;
                                break;
                            }
                        }
                    }
                    if (needAdded) {
                        let taskRunStatusItem = {};
                        taskRunStatusItem.name = task.name;
                        taskRunStatusItem.execute_uuid = null;
                        taskRunStatusItem.project_uuid = projectItem.uuid
                        taskRunStatusItem.task_uuid = task.uuid;
                        taskRunStatusItem.run_status = taskRunStatus.IDLE;
                        taskRunStatusItem.done_rate = 0;
                        statusList.push(taskRunStatusItem);
                    }
                }
            }
        }
        // 保存运行状态，显示Card页面
        this.setState({ statusList, showProjectConfig: false, showProjectCard: true });
    }

    hasModifyRight = () => {
        const { userGroup } = this.props.userStore.loginInfo;
        if (userGroup === userType.TYPE_NORMAL_USER) {
            return true;
        }
        return false;
    }

    render() {
        const { classes } = this.props;
        const { inputValue, projectNames, showProjectConfig, showProjectCard, projectUuid, statusList } = this.state;
        return (
            <div>
                <Skeleton loading={!this.hasModifyRight()} active avatar>
                    <Row>
                        <Col span={2}><Typography variant="h6">项目管理</Typography></Col>
                        <Col span={3}>
                            <AutoComplete
                                dataSource={projectNames}
                                onSelect={this.onSelectProject.bind(this)}
                                defaultValue={inputValue}
                                placeholder="输入项目管理名称"
                                filterOption={(inputValue, option) =>
                                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            />
                        </Col>
                        <Col span={2} offset={1} align="left"><Button type="primary" size="large" onClick={this.handleNewProject.bind(this)}><Icon type="plus-circle-o" />新建项目</Button></Col>
                    </Row>
                    {showProjectCard && <ProjectCard uuid={projectUuid} statusList={statusList} />}
                    <br />
                    {showProjectCard &&
                        <div align="center">
                            <Button className={classes.actionButton} type="primary" size="large" onClick={this.handleEdit.bind(this)}>编辑</Button>
                            <Popconfirm title="确定要删除该项目吗？" onConfirm={this.handleDel.bind(this)} okText="确定" cancelText="取消">
                                <Button className={classes.actionButton} type="danger" size="large">删除</Button>
                            </Popconfirm>
                            <Button className={classes.actionButton} disabled={this.isRunning()} type="primary" size="large" onClick={this.handleRun.bind(this)}>运行<Icon type="caret-right" /></Button>
                        </div>
                    }
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
