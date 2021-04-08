let grid_size = 30;
let grid_color = "#DDD"
let canvas;
let selected_item = null;
let line_group = null;

document.querySelector(".toolbox").addEventListener("input", (event) => {
	console.log("changed")
	if (event.target.matches("#selected-pagerect-title")) {
		selected_item.set('label', event.target.value);
		canvas.renderAll();
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
		selected_item = event.target;
		selected_item.set("selected", true);
		update_selected_item_box(selected_item);
	});

	canvas.on('selection:cleared', (event) => {
		console.log("selection cleared")
		selected_item.set("selected", false);
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

document.addEventListener("SelectedItemColorChange", (event) => {
	let new_color = event.detail.new_color;
	selected_item.set("fill", new_color);
	canvas.renderAll();
})

window.addEventListener("resize", resize_canvas);