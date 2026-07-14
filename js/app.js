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

        const label = document.createElement("label");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.index = index;
        
        // FORÇA o estado visual usando setAttribute
        if (j.presente) {
            checkbox.setAttribute('checked', 'checked');
        } else {
            checkbox.removeAttribute('checked');
        }
        // Também define a propriedade
        checkbox.checked = j.presente;
        
        const infoDiv = document.createElement("div");
        infoDiv.className = "jogador-info";
        
        const strong = document.createElement("strong");
        strong.textContent = j.nome;
        
        const metaDiv = document.createElement("div");
        metaDiv.className = "jogador-meta";
        
        if (j.goleiro) {
            metaDiv.textContent = "🥅 Goleiro";
        } else {
            metaDiv.textContent = `⭐ ${j.categoria.toFixed(1)}`;
        }
        
        if (j.menina) {
            const meninaSpan = document.createElement("em");
            meninaSpan.className = "tag-menina";
            meninaSpan.textContent = " menina";
            metaDiv.appendChild(meninaSpan);
        }
        
        if (j.convidado) {
            const convidadoSpan = document.createElement("em");
            convidadoSpan.className = "tag-convidado";
            convidadoSpan.textContent = " convidado";
            metaDiv.appendChild(convidadoSpan);
        }
        
        infoDiv.appendChild(strong);
        infoDiv.appendChild(metaDiv);
        label.appendChild(checkbox);
        label.appendChild(infoDiv);
        div.appendChild(label);
        listaEl.appendChild(div);
        
        // DEBUG: verificar se o checkbox foi marcado
        console.log(`${j.nome}: presente=${j.presente}, checkbox.checked=${checkbox.checked}, hasAttribute='${checkbox.hasAttribute('checked')}'`);
        
        checkbox.addEventListener("change", function(e) {
            const idx = parseInt(this.dataset.index);
            jogadores[idx].presente = this.checked;
            
            // Sincroniza o atributo com o estado
            if (this.checked) {
                this.setAttribute('checked', 'checked');
            } else {
                this.removeAttribute('checked');
            }
            
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

function timeComMenina(time) {
    return time.jogadores.some(j => j.menina);
}

function candidatosParaJogador(times, jogador, porTime) {
    return times
        .filter(t => {
            if (jogador.menina && timeComMenina(t)) return false;
            return t.jogadores.length < porTime;
        })
        .sort((a, b) => a.forca - b.forca);
}

function candidatosOverflow(times, jogador) {
    return times
        .filter(t => !jogador.menina || !timeComMenina(t))
        .sort((a, b) => a.forca - b.forca);
}

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

const meninasPresentes = linhas.filter(j => j.menina);
if (meninasPresentes.length > qtdTimes) {
    alert(
        `Há ${meninasPresentes.length} meninas presentes, mas só ${qtdTimes} time(s). ` +
        "Não é possível colocá-las em times separados."
    );
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
for (const j of ordenados) {

    const candidatos = candidatosParaJogador(times, j, porTime);

    if (candidatos.length > 0) {
        candidatos[0].jogadores.push(j);
        candidatos[0].forca += j.categoria;
        continue;
    }

    const overflow = candidatosOverflow(times, j);

    if (overflow.length === 0) {
        alert(
            `Não foi possível separar ${j.nome} das outras meninas em times diferentes.`
        );
        return null;
    }

    overflow[0].jogadores.push(j);
    overflow[0].forca += j.categoria;

}

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
header.innerHTML = `
    <img
        src="logo-boleiros.png"
        alt="Boleiros de Cristo"
        class="resultado-logo"
        width="56"
        height="56">
    <div class="resultado-header-text">
        <h1>Boleiros de Cristo</h1>
    </div>
`;
imagemContainer.appendChild(header);

// Adicionar os times em grid 2x2
const grid = document.createElement("div");
grid.className = "times-grid";
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
    grid.appendChild(div);
});
imagemContainer.appendChild(grid);

// Adicionar rodapé com logo
const footer = document.createElement("div");
footer.className = "resultado-footer";
const dataAtual = new Date();
const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
footer.innerHTML = `<span>${dataFormatada}</span>`;
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

document.getElementById("resultadoContainer")
    .scrollIntoView({ behavior: "smooth", block: "start" });

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

    const menina = document.getElementById("convidadoMenina").checked;

    jogadores.push({
        nome,
        categoria,
        goleiro: tipo === "goleiro",
        presente: true,
        convidado: true,
        menina
    });

    document.getElementById("convidadoNome").value = "";
    document.getElementById("convidadoMenina").checked = false;

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
        `${total} selecionado${total !== 1 ? "s" : ""}`;
}

// =========================
// COMPARTILHAR IMAGEM
// =========================

async function compartilharImagem() {

const el = document.getElementById("imagemResultado");

await document.fonts.ready;
const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#f4f4f4"
});

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