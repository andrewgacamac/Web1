# Deployment Guide for Web2 Application

Updated with current server details:

## Server Information
- IP Address: 178.128.228.75
- SSH Key Path: /Users/andrewgaca/keys/DK

## Quick Deployment Commands
```bash
# Create bundle
cd /Users/andrewgaca/Projects/Web2
tar -czf web2.tar.gz app.js package.* public backend swagger.yaml

# Transfer files
scp -i /Users/andrewgaca/keys/DK web2.tar.gz root@178.128.228.75:/var/www/web2/

# Deploy updates
ssh -i /Users/andrewgaca/keys/DK root@178.128.228.75 <<EOF
cd /var/www/web2
tar -xzf web2.tar.gz
npm install --production
pm2 restart web2
EOF
```

## Connection Troubleshooting
1. Verify key permissions:
```bash
chmod 600 /Users/andrewgaca/keys/DK
```

2. Test basic connectivity:
```bash
ping -c 4 178.128.228.75
```

3. Check DigitalOcean firewall rules for TCP/22 access