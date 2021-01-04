cd ./content
git add .
git commit -m "$1"
git push origin content
cd ..
git add .
git commit -m "$1"
git push origin master
