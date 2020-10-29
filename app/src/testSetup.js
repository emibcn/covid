global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document
  },
  createContextualFragment: jest.fn
});
export default {};
