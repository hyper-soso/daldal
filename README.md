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
