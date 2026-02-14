
# 🛠 Troubleshooting Guide

## 1. Authentication Issues (401 Unauthorized)

### Symptom
- Admin login fails even with correct expected password.
- Frontend autofill shows one password, but server rejects it.
- Logs show `401 Unauthorized`.

### Solution (Windows Dev -> Linux Prod)
This is often caused by **CRLF line endings** in `.env` files when deploying from Windows.

1. **Remove Windows Line Endings**:
   ```bash
   # On VPS/Linux
   dos2unix .env
   # Or using sed if dos2unix is missing
   sed -i 's/\r//' .env
   ```

2. **Hard-Reset Environment Variables**:
   If `.env` cleanup fails, assume Docker cached the wrong values.
   - **Check actual value**: `docker-compose exec app env | grep ADMIN`
   - **Force Update**: `docker-compose -f docker-compose.prod.yml up -d --force-recreate app`

3. **Last Resort (Hardcode in Code)**:
   If environment variables persist in being wrong, modify the auth handler directly:
   ```javascript
   // server/api/admin/auth.post.ts
   // const expectedPassword = config.adminPassword; // COMMENT OUT
   const expectedPassword = "YourHardcodedPassword"; // FORCE SET
   ```

## 2. Static Content Not Updating (Showcase Page)

### Symptom
- `git pull` says "Already up to date".
- Online page shows old version (e.g. 4 items instead of 7).
- Browser cache cleared but content persists.

### Solution
Docker images are built at build-time. Static files in `public/` are COPIED into the image. **`git pull` on the host does NOT update running containers.**

1. **Pull Latest Code**:
   ```bash
   git pull origin master
   ```

2. **Rebuild Container (Critical)**:
   You MUST rebuild the image to copy the new static files.
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Verify Inside Container**:
   ```bash
   docker-compose exec app ls -l public/showcase
   ```

## 3. Deployment "Hard Reset" (Nuclear Option)

When state is inconsistent (DB schema mismatch, wrong files, zombie processes):

```bash
# 1. Stop and remove EVERYTHING (including volumes if DB is corrupted)
docker-compose -f docker-compose.prod.yml down -v --remove-orphans

# 2. Rebuild from scratch
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Seed Database (if volume was deleted)
docker-compose exec app npx prisma db seed
```
