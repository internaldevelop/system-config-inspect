import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, DatePicker, Col, Row, Table, Layout, Select, Input, Button } from 'antd';
import moment from 'moment';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class ExceptionLogsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // resultData: [],
            // policyList: [],
            // beginTime: '2019-01-01 00:00:00',
            // endTime: GetNowTimeMyStr(),
            // scanResult: '',
            // scrollWidth: 2000,        // 表格的 scrollWidth
            // scrollHeight: 300,      // 表格的 scrollHeight
            // loading: false,     // 表格数据在加载完成前为 true，加载完成后是 false
            // selectedPolicies: '',
        };

        // this.queryPolicies();

        // this.queryResultHistory();
    };

    render() {
        return (
            <div>
                建设中 ... ...

            </div>
        );
    }

}

ExceptionLogsView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(ExceptionLogsView);

