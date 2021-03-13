// Modelo
angular.module('giaApp.controllers').controller('gestioninspeccioncorrectivoController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    $scope.serviciosIncluded = [];

    $scope.selected = undefined;

    $scope.addServicio = function() {
        $scope.serviciosIncluded.push({
            id: '0',
            options: $scope.servicios
        });
    };

    $scope.removeServicio = function(p) {
        $scope.serviciosIncluded.splice($scope.serviciosIncluded.indexOf(p), 1);
    };

    function init() {
        $scope.servicios = servicio;
        $scope.reporte = reporte;
        $scope.entity = entity;
        console.log('form', entity);
        console.log('reporte', reporte);
        $scope.servicios.forEach(function(p) {
            console.log(p);
            p.nombre = p.almacenFamilia.nombre + ' ' + p.tarea + ' ' + p.descripcion;
        });
    }

    $scope.save = function () {
        if ($scope.serviciosIncluded ==undefined || $scope.serviciosIncluded.length < 1) {
            toastr.error('Debe agregar por lo menos un servicio');
            return;
        }
        invalid = false;
        $scope.serviciosIncluded.forEach(function(p) {
            if (p.selected == undefined || p.selected.id == undefined || p.selected.id < 1) {
                invalid = true;
            }
        });
        if (invalid) {
            toastr.error('Todos los campos agregados deben tener un servicio seleccionado');
            return;
        }
        invalid = false;
        var tmp = {};
        $scope.serviciosIncluded.forEach(function(p) {
            if (p.selected.id in tmp) {
                invalid = true;
            }
            tmp[parseInt(p.selected.id)] = 1;
        });
        if (invalid) {
            toastr.error('Uno o más servicios se encuentran duplicados');
            return;
        }
        var detail = [];
        $('#modalLoadingCommon').modal('show');
        $scope.serviciosIncluded.forEach(function(p) {
            detail.push({
                reporteGeneral : {
                    id: reporte.id
                },
                mantenimientoServicio: {
                    id : p.selected.id,
                },
                descripcion: ''
            })
        });
        giaFactory.postGestionCorrectivo({
            id: $scope.reporte.id,
            detalle: detail
        }).then(function(response) {
            console.log('response', response);
            $('#modalLoadingCommon').modal('hide');
            window.location.href = "/gestioninspeccion";
        });
    };

    init();
}]);

// Modelo
angular.module('giaApp.controllers').controller('gestioninspeccionpreventivoController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {

    $scope.serviciosIncluded = [];

    $scope.selected = undefined;

    $scope.removeServicio = function(p) {
        $scope.serviciosIncluded.splice($scope.serviciosIncluded.indexOf(p), 1);
    };

    $scope.addServicio = function() {
        $scope.serviciosIncluded.push({
            id: '0',
            options: $scope.servicios
        });
    };

    $scope.save = function () {
        var valid = true;
        $scope.form.detalle.forEach(function(p) {
             if (p.resultado == undefined || p.resultado < 1 || p.resultado > 3) {
                 valid = false;
             }
        });
        if (!valid) {
            toastr.error('Todos los campos son requeridos');
            return;
        }
        $scope.form.detalle.forEach(function(p) {
            if ( (p.resultado == 2 || p.resultado == 3) && (p.descripcion == null || p.descripcion.trim().length < 1) ) {
                valid = false;
            }
        });
        if (!valid) {
            toastr.error('En caso de reparar o cambiar debe especificar la descripción de la rutina');
            return;
        }
        $scope.serviciosIncluded.forEach(function(p) {
            if (p.selected == undefined || p.selected.id == undefined || p.selected.id < 1) {
                valid = false;
            }
        });
        if (!valid) {
            toastr.error('Todos los campos agregados deben tener un servicio seleccionado');
            return;
        }
        var tmp = {};
        $scope.serviciosIncluded.forEach(function(p) {
            if (p.selected.id in tmp) {
                valid = false;
            }
            tmp[parseInt(p.selected.id)] = 1;
        });
        if (!valid) {
            toastr.error('Uno o más servicios se encuentran duplicados');
            return;
        }
        var detail = [];

        $scope.serviciosIncluded.forEach(function(p) {
            detail.push({
                reporteGeneral : {
                    id: reporte.id
                },
                mantenimientoServicio: {
                    id : p.selected.id,
                },
                descripcion: '',
                resultado: -1,
            })
        });
        if (detail != undefined && detail.length > 0) {
            $scope.form.detalle = $scope.form.detalle.concat(detail);
        }
        $('#modalLoadingCommon').modal('show');

        giaFactory.postGestionPreventivo({
            id: $scope.reporte.id,
            detalle: $scope.form.detalle
        }).then(function(response) {
            console.log('response', response);
            $('#modalLoadingCommon').modal('hide');
            window.location.href = "/gestioninspeccion";
        });
    };

    function init() {
        $scope.servicios = servicio;
        console.log('data');
        $scope.form = form;
        $scope.reporte = reporte;
        console.log('form', form);
        $scope.servicios.forEach(function(p) {
            console.log(p);
            p.nombre = p.almacenFamilia.nombre + ' ' + p.tarea + ' ' + p.descripcion;
        });
    };
    init();
}]);