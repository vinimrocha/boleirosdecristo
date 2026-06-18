let cropperCapa;
let cropperArtilheiro;

let capaFinal = null;
let artilheiroFinal = null;

function loadImage(src) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.onload = () => resolve(img);

        img.onerror = reject;

        img.src = src;

    });

}

function downloadCanvas(canvas, nomeArquivo) {

    const link = document.createElement("a");

    link.download = nomeArquivo;

    link.href = canvas.toDataURL("image/png");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}

// ============================
// CAPA
// ============================

document
.getElementById("capa")
.addEventListener("change", (e) => {

    console.log("CAPA SELECIONADA");

    const file = e.target.files[0];

    if (!file) return;

    const modal =
        document.getElementById("modalCapa");

    const img =
        document.getElementById("cropImageCapa");

    img.src =
        URL.createObjectURL(file);

    modal.style.display =
        "flex";

    img.onload = () => {

        if (cropperCapa)
            cropperCapa.destroy();

        cropperCapa =
            new Cropper(img, {

                aspectRatio: 1,

                viewMode: 1,

                dragMode: "move",

                autoCropArea: 1,

                responsive: true,

                modal: false,

                guides: false,

                center: false,

                background: false,

                movable: true,

                zoomable: true,

                scalable: false,

                rotatable: false,

                touchDragZoom: true

            });

    };

});

document
.getElementById("salvarCapa")
.addEventListener("click", () => {

    capaFinal =
        cropperCapa.getCroppedCanvas({

            width: 820,

            height: 820

        });

    document
    .getElementById("statusCapa")
    .innerHTML =
        "✅ Foto da capa pronta";

    document
    .getElementById("modalCapa")
    .style.display =
        "none";

});

// ============================
// ARTILHEIRO
// ============================

document
.getElementById("artilheiro")
.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const modal =
        document.getElementById("modalArtilheiro");

    const img =
        document.getElementById("cropImageArtilheiro");

    img.src =
        URL.createObjectURL(file);

    modal.style.display =
        "block";

    img.onload = () => {

        if (cropperArtilheiro)
            cropperArtilheiro.destroy();

        cropperArtilheiro =
            new Cropper(img, {

                aspectRatio: 1,

                viewMode: 1,

                dragMode: "move",

                autoCropArea: 1,

                responsive: true,

                modal: false,

                guides: false,

                center: false,

                background: false,

                movable: true,

                zoomable: true,

                scalable: false,

                rotatable: false,

                touchDragZoom: true

            });

    };

});

document
.getElementById("salvarArtilheiro")
.addEventListener("click", () => {

    artilheiroFinal =
        cropperArtilheiro.getCroppedCanvas({

            width: 885,

            height: 885

        });

    document
    .getElementById("statusArtilheiro")
    .innerHTML =
        "✅ Foto do artilheiro pronta";

    document
    .getElementById("modalArtilheiro")
    .style.display =
        "none";

});

// ============================
// GERAR ARTES
// ============================

document
.getElementById("gerar")
.addEventListener("click", async () => {

    try {

        if (!capaFinal) {

            alert(
                "Selecione a foto da capa."
            );

            return;

        }

        if (!artilheiroFinal) {

            alert(
                "Selecione a foto do artilheiro."
            );

            return;

        }

        const gols =
            document
            .getElementById("gols")
            .value || "0";

        // ==========================
        // CAPA
        // ==========================

        const templateCapa =
            await loadImage(
                "assets/equipe.png"
            );

        const canvasCapa =
            document.createElement(
                "canvas"
            );

        canvasCapa.width =
            templateCapa.width;

        canvasCapa.height =
            templateCapa.height;

        const ctxCapa =
            canvasCapa.getContext(
                "2d"
            );

        ctxCapa.drawImage(
            capaFinal,
            130,
            130
        );

        ctxCapa.drawImage(
            templateCapa,
            0,
            0
        );

        downloadCanvas(
            canvasCapa,
            "capa_final.png"
        );

        // ==========================
        // ARTILHEIRO
        // ==========================

        const templateArt =
            await loadImage(
                "assets/equipe.png"
            );

        const canvasArt =
            document.createElement(
                "canvas"
            );

        canvasArt.width =
            templateArt.width;

        canvasArt.height =
            templateArt.height;

        const ctxArt =
            canvasArt.getContext(
                "2d"
            );

        ctxArt.drawImage(
            artilheiroFinal,
            95,
            245
        );

        ctxArt.drawImage(
            templateArt,
            0,
            0
        );

        // ==========================
        // TEXTO DOS GOLS
        // ==========================

        const textoGols =
    Number(gols) === 1
        ? "1 GOL"
        : `${gols} GOLS`;

        ctxArt.font =
            "bold 70px Arial";

        ctxArt.textAlign =
            "right";

        ctxArt.lineWidth =
            8;

        // preenchimento preto
        ctxArt.fillStyle =
            "#000000";

        // borda branca
        ctxArt.strokeStyle =
            "#FFFFFF";

        // posição no canto inferior direito da foto
        const posX = 930;
        const posY = 1080;

        ctxArt.strokeText(
            textoGols,
            posX,
            posY
        );

        ctxArt.fillText(
            textoGols,
            posX,
            posY
        );

        downloadCanvas(
            canvasArt,
            "artilheiro_final.png"
        );

        alert(
            "⚽ Artes geradas com sucesso!"
        );

    }
    catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao gerar as artes."
        );

    }

});