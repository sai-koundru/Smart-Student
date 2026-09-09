@echo off
title Push GNITC Portal to GitHub
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%"
echo ========================================================
echo Pushing code to GitHub (https://github.com/sai-koundru/Smart-Student)...
echo A browser window may open asking you to sign in to GitHub.
echo ========================================================
cd /d C:\Users\AWS-SAI\.gemini\antigravity\scratch\smart-student
git push -f -u origin main
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Your code has been uploaded to GitHub.
) else (
    echo An error occurred. Please check the message above.
)
echo ========================================================
pause
