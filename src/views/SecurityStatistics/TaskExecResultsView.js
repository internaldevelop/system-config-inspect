import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactEcharts from 'echarts-for-react';

import { Progress, Typography, Badge, Row, Col, Card, Statistic, Icon, Modal, message } from 'antd';

import HttpRequest from '../../utils/HttpRequest';
import Draggable from '../../components/window/Draggable'

import ExecResultsListView from './ExecResultsListView';

const { Title, Text } = Typography;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

class TaskExecResultsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // isRender: true,
            taskName: '任务: ',
            riskLevelData: [0, 0, 0, 0],
            runStatus: {},
            taskInfo: {},
            execBrief: {},
            // showDetails: false,
        }
        const { taskuuid, projectuuid } = this.props;
        this.getTaskExecBrief(taskuuid, projectuuid);

    }

    getTaskExecBriefCB = (data) => {
        let level = [0, 0, 0, 0];
        for (let execItem of data.payload.exec_brief) {
            if ((execItem.risk_level <= 3) && (execItem.risk_level >= 0))
                level[execItem.risk_level] += 1;
        }
        this.setState({
            runStatus: data.payload.run_status,
            taskInfo: data.payload.task_info,
            execBrief: data.payload.exec_brief,
            riskLevelData: level,
            // showDetails: true
        });
    }

    getTaskExecBrief = (taskUuid, projectUuid) => {
        if (typeof projectUuid === "undefined")
            projectUuid = '';
        return HttpRequest.asyncGet(this.getTaskExecBriefCB, '/tasks/results/brief', { task_uuid: taskUuid, project_uuid: projectUuid });
    }

    getOption() {
        const { riskLevelData } = this.state;

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: ['测试通过', '一级问题', '二级问题', '三级问题']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: riskLevelData,
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
            }]
        };
    }

    onChartClick(param, echarts) {
        const { runStatus, } = this.state;
        console.log(param);
        let modalFunc;
        if ((param.dataIndex <= 3) && (param.dataIndex >= 0)) {
            if (param.dataIndex === 0)
                modalFunc = Modal.success;
            else 
                modalFunc = Modal.error;
            modalFunc({
                keyboard: true,         // 是否支持键盘 esc 关闭
                destroyOnClose: true,   // 关闭时销毁 Modal 里的子元素
                closable: false,         // 是否显示右上角的关闭按钮
                width: 520, 
                content: <ExecResultsListView execuuid={runStatus.execute_uuid} risklevel={param.dataIndex} />,
                onOk() {
                    // message.info('OK');
                },
            });
            // this.setState({ showDetails: true })
        }
    }

    handleOk = (e) => {
        this.setState({ isRender: false });
    }

    render() {
        const { runStatus, execBrief, taskInfo } = this.state;
        let onEvents = {
            'click': this.onChartClick.bind(this)
        }
        const modalTitle = <Draggable title={'任务执行情况'} />;

        return (
            // <div style={{width:600}}>
            // <Col span={showDetails ? 6 : 14}>
            <div>
                <Col>
                    <Card title={taskInfo.name} style={{ width: 400, height: 460 }}>
                        <Col span={15}>
                            <Row>
                                <Statistic
                                    title="总任务数"
                                    value={runStatus.total_jobs_count}
                                    precision={0}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<Icon type="cluster" />}
                                />
                            </Row>
                            <Row>
                                <Statistic
                                    title="任务完成率"
                                    value={runStatus.done_rate}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<Icon type="check" />}
                                    suffix="%"
                                />
                            </Row>
                        </Col>
                        <Col span={9}>
                            <Progress strokeLinecap="square" type="circle" percent={runStatus.done_rate}
                                format={percent => `${percent} %`}
                            />
                        </Col>
                        <ReactEcharts
                            option={this.getOption()}
                            notMerge={true}
                            lazyUpdate={true}
                            onEvents={onEvents}
                            style={{ width: '100%', height: '260px' }}
                        />
                    </Card>
                </Col>
                {/* <Col span={showDetails ? 6 : 0}>
                    {showDetails && <ExecResultsListView execuuid={runStatus.execute_uuid} risklevel={1} />}
                </Col> */}
            </div>
        );

    }
}

TaskExecResultsView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(TaskExecResultsView);
