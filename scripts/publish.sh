echo "Fetching new posts"
git submodule update --remote --merge

echo "Compiling blog"
npm run compile

echo "Publishing website"
git add --all && git commit -m "$(date)" && git push --recurse-submodules=on-demand

