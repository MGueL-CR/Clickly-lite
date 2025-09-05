function mainFormRC() {
    crearPopoverError();
    completarFormulario();
}

function completarFormulario() {
    const getParams = obtenerParametrosURL();

    if (typeof getParams !== "undefined") {
        const data = decodificarValor(getParams.get('obj'));
        const getVPO = recuperarVPO(data);

        try {
            getVPO.guardarVPO();
            establacerContenidoPorID("ContentPlaceHolder1_VpoNumberTextBox", getVPO.numero);
            establacerContenidoPorID("ContentPlaceHolder1_UnitsPerBoxTextBox", getVPO.caja);
            obtenerObjetoPorID("ContentPlaceHolder1_DisplayButton").click();
        } catch (err) {
            mostrarAlertaError(err);
        }
    }
}

