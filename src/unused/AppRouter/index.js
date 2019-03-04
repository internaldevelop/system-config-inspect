import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import RoutersMap from './RoutersMap'
import { connect } from 'react-redux'

class AppRouter extends Component {
    render() {
        // let token = this.props.token
        let token = true
        return (
            <Router>
                <div>
                    <Switch>
                        {RoutersMap.map((item, index) => {
                            return (
                                <Route key={index} path={item.path} exact render={props =>
                                    (!item.auth ? 
                                        (<item.component {...props} />) : 
                                        (token ? 
                                            <item.component {...props} /> :
                                            <Redirect to={{pathname: '/login', state: {from: props.location}
                                        }} />)
                                    )} />
                            )
                        })}
                    </Switch>
                </div>
            </Router>
        );
    }
}

// redux拿到token并挂载到App的props上面
const mapStateToProps = (state, ownProps) => {
    return { token: state.token }
}

export default connect(mapStateToProps)(AppRouter)