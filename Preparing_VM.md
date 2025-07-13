# Ubuntu VM Setup Guide for Node.js Deployment

## 1. System Preparation
```bash
sudo apt update && sudo apt upgrade -y
```

## 2. Node.js Installation
```bash
curl -fsSL https://.nodes.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 3. Web Server Setup
```bash
sudo apt install -y nginx
sudo mkdir -p /var/www/web2
sudo chown -R www-data:www-data /var/www/web2
```

## 4. Firewall Configuration
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## 5. Reverse Proxy Setup
```bash
sudo tee /etc/nginx/sites-available/web2 << 'EOL'
server {
    listen 80;
    server_name 178.128.228.75;
    
    # Rate limiting configuration - 500 requests per minute
    limit_req_zone $binary_remote_addr zone=one:10m rate=500r/m;

    # Static content handling
    location /public/ {
        limit_req zone=one burst=200 nodelay;
        alias /var/www/web2/public/;
        try_files $uri $uri/ =404;
    }

    # API/proxy handling
    location / {
        limit_req zone=one burst=100 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Pass client IP through
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOL

sudo ln -s /etc/nginx/sites-available/web2 /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
```

## 6. Deployment Verification
```bash
node --version
npm --version
nginx -v
pm2 --version
curl -I http://localhost
```

---

## Complete Command Sequence (Copy-Friendly):
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2
sudo mkdir -p /var/www/web2
sudo chown -R www-data:www-data /var/www/web2
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo tee /etc/nginx/sites-available/web2 << 'EOL'
server {
    listen 80;
    server_name 178.128.228.75;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOL
sudo ln -s /etc/nginx/sites-available/web2 /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
node --version
npm --version
nginx -v
pm2 --version
curl -I http://localhost