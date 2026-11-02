const content = document.getElementById("content");
const homeBtn = document.getElementById("homeBtn");

const homeurl = "dynamicContent/home.html";

async function loadContent(src) {
    try {
        const response = await fetch(src);

        if (!response.ok) {
            throw new Error("Datei konnte nicht geladen werden");
        }

        const html = await response.text();
        content.innerHTML = html;

    } catch (error) {
        console.error(error);
    }
}

document.querySelectorAll("button[data-ref]").forEach(button => {
    button.addEventListener("click", function() {
        const ref = this.dataset.ref;
        loadContent(ref);

        document.querySelectorAll("button[data-ref]").forEach(btn => {
            btn.classList.remove("active");
        });

        if (this !== homeBtn) {
            this.classList.add("active");
        }
    });
});

loadContent(homeurl);
