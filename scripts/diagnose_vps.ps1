$ErrorActionPreference = "Stop"

$vpsHost = if ($env:VPS_HOST) { $env:VPS_HOST } else { "72.62.66.151" }
$vpsPort = 22
$vpsUser = "root"
$server = "${vpsUser}@${vpsHost}"

Write-Host "Connecting to $server to diagnose..." -ForegroundColor Cyan

$commands = "echo '=== DOCKER APPS ===' && docker-compose -f /var/www/booking/docker-compose.prod.yml ps && echo '=== APP LOGS (Last 100 lines) ===' && docker-compose -f /var/www/booking/docker-compose.prod.yml logs --tail=100 app && echo '=== LISTENING PORTS ===' && netstat -tulpn | grep 3001"

ssh -p $vpsPort -o ConnectTimeout=10 $server $commands
