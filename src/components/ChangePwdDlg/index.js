import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { Modal, Form, Input } from 'antd'

import Draggable from '../window/Draggable'

const FormItem = Form.Item;

const styles = theme => ({
    gridStyle: {
        width: '25%',
        textAlign: 'center',
    },
});

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

@Form.create()
class ChangePwdDlg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPwd: '',
            newPwd: '',
            newPwd2: '',
            onClose: this.props.onclose,
        };
    }

    handleOk = (e) => {
        let validate = false;
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', err, values);
            if (err === null) {
                validate = true;
            } 
        });
        if (!validate) {
            return;
        }
        // TODO: 调用后端保存密码接口
        this.state.onClose();
    }

    handleCancel = (e) => {
        this.state.onClose();
    }

    handleOldPwdChange = (event) => {
        this.setState({ oldPwd: event.target.value });
    };

    handleNewPwdChange = (event) => {
        this.setState({ newPwd: event.target.value });
    };

    handleNewPwd2Change = (event) => {
        this.setState({ newPwd2: event.target.value });
    };

    getPasswordRules() {
        return ([{
            required: true,
            message: '请输入原密码'
        }, {
            min: 8,
            message: '密码不能少于8个字符',
        }, {
            max: 16,
            message: '密码不能多于16个字符',
        }]);
    }

    passwordValidator = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('newPwd')) {
            callback('两次输入不一致！')
        }

        // 必须总是返回一个 callback，否则 validateFields 无法响应
        callback();
    }

    render() {
        const modalTitle = <Draggable title="修改密码" />;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        return (
            <Modal
                title={modalTitle}
                visible={true}
                style={{ top: '20%' }}
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <div>
                    <Form layout='horizontal' style={{ width: '100%', margin: '0 auto' }}>
                        <FormItem label='原密码' {...formItemLayout}>
                            {
                                getFieldDecorator('oldPwd', {
                                    rules: this.getPasswordRules(),
                                })(
                                    <Input type="password" />
                                )
                            }
                        </FormItem>
                        <FormItem label='新密码' {...formItemLayout}>
                            {
                                getFieldDecorator('newPwd', {
                                    rules: this.getPasswordRules(),
                                })(
                                    <Input type="password" />
                                )
                            }
                        </FormItem>
                        <FormItem label='确认密码' {...formItemLayout}>
                            {
                                getFieldDecorator('newPwd2', {
                                    rules: [{
                                        required: true,
                                        message: '请再次输入新密码'
                                    }, {
                                        validator: this.passwordValidator
                                    }]
                                })(
                                    <Input type="password" />
                                )
                            }
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
}

ChangePwdDlg.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(ChangePwdDlg);