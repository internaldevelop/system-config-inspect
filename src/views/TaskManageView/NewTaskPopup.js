import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Modal, Button } from 'antd';

import TaskConfig from './TaskConfig'

const styles = theme => ({
    root: {
        width: '90%',
    },

});

class NewTaskPopup extends React.Component {
    constructor(props) {
        const { visible } = props;
        super(props)
        this.state = {
            visible: visible,
        }
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const { visible } = this.props;
        return (
            <Modal
                title="新建任务"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <TaskConfig />
            </Modal>
        )
    }
}

NewTaskPopup.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(NewTaskPopup);
