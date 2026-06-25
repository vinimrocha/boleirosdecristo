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
const btnAdicionar = document.getElementById("btnAdicionar");
const contadorSelecionados = document.getElementById("contadorSelecionados");
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
        <label>
            <input type="checkbox" data-index="${index}" ${j.presente ? "checked" : ""}>
            
            <div class="jogador-info">
                <strong>${j.nome}</strong>

                <div class="jogador-meta">
                    ${j.goleiro ? "🥅 Goleiro" : `⭐ ${j.categoria.toFixed(1)}`}
                    ${j.convidado ? `<em class="tag-convidado">convidado</em>` : ""}
                </div>
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

            atualizarContador();

        });

    });

atualizarContador();

}

// =========================
// PEGAR PRESENTES
// =========================

function getPresentes() {

const linhas = jogadores.filter(j => j.presente && !j.goleiro);
const goleiros = jogadores.filter(j => j.presente && j.goleiro);

return { linhas, goleiros };

}

// =========================
// SORTER
// =========================

function sortearTimes(linhas, goleiros, porTime) {

const total = linhas.length + goleiros.length;

// Calcular quantidade de times (arredondar para cima)
const qtdTimes = Math.ceil(total / porTime);

// Verificar se há pelo menos 1 jogador por time
if (qtdTimes < 1) {
    alert("É necessário ter pelo menos 1 jogador para sortear");
    return null;
}

// Se só tem 1 time, verificar se tem jogadores suficientes
if (qtdTimes === 1 && total < 2) {
    alert("É necessário ter pelo menos 2 jogadores para sortear");
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
// GOLEIROS (distribuir igualmente)
// =========================

goleiros.forEach((g, i) => {
    const timeIndex = i % times.length;
    times[timeIndex].jogadores.push(g);
});

// =========================
// LINHAS (BALANCEADO)
// =========================

// Embaralhar e ordenar por categoria
const ordenados = [...linhas]
    .sort(() => Math.random() - 0.5)
    .sort((a, b) => b.categoria - a.categoria);

// Distribuir jogadores balanceadamente
ordenados.forEach(j => {

    // Encontrar times que ainda podem receber jogadores
    const candidatos = times
        .filter(t => t.jogadores.length < porTime)
        .sort((a, b) => a.forca - b.forca);

    if (candidatos.length > 0) {
        candidatos[0].jogadores.push(j);
        candidatos[0].forca += j.categoria;
    } else {
        // Se todos os times já atingiram o limite, adicionar ao time com menor força
        const timeMenorForca = times.reduce((a, b) => a.forca < b.forca ? a : b);
        timeMenorForca.jogadores.push(j);
        timeMenorForca.forca += j.categoria;
    }

});

// Reordenar times para que o time com menos jogadores seja sempre o último (Time 4)
reordenarTimes(times);

return times;

}

// =========================
// REORDENAR TIMES
// =========================

function reordenarTimes(times) {
    // Ordenar por quantidade de jogadores (do maior para o menor)
    times.sort((a, b) => b.jogadores.length - a.jogadores.length);
    
    // Renomear os times
    times.forEach((t, index) => {
        t.nome = `Time ${index + 1}`;
    });
    
    return times;
}

// =========================
// RENDER RESULTADO
// =========================

function renderResultado(times) {

resultadoEl.innerHTML = "";

// Criar container para a imagem
const imagemContainer = document.createElement("div");
imagemContainer.id = "imagemResultado";

// Adicionar cabeçalho
const header = document.createElement("div");
header.className = "resultado-header";
header.innerHTML = `<h1>⚽ Boleiros de Cristo</h1>`;
imagemContainer.appendChild(header);

// Adicionar os times
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

    div.innerHTML = html;
    imagemContainer.appendChild(div);
});

// Adicionar rodapé
const footer = document.createElement("div");
footer.className = "resultado-footer";
const dataAtual = new Date();
const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
footer.innerHTML = `<span>📅 ${dataFormatada}</span>`;
imagemContainer.appendChild(footer);

resultadoEl.appendChild(imagemContainer);

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

btnAdicionar.addEventListener("click", adicionarConvidado);

}

// =========================
// ADICIONAR CONVIDADO
// =========================

function adicionarConvidado() {

    const nome = document.getElementById("convidadoNome").value.trim();
    const tipo = document.getElementById("convidadoTipo").value;
    const categoria = parseFloat(document.getElementById("convidadoCategoria").value);

    if (!nome) {
        alert("Informe o nome do convidado.");
        return;
    }

    jogadores.push({
        nome,
        categoria,
        goleiro: tipo === "goleiro",
        presente: true,
        convidado: true
    });

    document.getElementById("convidadoNome").value = "";

    renderLista();

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

    atualizarContador();

}
// =========================
// CONTADOR
// =========================
function atualizarContador() {

    const total = jogadores.filter(j => j.presente).length;

    contadorSelecionados.textContent =
        `👥 Selecionados: ${total}`;
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