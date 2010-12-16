var   events = require('events')
    , sys    = require('sys')
    , net    = require('net')
;

module.exports = StreamHandler;

/**
 * Consume data until you get a new line, emit a line event, clean buffer, rinse, repeat
 */
function StreamHandler(host, port, delimiter) {
	events.EventEmitter.call(this);

	var self = this;
	self.delimiter = delimiter || "\r\n";
	self.host      = host;
	self.port      = port;

	self.buffer    = '';

	self.conn = net.createConnection(self.port, self.host);
	self.conn.setEncoding("utf8");
	
	self.conn.on('connection', function () {
		console.log('Connected to ' + self.host + ':' + self.port);
	});
	
	self.conn.on('error', function(err) {
		self.emit('error', err);
	});
	self.conn.on('data', function(data) {
		self.conn.pause();
		self.buffer += data;
		if (self.buffer.match(/\n/)) {
			var arr = self.buffer.split(self.delimiter);
			//Everything except the last one
			for(var i = 0; i < arr.length - 1; i++) {
				self.emit('line', arr[i]);
			}
			self.buffer = arr[arr.length - 1];
		}
		self.conn.resume();
	});
	self.conn.on('close', function(had_error) {
		if (!had_error && self.buffer.length > 0) {
			self.emit('line', self.buffer);
		}
	});
}
sys.inherits(StreamHandler, events.EventEmitter);

StreamHandler.prototype.close = function() {
	//this.conn.destroy();
}

StreamHandler.prototype.write = function(data) {
	this.conn.write(data);
}
