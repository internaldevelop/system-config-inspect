import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

import { Collapse, message } from 'antd';

import HttpRequest from '../../utils/HttpRequest';

const Panel = Collapse.Panel;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class CheckResultDetails extends React.Component {
    constructor(props) {
        super(props);

        let { scanuuid, group } = this.props;

        if (typeof (scanuuid) === undefined) scanuuid = '';
        if (typeof (group) === undefined) group = '';

        this.state = {
            checkResultList: [],
            scanUuid: scanuuid,
            group: group,
        };

        this.getCheckResult();
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    getCheckResultCB = (data) => {
        this.setState({ checkResultList: data.payload });
    }

    getCheckResult = () => {
        const { scanUuid, group } = this.state;
        return HttpRequest.asyncGet(this.getCheckResultCB,
            '/baseline-check/check-result',
            { scan_uuid: scanUuid, group: group });
    }

    render() {
        const { checkResultList } = this.state;
        return (
            <div>
                <Collapse accordion>
                    {checkResultList.map((checkResult, index) =>
                        <Panel header={checkResult.check_item} key={index.toString()}>
                            <p>{"配置信息：" + checkResult.config_info}</p>
                            <p>{"风险等级：" + checkResult.risk_level + " 级"}</p>
                            <p>{"风险描述：" + checkResult.risk_desc}</p>
                            <p>{"解决方案：" + checkResult.solution}</p>
                        </Panel>
                    )}
                </Collapse>
            </div>
        );
    }
}

CheckResultDetails.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(CheckResultDetails);

