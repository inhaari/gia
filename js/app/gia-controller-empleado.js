// Modelo
angular.module('giaApp.controllers').controller('empleadoCreateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    function init() {
    }
    init();
}]);
angular.module('giaApp.controllers').controller('empleadoUpdateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    function init() {
        $scope.licenciaTipo = entity.licenciaTipo;
        $scope.tieneInfonavit = entity.tieneInfonavit;
        $scope.tieneContrato = entity.tieneContrato;
        $scope.tieneConvenioConfidencialidad = entity.tieneConvenioConfidencialidad ? 'true' : 'false';
        $scope.civil = entity.civil;
        $scope.tieneHijos = entity.tieneHijos;
    }
    init();
}]);