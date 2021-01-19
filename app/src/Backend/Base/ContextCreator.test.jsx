import React from 'react';
import { render, createEvent, fireEvent, act, screen, within } from '@testing-library/react';

import { catchConsoleError } from '../../testHelpers';

import ContextCreator from './ContextCreator';

// Mocked backend handler, like in src/Backend/*/index.js
class BackendHandler {}

// Generate the components to be tested
const handlerName = "testDataHandler";
const {
  Provider,
  Consumer,
  withHandler,
} = ContextCreator(BackendHandler, handlerName);

test('ContextCreator generated context provider renders its childs', () => {
  const rendered = render(<Provider><span role="child"/></Provider>);
  const child = rendered.getByRole("child");
  expect(child).toBeInTheDocument();
});

const Child = (context) => <span role="child">{context?.toString()||'undefined'}</span>;
const ConsumerCreator = () => <Consumer>{ Child }</Consumer>;

test('ContextCreator generated context consumer (using useHandler) fails when rendered without a provider', async () => {
  const {output} = await catchConsoleError( async () => {
    expect( () => render(ConsumerCreator()) )
      .toThrowError();
  });
  expect(output[1].includes(`Handler must be used within a ${handlerName} Provider`)).toBe(true);
});

test('ContextCreator generated context consumer renders internal child and passes the context as argument', () => {
  const rendered = render(<Provider>{ConsumerCreator()}</Provider>);
  const child = rendered.getByRole("child");

  expect(child).toBeInTheDocument();
  expect(child).toHaveTextContent(/class BackendHandler/)
});

test('ContextCreator generated withHandler properly wraps a component passing the handler as a prop', () => {
  const WrappedChild = withHandler((props) => Child(props[handlerName]));
  const rendered = render(<Provider><WrappedChild/></Provider>);
  const child = rendered.getByRole("child");

  expect(child).toBeInTheDocument();
  expect(child).toHaveTextContent(/class BackendHandler/)
});
