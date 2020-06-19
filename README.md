# b-language-extension README

Compiler support for B via ProB. You need a nightly build of ProB to fully use this extension. Visit https://www3.hhu.de/stups/prob/ to get the latest version.


## Features

![animation](https://raw.githubusercontent.com/hhu-stups/b-language-extension/master/media/screencaputer.gif)


## Requirements

- Latest nightly build of ProB.


## Extension Settings

This extension contributes the following settings:

* `languageServer.probHome`: to set the path to ProB
* `languageServer.wdChecks`: to enable/disable WD (Well-Definedness) Checks. Make sure to enable/disable for the current workspace too.
* `languageServer.strictChecks`: to enable/disable stricter Checks. Make sure to enable/disable for the current workspace too.
* `languageServer.performanceHints`: to enable/disable performance-related Hints. Make sure to enable/disable for the current workspace too.


Please note that user settings overwrite workspace settings.

## Bugs
- please open an issue at https://github.com/SeeBasTStick/b-language-extension


## Future plans
- Linter Support (via Server, is still in development by Mircosoft https://microsoft.github.io/language-server-protocol/specifications/specification-3-16/)
- Quickfix support aká Code Completion
- Make startup time faster
- Switch to Java Server

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


### 0.1.0

- added more sound auto compeltion
- added WD cheks
- added strict checks


### 0.1.1

- fixed issue where path was semi hard coded


### 0.2.0

- recognizes correct file ending (.mch; .def; .imp; .ref; .sys)
- no longer activates extension on normal text documents


### 0.3.0

- added option for performance feedback
- implemented 'info' as feedback type



### 0.5.0

- added syntax highlighting (big thanks to: https://github.com/wysiib/language-b-eventb)


### 0.5.3

- reworked error messages to be more managable


### 0.6.0

- added snippets
- improved error feedback for failing call to probcli
- improved error feedback for wrong format of the _error.json file
- _error.json will now dumpend in a /tmp/ folder


### 0.6.2

- fixed recognition of failing probcli