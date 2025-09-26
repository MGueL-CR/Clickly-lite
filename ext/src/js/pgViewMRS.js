function mainViewMRS() {
    const vURL = new URL(window.location);
    const isShipp = vURL.searchParams.get("id");
    const vType = vURL.searchParams.get("type");

    if (isShipp == "ShippingDiv") {
        insertarBotonProspal();
    }
}

function insertarBotonProspal() {
    const panel = document.getElementById('topSection').querySelectorAll('tr').item(0);
    const nvoIcono = nuevoIcono("icoProspal", "intelicon-send");
    addAtributo(nvoIcono, "_ngcontent-pej-c3", "");
    addAtributo(nvoIcono, "aria-hidden", "true");
    const nvoBoton = nuevoBoton("btnProspal", "btn btn-outline-primary btn-sm button", "Abrir Prospal", "");
    addAtributo(nvoBoton, "_ngcontent-pej-c3", "");
    nvoBoton.textContent = "Abrir Prospal";
    nuevoContenedor(nvoBoton, [nvoIcono]);
    const columna = crearElemento('td');
    addAtributo(columna, "_ngcontent-pej-c3", "");
    addAtributo(columna, "align", "right");
    nuevoContenedor(columna, [nvoBoton]);
    nuevoContenedor(panel, [columna]);



    console.log(nvoBoton)
}


function obtenerDatosGenerales() {
    try {
        const mainBody = document.getElementById("bottomSection");
        const vNumMRS = obtenerNumeroMRS(mainBody);
        const vNumWWID = obtenerNumeroWWID(mainBody);
        const vListItems = obtenerListaGeneral(mainBody);
        const vListProducts = vType == "UNIT" ? obtenerProductosPorUnidades(vListItems) : obtenerProductosPorCantidad(vListItems);
    } catch (error) { console.error(error); }
}

function obtenerNumeroMRS(pMainContent) {
    const numMRS = pMainContent.children[0].textContent.split(" ").at(2);
    return numMRS;
}

function obtenerNumeroWWID(pMainContent) {
    const tableContent = pMainContent.querySelector("TABLE").children[0];
    const rows = Array.from(tableContent.children);
    const item = rows.filter(x => x.textContent.includes("WWID"));
    const numWWID = item.at(0).children[1].textContent.trim();
    return numWWID;
}

function obtenerListaGeneral(pMainContent) {
    const tableContent = pMainContent.querySelectorAll("TABLE")[2].children[0];
    const rows = Array.from(tableContent.children).filter(x => !x.textContent.includes("#"));
    const listItems = rows.map(x => x.children);
    return listItems;
}

function obtenerProductosPorUnidades(pList) {
    const listUnidades = pList.map((x) => {
        return { "lot": x[7].textContent.trim(), "part": x[6].textContent.trim(), "qty": parseInt(x[1].textContent.trim()) }
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
        return { "lot": x[4].textContent.trim(), "part": x[3].textContent.trim(), "qty": x[1].textContent.trim() }
    });
}


// ?id=ShippingDiv&type=UNIT
// ?id=ShippingDiv&type=QUANTITY