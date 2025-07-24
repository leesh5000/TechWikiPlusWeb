# TechWikiPlusApp

> AI와 인간이 협업하여 만드는 신뢰할 수 있는 기술 지식 플랫폼

## 프로젝트 소개

TechWikiPlusApp은 AI가 생성한 고품질의 기술 문서를 커뮤니티가 검증하고 개선하는 크라우드소싱 플랫폼의 프론트엔드 애플리케이션입니다. 기여자들에게 경제적 보상을 제공하여 지속가능한 기술 지식 생태계를 구축합니다.

### 핵심 특징

- 🤖 **AI 기반 콘텐츠 생성**: 매일 최신 기술 트렌드에 대한 문서 자동 생성
- ✏️ **커뮤니티 편집**: 전문가들이 AI 콘텐츠를 검증하고 개선
- 💰 **경제적 보상**: 기여에 대한 공정한 포인트 지급 및 현금 환급
- 🔍 **투명한 검증**: 모든 편집 이력과 투표 과정 공개
- 📚 **무료 접근**: 모든 콘텐츠를 누구나 무료로 열람 가능

## 프로젝트 문서

### 📋 [기획서](docs/planning.md)

프로젝트 개요, 비전, 목적, 시장 분석 및 핵심 기능에 대한 전반적인 기획 내용을 담고 있습니다.

### 📝 [Product Requirements Document (PRD)](docs/prd.md)

사용자 스토리, 기능 요구사항, 비기능 요구사항 등 제품 개발에 필요한 상세 요구사항을 정의합니다.

### 🔧 [Technical Requirements Document (TRD)](docs/trd.md)

시스템 아키텍처, 기술 스택, 데이터베이스 스키마, API 설계 등 기술적 구현 사항을 명시합니다.

## 기술 스택

### Frontend

- Next.js 18 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand

### Backend

- [TechWikiPlusServer](https://github.com/leesh5000/TechWikiPlusServer) 저장소 참고 바랍니다.

### DevOps

- Docker
- Kubernetes
- GitHub Actions
- AWS ECR

## 시작하기

```bash
# 프로젝트 클론
git clone https://github.com/leesh5000/TechWikiPlusApp.git

# 프론트엔드 디렉토리로 이동
cd apps/frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## CI/CD 파이프라인

이 프로젝트는 GitHub Actions를 통해 자동화된 CI/CD 파이프라인을 제공합니다.

### 파이프라인 동작

- **트리거**: `main` 브랜치로의 push 또는 PR 머지 시
- **단계**:
  1. **Linter 실행**: ESLint를 통한 코드 품질 검사
  2. **테스트 실행**: Jest를 통한 유닛 테스트 실행
  3. **Docker 이미지 빌드**: 프로덕션용 이미지 생성
  4. **AWS ECR 푸시**: 빌드된 이미지를 ECR 레지스트리에 업로드

### 필요한 GitHub Secrets

이 파이프라인을 사용하려면 GitHub Repository Settings > Secrets and variables > Actions에서 다음 시크릿을 설정해야 합니다:

- `AWS_ACCESS_KEY_ID`: AWS 액세스 키 ID
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 액세스 키

**설정 방법:**
1. GitHub 저장소로 이동
2. Settings > Secrets and variables > Actions 선택
3. "New repository secret" 클릭
4. 위 시크릿들을 각각 추가

### Docker 이미지

빌드된 이미지는 다음 태그로 푸시됩니다:
- `latest`: 최신 버전
- `{commit-sha}`: 특정 커밋 버전

ECR 저장소: `127994096408.dkr.ecr.ap-northeast-2.amazonaws.com/techwikiplus/client`

## 기여하기

TechWikiPlusApp은 오픈소스 프로젝트입니다. 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

프로젝트에 대한 문의사항이나 제안사항이 있으시면 [Issues](https://github.com/leesh5000/TechWikiPlusApp/issues)에 등록해주세요.
