// Create Requisicion
angular.module('giaApp.controllers').controller('almaceninventarioDevolucionController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    function init() {
        console.log('init');
        $scope.clasificacion = clasificacion;
        $scope.clasificacion.forEach(function(p) {
            p.nombrecompuesto = p.almacenFamilia.nombre + ' - ' + p.nombre;
        });
        $scope.refaccion = refaccion;
        $scope.refaccion.forEach(function(p) {
            p.clasificacion = p.almacenModelo.almacenMarca.almacenClasificacion.id;
            // <option ng-repeat="q in p.options | filter: { clasificacion : p.clasificacion}:true | orderBy:'codigo'" ng-value="q.id">{{q.codigo}} - {{q.nombre}} - {{q.almacenModelo.almacenMarca.nombre}} - {{q.almacenModelo.nombre}}</option>
            p.nombrecompuesto = p.codigo + ' -' + p.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.nombre + ' - ' + p.almacenModelo.almacenMarca.nombre + ' - ' + p.almacenModelo.nombre + ' - ' + p.nombre;

        });
        console.log('clasificacion', $scope.clasificacion);
        console.log('refaccion', $scope.refaccion);
    }

    $scope.lookupRefaccion = function() {
        $scope.inventario = undefined;
        if ($scope.refaccionId > 0) {
            giaFactory.getAlmacenInventario($scope.refaccionId).then(function(response) {
                console.log('response', response.data);
                $scope.inventario = response.data;
            })
        }
    };

    $scope.showConfirm = function(p) {
        console.log(p);
        $scope.inventarioId = p.id;
        $('#modalDevolucion').modal('show');
    };

    init();
}]);
