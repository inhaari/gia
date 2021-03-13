// Modelo
angular.module('giaApp.controllers').controller('gestiontarifaController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {

    $scope.updateParametro = function(p) {
        giaFactory.putGestionParametro(p).then(function(response) {
            $scope.parametro = response.data;
            console.log('response', $scope.parametro);
        })
    };

    $scope.calcular = function() {
        if ($scope.kmMensual == undefined || $scope.kmMensual < 1) {
            toastr.error('Kms mensuales invalido');
            return;
        }
        if ($scope.rutaSelected < 1) {
            toastr.error('Ruta invalida');
            return;
        }
        if ($scope.cdOrigenSelected < 1) {
            toastr.error('Centro C/D origen invalido');
            return;
        }
        if ($scope.cdDestinoSelected < 1) {
            toastr.error('Centro C/D destino invalido');
            return;
        }
        if ($scope.tanque1Selected < 1) {
            toastr.error('Tanque invalido');
            return;
        }
        if ($scope.doble && $scope.tanque1Selected < 1) {
            toastr.error('Tanque doble invalido');
            return;
        }
        $scope.costeo = undefined;
        giaFactory.postGestionBuild({
            ejes: $scope.ejes,
            kmMensual: $scope.kmMensual,
            ruta: {
                id: $scope.rutaSelected
            },
            doble: $scope.doble,
            origen: {
                id: $scope.cdOrigenSelected
            },
            destino: {
                id: $scope.cdDestinoSelected
            },
            tanque1: {
                id: $scope.tanque1Selected
            },
            tanque2: {
                id: $scope.doble ? $scope.tanque1Selected : -1
            }
        }).then(function(response) {
            console.log('costeo', response.data);
            $scope.costeo = response.data;
        })
    };

    function init() {
        $scope.centro = centro;
        $scope.ruta = ruta;
        $scope.flotaTipoUnidad = flotaTipoUnidad;
        $scope.kmMensual = 3000000;
        $scope.costeo = undefined;
        $scope.doble = false;
        console.log('centro', $scope.centro);
        console.log('ruta', $scope.ruta);

        giaFactory.getGestionParametro().then(function(response) {
            $scope.parametro = response.data;
            console.log('response', $scope.parametro);
        });
        $scope.rutaSelected = $scope.ruta[0].id;
        $scope.cdOrigenSelected = $scope.centro[0].id;
        $scope.cdDestinoSelected = $scope.centro[0].id;

        $scope.tanque1Selected = 1;
        $scope.tanque2Selected = 1;
        $scope.ejes = 3+'';
    }

    init();
}]);
