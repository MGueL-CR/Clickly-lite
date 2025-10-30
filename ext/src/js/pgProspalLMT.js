const vObj = new Object();

function mainProspalLMT() {
    try {
        if (validarExistenciaParametros('MRS')) {
            webDisponible(() => {
                crearPopoverError();
                generarClaseProspal();
                seleccionarPestaña();
            });
        }
    } catch (error) {
        mostrarAlertaError(error);
    }
}

function webDisponible(continuarProceso) {
    const nvoObserver = new MutationObserver(() => {
        if (!obtenerPorSelector('.loading-bar')) {
            nvoObserver.disconnect();
            continuarProceso();
        }
    });

    nvoObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

function obtenerSeccionBotones() {
    const filaBotones = obtenerFilasFormulario().item(13);
    return obtenerElementosPorTags(filaBotones, 'div').item(0).firstElementChild;
}

function agregarBotonContinuar() {
    const btnContinuar = nuevoBoton('btnContinuar', 'btn btn-info mx-1', 'Completar Campos');
    const spnIcon = nuevoSpan('spnIcono', 'intelicon-play', '');
    const spnCount = nuevoSpan('spnCounter', 'px-1', `Continuar (0/${vObj.prospal.obtenerTotalItems()})`);

    btnContinuar.addEventListener('click', completarFormInferior);

    nuevoContenedor(btnContinuar, [spnIcon, spnCount]);
    nuevoContenedor(obtenerSeccionBotones(), [btnContinuar]);
}

function generarClaseProspal() {
    const urlParams = obtenerParametrosURL();
    vObj.prospal = new ClassProspal(
        urlParams.get("MRS"),
        urlParams.get("WWID"),
        urlParams.get("ITEMS"));
}

function obtenerFilasFormulario() {
    const tabla = buscarElementoPorClase('manualTravelcreatelayoutTable', 0);
    return tabla.rows;
}

function obtenerCampo(pTipo, pIndex, pFila) {
    if (!pTipo.includes('k-input')) {
        return obtenerElementosPorTags(pFila, pTipo).item(pIndex);
    } else {
        return obtenerElementoPorClase(pFila, 'k-input').item(pIndex);
    }
}

function autoRellenarCampos(pInput, pIndex, pValor) {
    if (pIndex < pValor.length) {
        pInput.focus();
        pInput.value += pValor[pIndex];

        const eventoInput = new Event("change", { bubbles: true });
        pInput.dispatchEvent(eventoInput);

        pIndex++;
        setTimeout(autoRellenarCampos(pInput, pIndex, pValor), 150);
    }
}

function seleccionarPestaña() {
    const contenedor = obtenerObjetoPorID('lab-manual-divider').parentElement;
    const pestañas = obtenerElementosPorTags(contenedor, 'ul').item(0);
    pestañas.lastElementChild.click();

    obtenerCamposFormulario();
    insertarPropiedadesAdicionales();
    agregarBotonContinuar();
    completarFormSuperior();
}

function seleccionarCelda(pFilas, pIndex) {
    const vFila = pFilas.item(pIndex);
    const vCelda = vFila.lastElementChild;
    return vCelda;
}

function insertarPropiedadesAdicionales() {
    const listaFilas = obtenerFilasFormulario();
    const btnAgregar = obtenerSeccionBotones().lastElementChild;
    const cldOwner = seleccionarCelda(listaFilas, 16).firstElementChild;
    const cldFabSite = seleccionarCelda(listaFilas, 17).firstElementChild;
    const cldAssyID = seleccionarCelda(listaFilas, 18).firstElementChild;
    btnAgregar.id = "btnAddItem";
    agregarClases(cldOwner, "hide-list");
    agregarClases(cldFabSite, "hide-list");
    agregarClases(cldAssyID, "hide-list");
}

function completarFormSuperior() {
    autoRellenarCampos(vObj.form.txtMatCode, 0, vObj.prospal.materialCode);
    autoRellenarCampos(vObj.form.txtWWID, 0, vObj.prospal.userID);
    obtenerObjetoPorID('btnContinuar').focus();
}

function obtenerCamposFormulario() {
    const filas = obtenerFilasFormulario();
    vObj.form = {
        "txtWWID": obtenerElementosPorName("wwid").item(0),
        "txtMatCode": obtenerCampo('input', 1, filas.item(2)),
        "cmbPartType": obtenerCampo('input', 0, filas.item(14)),
        "txtLot": obtenerCampo('input', 1, filas.item(14)),
        "spnOwner": obtenerCampo('k-input', 1, filas.item(16)),
        "spnSiteId": obtenerCampo('k-input', 0, filas.item(17)),
        "spnAssyId": obtenerCampo('k-input', 0, filas.item(18)),
        "txtQty": obtenerCampo('input', 0, filas.item(19)),
        "txtComment": obtenerCampo('textarea', 0, filas.item(19))
    }
}

function validarContadorItems(pValor, pTotal, pBoton) {
    let nvoEstado = "Continuar";
    pValor++;
    if (pValor < pTotal) {
        guardarValorEnSS('indexItem', pValor);
    } else {
        nvoEstado = 'Completado';
        pBoton.disabled = true;
    }
    establacerContenidoPorID('spnCounter', `${nvoEstado} (${pValor}/${pTotal})`);
}

function completarFormato(pPkg, pDvc, pRv, pStp) {
    return `${pPkg}${pDvc} ${pRv} ${pStp}`;
}

function generarFormatoPartType(pPartType) {
    const [vPkg, vDvc, vRev, vStp] = pPartType.split(" ");

    if (!vStp) return completarFormato(vPkg, vDvc, vRev, "");

    if (vRev === "") {
        return completarFormato(vPkg, vDvc, " ", vStp);
    } else {
        return completarFormato(vPkg, vDvc, vRev, vStp);
    }

}

function completarFormInferior() {
    const [objProspal, form, vContador] = [vObj.prospal, vObj.form, parseInt(leerValorEnSS('indexItem'))];
    const lista = {
        "items": objProspal.obtenerListaMaterial(), "total": objProspal.obtenerTotalItems()
    };
    const numIndex = vContador ? vContador : 0;
    const objItem = lista.items.at(numIndex);

    autoRellenarCampos(form.cmbPartType, 0, generarFormatoPartType(objItem.part));

    parttypeSeleccionado(() => {
        webDisponible(() => {
            autoRellenarCampos(form.txtLot, 0, objItem.lot);
            seleccionarOpcion(form.spnOwner, 0, objProspal.owner);
            seleccionarOpcion(form.spnSiteId, 0, objProspal.fabID);
            seleccionarOpcion(form.spnAssyId, 0, objProspal.assyID);
            autoRellenarCampos(form.txtQty, 0, objItem.qty.toString().padStart(2, "0"));
            autoRellenarCampos(form.txtComment, 0, objProspal.insertarComentario());
            obtenerObjetoPorID('btnAddItem').focus();
        });
    });

    validarContadorItems(numIndex, lista.total, this);
}

function seleccionarOpcion(pSelect, pIntentos, pValor) {
    const dropdownTrigger = obtenerPadre(pSelect);

    if (dropdownTrigger) {
        dropdownTrigger.click();
        const intervalo = setInterval(() => {
            const opciones = document.querySelectorAll('.k-list-container .k-item');

            if (opciones.length > 0) {
                clearInterval(intervalo);
                const opcion = Array.from(opciones).find(op => op.textContent.trim() === pValor);
                if (opcion) opcion.click();
            }

            pIntentos++
            if (pIntentos > 25) clearInterval(intervalo);
        }, 200);
    }
}

function parttypeSeleccionado(continuarProceso) {
    const nvoObserver = new MutationObserver(() => {
        if (obtenerPorSelector('.loading-bar')) {
            nvoObserver.disconnect();
            continuarProceso();
        }
    });

    nvoObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}