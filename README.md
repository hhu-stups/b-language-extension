# b-language-extension README

Compiler support for B via ProB. You don't need your own version of ProB. This plugin comes with one packed.
You can, however, provide your own ProB command-line version (aka probcli), but be cautious; this can lead to unexpected and untested behavior.
In order to change the probcli version you need to make the change in the settings and restart the extension (open and close vscode).

## Features

![animation](https://raw.githubusercontent.com/hhu-stups/b-language-extension/master/media/screencaputer.gif)


## Requirements

- Java v.8 or higher. By default Java home is considerd to be accessible by typing 'java' in terminal/powershell


## Extension Settings

This extension contributes the following settings:

* `prob.probHome`: to set the path to ProB. Default ist 'DEFAULT' and means that shipped version of prob ist used
* `prob.wdChecks`: to enable/disable WD (Well-Definedness) Checks. 
* `prob.strictChecks`: to enable/disable stricter Checks. 
* `prob.performanceHints`: to enable/disable performance-related Hints.
* `prob.debugMode`: to enable/disable the server log


## Bugs
- please open an issue at https://github.com/hhu-stups/prob-issues/issues

## Server
The language server can be found here https://github.com/hhu-stups/b-language-extension. 

## Installation on VSCodium

You can also install the plugin in [VSCodium](https://vscodium.com) by downloading the artefact (b-language-extension-\<VERSION>.vsix) and typing
 codium --install-extension b-language-extension-\<VERSION>.vsix 

## Future plans
- Quickfix support aka Code Completion
- Definition provider


## Release Notes

### 2.2.0

- Updated to ProB 1.13.0
- Updated keywords for B rules machines
- Changed settings prefixes from `languageServer` and `common` to `prob` - this will reset existing settings, but avoids conflicts with other extensions
- Fixed and expanded snippets for B relation/function operators

## Acknowledgements

- big thanks to Sebastian Krings for providing his snippets.