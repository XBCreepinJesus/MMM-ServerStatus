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
		// Send notification to helper to start sending pings for this group after the initial load delay
		setTimeout(() => {
			this.sendSocketNotification("MMM-SERVERSTATUS_START_PINGS", {
				group: this.config.group,
				hosts: this.config.hosts,
				interval: this.config.pingInterval
			})
		}, this.config.loadDelay * 1000);
	},

	socketNotificationReceived: function (notification, data) {
		// On receiving pings, show the results (if they're for this group)
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
