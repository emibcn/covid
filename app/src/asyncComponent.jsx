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

const asyncModuleComponent = (importModule, modules, Wrapped) =>
  (props) => {

    // Will save components into a state
    const [components, setComponents] = React.useState(false);

    // Call module import (async), wait for
    // results and set components state
    //
    // useEffect' Callback must not be async, so create an internal
    // anonymous and async function and call it immediatelly
    React.useEffect( () => {
      (async () => {
        // Import all components
        const comps = await importModule();
        // Create a new object only with the modules
        // defined in HOC argument `modules`
        const filtered = Object.fromEntries(
          Object.entries(comps)
            .filter( ([module]) => modules.includes(module))
        );
        setComponents(filtered);
        // No return, no unsubscribe
      })();
    // Only call it once
    }, []);

    // Once loaded, pass components to wrapped as a prop
    return !components
      ? <Loading />
      : <Wrapped {...props} {...{components}} />
  };

export default asyncComponent;
export { asyncModuleComponent };
