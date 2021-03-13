// Modelo
angular.module('giaApp.controllers').controller('flotamodeloCreateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    function init() {
        try {
            $scope.tipoUnidad = tipoUnidad;
            $scope.marca = marca;
            $scope.marcaselect = $scope.tipoUnidad[0].id;
            angular.forEach($scope.marca, function(p) {
                console.log(p);
                p.unidad = p.flotaTipoUnidad.id;
            });
        } catch (e) {
        }
    }
    init();
}]);
angular.module('giaApp.controllers').controller('flotamodeloUpdateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    $scope.model = {
        unidad: 0,
        marca: 0
    };
    function init() {
        try {
            $scope.tipoUnidad = tipoUnidad;
            $scope.marca = marca;
            $scope.entity = entity;
            angular.forEach($scope.marca, function(p) {
                console.log(p);
                p.unidad = p.flotaTipoUnidad.id;
            });
            $scope.unidadSelected = $scope.entity.flotaMarca.flotaTipoUnidad.id;
            $scope.marcaSelected = $scope.entity.flotaMarca.id;
        } catch (e) {
        }
    }
    init();
}]);

angular.module('giaApp.controllers').controller('flotaCreateController', ['$scope', '$window', '$interval', '$filter', 'giaFactory', function($scope, $window, $interval, $filter, giaFactory) {
    $scope.activo = true;

    $scope.changeTipoUnidad = function() {
        if ($scope.unidadSelected > 0) {
            $scope.marca.forEach(function(p) {
                if (p.unidad == $scope.unidadSelected) {
                    $scope.marcaSelected = p.id;
                }
            });
            $scope.motormarca.forEach(function(p) {
                if (p.unidad == $scope.unidadSelected) {
                    $scope.motormarcaSelected = p.id;
                }
            });
            $scope.transmisionmarca.forEach(function(p) {
                if (p.unidad == $scope.unidadSelected) {
                    $scope.transmisionmarcaSelected = p.id;
                }
            });
        }
    };
    function init() {
        try {
            $scope.tipoUnidad = tipoUnidad;
            $scope.marca = marca;
            $scope.modelo = modelo;
            $scope.motormarca = motormarca;
            $scope.motormodelo = motormodelo;
            $scope.marca = marca;
            $scope.transmisionmarca = transmisionmarca;
            $scope.transmisionmodelo = transmisionmodelo;
            console.log(marca);
            $scope.modelo.forEach(function(p) {
                p.marca = p.flotaMarca.id;
            });
            $scope.motormodelo.forEach(function(p) {
                p.marca = p.flotaMotorMarca.id;
            });
            $scope.transmisionmodelo.forEach(function(p) {
                p.marca = p.flotaTransmisionMarca.id;
            });
            $scope.marca.forEach(function(p) {
                p.unidad = p.flotaTipoUnidad.id;
            });
            $scope.motormarca.forEach(function(p) {
                p.unidad = p.flotaTipoUnidad.id;
            });
            $scope.transmisionmarca.forEach(function(p) {
                p.unidad = p.flotaTipoUnidad.id;
            });
            if ($scope.modelo != undefined && $scope.modelo.length > 0) {
                $scope.unidadSelected = $scope.modelo[0].flotaMarca.flotaTipoUnidad.id;
                $scope.changeTipoUnidad();
            }
        }
        catch(e) {
        }
    }
    init();
}]);
angular.module('giaApp.controllers').controller('flotaUpdateController', ['$scope', '$window', '$interval', '$filter', 'giaFactory', function($scope, $window, $interval, $filter, giaFactory) {
    $scope.activo = true;

    $scope.changeTipoUnidad = function() {
        if ($scope.unidadSelected > 0) {
            $scope.marca.forEach(function(p) {
                if (p.unidad == $scope.unidadSelected) {
                    $scope.marcaSelected = p.id;
                }
            });
            $scope.motormarca.forEach(function(p) {
                if (p.unidad == $scope.unidadSelected) {
                    $scope.motormarcaSelected = p.id;
                }
            });
            $scope.transmisionmarca.forEach(function(p) {
                if (p.unidad == $scope.unidadSelected) {
                    $scope.transmisionmarcaSelected = p.id;
                }
            });
        }
    };
    function init() {
        try {
            $scope.tipoUnidad = tipoUnidad;
            $scope.marca = marca;
            $scope.modelo = modelo;
            $scope.motormarca = motormarca;
            $scope.motormodelo = motormodelo;
            $scope.marca = marca;
            $scope.transmisionmarca = transmisionmarca;
            $scope.transmisionmodelo = transmisionmodelo;
            $scope.entity = entity;
            console.log(entity);
            $scope.modelo.forEach(function(p) {
                p.marca = p.flotaMarca.id;
            });
            $scope.motormodelo.forEach(function(p) {
                p.marca = p.flotaMotorMarca.id;
            });
            $scope.transmisionmodelo.forEach(function(p) {
                p.marca = p.flotaTransmisionMarca.id;
            });
            $scope.marca.forEach(function(p) {
                p.unidad = p.flotaTipoUnidad.id;
            });
            $scope.motormarca.forEach(function(p) {
                p.unidad = p.flotaTipoUnidad.id;
            });
            $scope.transmisionmarca.forEach(function(p) {
                p.unidad = p.flotaTipoUnidad.id;
            });
            if ($scope.entity != null && $scope.entity.flotaModelo != null) {
                $scope.unidadSelected = $scope.entity.flotaModelo.flotaMarca.flotaTipoUnidad.id;
                $scope.marcaSelected = $scope.entity.flotaModelo.flotaMarca.id;
                $scope.modeloSelected = $scope.entity.flotaModelo.id;
                $scope.motormarcaSelected = $scope.entity.flotaMotorModelo.flotaMotorMarca.id;
                $scope.motormodeloSelected = $scope.entity.flotaMotorModelo.id;
                $scope.transmisionmarcaSelected = $scope.entity.flotaTransmisionModelo.flotaTransmisionMarca.id;
                $scope.tranmisionmodeloSelected = $scope.entity.flotaTransmisionModelo.id;
            }
        }
        catch(e) {
            if ($scope.modelo != undefined && $scope.modelo.length > 0) {
                $scope.unidadSelected = $scope.modelo[0].flotaMarca.flotaTipoUnidad.id;
                $scope.changeTipoUnidad();
            }
        }
    }
    init();
}]);

