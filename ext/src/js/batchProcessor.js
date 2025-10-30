function mostrarListaLotes(pSources) {
    const listaLotes = pSources.map(item => `\t${item.trim().split(' ').at(0)} ✔\n`);
    return `\n\nLots:\n${listaLotes.sort().join('')}`;
}

function mostrarLotes(pContenido) {
    const numIni = pContenido.includes('|') ? pContenido.indexOf('|') : pContenido.indexOf(':');
    const subString1 = pContenido.substring(numIni + 1);
    const numFin = subString1.includes('(') ? subString1.indexOf('(') : subString1.length;
    const subString2 = subString1.substring(0, numFin).split(',');
    return mostrarListaLotes(subString2);
}

function formatoLista(pArreglo) {
    const vSource = pArreglo.find(item => item.includes('Source'));
    return mostrarLotes(vSource);
}