import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


// import { Steps, Button, message } from 'antd';

// const Step = Steps.Step;
// const steps = [{
//   title: '基本信息',
//   content: 
// },{

// },{

// }];
const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },

});


class TaskConfig extends React.Component {
  state = {
    activeStep: 0,
    taskName: '新建任务-1',
    taskDesc: '',
    hostName: '本机',
    hostIP: '127.0.0.1',
    hostPort: '8192',
    loginUser: 'root',
    loginPwd: '',
    systemType: 'Ubuntu',
    systemVer: 'V16.0',
    // configItem: [true, true, true, true, true, true, true, true, true, true],
    // patch: false,
    // sysService: true,
    // sysFileProtect: true,
    // accountConfig: true,
    // pwdPolicy: true,
    // commConfig: true,
    // logAudit: true,
    // securityAudit: true,
    // firewall: true,
    // selfDefined: true,

    configItem: {
      patch: false,
      sysService: true,
      sysFileProtect: true,
      accountConfig: true,
      pwdPolicy: true,
      commConfig: true,
      logAudit: true,
      securityAudit: true,
      firewall: true,
      selfDefined: true,
    },
  };

  handleConfigChange = name => event => {
    const { configItem } = this.state;
    configItem[name] = event.target.checked;
    this.setState({ configItem: configItem });
  };

  getSteps = () => {
    return ['基本信息', '资产识别', '规则配置'];
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

  getStepContent = (step) => {
    const { classes } = this.props;
    const { taskName, taskDesc, hostName, hostIP, hostPort, loginUser, loginPwd, systemType, systemVer, configItem } = this.state;
    switch (step) {
      case 0:
        return (
          <div>
            <form>
              <TextField required fullWidth autoFocus style={{ margin: 8 }} margin="normal"
                id="task-name" label="任务名称" defaultValue={taskName} variant="outlined"
                onChange={this.handleTaskNameChange}
              />
              <TextField fullWidth style={{ margin: 8 }} margin="normal" multiline
                id="task-desc" label="任务描述" defaultValue={taskDesc} variant="outlined" rows="4"
                onChange={this.handleTaskDescChange}
              />
            </form>
          </div>
        );
      case 1:
        return (
          <div>
            <form>
              <TextField required fullWidth autoFocus id="host-name" label="主机名称" defaultValue={hostName}
                variant="outlined" margin="normal"
              />
              <table>
                <tr>
                  <td>
                    <TextField required id="host-ip" label="主机IP" defaultValue={hostIP}
                      variant="outlined" margin="normal"
                    />
                  </td>
                  <td>
                    <TextField required id="host-port" label="端口" defaultValue={hostPort}
                      variant="outlined" margin="normal"
                    />
                  </td>
                </tr>
              </table>
              <TextField required fullWidth id="login-user" label="用户名称" defaultValue={loginUser}
                variant="outlined" margin="normal"
              />
              <TextField required fullWidth id="login-pwd" label="登录密码" defaultValue={loginPwd}
                variant="outlined" margin="normal"
              />
              <TextField required fullWidth id="system-type" label="系统类型" defaultValue={systemType}
                variant="outlined" margin="normal"
              />
              <TextField required fullWidth id="system-ver" label="系统版本" defaultValue={systemVer}
                variant="outlined" margin="normal"
              />
            </form>
          </div>
        );
      case 2:
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
      default:
        return 'Unknown step';
    }
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleTaskNameChange = (event) => {
    this.setState({
      taskName: event.target.value,
    });
  };

  handleTaskDescChange = (event) => {
    this.setState({
      taskDesc: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = this.getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        {/* <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {};
            const labelProps = {};
            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper> */}
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      variant="outlined" 
                      color="secondary"
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      上一步
                    </Button>
                    <Button
                      disabled={activeStep === steps.length - 1}
                      variant="outlined"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? '完成' : '下一步'}
                    </Button>
                  </div>
                </div>
                <Typography>{this.getStepContent(index)}</Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            {/* <Typography>All steps completed - you&apos;re finished</Typography> */}
            <Button onClick={this.handleReset} className={classes.button}>
              首步骤
            </Button>
            <Button onClick={this.handleReset} className={classes.button}>
              重置
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

TaskConfig.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(TaskConfig);
