function mainPrintRC() {
    crearPopoverError();
    transformarNombre();
    completarCampos();
}

function transformarNombre() {
    try {
        const tablaDescriptiva = obtenerSelectorPorIndice("table", 2);
        const campoTitulo = obtenerSelectorPorObjeto(tablaDescriptiva, "tr td");
        const nombreProducto = campoTitulo.textContent.split("-");

        campoTitulo.id = "nombreProducto";
        removerAtributo(campoTitulo, 'align');
        establecerTextoPorId(campoTitulo.id, '');

        const prt01 = nuevoSpan('nom01', 'nom01', nombreProducto.shift().trim());
        const prt02 = nuevoSpan('nom02', 'nom02', nombreProducto
            .toString()
            .trim()
            .replace(/,/g, "-"));

        const marcoTitulo = nuevoDIV("tituloRC", "marcoTitulo");
        nuevoContenedor(marcoTitulo, [prt01, prt02]);
        nuevoContenedor(campoTitulo, [marcoTitulo]);
    } catch (err) {
        mostrarAlertaError(err);
    }
}

function propiedadesTextArea(pInfo) {
    try {
        const txtDetalles = obtenerObjetoPorID(
            "ContentPlaceHolder1_RunCardDataList_vpodescriptionLabel_0"
        );
        const nvaDescripcion = {
            'original': txtDetalles.value.trim(), 'adicional': pInfo,
            'usuario': obtenerValorPorID('ConnectedVortexUser').includes('mejias1x'),
            'listaLotes': formatoLista(txtDetalles.value.trim().split(';'))
        };
        ["style", "rows", "cols", "heigth", "readonly"].forEach(iAttr => {
            removerAtributo(txtDetalles, iAttr);
        });
        txtDetalles.value = nvaDescripcion.usuario ? `${nvaDescripcion.original} ${nvaDescripcion.adicional} ${nvaDescripcion.listaLotes}` : `${nvaDescripcion.original} ${nvaDescripcion.adicional}\n`;
    } catch (err) {
        mostrarAlertaError(err);
    }
}

function completarCampos() {
    const getData = leerValorEnSS("WOTemp");

    if (getData !== null) {
        const getVPO = recuperarVPO(getData);
        propiedadesTextArea(getVPO.mostrarInformacion());
        setTimeout(() => {
            window.print();
            iniciarTemporizador();
        }, 3000);
    }
}

function iniciarTemporizador() {
    const rgx = /(\d+)/g;
    const titulo = document.querySelector('head title');
    titulo.textContent = `[ Cerrando en: 04s... ]`;

    const conteo = setInterval(() => {
        const valor = titulo.textContent.trim();
        const newValor = Number.parseInt(valor.match(rgx)[0]) - 1;
        titulo.textContent = `[ Cerrando en: 0${newValor}s... ]`;
    }, 1000);

    const runTimer = setTimeout(() => {
        clearInterval(conteo);
        window.close();
    }, 3500);

    obtenerObjetoPorID('form1').addEventListener('dblclick', () => {
        titulo.textContent = '.::Reports:.'
        clearTimeout(runTimer);
        clearInterval(conteo);
    }, false);

    window.addEventListener('beforeunload', () => {
        clearTimeout(runTimer);
        clearInterval(conteo);
    });
}