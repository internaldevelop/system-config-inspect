import React from './node_modules/react'
import PropTypes from './node_modules/prop-types';
import { Skeleton, Table, Icon, Button, Row, Col, Tabs, Popconfirm } from './node_modules/antd'
import { columns as Column } from './Column'
import { withStyles } from './node_modules/@material-ui/core/styles';
import Typography from './node_modules/@material-ui/core/Typography';
import { observer, inject } from './node_modules/mobx-react'
import AssetParamsConfig from './AssetParamsConfig'
import { actionType } from '../../global/enumeration/ActionType';
import { DeepClone, DeepCopy } from '../../utils/ObjUtils'
import { GetMainViewHeight } from '../../utils/PageUtils'
import HttpRequest from '../../utils/HttpRequest';

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
@inject('assetStore')
@inject('userStore')
@observer
class AlertConfigView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollWidth: 1000,        // 表格的 scrollWidth
            scrollHeight: 300,      // 表格的 scrollHeight
        }
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

    render() {
        const { columns, showConfig, assets, scrollWidth, scrollHeight } = this.state;
        let self = this;
        const userStore = this.props.userStore;
        return (
            <div>
                <Skeleton loading={userStore.isAdminUser} active avatar>
                    <Row>
                        <Col span={8}><Typography variant="h6">资产管理</Typography></Col>
                        
                    </Row>
                </Skeleton>
            </div>
        )

    }
}

AlertConfigView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(AlertConfigView);