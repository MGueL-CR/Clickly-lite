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
    completarFormSuperior();
}

function completarFormSuperior() {
    agregarBotonContinuar();
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

function generarFormatoPartType(pPartType) {
    const nvoArray = pPartType.split(" ");

    if (nvoArray.length >= 4) {
        if (nvoArray.includes("")) {
            return `${nvoArray.at(0)}${nvoArray.at(1)}   ${nvoArray.at(3)}`;
        } else {
            return `${nvoArray.at(0)}${nvoArray.at(1)} ${nvoArray.at(2)} ${nvoArray.at(3)}`;
        }
    } else {
        return `${nvoArray.at(0)}${nvoArray.at(1)} ${nvoArray.at(2)}`;
    }
}

function completarFormInferior() {
    const [objProspal, form, vContador] = [vObj.prospal, vObj.form, parseInt(leerValorEnSS('indexItem'))];
    const lista = {
        "items": objProspal.obtenerListaMaterial(), "total": objProspal.obtenerTotalItems()
    };
    const numIndex = vContador ? vContador : 0;
    const objItem = lista.items.at(numIndex);

    autoRellenarCampos(form.txtLot, 0, objItem.lot);
    seleccionarOpcion(form.spnOwner, 0, objProspal.owner);
    seleccionarOpcion(form.spnSiteId, 0, objProspal.fabID);
    seleccionarOpcion(form.spnAssyId, 0, objProspal.assyID);
    autoRellenarCampos(form.txtQty, 0, objItem.qty.toString().padStart(2, "0"));
    autoRellenarCampos(form.txtComment, 0, objProspal.insertarComentario());
    autoRellenarCampos(form.cmbPartType, 0, generarFormatoPartType(objItem.part));

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
