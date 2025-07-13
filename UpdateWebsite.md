# Website Update Deployment Guide

## Prerequisites
- SSH access configured with DK key
- Server IP: 178.128.228.75
- SSH key path: `/Users/andrewgaca/keys/DK`

## 1. Create Updated Deployment Bundle
```bash
cd /Users/andrewgaca/Projects/Web2
tar -czf web2.tar.gz \
  app.js \
  package.json \
  package-lock.json \
  public \
  backend \
  swagger.yaml \
  ARCHITECTURE.md \
  CODE_IMPROVEMENTS.md
```

## 2. Transfer Files to Server
```bash
scp -i /Users/andrewgaca/keys/DK web2.tar.gz root@178.128.228.75:/var/www/web2/
```

## 3. Deploy Updates on Server
```bash
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75
cd /var/www/web2
tar -xzf web2.tar.gz
npm install --production
pm2 restart web2
```

## 4. Verify Deployment
```bash
pm2 logs web2
```

## Complete One-Go Script
```bash
#!/bin/bash

# Local machine commands
cd /Users/andrewgaca/Projects/Web2
tar -czf web2.tar.gz app.js package.json package-lock.json public backend swagger.yaml ARCHITECTURE.md CODE_IMPROVEMENTS.md
scp -i /Users/andrewgaca/keys/DK web2.tar.gz root@178.128.228.75:/var/www/web2/

# Server commands (run after SSH connection)
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 << 'EOF'
cd /var/www/web2
tar -xzf web2.tar.gz
npm install --production
pm2 restart web2
pm2 logs web2
EOF
```

## Important Notes
- Maintains existing production `.env` file on server
- Preserves PM2 process management
- Keeps Nginx configuration intact
- Total deployment size: $(du -sh web2.tar.gz)

## Troubleshooting
- If connection fails: Verify SSH key permissions `chmod 600 /Users/andrewgaca/keys/DK`
- If install fails: Run `rm -rf node_modules && npm cache clean --force` before reinstalling
- Check disk space: `df -h /var/www`