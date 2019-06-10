import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, DatePicker, Col, Row, Table, Layout, Select, Input, Button } from 'antd';

import ReactEcharts from 'echarts-for-react';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class ExecCountPieChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieSourceData: this.props.source,
        };
    }

    getOption() {
        const { pieSourceData } = this.state;
        return {
            // title: { text: '任务执行分布饼图' },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
                {
                    name:'任务名称',
                    type:'pie',
                    selectedMode: 'single',
                    radius: ['20%', '80%'],
        
                    label: {
                        normal: {
                            // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            formatter: '{b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    data: pieSourceData
                },

            ]

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
                style={{ width: '100%', height: '350px' }}
            />

            </div>
        );
    }
}

ExecCountPieChart.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(ExecCountPieChart);

