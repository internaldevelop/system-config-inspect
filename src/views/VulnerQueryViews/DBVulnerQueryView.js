import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Skeleton, Row, Col, Select } from 'antd'
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react'
import VulnerQueryTable from './VulnerQueryTable'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

const Option = Select.Option;

@observer
@inject('userStore')
class DBVulnerQueryView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selVal: 'oracle',
        }
    }

    handleChange = (value) => {
        const { selVal } = this.state;
        this.setState({
            selVal: value,
        });
        console.log(selVal);
    }

    render() {
        const userStore = this.props.userStore;

        return (
            <div>
                <Skeleton loading={userStore.isAdminUser} active avatar>
                    <Row>
                        <Col span={24}>
                            <Select value={this.state.selVal} style={{ width: 300 }} onChange={this.handleChange}>
                                <Option value='oracle'>Oracle数据库漏洞利用方法</Option>
                                <Option value='mysql'>Mysql数据库漏洞利用方法</Option>
                                <Option value='sql server'>Sql Server数据库漏洞利用方法</Option>
                            </Select>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={24}>
                            <VulnerQueryTable field='db' value={this.state.selVal} />
                        </Col>
                    </Row>
                </Skeleton>
            </div>
        );

    }
}

DBVulnerQueryView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(DBVulnerQueryView);