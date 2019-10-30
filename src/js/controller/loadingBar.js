function updateLoadingText(labelText) {
    var label = document.getElementById("loading_text");
    label.innerText = labelText;
}
function initCube() {
    var cube = document.getElementById("cube_spinner_container");
    var container = document.getElementById("loading_container");
    var form = document.getElementById("info_form");
    form.style.display = "none";
    container.style.display = "inline";
    var label = document.getElementById("loading_text");
    label.style.display = "inline";
    cube.style.display = "inline-block";
    updateLoadingText("Getting Settings");
}
//# sourceMappingURL=loadingBar.js.map