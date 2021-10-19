// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Locale polyfills: https://formatjs.io/docs/polyfills
import "@formatjs/intl-getcanonicallocales/polyfill";
import "@formatjs/intl-locale/polyfill";
import "@formatjs/intl-pluralrules/polyfill";
import "@formatjs/intl-pluralrules/locale-data/en"; // locale-data for en
import "@formatjs/intl-pluralrules/locale-data/es";

// Mock fetch for node
import fetch from "node-fetch"; // locale-data for es

// https://github.com/jsdom/jsdom/issues/653#issuecomment-606323844
window.HTMLElement.prototype.getBoundingClientRect = function () {
  return {
    width: parseFloat(this.style.width) || 0,
    height: parseFloat(this.style.height) || 0,
    top: parseFloat(this.style.marginTop) || 0,
    left: parseFloat(this.style.marginLeft) || 0,
  };
};
global.fetch = fetch;
