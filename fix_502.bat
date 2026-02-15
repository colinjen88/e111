@echo off
echo ==========================================
echo FIXING 502 ERROR - DATABASE RESET
echo ==========================================
echo This script will:
echo 1. Connect to your VPS
echo 2. Remove the stuck database volume (which has the wrong password)
echo 3. Rebuild and restart the services
echo 4. Seed the database
echo.
echo Please enter your VPS password when prompted.
echo.

ssh -p 22 root@72.62.66.151 "cd /var/www/booking && echo '[1/4] Fixing .env...' && sed -i '/^DATABASE_URL=/d' .env && echo '[2/4] Wiping old database volume...' && docker-compose -f docker-compose.prod.yml down -v --remove-orphans && echo '[3/4] Starting services...' && docker-compose -f docker-compose.prod.yml up -d --build && echo '[4/4] Waiting for Database (15s)...' && sleep 15 && echo 'Seeding database...' && docker-compose -f docker-compose.prod.yml exec -T app npx prisma db seed && echo '=== SUCCESS ==='"

echo.
echo Fix script finished. Please check the website.
pause
