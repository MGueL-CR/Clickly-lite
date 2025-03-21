function getSourceLots(pValue) {
    let info = "";

    if (pValue.includes("INVENTORY")) {
        info = importSourceLots(pValue, "|", "(", ",");
    } else if (pValue.includes("|")) {
        info = importSourceLots(
            pValue.slice(pValue.indexOf("|"), pValue.length),
            "|",
            "(",
            ","
        );
    } else {
        info = importSourceLots(pValue, ":", "(", ",");
    }
    return separarLotes(info);
}

function importSourceLots(pValue, pIni, pEnd, pSplit) {
    return pValue
        .slice(pValue.indexOf(pIni) + 1, pValue.indexOf(pEnd))
        .split(pSplit);
}

function formatoLista(pArreglo) {
    let tipoLista = "";
    pArreglo.forEach(element => {
        if (element.includes("Source")) {
            tipoLista = getSourceLots(element);
        }
    });
    return tipoLista;
}

function separarLotes(pSources) {
    let textoSeparado = "\n\nLots:\n";
    for (const item of pSources) {
        textoSeparado += `\t- ${item.trim().split(' ')[0]}\n`;
    }
    return textoSeparado;
}