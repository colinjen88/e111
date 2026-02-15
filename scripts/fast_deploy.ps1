$ErrorActionPreference = "Stop"

$vpsHost = "72.62.66.151"
$vpsUser = "root"
$server = "${vpsUser}@${vpsHost}"

Write-Host "=== DEPLOYING CHANGES (Code + Assets) ===" -ForegroundColor Cyan
Write-Host "Target: $server"

# Ensure we are in project root
Set-Location "c:\git_work\e111\e111-booking"

# Create clean tarball of app source code
Write-Host "Packing source..."
tar --exclude='node_modules' --exclude='.output' --exclude='.git' --exclude='.nuxt' -czf backend.tar.gz .

# Upload it
Write-Host "Uploading..."
scp -P 22 backend.tar.gz ${server}:/root/backend.tar.gz

# Execute remote build
Write-Host "Building and restarting on VPS..."
# We use up -d --build to Ensure the new code (Vue files) is recompiled into the image
$commands = "mkdir -p /var/www/booking && tar -xzf /root/backend.tar.gz -C /var/www/booking && cd /var/www/booking && docker-compose -f docker-compose.prod.yml up -d --build app && echo '=== DEPLOYMENT DONE ==='"

ssh -p 22 $server $commands

if (Test-Path "backend.tar.gz") { Remote-Item "backend.tar.gz" }

Write-Host "Updated! Check Order Page and Showcase." -ForegroundColor Green
