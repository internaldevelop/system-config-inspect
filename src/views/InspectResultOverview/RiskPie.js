import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
// import echarts from 'echarts';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import HttpRequest from '../../utils/HttpRequest';

const styles = theme => ({
    root: {
        width: '90%',
    },

});

class RiskPie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAccID: -1,
            usersDataReady: false,
            pieSourceData: []
        }
        this.getTaskStatistics();
    }

    getOption() {
        const { pieSourceData } = this.state;
        return {
            title: { text: '漏洞种类分布' },
            // legend: {
            //     orient: 'vertical',
            //     x: 'left',
            //     data: ['系统服务', '账号配置', '防火墙', '审计配置', 'SQL注入', 'DDos', '自定义']
            // },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
                {
                    name:'策略类型',
                    type:'pie',
                    selectedMode: 'single',
                    radius: ['40%', '60%'],
        
                    label: {
                        normal: {
                            // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            formatter: '{b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                // abg: {
                                //     backgroundColor: '#333',
                                //     width: '100%',
                                //     align: 'right',
                                //     height: 22,
                                //     borderRadius: [4, 4, 0, 0]
                                // },
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
                    // data:[
                    //     {value:335, name:'系统服务', selected:true},
                    //     {value:679, name:'账号配置'},
                    //     {value:1548, name:'防火墙'},
                    //     {value:335, name:'审计配置'},
                    //     {value:879, name:'SQL注入'},
                    //     {value:435, name:'DDos'},
                    //     {value:179, name:'自定义'},
                    // ]
                },

            ]

        };
    }

    getResultsCB = (data) => {
        const result = data.payload;
        let sourceDatas = [];

        for (let i = 0; i < result.length; i++) {
            let pName = result[i].policie_name;
            let pNum = result[i].num;
            
            let myMap = {};
            if (i == 0) {
                myMap = {'value' : pNum, 'name' : pName, 'selected' : true};
            } else {
                myMap = {'value' : pNum, 'name' : pName};
            }
            sourceDatas.push(myMap);

        }

        console.log(sourceDatas);
               
        this.setState({
            pieSourceData: sourceDatas,
        });

    }
    
    getTaskStatistics() {
        return HttpRequest.asyncGet(this.getResultsCB, '/tasks/results/policie-statistics');
    }


    onChartClick(param, echarts) {
        console.log(param)
    }

    render() {
        let onEvents = {
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

RiskPie.propTypes = {
    classes: PropTypes.object.isRequired,
};

RiskPie.contextTypes = {
    router: PropTypes.object.isRequired
};

export default withStyles(styles)(RiskPie);

