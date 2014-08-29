echo -e "\033[1;34;40mRemoving old _site/ \033[0m"
rm -rf _site/
echo -e "\033[1;34;40mRunning 'jekyll build' \033[0m"
jekyll build
echo -e "\033[1;34;40mPushing to s3 \033[0m"
s3cmd put -r _site/ s3://stephaniejonesstudio.com/
echo -e "\033[1;34;40mDone \033[0m"
# chmod 755 deploy.sh