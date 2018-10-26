# my-frontend-boilerplate

[![travis build](https://img.shields.io/travis/dwiyatci/web-frontend-boilerplate.svg)](https://travis-ci.org/dwiyatci/web-frontend-boilerplate)
[![version](https://img.shields.io/npm/v/web-frontend-boilerplate.svg)](https://www.npmjs.com/package/web-frontend-boilerplate)
[![downloads](https://img.shields.io/npm/dt/web-frontend-boilerplate.svg)](http://npm-stat.com/charts.html?package=web-frontend-boilerplate)
[![WTFPL License](https://img.shields.io/badge/license-WTFPL-red.svg)](https://raw.githubusercontent.com/dwiyatci/web-frontend-boilerplate/master/LICENSE.txt)

My interpretation of how a boilerplate with a minimum set of tools 
should look like for my frontend application development. :bowtie::pray:

![Screenshot](screenshot.png)

### Why?
Because I start to keep repeating over and over again scaffolding my 
project structure, especially when constructing my favorite 
`webpack.config.js` and `package.json` files.

Note that the webpack configuration should be easily extensible to pack 
popular modern JS frameworks. It might as 
well be flexible to switch from the [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 
to more customized Node.js [Express](https://webpack.js.org/guides/development/#webpack-dev-server) server, 
which uses the [webpack-dev-middleware](https://webpack.js.org/guides/development/#webpack-dev-middleware).

Molly's automation principle:
> Do it once, just do it. Do it twice, take notes. Do it three times, automate. :raising_hand:

## What's on the Stack
* JavaScript ES6+ (Babel).
* Bootstrap 4 (and Font Awesome).
* lodash.
* jQuery.
* webpack 4 (and its development server).

## Installation
* Install Node.js LTS and npm from its [website](https://nodejs.org), or better even, use [nvm](https://github.com/creationix/nvm).

* Install [yarn](https://yarnpkg.com/en/docs/install).

* Checkout the repo, `cd` to project directory, and setup dependencies:
```bash
$ yarn install:clean
```

* For development, start webpack development server with hot reloading capability:
```bash
$ yarn start
```
You'll find the app running on https://localhost:8080.

* For production, build frontend static assets:
```bash
$ yarn build
```
Then, simply drop all files under `assets` directory to the production server.

## Author
Glenn Dwiyatcita ([@dwiyatci](http://tiny.cc/dwiyatci))

## License
WTFPL – Do What the Fuck You Want to Public License.

See [LICENSE.txt](LICENSE.txt). 

![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-1.png)
