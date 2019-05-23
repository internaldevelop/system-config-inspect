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

    hasModifyRight = () => {
        const { userGroup } = this.props.userStore.loginInfo;
        if (userGroup !== userType.TYPE_ADMINISTRATOR) {
            return true;
        }
        return false;
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Skeleton loading={!this.hasModifyRight()} active avatar>
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
                </Skeleton>
            </div>
        );

    }
}

InspectResultOverview.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(InspectResultOverview);