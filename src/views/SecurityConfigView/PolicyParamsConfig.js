import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import Draggable from '../../components/window/Draggable'
import { observer, inject } from 'mobx-react'
import { Upload, Modal, Row, Col, message, AutoComplete, Icon, Button } from 'antd';
import TextField from '@material-ui/core/TextField';
import { DeepClone } from '../../utils/ObjUtils'

import HttpRequest from '../../utils/HttpRequest'
import { errorCode } from '../../global/error';
import { actionType } from '../../global/enumeration/ActionType';
import { policyType } from '../../global/enumeration/PolicyType';
import { osType } from '../../global/enumeration/OsType';
import { eng2chn } from '../../utils/StringUtils'


const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
    },
    formControl: {
        minWidth: 200,
    },
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
    searchItemStyle: {
        marginTop: 20,
        //minHeight: 100,
    },
});

const osTypeNames = ['Windows', 'Linux'];
let groupChangedValue = '';
let assetChangedValue = '';


@inject('policyStore')
@inject('dictStore')
@inject('userStore')
@observer
class PolicyParamsConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assetNames: [],
            assets: [],
            groups: [],
            groupNames: [],
            fileList: [],
        }

        // 从后台获取所有设备列表
        this.getAllAssets();
        // 获取所有策略组名称
        this.getAllPolicyGroups();
    }

    getAllPolicyGroups() {
        HttpRequest.asyncGet(this.getAllPolicyGroupsCB, '/policy-groups/all')
    }

    getAllPolicyGroupsCB = (data) => {
        const { group_uuid } = this.props.policyStore.policyItem;
        const policyStore = this.props.policyStore;
        let group_name;
        let groups = [];
        let groupNames = [];
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array))
            return;

        // 从响应数据生成 table 数据源
        groups = data.payload.map((group, index) => {
            let groupItem = DeepClone(group);
            // antd 表格需要数据源中含 key 属性
            groupItem.key = index + 1;
            // 表格中索引列（后台接口返回数据中没有此属性）
            groupItem.index = index + 1;
            groupNames.push(group.name);
            if (policyStore.policyAction === actionType.ACTION_EDIT && group.uuid === group_uuid) {
                group_name = group.name;
            }
            return groupItem;
        })

        // 更新 policyGroups 数据源
        this.setState({ groups });
        this.setState({ groupNames });
        this.setState({ group_name });
    }

    /** 从后台请求所有设备数据，请求完成后的回调 */
    getAllAssetsCB = (data) => {
        const { asset_uuid } = this.props.policyStore.policyItem;
        const policyStore = this.props.policyStore;
        let asset_name;
        let assets = [];
        let assetNames = [];
        // 检查响应的payload数据是数组类型
        if (!(data.payload instanceof Array))
            return;

        // 从响应数据生成 table 数据源
        assets = data.payload.map((asset, index) => {
            let assetItem = DeepClone(asset);
            // antd 表格需要数据源中含 key 属性
            assetItem.key = index + 1;
            // 表格中索引列（后台接口返回数据中没有此属性）
            assetItem.index = index + 1;
            assetNames.push(asset.name);
            if (policyStore.policyAction === actionType.ACTION_EDIT && asset.uuid === asset_uuid) {
                asset_name = asset.name;
            }
            return assetItem;
        })

        // 更新 assets 数据源
        this.setState({ assets });
        this.setState({ assetNames });
        this.setState({ asset_name });
    }

    /** 从后台请求所有设备数据 */
    getAllAssets = () => {
        // 从后台获取任务的详细信息，含任务表的数据和关联表的数据
        HttpRequest.asyncGet(this.getAllAssetsCB, '/assets/all');
    }

    requestPolicyCB = (action) => (data) => {
        let actionCB = this.props.actioncb;
        let successInfo;

        if (action === 'new') {
            successInfo = "策略创建成功";
        } else if (action === 'update') {
            successInfo = "策略更新成功";
        } else {
            successInfo = "操作成功";
        }

        if (data.code === errorCode.ERROR_OK) {
            message.info(successInfo);
            this.props.policyStore.setParam("uuid", data.payload.uuid);
            // 调用父组件传入的回调函数，第一个参数 true 表示本组件的参数设置已确认，且策略记录已在后台创建或更新
            actionCB(true, {});
        } else {
            message.error(eng2chn(data.error));
            // 后台创建策略记录失败，则用参数 false 通知父组件不更新页面
            actionCB(false, {});
        }
    }

    handleCancel = (e) => {
        let actionCB = this.props.actioncb;
        // 调用父组件传入的回调函数，第一个参数 false 表示本组件的参数设置被取消 cancel
        actionCB(false, {});
    }


    handleOk = (e) => {
        const { uuid, name, lv1_require, lv2_require, lv3_require, lv4_require } = this.props.policyStore.policyItem;
        const { run_mode, consume_time, run_contents, os_type, type } = this.props.policyStore.policyItem;
        const { asset_uuid, group_uuid } = this.props.policyStore.policyItem;
        const { userUuid } = this.props.userStore.loginUser;
        if (!this.checkData()) {
            return false;
        }
        if (this.props.policyStore.policyAction === actionType.ACTION_NEW) {
            // 向后台发送请求，创建一条新的策略记录
            HttpRequest.asyncPost(this.requestPolicyCB('new'), '/policies/add',
                {
                    name, code: "TODO", asset_uuid, group_uuid, create_user_uuid: userUuid, lv1_require, lv2_require, lv3_require, lv4_require, run_mode: 1, consume_time, run_contents, os_type, type: policyType.TYPE_SELF_DEFINITION,
                },
                false
            );
        } else if (this.props.policyStore.policyAction === actionType.ACTION_EDIT) {
            // 向后台发送请求，更新策略数据
            HttpRequest.asyncPost(this.requestPolicyCB('update'), '/policies/update',
                {
                    uuid, name, code: "TODO", asset_uuid, group_uuid, create_user_uuid: userUuid, lv1_require, lv2_require, lv3_require, lv4_require, run_mode: 1, consume_time, run_contents, os_type, type,
                },
                false
            );
        }
    }

    checkData() {
        let name = document.getElementById('name').value;
        let lv1_require = document.getElementById('lv1_require').value;
        let lv2_require = document.getElementById('lv2_require').value;
        let lv3_require = document.getElementById('lv3_require').value;
        let lv4_require = document.getElementById('lv4_require').value;
        let consume_time = document.getElementById('consume_time').value;
        let run_contents = document.getElementById('run_contents').value;
        
        if (name === null || name === '') {
            message.info('策略名称不能为空，请重新输入');
            document.getElementById('name').value = '';
            return false;
        } else if (name.length > 20) {
            message.info('策略名称长度不能超过20，请重新输入');
            document.getElementById('name').value = '';
            return false;
        } else if (groupChangedValue === null || groupChangedValue === '') {
            message.info('策略分组不能为空，请重新输入');
            return false;
        } else if (groupChangedValue.length > 20) {
            message.info('策略组长度不能超过20，请重新输入');
            return false;
        // } else if (assetChangedValue === null || assetChangedValue === '') {
        //     message.info('资产不能为空，请重新输入');
        //     return false;
        // } else if (assetChangedValue.length > 20) {
        //     message.info('资产长度不能超过20，请重新输入');
        //     return false;
        } else if ((lv1_require !== '' && lv1_require.length > 100)) {
            message.info('等保长度不能超过100，请重新输入');
            document.getElementById('lv1_require').value = '';
            return false;
        } else if ((lv2_require !== '' && lv2_require.length > 100)) {
            message.info('等保长度不能超过100，请重新输入');
            document.getElementById('lv2_require').value = '';
            return false;
        } else if ((lv3_require !== '' && lv3_require.length > 100)) {
            message.info('等保长度不能超过100，请重新输入');
            document.getElementById('lv3_require').value = '';
            return false;
        } else if ((lv4_require !== '' && lv4_require.length > 100)) {
            message.info('等保长度不能超过100，请重新输入');
            document.getElementById('lv4_require').value = '';
            return false;
        } else if (consume_time === '' || consume_time === 0) {
            message.info('运行时间不能0，请重新输入');
            document.getElementById('consume_time').value = '';
            return false;
        } else if ((consume_time !== '' && consume_time !== 0) && isNaN(consume_time) === true) {
            message.info('运行时间必须为数字，请重新输入');
            document.getElementById('consume_time').value = '';
            return false;
        } else if (run_contents === '' || run_contents === null) {
            message.info('运行内容不能空，请重新输入');
            document.getElementById('run_contents').value = '';
            return false;
        }
        return true;
    }

    handleParamsChange = name => (event) => {
        this.props.policyStore.setParam(name, event.target.value);
    };

    onSelectAsset = (value, option) => {
        const { assets } = this.state;
        for (let asset of assets) {
            if (asset.name === value) {
                this.props.policyStore.setParam("asset_uuid", asset.uuid);
                this.props.policyStore.setParam("os_type", asset.os_type);
                this.props.policyStore.setParam("asset_name", asset.name);
                break;
            }
        }
    }

    onSelectGroup = (value, option) => {
        const { groups } = this.state;
        for (let policyGroup of groups) {
            if (policyGroup.name === value) {
                this.props.policyStore.setParam("group_uuid", policyGroup.uuid);
                this.props.policyStore.setParam("group_name", policyGroup.name);
                break;
            }
        }
    }

    onGroupChanged = (value, option) => {
        groupChangedValue = value;
    }

    onAssetChanged = (value, option) => {
        assetChangedValue = value;
    }

    getOsTypeName = (type) => {
        if (parseInt(type) === osType.TYPE_WINDOWS) {
            return osTypeNames[0];
        } else if (parseInt(type) === osType.TYPE_LINUX) {
            return osTypeNames[1];
        }
    }

    render() {
        const { classes } = this.props;
        const policyStore = this.props.policyStore;
        const modalTitle = <Draggable title={policyStore.policyProcName} />;
        const { name, lv1_require, lv2_require, lv3_require, lv4_require } = this.props.policyStore.policyItem;
        const { run_mode, consume_time, run_contents, os_type, asset_name, group_name } = this.props.policyStore.policyItem;
        groupChangedValue = group_name;
        assetChangedValue = asset_name;
        const { assetNames } = this.state;
        const { groupNames } = this.state;
        const osType = this.getOsTypeName(os_type);
        const { fileList } = this.state;
        let self = this;

        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));

                let reader = new FileReader();
                reader.readAsText(file, "gbk");
                reader.onload = function (oFREvent) {
                    let pointsTxt = oFREvent.target.result;
                    self.props.policyStore.setParam("run_contents", pointsTxt);
                }

                return false;
            },
            fileList,
        };

        return (
            <Modal
                title={modalTitle}
                style={{ top: 20, minWidth: 800 }}
                maskClosable={false}
                destroyOnClose={true}
                visible={true}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <form className={classes.root} autoComplete="off">
                    <Row>
                        <Col span={11}>
                            <TextField required fullWidth id="name" label="策略名称" defaultValue={name}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("name")}
                            />
                        </Col>
                        <Col span={11} offset={2}>
                            <TextField disabled fullWidth id="os_type" label="操作系统" defaultValue=" " value={osType}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("os_type")}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <AutoComplete allowClear
                                required
                                id="policy_group"
                                className={classes.searchItemStyle}
                                dataSource={groupNames}
                                defaultValue={group_name}
                                onSelect={this.onSelectGroup}
                                onChange={this.onGroupChanged}
                                placeholder="输入分组"
                                filterOption={(inputValue, option) =>
                                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            />
                        </Col>
                        <Col span={11} offset={2}>
                            {/*<FormControl required variant="outlined" style={{ width: '100%' }}>
                                <OutlinedInput
                                    id="component-outlined">*/}
                                    <AutoComplete allowClear
                                        id="asset_name"
                                        className={classes.searchItemStyle}
                                        dataSource={assetNames}
                                        defaultValue={asset_name}
                                        onSelect={this.onSelectAsset}
                                        onChange={this.onAssetChanged}
                                        placeholder="输入设备"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                {/* </OutlinedInput>
                                <InputLabel htmlFor="outlined-group">输出格式</InputLabel>
                            </FormControl>*/}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <TextField required fullWidth autoFocus id="lv1_require" label="等保一级" defaultValue={lv1_require}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("lv1_require")}
                                rows={5} multiline={true}
                            />
                        </Col>
                        <Col span={11} offset={2}>
                            <TextField required fullWidth autoFocus id="lv2_require" label="等保二级" defaultValue={lv2_require}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("lv2_require")}
                                rows={5} multiline={true}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <TextField required fullWidth autoFocus id="lv3_require" label="等保三级" defaultValue={lv3_require}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("lv3_require")}
                                rows={5} multiline={true}
                            />
                        </Col>
                        <Col span={11} offset={2}>
                            <TextField required fullWidth autoFocus id="lv4_require" label="等保四级" defaultValue={lv4_require}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("lv4_require")}
                                rows={5} multiline={true}
                            />
                        </Col>
                    </Row>
                    {/* <TextField required fullWidth autoFocus id="solution" label="解决方案" defaultValue={solution}
                        variant="outlined" margin="normal" onChange={this.handleParamsChange("solution")}
                        rows={5} multiline={true}
                    /> */}
                    <Row>
                        <Col span={11}>
                            <Upload {...props} className={classes.searchItemStyle}>
                                <Button>
                                    <Icon type="upload" /> 运行文件选择
                        </Button>
                            </Upload>
                            {/* <TextField required fullWidth id="run_mode" label="运行模式" defaultValue={run_mode}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("run_mode")}
                            /> */}
                        </Col>
                        <Col span={11} offset={2}>
                            <TextField required fullWidth id="consume_time" label="运行时间" defaultValue={consume_time}
                                variant="outlined" margin="normal" onChange={this.handleParamsChange("consume_time")}
                            />
                        </Col>
                    </Row>
                    <TextField required fullWidth autoFocus id="run_contents" label="运行内容" defaultValue=" " value={run_contents}
                        variant="outlined" margin="normal" onChange={this.handleParamsChange("run_contents")}
                        rows={5} multiline={true}
                    />
                </form>
            </Modal>
        )
    }
}

PolicyParamsConfig.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(PolicyParamsConfig);
