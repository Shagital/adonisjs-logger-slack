'use strict'

const Env = require('@adonisjs/framework/src/Env')
const Config = require('@adonisjs/framework/src/Config')
const _ = require('lodash')
const Winston = require('winston')
const SlackHook = require('winston-slack-webhook-transport')

/**
 * Winston console transport driver for @ref('Logger')
 * All the logs will be sent to Slack.
 *
 * @class Slack
 * @constructor
 */
class Slack {
  /**
   * Set config. This method is called by Logger
   * manager by set config based upon the
   * transport in use.
   *
   * @method setConfig
   *
   * @param  {Object}  config
   */
  setConfig({
    name = Config.get('app.logger.slack.driver', 'adonis-app'),
    driver = Config.get('app.logger.slack.driver', 'slack'),
    webhookUrl = Config.get('app.logger.slack.webhookUrl', Env.get('SLACK_WEBHOOK_URL')),
    level = Config.get('app.logger.slack.level', 'info'),
    appStart = Config.get('app.logger.slack.appStart', false)
  }) {
    this.config = { name, driver, webhookUrl, level, appStart }

    /**
     * Creating new instance of winston with slack transport
     */
    this.logger = Winston.createLogger({
      level: this.config.level,
      transports: [
        new SlackHook({
          webhookUrl: this.config.webhookUrl,
          name: this.config.name,
          formatter: (info) => {
            let { message, request = {} } = info

            delete info.message
            delete info.request
            delete info.level

            let requestAll = typeof request.all === 'function' ? request.all() : null
            let requestHeaders = typeof request.all === 'function' ? request.headers() : null

            let payload = {}

            if (typeof message === 'object') {
              // if an exception was passed
              payload.text = '*' + level.toUpperCase() + ' [' + process.env.NODE_ENV + ']: * _' + message.name + '_ - ' + message.message
              payload.text += '\n>```' + message.stack + '```'
            } else {
              // if a string was passed
              let messageString = message.toString();

              if (messageString == 'serving app on http://%s:%s') {
                messageString = this.formatString(messageString, ['%s', '%s'], [process.env.HOST, process.env.PORT])
              }
              // if user doesn't want app start to be logged
              if (!this.config.appStart) {
                // log to console so user knows app has started
                console.log(`${level.toUpperCase()} [${process.env.NODE_ENV}] : ${messageString}`)
                // exit so we don't log to slack
                process.exit();
              }

              payload.text = `*${level.toUpperCase()} [${process.env.NODE_ENV}] :* ${messageString}`
            }

            if (requestAll) {
              // let's log the request object if available
              payload.text += '\n*' + request.method() + '*: `' + request.url() + '` \n>```'
              payload.text += JSON.stringify(requestAll, null, 4) + '```'
            }

            if (requestHeaders) {
              // let's log the request header if available
              payload.text += '\n*HEADERS: *\n>```' + JSON.stringify(requestHeaders, null, 4) + '```'
            }

            if (Object.keys(info).length) {
              // log any other properties passed
              payload.text += '\n*Extra: *\n>```' + JSON.stringify(info, null, 4) + '```'
            }

            return payload
          }
        })
      ]
    })

    /**
     * Updating winston levels with syslog standard levels.
     */
    this.logger.setLevels(this.levels)
  }

  formatString(string, search, replacement) {
    for (let i in search) {
      string = string.replace(search[i], replacement[i])
    }

    return string;
  }

  /**
   * A list of available log levels.
   *
   * @attribute levels
   *
   * @return {Object}
   */
  get levels() {
    return {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7
    }
  }

  /**
   * Returns the current level for the driver
   *
   * @attribute level
   *
   * @return {String}
   */
  get level() {
    return this.logger.transports[this.config.name].level
  }

  /**
   * Update driver log level at runtime
   *
   * @param  {String} level
   *
   * @return {void}
   */
  set level(level) {
    this.logger.transports[this.config.name].level = level
  }

  /**
   * Log message for a given level
   *
   * @method log
   *
   * @param  {Number}    level
   * @param  {String}    msg
   * @param  {...Spread} meta
   *
   * @return {void}
   */
  log(level, msg, ...meta) {
    const levelName = _.findKey(this.levels, (num) => {
      return num === level
    })
    this.logger.log(levelName, msg, ...meta)
  }
}

module.exports = Slack
