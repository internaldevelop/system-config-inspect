import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react'
import { userType } from '../../global/enumeration/UserType'

import { Skeleton, Row, Col } from 'antd'

import RiskTypeBar from './RiskTypeBar'
import RiskPie from './RiskPie'
import OsPie from './OsPie'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

@observer
@inject('userStore')
class InspectResultOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // columns: Column,
            // resultRecordData: ResultData,
        }
    }

    render() {
        const { classes } = this.props;
        const userStore = this.props.userStore;
        return (
            <div>
                <Skeleton loading={userStore.isAdminUser} active avatar>
                    <Row>
                        <Col span={24}>
                            <RiskTypeBar />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={17}>
                            <RiskPie />
                        </Col>
                        <Col span={6} offset={1}>
                            <OsPie />
                        </Col>
                    </Row>
                </Skeleton>
            </div>
        );

    }
}

InspectResultOverview.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(InspectResultOverview);