$ErrorActionPreference = "Stop"

# --- Configuration (from environment or defaults) ---
$vpsHost = if ($env:VPS_HOST) { $env:VPS_HOST } else { "72.62.66.151" }
$vpsPort = if ($env:VPS_PORT) { $env:VPS_PORT } else { "22" } # Changed from 4740 to 22
$vpsUser = if ($env:VPS_USER) { $env:VPS_USER } else { "root" }
$projectDir = "e111-booking"

$server = "${vpsUser}@${vpsHost}"

Write-Host "================ Deployment Start ================" -ForegroundColor Cyan
Write-Host "Target: $server (Port $vpsPort)"

# Check connection
Write-Host "Testing connection to $vpsHost on port $vpsPort..."
try {
    $conn = Test-NetConnection -ComputerName $vpsHost -Port ([int]$vpsPort) -WarningAction SilentlyContinue
    if (-not $conn.TcpTestSucceeded) {
        Write-Error "Connection to $server on port $vpsPort failed! Please check your network/firewall settings."
    }
    Write-Host "Connection Successful!" -ForegroundColor Green
} catch {
    Write-Warning "Could not verify connection (ICMP blocked?), attempting anyway..."
}

# Navigate to project dir if running from root
$inProjectDir = $false
if (Test-Path $projectDir) {
    Push-Location $projectDir
    $inProjectDir = $true
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
Write-Host "`n[1/3] Uploading files to VPS..." -ForegroundColor Green
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

if ($inProjectDir) {
    Pop-Location
}

Write-Host "`n[3/3] Done!" -ForegroundColor Green
Write-Host "URL: http://book.gowork.run/" -ForegroundColor Cyan
