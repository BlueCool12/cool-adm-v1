# 🚀 BLUECOOL CMS Project (Back-end)

이 프로젝트는 블로그 관리자 페이지의 백엔드를 **Nest.js**와 **TypeScript**로 구현한 결과물입니다.
완전한 DDD(Domain-Driven Design)보다는 **객체지향 프로그래밍(OOP)** 원칙을 준수하며, 유지보수와 확장성이 용이한 구조를 만드는 데 초점을 맞추었습니다.

## 🛠 Tech Stack

- **Framework**: Nest.js
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Package Manager**: npm

## 📂 Project Architecture & Philosophy

이 프로젝트는 **Nest.js**의 모듈러 아키텍처를 기반으로 하되, 비즈니스 로직 구현에 있어 **객체지향 프로그래밍(OOP)** 원칙을 준수하는 데 주안점을 두었습니다.

단순히 데이터를 나르는 객체(DTO)와 절차적인 서비스 로직(Transaction Script)에 의존하는 것을 지양하고, **도메인 객체가 스스로의 상태와 행위를 관리**하는 구조를 지향합니다.

### 🏗 Architecture Overview

전체적인 데이터 흐름과 의존성은 단방향으로 설계하여 결합도를 낮추었습니다.

1. **Controller (Presentation Layer)**
   - HTTP 요청을 수신하고 응답을 반환하는 역할에만 집중합니다.
   - 비즈니스 로직을 직접 수행하지 않습니다.

2. **Service (Application Layer)**
   - 전체적인 애플리케이션의 흐름을 조율(Orchestration)합니다.
   - 구체적인 비즈니스 규칙은 도메인 객체에게 위임하여 처리합니다.

3. **Domain Entity (Business Layer)**
   - **OOP Focus**: 데이터와 그 데이터를 조작하는 로직을 함께 캡슐화합니다.
   - 예: '댓글 수정' 로직은 서비스가 아닌 `Reply` 객체 내부의 메서드로 구현하여 응집도를 높였습니다.

4. **Repository (Persistence Layer)**
   - 데이터베이스와의 통신을 담당하며, TypeORM을 통해 객체와 관계형 데이터를 매핑합니다.

### 💡 Key Decisions

* **Encapsulation (캡슐화)**: 객체의 상태를 외부에서 무분별하게 변경(`set` 메서드 남발)하지 못하도록 제한하고, 의도가 명확한 메서드를 통해서만 상태를 변경하도록 설계했습니다.
* **Refactoring**: 기존의 하드코딩된 설정값이나 절차적인 코드들을 환경변수(`ConfigService`) 도입과 객체 지향적 구조로 리팩토링하여 유지보수성을 개선했습니다.

---

## ✨ Key Features & Technical Challenges

### 1. 게시글 라이프사이클 및 미디어 처리 (Post & Media)
* **Features**: 글 조회, 초안(Draft) 작성, 수정, 삭제, 이미지 업로드
* **Technical Challenge**: 게시글의 상태(임시저장/발행) 관리와 텍스트-미디어(이미지)가 혼합된 콘텐츠의 효율적인 처리.
* **Solution**:
    * **State Pattern**: '초안'과 '발행' 상태를 명확히 구분하여, 미완성된 글이 노출되지 않도록 비즈니스 로직 레벨에서 제어했습니다.
    * **Media Handling**: 이미지 업로드 기능을 모듈화하여 게시글 작성 로직과의 결합도를 낮추고 재사용성을 높였습니다.

### 2. 카테고리 관리 시스템 (Category Management)
* **Features**: 카테고리 생성, 조회, 수정, 삭제
* **Technical Challenge**: 게시글과의 연관 관계(Relation)를 유지하면서 데이터 무결성을 보장하는 CRUD 구현.
* **Solution**:
    * **TypeORM Relations**: 카테고리와 게시글 간의 관계를 명확히 정의하여, 카테고리 조회 시 연관된 게시글 데이터를 효율적으로 로딩하거나 관리할 수 있도록 설계했습니다.
    * **Encapsulation**: 카테고리 수정/삭제 시 발생할 수 있는 부작용(Side Effect)을 최소화하기 위해 엔티티 내부 메서드를 통해 변경 로직을 수행합니다.

### 3. 보안 및 인증 가드 (Authentication & Security)
* **Features**: 로그인, 로그아웃, 권한 체크(Guard)
* **Technical Challenge**: 관리자 전용 기능에 대한 인가(Authorization) 처리 및 세션/토큰 관리.
* **Solution**:
    * **NestJS Guards**: `CanActivate` 인터페이스를 구현한 커스텀 가드(Guard)를 적용하여, 컨트롤러 진입 전 요청의 권한을 검증합니다.
    * **Intercepting Requests**: 인증되지 않은 사용자의 접근을 원천 차단하여 시스템 보안을 강화했습니다.

### 4. 댓글 및 소통 관리 (Comment System)
* **Features**: 댓글 조회, 관리자 답글(Reply) 작성
* **Technical Challenge**: 일반 사용자의 조회 권한과 관리자의 작성 권한을 분리하고, 관리자임을 식별하여 답글을 다는 로직 필요.
* **Solution**:
    * **Role-Based Logic**: 댓글 작성 시 요청자가 관리자(Admin)인지 식별하는 로직을 통해, 관리자 전용 답글 기능을 구현했습니다.
    * **Secure Logic**: 관리자 답글 작성 시 별도의 인증 절차(비밀번호 또는 토큰 검증)를 거치도록 하여 사칭을 방지했습니다.

---

## 🚀 Getting Started

### 1. Installation

패키지 의존성을 설치합니다.

```bash
$ npm install
```

### 2. Environment Setup

프로젝트 루트 경로에 .env 파일을 생성하고 아래 내용을 설정해주세요.

```bash
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_db_password
DB_DATABASE=blog_db

# Security & Permissions
# 댓글 삭제/수정 등을 위한 관리자 비밀번호
REPLY_PASSWORD=your_secure_password
```

### 3. Running the App

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
