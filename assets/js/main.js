document.getElementById("projets").onclick = function () {
    Array.from(document.getElementsByClassName("projetsInner")).forEach(element => {
        if (element.style.display !== "inline-block")
            element.style.display = "inline-block";
        else
            element.style.display = "none";
    });
};

document.getElementById("cv").onclick = function () {
    Array.from(document.getElementsByClassName("cvInner")).forEach(element => {
        if (element.style.display !== "inline-block")
            element.style.display = "inline-block";
        else
            element.style.display = "none";
    });
};

document.getElementById("contact").onclick = function () {
    Array.from(document.getElementsByClassName("contactInner")).forEach(element => {
        if (element.style.display !== "inline-block")
            element.style.display = "inline-block";
        else
            element.style.display = "none";
    });
};

document.getElementById("flagLocale").onclick = function () {
    Array.from(document.getElementsByClassName("locale")).forEach(e => {
        if (e.style.display !== "none")
            e.style.display = "none";
        else
            e.style.display = "inline-block";
    });
    Array.from(document.getElementsByClassName("flag")).forEach(e => {
        if (e.style.display !== "none")
            e.style.display = "none";
        else
            e.style.display = "inline-block";
    });
}

Array.from(document.getElementsByClassName("eng")).forEach(e => {
    e.style.display = "none";
});
document.getElementById("fraFlag").style.display = "none";

window.onload = webGLCanvas;