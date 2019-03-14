import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Row, Col } from 'antd'

import RiskTypeBar from './RiskTypeBar'
import RiskPie from './RiskPie'
import OsPie from './OsPie'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

class InspectResultOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // columns: Column,
            // resultRecordData: ResultData,
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <RiskTypeBar />
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <RiskPie />
                    </Col>
                    <Col span={11} offset={2}>
                        <OsPie />
                    </Col>
                </Row>
            </div>
        );

    }
}

InspectResultOverview.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(InspectResultOverview);