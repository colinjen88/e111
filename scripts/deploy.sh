#!/bin/bash

echo "=========================================="
echo "e111 Booking System - 一鍵部署腳本"
echo "=========================================="
echo ""

# 設定變數
DEPLOY_DIR="/var/www/e111"
REPO_URL="https://github.com/colinjen88/e111.git"
PROJECT_DIR="$DEPLOY_DIR/e111-booking"

# 1. 清理舊部署
echo "[1/5] 清理舊部署..."
if [ -d "$DEPLOY_DIR" ]; then
    cd "$PROJECT_DIR" 2>/dev/null
    docker-compose -f docker-compose.prod.yml down 2>/dev/null
    cd /var/www
    rm -rf e111
    echo "✓ 舊部署已清理"
else
    echo "✓ 無需清理"
fi
echo ""

# 2. 克隆最新程式碼
echo "[2/5] 克隆最新程式碼..."
git clone $REPO_URL
if [ $? -eq 0 ]; then
    echo "✓ 程式碼克隆成功"
else
    echo "✗ 程式碼克隆失敗"
    exit 1
fi
echo ""

# 3. 進入專案目錄
echo "[3/5] 進入專案目錄..."
cd "$PROJECT_DIR"
if [ $? -eq 0 ]; then
    echo "✓ 目錄切換成功: $(pwd)"
else
    echo "✗ 找不到專案目錄"
    exit 1
fi
echo ""

# 4. 啟動 Docker 容器
echo "[4/5] 啟動 Docker 容器..."
docker-compose -f docker-compose.prod.yml up -d --build
if [ $? -eq 0 ]; then
    echo "✓ 容器啟動成功"
else
    echo "✗ 容器啟動失敗"
    exit 1
fi
echo ""

# 5. 等待服務啟動
echo "[5/5] 等待服務啟動..."
sleep 10
echo ""

# 檢查容器狀態
echo "=========================================="
echo "容器狀態："
echo "=========================================="
docker-compose -f docker-compose.prod.yml ps
echo ""

# 顯示日誌
echo "=========================================="
echo "應用程式日誌（最後 20 行）："
echo "=========================================="
docker-compose -f docker-compose.prod.yml logs --tail=20 app
echo ""

echo "=========================================="
echo "部署完成！"
echo "=========================================="
echo ""
echo "訪問網址: http://YOUR_SERVER_IP"
echo "管理後台: http://YOUR_SERVER_IP/admin"
echo "預設帳號: admin / admin123"
echo ""
echo "查看即時日誌: docker-compose -f docker-compose.prod.yml logs -f"
echo "重啟服務: docker-compose -f docker-compose.prod.yml restart"
echo "停止服務: docker-compose -f docker-compose.prod.yml down"
echo ""
