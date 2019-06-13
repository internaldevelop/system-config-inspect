import React from 'react';
import PropTypes, { instanceOf } from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import Draggable from '../../components/window/Draggable'
import { observer, inject } from 'mobx-react'
import { Typography, notification, Progress, Tag, Modal, Row, Col, message, AutoComplete, Icon } from 'antd';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { DeepClone } from '../../utils/ObjUtils'

import HttpRequest from '../../utils/HttpRequest'
import { errorCode } from '../../global/error';
import { actionType } from '../../global/enumeration/ActionType';
import { runTimeModeNames } from '../../global/enumeration/RumTimeMode';
import { outputModeNames } from '../../global/enumeration/OutputMode';
import { taskRunStatus } from '../../global/enumeration/TaskRunStatus'
import { eng2chn } from '../../utils/StringUtils'
import { TweenOneGroup } from 'rc-tween-one';


const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
    },
    formControl: {
        minWidth: 200,
    },
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
    searchItemStyle: {
        marginTop: 20,
        //minHeight: 100,
    },
});


const openNotification = () => {
    notification.open({
        message: '新增任务提醒',
        description:
            '一个项目最多添加10条任务。',
        style: {
            width: 500,
            marginLeft: -500,
        },
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};

@inject('projectStore')
@inject('userStore')
@observer
class ProjectParamsConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            taskNames: [],
            selectedTaskNames: [],
            inputTaskTagVisible: false,
            inputTaskName: '',
        };
        // 从后台获取任务数据的集合
        this.getAllTasks();
    }

    /** 从后台请求所有任务数据，请求完成后的回调 */
    getAllTaksCB = (data) => {
        const projectStore = this.props.projectStore;
        let tasks = [];
        let taskNames = [];
        let selectedTaskNames = [];
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
            taskNames.push(task.name);
            return taskItem;
        })

        // 把项目中字段tasks解析出来放入到selectedTaskNames中
        if (projectStore.projectAction === actionType.ACTION_EDIT) {
            const projectItem = this.props.projectStore.projectItem;
            let jsonTasks = this.getAllTasksForProject(projectItem.tasks);
            if (jsonTasks instanceof Array) {
                for (let jsonTask of jsonTasks) {
                    selectedTaskNames.push(jsonTask.name);
                }
            }
            this.setState({ selectedTaskNames });
        }

        // 更新 tasks 数据源
        this.setState({ tasks, taskNames });
    }

    /** 从后台请求所有任务数据 */
    getAllTasks = () => {
        // 从后台获取任务的详细信息，含任务表的数据和关联表的数据
        HttpRequest.asyncGet(this.getAllTaksCB, '/tasks/all-task-details');
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

    handleCancel = (e) => {
        let actionCB = this.props.actioncb;
        // 调用父组件传入的回调函数，第一个参数 false 表示本组件的参数设置被取消 cancel
        actionCB(false, {});
    }

    requestProjectCB = (action) => (data) => {
        let actionCB = this.props.actioncb;
        let successInfo;

        if (action === 'new') {
            successInfo = "项目创建成功";
        } else if (action === 'update') {
            successInfo = "项目更新成功";
        } else {
            successInfo = "操作成功";
        }

        if (data.code === errorCode.ERROR_OK) {
            message.info(successInfo);
            this.props.projectStore.setParam("uuid", data.payload.uuid);
            // 调用父组件传入的回调函数，第一个参数 true 表示本组件的参数设置已确认，且项目记录已在后台创建或更新
            actionCB(true, {});
        } else {
            message.error(eng2chn(data.error));
            // 后台创建项目记录失败，则用参数 false 通知父组件不更新页面
            actionCB(false, {});
        }
    }

    getJsonTasks = () => {
        const selectedTaskNames = this.state.selectedTaskNames;
        const tasks = this.state.tasks;
        let jsonTasks = [];
        if (selectedTaskNames instanceof Array) {
            for (let taskName of selectedTaskNames) {
                for (let task of tasks) {
                    if (taskName === task.name) {
                        // 添加本条任务到 JSON 对象中
                        jsonTasks.push({ uuid: task.uuid, code: task.code, name: task.name });
                        break;
                    }
                }
            }
            // 将 JSON 对象转换成字符串，存到仓库中
            this.props.projectStore.setParam("tasks", JSON.stringify(jsonTasks));
            this.props.projectStore.setParam("task_number", selectedTaskNames.length);
        }
    }

    handleOk = (e) => {
        this.getJsonTasks();
        const { uuid, name, tasks, run_time_mode, output_mode, task_number, process_flag } = this.props.projectStore.projectItem;
        const { userUuid } = this.props.userStore.loginUser;
        if (this.props.projectStore.projectAction === actionType.ACTION_NEW) {
            // 向后台发送请求，创建一条新的策略记录
            HttpRequest.asyncPost(this.requestProjectCB('new'), '/projects/add',
                {
                    name, code: "TODO", tasks, run_time_mode, output_mode, task_number, process_flag, create_user_uuid: userUuid,
                },
                false
            );
        } else if (this.props.projectStore.projectAction === actionType.ACTION_EDIT) {
            // 向后台发送请求，更新策略数据
            HttpRequest.asyncPost(this.requestProjectCB('update'), '/projects/update',
                {
                    uuid, name, code: "TODO", tasks, run_time_mode, output_mode, task_number, process_flag, create_user_uuid: userUuid,
                },
                false
            );
        }
    }

    getOutputModeNames() {
        return ['Pdf', 'Excel', 'Word', 'Html'];
    }

    getRunTimeModeNames() {
        return ['立即运行', '30分钟后运行', '1小时后运行', '1天后运行'];
    }

    handleParamsChange = name => (event) => {
        let value = event.target.value;
        this.props.projectStore.setParam(name, value);
        if (name === "run_time_mode") {
            this.props.projectStore.setParam("run_time_mode_name", this.getRunTimeModeNames()[value - 1]);
        } else if (name === "output_mode") {
            this.props.projectStore.setParam("output_mode_name", this.getOutputModeNames()[value - 1]);
        }
    };

    handleClose = removedTag => {
        const tags = this.state.selectedTaskNames.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ selectedTaskNames: tags });
    };

    showInput = () => {
        this.setState({ inputTaskTagVisible: true }, () => this.input.focus());
        this.setState({ inputTaskName: '' });
    };

    handleInputChange = (value) => {
        this.setState({ inputTaskName: value });
    };

    handleInputConfirm = (value) => {
        let { selectedTaskNames, tasks } = this.state;
        if (selectedTaskNames instanceof Array && selectedTaskNames.length >= 10) {
            openNotification();
        } else if (value != null && (selectedTaskNames.indexOf(value) === -1)) {
            selectedTaskNames = [...selectedTaskNames, value];
            // let taskUuid = '';
            // for(let task of tasks) {
            //     if (task.name === value) {
            //         taskUuid = task.uuid;
            //         break;
            //     }
            // }
            // let { statusList } = this.state;
            // let taskRunStatusItem = {};
            // taskRunStatusItem.execute_uuid = null;
            // taskRunStatusItem.project_uuid = this.props.projectStore.projectItem.uuid;
            // taskRunStatusItem.task_uuid = taskUuid;
            // taskRunStatusItem.run_status = taskRunStatus.IDLE;
            // taskRunStatusItem.done_rate = 0;
            // taskRunStatusItem.name = value;
            // statusList.push(taskRunStatusItem);
            // this.setState({ statusList });
        }
        this.setState({
            selectedTaskNames: selectedTaskNames,
            inputTaskTagVisible: false,
            inputTaskName: '',
        });
    };

    saveInputRef = input => (this.input = input);

    forMap = tag => {
        const tagElem = (
            <Tag
                closable
                onClose={e => {
                    e.preventDefault();
                    this.handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span key={tag} style={{ display: 'inline-block' }}>
                {tagElem}
            </span>
        );
    };


    render() {
        const { classes } = this.props;
        const projectStore = this.props.projectStore;
        const modalTitle = <Draggable title={projectStore.projectProcName} />;
        const { name, run_time_mode, output_mode, task_number } = this.props.projectStore.projectItem;
        const { taskNames, selectedTaskNames, inputTaskTagVisible, inputTaskName } = this.state;
        const tagChild = selectedTaskNames.map(this.forMap);

        return (
            <Modal
                title={modalTitle}
                style={{ top: 200, minWidth: 800 }}
                maskClosable={false}
                destroyOnClose={true}
                visible={true}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <form className={classes.root} autoComplete="off">
                    <TextField required fullWidth id="name" label="项目名称" defaultValue={name} style={{ height: 80 }}
                        variant="outlined" margin="normal" onChange={this.handleParamsChange("name")}
                    />
                    <Row style={{ height: 80 }}>
                        {/* <Col span={11}>
                            <FormControl required variant="outlined" style={{ width: '100%' }}>
                                <Select
                                    value={run_time_mode}
                                    onChange={this.handleParamsChange("run_time_mode")}
                                    input={
                                        <OutlinedInput
                                            name="run_time_mode"
                                            id="outlined-group"
                                        />
                                    }
                                >
                                    {runTimeModeNames.map(mode => (
                                        <MenuItem value={mode.index}>{mode.name}</MenuItem>
                                    ))}
                                </Select>
                                <InputLabel htmlFor="outlined-group">运行时间模式</InputLabel>
                            </FormControl>
                        </Col> */}
                        <Col>{/*span={11} offset={2} */}
                            <FormControl required variant="outlined" style={{ width: '100%' }}>
                                <Select
                                    value={output_mode}
                                    onChange={this.handleParamsChange("output_mode")}
                                    input={
                                        <OutlinedInput
                                            name="output_mode"
                                            id="outlined-group"
                                        />
                                    }
                                >
                                    {outputModeNames.map(mode => (
                                        <MenuItem value={mode.index}>{mode.name}</MenuItem>
                                    ))}
                                </Select>
                                <InputLabel htmlFor="outlined-group">输出格式</InputLabel>
                            </FormControl>
                        </Col>
                    </Row>
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <TweenOneGroup
                                enter={{
                                    scale: 0.8,
                                    opacity: 0,
                                    type: 'from',
                                    duration: 100,
                                    onComplete: e => {
                                        e.target.style = '';
                                    },
                                }}
                                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                                appear={false}
                            >
                                {tagChild}
                            </TweenOneGroup>
                        </div>
                        {inputTaskTagVisible && (
                            <AutoComplete
                                ref={this.saveInputRef}
                                required
                                className={classes.searchItemStyle}
                                dataSource={taskNames}
                                onChange={this.handleInputChange.bind(this)}
                                onSelect={this.handleInputConfirm.bind(this)}
                                defaultValue=""
                                value={inputTaskName}
                                placeholder=""
                                filterOption={(inputValue, option) =>
                                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            />
                        )}
                        {!inputTaskTagVisible && (
                            <Tag onClick={this.showInput.bind(this)} style={{ background: '#fff', borderStyle: 'dashed' }}>
                                <Icon type="plus" /> 选择任务
                            </Tag>
                        )}
                    </div>
                    <br />
                </form>
            </Modal>
        )
    }
}

ProjectParamsConfig.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(ProjectParamsConfig);
