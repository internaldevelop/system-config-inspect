import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react'
import Draggable from '../../components/window/Draggable'
import { Modal, Input, Row, Col, message, Icon, Button, Typography } from 'antd';
import TextField from '@material-ui/core/TextField';
import { isContainSpecialCharacter } from '../../utils/ObjUtils'

import HttpRequest from '../../utils/HttpRequest'
import { actionType } from '../../global/enumeration/ActionType';
import { errorCode } from '../../global/error';
import { eng2chn } from '../../utils/StringUtils'

const { Text } = Typography;
const { TextArea } = Input;

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

@inject('vulnerMethodStore')
@inject('userStore')
@observer
class VulnerMethodParamsConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleCancel = (e) => {
        let actionCB = this.props.actioncb;
        // 调用父组件传入的回调函数，第一个参数 false 表示本组件的参数设置被取消 cancel
        actionCB(false, {});
    }

    requestVulnerCB = (action) => (data) => {
        let actionCB = this.props.actioncb;
        let successInfo;

        if (action === 'new') {
            successInfo = "POC创建成功";
        } else if (action === 'update') {
            successInfo = "POC成功";
        } else {
            successInfo = "操作成功";
        }

        if (data.code === errorCode.ERROR_OK) {
            message.info(successInfo);
            //this.props.vulnerMethodStore.setParam("edb_id", data.payload.edb_id);
            // 调用父组件传入的回调函数，第一个参数 true 表示本组件的参数设置已确认，且记录已在后台创建或更新
            actionCB(true, {});
        } else {
            message.error(eng2chn(data.error));
            //TODO, 测试中为了增加错误日志功能
            let title = '新建POC';
            let content = '新建POC失败，' + eng2chn(data.error);
            if (this.props.vulnerStore.vulnerAction === actionType.ACTION_EDIT) {
                title = '更新POC';
                content = '更新POC失败，' + eng2chn(data.error);
            }
            HttpRequest.asyncPost(this.addSystemLogsCB, '/system-logs/add', {
                title, content, type: 3,//SYS_ERROR = 3
            },
                false);
            // 后台创建记录失败，则用参数 false 通知父组件不更新页面
            actionCB(false, {});
        }
    }

    handleOk = (e) => {
        const { edb_id, customized } = this.props.vulnerMethodStore.vulnerMethodItem;
        const { aliases, content_type, content } = this.props.vulnerMethodStore.vulnerMethodItem.poc;
        const { userUuid } = this.props.userStore.loginUser;
        if (!this.checkData()) {
            return false;
        }
        if (this.props.vulnerMethodStore.vulnerMethodAction === actionType.ACTION_NEW) {
            HttpRequest.asyncPost2(this.requestVulnerCB('new'), '/edb/poc/add',
                {
                    edb_id, content, alias: aliases,
                },
                false
            );
        } else if (this.props.vulnerMethodStore.vulnerMethodAction === actionType.ACTION_EDIT) {
            HttpRequest.asyncPost2(this.requestVulnerCB('update'), '/edb/poc/update',
                {
                    edb_id, content, alias: aliases,
                },
                false
            );
        }
    }

    checkData() {
        let fileName = document.getElementById('fileName').value;
        //let fileType = document.getElementById('fileType').value;
        let content = document.getElementById('content').value;

        if (fileName === null || fileName === '') {
            message.info('文件名称不能为空，请重新输入');
            document.getElementById('fileName').value = '';
            return false;
        } else if (fileName.length > 20) {
            message.info('文件名称长度不能超过20，请重新输入');
            document.getElementById('fileName').value = '';
            return false;
            // } else if (isContainSpecialCharacter(fileName)) {
            //     message.info('文件名称含有特殊字符，请重新输入');
            //     document.getElementById('fileName').value = '';
            //     return false;
            // } else if (fileType === null || fileType === ' ' || fileType === '') {
            //     message.info('文件类型不能为空，请重新输入');
            //     document.getElementById('fileType').value = '';
            //     return false;
            // } else if (fileType.length > 20) {
            //     message.info('文件类型长度不能超过20，请重新输入');
            //     document.getElementById('fileType').value = '';
            //     return false;
            // } else if (isContainSpecialCharacter(fileType)) {
            //     message.info('文件类型含有特殊字符，请重新输入');
            //     document.getElementById('fileType').value = '';
            //     return false;
        } else if (content === null || content === '' || content === ' ') {
            message.info('内容不能为空，请重新输入');
            document.getElementById('content').value = '';
            return false;
        }
        return true;
    }

    handleFileNameChange = (event) => {
        this.props.vulnerMethodStore.setPOCParam("aliases", event.target.value);
    }

    handleFileTypeChange = (event) => {
        this.props.vulnerMethodStore.setPOCParam("content_type", event.target.value);
    }

    handleContentChange = (event) => {
        this.props.vulnerMethodStore.setPOCParam("content", event.target.value);
    }

    render() {
        const { edb_id, poc, } = this.props.vulnerMethodStore.vulnerMethodItem;
        const modalTitle = <Draggable title={this.props.vulnerMethodStore.vulnerMethodProcName} />;
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
                <form>
                    <Row>
                        <TextField required fullWidth id="fileName" label="文件名" defaultValue={poc.aliases}
                            variant="outlined" margin="normal" onChange={this.handleFileNameChange}
                        />
                        {/* <Col span={11}>
                            <TextField required fullWidth id="fileName" label="文件名" defaultValue={poc.aliases}
                                variant="outlined" margin="normal" onChange={this.handleFileNameChange}
                            />
                        </Col> */}
                        {/* <Col span={11} offset={2}>
                            <TextField required fullWidth id="fileType" label="文件类型" defaultValue={poc.content_type}
                                variant="outlined" margin="normal" onChange={this.handleFileTypeChange}
                            />
                        </Col> */}
                    </Row>
                    <Row>
                        <TextArea required rows={10} fullWidth id="content" placeholder="文件内容*" defaultValue={poc.content}
                            variant="outlined" margin="normal" onChange={this.handleContentChange}
                        />
                    </Row>
                </form>
            </Modal>
        );
    }
}

VulnerMethodParamsConfig.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(VulnerMethodParamsConfig);
