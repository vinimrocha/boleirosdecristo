function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}

function loadUserImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => resolve(img);

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
}

function downloadCanvas(canvas, filename) {
    const link = document.createElement("a");

    link.download = filename;
    link.href = canvas.toDataURL("image/png");

    link.click();
}

document.getElementById("gerar").addEventListener("click", async () => {

    const capaFile =
        document.getElementById("capa").files[0];

    const artilheiroFile =
        document.getElementById("artilheiro").files[0];

    if (!capaFile || !artilheiroFile) {
        alert("Selecione as duas imagens");
        return;
    }

    // =========================
    // CAPA
    // =========================

    const templateCapa =
        await loadImage("capa.png");

    const fotoCapa =
        await loadUserImage(capaFile);

    const canvasCapa =
        document.createElement("canvas");

    canvasCapa.width =
        templateCapa.width;

    canvasCapa.height =
        templateCapa.height;

    const ctxCapa =
        canvasCapa.getContext("2d");

    // FOTO
    ctxCapa.drawImage(
        fotoCapa,
        130,
        130,
        820,
        820
    );

    // TEMPLATE
    ctxCapa.drawImage(
        templateCapa,
        0,
        0
    );

    downloadCanvas(
        canvasCapa,
        "capa_final.png"
    );

    // =========================
    // ARTILHEIRO
    // =========================

    const templateArtilheiro =
        await loadImage("artilheiro.png");

    const fotoArtilheiro =
        await loadUserImage(artilheiroFile);

    const canvasArt =
        document.createElement("canvas");

    canvasArt.width =
        templateArtilheiro.width;

    canvasArt.height =
        templateArtilheiro.height;

    const ctxArt =
        canvasArt.getContext("2d");

    ctxArt.drawImage(
        fotoArtilheiro,
        95,
        245,
        885,
        885
    );

    ctxArt.drawImage(
        templateArtilheiro,
        0,
        0
    );

    downloadCanvas(
        canvasArt,
        "artilheiro_final.png"
    );

    alert("Artes geradas!");
});