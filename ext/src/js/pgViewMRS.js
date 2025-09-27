function mainViewMRS() {
    const vURL = new URL(window.location);
    const isShipp = obtenerParametroURL(vURL, "id");

    if (isShipp == "ShippingDiv") {
        insertarBotonProspal();
    }
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
    tag.addEventListener('click', obtenerDatosGenerales, false);
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
        const topSection = obtenerObjetoPorID('topSection');
        const panel = obtenerSelectoresPorObjeto(topSection, 'tr').item(0);
        const nvoIcono = generarIcono();
        const nvoBoton = generarBoton(nvoIcono);
        const nvaCelda = generarCelda(nvoBoton);
        nuevoContenedor(panel, [nvaCelda]);
    } catch (error) { console.error(error); }
}

function obtenerDatosGenerales() {
    try {
        const vURL = new URL(window.location);
        const vType = obtenerParametroURL(vURL, "type");
        const mainBody = document.getElementById("bottomSection");
        const vListItems = obtenerListaGeneral(mainBody);
        const datosProspal = {
            "numMRS": obtenerNumeroMRS(mainBody),
            "numWWID": obtenerNumeroWWID(mainBody),
            "listItems": vType == "UNIT" ?
                obtenerProductosPorUnidades(vListItems) :
                obtenerProductosPorCantidad(vListItems)
        };

        abrirEnlaceProspal(datosProspal);
    } catch (error) { console.error(error); }
}

function abrirEnlaceProspal(pParams) {
    const urlProspal = generarNuevaURL("https://prospal-prd.app.intel.com/lbManualTraveler");
    const convertirATexto = JSON.stringify(pParams.listItems);
    agregarParametroURL(urlProspal, "MRS", pParams.numMRS);
    agregarParametroURL(urlProspal, "WWID", pParams.numWWID);
    agregarParametroURL(urlProspal, "ITEMS", codificarValor(convertirATexto));
    abrirNuevoEnlace(urlProspal, "_self")
}

function obtenerNumeroMRS(pMainContent) {
    return pMainContent.children[0].textContent.split(" ").at(2);
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

function obtenerProductosPorUnidades(pList) {
    const listUnidades = pList.map((x) => {
        return { "lot": x.item(7).textContent.trim(), "part": x.item(6).textContent.trim(), "qty": parseInt(x.item(1).textContent.trim()) }
    });

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
    return pList.map((x) => {
        return { "lot": x.item(4).textContent.trim(), "part": x.item(3).textContent.trim(), "qty": parseInt(x.item(1).textContent.trim()) }
    });
}