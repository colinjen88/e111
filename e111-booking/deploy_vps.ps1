# ============================================================
# E111 Booking - VPS Deployment (from project directory)
# ============================================================
# SECURITY: Use SSH key authentication or set environment vars:
#   $env:VPS_HOST = "your-server-ip"
#   $env:VPS_PORT = "22"
# ============================================================

$ErrorActionPreference = "Stop"

$vpsHost = $env:VPS_HOST

if (-not $vpsHost) {
    Write-Host "Checking environment variables..." -ForegroundColor Gray
    $vpsHost = Read-Host "Please enter the VPS IP address (e.g. 1.2.3.4)"
}

$vpsPort = if ($env:VPS_PORT) { $env:VPS_PORT } else { "22" }
$vpsUser = if ($env:VPS_USER) { $env:VPS_USER } else { "root" }

if (-not $vpsHost) {
    Write-Error "VPS_HOST is required. Exiting."
    exit 1
}

$server = "${vpsUser}@${vpsHost}"

Write-Host "================ Deployment Start ================" -ForegroundColor Cyan
Write-Host "Target: $server (Port $vpsPort)"

# Create Archive
if (Test-Path "deploy.tar.gz") { Remove-Item "deploy.tar.gz" }

Write-Host "Creating deploy.tar.gz..." -ForegroundColor Green
tar --exclude="node_modules" --exclude=".git" --exclude=".nuxt" --exclude=".output" --exclude="dist" --exclude=".env" --exclude=".idea" --exclude=".vscode" --exclude=".agent" -czf deploy.tar.gz .

if (-not (Test-Path "deploy.tar.gz")) {
    Write-Error "Failed to create deploy.tar.gz!"
}

# 1. Upload
Write-Host "`n[1/3] Uploading..." -ForegroundColor Green
scp -P $vpsPort deploy.tar.gz ${server}:/root/deploy.tar.gz

if (Test-Path ".env") {
    scp -P $vpsPort .env ${server}:/root/.env
}

if (Test-Path "deploy_remote.sh") {
    scp -P $vpsPort deploy_remote.sh ${server}:/root/deploy_remote.sh
}

# 2. Deploy
Write-Host "`n[2/3] Deploying on VPS..." -ForegroundColor Green
$commands = "sed -i 's/\r$//' /root/deploy_remote.sh && chmod +x /root/deploy_remote.sh && /root/deploy_remote.sh"
ssh -p $vpsPort -o ConnectTimeout=10 $server $commands

# 3. Clean up
Remove-Item "deploy.tar.gz" -ErrorAction SilentlyContinue

Write-Host "`n[3/3] Done!" -ForegroundColor Green
Write-Host "URL: http://book.gowork.run/" -ForegroundColor Cyan
