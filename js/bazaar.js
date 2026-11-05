const API = "https://api.hypixel.net/v2/skyblock/bazaar";

const COLUMNS = [
	["product", "Product"],
	["buyPrice", "Buy Price"],
	["sellPrice", "Sell Price"],
	["profit", "Profit"],
	["buyOrders", "Buy Orders"],
	["sellOrders", "Sell Orders"],
	["buyVolume", "Buy Volume"],
	["sellVolume", "Sell Volume"],
	["buyMovingWeek", "Buy Moving Week"],
	["sellMovingWeek", "Sell Moving Week"],
];

const svgArrowUp = `<svg width="10" height="10" class="icon">
	<line x1="5" x2="5" y1="1" y2="9"></line>
	<line x1="5.4" x2="2" y1="0.9" y2="5"></line>
	<line x1="4.6" x2="8" y1="0.9" y2="5"></line>
</svg>`;
 
const svgArrowDown = `<svg width="10" height="10" class="icon">
	<line x1="5" x2="5" y1="1" y2="9"></line>
	<line x1="5.4" x2="2" y1="9.1" y2="5"></line>
	<line x1="4.6" x2="8" y1="9.1" y2="5"></line>
</svg>`;

let controller = null;
let headCells = {};
let tbody = null;
let searchbar = null;

let bazaarData = null;
let searched = "";
let sortCol = "product";
let order = "ASC";

export async function init(container) {
	controller = new AbortController();
	const { signal } = controller;

	bazaarData = null;
	searched = "";
	sortCol = "product";
	order = "ASC";

	tbody = container.querySelector("#tbody");
	searchbar = container.querySelector("#searchbar");
	const search = container.querySelector("#search");

	headCells = {};

	for (const [key] of COLUMNS) {
		const cell = container.querySelector(`#${key}`);
		headCells[key] = cell;
		cell.addEventListener("click", () => setSort(key), { signal });
	}

	search.addEventListener("focus", () => toggleHighlightSearchbar(true), { signal });
	search.addEventListener("blur", () => toggleHighlightSearchbar(false), { signal });

	search.addEventListener("input", (event) => {
		searched = event.target.value;
		render();
	}, { signal });

	await fetchBazaar(signal);

	if (signal.aborted) return;
	render();
}

export function destroy() {
	controller?.abort();
	controller = null;
	headCells = {};
	tbody = null;
	searchbar = null;
	bazaarData = null;
}

function formatText(text) {
	return text.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\S/g, char => char.toUpperCase());
}
 
function setSort(column) {
	if (column === sortCol) {
		if (order === "DSC") {
			sortCol = "product";
			order = "ASC";
		} else {
			order = "DSC";
		}
	} else {
		sortCol = column;
		order = "ASC";
	}
 
	render();
}
 
function toggleHighlightSearchbar(on) {
	searchbar.classList.toggle("highlight", on);
}
 
async function fetchBazaar(signal) {
	try {
		const response = await fetch(API, { signal });
 
		if (!response.ok) {
			throw new Error("API request failed!");
		}
 
		bazaarData = await response.json();
	} catch (error) {
		if (error.name === "AbortError") return;
		console.error(error);
	}
}
 
function searchProducts() {
	const query = searched.toLowerCase().trim();
 
	return Object.entries(bazaarData.products).filter(([key]) =>
		key.toLowerCase().replaceAll("_", " ").includes(query)
	);
}
 
function getValue(key, id, p) {
	const q = p.quick_status;
	if (key === "product") return id;
	if (key === "profit") return q.buyPrice - q.sellPrice;
	return q[key];
}
 
function sortProducts(entries) {
	return entries.sort(([idA, a], [idB, b]) => {
		const valueA = getValue(sortCol, idA, a);
		const valueB = getValue(sortCol, idB, b);
 
		const result = typeof valueA === "string"
			? valueA.localeCompare(valueB)
			: valueA - valueB;
 
		return order === "ASC" ? result : -result;
	});
}
 
function buildTableHead() {
	for (const [key, label] of COLUMNS) {
		const arrow = sortCol === key ? (order === "ASC" ? svgArrowDown : svgArrowUp) : "";
		headCells[key].innerHTML = `<span>${label}</span>${arrow}`;
	}
}
 
function buildTableBody(entries) {
	tbody.innerHTML = entries.map(([productId, p]) => {
		const q = p.quick_status;
		return `<tr>
			<td>${formatText(productId)}</td>
			<td>${q.buyPrice.toFixed(2)}</td>
			<td>${q.sellPrice.toFixed(2)}</td>
			<td>${(q.buyPrice - q.sellPrice).toFixed(2)}</td>
			<td>${q.buyOrders}</td>
			<td>${q.sellOrders}</td>
			<td>${q.buyVolume}</td>
			<td>${q.sellVolume}</td>
			<td>${q.buyMovingWeek}</td>
			<td>${q.sellMovingWeek}</td>
		</tr>`;
	}).join("");
}
 
function render() {
	if (!tbody) return;
 
	buildTableHead();
 
	if (!bazaarData) return;
 
	buildTableBody(sortProducts(searchProducts()));
}