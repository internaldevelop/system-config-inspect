import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ReactEcharts from 'echarts-for-react';

import { Card, Skeleton, Progress, Row, Col } from 'antd';
import { GetGroups } from './toolkit';
import { getGroupAlias } from '../../utils/StringUtils';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class StatRadar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ratings: [],
            ready: false,
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

    refreshResult = (stats) => {
        if (!(stats instanceof Array))
            return;

        let ratings = [];
        let groups = GetGroups();
        for (let index in groups) {
            let total = 0;
            let success = 0;
            for (let stat of stats) {
                if (stat['config_type'] === groups[index]) {
                    if (parseInt(stat['risk_level']) === 0) {
                        success += parseInt(stat['count']);
                    }
                    total += parseInt(stat['count']);
                }
            }
            let rating = (success * 100.0 / total).toFixed(1) - 0.0;
            ratings.push(rating);
        }

        this.setState({ ratings, ready: true });
    }
    clearResult = (groupName) => {
        this.setState({ ratings: [], ready: false });
    }

    getTooltipFormatter = (data, b, c) => {
        return data;
    }

    // 饼图、雷达图 formatter: a（系列名称），b（数据项名称），c（数值）, d（百分比）
    getOption = () => {
        const { ratings } = this.state;
        let groups = GetGroups();

        return {
            // title: { text: '分类雷达图' },
            tooltip: {
                trigger: 'item',
                // formatter: this.getTooltipFormatter
                // formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            calculable : true,
            // legend: {
            //     x : 'center',
            //     data: ['分类雷达图'],
            // },
            polar : [
                {
                    indicator : groups.map((group) => { return {text: getGroupAlias(group), max: 100}; }),
                    radius : 70
                }
            ],
            series : [
                {
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data : [
                        {
                            value : ratings,
                            name : '核查通过占比（%）'
                        },
                    ]
                }
            ],
        };

    }

    render() {
        // const { rating, ready } = this.state;
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

StatRadar.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(StatRadar);
