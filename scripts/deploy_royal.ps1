$ErrorActionPreference = "Stop"

$vpsHost = "72.62.66.151"
$vpsUser = "root"
$server = "${vpsUser}@${vpsHost}"
$commitId = "HEAD"

Write-Host "=== ROYAL-BOOKING SEPARATE DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "This will deploy the NEWER codebase ($commitId) to port 3002 and fix Nginx conflicts."

# 1. Prepare local bundle using git archive (gets the exact commit without checking it out)
Write-Host "1. Archiving commit $commitId..."
if (Test-Path "deploy_royal.tar.gz") { Remove-Item "deploy_royal.tar.gz" }
git archive --format=tar.gz -o deploy_royal.tar.gz $commitId

if (-not (Test-Path "deploy_royal.tar.gz")) {
    Write-Error "Failed to create deployment bundle."
}

# 2. Upload bundle
Write-Host "2. Uploading project files to VPS..."
scp -P 22 deploy_royal.tar.gz ${server}:/root/deploy_royal.tar.gz

# 3. Execute Remote Update & Split
Write-Host "3. Executing remote update on VPS..."
$remoteScript = @'
cd /root
echo 'Extracting royal-booking code (Port 3002)...'
mkdir -p /var/www/royal-booking
tar -xzf deploy_royal.tar.gz -C /var/www/royal-booking

cd /var/www/royal-booking/royal-booking

echo 'Fixing Windows CRLF line endings...'
find . -type f -name '*.prisma' -exec sed -i 's/\r$//' {} +
find . -type f -name '*.sh' -exec sed -i 's/\r$//' {} +
find . -type f -name '*.yml' -exec sed -i 's/\r$//' {} +
find . -type f -name '*.ts' -exec sed -i 's/\r$//' {} +
find . -type f -name 'Dockerfile' -exec sed -i 's/\r$//' {} +

echo 'Rebuilding royal-booking application (Port 3002)...'
docker-compose -f docker-compose.prod.yml down -v --remove-orphans
docker-compose -f docker-compose.prod.yml up -d --build

echo 'Fixing Nginx proxy to point royal.gowork.run to port 3002...'
sed -i -E 's/proxy_pass http:\/\/localhost:[0-9]+;/proxy_pass http:\/\/localhost:3002;/g' /etc/nginx/conf.d/royal.gowork.run.conf
nginx -t && systemctl reload nginx

rm /root/deploy_royal.tar.gz
echo '=== DEPLOYMENT COMPLETE ==='
'@

$remoteScript = $remoteScript.Replace("`r", "")
ssh -p 22 $server $remoteScript

# Cleanup
Remove-Item "deploy_royal.tar.gz"
Write-Host "Done! RoyalTouch is now independent and running on port 3002." -ForegroundColor Green
