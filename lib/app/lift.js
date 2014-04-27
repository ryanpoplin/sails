/**
 * Module dependencies.
 */

var async = require('async');
var _ = require('lodash');


/**
 * Sails.prototype.lift()
 *
 * Loads the app, then starts all attached servers.
 *
 * @api public
 */

module.exports = function lift(configOverride, cb) {
  var sails = this;

  // Callback is optional
  cb = cb || function(err) {
    if (err) return sails.log.error(err);
  };

  async.series([

    function(cb) {
      sails.load(configOverride, cb);
    },

    sails.initialize

  ], function sailsReady(err, async_data) {
    if (err) return sails.lower(cb);

    _printSuccessMsg(sails);

    sails.emit('lifted');
    return cb(null, sails);
  });
};



// Gather app meta-info and log startup message (the boat).
function _printSuccessMsg(sails) {

  // If `config.noShip` is set, skip the startup message.
  if (!(sails.config.log && sails.config.log.noShip)) {

    sails.log.ship();
    sails.log.info(('Server lifted in `' + sails.config.appPath + '`'));
    sails.log.info(('To see your app, visit ' + (sails.getBaseurl() || '').underline));
    sails.log.info(('To shut down Sails, press <CTRL> + C at any time.'));
    sails.log.blank();
    sails.log('--------------------------------------------------------'.grey);
    sails.log((':: ' + new Date()).grey);
    sails.log.blank();
    sails.log('Environment : ' + sails.config.environment);

    // Only log the host if an explicit host is set
    if (sails.getHost()) {
      sails.log('Host        : ' + sails.getHost()); // 12 - 4 = 8 spaces
    }
    sails.log('Port        : ' + sails.config.port); // 12 - 4 = 8 spaces
    sails.log('--------------------------------------------------------'.grey);
  }
}