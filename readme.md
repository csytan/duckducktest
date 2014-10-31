# DuckDuckTest

DuckDuckGo Spice Instant Answer Regression Tester

## Getting started

Install ChromeDriver:
https://code.google.com/p/selenium/wiki/ChromeDriver

Install Imagemagick:
OSX: `$ brew install imagemagick`
Ubuntu: `$ sudo apt-get install imagemagick`

Install Node modules:
TODO: add package.json
```
$ npm install wd
$ npm install request
$ npm install q
```

Run the tester:
```
$ ./chromedriver --verbose --url-base=/wd/hub
$ node main.js
```

## Features

- Checks for JS errors
- Checks for visual regressions
- Simple event testing


## Problems
- IAs that interact in strange ways
- Shared classes
- JSON rate-limits


## What can we test?
- Javascript exceptions
- JSON API
    - Online or offline?
    - Data structure changes
- Function output
- DOM changes or Visual changes (screenshots)
    - UI for test creation. Draw areas which **won't** change.
- Event handlers being triggered
- Touch events being triggered


## Questions
- How does this fit in with Travis?

## Useful Links
- https://github.com/admc/wd
- https://code.google.com/p/selenium/wiki/JsonWireProtocol
- http://www.imagemagick.org/Usage/compare/





