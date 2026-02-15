$ErrorActionPreference = "Stop"

$vpsHost = "72.62.66.151"
$vpsUser = "root"
$server = "${vpsUser}@${vpsHost}"

Write-Host "=== FULL CODE DEPLOYMENT & DATABASE FIX ===" -ForegroundColor Cyan
Write-Host "Target: $server"
Write-Host "This will upload your latest code changes and reset the database to ensure test data exists."

# 1. Prepare local bundle
Set-Location "c:\git_work\e111\e111-booking"
Write-Host "Creating project bundle..."

# Clean previous artifacts
if (Test-Path "deploy_bundle.tar.gz") { Remove-Item "deploy_bundle.tar.gz" }

# Create tarball using git archive if possible, or manual tar
# ensuring we send the latest local files
tar --exclude='node_modules' --exclude='.output' --exclude='.git' --exclude='.nuxt' -czf deploy_bundle.tar.gz .

if (-not (Test-Path "deploy_bundle.tar.gz")) {
    Write-Error "Failed to create deployment bundle."
}

# 2. Upload bundle
Write-Host "Uploading project files..."
scp -P 22 deploy_bundle.tar.gz ${server}:/root/deploy_bundle.tar.gz

# 3. Execute Remote Update & Reset
Write-Host "Executing remote update..."
# We use a comprehensive remote command
$remoteScript = "
cd /root
echo '[1/5] Extracting new code...'
# We extract to a temporary folder then move to ensure atomicity or just overwrite
mkdir -p /var/www/booking
tar -xzf deploy_bundle.tar.gz -C /var/www/booking

cd /var/www/booking

echo '[2/5] Cleaning old database volume to force re-seed...'
# We assume the user creates a fresh DB for testing
docker-compose -f docker-compose.prod.yml down -v --remove-orphans

echo '[3/5] Rebuilding application...'
docker-compose -f docker-compose.prod.yml up -d --build

echo '[4/5] Waiting for database (15s)...'
sleep 15

echo '[5/5] Seeding database with test order...'
docker-compose -f docker-compose.prod.yml exec -T app npx prisma db seed

echo '=== DEPLOYMENT COMPLETE ==='
"

ssh -p 22 $server $remoteScript

# Cleanup
Remove-Item "deploy_bundle.tar.gz"

Write-Host "Done! Your changes are live and database is reset." -ForegroundColor Green
