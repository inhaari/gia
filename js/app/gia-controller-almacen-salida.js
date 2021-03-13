// Create Requisicion
angular.module('giaApp.controllers').controller('almacenSalidaController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    function init() {
        $scope.refaccion = refaccion;
        $scope.orden = orden;
        $scope.refaccion.forEach(function(p) {
            p.surtida = '';
        });
        console.log('refaccion', $scope.refaccion);
        console.log('orden', $scope.orden);
    }

    $scope.save = function() {
        var valid = true;
        $scope.refaccion.forEach(function(p) {
            if (p.surtida == '' || p.surtida < 0) {
                valid = false;
            }
        });
        if (!valid) {
            toastr.error('Todas las cantidades deben especificarse.');
            return;
        }
        giaFactory.postSalidaOrdenTrabajoRefaccion($scope.refaccion).then(function(response) {
            if (response.data) {
                $('#modalFinish').modal('show');
            }
        });
    };
    init();
}]);
