const axios = require('axios');

class Consul {
  constructor(opts) {
    this.config = Object.assign({
      port: '8500',
      protocol: 'https',
      strictSSL: true
    }, opts);
  }

  async get(key, opts) {
    const resp = await this.request(Object.assign({
      key: key
    }, opts));

    return {
      responseStatus: resp.status,
      responseBody: resp.data,
      value: new Buffer.from(resp.data[0].Value, 'base64').toString('utf-8')
    };
  }

  async set(key, value) {
    const resp = await this.request({
      key: key,
      body: value,
      method: 'put'
    });

    return resp.data;
  }

  delete(key) {
    return new Promise((fulfill, reject) => {
      this.request({
        key: key,
        method: 'delete'
      }).then(resp => {
        fulfill(resp.data);
      }, rejected => {
        reject(rejected);
      });
    });
  }

  request(opts) {
    const config = this.config;

    return axios({
      url: `${config.protocol}://${config.host}:${config.port}/v1/kv/${opts.key}?token=${config.token}${opts.recurse ? '&recurse' : ''}${opts.dc ? '&dc=' + opts.dc : ''}`,
      method: opts.method || 'get',
      strictSSL: config.strictSSL,
      agentOptions: {
        cert: config.tlsCert,
        key: config.tlsKey,
        ca: config.ca
      },
      data: opts.body
    });
  }
}

module.exports = Consul;
