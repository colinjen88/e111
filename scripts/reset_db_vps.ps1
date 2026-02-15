$ErrorActionPreference = "Stop"

$vpsHost = if ($env:VPS_HOST) { $env:VPS_HOST } else { "72.62.66.151" }
$vpsPort = 22
$vpsUser = "root"
$server = "${vpsUser}@${vpsHost}"

Write-Host "=== RESETTING DATABASE ON VPS ===" -ForegroundColor Red
Write-Host "Target: $server"

# Navigate to project dir to find the sh file
$projectDir = "e111-booking"
if (Test-Path $projectDir) {
    Push-Location $projectDir
}

if (-not (Test-Path "hard_reset_remote.sh")) {
    Write-Error "hard_reset_remote.sh not found in current directory!"
}

# Upload script
Write-Host "Uploading hard_reset_remote.sh..."
scp -P $vpsPort hard_reset_remote.sh ${server}:/root/hard_reset_remote.sh

# Execute script
Write-Host "Executing reset script on VPS..."
$commands = "sed -i 's/\r$//' /root/hard_reset_remote.sh && chmod +x /root/hard_reset_remote.sh && /root/hard_reset_remote.sh"
ssh -p $vpsPort -o ConnectTimeout=10 $server $commands

Write-Host "Reset Complete. Please try accessing the site." -ForegroundColor Green
