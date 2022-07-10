import convertBdtdToRis from "../../src/ConverterFacade.js"

let form = document.getElementById('formConverter');
form.addEventListener('submit', (e) => {
    e.preventDefault();
});

let openBdtdButton = document.getElementById('openBDTD');
let bdtdTextArea = document.getElementById('BDTDContent');
let risTextArea  = document.getElementById('RisContent');
let downloadButton = document.getElementById("downloadRIS")

openBdtdButton.onchange = async function openBdtdClick(event) {
    bdtdTextArea.value = await loadFileAsText(event.target.files[0]);
    convert();
}

downloadButton.onclick = downloadRIS;

function downloadRIS() {
    saveStringAsText(risTextArea.value, "BDTD exportado.ris")
}

async function loadFileAsText(file) {
    return new Promise( (resolve,reject) => {
        var reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsText(file);
    });
}

async function convert() {
    let input = bdtdTextArea.value;
    let outputStreamCb = line => risTextArea.value += line + '\r\n';
    convertBdtdToRis(input, outputStreamCb);
}

function saveStringAsText(data, filename) {
    var c = document.createElement("a");
    c.download = filename;
    c.href = window.URL.createObjectURL(new Blob([data], {type: "text/plain"}));
    c.click();
}
