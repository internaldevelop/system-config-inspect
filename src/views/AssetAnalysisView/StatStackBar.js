import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, Skeleton, Select, Table, Statistic, Button, Row, Col, Icon, Collapse, message, Modal } from 'antd';

import ReactEcharts from 'echarts-for-react';

import { getGroupAlias } from '../../utils/StringUtils';
import { GetGroups, GetRiskLevels } from './toolkit';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class StatStackBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [],
        };
    }

    componentDidMount() {
        // 注册事件
        global.myEventEmitter.addListener('RefreshCheckResult', this.refreshResult);
        global.myEventEmitter.addListener('ClearCheckResult', this.clearResult);
    }

    componentWillUnmount() {
        // 取消事件
        global.myEventEmitter.removeListener('RefreshCheckResult', this.refreshResult);
        global.myEventEmitter.removeListener('ClearCheckResult', this.clearResult);
    }

    clearResult = (groupName) => {
        this.setState({ series: [] });
    }

    refreshResult = (stats) => {
        let groups = GetGroups();
        let series = [];
        let levels = GetRiskLevels();
        for (let i = 0; i < 4; i++) {
            let item = {};
            item.name = levels[i];
            item.type = 'bar';
            // item.stack = '总量';
            item.itemStyle = { normal: { label: { show: true, position: 'inside' } } };
            item.data = [0, 0, 0, 0, 0, 0, 0];
            for (let index in groups) {
                for (let stat of stats) {
                    if (parseInt(stat['risk_level']) === i && stat['config_type'] === groups[index]) {
                        item.data[index] = parseInt(stat['count']);
                    }
                }
            }
            series.push(item);
        }

        this.setState({ series });
    }

    getOption = () => {
        const { series } = this.state;
        let groups = GetGroups();

        return {
            // title: { text: '核查统计' },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            calculable : true,
            legend: {
                data: GetRiskLevels(),
            },
            xAxis: {
                type: 'category',
                data: groups.map((group) => getGroupAlias(group))
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: series,
        };

    }

    render() {
        return (
            <div>
                <ReactEcharts
                    option={this.getOption()}
                    notMerge={true}
                    lazyUpdate={true}
                    // onEvents={onEvents}
                    style={{ width: '100%', height: '300px' }}
                />
            </div>
        );
    }
}

StatStackBar.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(StatStackBar);

