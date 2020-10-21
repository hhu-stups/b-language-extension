# b-language-extension README

Compiler support for B via ProB. You don't need your own version of proB. This plugin comes with one packed. You can however provide a proB version on your own, but be cautious; This can lead to unexpected and untested behavior.

In order to change prob_cli versions you need to make the change in the settings and restart the extension (open and close vscode).

## Features

![animation](https://raw.githubusercontent.com/hhu-stups/b-language-extension/master/media/screencaputer.gif)


## Requirements

- Java v.8 or higher. By default java home is considerd to be accessible by typing 'java' in terminal/powershell


## Extension Settings

This extension contributes the following settings:

* `prob.probHome`: to set the path to ProB. Default ist 'DEFAULT' and means that shipped version of prob ist used
* `prob.wdChecks`: to enable/disable WD (Well-Definedness) Checks. 
* `prob.strictChecks`: to enable/disable stricter Checks. 
* `prob.performanceHints`: to enable/disable performance-related Hints.
* `prob.debugMode`: to enable/disable the server log


## Bugs
- please open an issue at https://github.com/SeeBasTStick/b-language-extension

## Server
The language server can be found here https://github.com/SeeBasTStick/b-language-server. 


## Future plans
- Quickfix support aká Code Completion
- Definition provider


## Release Notes

### 2.0.0

- keyword support for new proB features: REAL, real, floor, ceiling
- now uses prob2_kernel library instead of calling prob_cli direc; leads to noticable performance gain after initial warm up