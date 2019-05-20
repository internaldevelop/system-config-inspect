import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react'
import { policyGroup } from '../../global/enumeration/PolicyGroup';
import { userType } from '../../global/enumeration/UserType'
import { Table, Row, Col} from 'antd'
import { columns as Column } from './Column'
import PolicyTable from './PolicyTable'
import { DeepClone } from '../../utils/ObjUtils'
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
  code: policyGroup.GROUP_WINDOWS_PATCH_INSTALL,
  title: 'Windows系统补丁安装策略',
}, {
  key: "2",
  code: policyGroup.GROUP_WINDOWS_SERVICES,
  title: 'Windows系统服务策略',
}, {
  key: "3",
  code: policyGroup.GROUP_WINDOWS_FILE_SECURITY,
  title: 'Windows系统文件安全防护策略',
}, {
  key: "4",
  code: policyGroup.GROUP_LINUX_PATCH_INSTALL,
  title: 'Linux系统补丁安装策略',
}, {
  key: "5",
  code: policyGroup.GROUP_LINUX_SERVICES,
  title: 'Linux系统服务情况策略',
}, {
  key: "6",
  code: policyGroup.GROUP_LINUX_FILE_SECURITY,
  title: 'Linux系统文件安全防护策略',
}, {
  key: "7",
  code: policyGroup.GROUP_USER_ACCOUNT_CONFIGURATION,
  title: '用户账号配置策略',
}, {
  key: "8",
  code: policyGroup.GROUP_PASSWORD_CONFIGURATION,
  title: '口令配置策略',
}, {
  key: "9",
  code: policyGroup.GROUP_NETWORK_COMMUNICATION_CONFIGURATION,
  title: '网络通信配置策略',
}, {
  key: "10",
  code: policyGroup.GROUP_LOG_AUDIT_CONFIGURATION,
  title: '日志审计配置策略',
}, {
  key: "11",
  code: policyGroup.GROUP_SECURITY_AUDIT_CONFIGURATION,
  title: '安全审计策略',
}];

@inject('userStore')
@observer
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
      let code = policyGroupInfo[value].code;
      let currentPolicies = [];
      let currentGroupGolicies = [];
      // 检查响应的payload数据是数组类型
      if (!(data.payload instanceof Array)) {
        currentGroupGolicies = { id: code, policies: currentPolicies};
        return;
  }
  
      // 把响应数据转换成 table 数据
      currentPolicies = data.payload.map((policy, index) => {
          let policyItem = DeepClone(policy);
          policyItem.key = index + 1;  
          policyItem.index = index + 1;
          return policyItem;
      })
      currentGroupGolicies = { code: code, policies: currentPolicies};
      for (let policy of policies) {
        allPolicies.push(policy);
      }
      allPolicies.push(currentGroupGolicies);
      // 更新 policies 数据源
      this.setState({ policies: allPolicies });
  }

  getPoliciesByGroupCode = (groupCode) => {
    // 根据groupId获取所在组所有的策略
    HttpRequest.asyncGet(this.getPoliciesCB, '/policies/get-policies-by-group-code', {groupCode});
}

  showPolicies = (code) => {
    const { columns, policies } = this.state;
    let policiesSource = [];
    let isSavedPoliciesResult = false;
    for (let policy of policies) {
      if (code === policy.code) {
        isSavedPoliciesResult = true;
        policiesSource = policy.policies;
        break;
      }
    }
    if (!isSavedPoliciesResult) {
      this.getPoliciesByGroupCode(code);
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

  hasModifyRight = () => {
    const { userGroup }= this.props.userStore.loginInfo;
    if (userGroup === userType.TYPE_ADMINISTRATOR) {
        return false;
    }
    return true;
}

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        <Row>
          <Col span={8}><Typography variant="h6">安全策略知识库</Typography></Col>
        </Row>
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
        {policyGroupInfo.map((item, index) => (value === index && <TabContainer>{this.showPolicies(item.code)}</TabContainer>))}
      </div>
      </div>
    );
  }
}

SecurityKnowledgeBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SecurityKnowledgeBase);