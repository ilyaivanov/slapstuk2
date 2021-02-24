#!/bin/sh

echo "Removing all files from ../slaptuk-staging2/build"
rm -r ../slaptuk-staging2/build
echo "Copying files to ../slaptuk-staging2 folder..."
cp -r ./build  ../slaptuk-staging2
echo "Running 'firebase deploy --only hosting' from ../slaptuk-staging2 folder..."
initialpath="$cd"
cd ../slaptuk-staging2
firebase deploy --only hosting
cd "$initialpath"
echo "Deploy to Slapstuk hosting done."