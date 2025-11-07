function paginaMRSLista(continuarProceso) {
    const nvoObserver = new MutationObserver(() => {
        const vNode = document.getElementById("topNavigationBar");
        if (vNode) {
            nvoObserver.disconnect();
            continuarProceso();
        }
    });

    nvoObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

function mainViewMRS() {
    try {
        if (leerDatosURL().vId == "ShippingDiv") {
            crearPopoverError();
            insertarBotonProspal();
        }
    } catch (err) { mostrarAlertaError(error); }
}

function leerDatosURL() {
    const vURL = obtenerURLActual();
    const paramsString = vURL.hash.split('?').at(1);
    const vParms = new URLSearchParams(paramsString);
    return {
        "vId": vParms.get("id"), "vType": vParms.get("type"), "vMrs": vParms.get("mrs")
    };
}

function generarIcono() {
    const tag = nuevoIcono("icoProspal", "intelicon-shopping-cart");
    addAtributo(tag, "_ngcontent-pej-c3", "");
    addAtributo(tag, "aria-hidden", "true");
    return tag;
}

function generarBoton(pIcono) {
    const tag = nuevoBoton("btnProspal", "btn btn-outline-primary btn-sm button", "Abrir Prospal", "");
    addAtributo(tag, "_ngcontent-pej-c3", "");
    tag.textContent = "Abrir Prospal ";
    tag.addEventListener('click', abrirEnlaceProspal, false);
    nuevoContenedor(tag, [pIcono]);
    return tag;
}

function generarCelda(pBoton) {
    const tag = crearElemento('td');
    addAtributo(tag, "_ngcontent-pej-c3", "");
    addAtributo(tag, "align", "right");
    nuevoContenedor(tag, [pBoton]);
    return tag;
}

function insertarBotonProspal() {
    try {
        paginaMRSLista(() => {
            const topSection = obtenerObjetoPorID('topSection');
            const panel = obtenerSelectoresPorObjeto(topSection, 'tr').item(0);
            const nvoIcono = generarIcono();
            const nvoBoton = generarBoton(nvoIcono);
            const nvaCelda = generarCelda(nvoBoton);
            nuevoContenedor(panel, [nvaCelda]);
        });
    } catch (error) { mostrarAlertaError(error); }
}

function obtenerDatosGenerales() {
    try {
        const { vMrs, vType } = leerDatosURL();
        const mainBody = document.getElementById("bottomSection");
        const vListItems = obtenerListaGeneral(mainBody);
        return {
            "numMRS": vMrs,
            "numWWID": obtenerNumeroWWID(mainBody),
            "listItems": vType == "UNIT" ?
                obtenerProductosPorUnidades(vListItems) :
                obtenerProductosPorCantidad(vListItems)
        };
    } catch (error) { mostrarAlertaError(error); }
}

function abrirEnlaceProspal() {
    const datosProspal = obtenerDatosGenerales();
    const urlProspal = generarNuevaURL("https://prospal-prd.app.intel.com/lbManualTraveler");
    const convertirATexto = JSON.stringify(datosProspal.listItems);
    agregarParametroURL(urlProspal, "MRS", datosProspal.numMRS);
    agregarParametroURL(urlProspal, "WWID", datosProspal.numWWID);
    agregarParametroURL(urlProspal, "ITEMS", codificarValor(convertirATexto));
    abrirNuevoEnlace(urlProspal, "_self")
}

function obtenerNumeroWWID(pMainContent) {
    const tableContent = pMainContent.querySelector("TABLE");
    const rows = Array.from(tableContent.rows);
    const item = rows.filter(x => x.textContent.includes("WWID"));
    return item.at(0).cells.item(1).textContent.trim();
}

function obtenerListaGeneral(pMainContent) {
    const tableContent = pMainContent.querySelectorAll("TABLE").item(2);
    const rows = Array.from(tableContent.rows).slice(1);
    return rows.map(x => x.children);
}

function generarListaProductos(pList, pIdxLot, pIdxPart, pIdxQty) {
    return pList.map((x) => {
        return {
            "lot": x.item(pIdxLot).textContent.trim(),
            "part": x.item(pIdxPart).textContent.trim(),
            "qty": parseInt(x.item(pIdxQty).textContent.trim())
        }
    });
}

function obtenerProductosPorUnidades(pList) {
    const listUnidades = generarListaProductos(pList, 7, 6, 1);

    const listProductos = Object.values(listUnidades.reduce((lote, unidad) => {
        if (lote[unidad.lot]) {
            lote[unidad.lot].qty += unidad.qty;
        } else {
            lote[unidad.lot] = { ...unidad };
        }
        return lote;
    }, {}));
    return listProductos;
}

function obtenerProductosPorCantidad(pList) {
    return generarListaProductos(pList, 4, 3, 1);
}