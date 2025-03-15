function mainFormRC() {
    crearPopoverError();
    completarFormulario();
}

function completarFormulario() {
    const getData = obtenerParametroActual();

    if (typeof getData !== "undefined") {
        const getVPO = recuperarVPO(getData);

        try {
            getVPO.guardarVPO();
            establecerValorPorID("ContentPlaceHolder1_VpoNumberTextBox", getVPO.numero);
            establecerValorPorID("ContentPlaceHolder1_UnitsPerBoxTextBox", getVPO.caja);
            obtenerObjetoPorID("ContentPlaceHolder1_DisplayButton").click();
        } catch (err) {
            mostrarAlertaError(err);
        }
    }
}

