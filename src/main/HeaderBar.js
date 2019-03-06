import React from 'react'
import classNames from 'classnames';
import { PageHeader, Button, Icon, Badge, Dropdown, Menu, Modal } from 'antd'
import screenfull from 'screenfull'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// import { isAuthenticated } from '../../utils/Session'

import NotificationsIcon from '@material-ui/icons/Notifications';
import NewTaskIcon from '@material-ui/icons/AddBoxOutlined';
import FullScreenIcon from '@material-ui/icons/FullscreenOutlined';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExitOutlined';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import { Logout } from '../components/login/Logout';


const styles = theme => ({
  // headerul: {
  //   display: flex,
  //   width: '200px',
  // },
  menuButton: {
    margin: theme.spacing.unit,
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: green[500],
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: pink[500],
  },
  trigger: {
    margin: 10,
    color: '#fff',
    backgroundColor: pink[500],
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

//withRouter一定要写在前面，不然路由变化不会反映到props中去
@withRouter @inject('appStore') @observer
class HeaderBar extends React.Component {
  state = {
    title: '',
    subtitle: '',
    icon: 'arrows-alt',
    count: 100,
    visible: false,
    avatar: require('./image/04.jpg')
  }

  componentDidMount() {
    screenfull.onchange(() => {
      this.setState({
        icon: screenfull.isFullscreen ? 'shrink' : 'arrows-alt'
      })
    })
  }

  componentWillUnmount() {
    screenfull.off('change')
  }

  toggle = () => {
    this.props.onToggle()
  }
  screenfullToggle = () => {
    if (screenfull.enabled) {
      screenfull.toggle()
    }
  }
  logout = () => {
    // this.props.appStore.toggleLogin(false)
    // this.props.history.push(this.props.location.pathname)
    let history = this.props.history;
    history.push('/login');

  }

  render() {
    const { icon, count, visible, avatar, title, subtitle } = this.state
    const { appStore, collapsed, location, classes } = this.props
    const notLogin = (
      <div>
        <Link to={{ pathname: '/login', state: { from: location } }} style={{ color: 'rgba(0, 0, 0, 0.65)' }}>登录</Link>&nbsp;
        {/* <img src={require('../../assets/img/defaultUser.jpg')} alt=""/> */}
      </div>
    )
    const menu = (
      <Menu className='menu'>
        <Menu.ItemGroup title='用户中心' className='menu-group'>
          {/* <Menu.Item>你好 - {isAuthenticated()}</Menu.Item> */}
          <Menu.Item>个人信息</Menu.Item>
          <Menu.Item><span onClick={this.logout}>退出登录</span></Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title='设置中心' className='menu-group'>
          <Menu.Item>个人设置</Menu.Item>
          <Menu.Item>系统设置</Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    )
    const login = (
      <Dropdown overlay={menu}>
        <img onClick={() => this.setState({ visible: true })} src={avatar} alt="" />
      </Dropdown>
    )
    return (
      <div id='headerbar'>
        <IconButton className={classes.menuButton} color="primary" aria-label="Open drawer" onClick={this.toggle}>
          <MenuIcon />
        </IconButton>
        <div style={{ lineHeight: '64px', float: 'right' }}>
          <table border="0">
            <tr>
              <th>
                <IconButton className={classes.greenAvatar} aria-label="Full Screen" onClick={this.screenfullToggle}>
                  <FullScreenIcon />
                </IconButton>
              </th>
              <th>
                <IconButton className={classes.pinkAvatar} aria-label="Logout" onClick={this.logout.bind(this)}>
                  <LogoutIcon />
                </IconButton>
              </th>
            </tr>
          </table>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(HeaderBar);