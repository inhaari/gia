// Marca
angular.module('giaApp.controllers').controller('almacenmarcaCreateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    function init() {
        try {
            $scope.familia = familia;
            $scope.clasificacion = clasificacion;

            angular.forEach($scope.clasificacion, function(p) {
                p.familia = p.almacenFamilia.id;
            });
            $scope.familiaSelected = $scope.familia[0].id;
        } catch (e) {
        }
    }
    init();
}]);
angular.module('giaApp.controllers').controller('almacenmarcaUpdateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    function init() {
        try {
            $scope.selectedFormAlmacen = $('#selectedFormAlmacen');
            $scope.familia = familia;
            $scope.clasificacion = clasificacion;
            $scope.entity = entity;
            angular.forEach($scope.clasificacion, function(p) {
                p.familia = p.almacenFamilia.id;
            });
            $scope.familiaSelected = $scope.entity.almacenClasificacion.almacenFamilia.id;
            $scope.clasificacionSelected = $scope.entity.almacenClasificacion.id;

        } catch (e) {
            $scope.familiaSelected = $scope.familia[0].id;
            angular.forEach($scope.clasificacion, function(p) {
                if (p.almacenFamilia.id == $scope.familiaSelected) {
                    $scope.clasificacionSelected = p.id;
                }
            });
        }
    }
    init();
}]);

// Modelo
angular.module('giaApp.controllers').controller('almacenmodeloCreateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    $scope.changeFamilia = function() {
        var changed = false;
        $scope.clasificacion.forEach(function (p) {
            if ($scope.familiaSelected == p.familia && !changed) {
                $scope.clasificacionSelected = p.id;
                changed = true;
                console.log('p', p);
            }
        });
    };
    function init() {
        try {
            $scope.familia = familia;
            $scope.clasificacion = clasificacion;
            $scope.marca = marca;
            angular.forEach($scope.clasificacion, function(p) {
                p.familia = p.almacenFamilia.id;
            });
            angular.forEach($scope.marca, function(p) {
                p.clasificacion = p.almacenClasificacion.id;
            });
            $scope.familiaSelected = $scope.marca[0].almacenClasificacion.almacenFamilia.id;
            $scope.clasificacionSelected = $scope.marca[0].almacenClasificacion.id;
        } catch (e) {
        }
    }
    init();
}]);
angular.module('giaApp.controllers').controller('almacenmodeloUpdateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    $scope.changeFamilia = function() {
        var changed = false;
        $scope.clasificacion.forEach(function (p) {
            if ($scope.familiaSelected == p.familia && !changed) {
                $scope.clasificacionSelected = p.id;
                changed = true;
            }
        });
    };
    function init() {
        try {
            $scope.familia = familia;
            $scope.clasificacion = clasificacion;
            $scope.marca = marca;
            $scope.entity = entity;
            angular.forEach($scope.clasificacion, function(p) {
                p.familia = p.almacenFamilia.id;
            });

            angular.forEach($scope.marca, function(p) {
                p.clasificacion = p.almacenClasificacion.id;
            });
            console.log(entity);
            $scope.familiaSelected = $scope.entity.almacenMarca.almacenClasificacion.almacenFamilia.id;
            $scope.clasificacionSelected = $scope.entity.almacenMarca.almacenClasificacion.id;
        } catch (e) {
            $scope.familiaSelected = $scope.marca[0].almacenClasificacion.almacenFamilia.id;
            $scope.clasificacionSelected = $scope.marca[0].almacenClasificacion.id;
        }
    }
    init();
}]);

