import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Modal, Steps, Button, message, Row, Col } from 'antd';

import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { observer, inject } from 'mobx-react'


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
    const configItem = Object.assign({}, this.props.taskStore.configItem);
    this.state = {
      current: 0,
      configItem: configItem,
    };
  }

  handleOk = (e) => {
    const { configItem } = this.state;
    this.props.taskStore.setTaskParams(configItem, true);
    this.props.taskStore.switchShow(false);
  }

  handleCancel = (e) => {
    this.props.taskStore.switchShow(false);
  }

  moveStep = (move) => {
    const current = this.state.current + move;
    this.setState({ current });
  }

  handleTaskParamsChange = name => (event) => {
    const { configItem } = this.state;
    configItem[name] = event.target.value;
    // this.setState({ configItem });
  };

  StepBaseInfo = () => {
    const { taskName, taskDesc } = this.state.configItem;
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
    const { hostName, hostIP, hostPort, loginUser, loginPwd, osType, osVer } = this.state.configItem;
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
    const { configItem } = this.state;
    configItem[name] = event.target.checked;
    this.setState({ configItem: configItem });
  };

  getConfigCtrl(name, label) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            // color="green"
            checked={this.state.configItem[name]}
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

    return (
      <Modal
        title={this.props.taskStore.taskProcName}
        visible={this.props.taskStore.taskPopupShow}
        style={{ top: 20 }}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className={classes.stepsContent}>{steps[current].content}</div>
          <div className={classes.stepsAction}>
            {
              current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.moveStep(-1)}>
                  上一步
              </Button>)
            }
            {
              current < steps.length - 1
              && <Button type="primary" onClick={() => this.moveStep(1)}>下一步</Button>
            }
            {
              current === steps.length - 1
              && <Button type="primary" onClick={() => message.success('Processing complete!')}>完成</Button>
            }
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

