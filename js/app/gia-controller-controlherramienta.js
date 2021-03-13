// Modelo
angular.module('giaApp.controllers').controller('controlherramientaCreateController', ['$scope', '$window', '$interval', '$timeout','giaFactory', function($scope, $window, $interval,$timeout, giaFactory) {
    function init() {
        $scope.refaccion = refaccion;
        $scope.empleado = empleado;
        if ($scope.empleado != undefined && $scope.empleado.length > 0) {
            $scope.empleado.forEach(function(p) {
                p.fullName = p.nombre + ' ' + p.paterno + ' ' + p.materno;
            });
        }
    }

    $scope.saveControlHerramienta = function() {
        if ($scope.empleadoSelected == undefined || $scope.empleadoSelected.id == undefined || $scope.empleadoSelected.id < 1) {
            toastr.error('Debe ingresar un empleado valido');
            return;
        }
        var count = 0;
        $scope.refaccion.forEach(function(p) {
            if (p.included) {
                count++;
            }
        });
        if (count < 1) {
            toastr.error('Debe agregar al menos una herramienta');
            return;
        }
        count = 0;
        $scope.refaccion.forEach(function(p) {
            if (p.included && (p.cantidad == undefined || p.cantidad < 1)) {
                count++;
            }
        });
        if (count > 0) {
            toastr.error('Una o más herramientas no tienen cantidad');
            return;
        }
        var detalle = [];
        $scope.refaccion.forEach(function(p) {
            if (p.included) {
                detalle.push({
                    id: null,
                    almacenRefaccion: {
                        id: p.id,
                    },
                    cantidad: p.cantidad,
                })
            }
        });
        $('#modalLoadingCommon').modal('show');
        giaFactory.postControlHerramienta({
            empleado: {
                id: $scope.empleadoSelected.id
            },
            detalle: detalle,
        }).then(function(response) {
            console.log('reponse', response);
            $timeout(function() {
                $('#modalLoadingCommon').modal('hide');
                $('#modalFinish').modal('show');
            },1000);
        });

    };

    init();
}]);

angular.module('giaApp.controllers').controller('controlherramientaUpdateController', ['$scope', '$window', '$interval', '$timeout','giaFactory', function($scope, $window, $interval,$timeout, giaFactory) {

    function init() {
        $scope.refaccion = refaccion;
        $scope.empleado = empleado;
        $scope.entity = entity;
        console.log('form', $scope.entity);
        if ($scope.entity != undefined && $scope.entity.id > 0) {
            $scope.empleadoSelected = entity.empleado;
            $scope.entity.detalle.forEach(function(p) {
                console.log('p', p);
                $scope.refaccion.forEach(function(q) {
                    if (p.almacenRefaccion.id === q.id) {
                        q.included = true;
                        q.prev = p;
                    }
                });
            });
        }
        if ($scope.empleado != undefined && $scope.empleado.length > 0) {
            $scope.empleado.forEach(function(p) {
                p.fullName = p.nombre + ' ' + p.paterno + ' ' + p.materno;
            });
        }

    }

    $scope.saveControlHerramienta = function() {
        if ($scope.empleadoSelected == undefined || $scope.empleadoSelected.id == undefined || $scope.empleadoSelected.id < 1) {
            toastr.error('Debe ingresar un empleado valido');
            return;
        }
        var count = 0;
        $scope.refaccion.forEach(function(p) {
            if (p.included) {
                count++;
            }
        });
        if (count < 1) {
            toastr.error('Debe agregar al menos una herramienta');
            return;
        }
        count = 0;
        $scope.refaccion.forEach(function(p) {
            if (p.included && (p.cantidad == undefined || p.cantidad < 0)) {
                count++;
            }
        });
        if (count > 0) {
            toastr.error('Una o más herramientas no tienen cantidad');
            return;
        }
        var detalle = [];
        $scope.refaccion.forEach(function(p) {
            if (p.included) {
                detalle.push({
                    id: null,
                    almacenRefaccion: {
                        id: p.id,
                    },
                    cantidad: p.cantidad,
                })
            }
        });
        $('#modalLoadingCommon').modal('show');
        giaFactory.putControlHerramienta({
            id: $scope.entity.id,
            empleado: {
                id: $scope.empleadoSelected.id
            },
            detalle: detalle,
        }).then(function(response) {
            console.log('reponse', response);
            $timeout(function() {
                $('#modalLoadingCommon').modal('hide');
                $('#modalFinish').modal('show');
            },1000);
        });

    };

    init();
}]);
