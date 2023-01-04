const https = require('https');
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
    const resp = await this._request(Object.assign({
      key: key
    }, opts));

    return {
      responseStatus: resp.status,
      responseBody: resp.data,
      value: new Buffer.from(resp.data[0].Value, 'base64').toString('utf-8')
    };
  }

  async set(key, value) {
    const resp = await this._request({
      key: key,
      body: value,
      method: 'put'
    });

    return resp.data;
  }

  async delete(key) {
    const resp = await this._request({
      key: key,
      method: 'delete'
    });

    return resp.data;
  }

  _request(opts) {
    const config = this.config;

    const requestOptions = {
      url: `${config.protocol}://${config.host}:${config.port}/v1/kv/${opts.key}?token=${config.token}${opts.recurse ? '&recurse' : ''}${opts.dc ? '&dc=' + opts.dc : ''}`,
      method: opts.method || 'get',
      strictSSL: config.strictSSL,
      data: opts.body
    };

    if (config.tlsCert) {
      requestOptions.httpsAgent = new https.Agent({
        cert: config.tlsCert,
        key: config.tlsKey,
        ca: config.ca
      });
    }

    return axios(requestOptions);
  }
}

module.exports = Consul;
