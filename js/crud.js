const llave = "productos";

function listar() {
    let listado = cargarDatos();

    listado = listarOrdenado(burbuja(listado, 'id', 1));
    listado[llave].forEach(element => {
        agregarFilaTabla(element);
    });
}

function crear() {
    return save(extraerDesdeFormulario(), true);
}

function actualizar() {
    return save(extraerDesdeFormulario(), false);
}

function eliminar() {
    let objeto = cargar();

    if (objeto != null) {
        let listado = cargarDatos();

        listado[llave].forEach(element => {
            if (element.id == objeto.id) {
                listado[llave].splice(element);
                setItem(listado);
                window.alert("Producto con id '" + element.id + "' ha sido eliminado.");
            }
        });
    }
}

function consultar() {
    let objeto = cargar();
    if (objeto != null) {
        let camposFormulario = document.getElementsByName("campo");
        camposFormulario.forEach(element => {
            element.value = objeto[element.id];
        });
    }
}

function inicio() {
    window.location = "../index.html";
}

function extraerDesdeFormulario() {
    let camposFormulario = document.getElementsByName("campo");
    let valores = "";
    let valido = true;

    camposFormulario.forEach(element => {
        let id = element.id;
        let value = element.type == "number" ? element.value : '"' + element.value + '"';

        if (value == '' || value == '""') {
            window.alert(id + " es requerido");
            valido = false;
        }

        valores = valores + '"' + id + '":' + value + ",";
    });
    if (valido) {
        valores = "{" + valores.substring(0, valores.length - 1) + "}";

        return JSON.parse(valores);
    } else {
        return null;
    }
}

function save(objeto, crear) {
    if (objeto != null) {
        let listado = cargarDatos();
        let valido = true;

        listado[llave].forEach(element => {
            if (element.id == objeto.id) {
                if (crear) {
                    window.alert("Producto con id '" + element.id + "' ya existe.");
                    valido = false;
                    return false;
                } else {
                    listado[llave].splice(listado[llave].indexOf(element), 1);
                    listado[llave].push(objeto);
                    setItem(listado);
                    window.alert("Producto actualizado.");
                    return true;
                }
            }
        });

        if (valido) {
            if (crear) {
                listado[llave].push(objeto);
                setItem(listado);
                window.alert("Producto guardado.");
            }
            return true;
        } else {
            return false;
        }
    }
}

function cargar() {
    let id = document.getElementById('id').value;

    if (id == '' || id == undefined || id == null) {
        window.alert("El id es requerido para la consulta.");
        return null;
    }

    let listado = cargarDatos();
    let objeto = null;

    listado[llave].forEach(element => {
        if (element.id == id) {
            objeto = element;
            return;
        }
    });

    if (objeto == null) {
        window.alert("Producto con id '" + id + "' no existe");
    }

    return objeto;
}
function cargarDatos() {
    let listado = getItem();
    if (listado == null) {
        setItem(JSON.parse('{"' + llave + '": []}'));
        listado = getItem();
    }
    return listado;
}

function ascendente() {
    let listado = cargarDatos();
    listarOrdenado(burbuja(listado, 'precio', 1));
}

function descendente() {
    let listado = cargarDatos();
    listarOrdenado(burbuja(listado, 'precio', -1));
}

function burbuja(listado, criterio, orden) {
    let n, i, k, aux;
    n = listado[llave].length;

    for (k = 1; k < n; k++) {
        for (i = 0; i < (n - k); i++) {
            let item = listado[llave][i];
            let item2 = listado[llave][i + 1];
            if (compararPrecios(item[criterio], item2[criterio]) == orden) {
                aux = listado[llave][i];
                listado[llave][i] = listado[llave][i + 1];
                listado[llave][i + 1] = aux;
            }
        }
    }
    return listado;
}

const compararPrecios = (precio1, precio2) => {
    if (precio1 == precio2) {
        return 0;
    } else if (precio1 > precio2) {
        return 1;
    } else if (precio1 < precio2) {
        return -1;
    }
}

function listarOrdenado(listado) {
    limpiarTabla();
    listado[llave].forEach(element => {
        agregarFilaTabla(element);
    });
}

function agregarFilaTabla(objeto) {
    document.getElementById(llave).insertRow(-1).innerHTML =
        '<td>' + objeto.id + '</td>' +
        '<td>' + objeto.nombre + '</td>' +
        '<td name="precio">' + objeto.precio + '</td>';
}

function limpiarTabla() {
    const table = document.getElementById(llave);
    const rowCount = table.rows.length;

    if (rowCount > 3) {
        for (let i = rowCount - 1; i >= 3; i--) {
            table.deleteRow(i);
        }
    }
}

function setItem(listado) {
    let valor = JSON.stringify(listado);
    window.localStorage.setItem(llave, valor);
}

function getItem() {
    try {
        let valor = window.localStorage.getItem(llave);
        return JSON.parse(valor);
    } catch (error) {
        return null;
    }
}