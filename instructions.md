## Registering provider

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  '@shagital/adonisjs-logger-slack/providers/SlackProvider'
]
```

Add new configuration inside `logger` module in `config/app.js`:
```js
slack: {
    name: Env.get('APP_NAME', 'adonis-app'),
    driver: 'slack',
    webhookUrl: Env.get('SLACK_WEBHOOK_URL'),
    level: 'info',
}
```

That's it! Now you can use Logger that will send data to Logentries.

```js
const Logger = use('Logger')

Logger.info('Test message')

```

## Env variables

`Slack` driver relies on single Env variable: `SLACK_WEBHOOK_URL=`.
