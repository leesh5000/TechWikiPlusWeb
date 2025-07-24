# Docker 실행 가이드

## 🚀 빠른 빌드 방법

### BuildKit 최적화 버전 사용 (권장)
```bash
# 빠른 프로덕션 빌드
./build-fast.sh prod

# 빠른 개발 환경 빌드
./build-fast.sh dev

# 캐시 없이 재빌드
./build-fast.sh prod no-cache
```

### Docker Compose 직접 실행
```bash
# BuildKit 활성화
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# 최적화된 Dockerfile 사용
docker compose -f docker-compose.fast.yml up -d
```

## 🎯 빌드 시간 단축 팁

1. **BuildKit 활성화**: 병렬 빌드와 캐시 최적화
2. **캐시 마운트**: npm 캐시를 재사용하여 의존성 설치 시간 단축
3. **.dockerignore**: 불필요한 파일 복사 방지
4. **레이어 캐싱**: package.json만 먼저 복사하여 캐시 활용도 극대화

## 📊 성능 비교
- 기존 빌드: ~5-10분
- 최적화 빌드: ~1-3분 (캐시 활용 시)
- 재빌드: ~30초 (소스 코드만 변경 시)

## 사전 요구사항
- Docker Engine 20.10 이상
- Docker Compose v2.0 이상

## 실행 명령어

### 1. 프로덕션 환경 실행
```bash
# 백그라운드 실행
docker compose up -d

# 로그 확인
docker compose logs -f frontend

# 서비스 중지
docker compose down
```

### 2. 개발 환경 실행
```bash
# 개발 환경 실행 (자동 새로고침 지원)
docker compose up

# 또는 프로파일 지정
docker compose --profile development up frontend-dev
```

### 3. 빌드 명령어
```bash
# 이미지 재빌드
docker compose build

# 캐시 없이 재빌드
docker compose build --no-cache

# 특정 서비스만 빌드
docker compose build frontend
```

### 4. 환경 변수 설정
```bash
# .env 파일 생성
cp .env.example .env

# 환경 변수 편집
vi .env
```

## 포트 정보
- Frontend: http://localhost:3000

## 볼륨 구성 (개발 환경)
- `./apps/frontend:/app`: 소스 코드 동기화
- `/app/node_modules`: node_modules 분리
- `/app/.next`: Next.js 빌드 캐시 분리

## 유용한 명령어
```bash
# 컨테이너 내부 접속
docker compose exec frontend sh

# 로그 실시간 확인
docker compose logs -f

# 모든 리소스 정리
docker compose down -v --remove-orphans

# 상태 확인
docker compose ps
```

## 트러블슈팅

### 포트 충돌 시
```bash
# 3000번 포트 사용 중인 프로세스 확인
lsof -i :3000

# docker-compose.yml에서 포트 변경
ports:
  - "3001:3000"  # 호스트:컨테이너
```

### 권한 문제 발생 시
```bash
# 소유권 변경
sudo chown -R $USER:$USER ./apps/frontend
```

### 캐시 문제 해결
```bash
# 모든 이미지와 볼륨 제거
docker compose down -v
docker system prune -a
```