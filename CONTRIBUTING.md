# Contribution Guidelines

**emibcn/covid** is powered by the community, so feel free to contribute in any way you can to help us!

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

## Coding and Pull Request (PR) guidelines
- Update your repository with the issue/PR related code changes.
- Avoid space and indent changes in the code you are not changing. If you think you can fix indentation, do a dedicated PR for that. This makes PR review easier.
- The indentation for this project is the JavaScript standard: 2 spaces.
- If you need to add any JavaScript dependency to `package.json`, use `yarn` (default for Create React App) instead of `npm`. Using more than one package manager in the same project is a bad idea. Remember to commit `yarn.lock`, too.
- Try to maintain logical concepts in separated files, easing its maintanability and reusability.
- If a file gets too big (1-2 pages), try to separate logic into different components ([composition](https://reactjs.org/docs/components-and-props.html#extracting-components), [HOC](https://reactjs.org/docs/higher-order-components.html), externalize non-React code, ...). There are already some files too big. They are in the TODO list.
- When styling (CSS, style attribute, SASS, SCSS), try to use [MaterialUI Styles](https://material-ui.com/styles/basics/).
- When creating new components (especially, interactive ones), look into [MaterialUI Components](https://material-ui.com/components/box/). If you find one that can do what you need, it will already be integrated with the rest of the app, easier to develop and easier to maintain.
- Add or adapt the tests to reflex what you have done, or open a new issue asking for help on that. Currently, tests are a Work In Progress, but highly desired. Looks boring, but tests rules :+1: !

## How you can help

- Submit pull requests with your code [see guidelines below](#pull-requestpr-guidelines) or other updates (tags, descriptions, explanations, typos, examples, code improvements).
- Open issues for things you want to see added, modified, discuss ideas or help out with existing issues.
- If you submit an issue of a bug, add a screenshot to it: it's almost sure it will be helpful.

## Ground rules

Breaking any of the rules will result in your pull request being closed. Please follow the [**Code of Conduct** guidelines](https://github.com/emibcn/covid/blob/master/CODE_OF_CONDUCT.md) above all else.

