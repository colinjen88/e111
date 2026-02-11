$ErrorActionPreference = "Stop"
$server = "root@***REDACTED_IP***"
$port = "4740"
$password = "***REDACTED***"
$projectDir = "e111-booking"

Write-Host "================ Deployment Start ================" -ForegroundColor Cyan
Write-Host "Target: $server (Port $port)"

# Check connection
Write-Host "Testing connection to $server on port $port..."
try {
    $conn = Test-NetConnection -ComputerName "***REDACTED_IP***" -Port $port -WarningAction SilentlyContinue
    if (-not $conn.TcpTestSucceeded) {
        Write-Error "Connection to $server on port $port failed! Please check your network/firewall settings."
    }
    Write-Host "Connection Successful!" -ForegroundColor Green
} catch {
    Write-Warning "Could not verify connection (ICMP blocked?), attempting anyway..."
}

# Navigate to project dir if running from root
if (Test-Path $projectDir) {
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

Write-Host "`n[3/3] Done!" -ForegroundColor Green
Write-Host "URL: http://book.gowork.run/" -ForegroundColor Cyan
