import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Collapse, message } from 'antd';

import HttpRequest from '../../utils/HttpRequest';

const Panel = Collapse.Panel;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

class ExecResultsListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            riskInfoList: []
        }

        this.getTaskExecRiskInfo(this.props.execuuid, this.props.risklevel);
    }

    getTaskExecRiskInfoCB = (data) => {
        this.setState({ riskInfoList: data.payload });
    }

    getTaskExecRiskInfo = (execUuid, riskLevel) => {
        return HttpRequest.asyncGet(this.getTaskExecRiskInfoCB,
            '/tasks/results/risks',
            { exec_action_uuid: execUuid, risk_level: riskLevel });
    }


    render() {
        const { riskInfoList } = this.state;
        return (
            <div>
                <Collapse accordion>
                    {riskInfoList.map((riskItem, index) =>
                        <Panel header={riskItem.policy_group_name + ': ' + riskItem.policy_name} key={index.toString()}>
                            <p>{"风险等级：" + riskItem.risk_level + " 级"}</p>
                            <p>{"风险描述：" + riskItem.risk_desc}</p>
                            <p>{"解决方案：" + riskItem.solutions}</p>
                        </Panel>
                    )}
                </Collapse>
            </div>
        );
    }
};

ExecResultsListView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(ExecResultsListView);
