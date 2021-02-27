var NodeHelper = require("node_helper");
var ping = require("ping");

module.exports = NodeHelper.create({
	start: function () {
		console.log("Ping helper started; waiting for module(s)...");
	},

	socketNotificationReceived: function (notification, data) {
		if (notification === "MMM-SERVERSTATUS_START_PINGS") {
			this.schedulePings(data.group, data.hosts, data.interval);
		}
	},

	schedulePings(group, hosts, interval) {
		this.pingHosts(hosts)
			.then((pongs) => {
				this.sendSocketNotification("MMM-SERVERSTATUS_PONG_" + group,
					{
						group: group,
						pingResults: pongs
					});
			})
			.finally(() => {
				setTimeout(() => { this.schedulePings(group, hosts, interval); }, interval * 1000);
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