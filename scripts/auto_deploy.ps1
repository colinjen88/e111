<<<<<<< HEAD
$server = "root@72.62.66.151"
=======
$server = "root@***REDACTED_IP***"
>>>>>>> 121280c2ffa1a4da7fbe5c59c34cfca84d9ec59e
$port = "4740"

Write-Host "=========================================="
Write-Host "自動部署腳本"
Write-Host "=========================================="
Write-Host ""

Write-Host "正在連線到伺服器並執行部署..." -ForegroundColor Cyan
<<<<<<< HEAD
Write-Host "密碼: @Qqww12121212" -ForegroundColor Yellow
=======
Write-Host "密碼: ***REDACTED***" -ForegroundColor Yellow
>>>>>>> 121280c2ffa1a4da7fbe5c59c34cfca84d9ec59e
Write-Host ""

$commands = @"
cd /var/www/e111/e111-booking
echo '停止舊容器...'
docker-compose -f docker-compose.prod.yml down
echo '啟動新容器...'
docker-compose -f docker-compose.prod.yml up -d
echo '等待服務啟動...'
sleep 5
echo '容器狀態:'
docker-compose -f docker-compose.prod.yml ps
echo '應用程式日誌:'
docker-compose -f docker-compose.prod.yml logs --tail=30 app
"@

ssh -p $port $server $commands

Write-Host ""
Write-Host "=========================================="
Write-Host "部署完成！"
Write-Host "=========================================="
Write-Host ""
Write-Host "請訪問: http://YOUR_SERVER_IP" -ForegroundColor Green
