git pull origin master
echo "update submodules"
cd ./content
git pull origin content
cd -
cd ./themes/LoveIt
git pull origin LoveIt
cd -
cd ./static/live2d
git pull origin live2d
cd -