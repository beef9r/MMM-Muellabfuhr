Module.register('MMM-Muellabfuhr', {

	getStyles: function () {
		return ["MMM-Muellabfuhr.css"];
	},

	start: function () {
		Log.info('Starting module: ' + this.name);

		this.nextPickups = [];

		this.getPickups();

		this.timer = null;

	},

	getPickups: function () {

		clearTimeout(this.timer);
		this.timer = null;

		this.sendSocketNotification("MMM-Muellabfuhr-GET", {
			instanceId: this.identifier
		});

		//set alarm to check again tomorrow
		var self = this;
		this.timer = setTimeout(function () {
			self.getPickups();
		}, 60 * 60 * 1000); //update once an hour
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-Muellabfuhr-RESPONSE" + this.identifier && payload.length > 0) {
			this.nextPickups = payload;
			this.updateDom(1000);
		}
	},

	svgIconFactory: function (glyph) {

		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttributeNS(null, "class", "waste-pickup-icon " + glyph);
		var use = document.createElementNS('http://www.w3.org/2000/svg', "use");
		use.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.file("icon_sprite.svg#") + glyph);
		svg.appendChild(use);

		return (svg);
	},

	getDom: function () {
		var wrapper = document.createElement("div");

		if (this.nextPickups.length == 0) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var self = this;

		this.nextPickups.forEach(function (pickup) {

			var pickupContainer = document.createElement("div");
			pickupContainer.classList.add("pickup-container");

			//add pickup date
			var dateContainer = document.createElement("span");
			dateContainer.classList.add("pickup-date");

			//determine how close pickup day is and formats accordingly.
			var today = moment().startOf("day");
			var pickUpDate = moment(pickup.date);
			if (today.isSame(pickUpDate)) {
				dateContainer.innerHTML = "Heute";
			} else if (moment(today).add(1, "days").isSame(pickUpDate)) {
				dateContainer.innerHTML = "Morgen";
			} else if (moment(today).add(7, "days").isAfter(pickUpDate)) {
				dateContainer.innerHTML = pickUpDate.format("dddd");
			} else {
				dateContainer.innerHTML = pickUpDate.format("D. MMMM");
			}

			pickupContainer.appendChild(dateContainer);

			//add icons
			var iconContainer = document.createElement("span");
			iconContainer.classList.add("waste-pickup-icon-container");

			if (pickup.rest) {
				iconContainer.appendChild(self.svgIconFactory("compost"));
				iconContainer.appendChild(self.svgIconFactory("garbage"));
				iconContainer.appendChild(self.svgIconFactory("recycle"));
				iconContainer.appendChild(self.svgIconFactory("yard_waste"));
			} else {
				iconContainer.appendChild(self.svgIconFactory("recycle"));
				iconContainer.appendChild(self.svgIconFactory("yard_waste"));
			}

			pickupContainer.appendChild(iconContainer);

			wrapper.appendChild(pickupContainer);

		});

		return wrapper;
	}

});