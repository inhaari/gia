// Modelo
angular.module('giaApp.controllers').controller('panelcontrolflotaController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    $scope.entities = undefined;
    $scope.cruce = undefined;
    $scope.rpm = undefined;
    $scope.fuel = undefined;

    function findByDevice(device) {
        var i = undefined;
        $scope.entities.forEach(function(p) {
            if (p.device == device) {
                i = p;
            }
        });
        return i;
    }

    $scope.showRpm = function(device) {
        $scope.rpm = findByDevice(device);
        if ($scope.rpm.panelControlRpm == null) return;
        $('#modalRpm').modal('show');
        var labels = [], dias = [], kms = [];
        var objects = $scope.rpm.panelControlRpm.detail;
        objects.forEach(function(p) {
            labels.push(p.activeFrom.substring(0, 10));
            dias.push(p.distance);
        });
        $('#canvas-trans-rpm').remove();
        $('#canvas-holder-rpm').append('<canvas id="canvas-trans-rpm" width="1530" height="500" style="display: block; height: 400px; width: 765px;" class="chartjs-render-monitor"></canvas>');
        new Chart(document.getElementById("canvas-trans-rpm"), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Distancia",
                        backgroundColor: "#3e95cd",
                        data: dias
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Distancia por evento'
                },
                scales: {
                    xAxes: [ {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Evento'
                        }

                    }]
                }
            }
        });
    };

    $scope.showCruce = function(device) {
        $scope.cruce = findByDevice(device);
        if ($scope.cruce.panelControlCruce == null) return;
        $('#modalCruce').modal('show');
        var labels = [], dias = [], kms = [];
        $scope.cruce.panelControlCruce.detail.forEach(function(p) {
            labels.push(p.id);
            dias.push(p.distance);
        });
        $('#canvas-trans-cruce').remove();
        $('#canvas-holder-cruce').append('<canvas id="canvas-trans-cruce" width="1530" height="500" style="display: block; height: 400px; width: 765px;" class="chartjs-render-monitor"></canvas>');
        new Chart(document.getElementById("canvas-trans-cruce"), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Distancia",
                        backgroundColor: "#3e95cd",
                        data: dias
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Distancia por evento'
                },
                scales: {
                    xAxes: [ {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Evento'
                        }

                    }]
                }
            }
        });
    };

    $scope.showFuel = function(device) {
        $scope.fuel = findByDevice(device);
        if ($scope.fuel.panelControlFuel == null) return;
        $('#modalFuel').modal('show');
        var labels = [], consumo = [], distancia = [];
        $scope.fuel.panelControlFuel.detail.forEach(function(p) {
            labels.push(p.geoFuelRequest.process.substring(0, 10));
            consumo.push(p.consumo);
            distancia.push(p.distancia);
        });
        $('#canvas-trans-fuel').remove();

        if (labels.length < 3) {
            $('#canvas-holder-fuel').append('<canvas id="canvas-trans-fuel" width="1530" height="500" style="display: block; height: 400px; width: 765px;" class="chartjs-render-monitor"></canvas>');
            new Chart(document.getElementById("canvas-trans-fuel"), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Consumo",
                            backgroundColor: "#3e95cd",
                            data: consumo
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Consumo por día'
                    },
                    scales: {
                        xAxes: [ {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Fecha'
                            }

                        }]
                    }
                }
            });
        } else {
            $('#canvas-holder-fuel').append('<canvas id="canvas-trans-fuel" width="1530" height="900" style="display: block; height: 400px; width: 765px;" class="chartjs-render-monitor"></canvas>');
            new Chart(document.getElementById("canvas-trans-fuel"), {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Distancia",
                            fill: true,
                            backgroundColor: "rgba(179,181,198,0.2)",
                            borderColor: "rgba(179,181,198,1)",
                            pointBorderColor: "#fff",
                            pointBackgroundColor: "rgba(179,181,198,1)",
                            data: distancia
                        }, {
                            label: "Consumo",
                            fill: true,
                            backgroundColor: "rgba(255,99,132,0.2)",
                            borderColor: "rgba(255,99,132,1)",
                            pointBorderColor: "#fff",
                            pointBackgroundColor: "rgba(255,99,132,1)",
                            pointBorderColor: "#fff",
                            data: consumo
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Consumo conmbustible'
                    }
                }
            });
        }


    };

    $scope.showSpeed = function(device) {
        $scope.tripSpeed = findByDevice(device);
        if ($scope.tripSpeed.panelControlTrip == null) return;
        $('#modalSpeed').modal('show');
        var labels = [], velocidad = [], kms = [];
        $scope.tripSpeed.panelControlTrip.speedDetail.forEach(function(p) {
            labels.push(p.activeFrom.substring(0, 10));
            velocidad.push(p.distance);
        });
        $('#canvas-trans-speed').remove();
        $('#canvas-holder-speed').append('<canvas id="canvas-trans-speed" width="1530" height="700" style="display: block; height: 400px; width: 765px;" class="chartjs-render-monitor"></canvas>');
        new Chart(document.getElementById("canvas-trans-speed"), {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Distancia",
                        fill: true,
                        backgroundColor: "rgba(255,99,132,0.2)",
                        borderColor: "rgba(255,99,132,1)",
                        pointBorderColor: "#fff",
                        pointBackgroundColor: "rgba(255,99,132,1)",
                        pointBorderColor: "#fff",
                        data: velocidad
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Velocidad'
                }
            }
        });
    };

    $scope.showBreak = function(device) {
        $scope.tripBreak = findByDevice(device);
        if ($scope.tripBreak.panelControlBreak == null) return;
        $('#modalBreak').modal('show');
        var labels = [], velocidad = [], kms = [];
        /*
        $scope.tripBreak.panelControlBreak.detail.forEach(function(p) {
            labels.push(p.geoTripRequest.process.substring(0, 10));
            velocidad.push(p.velocidadMaxima);
        });
         */
        /*
        $('#canvas-trans-speed').remove();
        $('#canvas-holder-speed').append('<canvas id="canvas-trans-break" width="1530" height="700" style="display: block; height: 400px; width: 765px;" class="chartjs-render-monitor"></canvas>');
        new Chart(document.getElementById("canvas-trans-break"), {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Velocidad",
                        fill: true,
                        backgroundColor: "rgba(255,99,132,0.2)",
                        borderColor: "rgba(255,99,132,1)",
                        pointBorderColor: "#fff",
                        pointBackgroundColor: "rgba(255,99,132,1)",
                        pointBorderColor: "#fff",
                        data: velocidad
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Velocidad'
                }
            }
        });
         */
    };

    function init() {
        $scope.entities = entities;
        console.log(entities)
    }
    init();
}]);