import withRoot from '../../modules/auxliary/withRoot';
// --- Post bootstrap -----
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '../../modules/components/Typography';
import { email, required } from '../../modules/form/validation';
import { CssBaseline } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import NewAccountIcon from '@material-ui/icons/PersonAddOutlined';
import Paper from '@material-ui/core/Paper';
import LoginBGImage from '../../resources/image/login_bg.jpg'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  mainpaper: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url(' + LoginBGImage + ')',
    backgroundSize: '100% 100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    // backgroundColor: 'rgba(178,178,178,0.5)',
    // background: 'rgba(178,178,178,0.5)',
    backgroundImage: 'url(' + LoginBGImage + ')',
  },
  paper: {
    width: 400,
    marginTop: theme.spacing.unit * 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    // transition: 'all 1s',
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      sent: false,
      submitting: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validate = values => {
    const errors = required(['email', 'password'], values, this.props);

    if (!errors.email) {
      const emailError = email(values.email, values, this.props);
      if (emailError) {
        errors.email = email(values.email, values, this.props);
      }
    }

    return errors;
  };

  handleSubmit = event => {
    event.preventDefault();
    let userName = this.state.userName;
    let password = this.state.password;
    console.log("用户名：" + userName + "\t密码：" + password);
    let history = this.context.router.history;
    if ((userName !== "") && (password !== "")) {
      history.push('/login');
    } 
  }

  handleUserNameChange = event => {
    this.setState({ userName: event.target.value });
  }

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  }


  render() {
    const { classes } = this.props;
    const { sent, submitting } = this.state;

    return (
      <Paper className={classes.mainpaper}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <NewAccountIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            注册
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit.bind(this)} >
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">电子邮件（用户名）</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus value={this.state.userName} onChange={this.handleUserNameChange.bind(this)} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">密码</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="current-password" value={this.state.password} onChange={this.handlePasswordChange.bind(this)} />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              注册
            </Button>
          </form>
          <React.Fragment>
            <Typography variant="body2" align="center">
              {'已有账号？  '}
              <Link href="/login" align="center" underline="always">
                返回登录
              </Link>
            </Typography>
          </React.Fragment>
        </Paper>
      </Paper>
    );
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

SignUp.contextTypes = {
  router: PropTypes.object.isRequired
};

export default compose(
  withRoot,
  withStyles(styles),
)(SignUp);
