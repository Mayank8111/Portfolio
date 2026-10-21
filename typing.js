function typeText(element, text, speed = 65) {
    let index = 0;

    element.textContent = "";
    element.classList.add("typing");

    function typeNext() {
        if (index < text.length) {
            element.textContent += text[index];
            index++;

            setTimeout(typeNext, speed);
        } else {
            element.classList.remove("typing");
        }
    }

    typeNext();
}

// Example: start typing when the page loads
window.addEventListener("DOMContentLoaded", () => {
    const heading = document.querySelector("#terminal-heading");

    if (heading) {
        typeText(heading, "WELCOME TO MY SYSTEM", 90);
    }
});

