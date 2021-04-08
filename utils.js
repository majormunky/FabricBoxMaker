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

function draw_selected_item_rect(selected_item) {
	let item_template = document.getElementById("selected-item-template");
	let item = item_template.content.firstElementChild.cloneNode(true);

	item.querySelector("#selected-item-x").innerHTML = selected_item.get("left");
	item.querySelector("#selected-item-y").innerHTML = selected_item.get("top");
	item.querySelector("#selected-item-width").innerHTML = selected_item.get("width");
	item.querySelector("#selected-item-height").innerHTML = selected_item.get("height");
	
	let item_colors = ["red", "blue", "green", "yellow"];
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
	
	item.querySelector("#selected-item-color").innerHTML = select_output;
	
	let info_el = document.getElementById("selected-item-info");
	info_el.appendChild(item);
	info_el.style.display = "block";
	document.getElementById("selected-no-item-info").style.display = "none";
	
	document.getElementById("selected-item-color-select").addEventListener("change", (event) => {
		let new_event = new CustomEvent("SelectedItemColorChange", {detail: {new_color: event.target.value}})
		document.dispatchEvent(new_event);
	});
}


function draw_selected_item_pagerect(selected_item) {
	let item_template = document.getElementById("selected-pagerect-template");
	let item = item_template.content.firstElementChild.cloneNode(true);

	item.querySelector("#selected-pagerect-title").value = selected_item.get("label");

	let info_el = document.getElementById("selected-item-info");
	info_el.appendChild(item);
	info_el.style.display = "block";
	document.getElementById("selected-no-item-info").style.display = "none";

	
}


function update_selected_item_box(selected_item) {
	let el = document.getElementById("selected-item-info");
	el.innerHTML = "";
	if (selected_item) {
		if (selected_item.get("type") == "rect") {
			draw_selected_item_rect(selected_item);
		} else if (selected_item.get("type") == "pageRect") {
			console.log("Page Clicked")
			draw_selected_item_pagerect(selected_item);
		}
	} else {
		document.getElementById("selected-item-info").style.display = "none";
		document.getElementById("selected-no-item-info").style.display = "block";
	}
}
