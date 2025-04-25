function mainQueueIC() {
    crearPopoverError();
    establecerFunciones(obtenerTablas());
    completarSelectAssignTo(leerValorEnSS('assigned'));
    mantenerFiltros(leerValorEnSS('porTipo'), leerValorEnSS('porAsignado'));
}

function mantenerFiltros(pTipo, pAsignado) {
    if (pTipo !== 'all' && pTipo !== null) {
        if (obtenerObjetoPorID('cmbType')) {
            establecerValorPorID('cmbType', pTipo);
            aplicarFiltroPorTipo(pTipo);
        }
    }
    if (pAsignado !== 'all' && pAsignado !== null) {
        if (obtenerObjetoPorID('cmbAssignTo')) {
            establecerValorPorID('cmbAssignTo', pAsignado);
            aplicarFiltroPorAsignado(pAsignado);
        }
    }
}

function obtenerTablas() {
    return {
        'MainContent_AllocatngionsPendingGridView': [abrirEnNuevaVentana, eventoCopiarOtrasTablas],
        'MainContent_CorrelationMirDivGridView': [abrirEnNuevaVentana, eventoCopiarOtrasTablas],
        'MainContent_GridView1': [propiedadesTablaVPO, eventoCopiarTablaVPOs],
        'MainContent_MirLocalGridView': [abrirEnNuevaVentana, eventoCopiarOtrasTablas],
        'MainContent_RANGridView': [abrirEnNuevaVentana, eventoCopiarTablaRANS],
        'MainContent_ReturnsDivGridView': [propiedadesTablaRetorno, eventoCopiarTablaRetornos],
        'MainContent_ShippingGridView': [abrirEnNuevaVentana, eventoCopiarOtrasTablas],
        'MainContent_SourceLotDivGridView': [abrirEnNuevaVentana, eventoCopiarTablaSourceLosts],
    };
}

function establecerFunciones(pTablas) {
    for (const idTabla in pTablas) {
        const nvaTabla = obtenerObjetoPorID(idTabla);
        if (nvaTabla) {
            agregarClases(nvaTabla, 'tbl-hover');
            nvaTabla.addEventListener('dblclick', pTablas[idTabla][1]);
            for (const fila of obtenerFilas(idTabla)) {
                pTablas[idTabla][0](fila);
            }
        }
    }
}

