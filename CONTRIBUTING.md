# Contribution Guidelines

**emibcn/covid** is powered by the community, so feel free to contribute in any way you can to help us!

## How you can help
- Open issues for things you want to see added, modified, discuss ideas or help out with existing issues.
- Issues related to community organization, coding guidelines, best practices, tooling, etc. are also welcome.
- Security issues are impossible by design AFAIK, but if you find one, follow the [security guidelines](https://github.com/emibcn/covid/blob/master/SECURITY.md).
- If you submit an issue of a bug, add a screenshot (or more) to the issue: it's almost sure it will be helpful.
- Apply for an open issue if you think you can solve it by commenting on it, even if only partially.
- Submit pull requests with your code ([see guidelines below](#coding-guidelines)) or other updates (tags, descriptions, explanations, typos, examples, documentation, etc).

## Ground rules
Breaking any of the rules will result in your issue or pull request being closed.
Please follow the [**Code of Conduct** guidelines](https://github.com/emibcn/covid/blob/master/CODE_OF_CONDUCT.md) above all else.

## Development environment
Before you begin contributing, you should fork and download the repo, and then install the dependencies described in `app/package.json`:

- Fork this repository to your account.
- Clone your copy to your local machine:
```sh
git clone git@github.com:[YOUR USER HERE]/covid.git
```
- Install the dependencies:
```sh
cd covid/app
yarn install
```
- Start the development server:
```sh
yarn start
```
- Visit http://localhost:3000
- More details in the [Create React App](https://github.com/emibcn/covid/blob/master/app/) folder.

## Coding guidelines
- Update your forked repository with the issue/PR related code changes.
- Avoid space and indent changes in the code you are not changing. If you think you can fix indentation, do a dedicated PR for that (unless it only relates the code you are writing/changing). This makes PR review easier.
- The indentation for this project is the JavaScript standard: 2 spaces (automatic linting rule check is a Work In Progress).
- If you need to add any JavaScript dependency to `package.json`, use `yarn` (default for Create React App) instead of `npm`. Using more than one package manager in the same project is a bad idea. Remember to commit `yarn.lock`, too.
- Try to maintain logical concepts and components in separated files, easing its maintanability and reusability.
- If a file gets too big (1-2 pages), try to separate logic into different functions/classes/components ([composition](https://reactjs.org/docs/components-and-props.html#extracting-components), [HOC](https://reactjs.org/docs/higher-order-components.html), externalize non-React code, ...). There are already some files too big. They are in the TODO list.
- When styling (CSS, style attribute, SASS, SCSS), try to use [MaterialUI Styles](https://material-ui.com/styles/basics/).
- When creating new components (especially, interactive ones), look into [MaterialUI Components](https://material-ui.com/components/box/). If you find one that can do what you need, it will already be integrated with the rest of the app (like light/dark theme), easier to develop and easier to maintain.
- Add or adapt the tests to reflex what you have done, or open a new issue asking for help on that. Currently, tests are a Work In Progress, but highly desired. Looks boring, but tests rules :+1: !
- Run the tests before commiting changes.
- When adding a new dependency, consider [importing it dynamically](#dynamic-imports) to keep bundle sizes controlled.

## Applications details
This is a PWA application using [React](https://reactjs.org/) and created with [Create React App](https://create-react-app.dev/) (CRA).

### PWA
PWA means Progressive Web Application, which is a standard for a specific kind of web applications.

#### Service worker
One of the most important things about PWAs is that the first time a user downloads the web app, it installs a service worker which controls when the app files (the non data assets, like JS, CSS and SVG ones) need to be updated: it will periodically (some days in betwwen retries) check if the Manifest have been updated. If an update is needed, it downloads all the assets, bu instead to automatically executing them, informs the user about the update and shows a button to perform the update.

#### Installability
When a modern browser detects that this app complies with PWA standards, the user receives a notification, asking to install the webapp into the device as a new app (PC, mobile, etc). This allows fast access to it (no need to look into browser tabs and other facilities) and the service worker checking for updates from time to time.

### Lighthouse
Use your Chrome/Chromium Lighthouse tool to verify everything is working acceptably fine. If your changes are only visible using some URL parameters, use them. Maybe some day we can add all it to the CI.

### Performance
- Use the performance testing tools of yuor browser to reduce memory leaks, UI blocks, CPU and memory hogging, etc.
- Use `React.memo` and `React.memoize` wisely: add explicit dependencies and reduce them to the minimum ones.
- Consider executing some heavy CPU code asynchronously.
- Wrap heavy DOM modifications into a [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), as in the [example](https://github.com/emibcn/covid/blob/master/app/src/Widget/Widgets/Map/MapImage.jsx#L100).

### Dynamic imports
To control bundle sizes, some imports are done dynamically. This way, Wepack (as configured by CRA) will add that library into an extra bundle, which will only be loaded once this comoponent is first rendered (and shows a `<Loading/>` while getting and parsing the JS).

You can take a look into an analyzing tool [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) with:
```shell
yarn analyze
```

Then, open your browser at [http://localhost:3001](http://localhost:3001).

For dynamic imports of React components, you can use the [dynamic imports helpers](https://github.com/emibcn/covid/blob/master/app/src/asyncComponent.jsx) in this project:
- If you just need one component from that module (usually and by default, the `default` one). For [example](https://github.com/emibcn/covid/blob/master/app/src/Widget/Widgets/Chart/Chart.jsx):
```javascript
import asyncComponent from '../../../asyncComponent';
const ReferenceLine = asyncComponent(() => import('recharts'), 'ReferenceLine');

// ...

<ReferenceLine
  key={key}
  y={y}
  stroke={color}
  strokeDasharray="3 3"
  ifOverflow="extendDomain" />

// ...
```javascript
```

- If you need several imports from the same module. For [example](https://github.com/emibcn/covid/blob/master/app/src/Widget/Widgets/Common/Chart.jsx):
```javascript
import {asyncModuleComponent} from '../../../asyncComponent';

// ...

  const {
    ResponsiveContainer,
    ComposedChart,
    ReferenceLine,
    XAxis,
    YAxis,
  } = props.components;

  return (
    <div style={{position: "relative"}}>

      {/* Draw a dedicated graph for the reference line, which changes with the selected day */}
      <div style={{ position: "absolute", width: '100%' }}>
        <ResponsiveContainer width='100%' height={250}>
          <ComposedChart data={data} margin={{ right: 10, left: 0 }}>

// ...

export default asyncModuleComponent(
  () => import('recharts'),
  [
    'ResponsiveContainer',
    'ComposedChart',
    'Line',
    'Area',
    'ReferenceLine',
    'CartesianGrid',
    'XAxis',
    'YAxis',
    'Tooltip',
    'Brush',
  ],
  Chart,
);
```

### Backends
This app is serverless. This means that the backends are accessed daily to generate static JSON assets, which are the ones that feed the app data. The design used is based on subscritions: instead of "downloading" a URL, you pass a callback that will be executed each time a download for this URL is done, independently if it is the first or an update. Even more, each file is downloaded only once: the parsed JSON (as JS object) is cached and returned to lately added subscribers.

Even more, several helpers have been done to reduce plugin logic, easing its creation and maintanability.

#### `Backends/Provider`
Component providing all backends handler constructors via context.

#### `Backends/IndexesHandler`
Fetches the `index` of all backends and shows a `<Loading/>` until all of them are fetched and parsed. Also handles their updates based on clever rules.

#### `Backends/*/withIndex`
HOC to add an `index` prop to the wrapped component, showing a `<Loading/>` while it's beeing loaded.

#### `Backends/*/withData`
HOC to add a `data` prop to the wrapped component, showing a `<Loading/>` while it's beeing loaded. The received props are used to determine what data needs to be downloaded. Each backend uses different props.
