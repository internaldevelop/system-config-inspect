import React, { Component } from 'react';
import InspectResultTable1 from './InspectResultTable1'
import InspectResultTable from './InspectResultTable'
import RiskTypeBarChart from './echarts/RiskTypeBar'
// import ResultBarChart from './echarts/SimpleLineChart'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    root: {
        width: '90%',
    },

});

class InspectResult extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        // const { classes } = this.state;

        return (
            <div>
                <div>
                    <InspectResultTable />
                    <Divider />
                </div>
                <div>
                    <InspectResultTable1 />
                    <Divider />
                </div>
                <div>
                    <Divider />
                    <RiskTypeBarChart />
                </div>

            </div>
        );
    }

}


InspectResult.propTypes = {
    classes: PropTypes.object.isRequired,
};

InspectResult.contextTypes = {
    router: PropTypes.object.isRequired
};

export default withStyles(styles)(InspectResult);