function resaltarTexto(e) {
    const regExp = e.target.value.length > 2 ? new RegExp(`(${e.target.value})`, 'gi') : undefined;
    for (const fila of obtenerFilas('MainContent_ReturnsDivGridView')) {
        const col01 = obtenerHijo(fila, 0);
        if (col01.textContent !== 'Lot') {
            col01.innerHTML = col01.textContent.replace(regExp, '<mark>$1</mark>');
            if (col01.innerHTML.includes('mark')) {
                setTimeout(() => { col01.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' }) }, 1000);
            }
        }
    }
}

function aplicarFiltrosCombinados(pTipo, pAsignado) {
    for (const fila of obtenerFilas('MainContent_ReturnsDivGridView')) {
        if (obtenerHijo(fila, 0).textContent !== 'Lot') {
            const cumpleTipo = pTipo === 'all' || obtenerHijo(fila, 1).textContent === pTipo;
            const cumpleAsignado = pAsignado === 'all' || obtenerHijo(obtenerHijo(fila, 6), 0).value === pAsignado;
            if (cumpleTipo && cumpleAsignado) {
                removerAtributo(fila, 'hidden', false);
            } else {
                addAtributo(fila, 'hidden', true);
            }
        }
    }
}

function aplicarFiltroPorTipo(pFiltro) {
    guardarValorEnSS('porTipo', pFiltro);
    const porAsignado = leerValorEnSS('porAsignado') || 'all';
    aplicarFiltrosCombinados(pFiltro, porAsignado);
}

function aplicarFiltroPorAsignado(pFiltro) {
    guardarValorEnSS('porAsignado', pFiltro);
    const porTipo = leerValorEnSS('porTipo') || 'all';
    aplicarFiltrosCombinados(porTipo, pFiltro);
}

function asignarElementosMarcados() {
    const filas = Array.from(obtenerFilas('MainContent_ReturnsDivGridView'));
    const esteForm = obtenerObjetoPorID('form1');
    let marcadores = '';
    const filasMarcadas = filas
        .filter(fila => fila.dataset.mark)
        .map((fila) => {
            const select = obtenerHijo(obtenerHijo(fila, 6), 0);
            const nameSelect = select.name;
            marcadores += `${select.name} `;
            console.log(nameSelect)
            removerClases(obtenerHijo(fila, 3), 'font-weight-bold');
        });

    if (filasMarcadas.length > 1) {
        alert(`Seran asignadas a ${obtenerObjetoPorID('Username_label').textContent}: ${filasMarcadas.length} ordenes.`)
        esteForm.__EVENTTARGET.type = 'text';
        esteForm.__EVENTTARGET.value = marcadores.trim().replace(/ /g, ',');
        console.log(esteForm.__EVENTTARGET.value);
        console.log(filasMarcadas)
        esteForm.submit();
    }
}

function confirmarCopiado(pCol) {
    agregarClases(pCol, 'texto-copiado');
    setTimeout(() => {
        removerClases(pCol, 'texto-copiado');
    }, 250);
}

function mostrarMensaje(pCol) {
    try {
        const porCopiar = pCol.textContent;
        const vValor = porCopiar.startsWith('M', 0) ? porCopiar.substring(3, porCopiar.length) : porCopiar;
        copiarValor(vValor);
        confirmarCopiado(pCol);
    } catch (err) {
        mostrarAlertaError(err);
    }
}

function genernarComentarioRAN(pRAN, pBOL, pNombre) {
    const comment = {
        'numRAN': pRAN.split(':')[1].trim(),
        'tipoBOL': isNaN(pBOL.trim()) ? "BLS" : "ISM",
        'numBOL': pBOL.trim(),
        'firma': obtenerIniciales(pNombre)
    };
    return `RAN ${comment.numRAN} ${comment.tipoBOL} ${comment.numBOL} ${comment.firma}`;
}

function obtenerIniciales(pUser) {
    const nUser = {
        'nombres': pUser.split(',')[1].trim().split(' '),
        'apellidos': pUser.split(',')[0].trim().split(' ')
    };
    const iniciales = `${nUser.nombres[0][0]}${nUser.apellidos[0][0]}${nUser.apellidos[1][0]}`
    return nUser.apellidos.length > 2 ? 'RMD' : iniciales;
}

function propiedadCabeceraCero(pCol00) {
    agregarClases(pCol00, 'position-relative,expandir-div');
    const dvBuscar = nuevoDIV('dvBuscar', 'div-group');
    const lblBuscar = nuevoLabel('txtBuscar', '');
    agregarClases(lblBuscar, 'input-group-text');
    const txtBuscar = nuevoInput('text', 'txtBuscar', 'txtBuscar', 'form-control hd-item');
    txtBuscar.placeholder = 'J504030';
    txtBuscar.addEventListener('input', resaltarTexto);
    nuevoContenedor(lblBuscar, [nuevoIcono('icoBuscar', 'bi bi-search')]);
    nuevoContenedor(dvBuscar, [lblBuscar, txtBuscar]);
    nuevoContenedor(pCol00, [dvBuscar]);
}

function propiedadCabeceraUno(pCol01) {
    pCol01.className = 'position-relative expandir-div';
    const dvFiltro = nuevoDIV('dvType', 'div-group');
    const lblFiltro = nuevoLabel('cmbType', '');
    lblFiltro.className = 'input-group-text';
    const cmbFiltro = nuevoCombo('cmbType', 'form-select hd-item');
    cmbFiltro.addEventListener('change', (e) => { aplicarFiltroPorTipo(e.target.value); });
    nuevoContenedor(lblFiltro, [nuevoIcono('icoFiltrar', 'bi bi-funnel-fill')]);
    nuevoContenedor(cmbFiltro, [
        nuevaOpcion('all', '·:: Todos ::·'),
        nuevaOpcion('Correlation MIR', 'Correlations'),
        nuevaOpcion('ISSUE', 'VPOs (ISSUE)'),
        nuevaOpcion('MIR Local Lab', 'Internals'),
        nuevaOpcion('Zero Quantity', 'Zero Quantity')]);
    nuevoContenedor(dvFiltro, [lblFiltro, cmbFiltro]);
    nuevoContenedor(pCol01, [dvFiltro]);
}

function propiedadCabeceraTres(pCol03) {
    agregarClases(pCol03, 'position-relative,expandir-div');
    const dvMark = nuevoDIV('dvMark', 'div-group px-1');
    const btnMark = nuevoBoton('btnMark', 'btn-link hd-item text-dark', 'Auto-asignarme', '#000');
    btnMark.addEventListener('click', asignarElementosMarcados)
    nuevoContenedor(btnMark, [nuevoIcono('icoReset', 'bi bi-asterisk')]);
    nuevoContenedor(dvMark, [btnMark]);
    nuevoContenedor(pCol03, [dvMark]);
}

function propiedadCabeceraSeis(pCol06) {
    pCol06.className = 'position-relative expandir-div';
    const dvFiltro = nuevoDIV('dvAssignTo', 'div-group');
    const lblFiltro = nuevoLabel('cmbAssignTo', '');
    lblFiltro.className = 'input-group-text';
    const cmbFiltro = nuevoCombo('cmbAssignTo', 'form-select hd-item');
    cmbFiltro.addEventListener('change', (e) => { aplicarFiltroPorAsignado(e.target.value); });
    nuevoContenedor(lblFiltro, [nuevoIcono('icoFiltrar', 'bi bi-funnel-fill')]);
    nuevoContenedor(cmbFiltro, [
        nuevaOpcion('all', '·:: Todos ::·')]);
    nuevoContenedor(dvFiltro, [lblFiltro, cmbFiltro]);
    nuevoContenedor(pCol06, [dvFiltro]);
}

function propiedadCabeceraSiete(pCol07) {
    pCol07.className = 'position-relative expandir-div';
    const dvReset = nuevoDIV('dvReset', 'div-group');
    const lblReset = nuevoLabel('btnReset', '');
    agregarClases(lblReset, 'input-group-text');
    const spnReset = nuevoSpan('spnReset', 'mx-1', 'Borrar');
    const btnReset = nuevoBoton('btnReset', 'btn-light hd-item', 'Borrar filtros', '#000');
    btnReset.addEventListener('click', () => {
        aplicarFiltrosCombinados('all', 'all');
        removerValorEnSS('porTipo');
        removerValorEnSS('porAsignado');
        establecerValorPorID('cmbType', 'all');
        establecerValorPorID('cmbAssignTo', 'all');
    })
    nuevoContenedor(lblReset, [nuevoIcono('icoReset', 'bi bi-trash-fill')])
    nuevoContenedor(btnReset, [spnReset]);
    nuevoContenedor(dvReset, [lblReset, btnReset]);
    nuevoContenedor(pCol07, [dvReset]);
}

function completarSelectAssignTo(pLista) {
    if (pLista) {
        [...new Set(pLista.split(';'))].forEach(item => {
            if (item.trim()) {
                const nvaOpcion = nuevaOpcion(item.split(':')[1], item.split(':')[0]);
                nuevoContenedor(obtenerObjetoPorID('cmbAssignTo'), [nvaOpcion]);
            }
        });
        removerValorEnSS('assigned');
    }
}

function generarListaAsignaciones(pSelect) {
    let lstAsignados = leerValorEnSS('assigned') === null ? "" : leerValorEnSS('assigned');
    lstAsignados += `${(pSelect.options[pSelect.selectedIndex].text)}:${pSelect.value};`;
    guardarValorEnSS('assigned', lstAsignados);
}

function marcarFilaActual(pCol03) {
    const fila = obtenerPadre(pCol03);
    if (fila.dataset.mark) {
        removerAtributo(fila, 'data-mark');
    } else {
        addAtributo(fila, 'data-mark', 'mark');
    }
    intercambiarClase(pCol03, 'font-weight-bold');
    confirmarCopiado(pCol03);
}

function abrirEnNuevaVentana(pFila) {
    const nvaCol = obtenerHijo(pFila, 0);
    if (validarSelector(nvaCol, 'TD')) {
        addAtributo(obtenerHijo(nvaCol, 0), 'target', '_blank');
    }
}

function eventosAdicionalesVPO(pFila, pBoton) {
    try {
        const nvaVPO = crearVPO(pFila);
        if (nvaVPO.cantidad !== null) {
            copiarValor(nvaVPO.obtenerComentario());
            if (pBoton === "imprimir") {
                abrirNuevoEnlace(nvaVPO.generarEnlace(), "_blank");
            }
        }
        confirmarCopiado(pFila);
    } catch (err) {
        mostrarAlertaError(err);
    }
}

function habilitarEditarColumna(pCol) {
    agregarClases(pCol, 'editar-aqui');
    addAtributo(pCol, 'contenteditable', 'true');
}

function propiedadesTablaRetorno(pFila) {
    if (validarSelector(obtenerHijo(pFila, 0), 'TH')) {
        propiedadCabeceraCero(obtenerHijo(pFila, 0));
        propiedadCabeceraUno(obtenerHijo(pFila, 1));
        propiedadCabeceraTres(obtenerHijo(pFila, 3));
        propiedadCabeceraSeis(obtenerHijo(pFila, 6));
        propiedadCabeceraSiete(obtenerHijo(pFila, 7));
    } else {
        generarListaAsignaciones(obtenerHijo(obtenerHijo(pFila, 6), 0));
    }
}

function eventoCopiarTablaRetornos(e) {
    const fila = obtenerPadre(e.target);
    if (validarSelector(obtenerHijo(fila, 0), "TD")) {
        if (e.target !== obtenerHijo(fila, 3)) {
            mostrarMensaje(obtenerHijo(fila, 0));
            return;
        }
        marcarFilaActual(e.target);
    }
}

function propiedadesTablaVPO(pFila) {
    abrirEnNuevaVentana(pFila);

    if (obtenerHijo(pFila, 4).textContent === "Zero Quantity") {
        habilitarEditarColumna(obtenerHijo(pFila, 6));
        propiedadesCeldas(obtenerHijo(pFila, 10), 'copiar');
        propiedadesCeldas(obtenerHijo(pFila, 11), 'imprimir');
    }
}

function propiedadesCeldas(pCelda, pTipo) {
    agregarClases(pCelda, 'copiar-aqui');
    addAtributo(pCelda, 'data-action', 'dblclick');
    addAtributo(pCelda, 'data-try', 'false');
    addAtributo(pCelda, 'data-type', pTipo);
}

function eventoCopiarTablaVPOs(e) {
    const fila = obtenerPadre(e.target);
    const col06 = obtenerHijo(fila, 6);
    if (obtenerHijo(fila, 4).textContent === "Zero Quantity") {
        if (e.target.dataset.action === 'dblclick') {
            if (col06.textContent === '1') {
                eventosAdicionalesVPO(fila, e.target.dataset.type);
            } else if (e.target.dataset.try == 'true') {
                removerClases(col06, 'resaltar');
                eventosAdicionalesVPO(fila, e.target.dataset.type);
            } else {
                e.target.dataset.try = 'true';
                copiarValor('##### CONFIRMAR ###### CANTIDAD #####')
                agregarClases(col06, 'resaltar');
            }
            return;
        }
    }
    if (validarSelector(obtenerHijo(fila, 0), "TD")) {
        mostrarMensaje(obtenerHijo(fila, 1));
    }
}

function eventoCopiarTablaRANS(e) {
    const fila = obtenerPadre(e.target);
    if (validarSelector(obtenerHijo(fila, 0), "TD") && obtenerHijo(fila, 10).textContent.trim() !== '') {
        copiarValor(genernarComentarioRAN(
            obtenerHijo(fila, 0).textContent,
            obtenerHijo(fila, 4).textContent,
            obtenerHijo(fila, 10).textContent
        ));
        confirmarCopiado(fila);
    }
}

function eventoCopiarTablaSourceLosts(e) {
    const fila = obtenerPadre(e.target);
    if (validarSelector(obtenerHijo(fila, 0), "TD")) {
        mostrarMensaje(obtenerHijo(fila, 1));
    }
}

function eventoCopiarOtrasTablas(e) {
    const fila = obtenerPadre(e.target);
    const col01 = obtenerHijo(fila, 0);
    if (validarSelector(col01, 'TD')) {
        copiarValor(col01.textContent.split(':')[1].trim());
        confirmarCopiado(col01);
    }
}