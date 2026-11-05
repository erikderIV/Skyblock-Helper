const api = "https://api.hypixel.net/v2/skyblock/bazaar";
const thead = document.getElementById("thead");

const product = document.getElementById("product");
const buyPrice = document.getElementById("buyPrice");
const sellPrice = document.getElementById("sellPrice");
const profit = document.getElementById("profit");
const buyOrders = document.getElementById("buyOrders");
const sellOrders = document.getElementById("sellOrders");
const buyVolume = document.getElementById("buyVolume");
const sellVolume = document.getElementById("sellVolume");
const buyMovingWeek = document.getElementById("buyMovingWeek");
const sellMovingWeek = document.getElementById("sellMovingWeek");

const tbody = document.getElementById("tbody");
const search = document.getElementById("search");
const searchbar = document.getElementById("searchbar");

let bazaarData;
let searchedProducts;
let sortedProducts;

let searched = "";

let sortCol = "product";
let order = "ASC";

const svgArrowUp = `<svg width="10" height="10" class=" icon">
						<line x1="5" x2="5" y1="1" y2="9"></line>
						<line x1="5.4" x2="2" y1="0.9" y2="5"></line>
						<line x1="4.6" x2="8" y1="0.9" y2="5"></line>
					</svg>`;

const svgArrowDown = `<svg width="10" height="10" class=" icon">
							<line x1="5" x2="5" y1="1" y2="9"></line>
							<line x1="5.4" x2="2" y1="9.1" y2="5"></line>
							<line x1="4.6" x2="8" y1="9.1" y2="5"></line>
					</svg>`;

search.addEventListener("focus", () => toggleHighlightSearchbar(true));
search.addEventListener("blur", () => toggleHighlightSearchbar(false));
search.addEventListener("input", (event) => {
	searched = event.target.value;
	render();
});

product.addEventListener("click", () => setSort("product"));
buyPrice.addEventListener("click", () => setSort("buyPrice"));
sellPrice.addEventListener("click", () => setSort("sellPrice"));
profit.addEventListener("click", () => setSort("profit"));
buyOrders.addEventListener("click", () => setSort("buyOrders"));
sellOrders.addEventListener("click", () => setSort("sellOrders"));
buyVolume.addEventListener("click", () => setSort("buyVolume"));
sellVolume.addEventListener("click", () => setSort("sellVolume"));
buyMovingWeek.addEventListener("click", () => setSort("buyMovingWeek"));
sellMovingWeek.addEventListener("click", () => setSort("sellMovingWeek"));

function formatText(text) {
	return text.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\S/g, char => char.toUpperCase());
}

function setSort(column) {
	if (column === sortCol) {
		if (order === "DSC") {
			sortCol = "product";
			order = "ASC";
		}
		else {
			sortCol = column;
			order = "DSC";
		}
	}
	else {
		sortCol = column;
		order = "ASC";
	}

	render();
}

function toggleHighlightSearchbar(on) {
	searchbar.classList.toggle("highlight", on);
}

async function fetchBazaar() {
	try {
		const response = await fetch(api);

		if (!response.ok) {
			throw new Error("API request failed!");
		}

		bazaarData = await response.json();
		console.log(bazaarData);
	} catch(error) {
		console.error(error);
	}
}

function searchProducts() {
	const products = bazaarData.products;

	return Object.fromEntries(Object.entries(products).filter(([key]) => key.toLowerCase().replaceAll("_", " ").includes(searched.toLowerCase().trim())));
}

function sortProducts() {
	const products = searchedProducts;

	return Object.entries(products).sort(([keyA, a], [keyB,b]) => {
		let valueA;
		let valueB;

		switch (sortCol) {
		case "product":
			valueA = keyA;
			valueB = keyB;
			break;

		case "buyPrice":
			valueA = a.quick_status.buyPrice;
			valueB = b.quick_status.buyPrice;
			break;

		case "sellPrice":
			valueA = a.quick_status.sellPrice;
			valueB = b.quick_status.sellPrice;
			break;

		case "profit":
			valueA = a.quick_status.buyPrice - a.quick_status.sellPrice;
			valueB = b.quick_status.buyPrice - b.quick_status.sellPrice;
			break;

		case "buyOrders":
			valueA = a.quick_status.buyOrders;
			valueB = b.quick_status.buyOrders;
			break;

		case "sellOrders":
			valueA = a.quick_status.sellOrders;
			valueB = b.quick_status.sellOrders;
			break;

		case "buyVolume":
			valueA = a.quick_status.buyVolume;
			valueB = b.quick_status.buyVolume;
			break;

		case "sellVolume":
			valueA = a.quick_status.sellVolume;
			valueB = b.quick_status.sellVolume;
			break;

		case "buyMovingWeek":
			valueA = a.quick_status.buyMovingWeek;
			valueB = b.quick_status.buyMovingWeek;
			break;

		case "sellMovingWeek":
			valueA = a.quick_status.sellMovingWeek;
			valueB = b.quick_status.sellMovingWeek;
			break;

		default:
			return 0;
		}

		let result = typeof valueA === "string" ? valueA.localeCompare(valueB) : valueA - valueB;

		return order === "ASC" ? result : -result;
	});
}

function buildTableHead() {
	product.innerHTML = `<span>Product</span>${sortCol === "product" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
	buyPrice.innerHTML = `<span>Buy Price</span>${sortCol === "buyPrice" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
	sellPrice.innerHTML = `<span>Sell Price</span>${sortCol === "sellPrice" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
	profit.innerHTML = `<span>Profit</span>${sortCol === "profit" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
	buyOrders.innerHTML = `<span>Buy Orders</span>${sortCol === "buyOrders" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
	sellOrders.innerHTML = `<span>Sell Orders</span>${sortCol === "sellOrders" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
	buyVolume.innerHTML = `<span>Buy Volume</span>${sortCol === "buyVolume" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
	sellVolume.innerHTML = `<span>Sell Volume</span>${sortCol === "sellVolume" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
	buyMovingWeek.innerHTML = `<span>Buy Moving Week</span>${sortCol === "buyMovingWeek" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
	sellMovingWeek.innerHTML = `<span>Sell Moving Week</span>${sortCol === "sellMovingWeek" ? (order === "ASC" ? svgArrowDown : svgArrowUp) : ""}`;
}

function buildTableBody() {
	const rows = [];
	for (const [productId, product] of sortedProducts) {
		const q = product.quick_status;
		rows.push(`<tr>
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
		          </tr>`);
	}
	tbody.innerHTML = rows.join("");
}

async function init() {
	await fetchBazaar();
	render();
};

function render() {
	searchedProducts = searchProducts();
	sortedProducts = sortProducts();
	buildTableHead();
	buildTableBody();
}

init();