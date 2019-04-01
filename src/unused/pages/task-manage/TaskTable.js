import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import MaterialTable, { MTableToolbar } from 'material-table'

// import NewAccountIcon from '@material-ui/icons/PersonAddOutlined';
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

// const actionsStyles = theme => ({
//     root: {
//         flexShrink: 0,
//         color: theme.palette.text.secondary,
//         marginLeft: theme.spacing.unit * 2.5,
//     },
//     tableContainer: {
//         height: 320,
//     },
// });


let counter = 0;
function createData(task_name, run_status, change_time) {
    counter += 1;
    return { index: counter, task_name, run_status, change_time };
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

class TaskTable extends React.Component {
    state = {
        rows: [
            createData('任务-1', '已完成', '2018-1-12'),
            createData('检测本地资产检测本地资产检测本地资产检测本地资产', '已完成', '2018-1-12'),
            createData('远程检查', '运行中', '2018-1-12'),
            createData('测试任务-2', '已暂停', '2018-1-12'),
            createData('测试任务-10', '已完成', '2018-1-12'),
            createData('任务-1', '已完成', '2018-1-12'),
            createData('检测本地资产', '已完成', '2018-1-12'),
            createData('远程检查', '运行中', '2018-1-12'),
            createData('测试任务-2', '已暂停', '2018-1-12'),
            createData('测试任务-10', '已完成', '2018-1-12'),
            createData('任务-1', '已完成', '2018-1-12'),
            createData('检测本地资产', '已完成', '2018-1-12'),
            createData('远程检查', '运行中', '2018-1-12'),
            createData('测试任务-2', '已暂停', '2018-1-12'),
            createData('测试任务-10', '已完成', '2018-1-12'),
            createData('任务-1', '已完成', '2018-1-12'),
            createData('检测本地资产', '已完成', '2018-1-12'),
            createData('远程检查', '运行中', '2018-1-12'),
            createData('测试任务-2', '已暂停', '2018-1-12'),
            createData('测试任务-10', '已完成', '2018-1-12'),
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
        // alert('编辑' + rowData.task_name);
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
                    { title: '任务名称', field: 'task_name', headerStyle: { align: 'center', minWidth: '250px' } },
                    { title: '运行状态', field: 'run_status', headerStyle: { align: 'center', minWidth: '250px' } },
                    { title: '修改时间', field: 'change_time', type: 'datetime', headerStyle: { align: 'center', minWidth: '250px' } },
                ]}
                data={rows}
                title="检测任务列表"
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
                    rowStyle: {height: 50},
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
                                    {rowData.task_name}
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

TaskTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TaskTable);
