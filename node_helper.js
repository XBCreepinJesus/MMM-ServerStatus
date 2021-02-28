var NodeHelper = require("node_helper");
var ping = require("ping");

module.exports = NodeHelper.create({
	start: function () {
		console.log("Ping helper started; waiting for requests...");
	},

	socketNotificationReceived: function (notification, data) {
		if (notification === "MMM-SERVERSTATUS_GET_PINGS") {
			this.getPings(data.group, data.hosts);
		}
	},

	getPings(group, hosts) {
		this.pingHosts(hosts)
			.then((pings) => {
				
				// Send results back to the module
				this.sendSocketNotification("MMM-SERVERSTATUS_PINGS_" + group,
					{
						group: group,
						pingResults: pings
					});
			});
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