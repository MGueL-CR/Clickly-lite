try {
    window.addEventListener("load", () => {
        try {
            if (validarContenidoURL("crvle-vporequests")) { mainQueueIC(); return; }
    
            if (validarContenidoURL("RunCardFilter")) { mainFormRC(); return; }
    
            if (validarContenidoURL("RunCard.aspx")) { mainPrintRC(); return; }
    
            if (validarContenidoURL("Error.aspx")) { 
                abrirNuevoEnlace('http://vortexreports.intel.com/Index.aspx', '_self');
                return; }
        } catch (err) {
            mostrarAlertaError(err);
        }
    }, true);
} catch (err) { mostrarAlertaError(err); }