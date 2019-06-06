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

class OskPie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAccID: -1,
            usersDataReady: false,
            sysSourceData: []
        }
        this.getTaskStatistics();
    }

    getOption() {
        const { sysSourceData } = this.state;
        return {
            title: { text: '操作系统分布' },
            legend: {
                // orient: 'vertical',
                bottom: 2,
                //data: ['WinServer', 'Kali2', 'Centos7', 'Ubuntu', 'Debian', 'Centos6']
            },
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
                    data: sysSourceData
                    // data:[
                    //     {value:335, name:'WinServer', selected:true},
                    //     {value:435, name:'Centos6'},
                    //     {value:679, name:'Kali2'},
                    //     {value:335, name:'Ubuntu'},
                    //     {value:879, name:'Debian'},
                    //     {value:1548, name:'Centos7'},
                    // ]
                },

            ]

        };
    }
    
    getResultsCB = (data) => {
        const result = data.payload;
        let sourceDatas = [];

        for (let i = 0; i < result.length; i++) {
            let sysType = result[i].os_type;
            // osType 1:Windows系统; 2:Linux系统
            if ('1' === sysType) {
                sysType = 'Windows系统';
            } else if ('2' === sysType) {
                sysType = 'Linux系统';
            }
            let pNum = result[i].num;
            
            let myMap = {};
            if (i == 0) {
                myMap = {'value' : pNum, 'name' : sysType, 'selected' : true};
            } else {
                myMap = {'value' : pNum, 'name' : sysType};
            }
            sourceDatas.push(myMap);

        }

        console.log(sourceDatas);
               
        this.setState({
            sysSourceData: sourceDatas,
        });

    }
    
    getTaskStatistics() {
        return HttpRequest.asyncGet(this.getResultsCB, '/tasks/results/sys-statistics');
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

OskPie.propTypes = {
    classes: PropTypes.object.isRequired,
};

OskPie.contextTypes = {
    router: PropTypes.object.isRequired
};

export default withStyles(styles)(OskPie);

