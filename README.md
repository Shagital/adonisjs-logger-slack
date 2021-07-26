# Adonis Logger Slack <img src="https://cdn.iconscout.com/icon/free/png-256/slack-1425878-1205069.png" alt="Slack icon" width="25px" height="25px">
![npm](https://img.shields.io/npm/dt/@shagital/adonisjs-logger-slack?style=plastic)
![npm (scoped)](https://img.shields.io/npm/v/@shagital/adonisjs-logger-slack)
![NPM](https://img.shields.io/npm/l/@shagital/adonisjs-logger-slack)

Version [for **Adonis v4**]

This service provider adds Slack as a driver to [Adonis Logger](https://adonisjs.com/docs/4.1/logger).

This repo is based from https://github.com/pirmax/adonis-logger-rollbar


## Usage
## Installation
- You can install the package via NPM:
`npm install @shagital/adonisjs-logger-slack`
- Or with yarn:
`yarn add @shagital/adonisjs-logger-slack`
- Or with adonis:
`adonis install @shagital/adonisjs-logger-slack`

### Registering provider

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  '@shagital/adonisjs-logger-slack/providers/SlackProvider'
]
```

Add new configuration inside `logger` module in `config/app.js`:
```js
transport: 'slack'

slack: {
    name: Env.get('APP_NAME', 'adonis-app'),
    driver: 'slack',
    webhookUrl: Env.get('SLACK_WEBHOOK_URL'),
    level: 'info',
    appStart : false, // whether to create log when app is starting
    logEnv : false // should send env variables when logging
}
```

That's it! Now you can use Logger that will send data to Rollbar.

```js
const Logger = use('Logger')

Logger.info('Test message')
Logger.info('Test message', {user}) // to log extra details
Logger.transport('slack').info('this will log using the slack transport') // to specify the transport manually

```

### Env variables

`Slack` driver relies on single Env variable: `SLACK_WEBHOOK_URL=`.


