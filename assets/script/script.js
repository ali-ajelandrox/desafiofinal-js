
function obtenerDatos(indicador) {
    fetch(`https://mindicador.cl/api/${indicador}`)
        .then(response => response.json())
        .then(data => {
            const montoCLP = parseFloat(document.getElementById("CLP").value) || 0;
            const valorIndicador = data.serie[0].valor;

          
            const resultado = montoCLP === 0 ? 0 : montoCLP/ valorIndicador ;

        
            const valorCambioElement = document.getElementById("valor-cambio");
            valorCambioElement.innerHTML = `<p><strong>Valor del ${indicador}:</strong> ${valorIndicador.toFixed(2)}</p>`;

            const totalesElement = document.getElementById("totales");
            totalesElement.innerHTML = `<p><strong>Resultado: $ </strong> ${resultado.toFixed(2)}</p>`;
        })
        .catch(error => {
            console.error("Error al hacer la solicitud:", error);
        });
}


const buscarButton = document.getElementById("buscar");
buscarButton.addEventListener("click", function () {
    const indicadorSeleccionado = document.getElementById("selector").value;
    obtenerDatos(indicadorSeleccionado);
    obtenerDatosYActualizarGrafico(indicadorSeleccionado);
});


obtenerDatosYActualizarGrafico(document.getElementById("selector").value);


function obtenerDatosYActualizarGrafico(indicador) {
    fetch(`https://mindicador.cl/api/${indicador}`)
        .then(response => response.json())
        .then(data => {
            const todasLasFechas = data.serie.map(entry => entry.fecha);
            const todosLosValores = data.serie.map(entry => entry.valor);

            const fechas = todasLasFechas.slice(0, 10).map(date => moment(date).format('YYYY-MM-DD'));
            const valores = todosLosValores.slice(0, 10);


            const color = valores[0] < 0 ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 128, 0, 1)';

            const dataObject = {
                labels: fechas,
                datasets: [{
                    label: `Datos de ${indicador}`,
                    data: valores,
                    borderColor: color,
                    borderWidth: 1
                }]
            };

      
            const options = {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'YYYY-MM-DD'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            };

      
            const ctx = document.getElementById('miGrafico').getContext('2d');


            const myChart = new Chart(ctx, {
                type: 'line',
                data: dataObject,
                options: options
            });
        })
        .catch(error => {
            console.error("Error al hacer la solicitud:", error);
        });
}
