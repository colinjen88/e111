<<<<<<< HEAD
$ErrorActionPreference = "Stop"
$server = "root@72.62.66.151"
$port = "4740"
$password = "@Qqww12121212"
$projectDir = "e111-booking"

Write-Host "================ Deployment Start ================" -ForegroundColor Cyan
Write-Host "Target: $server (Port $port)"

# Check connection
Write-Host "Testing connection to $server on port $port..."
try {
    $conn = Test-NetConnection -ComputerName "72.62.66.151" -Port $port -WarningAction SilentlyContinue
    if (-not $conn.TcpTestSucceeded) {
        Write-Error "Connection to $server on port $port failed! Please check your network/firewall settings."
=======
# ============================================================
# E111 Booking System - VPS Deployment Script
# ============================================================
# SECURITY: Credentials are loaded from environment variables.
# Set these before running:
#   $env:VPS_HOST     = "your-server-ip"
#   $env:VPS_PORT     = "22"
#   $env:VPS_USER     = "root"
# Or use SSH key authentication (recommended).
# ============================================================

$ErrorActionPreference = "Stop"

# --- Configuration (from environment) ---
$vpsHost = $env:VPS_HOST
$vpsPort = if ($env:VPS_PORT) { $env:VPS_PORT } else { "22" }
$vpsUser = if ($env:VPS_USER) { $env:VPS_USER } else { "root" }
$projectDir = "e111-booking"

if (-not $vpsHost) {
    Write-Error "VPS_HOST environment variable is not set. Please set it: `$env:VPS_HOST = 'your-ip'"
    exit 1
}

$server = "${vpsUser}@${vpsHost}"

Write-Host "================ Deployment Start ================" -ForegroundColor Cyan
Write-Host "Target: $server (Port $vpsPort)"

# Check connection
Write-Host "Testing connection to $server on port $vpsPort..."
try {
    $conn = Test-NetConnection -ComputerName $vpsHost -Port ([int]$vpsPort) -WarningAction SilentlyContinue
    if (-not $conn.TcpTestSucceeded) {
        Write-Error "Connection to $server on port $vpsPort failed! Please check your network/firewall settings."
>>>>>>> 121280c2ffa1a4da7fbe5c59c34cfca84d9ec59e
    }
    Write-Host "Connection Successful!" -ForegroundColor Green
} catch {
    Write-Warning "Could not verify connection (ICMP blocked?), attempting anyway..."
}

# Navigate to project dir if running from root
if (Test-Path $projectDir) {
<<<<<<< HEAD
    cd $projectDir
}

# Check tarball
if (-not (Test-Path "deploy.tar.gz")) {
    Write-Host "deploy.tar.gz not found, creating..."
    tar -czvf deploy.tar.gz --exclude node_modules --exclude .nuxt --exclude .output --exclude .git -C . .
}

Write-Host "Password: $password" -ForegroundColor Yellow
Write-Host " (Please copy the password)" -ForegroundColor Gray

# 1. Upload
Write-Host "`n[1/3] Uploading deploy.tar.gz..." -ForegroundColor Green
scp -P $port -o ConnectTimeout=10 deploy.tar.gz ${server}:/root/deploy.tar.gz

# 2. Deploy
Write-Host "`n[2/3] Deploying on VPS..." -ForegroundColor Green
$commands = "
    echo 'Creating directory...'
    mkdir -p /var/www/booking
    echo 'Extracting files...'
    tar -xzvf /root/deploy.tar.gz -C /var/www/booking
    cd /var/www/booking
    echo 'Building and Starting Docker containers...'
    docker-compose -f docker-compose.prod.yml up -d --build
    echo 'Deployment Complete!'
"
ssh -p $port -o ConnectTimeout=10 $server $commands
=======
    Push-Location $projectDir
}

# Create deploy tarball
if (Test-Path "deploy.tar.gz") {
    Remove-Item "deploy.tar.gz"
}

Write-Host "Creating deploy.tar.gz..." -ForegroundColor Green
tar --exclude="node_modules" --exclude=".git" --exclude=".nuxt" --exclude=".output" --exclude="dist" --exclude=".env" --exclude=".idea" --exclude=".vscode" --exclude=".agent" -czf deploy.tar.gz .

if (-not (Test-Path "deploy.tar.gz")) {
    Write-Error "Failed to create deploy.tar.gz!"
}

# 1. Upload
Write-Host "`n[1/3] Uploading deploy.tar.gz..." -ForegroundColor Green
scp -P $vpsPort -o ConnectTimeout=10 deploy.tar.gz ${server}:/root/deploy.tar.gz

# Upload .env if exists
if (Test-Path ".env") {
    Write-Host "Uploading .env file..." -ForegroundColor Green
    scp -P $vpsPort .env ${server}:/root/.env
}

# Upload remote script if exists
if (Test-Path "deploy_remote.sh") {
    Write-Host "Uploading deploy_remote.sh..." -ForegroundColor Green
    scp -P $vpsPort deploy_remote.sh ${server}:/root/deploy_remote.sh
}

# 2. Deploy (Execute Remote Script)
Write-Host "`n[2/3] Deploying on VPS..." -ForegroundColor Green
$commands = "sed -i 's/\r$//' /root/deploy_remote.sh && chmod +x /root/deploy_remote.sh && /root/deploy_remote.sh"
ssh -p $vpsPort -o ConnectTimeout=10 $server $commands

# Clean up local tarball
if (Test-Path "deploy.tar.gz") {
    Remove-Item "deploy.tar.gz"
}

if (Test-Path $projectDir) {
    Pop-Location
}
>>>>>>> 121280c2ffa1a4da7fbe5c59c34cfca84d9ec59e

Write-Host "`n[3/3] Done!" -ForegroundColor Green
Write-Host "URL: http://book.gowork.run/" -ForegroundColor Cyan
