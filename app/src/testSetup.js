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
