const make_draggable = (el) => {
	let pos1 = 0;
	let pos2 = 0;
	let pos3 = 0;
	let pos4 = 0;

	el.querySelector(el.dataset.dragElement).addEventListener(
		"mousedown",
		drag_mouse_down
	);
	
	function close_drag_element(e) {
		document.removeEventListener("mouseup", close_drag_element);
		document.removeEventListener("mousemove", element_drag);
	}

	function element_drag(e) {
		e = e || window.event;
		e.preventDefault();

		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		el.style.top = (el.offsetTop - pos2) + "px";
		el.style.left = (el.offsetLeft - pos1) + "px";
	}

	function drag_mouse_down(e) {
		e = e || window.event;

		e.preventDefault();

		pos3 = e.clientX;
		pos4 = e.clientY;
		document.addEventListener("mouseup", close_drag_element);
		document.addEventListener("mousemove", element_drag);
	}
}
