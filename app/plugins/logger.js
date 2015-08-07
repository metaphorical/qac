var bucker = require('bucker');

var logger = bucker.createLogger({
    file: {
        filename: '../../log.log',
        format: ':level :time :data',
        timestamp: 'HH:mm:ss',
        accessFormat: ':time :level :method :status :url'
    },
    console: {
        color: true
    },
    name: 'quantum'
});

module.exports = logger;
