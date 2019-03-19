import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, Avatar, Row, Col, Divider } from 'antd'

import SystemImage from '../../resources/image/shield-ok-icon.png'
import { GetSystemInfo } from '../../modules/data/system'

const { Meta } = Card;

const styles = theme => ({
    gridStyle: {
        width: '25%',
        textAlign: 'center',
    },
});
const gridStyle = {
    width: '90%',
    textAlign: 'center',
    marginLeft: '5%',
    marginBottom: 8
};

class AboutView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const { classes } = this.props;
        const sysInfo = GetSystemInfo();
        return (
            <div>
                <Row type="flex" justify="space-between" align="center">
                    <Col span={8} offset={8}>
                        <Card
                            style={{margin: 8}}
                            cover={<span style={{ textAlign: 'center' }}><img alt="systemicon" style={{ width: '40%', height: '40%' }} src={SystemImage} /></span>}
                        >
                            {/* <Meta
                                title={ sysInfo.sysName }
                                description={ sysInfo.desc }
                            /> */}
                            <Card.Grid style={gridStyle}>
                            <span style={{ color: 'blue', fontSize: '24px' }}>{sysInfo.sysName} <br /></span>
                            <span style={{ textAlign: 'left' }}>{sysInfo.desc} <br /></span>
                            <Divider dashed />
                            {"系统版本: " + sysInfo.sysVer} <br />
                            {"版权：" + sysInfo.copyright}
                            </Card.Grid>
                            <Card.Grid style={gridStyle}>{"系统状态: " + sysInfo.status}</Card.Grid>
                            <Card.Grid style={gridStyle}>{"系统概况: " + sysInfo.overview}</Card.Grid>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

AboutView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(AboutView);