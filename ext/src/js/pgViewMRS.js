function mainViewMRS() {
    window.onload = () => {
        try {
            const vURL = new URL(window.location);
            const isShipp = vURL.searchParams.get("id");
            if (isShipp == "ShippingDiv") {
                const mainBody = document.getElementById("bottomSection");
                const vNumMRS = obtenerNumeroMRS(mainBody);
                const vNumWWID = obtenerNumeroWWID(mainBody);
                const vListItems = obtenerListaGeneral(mainBody);
                const vListProducts = generarListaProductos(vURL, vListItems);
                console.log(vListProducts);
            }
        } catch (error) { console.error(error); }
    };
}

function obtenerNumeroMRS(pMainContent) {
    const numMRS = pMainContent.children[0].textContent.split(" ").at(2);
    return `MRS# ${numMRS}`;
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

function generarListaProductos(pURL, pList) {
    const vType = pURL.searchParams.get("type");
    return vType == "UNIT" ? obtenerProductosPorUnidades(pList) : obtenerProductosPorCantidad(pList);
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