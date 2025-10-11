const vObj = new Object();

function mainProspalLMT() {
    try {
        if (validarExistenciaParametros('MRS')) {
            setTimeout(() => {
                console.clear();
                generarClaseProspal();
                completarFormSuperior();
                obtenerCamposFormulario();
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

function obtenerCampoSpan(pFila, pIndex) {
    return obtenerElementoPorClase(pFila, 'k-input').item(pIndex);
}

function agregarValorAlCampo(pInput, pValor) {
    pInput.focus();
    if (pInput.tagName == "INPUT") {
        pInput.value = pValor;
    } else {
        pInput.textContent = pValor;
    }
}

function completarFormSuperior() {
    const contenedor = obtenerObjetoPorID('lab-manual-divider').parentElement;
    const pestañas = obtenerElementosPorTags(contenedor, 'ul').item(0);
    pestañas.lastElementChild.click();

    setTimeout(() => {
        agregarBotonContinuar();
        const filas = obtenerFilasFormulario();
        const txtMaterialCode = obtenerCampoTexto(filas.item(2), 1);
        const txtWWID = obtenerElementosPorName("wwid").item(0);
        //const txtWWID = obtenerCampoTexto(filas.item(3), 0);
        agregarValorAlCampo(txtMaterialCode, vObj.prospal.materialCode);
        agregarValorAlCampo(txtWWID, vObj.prospal.userID);
        obtenerObjetoPorID('btnContinuar').focus();
        //obtenerCampoTexto(filas.item(3), 1).focus();
    }, 2000);
}

function obtenerCamposFormulario() {
    const filas = obtenerFilasFormulario();
    vObj.form = {
        "cmbPartType": obtenerCampoTexto(filas.item(14), 0),
        "txtLot": obtenerCampoTexto(filas.item(14), 1),
        "cmbOwner": obtenerCampoLista(filas.item(16), 0),
        "spnOwner": obtenerCampoSpan(filas.item(16), 1),
        "cmbSiteId": obtenerCampoLista(filas.item(17), 0),
        "spnSiteId": obtenerCampoSpan(filas.item(17), 0),
        "cmbAssyId": obtenerCampoLista(filas.item(18), 0),
        "spnAssyId": obtenerCampoSpan(filas.item(18), 0),
        "txtQty": obtenerCampoTexto(filas.item(19), 0),
        "txtCommentMRS": obtenerElementosPorTags(filas.item(19), 'textarea').item(0)
    }
}

function modificarContadorItems(pValor, pTotal) {
    pValor++;
    const nvoTexto = `Continuar (${pValor}/${pTotal})`;
    establacerContenidoPorID('spnCounter', nvoTexto);
    guardarValorEnSS('indexItem', pValor);
}

function completarFormInferior(e) {
    const objProspal = vObj.prospal;
    const listaItems = objProspal.obtenerListaMaterial();
    const form = vObj.form;
    const vContador = parseInt(leerValorEnSS('indexItem'));

    if (vContador >= listaItems.length) {
        e.target.textContent = e.target.textContent.replace("Continuar", "Completado")
        addAtributo(this, "disabled", true);
        return;
    }

    const numIndex = vContador ? vContador : 0;
    const objItem = listaItems.at(numIndex);
    const arryPartType = objItem.part.split(" ");
    const nvoPartType = `${arryPartType.at(0)}${arryPartType.at(1)}`;


    agregarValorAlCampo(form.txtLot, objItem.lot);
    agregarValorAlCampo(form.cmbOwner, objProspal.owner);
    //agregarValorAlCampo(form.spnOwner, objProspal.owner);
    agregarValorAlCampo(form.cmbSiteId, objProspal.fabID);
    //agregarValorAlCampo(form.spnSiteId, objProspal.fabID);
    agregarValorAlCampo(form.cmbAssyId, objProspal.assyID);
    //agregarValorAlCampo(form.spnAssyId, objProspal.assyID);
    agregarValorAlCampo(form.txtQty, objItem.qty);
    agregarValorAlCampo(form.txtCommentMRS, objProspal.insertarComentario());
    agregarValorAlCampo(form.cmbPartType, nvoPartType);

    modificarContadorItems(numIndex, listaItems.length);
}
