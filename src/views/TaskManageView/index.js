import React from 'react'
import { Table, Icon, Button } from 'antd'
import { columns as Column } from './Column'
import { TaskData } from './TaskData'
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import RunTaskIcon from '@material-ui/icons/PlayCircleOutline'
import EditTaskIcon from '@material-ui/icons/DescriptionOutlined'


const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class TaskManageView extends React.Component {
    handleDel = (event) => {
        const DelDataSource = this.state.taskRecordData;
        DelDataSource.splice(event.target.getAttribute('dataIndex'), 1);//data-index为获取索引，后面的1为一次去除几行
        this.setState({
            dataSource: DelDataSource,
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            columns: Column,
            taskRecordData: TaskData,
        }
        const { columns } = this.state;
        const { classes } = this.props;
        columns[4].render = (text, record, index) => (
            <div>
                <Button color="secondary" dataIndex={index} onClick={this.handleDel}>删除</Button>
                <Button color="primary" dataIndex={index} onClick={this.handleDel}>编辑</Button>
                <Button color="primary" dataIndex={index} onClick={this.handleDel}>运行</Button>
                {/* <Icon type="delete" color="primary" dataIndex={index} onClick={this.handleDel} />
                <Icon type="delete" color="secondary" dataIndex={index} onClick={this.handleDel} />
                <Icon type="delete" color="primary" dataIndex={index} onClick={this.handleDel} /> */}
                {/* <IconButton className={classes.iconButton} color="primary" aria-label="Edit">
                    <EditTaskIcon />
                </IconButton>
                <IconButton className={classes.iconButton} color="secondary" aria-label="Delete">
                    <DeleteIcon />
                </IconButton>
                <IconButton className={classes.iconButton} color="primary" aria-label="Run">
                    <RunTaskIcon />
                </IconButton> */}
            </div>
        )
        this.setState({ columns: columns });
    }
    render() {
        const { columns, taskRecordData } = this.state;
        return (
            <Table
                columns={columns}
                dataSource={taskRecordData}
                bordered={true}
                scroll={{ x: 1300, y: 500 }}
                pagination={{
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                    pageSizeOptions: ['10', '20', '30', '40'],
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                }}
            />
        )
    }
}

export default withStyles(styles)(TaskManageView);
