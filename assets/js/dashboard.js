window.addEventListener('keydown', () => {
    document.querySelector("#searchbar").focus();
});

document.querySelector("#searchbar").addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        let val = document.querySelector("#searchbar").value;
        if (val != "") {
            if (/^(https?:\/\/)?([\w]+\.)(\.?[\w]{2,})+(\/\S+)?$/.test(val)) {
                location.href = /^https?:\/\//.test(val) ? val : "https://"+val;
            } else {
                location.href = "https://duckduckgo.com/?q=" + encodeURIComponent(val);
            }
        }
    }
})