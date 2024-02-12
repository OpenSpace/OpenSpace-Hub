const moment = require('moment')

function formatDate(date) {
    return moment(date).format('MM/DD/YYYY, HH:mm:ss [GMT]ZZ');
}

module.exports = formatDate;