angular.module('giaApp.controllers').controller('transmisionmodeloCreateController', ['$scope', '$window', '$interval', '$filter', 'giaFactory', function($scope, $window, $interval, $filter, giaFactory) {
    function init() {
        try {
            $scope.tipoUnidad = tipoUnidad;
            $scope.marca = marca;
            $scope.marcaselect = $scope.tipoUnidad[0].id;
            angular.forEach($scope.marca, function(p) {
                console.log(p);
                p.unidad = p.flotaTipoUnidad.id;
            });
        }
        catch(e) {
        }
    }
    init();
}]);
angular.module('giaApp.controllers').controller('transmisionmodeloUpdateController', ['$scope', '$window', '$interval', '$filter', 'giaFactory', function($scope, $window, $interval, $filter, giaFactory) {
    function init() {
        try {
            $scope.tipoUnidad = tipoUnidad;
            $scope.marca = marca;
            $scope.marca.forEach(function(p) {
                p.unidad = p.flotaTipoUnidad.id;
            });
            $scope.entity = entity;
            console.log($scope.entity);
            $scope.marcaselect = $scope.entity.flotaTransmisionMarca.flotaTipoUnidad.id;
        }
        catch(e) {
        }
    }
    init();
}]);

angular.module('giaApp.controllers').controller('motormodeloCreateController', ['$scope', '$window', '$interval', '$filter', 'giaFactory', function($scope, $window, $interval, $filter, giaFactory) {
    function init() {
        try {
            $scope.tipoUnidad = tipoUnidad;
            $scope.marca = marca;
            $scope.marcaselect = $scope.tipoUnidad[0].id;
            angular.forEach($scope.marca, function(p) {
                console.log(p);
                p.unidad = p.flotaTipoUnidad.id;
            });
        }
        catch(e) {
        }
    }
    init();
}]);
angular.module('giaApp.controllers').controller('motormodeloUpdateController', ['$scope', '$window', '$interval', '$filter', 'giaFactory', function($scope, $window, $interval, $filter, giaFactory) {
    function init() {
        try {
            $scope.tipoUnidad = tipoUnidad;
            $scope.marca = marca;
            $scope.marca.forEach(function(p) {
                p.unidad = p.flotaTipoUnidad.id;
            });
            $scope.entity = entity;
            console.log($scope.entity);
            $scope.marcaselect = $scope.entity.flotaMotorMarca.flotaTipoUnidad.id;
        }
        catch(e) {
        }
    }
    init();
}]);