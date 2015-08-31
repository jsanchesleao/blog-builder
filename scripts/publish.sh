echo "Fetching new posts"
cd public 
git reset --hard
git checkout master 
cd ..
git submodule update --remote --merge

echo "Compiling blog"
npm run compile

echo "Publishing website"
cd public && git add --all && git commit -m "$(date)" && git push

echo "Updating Repository"
cd ..
git add --all && git commit -m "publish $(date)" && git push

echo "Done :)"
