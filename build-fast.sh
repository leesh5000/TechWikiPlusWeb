#!/bin/bash

# Docker BuildKit 활성화
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "🚀 빠른 Docker 빌드 시작..."

# 옵션 파싱
BUILD_TYPE="${1:-prod}"
NO_CACHE="${2:-false}"

if [ "$BUILD_TYPE" = "dev" ]; then
    echo "📦 개발 환경 빌드 중..."
    if [ "$NO_CACHE" = "no-cache" ]; then
        docker compose -f docker-compose.fast.yml build frontend-dev --no-cache
    else
        docker compose -f docker-compose.fast.yml build frontend-dev
    fi
    docker compose -f docker-compose.fast.yml --profile development up frontend-dev
else
    echo "📦 프로덕션 환경 빌드 중..."
    if [ "$NO_CACHE" = "no-cache" ]; then
        docker compose -f docker-compose.fast.yml build frontend --no-cache
    else
        docker compose -f docker-compose.fast.yml build frontend
    fi
    docker compose -f docker-compose.fast.yml up -d frontend
fi

echo "✅ 빌드 완료!"