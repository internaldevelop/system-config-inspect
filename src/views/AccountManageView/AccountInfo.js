import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Row, Col } from 'antd'

import AccountCard from './AccountCard'
import { GetAccountByIndex, FetchAllAcounts } from '../../modules/data/account'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

class AccountInfo extends React.Component {
    constructor(props) {
        super(props);

        FetchAllAcounts();
        this.state = {
            account: GetAccountByIndex(1),
        };
    }

    render() {
        const { account } = this.state;
        return (
            <Row>
                <Col span={16} offset={4}>
                    <AccountCard accindex={account.index} manage={0} />
                </Col>
            </Row>
        );
    }
}

AccountInfo.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(AccountInfo);