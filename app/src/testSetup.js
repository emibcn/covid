import matchMediaPolyfill from 'mq-polyfill'

// Allow testing components with React.createPortal
jest.mock("react-dom", () => {
  const original = jest.requireActual("react-dom");
  return {
    ...original,
    createPortal: node => node,
  };
});

beforeAll(() => {
  // https://github.com/enzymejs/enzyme/issues/1626#issuecomment-398588616
  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document
    },
    createContextualFragment: jest.fn
  });

  // Allow testing MediaQuery:
  // https://github.com/testing-library/react-testing-library/issues/353#issuecomment-510074776
  matchMediaPolyfill(window)
  window.resizeTo = function resizeTo(width, height) {
    Object.assign(this, {
      innerWidth: width,
      innerHeight: height,
      outerWidth: width,
      outerHeight: height,
    }).dispatchEvent(new this.Event('resize'))
  }
})
