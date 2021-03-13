'use strict';
var giaApp = angular.module('giaApp', [
    'giaApp.controllers',
    'giaApp.service',
    'ngSanitize',
    'ui.odometer',
]);
angular.module('giaApp.controllers', []);
angular.module('giaApp.service',[]);
giaApp.factory('GlobalVariables', function() {
    return {
        contextPath: contextPath,
        requisicionBaseUrl: contextPath + '/api/requisicion',
        requisiciondetalleBaseUrl: contextPath + '/api/requisiciondetalle',
        ordencompraBaseUrl: contextPath + '/api/ordencompra',
        cotizacionBaseUrl: contextPath + '/api/cotizacion',
        ordencompraestatusBaseUrl: contextPath + '/api/ordencompraestatus',
        reportepreventivoBaseUrl: contextPath + '/api/reportepreventivo',
        gestiontarifaBaseUrl: contextPath + '/api/gestiontarifa',
        semaforeollantaBaseUrl: contextPath + '/api/semaforeollanta',
        gestioninspeccionBaseUrl: contextPath + '/api/gestioninspeccion',
        almaceninventarioBaseUrl: contextPath + '/api/almaceninventario',
        controlherramientaBaseUrl: contextPath + '/api/controlherramienta',
        ordentrabajoBaseUrl: contextPath + '/api/ordentrabajo',
        ordentrabajorefaccionBaseUrl: contextPath + '/api/ordentrabajorefaccion',
        solicitudviajeBaseUrl: contextPath + '/api/solicitudviaje',
        atencionviajeBaseUrl: contextPath + '/api/atencionviaje',
        asignaciongastoviajeBaseUrl: contextPath + '/api/asignaciongastoviaje',
        dashboardBaseUrl: contextPath + '/api/dashboard',
    };
});

giaApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

angular.module('ui.odometer', []).provider('odometerOptions', function() {
    var self;
    self = this;
    self.defaults = {
        value: 0
    };
    this.$get = function() {
        return angular.copy(self.defaults);
    };
    return this;
}).directive('odometer', [
    'odometerOptions', function(odometerOptions) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                var odometer, opts;
                opts = scope.$eval(attrs.odometerOptions) || {};
                angular.extend(opts, odometerOptions);
                opts.el = elm[0];
                odometer = new Odometer(opts);
                scope.$watch(attrs.odometer, function(newVal) {
                    odometer.update(newVal);
                });
            }
        };
    }
]);