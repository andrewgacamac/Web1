

[Previous content...]

## Complete Setup Script
```bash
#!/bin/bash

# System setup
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx
npm install -g pm2

# Application directory setup
mkdir -p /var/www/web2
chown -R www-data:www-data /var/www/web2

# Nginx configuration
cat > /etc/nginx/sites-available/web2 << 'EOL'
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

ln -s /etc/nginx/sites-available/web2 /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
systemctl restart nginx

# Firewall configuration
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Verification commands
echo "=== Service Versions ==="
node --version
npm --version
nginx -v
pm2 --version

echo "=== Nginx Test ==="
curl -I http://localhost
```

## Usage Instructions
1. Make the script executable:
```bash
chmod +x setup_script.sh
```

2. Run the script:
```bash
./setup_script.sh
```

[Remaining content...]