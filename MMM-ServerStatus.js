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
		// Schedule first ping(s)
		setTimeout(() => {
			this.getPings();
		}, this.config.loadDelay * 1000);
	},

	getPings() {
		this.sendSocket
		// Send notification and config to request pings from node helper
		this.sendSocketNotification("MMM-SERVERSTATUS_GET_PINGS", {
			group: this.config.group,
			hosts: this.config.hosts,
		})

		// Schedule next update
		setTimeout(() => {
			this.getPings();
		}, this.config.pingInterval * 1000);
	},

	socketNotificationReceived: function (notification, data) {
		// On receiving pings, show the results (if they're for this group)
		if (notification === "MMM-SERVERSTATUS_PINGS_" + this.config.group) {
			this.pingResults = data.pingResults;

			// Refresh module display
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
