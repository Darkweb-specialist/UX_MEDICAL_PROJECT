@echo off
title MediCare App Launcher
cd /d "%~dp0"

:: Ensure Node.js and npm/npx are in PATH
set "PATH=C:\Program Files\nodejs;%PATH%"
set "EXPO_NO_TELEMETRY=1"

echo ========================================================
echo   Starting MediCare - Medicine Reminder ^& Health Diary
echo ========================================================
echo.

:: Start Backend Server in a new window
echo Starting Backend API Server on port 5000...
start "MediCare Backend API" cmd /k "cd /d "%~dp0backend" && node src/server.js"

:: Wait 2 seconds using ping (works in all environments)
ping 127.0.0.1 -n 3 >nul

:: Start Expo Mobile Bundler with Web preview
echo Starting Expo Metro Bundler...
echo App will open in your browser shortly...
echo Scan the QR code with Expo Go on your Android phone!
echo.
call npx expo start --web
pause
