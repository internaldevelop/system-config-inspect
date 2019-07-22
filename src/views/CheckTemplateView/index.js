import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react'
import { Card, Skeleton, Select, Tag, Col, Collapse, Row } from 'antd';
import HttpRequest from '../../utils/HttpRequest';
const Panel = Collapse.Panel;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

@observer
@inject('userStore')
class CheckTemplateView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templateList: [],
        };
        this.getAllTemplaes();
    }

    getAllTemplatesCB = (data) => {
        this.setState({ templateList: data.payload });
    }

    /** 从后台请求安全配置模板 */
    getAllTemplaes = () => {
        HttpRequest.asyncGet(this.getAllTemplatesCB, '/baseline-check/query-baselines');
    }

    renderTemplateInfo = (index) => {
        for (let item of this.state.templateList) {
            if (index === item.level) {
                let jsonTemplate = JSON.parse(item.templates);
                let dataArray = [];
                for (let key in jsonTemplate) {
                    let values;
                    if (jsonTemplate.hasOwnProperty(key)
                        && ((values = jsonTemplate[key]) !== null)) {
                        dataArray.push({ key, values });
                    }
                }
                if (dataArray.length > 0) {
                    return (
                        <Collapse accordion defaultActiveKey={dataArray[0].key}>
                            {dataArray.map((item) => this.panelInfo(item.key, item.values))}
                        </Collapse>
                    );
                }
                break;
            }
        }
    }

    panelInfo = (key, values) => {
        let templateArray = [];
        for (let templateKey in values) {
            let value;
            if (values.hasOwnProperty(templateKey)
                && ((value = values[templateKey]) !== null)) {
                templateArray.push({ templateKey, value });
            }
        }
        if (templateArray.length > 0) {
            return (
                <Panel header={key} key={key}>
                    {templateArray.map((template) => this.tagInfo(template.templateKey, template.value))}
                </Panel>
            );
        }
    }

    tagInfo = (tag, info) => {
        return (<p><Tag color="cyan">{tag}</Tag>{info}</p>);
    }

    render() {
        const userStore = this.props.userStore;
        return (
            <div>
                <Skeleton loading={userStore.isAdminUser} active avatar>
                    <Card title="核查模板" bodyStyle={{ minWidth: '800px', minHeight: '400px' }}>
                        <Row gutter={8}>
                            <Col span={8}>
                                <Card type="inner" title={"安全配置一级模板"}>
                                    {this.renderTemplateInfo(1)}
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card type="inner" title={"安全配置二级模板"}>
                                    {this.renderTemplateInfo(2)}
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card type="inner" title={"安全配置三级模板"}>
                                    {this.renderTemplateInfo(3)}
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Skeleton>
            </div>
        );
    }
}

CheckTemplateView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(CheckTemplateView);
