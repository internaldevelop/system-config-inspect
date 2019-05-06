import React from 'react'
import PropTypes from 'prop-types';
import { Table, Icon, Button, Row, Col } from 'antd'
import { columns as Column } from './Column'
// import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react'

import { GetNowTimeMyStr } from '../../utils/TimeUtils'

import { PolicyData } from './PolicyData'
import PolicyParamsConfig from './PolicyParamsConfig'



const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
    actionButton: {
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0,
        marginTop: 0,
    },
    runButton: {
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 0,
        marginTop: 0,
        backgroundColor: "green",
    },
});

const ACTION_NONE = 0;
const ACTION_NEW = 1;
const ACTION_EDIT = 2;

@inject('policyStore')
@observer
class SecurityConfigView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfig: false,
            actionName: '',
            actionFlag: ACTION_NONE,
            columns: Column,
            policyRecordData: PolicyData,
            recordChangeID: 0,
        }

        const { columns, } = this.state;
        const { classes } = this.props;
        if (columns[columns.length - 1].key !== 'operation') {
            columns.push({
                title: '操作',
                key: 'operation',
                width: 150,
                fixed: 'right',
                render: (text, record, index) => (
                    <div>
                        <Button className={classes.actionButton} type="danger" size="small" dataindex={index} onClick={this.handleDel.bind(this)}>删除</Button>
                        <Button className={classes.actionButton} size="small" type="primary" dataindex={index} onClick={this.handleEdit.bind(this)}>编辑</Button>
                    </div>
                ),
            });
        }
        this.setState({ columns: columns });
    }

    handleDel = (event) => {
        // dataIndex为表中数据的行索引，配置columns时已指定属性dataIndex的数据来源
        let rowIndex = event.target.getAttribute('dataindex')
        const delDataSource = this.state.taskRecordData;
        // rowIndex为行索引，后面的1为一次去除几行
        delDataSource.splice(rowIndex, 1);
        this.setState({
            dataSource: delDataSource,
        });
    }
    handleEdit = (event) => {
        let rowIndex = event.target.getAttribute('dataindex')
        const editDataSource = this.state.policyRecordData[rowIndex];
        const policyStore = this.props.policyStore;

        let policyItem = {
            index: editDataSource.index,
            name: editDataSource['name'],
            group: editDataSource['group'],
            type: editDataSource['policy_type'],
            riskLevel: editDataSource['risk_level'],
            solution: editDataSource['solution'],
        }
        policyStore.initPolicyItem(policyItem);
        this.setState({ showConfig: true, actionName: '修改策略', actionFlag: ACTION_EDIT, recordChangeID: rowIndex });
    }

    handleNewPolicy = (event) => {
        const policyStore = this.props.policyStore;
        let policyItem = {
            name: '新建策略',
            group: '',
            type: '',
            riskLevel: '中',
            solution: '',
        }
        policyStore.initPolicyItem(policyItem);
        this.setState({ showConfig: true, actionName: '新建策略', actionFlag: ACTION_NEW });
    }

    handleCloseConfig = (e) => {
        const { actionFlag, policyRecordData, recordChangeID } = this.state;
        const { policyItem } = this.props.policyStore;
        if (actionFlag === ACTION_NEW) {
            let id = policyRecordData.length + 1;
            policyRecordData.unshift({
                key: id,
                index: id.toString(),
                name: policyItem.name,
                group: policyItem.group,
                policy_type: policyItem.type,
                risk_level: policyItem.riskLevel,
                solution: policyItem.solution,
                change_time: GetNowTimeMyStr(),
            });

        } else if (actionFlag === ACTION_EDIT) {
            let record = policyRecordData[recordChangeID];
            record.index = policyItem.index;
            record.name = policyItem.name;
            record.group = policyItem.group;
            record.policy_type = policyItem.type;
            record.risk_level = policyItem.riskLevel;
            record.solution = policyItem.solution;
            record.change_time = GetNowTimeMyStr();
        }
        this.setState({ showConfig: false, actionFlag: ACTION_NONE });
    }

    render() {
        // const policyStore = this.props.policyStore;
        const { columns, policyRecordData, showConfig, actionName } = this.state;
        return (
            <div>
                <Row>
                    <Col span={8}><Typography variant="h6">安全策略管理</Typography></Col>
                    <Col span={8} offset={8} align="right"><Button type="primary" size="large" onClick={this.handleNewPolicy.bind(this)}><Icon type="plus-circle-o" />新建策略</Button></Col>
                </Row>
                <Table
                    columns={columns}
                    // style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', }}
                    // style={{ overflow: 'hidden', whiteSpace: 'nowrap',  textOverflow: 'clip', }}
                    dataSource={policyRecordData}
                    bordered={true}
                    scroll={{ x: 1600, y: 400 }}
                    pagination={{
                        showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                        pageSizeOptions: ['10', '20', '30', '40'],
                        defaultPageSize: 10,
                        showQuickJumper: true,
                        showSizeChanger: true,
                    }}
                />
                {showConfig && <PolicyParamsConfig action={actionName} onclose={this.handleCloseConfig.bind(this)} />}
            </div>
        )

    }
}

SecurityConfigView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SecurityConfigView);