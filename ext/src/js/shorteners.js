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
    establacerContenidoPorID('ppMore', pErr);
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

function recargarPagina() {
    location.reload();
}

function copiarValor(pValor) {
    navigator.clipboard.writeText(pValor);
}

function guardarValorEnSS(pAlias, pValor) {
    window.sessionStorage.setItem(codificarValor(pAlias), codificarValor(pValor));
}

function leerValorEnSS(pAlias) {
    const vValor = window.sessionStorage.getItem(codificarValor(pAlias));
    return vValor !== null ? decodificarValor(vValor) : vValor;
}

function removerValorEnSS(pAlias) {
    window.sessionStorage.removeItem(codificarValor(pAlias));
}

function codificarValor(pValor) {
    return window.btoa(pValor);
}

function decodificarValor(pValor) {
    return window.atob(pValor);
}

// URL

function obtenerURLActual() {
    return new URL(window.location.href);
}

function generarNuevaURL(pURL) {
    return new URL(pURL);
}

function obtenerParametrosURL() {
    let noURL;
    const vURL = obtenerURLActual();
    const vParams = new URLSearchParams(vURL.search);
    return vParams.size > 0 ? vParams : noURL;
}

function validarExistenciaParametros(pParam) {
    return obtenerURLActual().searchParams.has(pParam);
}

function validarPathname(pPathname) {
    return obtenerURLActual().pathname.includes(pPathname);
}

function validarContenidoURL(pValor) {
    console.log(obtenerURLActual().pathname);
    return window.location.href.includes(pValor);
}

function abrirNuevoEnlace(pURL, pModo) {
    window.open(generarNuevaURL(pURL), pModo);
}

function agregarParametroURL(pURL, pNombre, pValor) {
    pURL.searchParams.append(pNombre, pValor);
}

function modificarPropiedadParametroURL(pURL, pNombre, pValor) {
    pURL.searchParams.set(pNombre, pValor);
}

function obtenerParametroURL(pURL, pNombre) {
    return pURL.searchParams.get(pNombre);
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

function intercambiarClase(pObj, pClase) {
    pObj.classList.toggle(pClase);
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

function obtenerContenidoPorID(pId) {
    const elemento = obtenerObjetoPorID(pId);
    return elemento.type ? elemento.value : elemento.textContent;
}

function establacerContenidoPorID(pId, pContenido) {
    const elemento = obtenerObjetoPorID(pId);
    if (elemento.type) {
        elemento.value = pContenido;
    } else {
        elemento.textContent = pContenido;
    }
}

function obtenerFilas(pIdTabla) {
    return obtenerElementosPorTags(obtenerObjetoPorID(pIdTabla), 'tr');
}

// ElementsByName

function obtenerElementosPorName(pName) {
    return document.getElementsByName(pName);
}

// ElementsByClassName

function obtenerElementoPorClase(pObj, pClase) {
    return pObj.getElementsByClassName(pClase);
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

function obtenerSelectoresPorObjeto(pObj, pType) {
    return pObj.querySelectorAll(pType);
}