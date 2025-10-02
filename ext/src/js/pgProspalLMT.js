function mainProspalLMT() {
    setTimeout(() => {
        console.clear();
        const dataProspal = generarClaseProspal();
        dataProspal.obtenerListaMaterial();
    }, 1500);

}

function generarClaseProspal() {
    const urlParams = obtenerURLActual().searchParams;
    return new ClassProspal(urlParams.get("MRS"), urlParams.get("WWID"), urlParams.get("ITEMS"))
}

