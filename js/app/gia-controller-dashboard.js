// Marca
angular.module('giaApp.controllers').controller('dashboardController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {

    $scope.costroTrailer = {
        hombre: 0,
        refaccion: 0,
        llanta: 0
    }

    $scope.gestionCombustible = {
        gastoCorriente: 0,
        gastoAcumulado: 0,
        aprovechamientoPromedio: 0,
    }

    $scope.gestionCompra = {
        requisicion: 0,
        cotizacion: 0,
        gestionCotizacion: 0,
        ordenCompra: 0,
        autorizacion: 0
    }

    $scope.gestionOrdenTrabajo = {};

    $scope.manageCostroTrailer = function(fecha) {
        giaFactory.getCostoTrailer(fecha).then(function(response) {
            console.log('response', response)
            $scope.costroTrailer.hombre = 0;
            $scope.costroTrailer.llanta = 0;
            $scope.costroTrailer.refaccion = 0;
            if (response.data  && response.data.length >0) {
                var data = [];
                response.data.forEach(function(p) {
                    console.log(p);
                    p.hombre = Math.ceil(p.hombre);
                    p.llanta = Math.ceil(p.llanta);
                    p.refaccion = Math.ceil(p.refaccion);
                    $scope.costroTrailer.hombre += p.hombre;
                    $scope.costroTrailer.llanta += p.llanta;
                    $scope.costroTrailer.refaccion += p.refaccion;
                    data.push({
                        y: p.fecha, a: p.hombre, b: p.refaccion, c: p.llanta
                    })
                });
                $scope.costroTrailer.hombre = Math.ceil($scope.costroTrailer.hombre);
                $scope.costroTrailer.llanta = Math.ceil($scope.costroTrailer.llanta);
                $scope.costroTrailer.refaccion = Math.ceil($scope.costroTrailer.refaccion);
                Morris.Bar({
                    element: 'sparkline2',
                    data: data,
                    xkey: 'y',
                    ykeys: ['a', 'b', 'c'],
                    stacked: false,
                    labels: ['Taller', 'Refaccion','Llanta'],
                    hideHover: 'auto',
                    resize: true, //defaulted to true
                    gridLineColor: '#efefef',
                    barColors: ['#84ba3f','#17a2b8', '#e6e6e6']
                });
            }
        });
    }

    $scope.manageCostroTrailerPrev = function() {
        $scope.manageCostroTrailer(moment(new Date()).subtract(1, "M").format("YYYY-MM-DD"))
    }

    $scope.manageGestionCombustible = function() {
        giaFactory.getCostoGestionCombustible().then(function(response) {
            console.log('gestionCombustible', response);

            if (response.data  && response.data.length >0) {
                var labels = [];
                var dataset = [];
                var tendency = [];
                $scope.gestionCombustible = {
                    gastoCorriente: 0,
                    gastoAcumulado: 0,
                    aprovechamientoPromedio: 0,
                }
                response.data.forEach(function(p) {
                    console.log(p);
                    labels.push(p.fecha);
                    dataset.push(Math.ceil(p.aprovechamientoReal));
                    if (p.fecha.length > 7) {
                        $scope.gestionCombustible.gastoCorriente += (p.kmReal * p.diesel);
                    } else {
                        $scope.gestionCombustible.gastoAcumulado += (p.kmReal * p.diesel);
                    }
                    $scope.gestionCombustible.aprovechamientoPromedio += p.aprovechamientoReal;
                    tendency.push((100-Math.ceil(p.aprovechamientoReal))<=0 ? 0 : (100-Math.ceil(p.aprovechamientoReal)));
                });
                $scope.gestionCombustible.aprovechamientoPromedio = $scope.gestionCombustible.aprovechamientoPromedio / response.data.length;
                $scope.gestionCombustible.gastoCorriente = Math.ceil($scope.gestionCombustible.gastoCorriente);
                $scope.gestionCombustible.gastoAcumulado = Math.ceil($scope.gestionCombustible.gastoAcumulado);
                $scope.gestionCombustible.aprovechamientoPromedio = Math.ceil($scope.gestionCombustible.aprovechamientoPromedio);
                new Chart(document.getElementById("canvas4"), {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "Tendencia",
                                type: "line",
                                borderColor: "#992143",
                                data: tendency,
                                fill: false
                            }, {
                                label: "Aprovechamiento %",
                                type: "bar",
                                backgroundColor: "rgba(56, 182, 202,0.9)",
                                backgroundColorHover: "#3e95cd",
                                data: dataset
                            }
                        ]
                    },
                    options: {
                        responsive:true,
                        title: {
                            display: true,
                            text: 'Gestion de combustible'
                        },
                        legend: { display: false }
                    }
                });
            }
        });
    }

    $scope.manageCompras = function() {
        $scope.gestionCompra = {
            requisicion: 0,
            cotizacion: 0,
            gestionCotizacion: 0,
            ordenCompra: 0,
            autorizacion: 0
        }
        giaFactory.getCostoCompras().then(function(response) {
            $scope.gestionCompra.requisicion = response.data.requisicion;
            $scope.gestionCompra.cotizacion = response.data.cotizacion;
            $scope.gestionCompra.gestionCotizacion = response.data.gestionCotizacion;
            $scope.gestionCompra.ordenCompra = response.data.ordenCompra;
            $scope.gestionCompra.autorizacion = response.data.autorizacion;
            console.log('compras', response);
        });
    }

    $scope.manageOrdenTrabajo = function() {
        giaFactory.getCostoOrdenTrabajo().then(function(response) {
            console.log('ordentrabajo', response);
            response.data.forEach(function(p) {
                console.log('p', p);
                if (p.estatus == 'SOLICITADO') $scope.gestionOrdenTrabajo.solicitado = p;
                if (p.estatus == 'GESTION') $scope.gestionOrdenTrabajo.gestion = p;
                if (p.estatus == 'CIERRE') $scope.gestionOrdenTrabajo.cierre = p;
                if (p.estatus == 'FINALIZADO') $scope.gestionOrdenTrabajo.finalizado = p;
            });
            console.log('gestionOrdenTrabajo', $scope.gestionOrdenTrabajo);
        });
    }

    $scope.manageSemaforeo = function() {
        giaFactory.getCostoSemaforeo().then(function(response) {
            $scope.gestionSemaforeo = response.data;
            console.log('semaforeo', response);
            new Chart(document.getElementById("polar-chart"), {
                type: 'polarArea',
                data: {
                    labels: ["Vencidos", "Programados", "Tiempo"],
                    datasets: [
                        {
                            label: "Population (millions)",
                            backgroundColor: ["#dc3545", "#ffc107","#28a745"],
                            data: [$scope.gestionSemaforeo.vencidos, $scope.gestionSemaforeo.programados, $scope.gestionSemaforeo.tiempo]
                        }
                    ]
                },
                options: {
                    responsive:true,
                    title: {
                        display: true,
                        text: ''
                    }
                }
            });
            new Chart(document.getElementById("bar-chart-grouped"), {
                type: 'bar',
                data: {
                    labels: ["6mm+", "4-6mm", "4mm-", "S/S"],
                    datasets: [
                        {
                            label: "Direccional",
                            backgroundColor: "#3e95cd",
                            data: [$scope.gestionSemaforeo.d6opt,$scope.gestionSemaforeo.d6war,$scope.gestionSemaforeo.d6dan,$scope.gestionSemaforeo.d6ss]
                        }, {
                            label: "Tracción",
                            backgroundColor: "#3cbf5a",
                            data: [$scope.gestionSemaforeo.t6opt,$scope.gestionSemaforeo.t6war,$scope.gestionSemaforeo.t6dan,$scope.gestionSemaforeo.t6ss]
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: ''
                    }
                }
            });
        });
    }

    function init() {
        console.log('data');
        $scope.manageCostroTrailer(moment(new Date()).format("YYYY-MM-DD"));
        $scope.manageGestionCombustible();
        $scope.manageCompras();
        $scope.manageOrdenTrabajo();
        $scope.manageSemaforeo();
    }
    init();
}]);
