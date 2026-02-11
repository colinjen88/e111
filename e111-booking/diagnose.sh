#!/bin/bash

echo "=========================================="
echo "Docker 容器診斷腳本"
echo "=========================================="
echo ""

echo "1. 檢查 Docker 服務狀態..."
systemctl status docker --no-pager | head -n 5
echo ""

echo "2. 檢查運行中的容器..."
docker ps
echo ""

echo "3. 檢查所有容器（包括停止的）..."
docker ps -a
echo ""

echo "4. 檢查 booking-system 相關容器..."
docker ps -a | grep -E "booking|e111"
echo ""

echo "5. 檢查 Port 80 佔用情況..."
netstat -tulpn | grep :80 || ss -tulpn | grep :80
echo ""

echo "6. 進入專案目錄並查看日誌..."
cd /var/www/e111/e111-booking 2>/dev/null || cd /var/www/booking 2>/dev/null || echo "找不到專案目錄"
if [ $? -eq 0 ]; then
    echo "當前目錄: $(pwd)"
    echo ""
    echo "7. 查看 Docker Compose 狀態..."
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo "8. 查看應用程式日誌（最後 50 行）..."
    docker-compose -f docker-compose.prod.yml logs --tail=50 app
    echo ""
    echo "9. 查看資料庫日誌（最後 20 行）..."
    docker-compose -f docker-compose.prod.yml logs --tail=20 db
fi

echo ""
echo "=========================================="
echo "診斷完成"
echo "=========================================="
