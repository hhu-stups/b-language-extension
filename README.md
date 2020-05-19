# b-eventb-language-extension README

Compiler support for b/eventb via ProB. You need a nightly build of ProB to fully use this extension. Visit https://www3.hhu.de/stups/prob/ to get the latest version.


## Features

![animation](https://raw.githubusercontent.com/SeeBasTStick/b-eventb-language-extension/master/media/screencaputer.gif)


## Requirements

- Latest nightly build of ProB.


## Extension Settings

This extension contributes the following settings:

* `languageServer.probHome`: to set the path to ProB


## Bugs
- please open an issue at https://github.com/SeeBasTStick/b-eventb-language-extension


## Future plans
- Linter Support
- Keyword support

## Release Notes


### 0.0.1

- First prototype minimum features

### 0.0.2

- Added option to set ProB path


### 0.0.3

- README fix


### 0.0.4

- fixed bug in the package.json file leading to unnoticed server crash
- added feedback when using an unreachable path
- added feedback when using a old version of proB