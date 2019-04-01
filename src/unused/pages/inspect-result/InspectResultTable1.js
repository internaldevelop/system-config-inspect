import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MaterialTable, { MTableToolbar } from 'material-table'

import FirstPageIcon from '@material-ui/icons/FirstPageRounded';
import LastPageIcon from '@material-ui/icons/LastPageRounded';
import NextPageIcon from '@material-ui/icons/ChevronRightRounded';
import PreviousPageIcon from '@material-ui/icons/ChevronLeftRounded';
import SearchIcon from '@material-ui/icons/SearchRounded';
import ExportIcon from '@material-ui/icons/SaveRounded';
import ViewColumnIcon from '@material-ui/icons/ViewColumnRounded';
import ExpandDetailIcon from '@material-ui/icons/ChevronRightRounded';
// import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
// import RunTaskIcon from '@material-ui/icons/PlayCircleOutline'
// import EditTaskIcon from '@material-ui/icons/DescriptionOutlined'

// const actionsStyles = theme => ({
//     root: {
//         flexShrink: 0,
//         color: theme.palette.text.secondary,
//         marginLeft: theme.spacing.unit * 2.5,
//     },
//     tableContainer: {
//         height: 20,
//     },
// });


let counter = 0;
function createData(task_name, task_id, target_name, target_ip, risk_type, risk_desc, risk_level, solution) {
    counter += 1;
    return { index: counter, 
        task_name: task_name, 
        task_id: task_id, 
        target_name: target_name, 
        target_ip: target_ip, 
        risk_type: risk_type, 
        risk_desc: risk_desc, 
        risk_level: risk_level, 
        solution: solution };
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

class InspectResultTable1 extends React.Component {
    state = {
        rows: [
            createData('检查系统补丁安装情况', '1', '工控服务器', '192.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '1', '数据库服务器', '192.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '1', '工控服务器', '202.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '12', '数据库服务器', '45.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '21', '工控服务器', '45.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '13', '数据库服务器', '192.168.1.125', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '1', '工控服务器', '192.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '1', '数据库服务器', '192.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '1', '工控服务器', '202.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '12', '数据库服务器', '45.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '21', '工控服务器', '45.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '13', '数据库服务器', '192.168.1.125', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '1', '工控服务器', '192.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '1', '数据库服务器', '192.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '1', '工控服务器', '202.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '12', '数据库服务器', '45.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '21', '工控服务器', '45.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '13', '数据库服务器', '192.168.1.125', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '1', '工控服务器', '192.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '1', '数据库服务器', '192.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '1', '工控服务器', '202.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '12', '数据库服务器', '45.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '21', '工控服务器', '45.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '13', '数据库服务器', '192.168.1.125', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '1', '工控服务器', '192.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '1', '数据库服务器', '192.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '1', '工控服务器', '202.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '12', '数据库服务器', '45.168.1.15', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检查系统补丁安装情况', '21', '工控服务器', '45.168.1.15', '操作系统补丁安装', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
            createData('检测系统网络', '13', '数据库服务器', '192.168.1.125', '网络通信配置', 'Windows Alerter服务没有启动安全通知', '中', '进入【控制面板】->【操作中心】，进入【更改操作中心设置】，选择所有安全消息'),
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
        // const { classes } = this.props;
        const { rows } = this.state;
        // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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
                    { title: '检测任务', field: 'task_name', headerStyle: { align: 'center', minWidth: '200px' } },
                    { title: '任务ID', field: 'task_id', headerStyle: { align: 'center', minWidth: '50px' } },
                    { title: '检测目标', field: 'target_name', headerStyle: { align: 'center', minWidth: '150px' } },
                    { title: '目标IP', field: 'target_ip', headerStyle: { align: 'center', minWidth: '150px' } },
                    { title: '问题类型', field: 'risk_type', headerStyle: { align: 'center', minWidth: '150px' } },
                    { title: '问题描述', field: 'risk_desc', headerStyle: { align: 'center', minWidth: '250px' } },
                    { title: '危害等级', field: 'risk_level', headerStyle: { align: 'center', minWidth: '50px' } },
                    { title: '建议方案', field: 'solution', headerStyle: { align: 'center', minWidth: '250px' } },
                ]}
                data={rows}
                title="检测结果"
                icons={{
                    FirstPage: FirstPageIcon,
                    LastPage: LastPageIcon,
                    NextPage: NextPageIcon,
                    PreviousPage: PreviousPageIcon,
                    Search: SearchIcon,
                    Export: ExportIcon,
                    ViewColumn: ViewColumnIcon,
                }}
                options={{
                    actionsColumnIndex: -1,
                    exportButton: true,
                    pageSizeOptions: [5, 10, 20, 50],
                    pageSize: 5,
                    // doubleHorizontalScroll: true,
                    columnsButton: true,
                    sorting: false,
                    rowStyle: {
                        maxHeight: 20,
                        height: '20px',
                    },
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
                        tooltip: '查看检测结果详情',
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
                                    {rowData.solution}
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

InspectResultTable1.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InspectResultTable1);
