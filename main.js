function get_window_size() {
	return {
		width: window.innerWidth,
		height: window.innerHeight
	}
}

function position_toolbox(pos_name) {
	let toolbox = document.querySelector(".toolbox");
	let dimensions = get_window_size();
	let toolbar_x = dimensions.width - toolbox.clientWidth - 20;
	if (pos_name == "top-right") {
		toolbox.style.top = "20px";
		toolbox.style.left = toolbar_x + "px";
	}
}

function resize_canvas() {
	console.log("Resizing Canvas");
	let dimensions = get_window_size();
	canvas.setWidth(dimensions.width);
	canvas.setHeight(dimensions.height);
}

function draw_grid() {
	if (line_group) {
		canvas.remove(line_group);
		line_group = null;
	}

	let dimensions = get_window_size();
	let new_line;
	let lines = [];

	for (var i = 0; i < dimensions.width; i += grid_size) {
		new_line = new fabric.Line(
			[i, 0, i, dimensions.height],
			{stroke: grid_color, strokeWidth: 1}
		);
		lines.push(new_line);
	}

	for (var i = 0; i < dimensions.height; i += grid_size) {
		new_line = new fabric.Line(
			[0, i, dimensions.width, i],
			{stroke: grid_color, strokeWidth: 1}
		);
		lines.push(new_line);
	}
	line_group = new fabric.Group(
		lines, 
		{left: 0, top: 0, selectable: false, hoverCursor: "default"}
	);

	canvas.add(line_group);
	line_group.sendToBack();
	canvas.renderAll();
}

function update_selected_item_box() {
	let el = document.getElementById("selected-item-info");
	if (selected_item) {
		let output = `<p>x: ${selected_item.get("left")}</p>`;
		output += `<p>y: ${selected_item.get("top")}</p>`;
		output += `<p>width: ${selected_item.get("width")}`;
		output += `<p>height: ${selected_item.get("height")}`;
		el.innerHTML = output;
	} else {
		el.innerHTML = "<p>No Selected Item</p>";
	}
}