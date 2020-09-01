# b-language-extension README

Compiler support for B via ProB. You need a nightly build of ProB to fully use this extension. Visit https://www3.hhu.de/stups/prob/ to get the latest version.


## Features

![animation](https://raw.githubusercontent.com/hhu-stups/b-language-extension/master/media/screencaputer.gif)


## Requirements

- Latest nightly build of ProB.
- Java v.8 or higher. By default java home is considerd to be accessible by 'java' in terminal/powershell


## Extension Settings

This extension contributes the following settings:

* `languageServer.probHome`: to set the path to ProB
* `languageServer.wdChecks`: to enable/disable WD (Well-Definedness) Checks. 
* `languageServer.strictChecks`: to enable/disable stricter Checks. 
* `languageServer.performanceHints`: to enable/disable performance-related Hints.
* `languageServer.debugMode`: to enable/disable the server log

To ensure expected behavior deactivate/activate settings in the User and Worksapce Tab.

## Bugs
- please open an issue at https://github.com/SeeBasTStick/b-language-extension

## Server
The language server can be found here https://github.com/SeeBasTStick/b-language-server. 


## Future plans
- Linter Support (via Server, is still in development by Mircosoft https://microsoft.github.io/language-server-protocol/specifications/specification-3-16/)
- Quickfix support aká Code Completion
- Completion and Feedback via ProB Java kernel instead of cli calls. (will improve performance and give access to more features)

## Release Notes

### 1.1.2

- fixed a bug where for longer outputs from probcli the system would not return causing a deadlook