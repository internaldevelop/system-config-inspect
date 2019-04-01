import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Row, Col } from 'antd';

import UserCard from './UserCard'
import HttpRequest from '../../utils/HttpRequest';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

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
        return '4bac0683-a076-41ba-a12b-ba4078f52dac';
    }

    getLoginUserCB = (payload) => {
        this.setState({
            user: payload,
            userDataReady: true,
        });
    }

    getLoginUser() {
        let userUuid = this.getLoginUserUuid();
        HttpRequest.asyncGet(this.getLoginUserCB, '/users/user-by-uuid', { uuid: userUuid });
    }

    render() {
        const { user, userDataReady } = this.state;
        return (
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
        );
    }
}

UserInfoView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(UserInfoView);