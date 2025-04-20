function getSourceLots(pValue) {
    if (pValue.includes("INVENTORY")) {
        return separarLotes(importSourceLots(pValue, "|", "(", ","));
    } else if (pValue.includes("|")) {
        return separarLotes(importSourceLots(
            pValue.slice(pValue.indexOf("|"), pValue.length),
            "|",
            "(",
            ","
        ));
    } else {
        return separarLotes(importSourceLots(pValue, ":", "(", ","));
    };
}

function importSourceLots(pValue, pIni, pEnd, pSplit) {
    return pValue.slice(pValue.indexOf(pIni) + 1, pValue.indexOf(pEnd)).split(pSplit);
}

function formatoLista(pArreglo) {
    const vSource = pArreglo.filter((x) => x.includes('Source')).toString();
    return getSourceLots(vSource);
}

function separarLotes(pSources) {
    let textoSeparado = "\n\nLots:\n";
    pSources.map((item) => { textoSeparado += `\t- ${item.trim().split(' ')[0]}\n` });
    return textoSeparado;
}