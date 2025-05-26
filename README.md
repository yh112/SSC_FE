# 💻 SSC\_FE-main

![Image](https://github.com/user-attachments/assets/3bc5706d-1844-439e-9422-07fcb3d84718)

`SSC_FE-main`은 **React.js** 기반의 웹 프론트엔드 애플리케이션으로, 코드 편집기, 로그인/회원가입, 프로젝트/팀 관리 및 컴파일 모달 등 다양한 기능을 제공하는 개발 협업 도구입니다.

---

## 📁 디렉토리 구조

```
src/
├── App.js                  # 전체 라우팅과 페이지 구성
├── BaseUrl.js              # API 서버 주소 설정
├── Connect.jsx             # STOMP WebSocket 연결 설정
├── Components/             # 재사용 가능한 UI 컴포넌트 모음
│   ├── Header.jsx
│   ├── CompileModal.jsx
│   ├── ProjectHeader.jsx
│   ├── TeamList.jsx
│   ├── Participants.jsx
│   └── ...등 20개 이상
├── Login.jsx               # 로그인 화면
├── SignUp.jsx              # 회원가입 화면
├── MainPage.jsx            # 진입 홈 화면
├── TeamPage.jsx            # 팀 관리 및 참여
├── ProjectPage.jsx         # 프로젝트 목록/접근
├── MonacoEditor.jsx        # 코드 편집기 (Monaco 기반)
├── StringCodeEditor.jsx    # 문자열 코드 에디터
├── useEditorScroll.js      # 에디터 스크롤 관련 커스텀 훅
└── index.js, index.css     # 앱 진입점 및 글로벌 스타일
```

---

## 🧩 주요 기능 및 컴포넌트

### 👥 사용자 인증

* **`Login.jsx` / `SignUp.jsx`**

  * 이메일/비밀번호 기반 인증
  * React 상태 기반 입력 처리

### 📁 프로젝트 및 팀 관리

* **`MainPage.jsx`, `ProjectPage.jsx`, `TeamPage.jsx`**

  * 팀 생성, 참여 기능 UI
  * 팀 목록 컴포넌트: `TeamList.jsx`
  * 프로젝트 헤더: `ProjectHeader.jsx`

### 🧑‍💻 코드 편집기

* **`MonacoEditor.jsx`, `StringCodeEditor.jsx`**

  * 실시간 코드 편집기 구현
  * `useEditorScroll.js`로 스크롤 동기화

### 🔄 코드 실행 및 컴파일

* **`CompileModal.jsx`**

  * 모달 UI를 통한 컴파일 실행 기능 제공
* **`CommitList.jsx`**

  * 커밋 로그 표시용 목록 컴포넌트

### 🔗 WebSocket 통신

* **`Connect.jsx`**

  * STOMP over WebSocket 연결 설정 구조 존재
  * 실시간 협업, 채팅 기능의 기반 가능

### 🧱 기타 UI 구성 요소

* **버튼류**: `BackButton`, `CloseButton`, `SaveButton`, `DownloadButton`, `UserButton`
* **레이아웃/입력**: `Header`, `MainHeader`, `InputText`, `UserInput`, `Nickname`
* **폴더 구조 UI**: `Directory.jsx`, `Folder.jsx`, `DragnDrop.jsx`
* **참여자 정보**: `Participants.jsx`, `Profile.jsx`

---

## ⚙️ 설치 및 실행

```bash
npm install
npm start
```

* 기본 경로: [http://localhost:3000](http://localhost:3000)

---

## 📦 사용된 주요 라이브러리

* **SockJS + STOMP.js** – WebSocket 통신
* **Monaco Editor** – 코드 편집기

---
