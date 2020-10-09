var NodeHelper = require("node_helper");
var ping = require("ping");

module.exports = NodeHelper.create({
	start: function () {},

	socketNotificationReceived: function (notification, data) {
		if (notification === "MMM-SERVERSTATUS_PINGS_FOR_" + data.group.toUpperCase()) {
			let group = data.group;

			// Send out the pings; send the results back to the module
			this.pingHosts(data.hosts).then((pingResults) =>
				this.sendSocketNotification("MMM-SERVERSTATUS_REPLIES_FROM_" + data.group.toUpperCase(), {
					group: group,
					results: pingResults,
				})
			);
		}
	},

	async pingHosts(hosts) {
		for (host of hosts) {
			const result = await ping.promise.probe(host.ip, { timeout: host.timeout ? host.timeout : 1 }).then((results) => (host.results = results));

			// Set some properties for easy access
			host.isAlive = result.alive;
			host.pingTime = result.time;
			host.fullResults = result;
		}

		return hosts;
	},
});
