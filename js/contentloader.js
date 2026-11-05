const content = document.getElementById("content");
const homeBtin = document.getElementById("homeBtn");

const homeurl = "dynamicContent/home.html";

const savedDynamicContent = localStorage.getItem("dynamicContent");

let currentPage = null;
let loadId = 0;

async function loadContent(src, modulePath) {
	const thisLoad = ++loadId;

	currentPage?.destroy?.();
	currentPage = null;

	try {
		const response = await fetch(src);

		if (!response.ok) {
			throw new Error("Datei konnte nicht geladen werden");
		}

		const html = await response.text();

		if (thisLoad !== loadId) return;

		content.innerHTML = html;

		if (modulePath) {
			const module = await import(modulePath);

			if (thisLoad !== loadId) return;

			currentPage = module;
			await module.init?.(content);
		}

		localStorage.setItem("dynamicContent", src);

		document.querySelectorAll("button[data-ref]").forEach(btn => {
			btn.classList.toggle("active", btn.dataset.ref === src && btn !== homeBtn);
		});
	} catch(error) {
		console.error(error);
		
		if (thisLoad !== loadId) return;

		if (src !== homeurl) {
			loadContent(homeurl);
		} else {
				content.innerHTML = "<p>Error while loading this page.</p>";
		}
	}
}

document.addEventListener("click", (event) => {
	const btn = event.target.closest("button[data-ref]");
	if (!btn) return;

	loadContent(btn.dataset.ref, btn.dataset.module);
});

const startSrc = savedDynamicContent || homeUrl;
const startBtn = document.querySelector(`button[data-ref="${startSrc}"]`);

loadContent(startSrc, startBtn?.dataset.module);