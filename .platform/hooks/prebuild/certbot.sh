#!/bin/sh
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
sudo yum-config-manager --enable epel
sudo yum install -y certbot
sudo yum install -y certbot-nginx
sudo mkdir -p /etc/letsencrypt/live/$(/opt/elasticbeanstalk/bin/get-config environment -k EB_SITE_URL)
sudo chmod 0755 /etc/letsencrypt/live
sudo chmod 0755 /etc/letsencrypt/archive
sudo certbot certonly --non-interactive --agree-tos -d $(/opt/elasticbeanstalk/bin/get-config environment -k EB_SITE_URL) -m alexey.b@resty-app.com --nginx