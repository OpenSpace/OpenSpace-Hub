const moment = require('moment');

exports.getFormattedDate = (date) => {
  return moment(date).format('MM/DD/YYYY, HH:mm:ss [GMT]ZZ');
};
