import React from 'react'
import PropTypes from 'prop-types';
import { Skeleton, Input, message, Table, Icon, Button, Row, Col, Tabs, Modal, Popconfirm } from 'antd'
import { columns as Column } from './Column'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react'
import VulnerMethodParamsConfig from './VulnerMethodParamsConfig'
import { actionType } from '../../global/enumeration/ActionType';
import { DeepClone, DeepCopy } from '../../utils/ObjUtils'
import { GetMainViewHeight } from '../../utils/PageUtils'
import HttpRequest from '../../utils/HttpRequest';
import { isContainSpecialCharacter } from '../../utils/ObjUtils'
import { GetBackEndRootUrl2, BASE_URL2 } from '../../global/environment'
import { errorCode } from '../../global/error'

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
@inject('vulnerMethodStore')
@inject('userStore')
@observer
class VulnerMethodManageInfoView extends React.Component {
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
            queryType: 0,
        }
        this.getVulnerResults(this.state.currentPage, this.state.pageSize, this.state.queryType);
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
                <Popconfirm title="确定要删除该条POC吗？" onConfirm={this.handleDel(index).bind(this)} okText="确定" cancelText="取消">
                    <Button className={classes.actionButton} disabled={this.isNewStatus(index) || !this.isCustomizedData(index)} type="danger" size="small">删除</Button>
                </Popconfirm>
                <Button className={classes.actionButton} disabled={this.isNewStatus(index)} type="primary" size="small" onClick={this.exportReport(index).bind(this)}>导出</Button>
            </div>
        )

        columns[3].render = (text, record, index) => {
            return (
                <div>
                <span>{text}</span>
                {!this.isNewStatus(index) && this.isCustomizedData(index) && <Button className={classes.actionButton} type="primary" size="small" onClick={this.handleEditVulner(index).bind(this)}>编辑</Button>}
                {!this.isNewStatus(index) && !this.isCustomizedData(index) && <Button className={classes.actionButton} type="primary" size="small" onClick={this.checkPoc(index).bind(this)}>查看</Button>}
                {this.isNewStatus(index) && this.isCustomizedData(index) && <Button type="primary" size="small" onClick={this.handleNewVulner(index).bind(this)}>新建POC</Button>}
            </div>
            )
        }
        this.setState({ columns });
    }

    isNewStatus = (rowIndex) => {
        const { vulners } = this.state;
        if (vulners == null || vulners.length <= 0) {
            return false;
        }
        let dataIndex = this.transferDataIndex(rowIndex);
        if (vulners[dataIndex] !== undefined && vulners[dataIndex].poc !== null) {
            return false;
        }
        return true;
    }

    isCustomizedData = (rowIndex) => {
        const { vulners } = this.state;
        if (vulners == null || vulners.length <= 0) {
            return false;
        }
        let dataIndex = this.transferDataIndex(rowIndex);
        if (!!vulners[dataIndex] && !!vulners[dataIndex].customized && vulners[dataIndex].customized === 1) {
            return true;
        }
        return false;
    }

    getVulnerProContentCB = (data) => {
        if (!!data.payload && !!data.payload.poc) {
            this.showVulnerProContent(data.payload.poc.aliases, data.payload.poc.content);
        }
    }

    showVulnerProContent = (title, content) => {
        Modal.info({
            title: '文件名： ' + title,
            keyboard: true,         // 是否支持键盘 esc 关闭
            destroyOnClose: true,   // 关闭时销毁 Modal 里的子元素
            closable: false,         // 是否显示右上角的关闭按钮
            width: 800,
            content: (
                <div>
                    {content}
                </div>
            ),
            onOk() {
                // message.info('OK');
            },
        });
    }

    checkPoc = (rowIndex) => (event) => {
        const { vulners } = this.state;
        if (vulners == null || vulners.length <= 0) {
            return false;
        }
        let dataIndex = this.transferDataIndex(rowIndex);
        if (vulners[dataIndex].content !== null && vulners[dataIndex].content !== undefined) {
            this.showVulnerProContent(vulners[dataIndex].aliases, vulners[dataIndex].content);
        } else {
            HttpRequest.asyncGet2(this.getVulnerProContentCB, '/edb/poc/fetch', { edb_id: vulners[dataIndex].edb_id });
        }
    }

    generateResult = (item, data) => {
        if (data.customized !== undefined && data.customized !== null) {
            item.customized = data.customized;
        }
        if (data.description === undefined) {
            //item.title = data.description[1];
            item.edb_id = data.edb_id;
            item.fileName = data.poc.aliases;
            item.fileType = data.poc.content_type;
            item.content = data.poc.content;
        } else {
            item.title = data.description[1];
            item.edb_id = data.edb_id;
            if (data.poc !== null && data.poc !== undefined) {
                item.fileName = data.poc.aliases;
                item.fileType = data.poc.content_type;
                item.content = data.poc.content;
            }
        }
        //item.exploit_method_url = data.exploit_method_url;
        //item.date_published = data.date_published;
        return item;
    }

    generateResultList = (result, totalResult, currentPage, queryType) => {
        let vulners = [];
        vulners = result.map((item, index) => {
            let taskItem = DeepClone(item);
            taskItem.key = index + 1;
            taskItem.index = index + 1;
            taskItem.title = item.description[1];
            // this.generateResult(taskItem, item)
            return taskItem;
        })

        this.setState({ vulners, totalResult, currentPage, queryType });
    }

    getResultsCB = (result) => {
        // 检查响应的payload数据是数组类型
        if (result.code !== errorCode.ERROR_OK
            || (typeof result.payload === "undefined") || (result.payload.items === null)
            || (result.payload.items.length === 0)) {
            message.info('没有查询到数据，请重新输入。');
            return;
        }
        //let currentPage = (result.payload.items.length % 10 == 0) ? (parseInt(result.payload.items.length / 10)) : (parseInt(result.payload.items.length / 10) + 1);
        let currentPage = this.state.currentPage;
        this.generateResultList(result.payload.items, result.payload.total, currentPage, 0);
        this.initActionColumn();
    }

    getVulnerResults = (currentPage, pageSize, queryType) => {
        //let startSet = (currentPage - 1) * pageSize;
        if (queryType === 1) {
            this.fuzzySearch(currentPage);
        } else if (queryType === 2) {
            this.getExactSearch();
        } else {
            HttpRequest.asyncGet2(this.getResultsCB, '/edb/poc/search', { value: '', offset: 0, count: pageSize * currentPage }, false);
        }
    }

    deleteVulnerCB = (dataIndex) => (data) => {
        // 删除poc不影响当前table的行数
        //vulners.splice(dataIndex, 1);
        this.getVulnerResults(this.state.currentPage, this.state.pageSize, this.state.queryType);
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
        HttpRequest.asyncGet2(this.deleteVulnerCB(dataIndex), '/edb/poc/delete', { edb_id: vulners[dataIndex].edb_id });
    }

    getMethodContentCB = (result) => {
        if (typeof result.payload === "undefined") {
            //message.info('没有查询到利用方法具体内容。');
            return;
        }
        const vulnerMethodItem = this.props.vulnerMethodStore.vulnerMethodItem;
        vulnerMethodItem.poc.content = result.payload.poc.content;
        this.setState({ showConfig: true });
    }

    // 导出报告
    exportReport = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);
        const vulnerMethodItem = this.state.vulners[dataIndex];
        if (vulnerMethodItem.poc.aliases !== null && vulnerMethodItem.poc.aliases !== undefined) {
            window.location.href = GetBackEndRootUrl2(BASE_URL2) + '/edb/poc/download?edb_id=' + this.state.vulners[dataIndex].edb_id;
        } else {
            message.info('没有查询到相应的利用方法文件。');
        }
    }

    /** 处理编辑操作 */
    handleEditVulner = (rowIndex) => (event) => {
        // 从行索引转换成实际的数据索引
        let dataIndex = this.transferDataIndex(rowIndex);
        const vulnerMethodItem = this.state.vulners[dataIndex];
        const vulnerMethodStore = this.props.vulnerMethodStore;
        vulnerMethodStore.setVulnerMethodAction(actionType.ACTION_EDIT);
        vulnerMethodStore.setVulnerMethodProcName('编辑利用方法参数');
        vulnerMethodStore.initVulnerMethodItem(vulnerMethodItem);
        this.setState({ recordChangeID: dataIndex });
        HttpRequest.asyncGet2(this.getMethodContentCB, '/edb/poc/fetch', { edb_id: this.state.vulners[dataIndex].edb_id });
    }

    handleNewVulner = (rowIndex) => (event) => {
        const { vulners } = this.state;
        let dataIndex = this.transferDataIndex(rowIndex);
        const vulnerMethodStore = this.props.vulnerMethodStore;
        vulnerMethodStore.setVulnerMethodAction(actionType.ACTION_NEW);
        vulnerMethodStore.setVulnerMethodProcName(('新建漏洞利用方法'));
        let vulnerMethodItem = {
            poc: {'aliases': '', content_type: '', content: ''},//新建漏洞利用方法
            customized: 1,
            edb_id: vulners[dataIndex].edb_id,
        };
        vulnerMethodStore.initVulnerMethodItem(vulnerMethodItem);
        this.setState({ showConfig: true, recordChangeID: dataIndex });
    }

    handleCloseConfig = (isOk, policy) => {
        const vulnerMethodStore = this.props.vulnerMethodStore;
        if (isOk) {
            if (vulnerMethodStore.vulnerMethodAction === actionType.ACTION_NEW) {
                this.editVulnerParams();
            } else if (vulnerMethodStore.vulnerMethodAction === actionType.ACTION_EDIT) {
                this.editVulnerParams();
            }
        }
        this.setState({ showConfig: false });
    }

    addVulnerData = () => {
        const { vulners } = this.state;
        const vulnerMethodItem = this.props.vulnerMethodStore.vulnerMethodItem;
        vulnerMethodItem.key = vulners.length + 1;
        vulnerMethodItem.index = (vulners.length + 1).toString();
        vulners.unshift(vulnerMethodItem);
    }

    editVulnerParams = () => {
        const { vulners, recordChangeID } = this.state;
        const vulnerMethodItem = this.props.vulnerMethodStore.vulnerMethodItem;
        let record = vulners[recordChangeID];
        DeepCopy(record, vulnerMethodItem);
    }

    /** 处理页面变化（页面跳转/切换/每页记录数变化） */
    handlePageChange = (currentPage, pageSize) => {
        this.setState({currentPage});
        this.getVulnerResults(currentPage, pageSize, this.state.queryType);
    }

    callback = (key) => {
        console.log(key);
    }

    handleFuzzyKeyPressed = (event) => {
        if (event.which === 13) {
            this.fuzzySearch(1);
        }
    }

    handleExactKeyPressed = (event) => {
        if (event.which === 13) {
            this.exactSearch();
        }
    }

    handleGetInputValue1 = (event) => {
        if (event.target.value === '' && (this.state.inputValue2 === '' || this.state.inputValue2 === undefined)) {
            this.getVulnerResults(this.state.currentPage, this.state.pageSize, 0);
        }
        this.setState({
            inputValue1: event.target.value,
        })
    };

    handleGetInputValue2 = (event) => {
        if (event.target.value === '' && (this.state.inputValue1 === '' || this.state.inputValue1 === undefined)) {
            this.getVulnerResults(this.state.currentPage, this.state.pageSize, 0);
        }
        this.setState({
            inputValue2: event.target.value,
        })
    };

    getFuzzySearchCB = (result) => {
        // 检查响应的payload数据是数组类型
        if (result.code !== errorCode.ERROR_OK
            || (typeof result.payload === "undefined")
            || (result.payload.items === null)
            || (result.payload.items.length === 0)) {
            message.info('没有查询到数据，请重新输入。');
            this.setState({
                //inputValue1: '',
                vulners: [],
                totalResult: 0,
            })
            return;
        }
        this.generateResultList(result.payload.items, result.payload.total, 1, 1);
        this.initActionColumn();
    }

    getExactSearchCB = (result) => {
        // 检查响应的payload数据是数组类型
        if (typeof result.payload === "undefined" || result.code !== errorCode.ERROR_OK) {
            message.info('没有查询到数据，请重新输入。');
            this.setState({
                //inputValue2: '',
                vulners: [],
            })
            return;
        }
        let vulnersData = [result.payload];
        this.generateResultList(vulnersData, 1, 1, 2);
    }

    checkSearch = (inputValue) => {
        if (inputValue === null || inputValue === '') {
            message.info('查询条件不能为空，请重新输入');
            return false;
        } else if (inputValue.length > 20) {
            message.info('查询条件长度不能超过20，请重新输入');
            return false;
        } else if (isContainSpecialCharacter(inputValue)) {
            message.info('查询条件含有特殊字符，请重新输入');
            return false;
        }
        return true;
    }

    getFuzzySearch = (currentPage) => (event) => {
        this.fuzzySearch(currentPage);
    };

    fuzzySearch = (currentPage) => {
        const { inputValue1 } = this.state;
        if (!this.checkSearch(inputValue1)) {
            return;
        }
        this.setState({
            inputValue2: '',
            queryType: 1,
        });
        HttpRequest.asyncGet2(this.getFuzzySearchCB, '/edb/poc/search', { value: inputValue1, offset: 0, count: this.state.pageSize * this.state.currentPage }, false);
    };

    getExactSearch = () => (event) => {
        this.exactSearch();
    };

    exactSearch = () => {
        const { inputValue2 } = this.state;
        if (!this.checkSearch(inputValue2)) {
            return;
        }
        this.setState({
            inputValue1: '',
            queryType: 2,
        });
        HttpRequest.asyncGet2(this.getExactSearchCB, '/edb/poc/fetch', { edb_id: inputValue2 }, false);
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
                        <Col span={8}><Typography variant="h6">漏洞利用方法管理</Typography></Col>
                        <Col span={8} align="left">
                            <Input className={classes.antInput} size="large" value={this.state.inputValue1} onChange={this.handleGetInputValue1.bind(this)} placeholder="漏洞名称" onKeyPress={this.handleFuzzyKeyPressed.bind(this)} />
                            <Button className={classes.iconButton} type="primary" size="large" onClick={this.getFuzzySearch(1).bind(this)} ><Icon type="file-search" />模糊查询</Button>
                        </Col>
                        <Col span={8} align="right">
                            <Input className={classes.antInput} size="large" value={this.state.inputValue2} onChange={this.handleGetInputValue2.bind(this)} placeholder="漏洞编号" onKeyPress={this.handleExactKeyPressed.bind(this)} />
                            <Button className={classes.iconButton} type="primary" size="large" onClick={this.getExactSearch().bind(this)} ><Icon type="search" />精确查询</Button>
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
                    {showConfig && <VulnerMethodParamsConfig actioncb={this.handleCloseConfig} />}
                </Skeleton>
            </div>
        )

    }
}

VulnerMethodManageInfoView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(VulnerMethodManageInfoView);