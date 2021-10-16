import React from "react";
import {
  render,
  createEvent,
  fireEvent,
  act,
  screen,
  within,
} from "@testing-library/react";

import { delay } from "../../testHelpers";
import withHandlerGenerator from "./withHandlerGenerator";

// Mock the <Loading/> component
jest.mock("../../Loading", () => {
  return {
    __esModule: true,
    default: (props) => <div role="loading">Loading</div>,
  };
});

// Mocked backend handler, like in src/Backend/*/index.js
class BackendHandler {
  constructor(testParam) {
    this.testParam = testParam;
  }

  index = jest.fn((callback) => {
    const { testParam } = this;
    const timer = setTimeout(callback({ role: "tested", testParam }), 20);
    return () => clearTimeout(timer);
  });
}

// Mocked backend handler HOC
const withBackendHandlerHOC = (Wrapped) => (props) =>
  (
    <div role="wrapper">
      <Wrapped {...{ ...props, BackendHandler }} />
    </div>
  );

test("withHandlerGenerator correctly generates a HOC to create a Wrapped component with data as a prop", async () => {
  // Generate a testing HOC
  const withIndex = (WrappedComponent, name = "index") =>
    withHandlerGenerator(
      withBackendHandlerHOC,
      ({ testParam }) => ({ testParam }),
      ({ testParam }, Handler, setIndex) => {
        const handler = new Handler(testParam);
        return handler.index(setIndex);
      },
      name,
      WrappedComponent
    );

  // Use the generated testing HOC to pass `index` as a prop
  const TestComponent = withIndex(
    ({ index: index_, role, testParam, ...props }) => {
      const { testParam: testParamIndex, ...index } = index_;
      return (
        <span role={role}>
          <span data-testid="index" {...index} />
          <span data-testid="testParam" value={testParam} />
          <span data-testid="testParamIndex" value={testParamIndex} />
        </span>
      );
    }
  );

  let rendered;

  await act(async () => {
    const paramValue = "test-value";
    rendered = render(
      <TestComponent role="test-component" testParam={paramValue} />
    );

    // Initial <Loading/> state
    const wrapperInitial = rendered.getByRole("wrapper");
    expect(wrapperInitial).toBeInTheDocument();

    const loading = within(wrapperInitial).getByRole("loading");
    expect(loading).toBeInTheDocument();

    await delay(20);

    // Final state, with `index` as a prop in the wrapped component
    const wrapper = rendered.getByRole("wrapper");
    expect(wrapper).toBeInTheDocument();

    const wrapped = within(wrapper).getByRole("test-component");
    expect(wrapped).toBeInTheDocument();

    const index = within(wrapped).getByRole("tested");
    expect(index).toBeInTheDocument();
    expect(index.getAttribute("data-testid")).toBe("index");

    const testParam = within(wrapped).getByTestId("testParam");
    expect(testParam).toBeInTheDocument();

    const testParamIndex = within(wrapped).getByTestId("testParamIndex");
    expect(testParamIndex).toBeInTheDocument();

    expect(testParamIndex.getAttribute("value")).toBe(paramValue);
    expect(testParamIndex.getAttribute("value")).toBe(
      testParam.getAttribute("value")
    );
  });

  await act(async () => {
    const paramValue = "test-value-2";
    rendered.rerender(
      <TestComponent role="test-component" testParam={paramValue} />
    );

    await delay(0);

    const testParam = rendered.getByTestId("testParam");
    expect(testParam).toBeInTheDocument();

    const testParamIndex = rendered.getByTestId("testParamIndex");
    expect(testParamIndex).toBeInTheDocument();

    expect(testParamIndex.getAttribute("value")).toBe(paramValue);
    expect(testParamIndex.getAttribute("value")).toBe(
      testParam.getAttribute("value")
    );
  });
});
