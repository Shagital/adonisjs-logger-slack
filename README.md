# Adonis Logger Slack <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAACXCAMAAAAvQTlLAAAA/1BMVEVKFUv///8ttnw2xe/rsS3fHlpDAES+sr7r6OtAAEGDaoM1ADYoACrx7/E8AD0+AD81zPZoS2lGCUcqv4AvrXnWHVnzuCo9lr+NeY5HNVJKEEpMADZMAEf5+PleFk03vuimlqdePmDc1tw7oMpPI0vcozCEGFCbaT89AE1LAEFEYYw6q9RCVFpXL1i1qLXRydE0lHAyAE1/CFFII1VHQWxGPVRBW10/jLU6gmlDTlkyo3VIMF9MACVCdp5WNFZzWHNGUHlEQ1A4i210YHU7dmY8bWMVABiZGVKvGlQ2E0m/G1ZwF05zREbIkjYLAA+Zj5ohE0l2S0MfACBhOEe6hTjjx1Y+AAAEOUlEQVR4nO2Xa1fbRhBA1wb0Wmtlr2MiFhskRTwMsQU1BLe0dhJawATiUPL/f0t3dley4DRNouO0nJ65H7A9WltXM6NZQQiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIMhTRF/AC++K/9rkEf3RwckmId3TN2n3H5YFlFL29V+zYBlfhtZBs9k827TG7Xb95y+LUbtWqzmNr2p5sKy1BDGxvbKy0jzZaNfr9V9GS/Hyl+AlzpXXwWvwerHxxRb7t71I/7D5LL3E6HB7e/tZeYlNxa+j83OSe4lueVwIF24vSzzygiCzCLckehmHZbCq5CXgsFVl9PRPzl5qfhv1jVd3Yzw+La7WHXi2bUcXg6Dk5U5C2x5OSexJRsozlhHbmwRi4cUHnjr+/WL9tyvNnMNN43Val+PinRGjoVNTONHCi5lgNgeDWBDObF9F/IiJ3EuQDEK29f3pEi9lwxuab7XXZCxf2kd6jLlhrWCSe7EoD/UgEAs+SIpVGTNellpey0SFOj7yOninvNL3Cy+RwgmToe3AdRsv66JWxok5TUqfh0x7UWWfpFX6v3+wqON2X7xo19vjLnjV3ygvDgpJg1npNAlzL10eJwp17ZyYqaQ6w3Ao89ezdb5iT9V1UqGKSuyV4ey8LzbGR79b3T+Ojo5e659TqfHnpMFcyvP+ilV5Aho0Wo72UkmFQOxnU6r3IQ9q3Gu5lbTkmftEKOCBwuIpSRXm5uaxSomfhLGbe11CdnwO5WFz5dWSi/wpXIk14Za+H3vqi9437PJ/z1Wn07mekevOzQdi3d7tGPZMs7pFi9sTU8ePEMrUFHOV1+RCpiYh6hvF/NKtRitrrUmuP93Ivx1BVtdXDet7++q4YJFvTpKk3+DFH3lVa3rgRnmRDrz8dF9ora7fHesFgqZzO4NeqUV/6jqqMpEndeypOrotauro6yHBKz5nXoPQldBeDyWvzyZfAx4EAZnAWZKPpb63UxYEA3/R9w4LGJs6ydQ180sP1aCa15Y06qi/a2u7x5/Xc3YedAWCLPPcBr1UtbvUXlydMYnmds/MCT0ShnOYE7Wh8SJqT4gqttjW7i7JvWb8fs9gGoNPe7Wek2QJnDBsmLk67T2dq1nps021V9BSy+YVb8kZKbzS+9tbfrwPmLYIosX5Ep7PVVpEdR2FmGQlrXx/pHoPu6g8K4yX6vudh/KAFoN5fjtmaeFFglBHM933ct8mQ53DXkiKfZsEQ5XP6k9iJa/1nUdHRECnETzntKh8gJmGEpjgAVPPOTSWn70U1lEyl5EwYHAxJioYrA+9ZXjJhD25tS0GqCxyV2J8VUwFxCKi34siCm/cajskMFNjbCuFfN1V/pUfwAeZsKvZ/p4c+A/VL+8HMNuCG3OfPOwv4//kpSOepRWCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIP8j/gLguXdZLWyfvAAAAABJRU5ErkJggg==" alt="Slack icon" width="25px" height="25px">

This service provider adds Slack as a driver to Adonis Logger.

This repo is based from https://github.com/pirmax/adonis-logger-rollbar


## Usage
## Installation
You can install the package via NPM:

`npm install @shagital/adonisjs-logger-slack`
Or with yarn

`yarn add @shagital/adonisjs-logger-slack`

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
}
```

That's it! Now you can use Logger that will send data to Rollbar.

```js
const Logger = use('Logger')

Logger.info('Test message')

```

### Env variables

`Slack` driver relies on single Env variable: `SLACK_WEBHOOK_URL=`.


