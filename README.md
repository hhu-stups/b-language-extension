# b-language-extension README

Compiler support for B via ProB. You need a nightly build of ProB to fully use this extension. Visit https://www3.hhu.de/stups/prob/ to get the latest version.


## Features

![animation](https://raw.githubusercontent.com/hhu-stups/b-language-extension/master/media/screencaputer.gif)


## Requirements

- Latest nightly build of ProB.
- Java v.11 or higher


## Extension Settings

This extension contributes the following settings:

* `languageServer.probHome`: to set the path to ProB
* `languageServer.wdChecks`: to enable/disable WD (Well-Definedness) Checks. Make sure to enable/disable for the current workspace too.
* `languageServer.strictChecks`: to enable/disable stricter Checks. Make sure to enable/disable for the current workspace too.
* `languageServer.performanceHints`: to enable/disable performance-related Hints. Make sure to enable/disable for the current workspace too.
* `languageServer.debugMode`: to enable/disable the server log

To ensure expected behavior deactivate/activate settings in the User and Worksapce Tab.

## Bugs
- please open an issue at https://github.com/SeeBasTStick/b-language-extension

## Server
The language server can be found here https://github.com/SeeBasTStick/b-language-server. 


## Future plans
- Linter Support (via Server, is still in development by Mircosoft https://microsoft.github.io/language-server-protocol/specifications/specification-3-16/)
- Quickfix support aká Code Completion
- Compelation and Feedback via ProB Java kernel instead of cli calls. (will improve performance and give access to more features)

## Release Notes

### 1.0.0

- switched to Java Server and will be able to access ProB Kernel library.
- server has no debug option and output