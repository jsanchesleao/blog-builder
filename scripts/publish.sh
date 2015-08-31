echo "Fetching new posts"
cd public 
git reset --hard
cd ..
git submodule update --remote --merge

echo "Compiling blog"
npm run compile

echo "Publishing website"
cd public
git checkout master && git add --all && git commit -m "$(date)" && git push

echo "Updating Repository"
cd ..
git add --all && git commit -m "publish $(date)" && git push

echo "Done :)"
