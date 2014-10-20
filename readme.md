# DuckDuckTest

DuckDuckGo Spice Instant Answer Tester.

## Getting started

**Install and run ChromeDriver**
https://code.google.com/p/selenium/wiki/ChromeDriver

`$./chromedriver --verbose --url-base=/wd/hub`
`$npm install wd`
`$node main.js`


## Features

- Detects JS errors
- Checks for existance ZCI dom element
- Check for JSON API changes
- Simple event testing

## Short term goals
1. Manually look for broken spice IAs @ https://duck.co/ia
    - Find out why they are broken
    - Could we have written a test for this?


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




