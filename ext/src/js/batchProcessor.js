function mostrarListaLotes(pSources) {
    const listaLotes = pSources.map(item => `\t${item.trim().split(' ').at(0)} ✔\n`);
    return `\n\nLots:\n${listaLotes.join('')}`;
}

function mostrarLotes(pContenido) {
    const numIni = pContenido.includes('|') ? pContenido.indexOf('|') : pContenido.indexOf(':');
    const substring1 = pContenido.substring(numIni + 1);
    const numFin = substring1.indexOf('(') >= 1 ? substring1.indexOf('(') : substring1.length;
    const substring2 = substring1.substring(0, numFin).split(',').sort();
    return mostrarListaLotes(substring2);
}

function formatoLista(pArreglo) {
    const vSource = pArreglo.find(item => item.includes('Source'));
    return mostrarLotes(vSource);
}