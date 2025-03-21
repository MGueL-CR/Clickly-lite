function mainQueueIC() {
    crearPopoverError();
    establecerFunciones(obtenerTablas());
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
        if (obtenerHijo(fila, 0).textContent !== 'Lot') {
            obtenerHijo(fila, 0).innerHTML = obtenerHijo(fila, 0).textContent.replace(regExp, '<mark>$1</mark>');
            if (obtenerHijo(fila, 0).innerHTML.includes('mark')) {
                fila.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
}

function aplicarFiltro(pFiltro) {
    for (const fila of obtenerFilas('MainContent_ReturnsDivGridView')) {
        if (obtenerHijo(fila, 0).textContent !== 'Lot') {
            if (obtenerHijo(fila, 1).textContent !== pFiltro && pFiltro !== 'all') {
                addAtributo(fila, 'hidden', true);
                removerClases(fila, 'desfiltrar-linea');
                agregarClases(fila, 'filtrar-linea');
            } else {
                removerClases(fila, 'filtrar-linea');
                agregarClases(fila, 'desfiltrar-linea');
                removerAtributo(fila, 'hidden', false);
            }
        }
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
    const dvFiltro = nuevoDIV('dvFiltro', 'div-group');
    const lblFiltro = nuevoLabel('cmbFiltro', '');
    lblFiltro.className = 'input-group-text';
    const cmbFiltro = nuevoCombo('cmbFiltro', 'form-select hd-item');
    cmbFiltro.addEventListener('change', () => { aplicarFiltro(cmbFiltro.value); });
    nuevoContenedor(lblFiltro, [nuevoIcono('icoFiltrar', 'bi bi-funnel-fill')]);
    nuevoContenedor(cmbFiltro, [
        nuevaOpcion('all', 'Todos...'),
        nuevaOpcion('Correlation MIR', 'Correlations'),
        nuevaOpcion('ISSUE', 'VPOs'),
        nuevaOpcion('MIR Local Lab', 'Internals'),
        nuevaOpcion('Zero Quantity', 'Zero Quantity')]);
    nuevoContenedor(dvFiltro, [lblFiltro, cmbFiltro]);
    nuevoContenedor(pCol01, [dvFiltro]);
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
    }
}

function eventoCopiarTablaRetornos(e) {
    const fila = obtenerPadre(e.target);
    if (validarSelector(obtenerHijo(fila, 0), "TD")) {
        mostrarMensaje(obtenerHijo(fila, 0));
    }
}

function propiedadesTablaVPO(pFila) {
    abrirEnNuevaVentana(pFila);

    if (obtenerHijo(pFila, 4).textContent === "Zero Quantity") {
        habilitarEditarColumna(obtenerHijo(pFila, 6));
        agregarClases(obtenerHijo(pFila, 10), 'copiar-aqui');
        agregarClases(obtenerHijo(pFila, 11), 'copiar-aqui');
    }
}

function eventoCopiarTablaVPOs(e) {
    const fila = obtenerPadre(e.target);
    if (obtenerHijo(fila, 4).textContent === "Zero Quantity") {
        if (e.target == obtenerHijo(fila, 10)) {
            eventosAdicionalesVPO(fila, 'copiar');
            return;
        }
        if (e.target == obtenerHijo(fila, 11)) {
            eventosAdicionalesVPO(fila, 'imprimir');
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