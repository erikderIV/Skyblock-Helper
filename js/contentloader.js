const content = document.getElementById("content");
const homeBtn = document.getElementById("homeBtn");

const homeurl = "dynamicContent/home.html";

const savedDynamicContent = localStorage.getItem("dynamicContent");

async function loadContent(src) {
    try {
        const response = await fetch(src);

        if (!response.ok) {
            throw new Error("Datei konnte nicht geladen werden");
        }

        const html = await response.text();
        content.innerHTML = html;

        localStorage.setItem("dynamicContent", src);

        document.querySelectorAll("button[data-ref]").forEach(btn => {
            btn.classList.remove("active");

            if (btn.dataset.ref === src) {
                btn.classList.add("active");
            }
        });

    } catch (error) {
        console.error(error);

        loadContent(homeurl);
    }
}

document.querySelectorAll("button[data-ref]").forEach(button => {
    button.addEventListener("click", function() {
        const ref = this.dataset.ref;
        loadContent(ref);        
    });
});

loadContent(savedDynamicContent);
