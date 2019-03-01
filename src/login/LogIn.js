import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Link from '@material-ui/core/Link';
import { UserLogin, LoadUserLoginInfo, IsUserLogin, UserLogout } from './UserState';
import LoginBGImage from '../resources/image/login_bg.jpg'

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
        // opacity:1.0,
        // zIndex:10,
        backgroundImage: 'url(' + LoginBGImage + ')',
    },
    backgroundBox: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(' + LoginBGImage + ')',
        backgroundSize: '100% 100%',
        transition:'all .5s'
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
        marginTop: theme.spacing.unit * 8,
        marginLeft: theme.spacing.unit * 70,
        marginRight: theme.spacing.unit * 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        // backgroundColor: 'rgba(178,178,178,0.5)',
        // background: 'rgba(178,178,178,0.5)',
        // backgroundImage: 'url(' + LoginBGImage + ')',
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
        // backgroundColor: 'rgba(178,178,178,0.5)',
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class LogIn extends React.Component {
    constructor(props) {
        const {user, password} = LoadUserLoginInfo();
        super(props);
        UserLogout();
        this.state = {
            userName: user,
            password: password
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = event => {
        event.preventDefault();
        let userName = this.state.userName;
        let password = this.state.password;
        console.log("用户名：" + userName + "\t密码：" + password);
        let history = this.context.router.history;
        if (password === "123456") {
            UserLogin(userName, password, 0);
            history.push('/tasks');
        } else {
            alert("密码错误")
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
        return (
            <Paper className={classes.mainpaper}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        登录
                    </Typography>
                    <form onSubmit={this.handleSubmit.bind(this)} className={classes.form}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">用户名</InputLabel>
                            <Input id="email" name="email" autoComplete="email" autoFocus value={this.state.userName} onChange={this.handleUserNameChange.bind(this)} />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">密码</InputLabel>
                            <Input name="password" type="password" id="password" autoComplete="current-password" value={this.state.password} onChange={this.handlePasswordChange.bind(this)} />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="记住登录"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            登录
                        </Button>
                        <Typography variant="body2" align="center">
                            {'没有账号？  '}
                            <Link href="./signup" align="center" underline="always">
                                点击这里注册
                            </Link>
                        </Typography>
                    </form>
                    {/* <React.Fragment>
                        <Typography variant="body2" align="center">
                            {'没有账号？  '}
                            <Link href="./signup" align="center" underline="always">
                                点击这里注册
                            </Link>
                        </Typography>
                    </React.Fragment> */}
                </Paper>
            </Paper>
        );
    }
}

LogIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

LogIn.contextTypes = {
    router: PropTypes.object.isRequired
};

export default withStyles(styles)(LogIn);
