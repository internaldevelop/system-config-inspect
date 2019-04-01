import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TaskTable from './task-manage/TaskTable'

// const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
});

class SysConfigInspectMain1 extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {/* <main className={classes.content}> */}
          <TaskTable />
        {/* </main> */}
      </div>
    );
  }
}

SysConfigInspectMain1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SysConfigInspectMain1);