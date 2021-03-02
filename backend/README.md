# PRIME Authentication Service

A implementation of the PRIME authentication service, as it's own micro-service.

More details on deployment and development in different environments can be found in the `docs` directory, linked below;

* [Local development guide](./docs/local-dev-guide.md)
* [Linux production deployment guide](./docs/linux-deploy.md)
* [Azure development guide](./docs/azure-guide.md)
* [Azure production deployment guide](./docs/azure-deploy.md)

FHIR Bulk Data Access http://hl7.org/fhir/uv/bulkdata/authorization/index.html

## Contributing & Versioning

We follow the semantic versioning convention, when you commit do so in the following manner;

```
git commit -m "fix: JIRA-1234 Fixed bug on foo"
git commit -m "feat: JIRA-2345 Adds new Widget"
git commit -m "chore: JIRA-3456 Updated README"
git commit -m 'feat: JIRA-4567 Added new theme
```

We use [standard_version](https://github.com/conventional-changelog/standard-version) to automate versioning and release notes.

Simply run `yarn run release` to bump the version number appropriately and generate release notes. Run `git push --follow-tags origin master` to publish.

## Environmental Variables

You will need to create a `.env` file and place in the root directory. 

A sample of the required settings can be found in `.env.example` but you will need to get the specific settings for you.

## Running

### Node/Express
You can substitude `npm` for `yarn` if desired.

```bash
# After an update, install any updated dependencies
yarn install

# Run in devlopment mode (requires node mon to be installed locally)
yarn dev

# Run in production (requires pm2)
yarn prod

# (optional) Run in production, but using forever instead of pm2
yarn prod-forever

```

### Azure

```bash
# After an update, install any updated dependencies
yarn install

# Run in devlopment mode (requires azure cli tools)
yarn az-dev

# Depoy and run in production (requires azure cli tools)
# TBD
# yarn az-deploy


```

