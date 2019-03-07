import React, { Component } from 'react';

import { observer, inject } from 'mobx-react'

@observer
@inject('userStore')
class App1 extends Component {
    constructor(props) {
      super(props);
      const userStore = this.props.userStore;
      // this.state = {
      // };
    }
  
    render() {
      return (
          <div>
          </div>
      );
  
    }
  }
  
  export default App1;
  