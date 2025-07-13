# Website Update Process for DigitalOcean VM

## Update Workflow

### 1. Prepare Update Bundle
```bash
cd /Users/andrewgaca/Projects/Web2
tar -czf web2-update-$(date +%Y%m%d).tar.gz --preserve-permissions \
  app.js \
  package*.json \
  public/ \
  public/images/ \
  public/images/portfolio/ \
  backend \
  swagger.yaml \
  CODE_IMPROVEMENTS.md
```

### 2. Transfer Updated Files
```bash
scp -i /Users/andrewgaca/keys/DK web2-update-*.tar.gz root@178.128.228.75:/var/www/web2/
```

### 3. Apply Updates
```bash
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 << 'EOD'
cd /var/www/web2

# Create backup
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
cp -a web2 web2-backup-$TIMESTAMP

# Install updates
tar -xzf web2-update-*.tar.gz
npm install --production

# Maintain existing environment config
[ -f .env ] || cp .env.example .env

pm2 restart web2
EOD
```

### 4. Verify Update
```bash
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 \
  "pm2 list web2 && curl -Is http://localhost:3000 | grep 'HTTP/1.1'"
```

### 5. Rollback (If Needed)
```bash
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 << 'EOD'
cd /var/www/web2
LATEST_BACKUP=$(ls -td web2-backup-* | head -1)
rm -rf web2 && cp -a $LATEST_BACKUP web2
pm2 restart web2
EOD
```

---

## Complete Update Script (Copy-Paste Ready):
```bash
cd /Users/andrewgaca/Projects/Web2 && \
tar -czf web2-update-$(date +%Y%m%d).tar.gz --preserve-permissions app.js package*.json public/ public/images/ public/images/portfolio/ backend swagger.yaml CODE_IMPROVEMENTS.md && \
scp -i /Users/andrewgaca/keys/DK web2-update-*.tar.gz root@178.128.228.75:/var/www/web2/ && \
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 << 'EOD'
cd /var/www/web2
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
cp -a web2 web2-backup-$TIMESTAMP
tar -xzf web2-update-*.tar.gz
npm install --production
[ -f .env ] || cp .env.example .env
pm2 restart web2
pm2 list web2
curl -Is http://localhost:3000 | grep 'HTTP/1.1'
EOD
```

## Key Features
- Timestamped backups for easy rollback
- Preserves existing .env configuration
- Automatic verification of service health
- Checks for required environment file
- Includes update timestamp in filenames

scp -i /Users/andrewgaca/keys/DK public/index.html root@178.128.228.75:/var/www/web2/public/ && ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 "systemctl reload nginx"