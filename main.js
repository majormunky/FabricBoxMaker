let grid_size = 30;
let grid_color = "#DDD"
let canvas;
let selected = [];
let line_group = null;

function draw_line_between_objects(o1, o2) {
	// figure out what object is on the left
	let left_obj, right_obj;
	if (o1.get("left") <= o2.get("left")) {
		left_obj = o1;
		right_obj = o2;
	} else {
		left_obj = o2;
		right_obj = o1;
	}

	//console.log(left_obj);

	let point1 = left_obj.getCenterPoint();
	let point2 = right_obj.getCenterPoint();
	let coords = [
		point1.x, 
		point1.y,
		point2.x,
		point2.y
	];

	console.log(coords);

	let line = new fabric.Line(coords, {
		fill: "red",
		stroke: "red",
		strokeWidth: 5,
		selectable: false,
		evented: false,
	});

	canvas.add(line);
}

document.querySelector(".toolbox").addEventListener("input", (event) => {
	console.log("changed")
	if (event.target.matches("#selected-pagerect-title")) {
		if (selected.length == 1) {
			selected[0].set('label', event.target.value);
			canvas.renderAll();
		}
	}
})

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
});

document.getElementById("new-page").addEventListener("click", (event) => {
	let r = new PageRect({
		left: 30,
		top: 30,
		width: 120,
		height: 240,
		fill: "green",
		label: "Page 1",
	});
	r.setControlsVisibility({mtr: false});
	canvas.add(r);
});

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
		console.log("selection:created")
		let target_type = event.target.get("type");
		console.log("Target type: ", target_type);
		if (target_type == "activeSelection") {
			let obj_list = event.target.getObjects();
			if (obj_list.length == 2) {
				// we have 2 items, lets try to draw a line between them
				draw_line_between_objects(obj_list[0], obj_list[1]);
			}
			return;
		} else if (target_type == "pageRect") {
			selected.push(event.target);
			event.target.set("selected", true);
		}
		update_selected_item_box(selected);
	});

	canvas.on('selection:cleared', (event) => {
		console.log("selection:cleared")

		for (var i = 0; i < selected.length; i++) {
			selected[i].set("selected", false);
			selected[i] = null;
		}

		selected = [];
		
		update_selected_item_box(selected);
	});
	
	canvas.on('selection:updated', (event) => {
		console.log(event);
		console.log("selection:updated")
		//selected_item = event.target;
		//update_selected_item_box();
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

	  	update_selected_item_box(selected);
	});

	make_draggable(document.querySelector(".toolbox"));
	resize_canvas();
	draw_grid();
	position_toolbox("top-right");
	update_selected_item_box(selected);
});

document.addEventListener("SelectedItemColorChange", (event) => {
	let new_color = event.detail.new_color;
	selected[0].set("fill", new_color);
	canvas.renderAll();
})

window.addEventListener("resize", resize_canvas);