Set WshShell = CreateObject("WScript.Shell")
scriptDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run "cmd /c cd /d """ & scriptDir & """ && node dist\index.js > run.log 2>&1", 0, True