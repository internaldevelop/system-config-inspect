import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactEcharts from 'echarts-for-react';

import { Progress, Typography, Badge, Row, Col } from 'antd';

import HttpRequest from '../../utils/HttpRequest';

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
            dimensionsData: [],
            sourceData: [],
            seriesBar: [],
        }
        const { taskuuid } = this.props;
        // this.getTaskExecResult(taskuuid);
    }

    getResultsCB = (data) => {
    }

    getTaskExecResult(code) {
        console.log('code:' + code);
        return HttpRequest.asyncGet(this.getResultsCB, '/tasks/results/statistics');
    }

    getOption() {
        const { dimensionsData, sourceData, seriesBar } = this.state;

        return {
            // title: { text: '策略统计' },
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: dimensionsData,
                // dimensions: ['product', 'Centos', 'Ubuntu'],
                source: sourceData
                // source: [
                //     {product: 'Matcha Latte', 'Centos': 43.3, 'Ubuntu': 85.8},
                //     {product: 'Milk Tea', 'Centos': 83.1, 'Ubuntu': 73.4},
                //     {product: 'Cheese Cocoa', 'Centos': 86.4, 'Ubuntu': 65.2},
                //     {product: 'Walnut Brownie', 'Centos': 72.4, 'Ubuntu': 53.9}
                // ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: seriesBar
            // series: [
            //     {type: 'bar'},
            //     {type: 'bar'},
            // ]

        };
    }

    onChartClick(param, echarts) {
        console.log(param)
    }

    render() {
        let onEvents = {
            'click': this.onChartClick.bind(this)
        }

        return (
            <div>
                <Title level={4}>{this.props.taskuuid}</Title>
                <Col span={15}>
                    <Row>
                        <Badge count={100} style={{ backgroundColor: '#52c41a' }}>
                            <Title level={4}>检测通过项</Title>
                        </Badge>
                    </Row>
                    <Row>
                    <Badge count={65} overflowCount={10}>
                        <Title level={4}>一级问题</Title>
                    </Badge>
                    </Row>
                    <Row>
                    <Badge count={5} overflowCount={10}>
                        <Title level={4}>二级问题</Title>
                    </Badge>
                    </Row>
                    <Row>
                    <Badge count={9} overflowCount={10}>
                        <Title level={4}>三级问题</Title>
                    </Badge>
                    </Row>
                </Col>
                <Col span={9}>
                <Progress strokeLinecap="square" type="circle" percent={75} />
                </Col>
                <br /><br />

                <ReactEcharts
                    option={this.getOption()}
                    notMerge={true}
                    lazyUpdate={true}
                    onEvents={onEvents}
                    style={{ width: '100%', height: '300px' }}
                />
            </div>
        );

    }
}

TaskExecResultsView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(TaskExecResultsView);
