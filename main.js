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

let grid_size = 30;
let grid_color = "#DDD"
let canvas;
let selected_item = null;
let line_group = null;

document.getElementById("grid-size-input").addEventListener("change", (event) => {
	let new_value = event.target.value;
	let new_value_int = parseInt(new_value, 10);
	if (isNaN(new_value_int)) {
		event.target.value = "";
		return false;
	}

	if ((new_value_int < 10) || ( new_value_int > 100)) {
		event.target.value = "";
		return false;
	}

	grid_size = new_value_int;
	draw_grid();
});

document.getElementById("new-rect").addEventListener("click", (event) => {
	let r = new fabric.Rect({
		left: 30,
		top: 30,
		width: 300,
		height: 300,
		fill: "green"
	});
	r.setControlsVisibility({mtr: false});
	canvas.add(r);
})

document.addEventListener("DOMContentLoaded", (event) => {
	canvas = new fabric.Canvas(document.getElementById("main-canvas"));
	canvas.on('object:moving', function(event) { 
		event.target.set({
	    	left: Math.round(event.target.left / grid_size) * grid_size,
	    	top: Math.round(event.target.top / grid_size) * grid_size
	  	});
	  	event.target.bringToFront();
	});

	canvas.on('selection:created', (event)=> {
		selected_item = event.target;
		update_selected_item_box();
	});

	canvas.on('selection:cleared', (event) => {
		console.log("selection cleared")
		selected_item = null;
		update_selected_item_box();
	})

	canvas.on('object:modified', function(event) {
		let current_width = event.target.get("width") * event.target.get("scaleX");
		let current_height = event.target.get("height") * event.target.get("scaleY");

		current_width = Math.round(current_width / grid_size) * grid_size;
		current_height = Math.round(current_height / grid_size) * grid_size;
		
		event.target.set({
	    	width: Math.max(current_width, grid_size),
	    	height: Math.max(current_height, grid_size),
	    	scaleX: 1.0,
	    	scaleY: 1.0,
	  	});

		event.target.set({
	    	left: Math.round(event.target.left / grid_size) * grid_size,
	    	top: Math.round(event.target.top / grid_size) * grid_size
	  	});

	  	update_selected_item_box();
	});

	make_draggable(document.querySelector(".toolbox"));
	resize_canvas();
	draw_grid();
	position_toolbox("top-right");
	update_selected_item_box();
});

window.addEventListener("resize", resize_canvas);