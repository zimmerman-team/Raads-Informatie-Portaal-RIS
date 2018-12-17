import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();
      this.setState({
        component,
      });
    }

    render() {
      const C = this.state.component;
      const loader = <div className="general-loader"><CircularProgress /></div>;
      return <div>{C ? <C {...this.props} /> : loader}</div>;
    }
  }

  return AsyncComponent;
}
