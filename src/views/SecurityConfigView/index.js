import React from 'react'
import PropTypes from 'prop-types';
import { Skeleton, Table, Icon, Button, Row, Col, Tabs, Popconfirm } from 'antd'
import { columns as Column } from './Column'
// import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react'
import PolicyParamsConfig from './PolicyParamsConfig'
import { actionType } from '../../global/enumeration/ActionType';
import { policyType } from '../../global/enumeration/PolicyType';
import { userType } from '../../global/enumeration/UserType'
import { DeepClone, DeepCopy } from '../../utils/ObjUtils'
import { GetMainViewHeight } from '../../utils/PageUtils'
import HttpRequest from '../../utils/HttpRequest';
import { osType } from '../../global/enumeration/OsType';

const TabPane = Tabs.TabPane;


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
});

const DEFAULT_PAGE_SIZE = 10;
@inject('policyStore')
@inject('userStore')
@observer
class SecurityConfigView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfig: false,
            columns: Column,
            policies: [],
            recordChangeID: -1,
            currentPage: 1,     // Table中当前页码（从 1 开始）
            pageSize: DEFAULT_PAGE_SIZE,
            scrollWidth: 2000,        // 表格的 scrollWidth
            scrollHeight: 300,      // 表格的 scrollHeight
            shadeState: false,
        }
        // 设置操作列的渲染
        this.initActionColumn();

        // 从后台获取任务数据的集合
        this.getAllPolicies();
    }

    componentDidMount() {
        // 增加监听器，侦测浏览器窗口大小改变
        window.addEventListener('resize', this.handleResize.bind(this));
        this.setState({ scrollHeight: GetMainViewHeight() });
    }

    handleResize = e => {
        console.log('浏览器窗口大小改变事件', e.target.innerWidth, e.target.innerHeight);
        this.setState({ scrollHeight: GetMainViewHeight() });
    }

    /** 初始化操作列，定义渲染效果 */
    initActionColumn() {
        const { columns } = this.state;
        const { classes } = this.props;
        if (columns.length === 0)
            return;

        // 操作列默认为最后一列
        columns[columns.length - 1].render = (text, record, index) => {
            return (
                <div>
                    <Popconfirm title="确定要删除该策略吗？" onConfirm={this.handleDel(index).bind(this)} okText="确定" cancelText="取消">
                        <Button disabled={this.isDisableEditPolicy(index)} className={classes.actionButton} type="danger" size="small">删除</Button>
                    </Popconfirm>
                    <Button className={classes.actionButton} type="primary" size="small" onClick={this.handleEdit(index).bind(this)}>编辑</Button>
                </div>
            )
        }
        this.setState({ columns });
    }

    /**
     * 目前只允许自定义类型policy可编辑
     */
    isDisableEditPolicy = (rowIndex) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);
        const { policies } = this.state;
        if (parseInt(policies[dataIndex].type) === policyType.TYPE_NORMAL) {
            return true;
        }
        return false;
    }

    /** 从后台请求所有策略数据，请求完成后的回调 */
    getAllPoliciesCB = (data) => {
        let policies = [];
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array))
            return;

        // 从响应数据生成 table 数据源
        policies = data.payload.map((policy, index) => {
            let policyItem = DeepClone(policy);
            // antd 表格需要数据源中含 key 属性
            policyItem.key = index + 1;
            // 表格中索引列（后台接口返回数据中没有此属性）
            policyItem.index = index + 1;
            // taskItem.status = [task.status];

            return policyItem;
        })

        // 更新 tasks 数据源
        this.setState({ policies });
    }

    /** 从后台请求所有策略数据 */
    getAllPolicies = () => {
        HttpRequest.asyncGet(this.getAllPoliciesCB, '/policies/all-detail-info')
    }

    /** 向后台发起删除任务数据请求的完成回调 
     *  因调用请求函数时，默认参数只返回成功请求，所以此处不需要判断后台是否成功删除任务
    */
    deletePolicyCB = (dataIndex) => (data) => {
        const { policies } = this.state;
        // rowIndex 为行索引，第二个参数 1 为一次去除几行
        policies.splice(dataIndex, 1);
        this.setState({ policies });
    }

    /**
     * 将数据所在页的行索引转换成整个数据列表中的索引
     * @param {} rowIndex 数据在表格当前页的行索引
     */
    transferDataIndex(rowIndex) {
        // currentPage 为 Table 中当前页码（从 1 开始）
        const { currentPage, pageSize } = this.state;
        let dataIndex = (currentPage - 1) * pageSize + rowIndex;
        return dataIndex;
    }

    /** 处理删除操作
     * rowIndex 为当前页所含记录中的第几行（base:0），不是所有记录中的第几条
     * 需要根据当前 pagination 的属性，做变换
     */
    handleDel = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);

        // 向后台提交删除该任务
        const { policies } = this.state;
        HttpRequest.asyncPost(this.deletePolicyCB(dataIndex), '/policies/remove', { uuid: policies[dataIndex].uuid });
    }

    /** 处理编辑操作 */
    handleEdit = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);

        // 获取需要编辑的任务数据
        const policyItem = this.state.policies[dataIndex];

        // 利用仓库保存策略操作类型、操作窗口名称、策略数据
        const policyStore = this.props.policyStore;
        policyStore.setPolicyAction(actionType.ACTION_EDIT);
        policyStore.setPolicyProcName('编辑策略参数');
        policyStore.initPolicyItem(policyItem);

        // 保存待编辑的数据索引，并打开任务数据操作窗口
        this.setState({ recordChangeID: dataIndex, showConfig: true });
    }

    /** 处理新建策略 */
    handleNewPolicy = (event) => {
        const policyStore = this.props.policyStore;
        // 在任务仓库中保存操作类型、窗口名称和缺省任务数据
        policyStore.setPolicyAction(actionType.ACTION_NEW);
        policyStore.setPolicyProcName('新建策略');
        let policyItem = {
            name: '新建策略',
            type: policyType.TYPE_SELF_DEFINITION,//目前只有自定义策略可以新建
        };
        policyStore.initPolicyItem(policyItem);

        // 打开策略数据操作窗口
        this.setState({ showConfig: true });
    }

    /** 新建/编辑策略窗口完成的回调处理 */
    handleCloseConfig = (isOk, policy) => {
        const policyStore = this.props.policyStore;
        if (isOk) {
            if (policyStore.policyAction === actionType.ACTION_NEW) {
                this.addPolicyData();
            } else if (policyStore.policyAction === actionType.ACTION_EDIT) {
                this.editPolicyParams();
            }
        }

        // 关闭策略数据操作窗口
        this.setState({ showConfig: false });
    }

    /** 添加策略数据到前端缓存的数据列表中 */
    addPolicyData = () => {
        const { policies } = this.state;
        // 从仓库中取出新建的策略对象，设置 key 和 index 属性
        const policyItem = this.props.policyStore.policyItem;
        policyItem.key = policies.length + 1;
        policyItem.index = (policies.length + 1).toString();

        // 将新建策略对象添加到策略数据源中（数据源的首位）
        policies.unshift(policyItem);
    }

    /** 确认修改策略后，在策略列表中修改指定数据 */
    editPolicyParams = () => {
        const { policies, recordChangeID } = this.state;
        const policyItem = this.props.policyStore.policyItem;

        // 从仓库中取出编辑后的策略对象，深拷贝到源数据中
        let record = policies[recordChangeID];
        DeepCopy(record, policyItem);
    }

    /** 处理页面变化（页面跳转/切换/每页记录数变化） */
    handlePageChange = (currentPage, pageSize) => {
        this.setState({ currentPage, pageSize });
    }

    callback = (key) => {
        console.log(key);
    }

    getOsTypeNames = (baseline) => {
        if (parseInt(baseline) === osType.TYPE_WINDOWS) {
            return 'Window系统';
        } else {
            return 'Linux系统';
        }
    }

    getConsumeTimeText = (time) => {
        return '大约需要' + time + 'ms';
    }

    rowDetails = (record) => {
        return (
            <Tabs defaultActiveKey="1" onChange={this.callback} >
                <TabPane tab="操作系统" key="1">{this.getOsTypeNames(record.baseline)}</TabPane>
                <TabPane tab="运行内容" key="2">{record.run_contents}</TabPane>
                <TabPane tab="运行时间" key="3">{this.getConsumeTimeText(record.consume_time)}</TabPane>
            </Tabs>
        );
    }

    render() {
        const { columns, showConfig, policies, scrollWidth, scrollHeight } = this.state;
        let self = this;
        const { classes } = this.props;
        const userStore = this.props.userStore;
        return (
            <div>
                <Skeleton loading={userStore.isAdminUser} active avatar>
                    <Row>
                        <Col span={8}><Typography variant="h6">安全策略管理</Typography></Col>
                        <Col span={8} offset={8} align="right"><Button type="primary" size="large" onClick={this.handleNewPolicy.bind(this)}><Icon type="plus-circle-o" />新建策略</Button></Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={policies}
                        bordered={true}
                        scroll={{ x: scrollWidth, y: scrollHeight }}
                        expandedRowRender={record => this.rowDetails(record)}
                        pagination={{
                            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                            pageSizeOptions: [DEFAULT_PAGE_SIZE.toString(), '20', '30', '40'],
                            defaultPageSize: DEFAULT_PAGE_SIZE,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            onShowSizeChange(current, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                                self.handlePageChange(current, pageSize);
                            },
                            onChange(current, pageSize) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                                self.handlePageChange(current, pageSize);
                            },
                        }}
                    />
                    {showConfig && <PolicyParamsConfig actioncb={this.handleCloseConfig} />}
                </Skeleton>
            </div>
        )

    }
}

SecurityConfigView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SecurityConfigView);