import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Row, Col } from 'antd';
import { observer, inject } from 'mobx-react'
import { userType } from '../../global/enumeration/UserType'
// import UserStore from '../../main/store/UserStore';
import { withRouter } from 'react-router-dom'


import UserCard from './UserCard'
import HttpRequest from '../../utils/HttpRequest';

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

@withRouter
@observer
@inject('userStore')
class UserInfoView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            userDataReady: false,
        };
        this.getLoginUser();
    }

    getLoginUserUuid() {
        const userStore = this.props.userStore;
        return userStore.loginUser.userUuid;
        // return '4bac0683-a076-41ba-a12b-ba4078f52dac';
    }

    getLoginUserCB = (data) => {
        this.setState({
            user: data.payload,
            userDataReady: true,
        });
    }

    getLoginUser() {
        let userUuid = this.getLoginUserUuid();
        HttpRequest.asyncGet(this.getLoginUserCB, '/users/user-by-uuid', { uuid: userUuid });
    }

    hasModifyRight = () => {
        const { userGroup } = this.props.userStore.loginInfo;
        if (userGroup !== userType.TYPE_AUDITOR) {
            return true;
        }
        return false;
    }

    render() {
        const { user, userDataReady } = this.state;
        const { classes } = this.props;
        return (
            <div>
                {!this.hasModifyRight() && <div className={classes.shade} style={{ filter: "blur(5px)" }}></div>}
                <div>
                    {
                        userDataReady &&
                        <Row>
                            <Col span={16} offset={4}>
                                <UserCard uuid={user.uuid} manage={0} />
                            </Col>
                        </Row>
                    }
                </div>
            </div>
        );
    }
}

UserInfoView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(UserInfoView);