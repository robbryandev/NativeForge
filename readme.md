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
yarn global add yo
yarn global add generator-nativeforge
```

### Create project
```bash
npx yo nativeforge your_app_name
cd your_app_name
```

### Run on web
```bash
yarn web
```

### Configure for android
* Setup virtual device and sdk in [android studio](https://docs.expo.dev/workflow/android-studio-emulator/)
* Initialize a development build
```bash
yarn init:android
```
* After that finishes you can close out of it and start the native app
```bash
yarn native
```