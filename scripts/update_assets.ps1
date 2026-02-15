$ErrorActionPreference = "Stop"

$vpsHost = "72.62.66.151"
$vpsUser = "root"
$server = "${vpsUser}@${vpsHost}"

Write-Host "=== FAST ASSET UPDATE ===" -ForegroundColor Cyan
Write-Host "Target: $server"

# Navigate to project root where 'public' folder exists
Set-Location "c:\git_work\e111\e111-booking"

if (-not (Test-Path "public")) {
    Write-Error "Error: 'public' directory not found in current path."
}

# Create assets tarball
Write-Host "Packing public assets..."
tar -czf assets.tar.gz public

# Upload
Write-Host "Uploading assets..."
scp -P 22 assets.tar.gz ${server}:/root/assets.tar.gz

# Deploy to running container
# We use a remote script to handle the variables properly to avoid PowerShell local expansion issues
Write-Host "Injecting files into container..."

# The command string uses single quotes to prevent PowerShell from expanding $ variables
# We explicitly find the container ID of the 'app' service
$remoteCmd = 'cd /root && tar -xzf assets.tar.gz && cid=$(docker-compose -f /var/www/booking/docker-compose.prod.yml ps -q app) && echo "Target Container: $cid" && docker cp public/. $cid:/app/.output/public/ && rm -rf public assets.tar.gz && echo "=== ASSETS UPDATED ==="'

ssh -p 22 $server $remoteCmd

# Cleanup local
if (Test-Path "assets.tar.gz") {
    Remove-Item assets.tar.gz
}

Write-Host "Done! Please refresh your browser (Ctrl+F5)." -ForegroundColor Green
