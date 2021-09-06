'use strict'

const _ = require('lodash')
const Winston = require('winston')
const SlackHook = require('../hooks/SlackHook');


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
  setConfig(config) {
    this.config = config

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
            let { level, message, request = {} } = info

            delete info.message
            delete info.request
            delete info.level

            let requestAll = typeof request.all === 'function' ? request.all() : null
            let requestHeaders = typeof request.headers === 'function' ? request.headers() : null

            let payload = { blocks: [] }

            let text = '';

            if (typeof message === 'object') {
              // if an exception was passed
              text = '*' + level.toUpperCase() + ' [' + process.env.NODE_ENV + ']: *' + `${message.name ? ` _${message.name}_ - ` : ' '}` + message.message
              if (message.stack) text += '\n>```' + message.stack + '```'
              payload.blocks.push({
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": text
                }
              })

            } else {
              // if a string was passed
              let messageString = message.toString();

              if (messageString == 'serving app on http://%s:%s') {
                messageString = this.formatString(messageString, ['%s', '%s'], [process.env.HOST, process.env.PORT])

                // if user doesn't want app start to be logged
                if (!this.config.appStart) {
                  // log to console so user knows app has started
                  console.log(`${level.toUpperCase()} [${process.env.NODE_ENV}] : ${messageString}`);

                  // fail quietly
                  return null;
                }
              }

              text = `*${level.toUpperCase()} [${process.env.NODE_ENV}] :* ${messageString}`
              payload.blocks.push({
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": text
                }
              })
            }

            if (requestAll) {
              // let's log the request object if available
              text = '\n*' + request.method() + '*: `' + request.url() + '` \n>```'
              text += JSON.stringify(requestAll, null, 4) + '```'

              payload.blocks.push({
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": text
                }
              })
            }

            if (requestHeaders) {
              // let's log the request header if available
              text = '\n*Headers: *\n>```' + JSON.stringify(requestHeaders, null, 4) + '```'

              payload.blocks.push({
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": text
                }
              })
            }

            if (Object.keys(info).length) {
              // log any other properties passed
              text = '\n*Extra: *\n>```' + JSON.stringify(info, this.getCircularReplacer) + '```'

              payload.blocks.push({
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": text
                }
              })
            }

            if (this.config.logEnv && message && message.name) {
              // if it's a Error instance, log the environment too
              let envVariables = process.env;
              let keys = Object.keys(envVariables);
              // we want to only log env values specified for the app
              let demarcator = keys.indexOf("_");
              let newKeys = keys.slice(demarcator + 1);

              let newEnv = {};

              for (let keyName of newKeys) {
                newEnv[keyName] = envVariables[keyName];
              }

              text = '\n*Environment: *\n>```' + JSON.stringify(newEnv, null, 4) + '```'
              payload.blocks.push({
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": text
                }
              })
            }

            return payload
          },

        })
      ],
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

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

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
