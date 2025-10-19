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
    const nvoArreglo = pArreglo.filter(item => item.includes('Source'));
    const vSource = nvoArreglo.at(0).replace(/\,/g, '');
    return getSourceLots(vSource);
}

function separarLotes(pSources) {
    //let textoSeparado = "\n\nLots:\n";
    //pSources.map((item) => { textoSeparado += `\t- ${item.trim().split(' ')[0]}\n` });
    const textoSeparado = pSources.map(item => `\t- ${item.trim().split(' ')[0]}\n`);
    textoSeparado.unshift("\n\nLots:\n");
    return textoSeparado.toString();
}

const vValor1 = "SAPPHIRE RAPIDS-SP-XCC E-5 CORRELATION; SPR XCCSP CCT Validation; HRI SPRX8SE5FP06; MRV 1617EAEB0000; Source: INVENTORY CONTROL | SPRE5FPO06 [23], SPRE5FPO09 [91] (Qty 114); Location to Return Units: INVENTORY CONTROL";
const vValor2 = "Type: Fast; EMR MF 30.3; Source: EMRA1XCSBFT [25],EMRA1XCCIO1 [25] (Qty50) | EMRA1XCCIO1 [21], EMRA1XCSBFT [25] (Qty 46); Location to Return Units: EMRA1XCSBFT [25],EMRA1XCCIO1 [25] (Qty50)";
const vValor3 = "Source: SPREECA1AR2 [5],SPREEA1CSE2 [2],SPREECA1CS5 [4],SPREECA1CS2 [6],SPREECA1CS1 [7],SPREECA1AR3 [2],SPREECA1AR4 [2],SPREEA1CSX2 [3],SPREECA1CS4 [1],SPREEA1CSE7 [1],SPREEA1CSE6 [1] (Qty34)"
const vValor4 = "DANA HILLS MCP PACKAGE C-1 CORRELATION; C1 PRQ TP; Source: MIR STORAGE | DHLC1ZTP01 [120] ; Location to Return Units: MIR STORAGE";

mostrarLotes(vValor1);
function mostrarLotes(pContenido) {
    const vSource = pContenido.split(';').find(x => x.includes("Source:"));
    const numIni = vSource.includes('|') ? vSource.indexOf('|') : vSource.indexOf(':');
    const substring1 = vSource.substring(numIni + 1);
    const numFin = substring1.indexOf('(') >= 1 ? substring1.indexOf('(') : substring1.length;
    const substring2 = substring1.substring(0, numFin).split(',').sort();
    substring2
    return separarLotes(substring2);
}