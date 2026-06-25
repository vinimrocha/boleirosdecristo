/**

* BOLEIROS DE CRISTO
* app.js
  */

// =========================
// ESTADO GLOBAL
// =========================

let jogadores = [];
let convidados = [];
let presentes = [];

// =========================
// ELEMENTOS
// =========================

const listaEl = document.getElementById("listaJogadores");
const btnSortear = document.getElementById("btnSortear");
const btnResortear = document.getElementById("btnResortear");
const btnCompartilhar = document.getElementById("btnCompartilhar");
const btnDesmarcar = document.getElementById("btnDesmarcar");

const resultadoEl = document.getElementById("resultado");

// =========================
// INICIALIZAÇÃO
// =========================

document.addEventListener("DOMContentLoaded", () => {
carregarJogadoresFixos();
renderLista();
bindEventos();
});

// =========================
// LISTA FIXA (vem do jogadores.js)
// =========================

function carregarJogadoresFixos() {
jogadores = jogadoresFixos.map(j => ({
...j,
presente: false
}));
}

// =========================
// RENDER LISTA
// =========================

function renderLista() {


listaEl.innerHTML = "";

jogadores.forEach((j, index) => {

    const div = document.createElement("div");
    div.className = "jogador";

    div.innerHTML = `
        <label style="display:flex;gap:10px;align-items:center;">
            <input type="checkbox" data-index="${index}">
            <div>
                <strong>${j.nome}</strong><br>
                <small>
                    ${j.goleiro ? "🥅 Goleiro" : `⭐ ${j.categoria}`}
                </small>
            </div>
        </label>
    `;

    listaEl.appendChild(div);
});

document.querySelectorAll("input[type=checkbox]")
    .forEach(cb => {

        cb.addEventListener("change", (e) => {

            const i = e.target.dataset.index;
            jogadores[i].presente = e.target.checked;

        });

    });


}

// =========================
// PEGAR PRESENTES
// =========================

function getPresentes() {


const linhas = jogadores.filter(j =>
    j.presente && !j.goleiro
);

const goleiros = jogadores.filter(j =>
    j.presente && j.goleiro
);

const convidadosLinhas = convidados.filter(c =>
    !c.goleiro
);

const convidadosGoleiros = convidados.filter(c =>
    c.goleiro
);

return {
    linhas: [...linhas, ...convidadosLinhas],
    goleiros: [...goleiros, ...convidadosGoleiros]
};


}

// =========================
// SORTER
// =========================

function sortearTimes(linhas, goleiros, porTime) {


const total = linhas.length + goleiros.length;

const qtdTimes = total / porTime;

if (!Number.isInteger(qtdTimes)) {
    alert("Quantidade inválida para jogadores por time");
    return null;
}

const times = [];

for (let i = 0; i < qtdTimes; i++) {
    times.push({
        nome: `Time ${i + 1}`,
        jogadores: [],
        forca: 0
    });
}

// =========================
// GOLEIROS
// =========================

goleiros.forEach((g, i) => {

    if (i < times.length) {
        times[i].jogadores.push(g);
    }

});

// =========================
// LINHAS (BALANCEADO)
// =========================

const ordenados = [...linhas]
    .sort(() => Math.random() - 0.5)
    .sort((a, b) => b.categoria - a.categoria);

ordenados.forEach(j => {

    const candidatos = times
        .filter(t =>
            t.jogadores.length < porTime
        )
        .sort((a, b) =>
            a.forca - b.forca
        );

    candidatos[0].jogadores.push(j);
    candidatos[0].forca += j.categoria;

});

return times;


}

// =========================
// RENDER RESULTADO
// =========================

function renderResultado(times) {


resultadoEl.innerHTML = "";

times.forEach(t => {

    const div = document.createElement("div");
    div.className = "time";

    let html = `<h3>⚽ ${t.nome}</h3>`;

    t.jogadores.forEach(j => {

        if (j.goleiro) {
            html += `<div class="goleiro">🥅 ${j.nome}</div>`;
        } else {
            html += `<div>${j.nome}</div>`;
        }

    });

    html += `<hr><small>Força: ${t.forca.toFixed(1)}</small>`;

    div.innerHTML = html;

    resultadoEl.appendChild(div);
});


}

// =========================
// PEGAR CONFIG
// =========================

function getPorTime() {


const el = document.querySelector(
    'input[name="jogadoresPorTime"]:checked'
);

return Number(el.value);


}

// =========================
// SORTEAR
// =========================

function realizarSorteio() {


const { linhas, goleiros } = getPresentes();

const porTime = getPorTime();

const times = sortearTimes(linhas, goleiros, porTime);

if (!times) return;

renderResultado(times);

btnResortear.style.display = "block";
btnCompartilhar.style.display = "block";

window.timesAtuais = times;


}

// =========================
// EVENTOS
// =========================


function bindEventos() {


btnSortear.addEventListener("click", realizarSorteio);

btnResortear.addEventListener("click", realizarSorteio);

btnCompartilhar.addEventListener("click", compartilharImagem);

btnDesmarcar.addEventListener("click", desmarcarTodos);


}

// =========================
// DESMARCAR
// =========================

function desmarcarTodos() {

    jogadores.forEach(j => {
        j.presente = false;
    });

    document.querySelectorAll("input[type=checkbox]")
        .forEach(cb => cb.checked = false);

}

// =========================
// COMPARTILHAR IMAGEM
// =========================

async function compartilharImagem() {


const el = document.getElementById("resultado");

const canvas = await html2canvas(el);

canvas.toBlob(async blob => {

    const file = new File(
        [blob],
        "times.png",
        { type: "image/png" }
    );

    if (navigator.share) {

        await navigator.share({
            title: "Boleiros de Cristo",
            text: "Times da pelada",
            files: [file]
        });

    } else {

        alert("Compartilhamento não suportado neste dispositivo.");

    }

});


}
