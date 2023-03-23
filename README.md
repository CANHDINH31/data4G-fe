# Viettel Data

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Information


- Design UI [Figma](https://www.figma.com/file/gkdeTiP96x9sF3HwZqPlnR/%E3%82%B7%E3%83%B3%E3%83%9C%E3%83%AB%E3%82%A6%E3%82%A9%E3%83%BC%E3%82%AFUI?node-id=0%3A1&t=vew6BieNrkQmi8Ft-0)

### Tech stack

Assumes you have basic knowledge of JavaScript and React. If you’ve never written React code, you should go through [the official React tutorial](https://reactjs.org/tutorial/tutorial.html) first.

**Dependencies:**

- [Typescript](https://www.typescriptlang.org/)
- [Material UI V5](https://mui.com/)
- [React Query](https://tanstack.com/query/latest)
- [Firebase](https://firebase.google.com/docs/web/setup?hl=vi)
- [Next firebase auth](https://github.com/gladly-team/next-firebase-auth)
- [See more](package.json)

## Getting Started

First, copy .env.example as .env.local

```bash
cp .env.example .env.local
```

And configuration for environment variables:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=

COOKIE_SECRET_PREVIOUS=
COOKIE_SECRET_CURRENT=
NEXT_PUBLIC_ENV=
```

Then, install dependencies and run the development server:

```bash
npm install or yarn
```

```bash
npm run dev
# or
yarn dev
```

Go to [localhost:3000](http://localhost:3000) and start developing

### Implement an authenticated page

This project uses [next-firebase-auth](https://github.com/gladly-team/next-firebase-auth).
For pages that require authentication, wrap the Container
component with a higher order function as follows

```ts
const Component = () => {
  return (
    <div></div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(authorize) // authorize from @/lib/middleware

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Component)

```

Components wrapped in withAuthUser use useAuthUser to retrieve user information during login.

```ts
const Component = () => {
  const AuthUser = useAuthUser() // Get authenticated user info

  return (
    <div></div>
  )
}
```

## Execute tools script

### 1. install direnv

direnv: https://github.com/direnv/direnv

install `direnv`

```bash
brew install direnv
```

### 2. add shell hooks

For bash user

```bash
~/.bashrc

eval "$(direnv hook bash)"
```

For zsh user

```sh
~/.zshrc

eval "$(direnv hook zsh)"
```

### 3. add env to use in script

```bash
touch ./tools/.envrc
```

```bash
./tools/.envrc

export FIREBASE_PROJECT_ID="" # add
export FIREBASE_CLIENT_EMAIL="" # add
export FIREBASE_PRIVATE_KEY="" # add
```

### 4. allow direnv

```bash
direnv allow .
```

### 5. execute scripts

```bash
cd ./tools
yarn ts-node ./tools/setAdminCustomClaims.ts ${uid}
```

