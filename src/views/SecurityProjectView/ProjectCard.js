import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Progress, Card, Form, Icon, Button, Row, Col, Modal } from 'antd';
import { inject } from 'mobx-react'
import { GetBackEndRootUrl } from '../../global/environment'
import { taskRunStatus } from '../../global/enumeration/TaskRunStatus'
import TaskExecResultsView from '../SecurityStatistics/TaskExecResultsView'
import TaskParamsConfig from '../TaskManageView/TaskParamsConfig'
import HttpRequest from '../../utils/HttpRequest';
import { actionType } from '../../global/enumeration/ActionType';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
    actionButton: {
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0,
        marginTop: 0,
    },
});

@Form.create()
@inject('projectStore')
@inject('taskStore')
class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTaskConfig: false,  // 是否显示任务查看窗口
        }
    }

    getPercentValue = (status) => {
        if (status.run_status === taskRunStatus.IDLE) {
            return 0;
        } else {
            return status.done_rate;
        }
    }

    // 导出
    exportTasksResults = (status) => (e) => {
        const projectItem = this.props.projectStore.projectItem;
        const inputValue = status.name;
        const selectValue = projectItem.output_mode_name;
        window.location.href = GetBackEndRootUrl() + '/tasks/results/export?taskNameIpType=' + inputValue + '&type=' + selectValue;
    }

    isShownExportReport = (status) => {
        if (status.run_status === taskRunStatus.FINISHED) {
            return true;
        } 
        return false;
    }

    getProgressStatus = (status) => {
        if (status.run_status === taskRunStatus.INTERRUPTED) {
            return 'exception';
        } else if (status.run_status === taskRunStatus.FINISHED) {
            return 'success';
        } else if (status.run_status === taskRunStatus.RUNNING) {
            return 'active';
        } else if (status.run_status === taskRunStatus.IDLE) {
            return 'normal';
        }
        return 'exception';
    }

    getExportTasksResultsButton = (status) => {
        const { classes } = this.props;
        if (true) {//this.isShownExportReport(status)
            return (<Button className={classes.iconButton} type="primary" size="small" onClick={this.exportTasksResults(status)} ><Icon type="export" />导出报告 </Button>);
        }
    }

    getExtras = (status) => {
        return (<Button type="primary" size="small" onClick={this.getTaskInfo(status)} ><Icon type="info" />查看参数</Button>);
    }

    /** 从后台请求任务数据，请求完成后的回调 */
    getTaksCB = (data) => {
        // 获取需要查看的任务数据
        const taskItem = data.payload;
        // 利用仓库保存任务操作类型、操作窗口名称、任务数据
        const taskStore = this.props.taskStore;
        taskStore.setTaskAction(actionType.ACTION_EDIT);
        taskStore.setTaskProcName('查看任务参数');
        taskStore.initTaskItem(taskItem);

        // 保存待编辑的数据索引，并打开任务数据操作窗口
        this.setState({ showTaskConfig: true });
    }

    /** 从后台请求任务数据 */
    getTaskInfo = (status) => (e) => {
        // 从后台获取任务的详细信息
        HttpRequest.asyncGet(this.getTaksCB, '/tasks/get-task', { uuid: status.task_uuid });
    }

    taskActionCB = (isOk, task) => {
        const taskStore = this.props.taskStore;
        if (isOk) {
            if (taskStore.taskAction === actionType.ACTION_NEW) {
                //this.addTaskData();
            } else if (taskStore.taskAction === actionType.ACTION_EDIT) {
                //this.editTaskParams();
            }
        }

        // 关闭任务数据操作窗口
        this.setState({ showTaskConfig: false });
    }

    handlePlayback = (uuid) => e => {
        Modal.info({
            keyboard: true,         // 是否支持键盘 esc 关闭
            destroyOnClose: true,   // 关闭时销毁 Modal 里的子元素
            closable: false,         // 是否显示右上角的关闭按钮
            width: 520, 
            content: <TaskExecResultsView taskuuid={uuid}/>,
            onOk() {
                // message.info('OK');
            },
        });

        // message.info("点击了进度条");

    }

    render() {
        const projectItem = this.props.projectStore.projectItem;
        const { statusList } = this.props;
        const { showTaskConfig } = this.state;

        return (
            <div>
                <Card title={projectItem.name}>
                <Row>
                        <Col>{/*span={16} */}
                        <Card
                        style={{ marginTop: 16 }}
                        type="inner"
                        title="任务进度"
                    >
                        <div>
                            <Row>
                                {statusList.map((item, index) => (
                                    <Col span={4}>
                                        <Card title={item.name} bordered={false} style={{ marginRight: 16}} extra={this.getExtras(item)}>
                                            <div>
                                                <Progress type="circle" percent={this.getPercentValue(item)} onClick={this.handlePlayback(item.task_uuid)}  status={this.getProgressStatus(item)} />
                                            </div>
                                            <dr />
                                            <div>{this.getExportTasksResultsButton(item)}
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Card>
                        </Col>
                        {/* <Col span={7} offset={1}>
                            <Card
                                style={{ marginTop: 16 }}
                                type="inner"
                                title="输出格式"
                            >
                                <div>
                                    {projectItem.output_mode_name}
                                </div>
                            </Card>
                            <Card
                                style={{ marginTop: 16 }}
                                type="inner"
                                title="运行时间模式"
                            >
                                <div>
                                    {projectItem.run_time_mode_name}
                                </div>
                            </Card>
                            <Card
                                style={{ marginTop: 16 }}
                                type="inner"
                                title="运行状态"
                            >
                                <div>
                                    {projectItem.run_status}
                                </div>
                            </Card>
                            <Card
                                style={{ marginTop: 16 }}
                                type="inner"
                                title="任务数目"
                            >
                                <div>
                                    {projectItem.task_number}
                                </div>
                            </Card>
                        </Col> */}
                    </Row>
                </Card>
                {showTaskConfig && <TaskParamsConfig id="TaskParamsConfig" actioncb={this.taskActionCB}/>}
            </div>
        );
    }
}

ProjectCard.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(ProjectCard);
