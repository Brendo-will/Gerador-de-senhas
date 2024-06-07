// Clear the concole on every refresh
console.clear();

const sliderProps = {
    fill: "#0B1EDF",
    background: "rgba(255, 255, 255, 0.214)",
};

const slider = document.querySelector(".range__slider");
const sliderValue = document.querySelector(".length__title");

slider.querySelector("input").addEventListener("input", event => {
    sliderValue.setAttribute("data-length", event.target.value);
    applyFill(event.target);
});

applyFill(slider.querySelector("input"));

function applyFill(slider) {
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;
    slider.style.background = bg;
    sliderValue.setAttribute("data-length", slider.value);
}

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
};

function secureMathRandom() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
    return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
}
function getRandomSymbol() {
    const symbols = '~!@#$%^&*()_+{}":?><;.,';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

const resultEl = document.getElementById("result");
const lengthEl = document.getElementById("slider");
const generateBtn = document.getElementById("generate");
const saveBtn = document.getElementById("save"); // Adicionado botão de salvar

generateBtn.addEventListener("click", () => {
    const length = +lengthEl.value;
    const hasLower = document.getElementById("lowercase").checked;
    const hasUpper = document.getElementById("uppercase").checked;
    const hasNumber = document.getElementById("number").checked;
    const hasSymbol = document.getElementById("symbol").checked;
    const password = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
    resultEl.innerText = password; // A senha é agora diretamente colocada no elemento do resultado
});

function generatePassword(length, lower, upper, number, symbol) {
    let generatedPassword = "";
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
    if (typesCount === 0) {
        return "";
    }
    for (let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    return generatedPassword.slice(0, length).split('').sort(() => Math.random() - 0.5).join('');
}



saveBtn.addEventListener('click', function() {
    const password = resultEl.innerText;
    const usage = document.getElementById("usage").value; 
    if (!password || password === "CLICK GENERATE") {
        alert("Por favor, gere uma senha antes de salvar.");
        return;
    }
    if (!usage) {
        alert("Por favor, informe onde a senha será usada.");
        return;
    }

    // Cria uma nova workbook
    var wb = XLSX.utils.book_new();
    var ws_name = "SheetJS";
    var ws_data = [["Uso", "Senha"], [usage, password]];

    // Aqui criamos a worksheet a partir dos dados
    var ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Agora a variável ws está definida e podemos adicioná-la ao workbook
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, "SenhasGeradas.xlsx");
});