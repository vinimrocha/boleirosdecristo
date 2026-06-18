let cropperCapa;
let cropperArtilheiro;

function loadImage(src) {
    return new Promise((resolve, reject) => {

        const img = new Image();

        img.onload = () => resolve(img);

        img.onerror = reject;

        img.src = src;
    });
}

function downloadCanvas(canvas, nome) {

    const link = document.createElement("a");

    link.download = nome;

    link.href = canvas.toDataURL("image/png");

    link.click();
}

document
.getElementById("capa")
.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const img =
        document.getElementById("previewCapa");

    img.src =
        URL.createObjectURL(file);

    img.style.display =
        "block";

    img.onload = () => {

        if (cropperCapa)
            cropperCapa.destroy();

        cropperCapa =
            new Cropper(img, {

                aspectRatio: 1,

                viewMode: 1,

                dragMode: "move",

                autoCropArea: 0.9,
                responsive: true,
                modal: false,
                guides: false,
                center: false

                responsive: true

            });

    };

});

document
.getElementById("artilheiro")
.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const img =
        document.getElementById("previewArtilheiro");

    img.src =
        URL.createObjectURL(file);

    img.style.display =
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

                responsive: true

            });

    };

});

document
.getElementById("gerar")
.addEventListener("click", async () => {

    try {

        if (!cropperCapa || !cropperArtilheiro) {

            alert(
                "Selecione as duas imagens."
            );

            return;
        }

        const gols =
            document
            .getElementById("gols")
            .value;

        // ======================
        // CAPA
        // ======================

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
            canvasCapa.getContext("2d");

        const fotoCapa =
            cropperCapa
            .getCroppedCanvas({
                width: 820,
                height: 820
            });

        ctxCapa.drawImage(
            fotoCapa,
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

        // ======================
        // ARTILHEIRO
        // ======================

        const templateArt =
            await loadImage(
                "assets/artilheiro.png"
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
            canvasArt.getContext("2d");

        const fotoArt =
            cropperArtilheiro
            .getCroppedCanvas({
                width: 885,
                height: 885
            });

        ctxArt.drawImage(
            fotoArt,
            95,
            245
        );

        ctxArt.drawImage(
            templateArt,
            0,
            0
        );

        const texto =
            Number(gols) === 1
            ? "1 GOL"
            : `${gols} GOLS`;

        ctxArt.font =
            "bold 80px Arial";

        ctxArt.fillStyle =
            "#FFFFFF";

        ctxArt.strokeStyle =
            "#000000";

        ctxArt.lineWidth =
            8;

        ctxArt.textAlign =
            "center";

        ctxArt.strokeText(
            texto,
            canvasArt.width / 2,
            1180
        );

        ctxArt.fillText(
            texto,
            canvasArt.width / 2,
            1180
        );

        downloadCanvas(
            canvasArt,
            "artilheiro_final.png"
        );

        alert(
            "Artes geradas!"
        );

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao gerar."
        );

    }

});