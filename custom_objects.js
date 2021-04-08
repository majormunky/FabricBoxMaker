let PageRect = fabric.util.createClass(fabric.Rect, {
	type: 'pageRect',
	initialize: function(options) {
		options || (options = {});
		this.callSuper("initialize", options);
		this.set("label", options.label || "<missing label>");
		this.set("fill", "white");
		this.set("stroke", "black");
		this.set("hasControls", false);
		this.set("selectedFill", "#ccc");
		this.set("selected", false);
		this.cacheProperties.push("selected", "label");
	},
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			label: this.get("label"),
		});
	},
	_render: function(ctx) {
		this.callSuper("_render", ctx);

		if (this.get("selected") === true) {
			ctx.fillStyle = this.get("selectedFill");
			ctx.fillRect(-this.width / 2, -this.height / 2, this.width, 40);
		}

		ctx.font = "20px Helvetica";
		ctx.fillStyle = "#333";
		ctx.fillText(
			this.label,
			-34,
			-this.height / 2 + 26
		);

		ctx.lineWidth = 1;
		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.moveTo(-this.width / 2, -this.height / 2 + 40);
		ctx.lineTo(this.width / 2, -this.height / 2 + 40);
		ctx.closePath();
		ctx.stroke();
	}
});
