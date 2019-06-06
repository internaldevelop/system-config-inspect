import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react'
import { policyGroup } from '../../global/enumeration/PolicyGroup';
import { policyType } from '../../global/enumeration/PolicyType';
import { userType } from '../../global/enumeration/UserType'
import { Skeleton, Table, Row, Col } from 'antd'
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

@inject('userStore')
@inject('dictStore')
@observer
class SecurityKnowledgeBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      columns: Column,    // 列定义
      policies: [],       // 策略数据集合
      policyGroups: []    // 策略组数据集合
    };
  }

  componentWillMount() {
    // 加载策略字典
    this.props.dictStore.loadPolicyGroups();
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  getPoliciesCB = (data) => {
    const { value, policies, policyGroups } = this.state;
    let allPolicies = [];
    let uuid = policyGroups[value].uuid;
    let currentPolicies = [];
    let currentGroupPolicies = [];
    // 检查响应的payload数据是数组类型
    if (!(data.payload instanceof Array)) {
      currentGroupPolicies = { groupUuid: uuid, policies: currentPolicies };
      return;
    }

    // 把响应数据转换成 table 数据
    let index = 0;
    for(let policy of data.payload) {
      if (parseInt(policy.type) === policyType.TYPE_NORMAL) {
        let policyItem = DeepClone(policy);
        policyItem.key = index + 1;
        policyItem.index = index + 1;
        index++;
        currentPolicies.push(policyItem);
      }
    }
    currentGroupPolicies = { groupUuid: uuid, policies: currentPolicies };
    for (let policy of policies) {
      allPolicies.push(policy);
    }
    allPolicies.push(currentGroupPolicies);
    // 更新 policies 数据源
    this.setState({ policies: allPolicies });
  }

  getPolicies = (groupUuid) => {
    // 根据groupId获取所在组所有的策略
    HttpRequest.asyncGet(this.getPoliciesCB, '/policies/get-policies-by-group-uuid', { groupUuid: groupUuid });
  }

  showPolicies = (groupUuid) => {
    const { columns, policies } = this.state;
    let policiesSource = [];
    let isSavedPoliciesResult = false;
    for (let policy of policies) {
      if (groupUuid === policy.groupUuid) {
        isSavedPoliciesResult = true;
        policiesSource = policy.policies;
        break;
      }
    }
    if (!isSavedPoliciesResult) {
      this.getPolicies(groupUuid);
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
    const { userGroup } = this.props.userStore.loginInfo;
    if (userGroup === userType.TYPE_ADMINISTRATOR) {
      return false;
    }
    return true;
  }

  getGroupArraysExceptSelfDefined = () => {
    const { policyGroupsArray } = this.props.dictStore;
    let policyGroups = [];
    for (let group of policyGroupsArray) {
      if (parseInt(group.type) === policyGroup.TYPE_NORMAL) {
        let item = DeepClone(group);
        policyGroups.push(item);
      }
    }
    if (policyGroups.length > 0) {
      this.setState({ policyGroups });
    }
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const { policyGroups } = this.state;
    if (policyGroups.length <= 0) {
      this.getGroupArraysExceptSelfDefined();
    }

    return (
      <div>
        <Skeleton loading={!this.hasModifyRight()} active avatar>
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
                {(policyGroups instanceof Array) && policyGroups.map(item => <Tab label={item.name} />)}
              </Tabs>
            </AppBar>
            {(policyGroups instanceof Array) && policyGroups.map((item, index) => (value === index && <TabContainer>{this.showPolicies(item.uuid)}</TabContainer>))}
          </div>
        </Skeleton>
      </div>
    );
  }
}

SecurityKnowledgeBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SecurityKnowledgeBase);