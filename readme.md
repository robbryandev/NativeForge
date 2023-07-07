# NativeForge

## What is NativeForge?
NativeForge is a bootsrapping framework for building cross platform apps
using [solito](https://solito.dev) and feature generators

## Requirements
Nodejs >= v16
yarn

## Install

### Tools
```bash
yarn global add yo generator-nativeforge
```

### Create project
```bash
npx yo nativeforge your_app_name
cd your_app_name
```

### Start the app

- Install dependencies: `yarn`

- Next.js local dev: `yarn web`
  - Runs `yarn dev`
- Expo local dev:
  - First, build a dev client onto your device or simulator
    - `cd apps/expo`
    - Then, either `expo run:ios`, `expo run:android`, or `eas build`
  - After building the dev client, from the root of the monorepo...
    - `yarn native` (This runs `expo start --dev-client`)