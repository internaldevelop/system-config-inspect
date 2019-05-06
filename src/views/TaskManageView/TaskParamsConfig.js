import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Modal, Steps, Button, Row, Col, message } from 'antd';

import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { observer, inject } from 'mobx-react'

import Draggable from '../../components/window/Draggable'

import HttpRequest from '../../utils/HttpRequest';
import { errorCode } from '../../global/error';
import { actionType } from '../../global/enumeration/ActionType';
import { eng2chn } from '../../utils/StringUtils'


const styles = theme => ({
  stepsContent: {
    marginTop: theme.spacing.unit,
    border: '1px dashed #e9e9e9',
    borderRadius: '6px',
    backgroundColor: '#fafafa',
    minHeight: '400px',
    // textAlign: 'center',
    // paddingTop: '80px',
  },
  stepsAction: {
    marginTop: theme.spacing.unit,
  },
});

const Step = Steps.Step;

@inject('taskStore')
@inject('userStore')
@observer
class TaskParamsConfig extends React.Component {

  constructor(props) {
    super(props);
    // const taskItem = this.props.taskStore.taskItem;
    this.state = {
      current: 0,
      // taskItem: taskItem,
    };
  }

  requestTaskCB = (action) => (data) => {
    let actionCB = this.props.actioncb;
    let successInfo;

    if (action === 'new') {
      successInfo = "任务创建成功";
    } else if (action === 'update') {
      successInfo = "任务资料更新成功";
    } else {
      successInfo = "操作成功";
    }

    if (data.code === errorCode.ERROR_OK) {
      message.info(successInfo);
      this.props.taskStore.setParam("uuid", data.payload.uuid);
      // 调用父组件传入的回调函数，第一个参数 true 表示本组件的参数设置已确认，且任务记录已在后台创建或更新
      actionCB(true, {});
    } else {
      message.error(eng2chn(data.error));
      // 后台创建任务记录失败，则用参数 false 通知父组件不更新页面
      actionCB(false, {});
    }
  }

  handleAssetChange = event => {
    //
  }
  handleTaskChange = event => {
    //
  }

  handleOk = (e) => {
    const { asset_uuid, asset_name, asset_ip, asset_port, asset_login_user, asset_login_pwd, asset_os_type, asset_os_ver } = this.props.taskStore.taskItem;
    const { uuid, name, description, code } = this.props.taskStore.taskItem;
    const { userUuid } = this.props.userStore.loginUser;
    if (this.props.taskStore.taskAction === actionType.ACTION_NEW) {
      // 向后台发送请求，创建一条新的任务记录
      HttpRequest.asyncPost(this.requestTaskCB('new'), '/tasks/add-task-details',
        {
          name, code: "TODO", description, policies_name: "TODO", create_user_uuid: userUuid,
          asset_name, asset_ip, asset_port, asset_os_type, asset_os_ver, asset_login_user, asset_login_pwd,
        },
        false
      );
    } else if (this.props.taskStore.taskAction === actionType.ACTION_EDIT) {
      // 向后台发送请求，更新任务数据
      HttpRequest.asyncPost(this.requestTaskCB('update'), '/tasks/update-task-details',
        {
          uuid, name, code: "TODO", description, policies_name: "TODO", create_user_uuid: userUuid,
          asset_name, asset_ip, asset_port, asset_os_type, asset_os_ver, asset_login_user, asset_login_pwd,
        },
        false
      );
    }
  }

  handleCancel = (e) => {
    let actionCB = this.props.actioncb;
    // 调用父组件传入的回调函数，第一个参数 false 表示本组件的参数设置被取消 cancel
    actionCB(false, {});
  }

  moveStep = (move) => {
    const current = this.state.current + move;
    this.setState({ current });
  }

  handleTaskParamsChange = name => (event) => {
    this.props.taskStore.setParam(name, event.target.value);
  };

  StepBaseInfo = () => {
    const { name, description } = this.props.taskStore.taskItem;
    return (
      <form>
        <TextField required fullWidth autoFocus margin="normal"
          id="task-name" label="任务名称" defaultValue={name} variant="outlined"
          onChange={this.handleTaskParamsChange("name")}
        />
        <TextField fullWidth margin="normal" multiline
          id="task-desc" label="任务描述" defaultValue={description} variant="outlined" rows="4"
          onChange={this.handleTaskParamsChange("description")}
        />
      </form>
    );
  }

