try {
    window.addEventListener("load", () => {
        try {
            if (validarContenidoURL("crvle")) { mainQueueIC(); return; }

            if (validarContenidoURL("RunCardFilter")) { mainFormRC(); return; }

            if (validarContenidoURL("RunCard.aspx")) { mainPrintRC(); return; }

            if (validarContenidoURL("Error.aspx")) {
                abrirNuevoEnlace('https://vortexreports.intel.com/Index.aspx', '_self');
                return;
            }
        } catch (err) {
            mostrarAlertaError(err);
        }
    }, true);
} catch (err) { mostrarAlertaError(err); }
