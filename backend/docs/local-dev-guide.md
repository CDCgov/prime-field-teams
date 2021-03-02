# Running locally guide

## Running

You can substitude `npm` for `yarn` if desired.

```bash
# After an update, install any updated dependencies
yarn install

# Run in devlopment mode (requires nodemon to be installed locally)
yarn dev

# Run in production (requires pm2)
yarn prod

# (optional) Run in production, but using forever instead of pm2
yarn prod-forever

```

## Installing (Mac)

Install Homebrew, instructions [here](https://brew.sh/).
Install nodejs [from](https://nodejs.org/en/download/).

```bash

# If using Yarn, install with
npm install --global yarn

# Install Postgres for local dev
brew install postgres

```
