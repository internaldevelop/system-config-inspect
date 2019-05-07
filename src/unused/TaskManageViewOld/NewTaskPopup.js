import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Modal } from 'antd';

// import TaskConfig from './TaskParamsConfig'
import TaskParamsConfig from './TaskParamsConfig'

import { observer, inject } from 'mobx-react'


const styles = theme => ({
    root: {
        width: '90%',
    },

});

@inject('taskStore')
@observer
class NewTaskPopup extends React.Component {
    constructor(props) {
        const { visible } = props;
        super(props)
        this.state = {
            visible: visible,
        }
    }

    handleOk = (e) => {
        this.props.taskStore.switchShow(false);
    }

    handleCancel = (e) => {
        this.props.taskStore.switchShow(false);
    }

    render() {
        return (
            <Modal
                title={this.props.taskStore.taskProcName}
                visible={this.props.taskStore.taskPopupShow}
                style={{ top: 20 }}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <TaskParamsConfig />
            </Modal>
        )
    }
}

NewTaskPopup.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(NewTaskPopup);
