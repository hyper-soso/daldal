# dal2 monorepo

`web`과 `crawler` Next.js 앱을 pnpm workspace와 Turborepo로 관리합니다.

## 시작하기

```bash
pnpm install
pnpm dev
```

- `web`: http://localhost:3000
- `crawler`: http://localhost:3001

앱 하나만 실행하려면 다음 명령을 사용합니다.

```bash
pnpm dev:web
pnpm dev:crawler
```

## 검사 및 빌드

```bash
pnpm check
pnpm build
pnpm start
```

의존성과 lockfile은 저장소 루트에서만 관리합니다. 앱에 패키지를 추가할 때는 필터를 지정합니다.

```bash
pnpm --filter web add <package>
pnpm --filter crawler add <package>
```

## Git 커밋 규칙

커밋 메시지는 [Conventional Commits](https://www.conventionalcommits.org/) 형식을 사용합니다.

```text
<type>(<scope>): <subject>
```

주요 type:

- `feat`: 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 동작에 영향 없는 스타일 변경
- `refactor`: 리팩터링
- `test`: 테스트 추가 또는 수정
- `build`: 빌드 시스템이나 의존성 변경
- `ci`: CI 설정 변경
- `chore`: 기타 유지보수
- `revert`: 커밋 되돌리기

```text
feat(web): add login page
fix(crawler): handle request timeout
chore(repo): configure husky
```

커밋 직전에는 staged 상태인 앱 코드에 ESLint가 실행되고, 커밋 메시지는 commitlint로 검사됩니다.
