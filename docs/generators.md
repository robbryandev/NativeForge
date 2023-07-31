# NativeForge generators

## app
The default nativeforge generator

## api-next
generates a nextjs api with /example route and a getApi function to allow usage from both your web and native apps

### Usage
to add the nextjs api to your project just run the following command while in your projects root directory
```bash
npx yo nativeforge:api-next
```

## api-trpc (WIP)
generates a trpc api with example "greeting" procedure call and a getApi function to allow usage from both your web and native apps

NOTE: the trpc api is mostly functional, but the ApiExample page isn't automatically added to the native navigation stack yet

### Usage
to add the nextjs api to your project just run the following command while in your projects root directory
```bash
npx yo nativeforge:api-trpc
```