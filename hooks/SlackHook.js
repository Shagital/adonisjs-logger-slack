'use strict';

const Transport = require('winston-transport');
const axios = require('axios').default;

module.exports = class SlackHook extends Transport {
  constructor(opts) {
    super(opts);

    opts = opts || {};

    this.name = opts.name || 'slackWebhook';
    this.level = opts.level || undefined;
    this.webhookUrl = opts.webhookUrl;
    this.formatter = opts.formatter || undefined;
    this.unfurlLinks = opts.unfurlLinks || false;
    this.unfurlMedia = opts.unfurlMedia || false;
    this.mrkdwn = opts.mrkdwn || false;

    this.axiosInstance = axios.create({
      proxy: opts.proxy || undefined
    });
  }

  log(info, callback) {
    let payload = {
      unfurl_links: this.unfurlLinks,
      unfurl_media: this.unfurlMedia,
      mrkdwn: this.mrkdwn
    }

    let layout = this.formatter(info);

    if (!layout) {
      // if nothing passed, don't log
      return callback();
    }

    this.axiosInstance.post(this.webhookUrl, payload)
      .then(response => {
        this.emit('logged', info);
        callback();
      })
      .catch(err => {
        this.emit('error', err);
        callback();
      });
  }
}
