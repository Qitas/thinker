DIR=./content/posts/*
echo > urls.txt
for f in $DIR
do
    url_p=$(echo $f | awk -F '/' '{print $4}')
    url="https://bbing.com.cn/$url_p/index.html"
    echo $url >> urls.txt
done
curl -H 'Content-Type:text/plain' --data-binary @urls.txt "http://data.zz.baidu.com/urls?site=bbing.com.cn&token=UD2Ca59xBY9vmnOm"
echo ''
echo 'post urls success'