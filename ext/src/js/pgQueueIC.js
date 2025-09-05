function mainQueueIC() {
    crearPopoverError();
    asignarElementosMarcados();
    if (!leerValorEnSS('items')) {
        establecerFunciones(obtenerTablas());
        completarSelectAssignTo(leerValorEnSS('assigned'));
        mantenerFiltros(leerValorEnSS('porTipo'), leerValorEnSS('porAsignado'));
    }
}

function mantenerFiltros(pTipo, pAsignado) {
    if (pTipo !== 'all' && pTipo !== null) {
        if (obtenerObjetoPorID('cmbType')) {
            establacerContenidoPorID('cmbType', pTipo);
            aplicarFiltroPorTipo(pTipo);
        }
    }
    if (pAsignado !== 'all' && pAsignado !== null) {
        if (obtenerObjetoPorID('cmbAssignTo')) {
            establacerContenidoPorID('cmbAssignTo', pAsignado);
            aplicarFiltroPorAsignado(pAsignado);
        }
    }
}

function obtenerTablas() {
    return [
        { 'id': 'MainContent_AllocatngionsPendingGridView', 'propiedad': abrirEnNuevaVentana, 'evento': eventoDBLClickOtrasTablas },
        { 'id': 'MainContent_CorrelationMirDivGridView', 'propiedad': abrirEnNuevaVentana, 'evento': eventoDBLClickOtrasTablas },
        { 'id': 'MainContent_GridView1', 'propiedad': propiedadesTablaVPO, 'evento': eventoCopiarTablaVPOs, 'evento2': eventoEditarColumna },
        { 'id': 'MainContent_MirLocalGridView', 'propiedad': abrirEnNuevaVentana, 'evento': eventoDBLClickOtrasTablas },
        { 'id': 'MainContent_RANGridView', 'propiedad': propiedadesTablaRAN, 'evento': eventoCopiarTablaRANS },
        { 'id': 'MainContent_ReturnsDivGridView', 'propiedad': propiedadesTablaRetorno, 'evento': eventoCopiarTablaRetornos },
        { 'id': 'MainContent_ShippingGridView', 'propiedad': abrirEnNuevaVentana, 'evento': eventoDBLClickOtrasTablas },
        { 'id': 'MainContent_SourceLotDivGridView', 'propiedad': abrirEnNuevaVentana, 'evento': eventoCopiarTablaSourceLosts }
    ];
}

