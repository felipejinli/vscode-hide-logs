# Hide Logs - VSCode Extension

- [Hide Logs - VSCode Extension](#hide-logs---vscode-extension)
	- [Steps](#steps)

## Steps

- [x]  clone hide comments extension and run in dev mode
- [x]  change the name of the extension and the toggle icon shown above editor
- [x]  see OG hide comments logic on how to apply the transparent colour
- [x]  create a Textmate grammar that reads start of lines of `dba(, dba2(, clog, DB()` on a json file
  - [x] create textmate language rules with begin and end keys; test regex online
  - [x] clog language rule should regex until semicolon statement since prettier prefixes endl with actual newline
- [x]  connect this json file to vscode extension through the grammar contribution point but not language

## Rough Ideas

- derived scope names for TextMate grammar definition