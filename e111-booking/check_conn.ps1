$ip = "***REDACTED_IP***"
$ports = @(22, 7650, 4740, 80, 443)

Write-Host "Checking connectivity to $ip..." -ForegroundColor Cyan

foreach ($port in $ports) {
    Write-Host -NoNewline "Port $port : "
    try {
        $t = Test-NetConnection -ComputerName $ip -Port $port -WarningAction SilentlyContinue
        if ($t.TcpTestSucceeded) {
            Write-Host "OPEN" -ForegroundColor Green
        } else {
            Write-Host "CLOSED / TIMEOUT" -ForegroundColor Red
        }
    } catch {
        Write-Host "ERROR" -ForegroundColor Red
    }
}

Write-Host "`nDiagnosis:" -ForegroundColor Yellow
Write-Host "If all SSH ports (22, 7650, 4740) are CLOSED, we cannot deploy."
Write-Host "Possible reasons:"
Write-Host "1. Wrong IP address."
Write-Host "2. Server is offline."
Write-Host "3. Firewall is blocking access."
