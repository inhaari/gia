angular.module('giaApp.controllers').controller('solicitudviajeCreateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.rutas = [];
    $scope.idx = 0;

    function init() {
        $scope.form = form;
        $scope.ruta = ruta;
        $scope.productoCliente = productoCliente;
        $scope.cliente = cliente;
        $scope.uso = uso;
        $scope.cd = cd;
        $scope.rendimiento = rendimiento;
        $scope.cd.forEach(function(p) {
            if (p.localidad != null) {
                p.localidadId = p.localidad.id;
            }
        });
        if (Array.isArray(cliente)) {
            $scope.isOnlyClient = false;
            $scope.currentClient = cliente[0];
            $scope.cliente.forEach(function(p){
                p.productos = [];
                $scope.productoCliente.forEach(function(q) {
                    if (p.id == q.cliente.id) {
                        p.productos.push(q.producto);
                    }
                })
            });
        } else {
            $scope.isOnlyClient = true;
            $scope.currentClient = cliente;
            $scope.productoCliente.forEach(function(q) {
                $scope.currentClient.productos = [];
                if ($scope.currentClient.id == q.cliente.id) {
                    p.productos.push(q.producto);
                }
            })
        }
    }

    $scope.changeCDOrigen = function(node) {
        $('#cdOrigenModal').modal('show');
        $scope.currentOrigenLocalidad = node.ruta.origen.id;
        $scope.currentNode = node;
    };

    $scope.closeCDOrigen = function() {
        $scope.currentNode.cdo = $scope.currentCDOrigen;
        $('#cdOrigenModal').modal('hide');
    };

    $scope.changeCDDestino = function(node) {
        $('#cdDestinoModal').modal('show');
        $scope.currentDestinoLocalidad = node.ruta.destino.id;
        $scope.currentNode = node;
    };

    $scope.closeCDDestino = function() {
        $scope.currentNode.cdd = $scope.currentCDDestino;
        $('#cdDestinoModal').modal('hide');
    };

    $scope.changeRuta = function(node) {
        node.error = null;
        var min=null, max=null;
        node.cdo = null;
        node.cdd = null;
        $scope.rutas.forEach(function(p) {
            if (min == null) min = p.idx;
            if (max == null) max = p.idx;
            if (p.idx < min) min = p.idx;
            if (p.idx > max) max = p.idx;
        });
        if (node.idx !== min) {
            var prev = null;
            var previdx = null;
            $scope.rutas.forEach(function(p) {
                if (previdx == null) {
                    previdx = p.idx;
                    prev = p;
                }
                // Valida que el p.idx sea mayor al idx actual
                // y que el p.idx sea menor al idx del nodo
                if (p.idx > previdx &&  p.idx < node.idx) {
                    previdx = p.idx;
                    prev = p;
                }
            })
            if (prev.ruta.destino.id != node.ruta.origen.id) {
                node.error = 'El origen no coincide con el destino de la ruta anterior'
            }
        }
    };

    $scope.removeRuta = function(p) {
        $scope.rutas.splice($scope.rutas.indexOf(p), 1);
    };

    $scope.addRuta = function() {
        $scope.rutas.push({
            disponibles: angular.copy($scope.ruta),
            ruta: null,
            idx: $scope.idx++,
            cdo: null, // centro de carga/descarga destino
            cdd: null, // centro de carga/descarga destino
        })
    };

    $scope.save = function() {
        if ($scope.currentClient == undefined || !($scope.currentClient.id > 0)) {
            toastr.error("Cliente invalido")
            return;
        }
        if ($scope.currentProducto == undefined || !($scope.currentProducto.id > 0)) {
            toastr.error("Producto invalido")
            return;
        }
        $scope.currentDate = $('#fechaViaje').val();
        if ($scope.currentDate == undefined || !($scope.currentDate.length > 0)) {
            toastr.error("Fecha invalida")
            return;
        }
        if ($scope.currentToneladas == undefined || !($scope.currentToneladas >= 0)) {
            toastr.error("Litros invalidos")
            return;
        }
        if ($scope.rutas.length < 1) {
            toastr.error("Debe incluir al menos una ruta");
            return;
        }
        var validRutas = true;
        $scope.rutas.forEach(function(p) {
            if (p.ruta == undefined || p.ruta.id == undefined || p.ruta.id < 1) {
                validRutas = false;
            }
        });
        if (!validRutas) {
            toastr.error("Debe seleccionar todas las rutas");
            return;
        }
        $scope.rutas.forEach(function(p) {
            if (p.cdd == undefined || p.cdo == undefined || p.cdd.id == undefined || p.cdo.id == undefined ||
                p.cdd == null || p.cdo == null || p.cdd.id == null || p.cdo.id == null) {
                validRutas = false;
            }
        });
        if (!validRutas) {
            toastr.error("Los C/D son requiridos en cada ruta");
            return;
        }
        debugger
        var viaje = {
            cliente: {
                id: $scope.currentClient.id,
            },
            producto: {
                id: $scope.currentProducto.id,
            },
            flotaUso: {
                id: $scope.currentUso.id,
            },
            litros: $scope.currentToneladas,
            devolucion: $scope.currentDevolucion,
            rutaRendimiento: {
                id: $scope.rutaRendimiento.id,
            },
            fecha: moment($scope.currentDate,'YYYY-MM-DD'),
            path: []
        };
        $scope.rutas.forEach(function(p) {
            viaje.path.push({
                ruta: {
                    id: p.ruta.id
                },
                secuencia: p.idx,
                origen: {
                    id: p.cdo.id,
                },
                destino: {
                    id: p.cdd.id,
                }
            })
        });
        giaFactory.postSolicitudViaje(viaje).then(function(response) {
            if (response.data.id > 0) {
                $('#modalFinish').modal('show');
            } else {
                toastr.error("Ocurrio un error al guardar el viaje. Por favor contacte al administrador del sistema")
            }
        });
    };

    init();
}]);

