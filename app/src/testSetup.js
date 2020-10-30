import matchMediaPolyfill from 'mq-polyfill'

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

// Allow testing MediaQuery: https://github.com/testing-library/react-testing-library/issues/353#issuecomment-510074776
beforeAll(() => {
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
