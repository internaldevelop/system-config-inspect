import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

import Icon from '@material-ui/core/Icon';

const styles = theme => ({
    root: {
        width: '90%',
    },
    // button: {
    //   marginTop: theme.spacing.unit,
    //   marginRight: theme.spacing.unit,
    // },
    // actionsContainer: {
    //   marginBottom: theme.spacing.unit * 2,
    // },
    // resetContainer: {
    //   padding: theme.spacing.unit * 3,
    // },
    // form: {
    //   width: '100%', // Fix IE 11 issue.
    //   marginTop: theme.spacing.unit,
    // },
    // textField: {
    //   marginLeft: theme.spacing.unit,
    //   marginRight: theme.spacing.unit,
    //   width: 200,
    // },

});


class NavigatorListItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callBack: props.callBack,
            selectedIndex: 0,
            listItemLabel: {
                taskManage: '任务管理',
                securityConfig: '安全配置管理',
                inspectResult: '检测结果',
                riskWarning: '风险预警',
                accountInfo: '账号信息',
                signupManage: '注册管理',
                logout: '退出账号',
            },
            listItemIcon: {
                taskManage: "star",
                securityConfig: "home",
                inspectResult: "language",
                riskWarning: "list",
                accountInfo: 'star',
                signupManage: 'home',
                logout: 'language',
            },
        };
    }

    handleListItemClick = (event, index) => {
        const {selectedIndex} = this.state;
        var oldSelectedIndex = selectedIndex;
        this.setState({ selectedIndex: index });

        var callBack = this.state.callBack;
        if (index !== oldSelectedIndex && typeof(callBack) !== "undefined" && callBack !== null) {
            if (index == 6) {
                let history = this.context.router.history;
                history.push('/login');
            } else {
                callBack(index);
            }
        }
    };
    

    getModuleComponent(index, name) {
        const {listItemIcon, listItemLabel} = this.state;
        var rowStyle = {
            backgroundColor: this.state.selectedIndex === index ? '#90CAF9' : 'transparent',
        };
        return (
            <ListItem button style={rowStyle} 
                selected={this.state.selectedIndex === index}
                onClick={event => this.handleListItemClick(event, index)}
            >
                <ListItemIcon>
                    <Icon>{listItemIcon[name]}</Icon>
                </ListItemIcon>
                <ListItemText primary={listItemLabel[name]} />
            </ListItem>
        );
    };

    render() {
        const { classes } = this.props;
        const {listItemIcon, listItemLabel} = this.state;
        return (
            <div>
                {this.getModuleComponent(0, 'taskManage')}
                {this.getModuleComponent(1, 'securityConfig')}
                {this.getModuleComponent(2, 'inspectResult')}
                {this.getModuleComponent(3, 'riskWarning')}
                <Divider />
                {this.getModuleComponent(4, 'accountInfo')}
                {this.getModuleComponent(5, 'signupManage')}
                {this.getModuleComponent(6, 'logout')}
            </div>
        );

    }
}

NavigatorListItems.propTypes = {
    classes: PropTypes.object.isRequired,
};

NavigatorListItems.contextTypes = {
    router: PropTypes.object.isRequired
};

export default withStyles(styles)(NavigatorListItems);

