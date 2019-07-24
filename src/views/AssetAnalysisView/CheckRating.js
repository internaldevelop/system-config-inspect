import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, Skeleton, Progress, Row, Col } from 'antd';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class CheckRating extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rating: 0.0,
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

        let total = 0;
        let success = 0;
        for (let stat of stats) {
                if (parseInt(stat['risk_level']) === 0) {
                    success += parseInt(stat['count']);
                }
                total += parseInt(stat['count']);
        }

        let rating = success * 100.0 / total;
        this.setState({ rating, ready: true });
    }
    clearResult = (groupName) => {
        this.setState({ rating: 0.0, ready: false });
    }

    render() {
        const { rating, ready } = this.state;
        return (
            <div>
                <Progress strokeLinecap="square" type="circle" percent={rating}
                    format={percent => ready ? percent.toFixed(1) + '分' : '无'}
                />
            </div>
        );
    }
}

CheckRating.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(CheckRating);
