import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MaterialTable, { MTableToolbar } from 'material-table'

import NewAccountIcon from '@material-ui/icons/PersonAddOutlined';
import FirstPageIcon from '@material-ui/icons/FirstPageRounded';
import LastPageIcon from '@material-ui/icons/LastPageRounded';
import NextPageIcon from '@material-ui/icons/ChevronRightRounded';
import PreviousPageIcon from '@material-ui/icons/ChevronLeftRounded';
import SearchIcon from '@material-ui/icons/SearchRounded';
import ExportIcon from '@material-ui/icons/SaveRounded';
import ViewColumnIcon from '@material-ui/icons/ViewColumnRounded';
import ExpandDetailIcon from '@material-ui/icons/ChevronRightRounded';
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import RunTaskIcon from '@material-ui/icons/PlayCircleOutline'
import EditTaskIcon from '@material-ui/icons/DescriptionOutlined'

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
    tableContainer: {
        height: 320,
    },
});


let counter = 0;
function createData(name, group, policy_type, risk_level, solution) {
    counter += 1;
    return { index: counter, name: name, group: group, policy_type: policy_type, risk_level: risk_level, solution: solution };
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 500,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class ConfigTable extends React.Component {
    state = {
        rows: [
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
            createData('检查系统补丁安装情况', 'windows基线', 'OS补丁情况', '高', '对服务器系统进行兼容性测试'),
            createData('系统漏洞', 'Linux基线', '漏洞', '高', '系统级系统级系统级系统级系统级'),
        ].sort((a, b) => (a.calories < b.calories ? -1 : 1)),
        page: 0,
        rowsPerPage: 5,
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: event.target.value });
    };

    onClickEditTask = (event, rowData) => {
        // alert('编辑' + rowData.group);
    };

    render() {
        const { classes } = this.props;
        const { rows, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

        return (
            <MaterialTable
                components={{
                    Toolbar: props => (
                        <div style={{ backgroundColor: '#4db6ac' }}>
                            <MTableToolbar {...props} />
                        </div>
                    ),
                }}
                columns={[
                    { title: '#', field: 'index', headerStyle: { textAlign: 'center', minWidth: '50px' } },
                    { title: '名称', field: 'name', headerStyle: { align: 'center', minWidth: '250px' } },
                    { title: '分组', field: 'group', headerStyle: { align: 'center', minWidth: '250px' } },
                    { title: '类型', field: 'policy_type', headerStyle: { align: 'center', minWidth: '250px' } },
                    { title: '危险等级', field: 'risk_level', headerStyle: { align: 'center', minWidth: '250px' } },
                    { title: '解决方案', field: 'solution', headerStyle: { align: 'center', minWidth: '250px' } },
                ]}
                data={rows}
                title="策略列表"
                icons={{
                    FirstPage: FirstPageIcon,
                    LastPage: LastPageIcon,
                    NextPage: NextPageIcon,
                    PreviousPage: PreviousPageIcon,
                    Search: SearchIcon,
                    Export: ExportIcon,
                    ViewColumn: ViewColumnIcon,
                }}
                actions={[
                    {
                        icon: EditTaskIcon,
                        tooltip: '修改',
                        onClick: this.onClickEditTask.bind(this),
                        iconProps: {
                            style: {
                                fontSize: 28,
                                color: '#1e88e5',
                            },
                        },
                    },
                    rowData => ({
                        icon: DeleteIcon,
                        tooltip: '删除',
                        onClick: (event, rowData) => {
                            alert('You clicked user ' + rowData.name)
                        },
                        iconProps: {
                            style: {
                                fontSize: 28,
                                color: '#B71C1C',
                            },
                        },
                    }),
                    {
                        icon: RunTaskIcon,
                        tooltip: '运行',
                        onClick: (event, rowData) => {
                            alert('You clicked user ' + rowData.name)
                        },
                        iconProps: {
                            style: {
                                fontSize: 28,
                                color: 'green',
                            },
                        },
                    },
                ]}
                options={{
                    actionsColumnIndex: -1,
                    exportButton: true,
                    pageSizeOptions: [5, 10, 20, 50],
                    pageSize: 5,
                    // doubleHorizontalScroll: true,
                    columnsButton: true,
                    sorting: false,
                    // toolbar: false,
                    // selection: true,
                }}
                localization={{
                    header: {
                        actions: '',
                    },
                    pagination: {
                        labelDisplayedRows: '{from}-{to} / 总数：{count}',
                        labelRowsPerPage: '每页条数',
                        firstTooltip: '首页',
                        previousTooltip: '上一页',
                        nextTooltip: '下一页',
                        lastTooltip: '最后一页',
                    },
                    toolbar: {
                        exportTitle: '导出',
                        searchTooltip: '查找',
                        addRemoveColumns: '显示列',
                        showColumnsTitle: '显示列',
                    },
                    body: {
                        emptyDataSourceMessage: '没有记录',
                    }
                }}
                detailPanel={[
                    {
                        tooltip: '展开任务细节',
                        icon: ExpandDetailIcon,
                        render: rowData => {
                            return (
                                <div
                                    style={{
                                        fontSize: 40,
                                        textAlign: 'center',
                                        color: 'white',
                                        backgroundColor: '#43A047',
                                    }}
                                >
                                    {rowData.name}
                                </div>
                            )
                        },
                    },
                ]}
                onRowClick={(event, rowData, togglePanel) => togglePanel(0)}

            />
        );
    }
}

ConfigTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConfigTable);
