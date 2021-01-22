'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const Slack = require('../drivers/Slack')

class SlackProvider extends ServiceProvider {
  register () {

    this.app.extend('Adonis/Src/Logger', 'slack', () => {
      return new Slack()
    })

  }

}

module.exports = SlackProvider
