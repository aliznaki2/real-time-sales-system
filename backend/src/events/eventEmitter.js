const EventEmitter = require('events');

class AppEventEmitter extends EventEmitter {}

const appEvents = new AppEventEmitter();


const EVENTS = {
  ORDER_CREATED: 'order.created',
  DAILY_SALES_CALCULATED: 'daily.sales.calculated'
};

module.exports = { appEvents, EVENTS };