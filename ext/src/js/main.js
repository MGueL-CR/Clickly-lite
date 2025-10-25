try {
    window.addEventListener("load", () => {
        try {
            if (validarPathname("ICQueue")) { mainQueueIC(); return; }

            if (validarPathname("RunCardFilter.aspx")) { mainFormRC(); return; }

            if (validarPathname("RunCard.aspx")) { mainPrintRC(); return; }

            if (validarContenidoURL("view-printable")) { mainViewMRS(); return; }

            if (validarPathname("lbManualTraveler")) { mainProspalLMT(); return; }

            if (validarPathname("Error.aspx")) { abrirNuevoEnlace(obtenerURLActual().hostname, '_self'); }
        } catch (err) {
            mostrarAlertaError(err);
        }
    }, true);
} catch (err) { mostrarAlertaError(err); }