# Change Log


## 0.0.1

- first prototype version


## 0.0.2

- option to add cutom path


## 0.0.4

- fixed bug in the package.json file leading to unnoticed server crash
- added feedback when using an unreachable path
- added feedback when using a old version of proB


## 0.1.0

- added more sound auto compeltion
- added WD cheks
- added strict checks


## 0.1.1

- fixed issue where path was semi hard coded



## 0.2.0

- recognizes correct file ending (.mch; .def; .imp; .ref; .sys)
- no longer activates extension on normal text documents


## 0.3.0

- added option for performance feedback
- implemented 'info' as feedback type


## 0.5.0

- added syntax highlighting

## 0.5.1

- minor fixes

## 0.5.2

- media fixes


## 0.5.3

- reworked error messages to be more managable


## 0.6.0

- added snippets
- improved error feedback for failing call to probcli
- improved error feedback for wrong format of the _error.json file
- _error.json will now dumpend in a /tmp/ folder


## 1.0.0

- switched to Java Server and will be able to access ProB Kernel library.
- server has no debug option and output



## 1.0.1

- debug mode is now disabled by default
- debug console will now behave more reasonable behavior
- updated server version to take care of windows and mac problems

## 1.1.1

- fixed bug where problems from sub machines where shown in the main machine
- added a opical feedback when an evaluation is finished
- added .rmch file extensions (still pretty much a prototype regarding coloring)
- added file icons to identify files which can be processed by this plugin, note that icon themes are exclusive, selecting the new theme will disable all other themes: https://github.com/microsoft/vscode/issues/14662

## 1.1.2

- fixed bug where for longer outputs from probcli the system would not return causing a deadlook


## 2.0.0

- keyword support for new proB features: REAL, real, floor, ceiling
- now uses prob2_kernel library instead of calling prob_cli direc; leads to noticable performance gain after initial warm up


## 2.0.1

- bug fix regarding completion
- stability improvements


## 2.0.2

- bug fixed that were introduced by not properly rebasing server branches
- brought back notifcation when evaluation is done

## 2.0.4

- dependencies updated

## 2.1.0

- Updated to ProB 1.12.1
- Now requires VSCode 1.67
- Optimized dependencies

## 2.1.1 (not released yet)

- Updated to ProB 1.13.0
- Updated keywords for B rules machines
- Changed settings prefixes from `languageServer` and `common` to `prob` - this will reset existing settings, but avoids conflicts with other extensions
- Fixed and expanded snippets for B relation/function operators