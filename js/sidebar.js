const sidebar = document.getElementById("sidebar");
const sidebarMinimized = document.getElementById("sidebar-minimized");
const resizer = document.getElementById("resizer");
const collapseSidebar = document.getElementById("collapseSidebar");
const openSidebar = document.getElementById("openSidebar");

const minWidth = 200;
const maxWidthDecimal = 0.5;

const collapseAt = 100;

const savedCollapsedState = localStorage.getItem("sidebarCollapsed") === "true";

const savedSidebarWidth = Number(localStorage.getItem("sidebarWidth"));

let isDragging = false;

function setCollapsed(collapsed) {
	sidebar.classList.toggle("hidden", collapsed);
	sidebarMinimized.classList.toggle("hidden", !collapsed);

	localStorage.setItem("sidebarCollapsed", collapsed);
};

function setSidebarWidth(width) {
	sidebar.style.width = width + "px";
}

collapseSidebar.addEventListener("click", () => {
	setCollapsed(true);
});

openSidebar.addEventListener("click", () => {
	setCollapsed(false);
});

resizer.addEventListener("mousedown", (event) => {
	isDragging = true;
});

window.addEventListener("mouseup", (event) => {
	isDragging = false;
});

window.addEventListener("mousecancel", (event) => {
	isDragging = false;
});

window.addEventListener("mousemove", (event) => {
	if (!isDragging) return;

	const mouseX = event.clientX;

	const width = window.innerWidth;

	const maxWidth = width * maxWidthDecimal;

	if (mouseX < collapseAt) {
		setCollapsed(true);
		return;
	}

	if (mouseX > collapseAt) {
		setCollapsed(false);
	}

	const currentWidth =  Math.max(minWidth, Math.min(mouseX, maxWidth));

	localStorage.setItem("sidebarWidth", currentWidth);

	setSidebarWidth(currentWidth);
});

setCollapsed(savedCollapsedState);

setSidebarWidth(savedSidebarWidth);