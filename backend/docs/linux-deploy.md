# Linux Producton deployment guide

A implementation of the PRIME authentication service, as it's own micro-service.

## Running

### Running as a stand-alone server

You can substitude `npm` for `yarn` if desired.

```bash
# After an update, install any updated dependencies
yarn install

# Run in devlopment mode (requires nodemon to be installed locally)
yarn dev

# Run in production (requires pm2)
yarn prod

# (optional) Run in production, but using forever instead of pm2
yarn prod-forever

```

### Installation and setup

Basic strategy is to deploy the API behind a Nginx webserver.

```bash

sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install build-essential -y

# Node JS (v14)
# See https://github.com/nodesource/distributions/blob/master/README.md
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx (see sample config below)
sudo apt-get install nginx -y
sudo service nginx start

# Yarn (https://legacy.yarnpkg.com/en/docs/install/#debian-stable)
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update -y
sudo apt install yarn -y

# (optional) Color terminal!
# Uncomment #force_color_prompt=yes in ~/.bashrc
# save then execute source ~/.bashrc

# SSL from certbot (if needed)
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update -y
sudo apt-get install python-certbot-nginx -y
sudo certbot --nginx

# Install some dev dependencies (optional, but enables faster versions of crypto)
sudo apt-get install -y node-gyp

# User forever or pm2
sudo npm install -g forever
yarn global add pm2

# (optional) Let pm2 rotate logs and setup
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 1K
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '*/1 * * * *' 
```

### A sample Nginx Setup
 
To run multiple micro-services as a cohesive API, one example is to run each service on a different port and use NGINX to route to each service based on the path. So for example;

```bash
server {

    server_name <URL>;

    # nginx will pick out the client’s IP address from the addresses its given
    real_ip_header X-Real-IP;

    # the proxy server’s IP is replaced by the visitor’s IP address
    real_ip_recursive on;

    root /opt/node/<URL>/live;

    # AUTH Service, route all <URL>/`auth`/* api calls to the auth-service
    location /auth {
        proxy_pass http://127.0.0.1:7001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Host $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # OTHER service, route all <URL>/`other`/* api calls to the auth-service
    location /auth {
        proxy_pass http://127.0.0.1:7002;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Host $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}
```
