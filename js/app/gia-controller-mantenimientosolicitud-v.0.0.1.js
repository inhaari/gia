angular.module('giaApp.controllers').controller('mantenimientosolicitudmotrizController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {

    $scope.tipoVencimiento = 1;

    function vencimientoBarChart() {
        $('#tipoVencimiento').remove();
        $('#canvas-holder').append('<canvas id="tipoVencimiento" ></canvas>');
        new Chart(document.getElementById("tipoVencimiento"), {
            type: 'bar',
            data: {
                labels: ["Por dias", "Por km"],
                datasets: [
                    {
                        label: "",
                        backgroundColor: ["#3e95cd", "#8e5ea2"],
                        data: [metrics.byDays, metrics.byKms]
                    }
                ]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: ''
                }
            }
        });
    }

    function vencimientoPieChart() {
        $('#tipoVencimiento').remove();
        $('#canvas-holder').append('<canvas id="tipoVencimiento" ></canvas>');
        new Chart(document.getElementById("tipoVencimiento"),{
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        metrics.byDays,
                        metrics.byKms,
                    ],
                    backgroundColor: [
                        window.chartColors.red,
                        window.chartColors.blue,
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    "Por tiempo",
                    "Por kms",
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: false,
                    text: 'Doughnut Chart'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    function vencimientoDonaChart() {
        $('#tipoVencimiento').remove();
        $('#canvas-holder').append('<canvas id="tipoVencimiento" ></canvas>');
        new Chart(document.getElementById("tipoVencimiento"),{
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [
                        metrics.byDays,
                        metrics.byKms,
                    ],
                    backgroundColor: [
                        window.chartColors.red,
                        window.chartColors.blue,
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    "Por dias",
                    "Por kms",
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: false,
                    text: 'Doughnut Chart'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    $scope.updateVencimiento = function() {
        if ($scope.tipoVencimiento == 1) {
            vencimientoDonaChart();
        }
        if ($scope.tipoVencimiento == 2) {
            vencimientoBarChart();
        }
        if ($scope.tipoVencimiento == 3) {
            vencimientoPieChart();
        }
    };

    function kmdiasTranscurridos() {
        var labels = [], dias = [], kms = [];
        entities.forEach(function(p) {
            labels.push(p.flota.economico);
            dias.push(p.diasTranscurridos);
            kms.push(p.kmTranscurridos);
        });
        new Chart(document.getElementById("canvas-trans"), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Dias",
                        backgroundColor: "#3e95cd",
                        data: dias
                    }, {
                        label: "Kms",
                        backgroundColor: "#8e5ea2",
                        data: kms
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Dias y kms transcurridos por unidad desde ultimo servicio'
                },
                scales: {
                    xAxes: [ {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Unidades en flota'
                        }

                    }]
                }
            }
        });
    }

    $scope.startRequest = function(id) {
        $scope.noprevious = false;
        $scope.previous = false;
        $scope.fechaServicioPrevia = undefined;
        $('#requestService').modal('show');
        console.log(id);
        $scope.form = undefined;
        $scope.entities.forEach(function(p) {
            console.log(p);
            if (p.flota.id == id) {
                $scope.form = p;
            }
        });
        giaFactory.getReportePreventivoByFlota($scope.form.flota.id).then(function(data) {
            console.log('data', data);
            if (data.data.id > 0) {
                $scope.previous = true;
                $scope.fechaServicioPrevia = data.data.fechaServicio;
            } else {
                $scope.noprevious = true;
                $("#fechaRequest").val("");
                $("#fechaRequest").datepicker("destroy");
                var startDate = new Date(), endDate = new Date();
                if (moment($scope.form.fechaProximoServicio).toDate().getTime() > moment(new Date()).toDate().getTime()) {
                    endDate = moment($scope.form.fechaProximoServicio).toDate();
                } else {
                    endDate = moment(new Date()).add(1, 'days').toDate();
                }
                $("#fechaRequest").datepicker({
                    format: "yyyy-mm-dd",
                    autoclose:true,
                    orientation: "bottom",
                    startDate: startDate,
                    endDate: endDate,
                    beforeShowDay: noWeekendsOrHolidays,
                    daysOfWeekDisabled: [0,6],
                    datesDisabled: $scope.notavailable
                });
            }
        });


    };

    function nationalDays(date) {
        var arrDisabledDates = {};
        $scope.notavailable.forEach(function(q) {
            arrDisabledDates[q] = q;
        });
        var bDisable = arrDisabledDates[date];
        if (bDisable)
            return [false, '', ''];
        else
            return [true, '', ''];
    }

    function noWeekendsOrHolidays(date) {
        return [true, '', ''];
        var noWeekend = $.datepicker.noWeekends(date);
        if (noWeekend[0]) {
            return nationalDays(date);
        } else {
            return noWeekend;
        }
    }

    $scope.sendRequestService = function() {
        giaFactory.postReportePreventivo({
            flota: {
                id: $scope.form.flota.id
            },
            operador: {
                id: $scope.empleadoId
            },
            odometro: $scope.form.geoOdometerRequestDetail.odometro,
            fechaServicio: $('#fechaRequest').val() + '',
            fechaServicioFormat: $('#fechaRequest').val() + '',
            vencidoTiempo: !($scope.form.statusServicio.indexOf("km") > -1),
        }).then(function(data) {
            console.log('data', data);
            $('#requestService').modal('hide');
        });
    };

    function init() {
        $scope.entities = entities;
        $scope.empleado = empleado;
        $scope.datena = datena;
        $scope.notavailable = [];
        $scope.notavailable.push(moment('2019-12-19').toDate())
        $scope.datena.forEach(function(p) {
            $scope.notavailable.push(moment(p).toDate());
        });
        $scope.empleadoId = $scope.empleado[0].id;
        vencimientoDonaChart();
        kmdiasTranscurridos();
        //$scope.$apply();
    }
    init();
}]);
angular.module('giaApp.controllers').controller('mantenimientosolicitudnomotrizController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {

    $scope.tipoVencimiento = 1;

    function vencimientoBarChart() {
        $('#tipoVencimiento').remove();
        $('#canvas-holder').append('<canvas id="tipoVencimiento" ></canvas>');
        new Chart(document.getElementById("tipoVencimiento"), {
            type: 'bar',
            data: {
                labels: ["Por dias", "Por km"],
                datasets: [
                    {
                        label: "",
                        backgroundColor: ["#3e95cd", "#8e5ea2"],
                        data: [metrics.byDays, metrics.byKms]
                    }
                ]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: ''
                }
            }
        });
    }

    function vencimientoPieChart() {
        $('#tipoVencimiento').remove();
        $('#canvas-holder').append('<canvas id="tipoVencimiento" ></canvas>');
        new Chart(document.getElementById("tipoVencimiento"),{
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        metrics.byDays,
                        metrics.byKms,
                    ],
                    backgroundColor: [
                        window.chartColors.red,
                        window.chartColors.blue,
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    "Por tiempo",
                    "Por kms",
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: false,
                    text: 'Doughnut Chart'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    $scope.updateVencimiento = function() {
        if ($scope.tipoVencimiento == 1) {
            vencimientoDonaChart();
        }
        if ($scope.tipoVencimiento == 2) {
            vencimientoBarChart();
        }
        if ($scope.tipoVencimiento == 3) {
            vencimientoPieChart();
        }
    };

    function kmdiasTranscurridos() {
        var labels = [], dias = [], kms = [];
        entities.forEach(function(p) {
            labels.push(p.flota.economico);
            dias.push(p.diasTranscurridos);
            kms.push(p.kmTranscurridos);
        });
        new Chart(document.getElementById("canvas-trans"), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Dias",
                        backgroundColor: "#3e95cd",
                        data: dias
                    }, {
                        label: "Kms",
                        backgroundColor: "#8e5ea2",
                        data: kms
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Dias y kms transcurridos por unidad desde ultimo servicio'
                },
                scales: {
                    xAxes: [ {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Unidades en flota'
                        }

                    }]
                }
            }
        });
    }

    $scope.startRequest = function(id) {
        $scope.noprevious = false;
        $scope.previous = false;
        $scope.fechaServicioPrevia = undefined;
        $('#requestService').modal('show');
        console.log(id);
        $scope.form = undefined;
        $scope.entities.forEach(function(p) {
            if (p.flota.id == id) {
                $scope.form = p;
            }
        });
        giaFactory.getReportePreventivoByFlota($scope.form.flota.id).then(function(data) {
            console.log('data', data);
            if (data.data.id > 0) {
                $scope.previous = true;
                $scope.fechaServicioPrevia = data.data.fechaServicio;
            } else {
                $scope.noprevious = true;
                $("#fechaRequest").val("");
                $("#fechaRequest").datepicker("destroy");
                var startDate = new Date(), endDate = new Date();
                if (moment($scope.form.fechaProximoServicio).toDate().getTime() > moment(new Date()).toDate().getTime()) {
                    endDate = moment($scope.form.fechaProximoServicio).toDate();
                } else {
                    endDate = moment(new Date()).add(1, 'days').toDate();
                }
                //var startDate = new Date(), endDate = moment($scope.form.fechaProximoServicio).toDate();
                //endDate = endDate.getTime() < startDate.getTime() ? moment(new Date()).add(1, 'days').toDate() : endDate;
                $("#fechaRequest").datepicker({
                    format: "yyyy-mm-dd",
                    autoclose:true,
                    orientation: "bottom",
                    startDate: startDate,
                    endDate: endDate,
                    beforeShowDay: noWeekendsOrHolidays,
                    daysOfWeekDisabled: [0,6],
                    datesDisabled: $scope.notavailable
                });
            }
        });


    };

    function nationalDays(date) {
        var arrDisabledDates = {};
        $scope.notavailable.forEach(function(q) {
            arrDisabledDates[q] = q;
        });
        var bDisable = arrDisabledDates[date];
        if (bDisable)
            return [false, '', ''];
        else
            return [true, '', ''];
    }

    function noWeekendsOrHolidays(date) {
        return [true, '', ''];
        var noWeekend = $.datepicker.noWeekends(date);
        if (noWeekend[0]) {
            return nationalDays(date);
        } else {
            return noWeekend;
        }
    }

    $scope.sendRequestService = function() {
        giaFactory.postReportePreventivo({
            flota: {
                id: $scope.form.flota.id
            },
            operador: {
                id: $scope.empleadoId
            },
            odometro: 0,
            fechaServicio: $('#fechaRequest').val() + '',
            fechaServicioFormat: $('#fechaRequest').val() + '',
            vencidoTiempo: !($scope.form.statusServicio.indexOf("km") > -1),
        }).then(function(data) {
            console.log('data', data);
            $('#requestService').modal('hide');
        });
    };

    function init() {
        $scope.entities = entities;
        $scope.empleado = empleado;
        $scope.datena = datena;
        $scope.notavailable = [];
        $scope.datena.forEach(function(p) {
            $scope.notavailable.push(moment(p).toDate());
        });
        $scope.empleadoId = $scope.empleado[0].id;
        kmdiasTranscurridos();
        //$scope.$apply();
    }
    init();
}]);