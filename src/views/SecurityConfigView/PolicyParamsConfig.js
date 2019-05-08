import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import Draggable from '../../components/window/Draggable'
import { observer, inject } from 'mobx-react'
import { Modal, Row, Col, message } from 'antd';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import HttpRequest from '../../utils/HttpRequest'
import { errorCode } from '../../global/error';
import { actionType } from '../../global/enumeration/ActionType';
import { eng2chn } from '../../utils/StringUtils'

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

@inject('policyStore')
@inject('dictStore')
@observer
class PolicyParamsConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionName: this.props.action,
            onClose: this.props.onclose,
            // groupsList: this.props.dictStore.policyGroupsList,
            // selectedPolicy: '',
            group: '',
            // show: this.props.showconfig,
        }
    }

    requestTaskCB = (action) => (data) => {
        let actionCB = this.props.actioncb;
        let successInfo;
    
        if (action === 'new') {
          successInfo = "策略创建成功";
        } else if (action === 'update') {
          successInfo = "策略更新成功";
        } else {
          successInfo = "操作成功";
        }
    
        if (data.code === errorCode.ERROR_OK) {
          message.info(successInfo);
          this.props.policyStore.setParam("uuid", data.payload.uuid);
          // 调用父组件传入的回调函数，第一个参数 true 表示本组件的参数设置已确认，且策略记录已在后台创建或更新
          actionCB(true, {});
        } else {
          message.error(eng2chn(data.error));
          // 后台创建策略记录失败，则用参数 false 通知父组件不更新页面
          actionCB(false, {});
        }
      }

    handleCancel = (e) => {
        let actionCB = this.props.actioncb;
        // 调用父组件传入的回调函数，第一个参数 false 表示本组件的参数设置被取消 cancel
        actionCB(false, {});
    }


    handleOk = (e) => {
        const { uuid, name, risk_level, code, solutions } = this.props.policyStore.policyItem;
        if (this.props.policyStore.policyAction === actionType.ACTION_NEW) {
          // 向后台发送请求，创建一条新的策略记录
          HttpRequest.asyncPost(this.requestTaskCB('new'), '/policies/add',
            {
              name, code: "TODO", risk_level, solutions,
            },
            false
          );
        } else if (this.props.policyStore.policyAction === actionType.ACTION_EDIT) {
          // 向后台发送请求，更新策略数据
          HttpRequest.asyncPost(this.requestTaskCB('update'), '/policies/update',
            {
              uuid, name, code: "TODO", risk_level, solutions,
            },
            false
          );
        }
    }

    handleParamsChange = name => (event) => {
        this.props.policyStore.setParam(name, event.target.value);
    };

    handleSelectChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { classes } = this.props;
        const policyStore = this.props.policyStore;
        // const { show } = this.state;
        // if (this.props.showconfig !== show)
        //     this.setState({ show: this.props.showconfig });
        const modalTitle = <Draggable title={policyStore.policyProcName} />;
        const { name, group, type, riskLevel, solution } = this.props.policyStore.policyItem;
        const { policyGroupsList } = this.props.dictStore;

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
                <form className={classes.root} autoComplete="off">
                    {/* <div> */}
                    <TextField required fullWidth autoFocus id="policy-name" label="策略名称" defaultValue={name}
                        variant="outlined" margin="normal" onChange={this.handleParamsChange("name")}
                    />
                    <FormControl required variant="outlined" style={{ width: '100%' }}>
                        <Select
                            value={this.state.group}
                            onChange={this.handleSelectChange}
                            input={
                                <OutlinedInput
                                    // labelWidth="100%"
                                    name="group"
                                    id="outlined-group"
                                />
                            }
                        >
                            {policyGroupsList.map(group => (
                                <MenuItem value={group.uuid}>{group.name}</MenuItem>
                            ))}
                        </Select>
                        <InputLabel htmlFor="outlined-group">分组</InputLabel>
                    </FormControl>
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
                    {/* </div> */}
                </form>
            </Modal>
        )
    }
}

PolicyParamsConfig.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(PolicyParamsConfig);
