var db = firebase.apps[0].firestore();

const txtCSV = document.querySelector('#txtCSV');
const btnLoad = document.querySelector('#btnLoad');
const statusMessage = document.getElementById('statusMessage'); 
const progressBar = document.getElementById('progressBar'); 

btnLoad.addEventListener('click', function() {
    if (txtCSV.files.length === 0) {
        statusMessage.textContent = "Por favor, selecciona un archivo CSV para cargar.";
        return;
    }

    
    statusMessage.textContent = "Cargando...";
    progressBar.style.width = "0%";
    progressBar.setAttribute("aria-valuenow", 0);

    lecturaCSV(txtCSV.files[0]).then(() => {
        txtCSV.value = '';
        statusMessage.textContent = "Carga completada exitosamente.";
        progressBar.style.width = "100%";
        progressBar.setAttribute("aria-valuenow", 100);
    }).catch((error) => {
        console.error("Error durante la carga: ", error);
        statusMessage.textContent = "Ocurrió un error durante la carga.";
        progressBar.style.width = "0%";
        progressBar.setAttribute("aria-valuenow", 0);
    });
});

async function lecturaCSV(archivo) {
    const nomarch = archivo.name.split('.')[0];
    const lector = new FileReader();

    return new Promise((resolve, reject) => {
        lector.onload = async function(e) {
            const contenido = e.target.result;
            if (contenido) {
                let data = contenido.split('\n');
                let etiquetas = data[0].split(';');
                const totalRows = data.length - 1; 

                for (let index = 1; index < data.length; index++) {
                    const valores = data[index].split(';');
                    let salida = {};
                    for (let index2 = 0; index2 < etiquetas.length; index2++) {
                        salida[etiquetas[index2]] = valores[index2];
                    }

                    try {
                        await db.collection(nomarch).add(salida);
                        console.log("Registro agregado con éxito.");
                    } catch (error) {
                        console.error("Error al registrar el dato: ", error);
                        reject(error);
                        return;
                    }

                    
                    const progress = Math.round((index / totalRows) * 100);
                    progressBar.style.width = progress + "%";
                    progressBar.setAttribute("aria-valuenow", progress);
                }

                resolve(); 
            } else {
                reject(new Error("Error en la lectura del archivo."));
            }
        };

        lector.onerror = function() {
            reject(new Error("Error al leer el archivo CSV."));
        };

        lector.readAsText(archivo); 
    });
}

function esperarSegundos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('resolved');
        }, 5000);
    });
}
