declare var ldBar: any;
function updateBarValue(increase: number, labelText: string) {
    // const bar = (document.getElementById("loading_bar") as any).ldBar;
    const label = document.getElementById("loading_text");
    // bar.set(increase + bar.value);
    label.innerText = labelText;
}

function initBar() {
    const cube = document.getElementById("cube_spinner_container");
    const container = document.getElementById("loading_container");
    const form = document.getElementById("info_form");
    form.style.display = "none";
    // const loader = document.querySelector(".ldBar");
    // const bar = new ldBar(loader);
    // bar.set(3);
    container.style.display = "inline-block";
    cube.style.display = "inline-block";
    // updateBarValue(0, "Getting Settings");
}
