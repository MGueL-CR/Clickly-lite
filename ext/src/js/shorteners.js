// Console

function imprima(pValor) {
    console.clear();
    console.log(pValor);
}

function imprimirError(pErr) {
    console.clear();
    console.error('An error occurred! \n', pErr);
}

function mostrarAlertaError(pErr) {
    imprimirError(pErr);
    document.getElementById('ppMore').textContent = pErr;
    document.getElementById('msgError').showPopover();
}

// Clase VPO

function crearVPO(pFila) {
    return new ClassVPO(
        obtenerHijo(pFila, 1).textContent,
        obtenerHijo(pFila, 6).textContent,
        obtenerHijo(pFila, 8).textContent
    );
}

function recuperarVPO(pValores) {
    const nvoObjeto = JSON.parse(pValores);
    return new ClassVPO(
        nvoObjeto.numero,
        nvoObjeto.cantidad,
        nvoObjeto.maquina
    );
}

// window

function obtenerParametroActual() {
    const vValor = window.location.href.split("?")[1]
    return typeof vValor !== "undefined" ? decodificarValor(vValor) : vValor;
}

function validarContenidoURL(pValor) {
    return window.location.href.includes(pValor);
}

function copiarValor(pValor) {
    navigator.clipboard.writeText(pValor);
}

function guardarValorEnSS(pAlias, pValor) {
    window.sessionStorage.setItem(codificarValor(pAlias), codificarValor(pValor));
}

function leerValorEnSS(pAlias) {
    return decodificarValor(window.sessionStorage.getItem(codificarValor(pAlias)));
}

function codificarValor(pValor) {
    return window.btoa(pValor);
}

function decodificarValor(pValor) {
    return window.atob(pValor);
}

function abrirNuevoEnlace(pURL, pModo) {
    window.open(pURL, pModo);
}

// DOM

function crearElemento(pType) {
    return document.createElement(pType);
}

function addAtributo(pObj, pNameAttr, pValAttr) {
    pObj.setAttribute(pNameAttr, pValAttr);
}

function removerAtributo(pObj, pAttr) {
    pObj.removeAttribute(pAttr);
}

function removerPropiedad(pObj, pProp) {
    pObj.style.removeProperty(pProp);
}

function modificarPropiedad(pObj, pProp, pValor) {
    pObj.style.setProperty(pProp, pValor);
}

function agregarClases(pObj, pClases) {
    pClases.split(',').forEach(iClase => {
        pObj.classList.add(iClase);
    });
}

function removerClases(pObj, pClases) {
    pObj.classList.remove(pClases);
}

function obtenerColor(pObj) {
    return pObj.style.getPropertyValue("background-color");
}

function obtenerHijo(pObj, pHijo) {
    return pObj.children[pHijo];
}

function obtenerPadre(pObj) {
    return pObj.parentElement;
}

function validarSelector(pSelector, pTipo) {
    return pSelector.tagName === pTipo;
}

// GetID

function obtenerObjetoPorID(pId) {
    return document.getElementById(pId);
}

function obtenerValorPorID(pId) {
    return document.getElementById(pId).value;
}

function establecerValorPorID(pId, pValor) {
    document.getElementById(pId).value = pValor;
}

function establecerTextoPorId(pId, pTexto) {
    document.getElementById(pId).textContent = pTexto;
}

function obtenerFilas(pIdTabla) {
    return obtenerElementosPorTags(obtenerObjetoPorID(pIdTabla), 'tr');
}

// ElementsByTagName

function obtenerElementosPorTags(pObj, pTag) {
    return pObj.getElementsByTagName(pTag)
}

function insertarElementoPorTag(pTag, pItem) {
    document.getElementsByTagName(pTag)[0].appendChild(pItem);
}

// QuerySelector(s)

function obtenerPorSelector(pType) {
    return document.querySelector(pType);
}

function obtenerSelectorPorIndice(pType, pIndx) {
    return document.querySelectorAll(pType)[pIndx];
}

function obtenerSelectores(pType) {
    return document.querySelectorAll(pType);
}

function obtenerSelectorPorObjeto(pObj, pType) {
    return pObj.querySelector(pType);
}