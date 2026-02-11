$ErrorActionPreference = "Stop"
$server = "root@72.62.66.151"
$port = "4740"
$password = "@Qqww12121212"

Write-Host "================ Deployment Start ================" -ForegroundColor Cyan
Write-Host "Target: $server (Port $port)"
Write-Host "Password: $password" -ForegroundColor Yellow
Write-Host " (Please copy the password, you will need to paste it twice)" -ForegroundColor Gray

# Check if deploy.tar.gz exists
if (-not (Test-Path "deploy.tar.gz")) {
    Write-Error "deploy.tar.gz not found! Run the tar command first."
}

# 1. Upload
Write-Host "`n[1/3] Uploading deploy.tar.gz..." -ForegroundColor Green
scp -P $port deploy.tar.gz ${server}:/root/deploy.tar.gz

# 2. Deploy (Unpack & Build)
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
ssh -p $port $server $commands

Write-Host "`n[3/3] Done!" -ForegroundColor Green
Write-Host "URL: http://book.gowork.run/" -ForegroundColor Cyan
