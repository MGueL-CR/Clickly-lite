const vObj = new Object();

function mainProspalLMT() {
    try {
        if (validarExistenciaParametros('MRS')) {
            observarLoader(() => {
                console.log('Continuacion ');
                generarClaseProspal();
                seleccionarPestaña();
            });
        }
    } catch (error) {
        mostrarAlertaError(error);
    }
}

function observarLoader(continuarProceso) {
    const observer = new MutationObserver(() => {
        const loader = document.querySelector('.loading-bar');

        if (!loader) {
            //console.clear();
            console.log('Loader finalizó!!!');
            observer.disconnect(); // Detiene el observer
            continuarProceso(); // Ejecuta el siguiente paso
        }
    });

    observer.observe(document.body, {
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
    const tabla = document.getElementsByClassName('manualTravelcreatelayoutTable').item(0);
    return tabla.rows;
}

function obtenerCampo(pTipo, pIndex, pFila) {
    if (!pTipo.includes('k-input')) {
        return obtenerElementosPorTags(pFila, pTipo).item(pIndex);
    } else {
        return obtenerElementoPorClase(pFila, 'k-input').item(pIndex);
    }
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

function seleccionarPestaña() {
    const contenedor = obtenerObjetoPorID('lab-manual-divider').parentElement;
    const pestañas = obtenerElementosPorTags(contenedor, 'ul').item(0);
    pestañas.lastElementChild.click();

    observarLoader(() => {
        //console.clear();
        console.log('Loader #2 Finalizado!!');
        console.log('Click en el tab << Create Traveler >>');
        obtenerCamposFormulario();
        completarFormSuperior();
    });
}

function completarFormSuperior() {
    agregarBotonContinuar();
    agregarVsalorAlCampo(vObj.form.txtMatCode, 0, vObj.prospal.materialCode);
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
        "cmbOwner": obtenerCampo('select', 0, filas.item(16)),
        "spnOwner": obtenerCampo('k-input', 1, filas.item(16)),
        "cmbSiteId": obtenerCampo('select', 0, filas.item(17)),
        "spnSiteId": obtenerCampo('k-input', 0, filas.item(17)),
        "cmbAssyId": obtenerCampo('select', 0, filas.item(18)),
        "spnAssyId": obtenerCampo('k-input', 0, filas.item(18)),
        "txtQty": obtenerCampo('input', 0, filas.item(19)),
        "txtComment": obtenerCampo('textarea', 0, filas.item(19))
    }
}

function validarContadorItems(pValor, pTotal, pBoton) {
    let nvoEstado = "";
    pValor++;
    if (pValor < pTotal) {
        nvoEstado = 'Continuar';
        guardarValorEnSS('indexItem', pValor);
    } else {
        nvoEstado = 'Completado';
        pBoton.disabled = true;
    }
    establacerContenidoPorID('spnCounter', `${nvoEstado} (${pValor}/${pTotal})`);
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

function completarFormInferior() {
    const [objProspal, form, vContador] = [vObj.prospal, vObj.form, parseInt(leerValorEnSS('indexItem'))];
    const lista = {
        "items": objProspal.obtenerListaMaterial(), "total": objProspal.obtenerTotalItems()
    };
    const numIndex = vContador ? vContador : 0;
    const objItem = lista.items.at(numIndex);

    autoRellenarCampos(form.txtLot, 0, objItem.lot);
    //agregarValorAlCampo(form.cmbOwner, 0, objProspal.owner);
    seleccionarOpcion(form.spnOwner, 0, objProspal.owner);
    //agregarValorAlCampo(form.cmbSiteId, 0, objProspal.fabID);
    seleccionarOpcion(form.spnSiteId, 0, objProspal.fabID);
    //agregarValorAlCampo(form.cmbAssyId, 0, objProspal.assyID);
    seleccionarOpcion(form.spnAssyId, 0, objProspal.assyID);
    autoRellenarCampos(form.txtQty, 0, objItem.qty.toString().padStart(2, "0"));
    autoRellenarCampos(form.txtComment, 0, objProspal.insertarComentario());
    autoRellenarCampos(form.cmbPartType, 0, generarFormatoPartType(objItem.part));

    //validarContadorItems(numIndex, lista.total, this);
}

function seleccionarOpcion(pSelect, pIntentos, pValor) {
    // Paso 1: Abrir el dropdown (simular clic en el span que lo activa)
    const dropdownTrigger = obtenerPadre(pSelect);//.querySelector('.k-dropdown-wrap');

    if (!dropdownTrigger) return console.warn('No se encontró el activador del dropdown');

    dropdownTrigger.click(); // Abre el menú

    // Paso 2: Esperar a que se renderice la lista y seleccionar la opción
    const intervalo = setInterval(() => {
        const opciones = document.querySelectorAll('.k-list-container .k-item');
        if (opciones.length > 0) {
            clearInterval(intervalo);

            // Buscar la opción que coincide con el texto
            const opcion = Array.from(opciones).find(op => op.textContent.trim() === pValor);
            if (opcion) {
                opcion.click(); // Simula la selección
                console.log(`✅ Opción "${pValor}" seleccionada`);
            } else {
                console.warn(`❌ No se encontró la opción "${pValor}"`);
            }
        }
        console.time(pValor)
        console.log('No item...');
        pIntentos++
        if (pIntentos > 25) {
            console.log('Espera agotada...');
            clearInterval(intervalo);
            console.timeEnd(pValor)
        }
    }, 200); // Revisa cada 200ms hasta que aparezca la lista
}
