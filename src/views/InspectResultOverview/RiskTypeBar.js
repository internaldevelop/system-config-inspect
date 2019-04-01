import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
// import echarts from 'echarts';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    root: {
        width: '90%',
    },

});

class RiskTypeBar extends Component {

    getOption() {
        return {
            title: { text: '检测结果' },
            legend: {},
            tooltip: {},
            xAxis: {
                data: ['系统服务', '账号配置', '防火墙', '审计配置', 'SQL注入', 'DDos', '自定义']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name: 'WinServer',
                    type: 'bar',
                    barGap: 0,
                    data: [320, 332, 301, 334, 97, 156, 390]
                },
                {
                    name: 'Kali2',
                    type: 'bar',
                    data: [220, 182, 191, 234, 197, 56, 290]
                },
                {
                    name: 'Centos7',
                    type: 'bar',
                    data: [150, 232, 201, 154, 67, 256, 190]
                },
                {
                    name: 'Ubuntu16',
                    type: 'bar',
                    data: [98, 77, 101, 99, 297, 36, 40]
                }
            ]

        };
    }

    onChartClick(param,echarts){
        console.log(param)
    }

    render() {
        let onEvents={
            'click': this.onChartClick.bind(this)
        }
        return (
            <ReactEcharts
                option={this.getOption()}
                notMerge={true}
                lazyUpdate={true}
                onEvents={onEvents}
                style={{ width: '100%', height: '300px' }}
            />

        );
    }
}

RiskTypeBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

RiskTypeBar.contextTypes = {
    router: PropTypes.object.isRequired
};

export default withStyles(styles)(RiskTypeBar);

