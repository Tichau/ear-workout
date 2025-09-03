# Ear Workout

Ear Workout is an application made to give you tools for ear training. For now it include a chord generator following music theory rules.
You can toggle filters to allow the generation of chord types, then generate a random chord. The algorithm gives you the notes of the chord that you must sing.

## Setup development environment

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`).

To start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploy

To deploy the application, run the script `./deploy.sh deploy`

> Note: The current deploy script is made to be used with GitHub pages.

> Node 2: If your repo name is not equivalent to your-username.github.io, make sure to update the BASE_PATH variable in the deploy script to match your repo name.
