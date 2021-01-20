import React, { Component } from 'react';

import Loading from './Loading';

const asyncComponent = (importComponent, module="default") => {
  class AsyncComponent extends Component {
    /**
    * @constructor
    * @desc Represents AsyncComponent component
    * @param props Properties passed from parent component
    */
    constructor(props) {
      super(props);

      this.state = {
        component: null
      };
    }

    // Returns the needed component markup
    // Can be a single child component or null or false
    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : <Loading/>;
    }

    // Called after render method
    // Enables DOM manipulations or data fetching operations
    // DOM interactions should always happen here
    async componentDidMount() {
      const imported = await importComponent();
      const component = imported[module];

      this.setState({ component });
    }
  }

  return AsyncComponent;
}

const asyncModuleComponent = (importModule, modules, Wrapped) => {
  const AsyncMultiComponent = (props) => {
    const [components, setComponents] = React.useState(false);
    React.useEffect( () => {
      const getModule = async () => {
        const comps = await importModule();
        const filtered = Object.fromEntries(
          Object.entries(comps)
            .filter( ([module]) => modules.includes(module))
        );
        setComponents(filtered);
      };

      getModule();
    }, [modules]);
    return !components
      ? <Loading />
      : <Wrapped {...props} {...{components}} />
  }

  return AsyncMultiComponent;
}

export default asyncComponent;
export { asyncModuleComponent };
