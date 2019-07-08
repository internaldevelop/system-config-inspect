import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, Skeleton, Table, Icon, Button, Row, Col, Popconfirm, Progress, message, Modal } from 'antd'

import HttpRequest from '../../utils/HttpRequest';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class AssetAnalysisView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div>
                <Card title="资产扫描">
                </Card>

            </div>
        );
    }
}

AssetAnalysisView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(AssetAnalysisView);