function establecerFunciones(pTablas) {
    for (const iTabla of pTablas) {
        const nvaTabla = obtenerObjetoPorID(iTabla.id);
        if (nvaTabla) {
            agregarClases(nvaTabla, 'tbl-hover');
            nvaTabla.addEventListener('dblclick', iTabla.evento);
            nvaTabla.addEventListener('keydown', iTabla.evento2);
            for (const fila of obtenerFilas(iTabla.id)) {
                iTabla.propiedad(fila);
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

function registrarElementosMarcados() {
    if (leerValorEnSS('intentos')) {
        const filas = Array.from(obtenerFilas('MainContent_ReturnsDivGridView'));
        const filasFiltradas = filas
            .filter(fila => fila.dataset.mark)
            .map(fila => obtenerHijo(fila, 0).textContent);
        if (filasFiltradas.length > 1) {
            guardarValorEnSS('index', 0);
            guardarValorEnSS('items', filasFiltradas.toString());
            recargarPagina();
        }
    }
}

function asignarElementosMarcados() {
    const itemsActuales = leerValorEnSS('items');
    let valIndex = leerValorEnSS('index') ? parseInt(leerValorEnSS('index')) : 100;

    if (itemsActuales) {
        const elementos = itemsActuales.split(',');
        const nvoItem = elementos[valIndex];

        if (valIndex >= elementos.length) {
            ['items', 'index', 'intentos'].forEach(i => removerValorEnSS(i));
            modificarPropiedad(obtenerObjetoPorID('ReturnsDiv'), 'display', 'block');
            return;
        }

        valIndex++
        guardarValorEnSS('index', valIndex);

        if (leerValorEnSS(nvoItem)) {
            const nvaFila = Array.from(obtenerFilas('MainContent_ReturnsDivGridView'))
                .filter(iFila => obtenerHijo(iFila, 0).textContent.includes(nvoItem));
            const select = obtenerHijo(obtenerHijo(nvaFila[0], 6), 0);
            establacerContenidoPorID(select.id, select[1].value);
            establacerContenidoPorID('__EVENTTARGET', select.name);
            removerValorEnSS(nvoItem);
            obtenerObjetoPorID('form1').submit();
        }
    }
}

function confirmarCopiado(pCol) {
    agregarClases(pCol, 'texto-copiado');
    setTimeout(() => { removerClases(pCol, 'texto-copiado') }, 250);
}

function mostrarMensaje(pCol) {
    try {
        const porCopiar = pCol.textContent;
        const vValor = porCopiar.startsWith('M', 0) ? porCopiar.substring(3, porCopiar.length) : porCopiar;
        copiarValor(vValor);
        confirmarCopiado(pCol);
    } catch (err) { mostrarAlertaError(err) }
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

function copiarLotesAsignados() {
    const filas = Array.from(obtenerFilas('MainContent_ReturnsDivGridView'));
    const filasFiltradas = filas
        .filter(fila => !fila.getAttribute('hidden'))
        .map(fila => obtenerHijo(fila, 0).textContent);

    filasFiltradas.shift();

    if (filasFiltradas.toString().trim() !== '') {
        const listaLotes = filasFiltradas.toString().replace(/,/g, '\n');
        copiarValor(listaLotes);
    }
}

function generarBotonCopiarLotes() {
    const dvGroup = nuevoDIV('dvCopyLots', 'input-group div-btns flex-nowrap');
    const spnText = nuevoSpan('spnCopyLots', 'mx-1', 'Copiar lotes');
    const btnBoton = nuevoBoton('btnCopyLots', 'btn btn-light hd-button', 'Copiar lotes filtrados', '#000');
    btnBoton.addEventListener('click', copiarLotesAsignados);
    nuevoContenedor(btnBoton, [nuevoIcono('icoCopyLots', 'bi bi-pencil-fill'), spnText]);
    nuevoContenedor(dvGroup, [btnBoton]);
    return dvGroup;
}


function generarBotonAutoAsignar() {
    const dvGroup = nuevoDIV('dvAMark', 'input-group div-btns flex-nowrap');
    const spnText = nuevoSpan('spnAMark', 'mx-1', 'Asignar');
    const btnBoton = nuevoBoton('btnAMark', 'btn btn-light hd-button', 'Asignar lineas marcadas', '#000');
    btnBoton.addEventListener('click', registrarElementosMarcados);
    nuevoContenedor(btnBoton, [nuevoIcono('icoAMark', 'bi bi-asterisk'), spnText]);
    nuevoContenedor(dvGroup, [btnBoton]);
    return dvGroup;
}

function eliminarFiltrosActivos() {
    aplicarFiltrosCombinados('all', 'all');
    removerValorEnSS('porTipo');
    removerValorEnSS('porAsignado');
    establacerContenidoPorID('cmbType', 'all');
    establacerContenidoPorID('cmbAssignTo', 'all');
}

function generarBotonResetearFiltros() {
    const dvGroup = nuevoDIV('dvReset', 'input-group div-btns flex-nowrap');
    const spnText = nuevoSpan('spnReset', 'mx-1', 'Sin Filtros');
    const btnBoton = nuevoBoton('btnReset', 'btn btn-light hd-button', 'Borrar filtros activos', '#000');
    btnBoton.addEventListener('click', eliminarFiltrosActivos);
    nuevoContenedor(btnBoton, [nuevoIcono('icoReset', 'bi bi-trash-fill'), spnText]);
    nuevoContenedor(dvGroup, [btnBoton]);
    return dvGroup;
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
    agregarClases(pCol01, 'position-relative,expandir-div');
    const dvFiltro = nuevoDIV('dvType', 'div-group');
    const lblFiltro = nuevoLabel('cmbType', '');
    agregarClases(lblFiltro, 'input-group-text');
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

function propiedadCabeceraDos(pCol02) {
    agregarClases(pCol02, 'position-relative,expandir-div');
    const dvMain = nuevoDIV('dvGeneral', 'div-group');
    const btnCopiar = generarBotonCopiarLotes();
    const btnFiltro = generarBotonResetearFiltros();
    const btnAsignar = generarBotonAutoAsignar();
    nuevoContenedor(dvMain, [btnAsignar, btnFiltro, btnCopiar]);
    //nuevoContenedor(dvMain, [btnCopiar, btnFiltro]);
    nuevoContenedor(pCol02, [dvMain]);
}

function propiedadCabeceraSeis(pCol06) {
    agregarClases(pCol06, 'position-relative,expandir-div');
    const dvFiltro = nuevoDIV('dvAssignTo', 'div-group');
    const lblFiltro = nuevoLabel('cmbAssignTo', '');
    agregarClases(lblFiltro, 'input-group-text');
    const cmbFiltro = nuevoCombo('cmbAssignTo', 'form-select hd-item');
    cmbFiltro.addEventListener('change', (e) => { aplicarFiltroPorAsignado(e.target.value); });
    nuevoContenedor(lblFiltro, [nuevoIcono('icoFiltrar', 'bi bi-funnel-fill')]);
    nuevoContenedor(cmbFiltro, [
        nuevaOpcion('all', '·:: Todos ::·')]);
    nuevoContenedor(dvFiltro, [lblFiltro, cmbFiltro]);
    nuevoContenedor(pCol06, [dvFiltro]);
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

function marcarFilaActual(pFila, pCol01) {
    const col06 = obtenerHijo(pFila, 6);
    const select = obtenerHijo(col06, 0);
    const spnSelect2 = obtenerElementoPorClase(col06, 'select2-selection__rendered')[0];
    const valOpcion = obtenerHijo(select, 1).value;
    const valCol00 = obtenerHijo(pFila, 0).textContent;
    let intentos = leerValorEnSS('intentos') ? parseInt(leerValorEnSS('intentos')) : 0;
    if (pFila.dataset.mark) {
        intentos--;
        removerAtributo(pFila, 'data-mark');
        removerValorEnSS(valCol00);
        establacerContenidoPorID(select.id, 0);
        establacerContenidoPorID(spnSelect2.id, 'None');
    } else {
        if (intentos > 5) { return; }
        intentos++;
        addAtributo(pFila, 'data-mark', 'mark');
        guardarValorEnSS(valCol00, valCol00);
        establacerContenidoPorID(select.id, valOpcion);
        establacerContenidoPorID(spnSelect2.id, select.options[select.selectedIndex].text);
    }
    guardarValorEnSS('intentos', intentos);
    intercambiarClase(pCol01, 'font-weight-bold');
    confirmarCopiado(pCol01);
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

function habilitarEditarColumna(pCol06) {
    agregarClases(pCol06, 'editar-aqui');
    addAtributo(pCol06, 'data-try', 'false');
    addAtributo(pCol06, 'contenteditable', 'true');
}

function eventoEditarColumna(e) {
    if (e.keyCode == 13) { eventosAdicionalesVPO(obtenerPadre(e.target), 'imprimir'); return; }
    if (!isNaN(e.key)) { e.target.dataset.try = 'true'; }
}

function propiedadesTablaRetorno(pFila) {
    if (validarSelector(obtenerHijo(pFila, 0), 'TH')) {
        propiedadCabeceraCero(obtenerHijo(pFila, 0));
        propiedadCabeceraUno(obtenerHijo(pFila, 1));
        propiedadCabeceraDos(obtenerHijo(pFila, 2));
        propiedadCabeceraSeis(obtenerHijo(pFila, 6));
    } else {
        generarListaAsignaciones(obtenerHijo(obtenerHijo(pFila, 6), 0));
    }
}

function eventoCopiarTablaRetornos(e) {
    const fila = obtenerPadre(e.target);
    if (validarSelector(obtenerHijo(fila, 0), "TD")) {
        if (e.target !== obtenerHijo(fila, 1)) {
            mostrarMensaje(obtenerHijo(fila, 0));
            return;
        } marcarFilaActual(fila, e.target);
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
    addAtributo(pCelda, 'data-type', pTipo);
}

function eventoCopiarTablaVPOs(e) {
    const fila = obtenerPadre(e.target);
    const col06 = obtenerHijo(fila, 6);
    if (obtenerHijo(fila, 4).textContent === "Zero Quantity") {
        if (e.target.dataset.action === 'dblclick') {
            if (col06.textContent === '1') {
                eventosAdicionalesVPO(fila, e.target.dataset.type);
            } else if (col06.dataset.try == 'true') {
                removerClases(col06, 'resaltar');
                eventosAdicionalesVPO(fila, e.target.dataset.type);
            } else {
                col06.dataset.try = 'true';
                agregarClases(col06, 'resaltar');
            }
            return;
        }
    }
    if (validarSelector(obtenerHijo(fila, 0), "TD")) {
        mostrarMensaje(obtenerHijo(fila, 1));
    }
}

function propiedadesTablaRAN(pFila) {
    abrirEnNuevaVentana(pFila);
    mostrarLocationRAN(pFila);
}

function mostrarLocationRAN(pFila) {
    if (validarSelector(obtenerHijo(pFila, 0), "TD")) {
        const col04 = obtenerHijo(pFila, 4).textContent;
        const location = isNaN(col04) ? "ACTIVE: RAW" : "ACTIVE: TEMP. INCOMING";

        const col10 = obtenerHijo(pFila, 10);
        agregarClases(col10, "position-relative,expandir-div");

        const nvoDiv = nuevoDIV(col04, "location");
        nvoDiv.textContent = pFila.textContent.includes("Rowell") ? "XXXXX XXX ??" : location;
        nuevoContenedor(col10, [nvoDiv]);
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

function eventoDBLClickOtrasTablas(e) {
    const fila = obtenerPadre(e.target);
    const col01 = obtenerHijo(fila, 0);
    const col11 = obtenerHijo(fila, 11);
    const col13 = obtenerHijo(fila, 13);
    const numOrden = col01.textContent.split(':')[1].trim();
    const tipoOrden = col11.textContent;
    if (e.target === col13) {
        abrirHojaImpresionOtrasTablas(numOrden, tipoOrden);
    } else {
        eventoCopiarOtrasTablas(col01, numOrden);
    }
}

function eventoCopiarOtrasTablas(pCol01, pNumOrden) {
    if (validarSelector(pCol01, 'TD')) {
        copiarValor(pNumOrden);
        confirmarCopiado(pCol01);
    }
}

function abrirHojaImpresionOtrasTablas(pNumOrden, ptipoOrden) {
    const tabActive = obtenerContenidoPorID('MainContent_saveValue');

    if (tabActive.includes('CorrelationMirDiv')) {
        abrirNuevoEnlace(`http://mirweb.intel.com/MIR/MIRRequest.aspx?MRNumber=${pNumOrden}&site=CRML&detail=false`, '_blank')
    } else {
        abrirNuevoEnlace(`https://mms-frontend-prod.app.intel.com//#/view-printable-request/${pNumOrden}/cr?id=${tabActive}&type=${ptipoOrden}`, '_blank')
    }
}