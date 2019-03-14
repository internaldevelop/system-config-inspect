import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Draggable from '../../components/window/Draggable'
import { observer, inject } from 'mobx-react'
import { Modal, Row, Col } from 'antd';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

@inject('policyStore')
@observer
class PolicyParamsConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionName: this.props.action,
            onClose: this.props.onclose,
            // show: this.props.showconfig,
        }
    }

    handleOk = (e) => {
        this.state.onClose();
        // this.setState({ show: false });
    }

    handleCancel = (e) => {
        this.state.onClose();
    }

    handleParamsChange = name => (event) => {
        this.props.policyStore.setParam(name, event.target.value);
    };

    render() {
        // const { show } = this.state;
        // if (this.props.showconfig !== show)
        //     this.setState({ show: this.props.showconfig });
        const modalTitle = <Draggable title={this.props.action} />;
        const { name, group, type, riskLevel, solution } = this.props.policyStore.policyItem;

        return (
            <Modal
                title={modalTitle}
                style={{ top: 20 }}
                maskClosable={false}
                destroyOnClose={true}
                visible={true}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <div>
                    <TextField required fullWidth autoFocus id="policy-name" label="策略名称" defaultValue={name}
                        variant="outlined" margin="normal" onChange={this.handleParamsChange("name")}
                    />
                    <TextField required fullWidth autoFocus id="group" label="分组" defaultValue={group}
                        variant="outlined" margin="normal" onChange={this.handleParamsChange("group")}
                    />
                    <Row>
                        <Col span={11}>
                            <TextField required id="type" label="类型" defaultValue={type}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("type")}
                            />
                        </Col>
                        <Col span={11} offset={2}>
                            <TextField required id="risk-level" label="危险等级" defaultValue={riskLevel}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("riskLevel")}
                            />
                        </Col>
                    </Row>
                    <TextField required fullWidth autoFocus id="solution" label="解决方案" defaultValue={solution}
                        variant="outlined" margin="normal" onChange={this.handleParamsChange("solution")}
                        rows={5} multiline={true}
                    />
                </div>
            </Modal>
        )
    }
}

PolicyParamsConfig.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(PolicyParamsConfig);
