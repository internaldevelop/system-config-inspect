import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, DatePicker, Col, Row, Table, Layout, Select, Input, Button } from 'antd';
import moment from 'moment';

import EllipsisText from '../../components/widgets/EllipsisText';
import { GetMainViewHeight, GetMainViewMinHeight, GetMainViewMinWidth } from '../../utils/PageUtils'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class ExceptionLogsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultData: [],
            // policyList: [],
            // beginTime: '2019-01-01 00:00:00',
            // endTime: GetNowTimeMyStr(),
            // scanResult: '',
            // scrollWidth: 2000,        // 表格的 scrollWidth
            // scrollHeight: 300,      // 表格的 scrollHeight
            // loading: false,     // 表格数据在加载完成前为 true，加载完成后是 false
            // selectedPolicies: '',
        };

        // this.queryPolicies();

        // this.queryResultHistory();
    };

    getFilters = (dataList, key) => {
        // let values = [];
        // for (let item of dataList) {
        //     if ((item[key].length > 0) && (values.indexOf(item[key]) < 0)) {
        //         values.push(item[key]);
        //     }
        // }
        // return values.map(item => { return { text: item, value: item }; });
    }


    getTableColumns() {
        const ratio = 1;
        const { resultData } = this.state;
        const tableColumns = [
            {
                title: '序号', dataIndex: 'index', key: 'index', width: 80,
            },
            {
                title: '任务名称', dataIndex: 'task_name', width: 200,
                render: content => <EllipsisText style={{ cursor: "pointer" }}
                    content={content} width={200 * ratio} />,
            },
            {
                title: '操作员', dataIndex: 'operator_name', width: 150,
                render: content => <EllipsisText style={{ cursor: "pointer" }}
                    content={content} width={150 * ratio} />,
            },
            {
                title: '执行任务时间', dataIndex: 'exec_time', width: 150,
            },
            {
                title: '主机名', dataIndex: 'asset_name', width: 150,
                render: content => <EllipsisText style={{ cursor: "pointer" }}
                    content={content} width={150 * ratio} />,
            },
            {
                title: '项目名称', dataIndex: 'project_name', width: 150,
                render: content => <EllipsisText style={{ cursor: "pointer" }}
                    content={content} width={150 * ratio} />,
            },
        ];
        return tableColumns;
    }

    getTableProps() {
        const DEFAULT_PAGE_SIZE = 10;
        const { scrollWidth, scrollHeight } = this.state;
        let newScrollHeight = scrollHeight > 500 ? scrollHeight - 80 : scrollHeight;

        const tableProps = {
            columns: this.getTableColumns(),
            rowKey: record => record.uuid,
            dataSource: this.state.resultData,
            scroll: { x: scrollWidth, y: newScrollHeight },
            bordered: true,
            pagination: {
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                pageSizeOptions: [DEFAULT_PAGE_SIZE.toString(), '20', '50'],
                defaultPageSize: DEFAULT_PAGE_SIZE,
                showQuickJumper: true,
                showSizeChanger: true,
            }
        };
        return tableProps;
    }


    render() {
        return (
            <div style={{ minWidth: GetMainViewMinWidth(), minHeight: GetMainViewMinHeight() }}>
                <Card title={'异常日志'} style={{ width: '100%', height: '100%' }}
                >
                    <Table {...this.getTableProps()} />
                </Card>

            </div>
        );
    }

}

ExceptionLogsView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(ExceptionLogsView);

