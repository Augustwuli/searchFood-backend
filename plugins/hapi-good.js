const good = require('good');

module.exports = {
  register: good,
  options: {
    ops: {
      interval: 1000
    },
    reporters: {
      typeFile: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ ops: '*' }]
        },
        {
          module: 'good-squeeze',
          name: 'SafeJson'
        },
        {
          module: 'good-file',
          args: ['logs/awesome_log']
        }
      ]
    }
  }
}