#!/bin/bash
echo "Switching to branch master .."
git checkout master
echo "Generating documentation .."
grunt docs-only
echo "Copying from dist/docs/ to temporary directory .."
mkdir tmp-gh-pages
cp -R dist/docs tmp-gh-pages/docs
echo "Switching to branch gh-pages .."
git checkout gh-pages
echo "Copying from temporary directory to ./ .."
cp -R tmp-gh-pages/docs/* ./
read -p "Enter a commit message: " commitMessage
git status
git add -A .
git commit -am "sync gh-pages" -m "$commitMessage"
echo "Pushing to remote branch gh-pages .."
git push origin gh-pages
echo "Removing directory temporary directory .."
rm -rf tmp-gh-pages
echo "Switching back to branch master .."
git checkout master
