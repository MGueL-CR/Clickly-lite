const vObj = new Object();

function mainProspalLMT() {
    try {
        if (validarExistenciaParametros('MRS')) {
            setTimeout(() => {
                console.clear();
                generarClaseProspal();
                completarFormSuperior();
            }, 3000);
        }
    } catch (error) {
        mostrarAlertaError(error);
    }
}

function agregarBotonContinuar() {
    const filaBotones = obtenerFilasFormulario().item(13);
    const divBotones = obtenerElementosPorTags(filaBotones, 'div').item(0).firstElementChild;
    const cantidadItems = vObj.prospal.obtenerListaMaterial().length;

    const btnContinuar = nuevoBoton('btnContinuar', 'btn btn-info mx-1', 'Completar Campos');
    const spnIcon = nuevoSpan('spnIcono', 'intelicon-play', '');
    const spnCount = nuevoSpan('spnCounter', 'px-1', `Continuar (0/${cantidadItems})`);

    btnContinuar.addEventListener('click', completarFormInferior);

    nuevoContenedor(btnContinuar, [spnIcon, spnCount]);
    nuevoContenedor(divBotones, [btnContinuar]);
}

function generarClaseProspal() {
    const urlParams = obtenerParametrosURL();
    vObj.prospal = urlParams.size > 0 ?
        new ClassProspal(
            urlParams.get("MRS"),
            urlParams.get("WWID"),
            urlParams.get("ITEMS")) :
        null;
}

function obtenerFilasFormulario() {
    const tabla = document.getElementsByClassName('manualTravelcreatelayoutTable').item(0);
    return tabla.rows;
}

function obtenerCampoTexto(pFila, pIndex) {
    return obtenerElementosPorTags(pFila, 'input').item(pIndex);
}

function obtenerCampoLista(pFila, pIndex) {
    return obtenerElementosPorTags(pFila, 'select').item(pIndex);
}

function agregarValorAlCampo(pInput, pValor) {
    pInput.focus();
    pInput.value = pValor;
}

function completarFormSuperior() {
    const contenedor = obtenerObjetoPorID('lab-manual-divider').parentElement;
    const pestañas = obtenerElementosPorTags(contenedor, 'ul').item(0);
    pestañas.lastElementChild.click();

    setTimeout(() => {
        agregarBotonContinuar();
        const filas = obtenerFilasFormulario();
        const txtMaterialCode = obtenerCampoTexto(filas.item(2), 1);
        const txtWWID = obtenerCampoTexto(filas.item(3), 0);
        agregarValorAlCampo(txtMaterialCode, vObj.prospal.materialCode);
        agregarValorAlCampo(txtWWID, vObj.prospal.userID);
        obtenerCampoTexto(filas.item(3), 1).focus();
    }, 2000);
}

function obtenerCamposFormulario() {
    const filas = obtenerFilasFormulario();
    return {
        "cmbPartType": obtenerCampoTexto(filas.item(14), 0),
        "txtLot": obtenerCampoTexto(filas.item(14), 1),
        "cmbOwner": obtenerCampoLista(filas.item(16), 0),
        "cmbSiteId": obtenerCampoLista(filas.item(17), 0),
        "cmbAssyId": obtenerCampoLista(filas.item(18), 0),
        "txtQty": obtenerCampoTexto(filas.item(19), 0),
        "txtCommentMRS": obtenerElementosPorTags(filas.item(19), 'textarea').item(0)
    }
}

function completarFormInferior() {
    const objProspal = vObj.prospal;
    const listaItems = objProspal.obtenerListaMaterial();
    const form = obtenerCamposFormulario();
}