  StepAssetInfo = () => {
    const { asset_name, asset_ip, asset_port, asset_login_user, asset_login_pwd, asset_os_type, asset_os_ver } = this.props.taskStore.taskItem;
    return (
      <div>
        <form>
          <TextField required fullWidth autoFocus id="host-name" label="主机名称" defaultValue={asset_name}
            variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("asset_name")}
          />
          <Row>
            <Col span={11}>
              <TextField required id="host-ip" label="主机IP" defaultValue={asset_ip}
                variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("asset_ip")}
              />
            </Col>
            <Col span={11} offset={2}>
              <TextField required id="host-port" label="端口" defaultValue={asset_port}
                variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("asset_port")}
              />
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <TextField required fullWidth id="login-user" label="用户名" defaultValue={asset_login_user}
                variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("asset_login_user")}
              />
            </Col>
            <Col span={11} offset={2}>
              <TextField required fullWidth id="login-pwd" label="登录密码" defaultValue={asset_login_pwd} type="password"
                variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("asset_login_pwd")}
              />
            </Col>
          </Row>
          <TextField required fullWidth id="system-type" label="系统类型" defaultValue={asset_os_type}
            variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("asset_os_type")}
          />
          <TextField required fullWidth id="system-ver" label="系统版本" defaultValue={asset_os_ver}
            variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("asset_os_ver")}
          />
        </form>
      </div>
    );
  }

  handlePolicyChange = code => event => {
    if (event.target.checked) {
      this.addPolicy(code);
    } else {
      this.removePolicy(code);
    }
  };

  isPolicyExist(policyCode) {
    const { policies_name } = this.props.taskStore.taskItem;
    // 把 policy 字符串转换成JSON，并检查是否为JSONArray
    const policies = JSON.parse(policies_name);
    if (!(policies instanceof Array))
      return false;

    // 在JSONArray中查找是否已存在指定 policy
    policies.forEach(element => {
      if (element.code === policyCode)
        return true;
    });

    return false;
  }

  addPolicy(policyCode) {
    // 如果 policy 已存在，则不进行添加
    if (this.isPolicyExist(policyCode))
      return;

    const { policies_name } = this.props.taskStore.taskItem;
    const policies = JSON.parse(policies_name);

  }
  removePolicy(policyCode) {
    // 如果 policy 不存在，则不进行移除操作
    if (!this.isPolicyExist(policyCode))
      return;

  }

  getConfigCtrl(code, name) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            // color="green"
            checked={this.isPolicyExist(code)}
            onChange={this.handlePolicyChange(code)}
            value={code}
          />
        }
        label={name}
      />
    );
  }

  StepPolicyConfig = () => {
    let tempPolicies_name = JSON.stringify([
      {
        uuid: '410cc17e-aa4f-4514-9256-005deb7b8bc8',
        code: 'LinuxPatchInstall',
        name: 'Linux系统补丁安装',
      },
      {
        uuid: '5aa4e0dc-2019-49c1-885b-925bac3238d0',
        code: 'UserAccountConfig',
        name: '用户账号配置',
      },
    ]);
    this.props.taskStore.setParam("policies_name", tempPolicies_name);

    return (
      <div>
        <FormGroup row>
          {this.getConfigCtrl('patch', "操作系统补丁安装")}
          {this.getConfigCtrl('sysService', "操作系统服务")}
          {this.getConfigCtrl('sysFileProtect', "操作系统文件安全防护")}
          {this.getConfigCtrl('accountConfig', "用户账号配置")}
          {this.getConfigCtrl('pwdPolicy', "口令配置策略")}
          {this.getConfigCtrl('commConfig', "网络通信配置")}
          {this.getConfigCtrl('logAudit', "日志审计配置")}
          {this.getConfigCtrl('securityAudit', "安全审计")}
          {this.getConfigCtrl('firewall', "系统防火墙安全")}
          {this.getConfigCtrl('selfDefined', "自定义安全配置")}
        </FormGroup>
      </div>
    );
  }

  render() {
    const { current } = this.state;
    const { classes } = this.props;
    const taskStore = this.props.taskStore;
    const steps = [{
      title: '基本信息',
      content: this.StepBaseInfo(),
    }, {
      title: '资产识别',
      content: this.StepAssetInfo(),
    }, {
      title: '规则配置',
      content: this.StepPolicyConfig(),
    }];

    // 本行代码利用store监视机制，对话框显示时调用render函数，从而实现更新页面数据
    // if (taskStore.taskAction <= 0)
    // return <div></div>;

    const modalTitle = <Draggable title={taskStore.taskProcName} />;

    return (
      <Modal
        // title={taskStore.taskProcName}
        title={modalTitle}
        // visible={taskStore.taskPopupShow}
        visible={true}
        style={{ top: 20 }}
        maskClosable={false}
        footer={null}
        // onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className={classes.stepsContent}>{steps[current].content}</div>
          <div className={classes.stepsAction}>
            <Row gutter={16}>
              <Col span={6}>
                {
                  current > 0 && (
                    <Button style={{ marginLeft: 8 }} onClick={() => this.moveStep(-1)}>
                      上一步
                    </Button>)
                }
              </Col>
              <Col span={6}>
                {
                  current < steps.length - 1
                  && <Button style={{ marginLeft: 8 }} type="secondary" onClick={() => this.moveStep(1)}>下一步</Button>
                }
              </Col>
              <Col span={6}>
                {<Button type="secondary" style={{ marginLeft: 8 }} onClick={this.handleCancel}>取消</Button>}
              </Col>
              <Col span={6}>
                {<Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleOk}>完成</Button>}
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    )
  }
}

TaskParamsConfig.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(TaskParamsConfig);

