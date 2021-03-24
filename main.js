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
	draw_grid();
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

function to_title_case(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function update_selected_item_box() {
	let item_colors = ["red", "blue", "green", "yellow"];
	let el = document.getElementById("selected-item-info");
	if (selected_item) {
		document.getElementById("selected-item-x").innerHTML = selected_item.get("left");
		document.getElementById("selected-item-y").innerHTML = selected_item.get("top");
		document.getElementById("selected-item-width").innerHTML = selected_item.get("width");
		document.getElementById("selected-item-height").innerHTML = selected_item.get("height");
		
		let select_output = "<select id='selected-item-color-select'>";
		let current_color = selected_item.get("fill");
		for (var i = 0; i < item_colors.length; i++) {
			let c = item_colors[i];
			if (current_color == c) {
				select_output += `<option value='${c}' selected='selected'>${to_title_case(c)}</option>`;
			} else {
				select_output += `<option value='${c}'>${to_title_case(c)}</option>`;
			}

		}
		select_output += "</select>";
		
		document.getElementById("selected-item-color").innerHTML = select_output;
		
		document.getElementById("selected-item-info").style.display = "block";
		document.getElementById("selected-no-item-info").style.display = "none";
		
		document.getElementById("selected-item-color-select").addEventListener("change", (event) => {
			let new_color = event.target.value;
			selected_item.set("fill", new_color);
			canvas.renderAll();
		});
	} else {
		document.getElementById("selected-item-info").style.display = "none";
		document.getElementById("selected-no-item-info").style.display = "block";
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
	});
	
	canvas.on('selection:updated', (event) => {
		selected_item = event.target;
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