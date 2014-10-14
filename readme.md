# DuckDuckTest

Testing framework for Spice Instant Answers

## Objectives

- Tests should cover the most common breakage points
- Tests must be simple to write and maintain
- Minimize false positives


## Short term goals
1. Manually look for broken spice IAs @ https://duck.co/ia
    - Find out why they are broken
    - Could we have written a test for this?
2. Learn Casper


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


## Ideas
- Contact developers when their spice fails
- Even more useful if spices could be coded purely in browser
- Can tests be run periodically in the background as an alternative to running fast?


## Questions
- How does this fit in with Travis?

## Useful Links
http://docs.casperjs.org/en/1.1-beta3/modules/index.html