// Refaccion
angular.module('giaApp.controllers').controller('almacenrefaccionCreateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    $scope.changeFamilia = function() {
        var changed = false;
        $scope.familia.forEach(function(p) {
            if (p.id == $scope.familiaSelected) {
                $scope.familiaSelectedRefaccion = p;
            }
        });
        $scope.clasificacion.forEach(function (p) {

            if ($scope.familiaSelected == p.familia && !changed) {
                $scope.clasificacionSelected = p.id;
                changed = true;
            }
        });
        $scope.changeClasificacion();
    };
    $scope.changeClasificacion = function() {
        var changed = false;
        $scope.marca.forEach(function (p) {
            if ($scope.clasificacionSelected == p.clasificacion && !changed) {
                $scope.marcaSelected = p.id;
                changed = true;
            }
        });
    };
    function init() {
        try {

            $scope.familia = familia;
            $scope.clasificacion = clasificacion;
            $scope.marca = marca;
            $scope.modelo = modelo;
            angular.forEach($scope.clasificacion, function(p) {
                p.familia = p.almacenFamilia.id;
            });
            angular.forEach($scope.marca, function(p) {
                p.clasificacion = p.almacenClasificacion.id;
            });
            angular.forEach($scope.modelo, function(p) {
                p.marca = p.almacenMarca.id;
            });
            $scope.familiaSelected = $scope.modelo[0].almacenMarca.almacenClasificacion.almacenFamilia.id;
            $scope.familiaSelectedRefaccion = $scope.modelo[0].almacenMarca.almacenClasificacion.almacenFamilia;
            $scope.clasificacionSelected = $scope.modelo[0].almacenMarca.almacenClasificacion.id;
            $scope.marcaSelected = $scope.modelo[0].almacenMarca.id;
            $scope.tipoRefaccion = '1';
        } catch (e) {
        }
    }
    init();
}]);
angular.module('giaApp.controllers').controller('almacenrefaccionUpdateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    $scope.almacenModelo = {id:undefined};
    $scope.changeFamilia = function() {
        var changed = false;
        $scope.clasificacion.forEach(function (p) {
            if ($scope.familiaSelected == p.familia && !changed) {
                $scope.clasificacionSelected = p.id;
                changed = true;
            }
        });
        $scope.changeClasificacion();
    };
    $scope.changeClasificacion = function() {
        var changed = false;
        $scope.marca.forEach(function (p) {
            if ($scope.clasificacionSelected == p.clasificacion && !changed) {
                $scope.marcaSelected = p.id;
                changed = true;
            }
        });
    };
    function init() {
        try {
            $scope.familia = familia;
            $scope.clasificacion = clasificacion;
            $scope.marca = marca;
            $scope.modelo = modelo;
            $scope.entity = entity;
            angular.forEach($scope.clasificacion, function(p) {
                p.familia = p.almacenFamilia.id;
            });
            angular.forEach($scope.marca, function(p) {
                p.clasificacion = p.almacenClasificacion.id;
            });
            angular.forEach($scope.modelo, function(p) {
                p.marca = p.almacenMarca.id;
            });
            $scope.familiaSelected = $scope.entity.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.id;
            $scope.clasificacionSelected = $scope.entity.almacenModelo.almacenMarca.almacenClasificacion.id;
            $scope.marcaSelected = $scope.entity.almacenModelo.almacenMarca.id;
            $scope.almacenModelo.id = $scope.entity.almacenModelo.id;
            $scope.tipoRefaccion = $scope.entity.tipo + '';
        } catch (e) {
            $scope.familiaSelected = $scope.modelo[0].almacenMarca.almacenClasificacion.almacenFamilia.id;
            $scope.clasificacionSelected = $scope.modelo[0].almacenMarca.almacenClasificacion.id;
            $scope.marcaSelected = $scope.modelo[0].almacenMarca.id;
            $scope.tipoRefaccion = '1';
        }
    }
    init();
}]);

// QTL
angular.module('giaApp.controllers').controller('almacenqtlCreateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    $scope.almacenModelo={id:1};
    $scope.modelo =undefined;
    $scope.changeMarca = function() {
        var change = false;
        $scope.modelo.forEach(function (p) {
            if (p.marca == $scope.marcaSelected && !change) {
                $scope.almacenModelo.id = p.id;
                change = true;
            }
            if (p.id == $scope.almacenModelo.id) {
                $scope.todescribe = p;
            }
        });
    };
    $scope.changeModelo = function() {
        $scope.modelo.forEach(function(p) {
            if (p.id == $scope.almacenModelo.id) {
                $scope.todescribe = p;
            }
        });
    };
    function init() {
        try {
            $scope.marca = marca;
            $scope.modelo = modelo;
            angular.forEach($scope.modelo, function(p) {
                p.marca = p.almacenMarca.id;
            });
            $scope.marcaSelected = $scope.modelo[0].almacenMarca.id;
        } catch (e) {
        }
    }
    init();
}]);
angular.module('giaApp.controllers').controller('almacenqtlUpdateController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {
    $scope.almacenModelo={id:1};
    $scope.modelo =undefined;
    $scope.changeMarca = function() {
        var change = false;
        $scope.modelo.forEach(function (p) {
            if (p.marca == $scope.marcaSelected && !change) {
                $scope.almacenModelo.id = p.id;
                change = true;
            }
            if (p.id == $scope.almacenModelo.id) {
                $scope.todescribe = p;
            }
        });
    };
    $scope.changeModelo = function() {
        $scope.modelo.forEach(function(p) {
            if (p.id == $scope.almacenModelo.id) {
                $scope.todescribe = p;
            }
        });
    };
    function init() {
        try {
            $scope.entity = entity;
            $scope.marca = marca;
            $scope.modelo = modelo;
            angular.forEach($scope.modelo, function(p) {
                p.marca = p.almacenMarca.id;
            });
            $scope.marcaSelected = entity.almacenModelo.almacenMarca.id;
        } catch (e) {
            $scope.marcaSelected = $scope.modelo[0].almacenMarca.id;
        }
    }
    init();
}]);