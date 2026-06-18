document.getElementById("gerar").addEventListener("click", () => {

    const capa =
        document.getElementById("capa").files[0];

    const artilheiro =
        document.getElementById("artilheiro").files[0];

    if(!capa || !artilheiro){
        alert("Selecione as duas imagens");
        return;
    }

    alert("Tudo pronto!");
});