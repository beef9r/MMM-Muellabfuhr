var NodeHelper = require("node_helper");
var moment = require("moment");
var data = [
	{
		date: "07.07.2017",
		rest: true
	},
	{
		date: "14.07.2017",
		rest: false
	},
	{
		date: "21.07.2017",
		rest: true
	},
	{
		date: "28.07.2017",
		rest: false
	},
	{
		date: "04.08.2017",
		rest: true
	},
	{
		date: "11.08.2017",
		rest: false
	},
	{
		date: "18.08.2017",
		rest: true
	},
	{
		date: "25.08.2017",
		rest: false
	},
	{
		date: "01.09.2017",
		rest: true
	},
	{
		date: "08.09.2017",
		rest: false
	},
	{
		date: "15.09.2017",
		rest: true
	},
	{
		date: "22.09.2017",
		rest: false
	},
	{
		date: "29.09.2017",
		rest: true
	},
	{
		date: "07.10.2017",
		rest: false
	},
	{
		date: "13.10.2017",
		rest: true
	},
	{
		date: "20.10.2017",
		rest: false
	},
	{
		date: "27.10.2017",
		rest: true
	},
	{
		date: "04.11.2017",
		rest: false
	},
	{
		date: "10.11.2017",
		rest: true
	},
	{
		date: "17.11.2017",
		rest: false
	},
	{
		date: "24.11.2017",
		rest: true
	},
	{
		date: "01.12.2017",
		rest: false
	},
	{
		date: "08.12.2017",
		rest: true
	},
	{
		date: "15.12.2017",
		rest: false
	},
	{
		date: "22.12.2017",
		rest: true
	},
	{
		date: "30.12.2017",
		rest: false
	}
];


module.exports = NodeHelper.create({

	start: function () {
		console.log("Starting node_helper for module: " + this.name);

		this.schedule = null;
	},

	socketNotificationReceived: function (notification, payload) {
		var self = this;

		if (this.schedule == null) {
			self.schedule = data;
			self.postProcessSchedule();
			self.getNextPickups(payload);
		}
		else {
			this.getNextPickups(payload);
		}
	},

	postProcessSchedule: function () {

		this.schedule.forEach(function (obj) {
			obj.date = moment(obj.date, "DD.MM.YYYY");
		});
	},

	getNextPickups: function (payload) {
		var start = moment().startOf("day"); //today, 12:00 AM
		var end = moment().startOf("day").add(14, "days");

		var nextPickups = this.schedule.filter(function (obj) {
			return obj.date.isSameOrAfter(start) && obj.date.isBefore(end);
		});

		this.sendSocketNotification('MMM-Muellabfuhr-RESPONSE' + payload.instanceId, nextPickups);

	}

});