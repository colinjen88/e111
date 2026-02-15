# ============================================================
# E111 Booking - VPS Database Hard Reset
# ============================================================
# WARNING: This will DELETE ALL DATA on the remote database.
# Use only if you need to fix credential mismatches.
# ============================================================

$ErrorActionPreference = "Stop"

$vpsHost = $env:VPS_HOST
if (-not $vpsHost) {
    $vpsHost = Read-Host "Please enter the VPS IP address (e.g. 72.62.66.151)"
}

$vpsPort = if ($env:VPS_PORT) { $env:VPS_PORT } else { "22" }
$vpsUser = if ($env:VPS_USER) { $env:VPS_USER } else { "root" }
$server = "${vpsUser}@${vpsHost}"

Write-Host "================ DATABASE RESET START ================" -ForegroundColor Red
Write-Host "Target: $server"
Write-Host "Action: WIPING DATABASE VOLUME & RESTARTING" -ForegroundColor Red

# 1. Upload script
Write-Host "`n[1/2] Uploading reset script..." -ForegroundColor Yellow
scp -P $vpsPort hard_reset_remote.sh ${server}:/root/hard_reset_remote.sh

# 2. Execute
Write-Host "`n[2/2] Executing reset on VPS..." -ForegroundColor Yellow
$commands = "sed -i 's/\r$//' /root/hard_reset_remote.sh && chmod +x /root/hard_reset_remote.sh && /root/hard_reset_remote.sh"
ssh -p $vpsPort -o ConnectTimeout=10 $server $commands

Write-Host "`nDONE! Database has been reset and re-seeded." -ForegroundColor Green
Write-Host "Check URL: http://book.gowork.run/" -ForegroundColor Cyan
