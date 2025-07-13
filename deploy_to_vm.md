# Website Deployment Guide for Ubuntu VM

## 1. Prepare Deployment Bundle
```bash
cd /Users/andrewgaca/Projects/Web2
tar -czf web2.tar.gz --preserve-permissions app.js package.* .env public/ public/images/ public/images/portfolio/ backend swagger.yaml
```

## 2. Transfer Files to VM
```bash
scp -i /Users/andrewgaca/keys/DK web2.tar.gz root@178.128.228.75:/var/www/web2/
```

## 3. Application Setup on VM
```bash
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 << 'EOD'
cd /var/www/web2
tar -xzf web2.tar.gz
npm install --production

# Configure PM2 ecosystem
pm2 start app.js --name "web2" || pm2 restart web2
pm2 save
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u www-data --hp /var/www/web2

# Verify deployment
pm2 list
curl -I http://localhost:3000
EOD
```

## 4. Post-Deployment Checks
```bash
# Local verification
open http://178.128.228.75
curl -I http://178.128.228.75

# Monitor logs
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 "pm2 logs web2"
```

---

## Complete Deployment Script (Copy-Friendly):
```bash
cd /Users/andrewgaca/Projects/Web2 && \
tar -czf web2.tar.gz --preserve-permissions app.js package.* .env public/ public/images/ public/images/portfolio/ backend swagger.yaml && \
scp -i /Users/andrewgaca/keys/DK web2.tar.gz root@178.128.228.75:/var/www/web2/ && \
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 << 'EOD'
cd /var/www/web2
tar -xzf web2.tar.gz
npm install --production
pm2 start app.js --name "web2" || pm2 restart web2
pm2 save
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u www-data --hp /var/www/web2
pm2 list
curl -I http://localhost:3000
EOD
open http://178.128.228.75