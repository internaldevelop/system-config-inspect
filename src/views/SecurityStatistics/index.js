import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Skeleton, Row, Col, Select } from 'antd'
// import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react'
import { userType } from '../../global/enumeration/UserType'

import PolicyStatisticsBar from './PolicyStatisticsBar'
import PolicyStatisticsData from './PolicyStatisticsData'
import { DeepClone } from '../../utils/ObjUtils'
import { policyGroup } from '../../global/enumeration/PolicyGroup';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

const Option = Select.Option;

@observer
@inject('userStore')
@inject('dictStore')
class SecurityStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selVal: '',
            policyGroups: [],    // 策略组数据集合
        }
    }

    componentWillMount() {
        // 加载策略字典
        this.props.dictStore.loadPolicyGroups();
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
          this.setState({ policyGroups, selVal: policyGroups[0].code });
        }
    }

    handleChange = (value) => {
        const { selVal } = this.state;
        this.setState({
            selVal: value,
        });
        console.log(selVal);
    }

    render() {
        const { policyGroups, selVal } = this.state;
        const userStore = this.props.userStore;
        if (policyGroups.length <= 0) {
            this.getGroupArraysExceptSelfDefined();
        }

        return (
            <div>
                <Skeleton loading={userStore.isAdminUser} active avatar>
                    <Row>
                        <Col span={24}>
                            {/*<Select defaultValue='1' style={{ width: 200 }} onChange={this.handleChange}>
                                <Option value='1'>系统补丁安装统计</Option>
                                <Option value='2'>系统服务分析统计</Option>
                                <Option value='3'>系统文件安全防护分析统计</Option>
                                <Option value='4'>用户账号配置分析统计</Option>
                                <Option value='5'>口令策略配置分析统计</Option>
                                <Option value='6'>网络通信配置分析统计</Option>
                                <Option value='7'>日志审计统计</Option>
                            </Select>*/}

                            <Select value={selVal} style={{ width: 200 }} onChange={this.handleChange}>
                                {policyGroups.map(projectGroup => (
                                    <Option value={projectGroup.code}>{projectGroup.name}</Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <PolicyStatisticsData code={this.state.selVal} />
                        </Col>
                    </Row>
                    {/* <Row>
                    <Col span={24}>
                        <PolicyStatisticsBar code={this.state.selVal}/>
                    </Col>
                </Row> */}
                </Skeleton>
            </div>
        );

    }
}

SecurityStatistics.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SecurityStatistics);