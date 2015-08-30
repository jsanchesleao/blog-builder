echo "Getting newer posts"
cd content && git pull
cd ..

echo "Cleaning up"
cd public && git pull
cd ..

echo "Building blog"
node src/build.js

echo "Publishing"
cd public && git add --all && git commit -m "$(date)" && git push

cd .. && git stash && git add public/ && git commit -m "$(date)" && git stash pop && git push

echo "Done :)"
