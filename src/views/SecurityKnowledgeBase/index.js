import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { policyGroup } from '../../global/enumeration/PolicyGroup';
import { Table } from 'antd'
import { columns as Column } from './Column'
import HttpRequest from '../../utils/HttpRequest';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

const policyGroupInfo = [{
  key: "1",
  groupId: policyGroup.GROUP_WINDOWS_PATCH_INSTALL,
  title: 'Windows系统补丁安装策略',
}, {
  key: "2",
  groupId: policyGroup.GROUP_WINDOWS_SERVICES,
  title: 'Windows系统服务策略',
}, {
  key: "3",
  groupId: policyGroup.GROUP_WINDOWS_FILE_SECURITY,
  title: 'Windows系统文件安全防护策略',
}, {
  key: "4",
  groupId: policyGroup.GROUP_LINUX_PATCH_INSTALL,
  title: 'Linux系统补丁安装策略',
}, {
  key: "5",
  groupId: policyGroup.GROUP_LINUX_SERVICES,
  title: 'Linux系统服务情况策略',
}, {
  key: "6",
  groupId: policyGroup.GROUP_LINUX_FILE_SECURITY,
  title: 'Linux系统文件安全防护策略',
}, {
  key: "7",
  groupId: policyGroup.GROUP_USER_ACCOUNT_CONFIGURATION,
  title: '用户账号配置策略',
}, {
  key: "8",
  groupId: policyGroup.GROUP_PASSWORD_CONFIGURATION,
  title: '口令配置策略',
}, {
  key: "9",
  groupId: policyGroup.GROUP_NETWORK_COMMUNICATION_CONFIGURATION,
  title: '网络通信配置策略',
}, {
  key: "10",
  groupId: policyGroup.GROUP_LOG_AUDIT_CONFIGURATION,
  title: '日志审计配置策略',
}, {
  key: "11",
  groupId: policyGroup.GROUP_SECURITY_AUDIT_CONFIGURATION,
  title: '安全审计策略',
}];

class SecurityKnowledgeBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      columns: Column,    // 列定义
      policies: [],       // 策略数据集合
    };
  }

    handleChange = (event, value) => {
      this.setState({ value });
    };
  
    getPoliciesCB = (data) => {
      const { value, policies } = this.state;
      let allPolicies = [];
      let groupId = policyGroupInfo[value].groupId;
      let currentPolicies = [];
      let currentGroupGolicies = [];
      // 检查响应的payload数据是数组类型
      if (!(data.payload instanceof Array)) {
        currentGroupGolicies = { id: groupId, policies: currentPolicies};
        return;
      }
  
      // 把响应数据转换成 table 数据
      currentPolicies = data.payload.map((policy, index) => {
          let policyItem = {};
          policyItem.key = index + 1;
          policyItem.index = index + 1;
          policyItem.policy_uuid = policy.uuid;
          policyItem.name = policy.name;
          policyItem.os_type = policy.os_type;
          policyItem.risk_level = policy.risk_level;
          policyItem.lv1_require = policy.lv1_require;
          policyItem.lv2_require = policy.lv2_require;
          policyItem.lv3_require = policy.lv3_require;
          policyItem.lv4_require = policy.lv4_require;
          policyItem.solutions = policy.solutions;
          policyItem.baseline = policy.baseline;
          return policyItem;
      })
      currentGroupGolicies = { id: groupId, policies: currentPolicies};
      for (let i = 0; i < policies.length; i++) {
        allPolicies.push(policies[i]);
      }
      allPolicies.push(currentGroupGolicies);
      // 更新 policies 数据源
      this.setState({ policies: allPolicies });
  }

  getPoliciesByGroup = (groupId) => {
    // 根据groupId获取所在组所有的策略
    HttpRequest.asyncGet(this.getPoliciesCB, '/policies/get-policies-by-group', {groupId});
}

  showPolicies = (groupId) => {
    const { columns, policies } = this.state;
    let policiesSource = [];
    let isSavedPoliciesResult = false;
    for (let i = 0; i < policies.length; i++) {
      if (groupId === policies[i].id) {
        isSavedPoliciesResult = true;
        policiesSource = policies[i].policies;
        break;
      }
    }
    if (!isSavedPoliciesResult) {
      this.getPoliciesByGroup(groupId);
    }
    return (
      <Table
      columns={columns}
      dataSource={policiesSource}
      bordered={true}
      scroll={{ x: 1600, y: 400 }}
      // style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', }}
      pagination={{
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
          pageSizeOptions: ['10', '20', '30', '40'],
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
      }}
  />
    );
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
          {policyGroupInfo.map(item => <Tab label={item.title}/>)}
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>{this.showPolicies(policyGroup.GROUP_WINDOWS_PATCH_INSTALL)}</TabContainer>}
        {value === 1 && <TabContainer>{this.showPolicies(policyGroup.GROUP_WINDOWS_SERVICES)}</TabContainer>}
        {value === 2 && <TabContainer>{this.showPolicies(policyGroup.GROUP_WINDOWS_FILE_SECURITY)}</TabContainer>}
        {value === 3 && <TabContainer>{this.showPolicies(policyGroup.GROUP_LINUX_PATCH_INSTALL)}</TabContainer>}
        {value === 4 && <TabContainer>{this.showPolicies(policyGroup.GROUP_LINUX_SERVICES)}</TabContainer>}
        {value === 5 && <TabContainer>{this.showPolicies(policyGroup.GROUP_LINUX_FILE_SECURITY)}</TabContainer>}
        {value === 6 && <TabContainer>{this.showPolicies(policyGroup.GROUP_USER_ACCOUNT_CONFIGURATION)}</TabContainer>}
        {value === 7 && <TabContainer>{this.showPolicies(policyGroup.GROUP_PASSWORD_CONFIGURATION)}</TabContainer>}
        {value === 8 && <TabContainer>{this.showPolicies(policyGroup.GROUP_NETWORK_COMMUNICATION_CONFIGURATION)}</TabContainer>}
        {value === 9 && <TabContainer>{this.showPolicies(policyGroup.GROUP_LOG_AUDIT_CONFIGURATION)}</TabContainer>}
        {value === 10 && <TabContainer>{this.showPolicies(policyGroup.GROUP_SECURITY_AUDIT_CONFIGURATION)}</TabContainer>}
      </div>
    );
  }
}

SecurityKnowledgeBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SecurityKnowledgeBase);