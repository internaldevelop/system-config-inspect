import React from 'react'
import PropTypes from 'prop-types';
import { Skeleton, Input, message, Table, Icon, Button, Row, Col, Tabs, Popconfirm } from 'antd'
import { columns as Column } from './Column'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react'
import VulnerParamsConfig from './VulnerParamsConfig'
import { actionType } from '../../global/enumeration/ActionType';
import { DeepClone, DeepCopy } from '../../utils/ObjUtils'
import { GetMainViewHeight } from '../../utils/PageUtils'
import HttpRequest from '../../utils/HttpRequest';
import { isContainSpecialCharacter } from '../../utils/ObjUtils'
import { GetBackEndRootUrl2, BASE_URL2 } from '../../global/environment'

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
    antInput: {
        width: 200,
    },
});

const DEFAULT_PAGE_SIZE = 10;
@inject('vulnerStore')
@inject('userStore')
@observer
class VulnerManageInfoView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfig: false,
            columns: Column,
            vulners: [],
            recordChangeID: -1,
            currentPage: 1,     // Table中当前页码（从 1 开始）
            pageSize: DEFAULT_PAGE_SIZE,
            scrollWidth: 1000,        // 表格的 scrollWidth
            scrollHeight: 300,      // 表格的 scrollHeight
            shadeState: false,
            inputValue1: '',
            inputValue2: '',
            totalResult: 0,
        }
        this.getVulnerResults(this.state.currentPage, this.state.pageSize);
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

    componentWillUnmount() {
        // 组件卸装前，一定要移除监听器
        window.removeEventListener('resize', this.handleResize.bind(this));
    }


    /** 初始化操作列，定义渲染效果 */
    initActionColumn() {
        const { columns } = this.state;
        const { classes } = this.props;
        if (columns.length === 0)
            return;

        columns[columns.length - 1].render = (text, record, index) => (
            <div>
                <Popconfirm title="确定要删除该漏洞信息吗？" onConfirm={this.handleDel(index).bind(this)} okText="确定" cancelText="取消">
                    <Button className={classes.actionButton} type="danger" size="small">删除</Button>
                </Popconfirm>
                <Button className={classes.actionButton} type="primary" size="small" onClick={this.handleEditVulner(index).bind(this)}>编辑</Button>
            </div>
        )

        this.setState({ columns });
    }

    generateResult = (item, index, data) => {
        item.key = index + 1;
        item.index = index + 1;
        item.platform = data.platform.platform;
        item.type = data.type.name;
        item.author = data.author.name;
        item.title = data.description[1];
        item.edb_id = data.edb_id;
        //item.exploit_method_url = data.exploit_method_url;
        item.date_published = data.date_published;
        return item;
    }

    generateResultList = (result) => {
        let vulners = [];
        let index = 0;
        for (let data of result) {
            let item = {};
            vulners.push(this.generateResult(item, index, data));
            index++;
        }
        this.setState({ vulners });
    }

    getResultsCB = (result) => {
        // 检查响应的payload数据是数组类型
        if ((typeof result.payload === "undefined") || (result.payload.items.length === 0)) {
            return;
        }
        let currentPage = (result.payload.items.length % 10 == 0) ? (result.payload.items.length / 10) : (result.payload.items.length / 10 + 1);
        this.setState({ totalResult: result.payload.total, currentPage });
        this.generateResultList(result.payload.items);
        this.initActionColumn();
    }

    getVulnerResults = (currentPage, pageSize) => {
        //let startSet = (currentPage - 1) * pageSize;
        HttpRequest.asyncGet2(this.getResultsCB, '/edb/query', { offset: 0, count: pageSize * currentPage });
    }

    deleteVulnerCB = (dataIndex) => (data) => {
        const { vulners } = this.state;
        // rowIndex 为行索引，第二个参数 1 为一次去除几行
        vulners.splice(dataIndex, 1);
        this.setState({ vulners });
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
        const { vulners } = this.state;
        HttpRequest.asyncGet2(this.deleteVulnerCB(dataIndex), '/edb/delete', { edb_id: vulners[dataIndex].edb_id });
    }

    // 导出报告
    exportReport = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);
        window.location.href = GetBackEndRootUrl2(BASE_URL2) + '/edb/exportxls?edb_id=' + this.state.vulners[dataIndex].edb_id;
    }

    /** 处理编辑操作 */
    handleEditVulner = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);
        const vulnerItem = this.state.vulners[dataIndex];
        const vulnerStore = this.props.vulnerStore;
        vulnerStore.setVulnerAction(actionType.ACTION_EDIT);
        vulnerStore.setVulnerProcName('编辑漏洞参数');
        vulnerStore.initVulnerItem(vulnerItem);
        this.setState({ recordChangeID: dataIndex, showConfig: true });
    }

    handleNewVulner = (event) => {
        const vulnerStore = this.props.vulnerStore;
        vulnerStore.setVulnerAction(actionType.ACTION_NEW);
        vulnerStore.setVulnerProcName(('新建漏洞'));
        let vulnerItem = {
            title: '新建漏洞',
        };
        vulnerStore.initVulnerItem(vulnerItem);
        this.setState({ showConfig: true });
    }

    handleCloseConfig = (isOk, policy) => {
        const vulnerStore = this.props.vulnerStore;
        if (isOk) {
            if (vulnerStore.vulnerAction === actionType.ACTION_NEW) {
                this.addVulnerData();
            } else if (vulnerStore.vulnerAction === actionType.ACTION_EDIT) {
                this.editVulnerParams();
            }
        }
        this.setState({ showConfig: false });
    }

    addVulnerData = () => {
        const { vulners } = this.state;
        const vulnerItem = this.props.vulnerStore.vulnerItem;
        vulnerItem.key = vulners.length + 1;
        vulnerItem.index = (vulners.length + 1).toString();
        vulners.unshift(vulnerItem);
    }

    editVulnerParams = () => {
        const { vulners, recordChangeID } = this.state;
        const vulnerItem = this.props.vulnerStore.vulnerItem;
        let record = vulners[recordChangeID];
        DeepCopy(record, vulnerItem);
    }

    /** 处理页面变化（页面跳转/切换/每页记录数变化） */
    handlePageChange = (currentPage, pageSize) => {
        this.getVulnerResults(currentPage, pageSize);
    }

    callback = (key) => {
        console.log(key);
    }

    handleGetInputValue1 = (event) => {
        this.setState({
            inputValue1: event.target.value,
        })
    };

    handleGetInputValue2 = (event) => {
        this.setState({
            inputValue2: event.target.value,
        })
    };

    getFuzzySearchCB = (result) => {
        // 检查响应的payload数据是数组类型
        if ((typeof result.payload === "undefined") || (result.payload.items.length === 0)) {
            message.info('没有查询到数据，请重新输入');
            return;
        }
        this.generateResultList(result.payload.items);
        this.initActionColumn();
    }

    getExactSearchCB = (result) => {
        // 检查响应的payload数据是数组类型
        if (typeof result.payload === "undefined") {
            message.info('没有查询到数据，请重新输入');
            return;
        }
        let vulners = [];
        let item = {};
        vulners.push(this.generateResult(item, 0, result.payload));
        this.setState({ vulners });
    }

    checkSearch = (value) => {
        if (value === null || value === '') {
            message.info('查询条件不能为空，请重新输入');
            document.getElementById('value').value = '';
            return false;
        } else if (value.length > 20) {
            message.info('查询条件长度不能超过20，请重新输入');
            document.getElementById('value').value = '';
            return false;
        } else if (isContainSpecialCharacter(value)) {
            message.info('查询条件含有特殊字符，请重新输入');
            document.getElementById('value').value = '';
            return false;
        }
        return true;
    }

    getFuzzySearch = () => {
        const { inputValue1 } = this.state;
        if (!this.checkSearch(inputValue1)) {
            return;
        }
        this.setState({
            inputValue2: '',
        });
        HttpRequest.asyncGet2(this.getFuzzySearchCB, '/edb/search', { field: 'db', value: inputValue1, offset: 0, count: this.state.pageSize * this.state.currentPage });
    };

    getExactSearch = () => {
        const { inputValue2 } = this.state;
        if (!this.checkSearch(inputValue2)) {
            return;
        }
        this.setState({
            inputValue1: '',
        });
        HttpRequest.asyncGet2(this.getExactSearchCB, '/edb/fetch', { edb_id: inputValue2 });
    };

    render() {
        const { totalResult, columns, showConfig, vulners, scrollWidth, scrollHeight } = this.state;
        let self = this;
        const { classes } = this.props;
        const userStore = this.props.userStore;
        return (
            <div>
                <Skeleton loading={userStore.isAdminUser} active avatar>
                    <Row>
                        <Col span={4}><Typography variant="h6">漏洞库信息管理</Typography></Col>
                        <Col span={7} align="left">
                            <Input className={classes.antInput} size="large" value={this.state.inputValue1} onChange={this.handleGetInputValue1} placeholder="漏洞名称" />
                            <Button className={classes.iconButton} type="primary" size="large" onClick={this.getFuzzySearch} ><Icon type="file-search" />模糊查询</Button>
                        </Col>
                        <Col span={7} align="left">
                            <Input className={classes.antInput} size="large" value={this.state.inputValue2} onChange={this.handleGetInputValue2} placeholder="漏洞编号" />
                            <Button className={classes.iconButton} type="primary" size="large" onClick={this.getExactSearch} ><Icon type="search" />精确查询</Button>
                        </Col>
                        <Col span={4} align="right"><Button type="primary" size="large" onClick={this.handleNewVulner.bind(this)}><Icon type="plus-circle-o" />新建漏洞信息</Button></Col>
                        <Col span={2} align="right">
                            <Button className={classes.actionButton} type="primary" size="large" onClick={this.exportReport(1).bind(this)}>导出报告</Button>
                        </Col>
                    </Row>
                    <Table
                        id="vulnerListTable"
                        columns={columns}
                        dataSource={vulners}
                        bordered={true}
                        scroll={{ x: scrollWidth, y: scrollHeight }}
                        rowKey={record => record.uuid}
                        pagination={{
                            total: totalResult > 0 ? totalResult : 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                            pageSizeOptions: [DEFAULT_PAGE_SIZE.toString(), '20', '30', '40'],
                            defaultPageSize: DEFAULT_PAGE_SIZE,
                            //showQuickJumper: true,
                            showSizeChanger: true,
                            onShowSizeChange(current, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                                self.handlePageChange(current, pageSize);
                            },
                            onChange(current, pageSize) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                                self.handlePageChange(current, pageSize);
                            },
                        }}
                    />
                    {showConfig && <VulnerParamsConfig actioncb={this.handleCloseConfig} />}
                </Skeleton>
            </div>
        )

    }
}

VulnerManageInfoView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(VulnerManageInfoView);