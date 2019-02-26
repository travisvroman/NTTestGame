@echo off

echo Cleaning...
if exist dist del dist\*.* /s /q
echo Done.

echo Building...
node node_modules\typescript\bin\tsc -b
echo Done.

echo Copying dependencies...
xcopy ..\namorvtech\dist dist /h/i/c/k/e/r/y
echo Done.

echo Copying www...
xcopy www dist /h/i/c/k/e/r/y
echo Done.

echo Copying Assets...
xcopy assets dist\assets /h/i/c/k/e/r/y
echo Done.

echo BUILD COMPLETE!

