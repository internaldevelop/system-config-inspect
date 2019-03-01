import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NewTaskIcon from '@material-ui/icons/AddBoxOutlined';

import NavigatorListItems from './NavigatorListItems';
import TaskTable from './task-manage/TaskTable';
import ConfigTable from './security-manage/ConfigTable';
import NewTaskDialog from './task-manage/NewTaskDialog';
import InspectResults from './inspect-result/InspectResuls'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    maxHeight: 320,
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
});

function PaperComponent(props) {
  return (
    <Draggable>
      <Paper {...props} />
    </Draggable>
  );
}

class SysConfigInspectMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDrawer: true,
      openNewTask: false,
      naviIndex: 0,
      headTitle: '任务管理',
    };
  }

  getNaviNames() {
    return ['任务管理', '安全配置管理', '检测结果', '风险预警', '账号信息', '注册管理', '退出账号'];
  }
  getHeadTitle(index) {
    return this.getNaviNames()[index];
  }

  handleDrawerOpen = () => {
    this.setState({ openDrawer: true });
  };

  handleDrawerClose = () => {
    this.setState({ openDrawer: false });
  };

  handleCreateNewTask = event => {
    this.setState({ openNewTask: true });
  };

  handleSaveNewTask = (event, target) => {
    this.setState({ openNewTask: false });
  };

  handleClickNaviList(i) {
    // const {naviIndex} = this.state;
    this.setState({ naviIndex: i });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.openDrawer && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.openDrawer} className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.openDrawer && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {this.getHeadTitle(this.state.naviIndex)}
            </Typography>
            <IconButton color="inherit" onClick={this.handleCreateNewTask}>
              <NewTaskIcon />
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.openDrawer && classes.drawerPaperClose),
          }}
          open={this.state.openDrawer}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <NavigatorListItems callBack={this.handleClickNaviList.bind(this)}/>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {this.state.naviIndex === 0 && (<TaskTable />)}
          {this.state.naviIndex === 1 && (<ConfigTable />)}
          {this.state.naviIndex === 2 && (<InspectResults />)}
        </main>
        <Dialog
          open={this.state.openNewTask}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title"
          >
            新建检测任务
          </DialogTitle>
          <DialogContent>
            <div><NewTaskDialog /></div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSaveNewTask} color="primary">
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

SysConfigInspectMain.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SysConfigInspectMain);