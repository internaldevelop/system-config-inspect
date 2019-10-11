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
class OsSystemVulnerQueryView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selVal: 'windows',
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
                                <Option value='windows'>Windows操作系统漏洞利用方法</Option>
                                <Option value='linux'>Linux操作系统漏洞利用方法</Option>
                            </Select>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={24}>
                            <VulnerQueryTable field='os' value={this.state.selVal} />
                        </Col>
                    </Row>
                </Skeleton>
            </div>
        );

    }
}

OsSystemVulnerQueryView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(OsSystemVulnerQueryView);