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

        const scripts = content.querySelectorAll("script");

        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");

            [...oldScript.attributes].forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            newScript.textContent = oldScript.textContent;

            oldScript.replaceWith(newScript);
        });

        localStorage.setItem("dynamicContent", src);

        document.querySelectorAll("button[data-ref]").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.ref === src && btn !== homeBtn);
        });

    } catch (error) {
        console.error(error);

        if (src !== homeurl) {
            loadContent(homeurl);
        } else {
            content.innerHTML = "<p>Content konnte nicht geladen werden.</p>";
        }
    }
}


document.querySelectorAll("button[data-ref]").forEach(button => {
    button.addEventListener("click", function() {
        const ref = this.dataset.ref;
        loadContent(ref);        
    });
});

loadContent(savedDynamicContent || homeurl);
