$ErrorActionPreference = "Stop"
$server = "root@72.62.66.151"
$port = "22"
$password = "@Qqww12121212"

Write-Host "================ Deployment Start ================" -ForegroundColor Cyan
Write-Host "Target: $server (Port $port)"
Write-Host "Password: $password" -ForegroundColor Yellow
Write-Host " (Please copy the password, you will need to paste it twice)" -ForegroundColor Gray

# 0. Create Archive
if (Test-Path "deploy.tar.gz") {
    Remove-Item "deploy.tar.gz"
}

Write-Host "Creating deploy.tar.gz..." -ForegroundColor Green
tar --exclude="node_modules" --exclude=".git" --exclude=".nuxt" --exclude=".output" --exclude="dist" --exclude=".env" --exclude=".idea" --exclude=".vscode" -czf deploy.tar.gz .

if (-not (Test-Path "deploy.tar.gz")) {
    Write-Error "Failed to create deploy.tar.gz!"
}

# 1. Upload
Write-Host "`n[1/3] Uploading deploy.tar.gz..." -ForegroundColor Green
scp -P $port deploy.tar.gz ${server}:/root/deploy.tar.gz

# Check if .env exists and upload
if (Test-Path ".env") {
    Write-Host "Uploading .env file..." -ForegroundColor Green
    scp -P $port .env ${server}:/root/.env
}

# Upload remote script
Write-Host "Uploading deploy_remote.sh..." -ForegroundColor Green
scp -P $port deploy_remote.sh ${server}:/root/deploy_remote.sh

# 2. Deploy (Execute Remote Script)
Write-Host "`n[2/3] Deploying on VPS..." -ForegroundColor Green
# We use sed to remove potential Windows line endings (\r) just in case
$commands = "sed -i 's/\r$//' /root/deploy_remote.sh && chmod +x /root/deploy_remote.sh && /root/deploy_remote.sh"
ssh -p $port $server $commands

Write-Host "`n[3/3] Done!" -ForegroundColor Green
Write-Host "URL: http://book.gowork.run/" -ForegroundColor Cyan
