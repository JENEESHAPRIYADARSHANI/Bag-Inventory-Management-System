@echo off
REM Save Your Changes and Pull from Main

echo ==========================================
echo Save Changes and Pull from Main
echo ==========================================
echo.

REM Check current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo Current branch: %CURRENT_BRANCH%
echo.

REM Show what changed
echo Files changed:
git status --short
echo.

REM Ask user for confirmation
set /p CONFIRM="Do you want to commit these changes? (y/n): "

if /i "%CONFIRM%"=="y" (
    REM Get commit message
    echo Enter commit message or press Enter for default:
    set /p COMMIT_MSG=""
    
    if "%COMMIT_MSG%"=="" (
        set COMMIT_MSG=feat: order service integration and AWS deployment configs
    )
    
    REM Add all changes
    echo Adding all changes...
    git add .
    
    REM Commit
    echo Committing changes...
    git commit -m "%COMMIT_MSG%"
    
    echo [32mChanges committed![0m
    echo.
    
    REM Pull from main
    echo Pulling from main...
    git pull origin main
    
    if %ERRORLEVEL% EQU 0 (
        echo [32mPull successful![0m
        echo.
        echo Next steps:
        echo 1. Test your code: mvn clean install
        echo 2. Push your changes: git push origin %CURRENT_BRANCH%
    ) else (
        echo [33mMerge conflicts detected![0m
        echo.
        echo To resolve:
        echo 1. Open conflicted files
        echo 2. Resolve conflicts
        echo 3. Run: git add .
        echo 4. Run: git commit -m "merge: resolved conflicts"
    )
) else (
    echo Cancelled. Your changes are not committed.
    echo.
    echo To save changes later:
    echo   git add .
    echo   git commit -m "your message"
    echo   git pull origin main
)

echo.
echo ==========================================
pause
