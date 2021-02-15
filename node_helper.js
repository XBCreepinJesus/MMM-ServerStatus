var NodeHelper = require("node_helper");
var ping = require("ping");

module.exports = NodeHelper.create({
	start: function () { },

	socketNotificationReceived: function (notification, data) {
		if (notification === "MMM-SERVERSTATUS_PING") {
			this.pingHosts(data.hosts)
				.then((pongs) => {
					this.sendSocketNotification("MMM-SERVERSTATUS_PONG_" + data.group,
						{
							group: data.group,
							pingResults: pongs
						});
				});
		}
	},

	async pingHosts(hosts) {
		for (host of hosts) {
			await ping.promise.probe(host.ip, { timeout: host.timeout || 1 })
				.then(pong => {
					host.isAlive = pong.alive;
					host.pingTime = pong.time;
					host.fullResults = pong;
				})
		}

		return hosts;
	},
});