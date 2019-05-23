import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Progress, Card, Form, Icon, Button, Row, Col } from 'antd';
import { inject } from 'mobx-react'
import { GetBackEndRootUrl } from '../../global/environment'
import { taskRunStatus } from '../../global/enumeration/TaskRunStatus'

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
class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
    }

    getPercentValue = (status) => {
        if (status.run_status === taskRunStatus.IDLE) {
            return 0;
        } else {
            return status.done_rate;
        }
    }

    // 导出
    exportTasksResults = (status) => {
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

    getException = (status) => {
        if (status.run_status === taskRunStatus.INTERRUPTED) {
            return 'exception';
        } 
        return '';
    }

    render() {
        const projectItem = this.props.projectStore.projectItem;
        const { classes } = this.props;
        const { statusList } = this.props;

        return (
            <div>
                <Card title={projectItem.name}>
                    <Row>
                        <Col span={11}>
                            <Card
                                style={{ marginTop: 16 }}
                                type="inner"
                                title="运行时间模式"
                            >
                                <div>
                                    {projectItem.run_time_mode_name}
                                </div>
                            </Card>
                        </Col>
                        <Col span={11} offset={2}>
                            <Card
                                style={{ marginTop: 16 }}
                                type="inner"
                                title="输出格式"
                            >
                                <div>
                                    {projectItem.output_mode_name}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Card
                                style={{ marginTop: 16 }}
                                type="inner"
                                title="运行状态"
                            >
                                <div>
                                    {projectItem.run_status}
                                </div>
                            </Card>
                        </Col>
                        <Col span={11} offset={2}>
                            <Card
                                style={{ marginTop: 16 }}
                                type="inner"
                                title="任务数目"
                            >
                                <div>
                                    {projectItem.task_number}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Card
                        style={{ marginTop: 16 }}
                        type="inner"
                        title="任务进度"
                    >
                        <div>
                            <Row>
                                {statusList.map((item, index) => (
                                    <Col span={6}>
                                        <Card title={item.name} bordered={false}>
                                            <div>{this.isShownExportReport(item) &&
                                                <Button className={classes.iconButton} type="primary" size="small" onClick={this.exportTasksResults} ><Icon type="export" />导出报告 </Button>
                                            }
                                                <Progress type="circle" percent={this.getPercentValue(item)} status={this.getException(item)} />
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Card>
                </Card>
            </div>
        );
    }
}

ProjectCard.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(ProjectCard);
