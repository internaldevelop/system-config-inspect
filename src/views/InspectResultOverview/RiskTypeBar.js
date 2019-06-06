import React, { Component } from 'react';
import { Modal } from 'antd'
import ReactEcharts from 'echarts-for-react';
// import echarts from 'echarts';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import HttpRequest from '../../utils/HttpRequest';
// import PolicyResultsView from './PolicyResultsView'


const styles = theme => ({
    root: {
        width: '90%',
    },

});

class RiskTypeBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAccID: -1,
            usersDataReady: false,
            dimensionsData: [],
            sourceData: [],
            seriesBar:[]
        }
        this.getTaskStatistics();
    }
    

    getOption() {
        const { dimensionsData, sourceData, seriesBar } = this.state;
                        
        return {
            title: { text: '检测结果' },
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
            xAxis: {
                type: 'category',
                // "axisLabel":{
                //     interval: 0
                // }
            },
            yAxis: {},
            series: seriesBar
            // series: [
            //     {type: 'bar'},
            //     {type: 'bar'},
            // ]

        };
    }
    
    getResultsCB = (data) => {
        const result = data.payload;
        let strSysType = 'product';

        let policieName = '';  // 策略名
        let sourceDatas = [];
        let serBar = [];
        for (let i = 0; i < result.length; i++) {
            let osType = result[i].os_type;
            // osType 1:Windows系统; 2:Linux系统
            if ('1' === osType) {
                osType = 'Windows系统';
            } else if ('2' === osType) {
                osType = 'Linux系统';
            }
            let pName = result[i].policy_group_name;
            
            if (strSysType.indexOf(osType) < 0) {
                strSysType += ',';
                strSysType += osType;
                
                let sBar = {'type' : 'bar'};
                serBar.push(sBar);
            }
            if (policieName.indexOf(pName) < 0) {
                
                if (0 < policieName.length) {
                    policieName += ',';
                }
                policieName += pName;

                let myMap = {'product' : pName};
                sourceDatas.push(myMap);
            }
        }
        let sysTypeData = strSysType.split(',');
        console.log(sourceDatas);
        
        for (let i = 0; i < result.length; i++) {
            let osType = result[i].os_type;
            // osType 1:Windows系统; 2:Linux系统
            if ('1' === osType) {
                osType = 'Windows系统';
            } else if ('2' === osType) {
                osType = 'Linux系统';
            }
            let pName = result[i].policy_group_name;
            let pNum = result[i].num;
            
            sourceDatas.forEach(v=>{
                
                if(v.product === pName) {
                    v[osType] = pNum;
                }
            });
        }

        console.log('1111111111' + sysTypeData);
        console.log('2222222222' + sourceDatas);
        console.log('3333333333' + serBar);
               
        this.setState({
            dimensionsData: sysTypeData,
            sourceData: sourceDatas,
            seriesBar: serBar
        });
    }

    getTaskStatistics() {
        return HttpRequest.asyncGet(this.getResultsCB, '/tasks/results/statistics-group');
    }

    onChartClick(param,echarts){
        // console.log(param.seriesName);
        // console.log(param.name);
        // Modal.info({
        //     keyboard: true,         // 是否支持键盘 esc 关闭
        //     destroyOnClose: true,   // 关闭时销毁 Modal 里的子元素
        //     closable: false,         // 是否显示右上角的关闭按钮
        //     width: 520, 
        //     content: <PolicyResultsView taskuuid={'e3267d8b-b737-4822-b866-4035c67ab133'}/>,
        //     onOk() {
        //         // message.info('OK');
        //     },
        // });
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