angular.module('giaApp.controllers').controller('solicitudviajeUpdateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.rutas = [];
    $scope.idx = 0;
    $scope.loaded = false;

    function init() {
        $scope.form = form;
        $scope.ruta = ruta;
        $scope.productoCliente = productoCliente;
        $scope.cliente = cliente;
        $scope.currentProducto = form.producto;
        $scope.currentClient = form.cliente;
        $scope.currentClient.productos = [];
        $scope.uso = uso;
        $scope.rendimiento = rendimiento;
        $scope.rendimiento.forEach(function(p) {
            debugger
            if (p.id == form.rutaRendimiento.id) {
                $scope.rutaRendimiento = p;
            }
        });
        $scope.uso.forEach(function(p) {
            if (p.id == form.flotaUso.id) {
                $scope.currentUso = p;
            }
        });
        $scope.cd = cd;
        $scope.cd.forEach(function(p) {
            if (p.localidad != null) {
                p.localidadId = p.localidad.id;
            }
        });
        $scope.productoCliente.forEach(function(p) {
            if ($scope.currentClient.id == p.cliente.id) {
                $scope.currentClient.productos.push(p.producto);
            }
        });
        $scope.currentClient.productos.forEach(function(p) {
            if (p.id == $scope.currentProducto.id) {
                $scope.currentProducto = p;
            }
        });
        $scope.currentDate = form.fecha.substring(0, 10);
        $scope.currentToneladas = form.litros;
        $scope.currentDevolucion = form.devolucion;
        if (form.path != null && form.path.length > 0) {
            for (var i = 0; i<form.path.length; i++) {
                var p = form.path[i];
                console.log(p);
                node = {
                    disponibles: angular.copy($scope.ruta),
                    ruta: p.ruta,
                    idx: $scope.idx++,
                    cdo: p.origen, // centro de carga/descarga destino
                    cdd: p.destino, // centro de carga/descarga destino
                };
                node.disponibles.forEach(function(q) {
                    if (q.id == node.ruta.id) {
                        node.ruta = q;
                    }
                });
                $scope.rutas.push(node);
                $scope.changeRuta(node);
            }
            $scope.loaded = true;
        }
    }

    $scope.changeCDOrigen = function(node) {
        $('#cdOrigenModal').modal('show');
        $scope.currentOrigenLocalidad = node.ruta.origen.id;
        $scope.currentNode = node;
    };

    $scope.closeCDOrigen = function() {
        $scope.currentNode.cdo = $scope.currentCDOrigen;
        $('#cdOrigenModal').modal('hide');
    };

    $scope.changeCDDestino = function(node) {
        $('#cdDestinoModal').modal('show');
        $scope.currentDestinoLocalidad = node.ruta.destino.id;
        $scope.currentNode = node;
    };

    $scope.closeCDDestino = function() {
        $scope.currentNode.cdd = $scope.currentCDDestino;
        $('#cdDestinoModal').modal('hide');
    };

    $scope.changeRuta = function(node) {
        node.error = null;
        var min=null, max=null;
        if ($scope.loaded) {
            node.cdo = null;
            node.cdd = null;
        }

        $scope.rutas.forEach(function(p) {
            if (min == null) min = p.idx;
            if (max == null) max = p.idx;
            if (p.idx < min) min = p.idx;
            if (p.idx > max) max = p.idx;
        });
        if (node.idx !== min) {
            var prev = null;
            var previdx = null;
            $scope.rutas.forEach(function(p) {
                if (previdx == null) {
                    previdx = p.idx;
                    prev = p;
                }
                // Valida que el p.idx sea mayor al idx actual
                // y que el p.idx sea menor al idx del nodo
                if (p.idx > previdx &&  p.idx < node.idx) {
                    previdx = p.idx;
                    prev = p;
                }
            })
            if (prev.ruta.destino.id != node.ruta.origen.id) {
                node.error = 'El origen no coincide con el destino de la ruta anterior'
            }
        }
    };

    $scope.removeRuta = function(p) {
        $scope.rutas.splice($scope.rutas.indexOf(p), 1);
    };

    $scope.addRuta = function() {
        $scope.rutas.push({
            disponibles: angular.copy($scope.ruta),
            ruta: null,
            idx: $scope.idx++,
        })
    };

    $scope.save = function() {
        if ($scope.currentClient == undefined || !($scope.currentClient.id > 0)) {
            toastr.error("Cliente invalido");
            return;
        }
        if ($scope.currentProducto == undefined || !($scope.currentProducto.id > 0)) {
            toastr.error("Producto invalido");
            return;
        }
        $scope.currentDate = $('#fechaViaje').val();
        if ($scope.currentDate == undefined || !($scope.currentDate.length > 0)) {
            toastr.error("Fecha invalida");
            return;
        }
        if ($scope.currentToneladas == undefined || !($scope.currentToneladas >= 0)) {
            toastr.error("Litros invalidos");
            return;
        }
        if ($scope.rutas.length < 1) {
            toastr.error("Debe incluir al menos una ruta");
            return;
        }
        var validRutas = true;
        $scope.rutas.forEach(function(p) {
            if (p.ruta == undefined || p.ruta.id == undefined || p.ruta.id < 1) {
                validRutas = false;
            }
        });
        if (!validRutas) {
            toastr.error("Debe seleccionar todas las rutas");
            return;
        }
        $scope.rutas.forEach(function(p) {
            if (p.cdd == undefined || p.cdo == undefined || p.cdd.id == undefined || p.cdo.id == undefined ||
                p.cdd == null || p.cdo == null || p.cdd.id == null || p.cdo.id == null) {
                validRutas = false;
            }
        });
        if (!validRutas) {
            toastr.error("Los C/D son requiridos en cada ruta");
            return;
        }
        var viaje = {
            id: $scope.form.id,
            cliente: {
                id: $scope.currentClient.id,
            },
            producto: {
                id: $scope.currentProducto.id,
            },
            flotaUso: {
                id: $scope.currentUso.id,
            },
            litros: $scope.currentToneladas,
            devolucion: $scope.currentDevolucion,
            fecha: moment($scope.currentDate,'YYYY-MM-DD'),
            rutaRendimiento: {
                id: $scope.rutaRendimiento.id,
            },
            path: []
        };
        $scope.rutas.forEach(function(p) {
            viaje.path.push({
                ruta: {
                    id: p.ruta.id
                },
                secuencia: p.idx,
                origen: {
                    id: p.cdo.id,
                },
                destino: {
                    id: p.cdd.id,
                }
            })
        });
        giaFactory.putSolicitudViaje(viaje).then(function(response) {
            if (response.data.id > 0) {
                $('#modalFinish').modal('show');
            } else {
                toastr.error("Ocurrio un error al guardar el viaje. Por favor contacte al administrador del sistema")
            }
        });
    };

    init();
}]);