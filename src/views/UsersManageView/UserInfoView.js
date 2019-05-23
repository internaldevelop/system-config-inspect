import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Skeleton, Row, Col } from 'antd';
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
        return (
            <div>
                <Skeleton loading={!this.hasModifyRight()} active avatar>
                    {
                        userDataReady &&
                        <Row>
                            <Col span={16} offset={4}>
                                <UserCard uuid={user.uuid} manage={0} />
                            </Col>
                        </Row>
                    }
                </Skeleton>
            </div>
        );
    }
}

UserInfoView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(UserInfoView);