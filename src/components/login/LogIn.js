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
import LoginBGImage from '../../resources/image/login_bg.jpg'
import { observer, inject } from 'mobx-react'
// import UserStore from '../../main/store/UserStore';
import { withRouter } from 'react-router-dom'

import { Row, Col, message, Form } from 'antd'

import { randomNum } from '../../utils/tools'
import HttpRequest from '../../utils/HttpRequest';

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
        transition: 'all .5s'
    },
    mainpaper: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
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
        // position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        // backgroundColor: 'rgba(178,178,178,0.5)',
        // background: 'rgba(178,178,178,0.5)',
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

const veriCodeWidth = 100;
const veriCodeHeight = 60;

@withRouter
@observer
@inject('userStore')
// @inject('taskStore')
@Form.create()
class LogIn extends React.Component {

    constructor(props) {
        super(props);
        const userStore = this.props.userStore;
        // const taskStore = this.props.taskStore;
        // taskStore.setTaskParams({
        //     taskName: '任务2',
        //     configItem: {
        //         patch: true,
        //     },
        // });
        userStore.initLogin();
        const { user, password } = userStore.loginInfo;
        this.state = {
            userName: user,
            password: password,
            verifyCode: '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.createCode()
        // this.particle = new BGParticle('backgroundBox')
        // this.particle.init()
    }

    componentWillUnmount() {
        // this.particle.destory()
    }

    checkVerifyCode() {
        let inputCode = document.getElementById('verification').value;
        if (this.state.verifyCode.toUpperCase() !== inputCode.toUpperCase()) {
            message.info('验证码错误，请重新输入验证码');
            document.getElementById('verification').value = '';
            this.createCode();
            return false;
        }

        return true;
    }

    getUserCB = (payload) => {

    }

    handleSubmit = event => {
        event.preventDefault();
        // 检查验证码是否正确，错误提示
        if (this.checkVerifyCode() !== true)
            return;

        let userName = this.state.userName;
        let password = this.state.password;
        this.props.form.validateFields((err, values) => {
            HttpRequest.asyncGet(this.getUserCB, '/users/user-by-account', { account: userName });
        });

        const userStore = this.props.userStore;
        console.log("用户名：" + userName + "\t密码：" + password);
        let history = this.props.history;
        if (password === "123456") {
            userStore.saveUser(userName, '', password, 10);
            history.push('/home');
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

    handleVerifyCodeChange = event => {
        // this.setState({ verifyCode: event.target.value });
    }

    // 生成验证码
    createCode = () => {
        const ctx = this.canvas.getContext('2d')
        const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        let code = ''
        ctx.clearRect(0, 0, veriCodeWidth, veriCodeHeight)
        for (let i = 0; i < 4; i++) {
            const char = chars[randomNum(0, 57)]
            code += char
            ctx.font = randomNum(28, 36) + 'px SimHei'  //设置字体随机大小
            ctx.fillStyle = '#00a152'
            ctx.textBaseline = 'middle'
            ctx.shadowOffsetX = randomNum(-3, 3)
            ctx.shadowOffsetY = randomNum(-3, 3)
            ctx.shadowBlur = randomNum(-3, 3)
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
            let x = veriCodeWidth / 5 * (i + 1)
            let y = veriCodeHeight / 2 + 10
            let deg = randomNum(-25, 25)
            /**设置旋转角度和坐标原点**/
            ctx.translate(x, y)
            ctx.rotate(deg * Math.PI / 180)
            ctx.fillText(char, 0, 0)
            /**恢复旋转角度和坐标原点**/
            ctx.rotate(-deg * Math.PI / 180)
            ctx.translate(-x, -y)
        }
        this.setState({
            verifyCode: code,
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Paper id='backgroundBox' className={classes.mainpaper}>
                    <CssBaseline />
                    {/* </Paper>
                <Paper >
                    <CssBaseline /> */}
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
                            <Row>
                                <Col span={15}>
                                    <FormControl margin="normal" required fullWidth>
                                        <InputLabel htmlFor="verification">验证码</InputLabel>
                                        <Input name="verification" id="verification" onChange={this.handleVerifyCodeChange.bind(this)} />
                                    </FormControl>
                                </Col>
                                <Col span={9}>
                                    <canvas onClick={this.createCode} width={veriCodeWidth} height={veriCodeHeight} ref={el => this.canvas = el} />
                                </Col>
                            </Row>
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
            </div>
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
