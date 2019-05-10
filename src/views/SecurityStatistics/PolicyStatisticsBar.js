import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import HttpRequest from '../../utils/HttpRequest';

const styles = theme => ({
    root: {
        width: '90%',
    },

});

class PolicyStatisticsBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAccID: -1,
            usersDataReady: false,
            dimensionsData: [],
            sourceData: [],
            seriesBar:[],
            code:1,
        }
        const {code} = this.props;
        this.getTaskStatistics(code);
    }

    // componentWillReceiveProps周期是存在期用改变的props
    componentWillReceiveProps(nextProps) {
        const newCode = nextProps.code
        this.getTaskStatistics(newCode);  // 刷新页面
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
            xAxis: {type: 'category'},
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
            let pName = result[i].policie_name;
            
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
            let pName = result[i].policie_name;
            let pNum = result[i].num;
            
            sourceDatas.forEach(v=>{
                
                if(v.product === pName) {
                    v[osType] = pNum;
                }
            });
        }

        console.log(sysTypeData);
        console.log(sourceDatas);
        console.log(serBar);
               
        this.setState({
            dimensionsData: sysTypeData,
            sourceData: sourceDatas,
            seriesBar: serBar
        });
    }

    getTaskStatistics(code) {
        console.log('code:' + code);
        return HttpRequest.asyncGet(this.getResultsCB, '/tasks/results/statistics');
    }

    onChartClick(param,echarts){
        console.log(param)
    }

    render() {
        let onEvents={
            'click': this.onChartClick.bind(this)
        }
        return (
            <div>
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

PolicyStatisticsBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

PolicyStatisticsBar.contextTypes = {
    router: PropTypes.object.isRequired
};

export default withStyles(styles)(PolicyStatisticsBar);

