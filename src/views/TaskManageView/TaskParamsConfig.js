import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Modal, Steps, Button, Row, Col } from 'antd';

import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { observer, inject } from 'mobx-react'

import Draggable from '../../components/window/Draggable'

import HttpRequest from '../../utils/HttpRequest';
import { errorCode } from '../../global/error';


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
@observer
class TaskParamsConfig extends React.Component {

  constructor(props) {
    super(props);
    // const configItem = this.props.taskStore.configItem;
    this.state = {
      current: 0,
      // configItem: configItem,
    };
  }

  verifyAssetParams = (data) => {
    const taskStore = this.props.taskStore;
    if (data.code === errorCode.ERROR_OK) {
      this.props.taskStore.setParam("assetUuid", data.payload.asset_uuid);
    }
  }

  handleAssetChange = event => {
    //
}

  handleOk = (e) => {
    // const { configItem } = this.props.taskStore;
    // configItem.index = this.props.taskStore.configItem.index;
    // this.props.taskStore.updateTaskParams(configItem);
    const { assetUuid, hostName, hostIP, hostPort, loginUser, loginPwd, osType, osVer } = this.props.taskStore.configItem;
    if (this.props.taskStore.taskAction === 1) {
      HttpRequest.asyncPost(this.verifyAssetParams, '/assets/add', { name: hostName, ip: hostIP, port: hostPort, user: loginUser, password: loginPwd, os_type: osType, os_ver: osVer }, false);
      this.props.taskStore.setAddStatus();
    } else if (this.props.taskStore.taskAction === 2) {
      HttpRequest.asyncPost(this.handleAssetChange, '/assets/update', { uuid: assetUuid, name: hostName, ip: hostIP, port: hostPort, user: loginUser, password: loginPwd, os_type: osType, os_ver: osVer }, false);
      this.props.taskStore.setChangeStatus();
    }
    this.props.taskStore.switchShow(false);
  }

  handleCancel = (e) => {
    this.props.taskStore.clearStatus();
    this.props.taskStore.switchShow(false);
  }

  moveStep = (move) => {
    const current = this.state.current + move;
    this.setState({ current });
  }

  handleTaskParamsChange = name => (event) => {
    this.props.taskStore.setParam(name, event.target.value);
    // const { configItem } = this.props.taskStore;
    // configItem[name] = event.target.value;
    // this.setState({ configItem });
  };

  StepBaseInfo = () => {
    const { taskName, taskDesc } = this.props.taskStore.configItem;
    return (
      <form>
        <TextField required fullWidth autoFocus margin="normal"
          id="task-name" label="任务名称" defaultValue={taskName} variant="outlined"
          onChange={this.handleTaskParamsChange("taskName")}
        />
        <TextField fullWidth margin="normal" multiline
          id="task-desc" label="任务描述" defaultValue={taskDesc} variant="outlined" rows="4"
          onChange={this.handleTaskParamsChange("taskDesc")}
        />
      </form>
    );
  }

  StepAssetInfo = () => {
    const { hostName, hostIP, hostPort, loginUser, loginPwd, osType, osVer } = this.props.taskStore.configItem;
    return (
      <div>
        <form>
          <TextField required fullWidth autoFocus id="host-name" label="主机名称" defaultValue={hostName}
            variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("hostName")}
          />
          <Row>
            <Col span={11}>
              <TextField required id="host-ip" label="主机IP" defaultValue={hostIP}
                variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("hostIP")}
              />
            </Col>
            <Col span={11} offset={2}>
              <TextField required id="host-port" label="端口" defaultValue={hostPort}
                variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("hostPort")}
              />
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <TextField required fullWidth id="login-user" label="用户名" defaultValue={loginUser}
                variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("loginUser")}
              />
            </Col>
            <Col span={11} offset={2}>
              <TextField required fullWidth id="login-pwd" label="登录密码" defaultValue={loginPwd} type="password"
                variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("loginPwd")}
              />
            </Col>
          </Row>
          <TextField required fullWidth id="system-type" label="系统类型" defaultValue={osType}
            variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("osType")}
          />
          <TextField required fullWidth id="system-ver" label="系统版本" defaultValue={osVer}
            variant="outlined" margin="normal" onChange={this.handleTaskParamsChange("osVer")}
          />
        </form>
      </div>
    );
  }

  handleConfigChange = name => event => {
    this.props.taskStore.setParam(name, event.target.checked);
    // const { configItem } = this.props.taskStore;
    // configItem[name] = event.target.checked;
    // this.setState({ configItem: configItem });
  };

  getConfigCtrl(name, label) {
    const { configItem } = this.props.taskStore;
    return (
      <FormControlLabel
        control={
          <Checkbox
            // color="green"
            checked={configItem[name]}
            onChange={this.handleConfigChange(name)}
            value={"configItem-" + name}
          />
        }
        label={label}
      />
    );
  }

  StepPolicyConfig = () => {
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
    if (taskStore.taskAction <= 0)
      return <div></div>;

    const modalTitle = <Draggable title={taskStore.taskProcName} />;

    return (
      <Modal
        // title={taskStore.taskProcName}
        title={modalTitle}
        visible={taskStore.taskPopupShow}
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

