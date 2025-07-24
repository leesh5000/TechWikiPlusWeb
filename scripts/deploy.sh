#!/bin/bash

# 배포 스크립트
# 사용법: ./scripts/deploy.sh

set -e

echo "🚀 TechWikiPlus Client 배포 시작..."

# 환경 변수 확인
if [ -z "$ECR_REPOSITORY" ] || [ -z "$IMAGE_TAG" ]; then
    echo "❌ 필수 환경 변수가 설정되지 않았습니다."
    echo "ECR_REPOSITORY와 IMAGE_TAG를 설정해주세요."
    exit 1
fi

cd ~/techwikiplus-client-web

# .env 파일 확인
if [ ! -f .env ]; then
    echo "⚠️  .env 파일이 없습니다. .env.production.example을 복사합니다."
    cp .env.production.example .env
    echo "📝 .env 파일을 편집하여 실제 API URL을 설정해주세요."
fi

# ECR 로그인
echo "🔐 ECR 로그인 중..."
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin $ECR_REPOSITORY

# 기존 컨테이너 백업
echo "📦 기존 컨테이너 백업..."
BACKUP_TAG=$(docker ps --filter "name=frontend" --format "{{.Image}}" | head -1)
if [ ! -z "$BACKUP_TAG" ]; then
    echo "백업 이미지: $BACKUP_TAG"
fi

# 새 이미지 pull
echo "🔄 새 이미지 다운로드 중..."
docker pull ${ECR_REPOSITORY}:${IMAGE_TAG}

# 기존 컨테이너 정지
echo "⏹️  기존 컨테이너 정지..."
docker compose -f docker-compose.prod.yml down || true

# 새 컨테이너 시작
echo "▶️  새 컨테이너 시작..."
docker compose -f docker-compose.prod.yml up -d

# 헬스체크
echo "🏥 헬스체크 수행 중..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 배포 성공!"
        echo "📊 컨테이너 상태:"
        docker compose -f docker-compose.prod.yml ps
        exit 0
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "재시도 $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

echo "❌ 배포 실패 - 헬스체크 실패"
echo "📋 컨테이너 로그:"
docker compose -f docker-compose.prod.yml logs --tail=50

# 롤백
if [ ! -z "$BACKUP_TAG" ]; then
    echo "🔄 이전 버전으로 롤백 중..."
    export IMAGE_TAG=$(echo $BACKUP_TAG | cut -d: -f2)
    docker compose -f docker-compose.prod.yml up -d
fi

exit 1