import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Table, Icon, Button, Row, Col } from 'antd'

import { columns as Column } from './Column'
import { ResultData } from './ResultData'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

class InspectResultView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: Column,
            resultRecordData: ResultData,
        }
    }

    render() {
        const { columns, resultRecordData } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <Row>
                    <Col span={8}><Typography variant="h6">检测结果</Typography></Col>
                    <Col span={8} offset={8} align="right">
                        <Button className={classes.iconButton} type="primary" size="large" ><Icon type="search" />查询</Button>
                        <Button className={classes.iconButton} type="primary" size="large" ><Icon type="export" />导出</Button>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={resultRecordData}
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
            </div>
        )

    }
}

InspectResultView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(InspectResultView);