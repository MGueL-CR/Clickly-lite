const vObj = new Object();

function mainProspalLMT() {
    try {
        if (validarExistenciaParametros('MRS')) {
            setTimeout(() => {
                console.clear();
                generarClaseProspal();
                completarFormSuperior();
                obtenerCamposFormulario();
            }, 5000);
        }
    } catch (error) {
        mostrarAlertaError(error);
    }
}

function agregarBotonContinuar() {
    const filaBotones = obtenerFilasFormulario().item(13);
    const divBotones = obtenerElementosPorTags(filaBotones, 'div').item(0).firstElementChild;

    const btnContinuar = nuevoBoton('btnContinuar', 'btn btn-info mx-1', 'Completar Campos');
    const spnIcon = nuevoSpan('spnIcono', 'intelicon-play', '');
    const spnCount = nuevoSpan('spnCounter', 'px-1', `Continuar (0/${vObj.prospal.obtenerTotalItems()})`);

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

function agregarValorAlCampo(pInput, pIndex, pValor) {
    pInput.focus();
    if (pInput.tagName == "INPUT") {
        pInput.value += pValor[pIndex];
    } else {
        pInput.textContent += pValor[pIndex];
    }
}

function autoRellenarCampos(pInput, pIndex, pValor) {
    if (pIndex < pValor.length) {
        agregarValorAlCampo(pInput, pIndex, pValor)

        const eventoInput = new Event("input", { bubbles: true });
        pInput.dispatchEvent(eventoInput);

        pIndex++;
        setTimeout(autoRellenarCampos(pInput, pIndex, pValor), 150);
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
        agregarValorAlCampo(txtMaterialCode, 0, vObj.prospal.materialCode);
        autoRellenarCampos(txtWWID, 0, vObj.prospal.userID);
        obtenerObjetoPorID('btnContinuar').focus();
    }, 3000);
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

function generarFormatoPartType(pPartType) {
    const nvoArray = pPartType.split(" ");
    let nvoFormato = "";

    if (nvoArray.length > 3) {
        if (nvoArray.includes("")) {
            nvoFormato = `${nvoArray.at(0)}${nvoArray.at(1)} ${nvoArray.at(2)} ${nvoArray.at(4)}`;
        } else {
            nvoFormato = `${nvoArray.at(0)}${nvoArray.at(1)} ${nvoArray.at(2)} ${nvoArray.at(3)}`;
        }
    } else {
        nvoFormato = `${nvoArray.at(0)}${nvoArray.at(1)} ${nvoArray.at(2)}`;
    }

    return nvoFormato;
}

function completarFormInferior(e) {
    const objProspal = vObj.prospal;
    const lista = {
        "items": objProspal.obtenerListaMaterial(), "total": objProspal.obtenerTotalItems()
    };
    const form = vObj.form;
    const vContador = parseInt(leerValorEnSS('indexItem'));

    if (vContador >= lista.total) {
        e.target.textContent = e.target.textContent.replace("Continuar", "Completado")
        this.disabled = true;
        return;
    }

    const numIndex = vContador ? vContador : 0;
    const objItem = lista.items.at(numIndex);

    autoRellenarCampos(form.txtLot, 0, objItem.lot);
    agregarValorAlCampo(form.cmbOwner, 0, objProspal.owner);
    agregarValorAlCampo(form.spnOwner, 0, objProspal.owner);
    agregarValorAlCampo(form.cmbSiteId, 0, objProspal.fabID);
    agregarValorAlCampo(form.spnSiteId, 0, objProspal.fabID);
    agregarValorAlCampo(form.cmbAssyId, 0, objProspal.assyID);
    agregarValorAlCampo(form.spnAssyId, 0, objProspal.assyID);
    autoRellenarCampos(form.txtQty, 0, objItem.qty.toString().padStart(2, "0"));
    autoRellenarCampos(form.txtCommentMRS, 0, objProspal.insertarComentario());
    autoRellenarCampos(form.cmbPartType, 0, generarFormatoPartType(objItem.part));

    modificarContadorItems(numIndex, lista.total);
}
