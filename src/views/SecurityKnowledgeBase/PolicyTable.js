import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Table } from 'antd'
import { columns as KnowlegeBaseColumn } from './Column'
import { columns as PolicyColumn } from '../SecurityConfigView/Column'
import { observer, inject } from 'mobx-react'
import { DeepClone } from '../../utils/ObjUtils'

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

@inject('policyStore')
@observer
class PolicyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: PolicyColumn,    // 列定义
      policies: [],       // 策略数据集合
    };
  }

  componentWillMount() {
    // 加载策略字典
    this.props.policyStore.loadPolicies();
    const { type } = this.props;
    if (type === 0) {
      this.setState({columns: KnowlegeBaseColumn})
    } 
    // else if (type === 1) {
    //   this.setState({columns: KnowlegeBaseColumn})
    // }
  }

  render() {
    const { columns } = this.state;
    const { policiesArray } = this.props.policyStore;
    const { code, type } = this.props;
    let policiesSource = [];
    let policies = [];
    if (type === 0) {
      policiesSource = this.props.policyStore.getPoliciesByGroupCode(code);
    } else {
      policiesSource = policiesArray;
    }

    policies = policiesSource.map((policy, index) => {
      let policyItem = DeepClone(policy);
      // antd 表格需要数据源中含 key 属性
      policyItem.key = index + 1;  
      // 表格中索引列（后台接口返回数据中没有此属性）
      policyItem.index = index + 1;
      return policyItem;
    })

    return (
      <Table
      columns={columns}
      dataSource={policies}
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
  />);
  }
}

PolicyTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PolicyTable);