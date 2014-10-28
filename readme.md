# DuckDuckTest

DuckDuckGo Spice Instant Answer Regression Tester

## Getting started

Install and run ChromeDriver:

https://code.google.com/p/selenium/wiki/ChromeDriver

```
$ ./chromedriver --verbose --url-base=/wd/hub
$ brew install imagemagick
$ npm install wd
```

Then run:
```
$ node main.js
```

## Imagemagick
http://www.imagemagick.org/Usage/compare/
```
$ compare -metric rmse form-1.png form-2.png output.png
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




