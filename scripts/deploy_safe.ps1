$ErrorActionPreference = "Stop"
$server = "root@72.62.66.151"

# 1. Prepare local bundle
Set-Location "c:\git_work\e111\e111-booking"
Write-Host "Creating project bundle..."
if (Test-Path "deploy_bundle.tar.gz") { Remove-Item "deploy_bundle.tar.gz" }
tar --exclude='node_modules' --exclude='.output' --exclude='.git' --exclude='.nuxt' --exclude='deploy_bundle.tar.gz' -czf deploy_bundle.tar.gz .

# 2. Upload bundle
Write-Host "Uploading project files..."
scp -P 22 deploy_bundle.tar.gz ${server}:/root/deploy_bundle.tar.gz

# 3. Execute Remote Update (Using single line to avoid CRLF issues)
Write-Host "Executing remote update..."
$cmds = "mkdir -p /var/www/booking && tar -xzf /root/deploy_bundle.tar.gz -C /var/www/booking && cd /var/www/booking && docker-compose -f docker-compose.prod.yml up -d --build --force-recreate"
ssh -p 22 $server $cmds

# Cleanup
Remove-Item "deploy_bundle.tar.gz"
Write-Host "Done! Deployment complete." -ForegroundColor Green
