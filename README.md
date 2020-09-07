# b-language-extension README

Compiler support for B via ProB. You don´t need your own version of proB, This plugin comes with one packed. You can however provide a proB version on your own, but be cautious; This can lead to unexpected and untested behavior.


## Features

![animation](https://raw.githubusercontent.com/hhu-stups/b-language-extension/master/media/screencaputer.gif)


## Requirements

- Java v.8 or higher. By default java home is considerd to be accessible by typing 'java' in terminal/powershell


## Extension Settings

This extension contributes the following settings:

* `languageServer.probHome`: to set the path to ProB
* `languageServer.wdChecks`: to enable/disable WD (Well-Definedness) Checks. 
* `languageServer.strictChecks`: to enable/disable stricter Checks. 
* `languageServer.performanceHints`: to enable/disable performance-related Hints.
* `languageServer.debugMode`: to enable/disable the server log


## Bugs
- please open an issue at https://github.com/SeeBasTStick/b-language-extension

## Server
The language server can be found here https://github.com/SeeBasTStick/b-language-server. 


## Future plans
- Quickfix support aká Code Completion
- Definition provider



## Release Notes

### 2.0.0

- know uses the java prob kernel for drastic performance gain