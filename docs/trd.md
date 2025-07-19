# Technical Requirements Document (TRD)

## 1. 기술 아키텍처

### 1.1 시스템 아키텍처

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Database   │
│  (Next.js)  │     │   (NestJS)  │     │ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│     CDN     │     │    Redis    │     │     S3      │
│ (CloudFlare)│     │   (Cache)   │     │  (Storage)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 1.2 기술 스택

#### Frontend

- **Framework**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS + shadcn/ui
- **상태관리**: Zustand
- **에디터**: Monaco Editor (편집용)
- **마크다운**: react-markdown + remark plugins

#### Backend

- **Framework**: NestJS
- **언어**: TypeScript
- **인증**: JWT + Passport.js
- **ORM**: Prisma
- **API**: RESTful + GraphQL (선택적)

#### Database

- **주 DB**: PostgreSQL
- **캐시**: Redis
- **검색**: Elasticsearch
- **파일 저장**: AWS S3

#### DevOps

- **컨테이너**: Docker
- **오케스트레이션**: Kubernetes
- **CI/CD**: GitHub Actions
- **모니터링**: Prometheus + Grafana
- **로깅**: ELK Stack

### 1.3 데이터베이스 스키마

```sql
-- 주요 테이블 구조

-- 사용자
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    github_id VARCHAR(100),
    google_id VARCHAR(100),
    points INTEGER DEFAULT 0,
    tier VARCHAR(20) DEFAULT 'bronze',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 게시글
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    ai_generated BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 편집 요청
CREATE TABLE edit_requests (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    user_id UUID REFERENCES users(id),
    original_content TEXT,
    edited_content TEXT,
    edit_reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    votes_up INTEGER DEFAULT 0,
    votes_down INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 포인트 내역
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    amount INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 광고
CREATE TABLE advertisements (
    id UUID PRIMARY KEY,
    advertiser_name VARCHAR(255),
    banner_url TEXT,
    target_url TEXT,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.4 API 설계

#### RESTful API 엔드포인트

```text
# 인증
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

# 게시글
GET    /api/posts
GET    /api/posts/:id
GET    /api/posts/:id/history

# 편집
POST   /api/posts/:id/edit-request
GET    /api/edit-requests
GET    /api/edit-requests/:id
POST   /api/edit-requests/:id/vote
POST   /api/edit-requests/:id/approve

# 사용자
GET    /api/users/:id
GET    /api/users/:id/contributions
PUT    /api/users/:id/profile

# 포인트
GET    /api/points/history
POST   /api/points/withdraw

# 광고
GET    /api/ads/serve
POST   /api/ads/:id/click
```

### 1.5 보안 요구사항

1. **인증/인가**
   - JWT 토큰 기반 인증
   - Refresh Token 구현
   - Role-based Access Control (RBAC)

2. **데이터 보호**
   - 개인정보 암호화 (AES-256)
   - SQL Injection 방어
   - Rate Limiting

3. **콘텐츠 보안**
   - XSS 방지를 위한 입력 검증
   - 마크다운 샌디타이징
   - 파일 업로드 제한

### 1.6 성능 최적화

1. **프론트엔드**
   - 코드 스플리팅
   - 이미지 최적화 (WebP)
   - Service Worker 캐싱
   - Virtual Scrolling

2. **백엔드**
   - 데이터베이스 인덱싱
   - Redis 캐싱 전략
   - 쿼리 최적화
   - 비동기 처리

3. **인프라**
   - CDN 활용
   - Load Balancing
   - Auto Scaling
   - Database Replication

## 2. 개발 로드맵

### Phase 1: MVP (3개월)

- Week 1-2: 프로젝트 셋업 및 인프라 구축
- Week 3-4: 인증 시스템 및 사용자 관리
- Week 5-6: AI 콘텐츠 생성 파이프라인
- Week 7-8: 편집 요청 시스템
- Week 9-10: 검증 및 투표 시스템
- Week 11-12: 포인트 시스템 및 광고 통합

### Phase 2: 확장 (3개월)

- 모바일 앱 개발
- API 공개
- 고급 분석 도구
- 커뮤니티 기능 강화

### Phase 3: 고도화 (지속)

- AI 편집 제안 기능
- 기업용 솔루션
- 국제화
- 블록체인 기반 보상 시스템 검토