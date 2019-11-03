declare var ldBar: any;
function updateLoadingText(labelText: string) {
    const label = document.getElementById("loading_text");
    label.innerText = labelText;
}

function initCube() {
    const cube = document.getElementById("cube_spinner_container");
    const container = document.getElementById("loading_container");
    const form = document.getElementById("info_form");
    form.style.display = "none";
    container.style.display = "inline";
    const label = document.getElementById("loading_text");
    label.style.display = "inline";
    cube.style.display = "inline-block";
    updateLoadingText("Getting Settings");
}
