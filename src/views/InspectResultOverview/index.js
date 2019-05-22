import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react'
import { userType } from '../../global/enumeration/UserType'

import { Row, Col } from 'antd'

import RiskTypeBar from './RiskTypeBar'
import RiskPie from './RiskPie'
import OsPie from './OsPie'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
    shade: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#808080',
        opacity: 0.95,
        display: 'block',
        zIndex: 999,
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
                {!this.hasModifyRight() && <div className={classes.shade} style={{ filter: "blur(5px)" }}></div>}
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
            </div>
        );

    }
}

InspectResultOverview.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(InspectResultOverview);