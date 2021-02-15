Module.register("MMM-ServerStatus", {
	defaults: {
		pingInterval: 15, // 15 second intervals
		loadDelay: 0,

		hosts: [
			{
				name: "localhost",
				ip: "127.0.0.1"
			}
		],

		templateName: "default",
		group: "default",
		tableClass: "small",

		upText: "UP",
		downText: "DOWN"
	},

	// Storage for ping results
	pingResults: null,

	// Define required scripts.
	getStyles: function () {
		return ["font-awesome.css", this.file("templates/" + this.config.templateName + ".css")];
	},

	start: function () {
		// Start pings after delay of [config.loadDelay] then at intervals of [config.pingInterval]
		// *1000 for easier config
		setTimeout(() => {
			Log.info("Starting pings");
			this.pingHosts();
			setInterval(() => this.pingHosts(), this.config.pingInterval * 1000);
		}, this.config.loadDelay * 1000);
	},

	// Trigger ping requests (see node-helper.js)
	// Sends the hosts list as the payload
	pingHosts: function () {
		this.sendSocketNotification(
			"MMM-SERVERSTATUS_PING",
			{
				group: this.config.group,
				hosts: this.config.hosts
			}
		);
	},

	socketNotificationReceived: function (notification, data) {
		if (notification === "MMM-SERVERSTATUS_PONG_" + this.config.group) {
			this.pingResults = data.pingResults;
			this.updateDom();
		}
	},

	getTemplate: function () {
		return `templates/${this.config.templateName}.njk`;
	},

	getTemplateData: function () {
		return {
			config: this.config,
			pingResults: this.pingResults
		};
	}
});
