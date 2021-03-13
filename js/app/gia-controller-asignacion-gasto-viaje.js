angular.module('giaApp.controllers').controller('asignaciongastoviajeCreateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.gastos = [];
    $scope.idx = 0;
    $scope.montoTotal = 0;

    function init() {
        $scope.gasto = gasto;
        $scope.gastos = gastos;
        $scope.viaje = viaje;
        console.log('gasto', gasto);
    }

    $scope.addGasto = function() {
        var count = 0;
        $scope.idx++;
        var tmp = angular.copy($scope.gastoSelected);
        $scope.gastos.forEach(function(p) {
            console.log(p);
            if (p.gastoViaje.id == tmp.id) {
                count++;
            }
        });
        if (count >= tmp.total) {
            console.log('comener');
            $scope.gastoSelected = '-1';
            toastr.error('Limite de asignaciones permitidas');
            return;
        }
        console.log(count);
        tmp.idx = $scope.idx;
        $scope.gastos.push( {
            id: null,
            viaje: {
                id: $scope.viaje,
            },
            gastoViaje: tmp,
            monto: 0,
        });
        $scope.gastoSelected = '-1';
    };

    $scope.calculate = function() {
        $scope.montoTotal = 0;
        $scope.gastos.forEach(function(p) {
            $scope.montoTotal += p.monto;
        });
    };

    $scope.removeGasto = function(p) {
        $scope.gastos.splice($scope.gastos.indexOf(p), 1);
    };

    $scope.saveGastos = function() {
        if ($scope.gastos.length < 1) {
            toastr.error("Debe incluir al menos un gasto");
            return;
        }
        var error = false;
        $scope.gastos.forEach(function(p) {
            if (p.monto < 1) {
                error = true;
            }
        });
        if (error) {
            toastr.error("Uno o más montos son invalidos");
            return;
        }
        $scope.gastos.forEach(function(p) {
            if (p.monto > p.gastoViaje.montoMaximo) {
                error = true;
            }
        });
        if (error) {
            toastr.error("Uno o más montos exceden el limite permitido");
            return;
        }
        giaFactory.postViajeGasto($scope.gastos).then(function(response) {
            if (response.data != null) {
                $('#modalFinish').modal('show');

            } else {
                toastr.error("Ocurrio un error al asignar los gastos de viaje. Por favor contacte al administrador del sistema");
            }
        })
    };

    init();
}]);