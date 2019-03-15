import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';

import { List, Avatar, Row, Col, message, Button, Icon } from 'antd';

import { AccountData, AccountListData } from './AccountData'
import AccountCard from './AccountCard'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
    selectedItem: {
        // backgroundColor: blue[100],
        backgroundColor: "white",
    },
    unselectedItem: {
        // backgroundColor: 'rgba(178,178,178,0.5)',
    }
});

class AccountManageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAccID: 0,
        }
    }

    onClick = (event, index) => {
        // message.info(`选中用户（ID为${index}）`);
        this.setState({
            selectedAccID: index,
        });
    }

    accountListBox() {
        const { classes } = this.props;
        const { selectedAccID } = this.state;
        return (
            <List
                itemLayout="vertical"
                size="large"
                bordered
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={AccountListData()}
                renderItem={item => (
                    <List.Item
                        className={ (item.index === selectedAccID) ? classes.selectedItem : classes.unselectedItem}
                        key={item.title}
                        // actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
                        // extra={<Button onClick={event => this.onClick(event, item.index)}>详情<Icon type="right" /></Button>}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={item.title}
                            description={item.description}
                        />
                        <Row>
                            <Col span={16}>{item.content}</Col>
                            <Col span={4} offset={4}>
                                <Button onClick={event => this.onClick(event, item.index)}>详情<Icon type="right" /></Button>
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
        );
    }

    getSelectedAccount() {
        let id = this.state.selectedAccID;
        return AccountData()[id];
    }

    render() {
        let selected = this.getSelectedAccount();
        return (
            <div>
                <Row>
                    <Col span={8}>
                        { this.accountListBox() }
                    </Col>
                    <Col span={16}>
                        <AccountCard accindex={selected.index}/>
                    </Col>
                </Row>
            </div>
        );
    }
}


AccountManageView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(AccountManageView);