@echo off
cd /d "%~dp0"
if exist ".next" rmdir /s /q ".next"
node.exe "%~dp0node_modules\next\dist\bin\next" dev -p 3000
