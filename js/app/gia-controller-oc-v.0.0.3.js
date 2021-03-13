// Create Requisicion
angular.module('giaApp.controllers').controller('requisicionCreateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.refacciones = [];

    $scope.addRefaccion = function() {
        var tmp = {};
        $scope.refacciones.forEach(function(p) {
            tmp[parseInt(p.id)] = 1;
        });
        var refaccionFiltered = []
        $scope.refaccion.forEach(function(p) {
            if (!(p.id in tmp)) {
                refaccionFiltered.push(p);
            }
        });
        $scope.refacciones.push({
            cantidad: 0,
            id: '0',
            clasificacion: 1,
            options: refaccionFiltered
        });
    };

    $scope.updateFilterRefaccion = function(r) {
        var tmp ={};
        $scope.refacciones.forEach(function(p) {
            tmp[parseInt(p.id)] = 1;
        });
        $scope.refacciones.forEach(function(o) {
            var refaccionFiltered = [];
            $scope.refaccion.forEach(function(p) {
                if (p.id == o.id || !(p.id in tmp)) {
                    refaccionFiltered.push(p);
                }
            });
            o.options = refaccionFiltered;
        });
    };

    $scope.checkRefaccion = function(id) {
        console.log('checkRefaccion');
        $scope.refaccionCheck = undefined;
        $scope.refaccion.forEach(function(p) {
            if (p.id == id) {
                $scope.refaccionCheck = p;
            }
        });
        if ($scope.refaccionCheck != undefined) {
            console.log($scope.refaccionCheck)
            $scope.refacciones.push($scope.refaccionCheck);
        }
        $('#modalRefaccion').modal('hide');
    };

    $scope.removeRefaccion = function(p) {
        $scope.refacciones.splice($scope.refacciones.indexOf(p), 1);
    };

    $scope.save = function () {
        if ($scope.refacciones ==undefined || $scope.refacciones.length < 1) {
            toastr.error('Debe agregar por lo menos una refacción');
            return;
        }
        invalid = false;
        $scope.refacciones.forEach(function(p) {
            if (p.id == 0) invalid = true;
        });
        if (invalid) {
            toastr.error('Por favor, valide las refacciones seleccionadas');
            return;
        }
        $scope.refacciones.forEach(function(p) {
            if (p.cantidad < 1) invalid = true;
        });
        if (invalid) {
            toastr.error('Por favor, valide las cantidades de las refacciones');
            return;
        }
        console.log('data');
        $('#modalLoadingCommon').modal('show');

        giaFactory.postRequisicion({
            requerida: moment($('#requerida').val()).toDate(),
            usuarioRegistra: {
                id: $scope.user,
                requerida: $scope.requerida
            }
        }).then(function(response) {
            console.log('response', response.data);
            if (response.data.id > 0) {
                var promises = [];
                $timeout(function() {
                    $scope.refacciones.forEach(function(p) {
                        var request = giaFactory.postRequisicionDetalle({
                            requisicion: {
                                id: response.data.id,
                            },
                            cantidad: p.cantidad,
                            almacenRefaccion: {
                                id: p.id
                            }
                        }).then(function(response) {
                            console.log('response', response.data);
                        });
                        promises.push(request);
                    });
                    $q.all(promises).then(function(result){
                        $('#modalLoadingCommon').modal('hide');
                        $('#modalFinish').modal('show');
                    });
                },2000);
            }
        })
    };

    function init() {
        //<option ng-repeat="q in clasificacion | orderBy:'almacenFamilia.nombre'" ng-value="q.id">{{q.almacenFamilia.nombre}} - {{q.nombre}}</option>
        $scope.clasificacion = clasificacion;
        $scope.clasificacion.forEach(function(p) {
            p.nombrecompuesto = p.almacenFamilia.nombre + ' - ' + p.nombre;
        });
        $scope.requisicion = requisicion;
        $scope.detalle = detalle;
        $scope.refaccion = refaccion;
        $scope.refaccion.forEach(function(p) {
            p.clasificacion = p.almacenModelo.almacenMarca.almacenClasificacion.id;
            // <option ng-repeat="q in p.options | filter: { clasificacion : p.clasificacion}:true | orderBy:'codigo'" ng-value="q.id">{{q.codigo}} - {{q.nombre}} - {{q.almacenModelo.almacenMarca.nombre}} - {{q.almacenModelo.nombre}}</option>
            p.nombrecompuesto = p.codigo + ' -' + p.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.nombre + ' - ' + p.almacenModelo.almacenMarca.nombre + ' - ' + p.almacenModelo.nombre + ' - ' + p.nombre;
            console.log(p.nombrecompuesto);
        });
        $scope.refaccionFiltered = $scope.refaccion;
        $scope.user = user;
        console.log(refaccion);
    }
    init();
}]);
// Update Requisicion
angular.module('giaApp.controllers').controller('requisicionUpdateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.refacciones = [];

    $scope.addRefaccion = function() {
        var tmp = {};
        $scope.refacciones.forEach(function(p) {
            tmp[parseInt(p.id)] = 1;
        });
        var refaccionFiltered = []
        $scope.refaccion.forEach(function(p) {
            if (!(p.id in tmp)) {
                refaccionFiltered.push(p);
            }
        });
        $scope.refacciones.push({
            cantidad: 0,
            id: '0',
            clasificacion: 1,
            almacenRefaccion: {
                id: '0'
            },
            options: refaccionFiltered
        });
    };

    $scope.updateFilterRefaccion = function(r) {
        var tmp ={};
        $scope.refacciones.forEach(function(p) {
            tmp[parseInt(p.id)] = 1;
        });
        $scope.refacciones.forEach(function(o) {
            var refaccionFiltered = [];
            $scope.refaccion.forEach(function(p) {
                if (p.id == o.id || !(p.id in tmp)) {
                    refaccionFiltered.push(p);
                }
            });
            o.options = refaccionFiltered;
        });
    };

    $scope.removeRefaccion = function(p) {
        if (p.id != undefined) {
            giaFactory.deleteRequisicionDetalle(p.id).then(function (response) {
                console.log('response', response);
            })
        }
        $scope.refacciones.splice($scope.refacciones.indexOf(p), 1);
    };

    $scope.save = function () {
        if ($scope.refacciones ==undefined || $scope.refacciones.length < 1) {
            toastr.error('Debe agregar por lo menos una refacción');
            return;
        }
        invalid = false;
        $scope.refacciones.forEach(function(p) {
            if (p.id == 0) invalid = true;
        });
        if (invalid) {
            toastr.error('Por favor, valide las refacciones seleccionadas');
            return;
        }
        $scope.refacciones.forEach(function(p) {
            if (p.cantidad < 1) invalid = true;
        });
        if (invalid) {
            toastr.error('Por favor, valide las cantidades de las refacciones');
            return;
        }
        console.log('data');
        $('#modalLoadingCommon').modal('show');

        giaFactory.putRequisicion({
            id: $scope.requisicion.id,
            requerida: moment($('#requerida').val()).toDate(),
            usuarioRegistra: {
                id: $scope.user,
                requerida: $scope.requerida
            }
        }).then(function(response) {
            console.log('response', response.data);
            if (response.data.id > 0) {
                var promises = [];
                $timeout(function() {
                    $scope.refacciones.forEach(function(p) {
                        if (p.requisicion  != undefined && p.requisicion.id != undefined) {
                            var request = giaFactory.putRequisicionDetalle({
                                id: p.requisicion.id,
                                requisicion: {
                                    id: $scope.requisicion.id
                                },
                                cantidad: parseInt(p.cantidad),
                                almacenRefaccion: {
                                    id: p.id,
                                }
                            }).then(function(response) {
                                console.log('response', response.data);
                            });
                        } else {
                            var request = giaFactory.postRequisicionDetalle({
                                requisicion: {
                                    id: $scope.requisicion.id
                                },
                                cantidad: parseInt(p.cantidad),
                                almacenRefaccion: {
                                    id: p.id,
                                }
                            }).then(function(response) {
                                console.log('response', response.data);
                            });
                        }

                        promises.push(request);
                    });
                    $q.all(promises).then(function(result){
                        $('#modalLoadingCommon').modal('hide');
                        $('#modalFinish').modal('show');
                    });
                },2000);
            }
        })
    };

    function init() {
        $scope.clasificacion = clasificacion;
        $scope.clasificacion.forEach(function(p) {
            p.nombrecompuesto = p.almacenFamilia.nombre + ' - ' + p.nombre;
        });
        $scope.requisicion = requisicion;
        $scope.detalle = detalle;
        $scope.refaccion = refaccion;
        $scope.refaccion.forEach(function(p) {
            p.clasificacion = p.almacenModelo.almacenMarca.almacenClasificacion.id;
            p.nombrecompuesto = p.codigo + ' -' + p.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.nombre + ' - ' + p.almacenModelo.almacenMarca.nombre + ' - ' + p.almacenModelo.nombre + ' - ' + p.nombre;
        });
        $scope.user = user;
        console.log(refaccion);
        if ($scope.requisicion.requerida != null) {
            $scope.requerida = $scope.requisicion.requerida.substring(0, 10);
        }
        var tmp ={};
        $scope.detalle.forEach(function(p) {
            tmp[parseInt(p.almacenRefaccion.id)] = 1;
        });
        $scope.detalle.forEach(function(p) {
            console.log(p);
            p.clasificacion = p.almacenRefaccion.almacenModelo.almacenMarca.almacenClasificacion.id;
            var refaccionFiltered = [];
            $scope.refaccion.forEach(function(q) {
                q.clasificacion = q.almacenModelo.almacenMarca.almacenClasificacion.id;
                if (p.almacenRefaccion.id == q.id || !(q.id in tmp)) {
                    refaccionFiltered.push(q);
                }
            });
            $scope.refacciones.push({
                cantidad: p.cantidad,
                clasificacion: p.clasificacion,
                id: p.almacenRefaccion.id,
                requisicion: {
                    id: p.id
                },
                almacenRefaccion: {
                    id: p.almacenRefaccion.id
                },
                options: refaccionFiltered
            });
        })
    }
    init();
}]);

// Validadores
angular.module('giaApp.controllers').controller('ordencompraestatusCreateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.validador = undefined;
    $scope.usuario = undefined;
    $scope.usuarioFiltered = undefined;

    $scope.showValidador = function(id) {
        $scope.entity = undefined;
        $scope.entities.forEach(function(p) {
            if (p.id == id) {
                $scope.entity = p;
            }
        });
        if ($scope.entity != undefined) {
            $scope.usuarioFiltered = [];
            $scope.usuario.forEach(function(p) {
                if (p.nivel == -1 || p.nivel == $scope.entity.id) {
                    $scope.usuarioFiltered.push(p);
                }
            });
            $('#modalValidadores').modal('show');
        }
    };

    $scope.addValidador = function(p) {
        if (!p.included) {
            giaFactory.deleteOrdenCompraValidadorUsuario(p.id).then(function(data) {
                var located;
                p.nivel = -1;
                $scope.entity.validadores.forEach(function(validador) {
                    if (validador.usuario.id == p.id) {
                        located = validador;
                    }
                });
                $scope.entity.validadores.splice($scope.entity.validadores.indexOf(located), 1);
            });
            return;
        }
        if ($scope.entity.validadores == undefined) {
            $scope.entity.validadores = [];
        }
        if ($scope.entity.validadores != undefined && $scope.entity.validadores.length > 2) {
            p.included = false;
            toastr.error('Limite de validadores alcanzado, maximo 3 validadores');
            return;
        }

        giaFactory.addOrdenCompraValidadorUsuario($scope.entity.id, p.id).then(function(data) {
            p.included = true;
            p.nivel = $scope.entity.id;
            $scope.entity.validadores.push({
                id: -1,
                ordenCompraEstatus: $scope.entity,
                usuario: p,
            });
        });

    };

    function init() {
        console.log('init');
        $scope.entities = entities;
        giaFactory.getOrdenCompraValidador().then(function (data) {
            $scope.validador = data.data;
            console.log('validador', $scope.usuario);
            $scope.validador.forEach(function(p) {
                $scope.entities.forEach(function(q) {
                    if (p.ordenCompraEstatus.id == q.id) {
                        if (q.validadores == undefined) {
                            q.validadores = [];
                        }
                        q.validadores.push(p);
                    }
                });
            });
            giaFactory.getOrdenCompraValidadorUsuario().then(function(data) {
                $scope.usuario = data.data;
                $scope.usuario.forEach(function(usuario) {
                    usuario.nivel = -1;
                });
                $scope.entities.forEach(function (p) {
                    if (p.validadores != undefined && p.validadores.length && p.validadores.length > 0) {
                        p.validadores.forEach(function(val) {
                            $scope.usuario.forEach(function(usuario) {
                                if (usuario.id == val.usuario.id) {
                                    usuario.included = true;
                                    usuario.nivel = p.id;
                                }
                            })
                        });
                    }
                });
            });
        });
    }
    init();
}]);

// Create Orden de compra
angular.module('giaApp.controllers').controller('cotizacionCreateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.addRequisicion = function() {
        $scope.req = undefined;
        $scope.requisicion.forEach(function(p) {
            if (p.id == $scope.fr) {
                $scope.req = p;
            }
        });
        if ($scope.req != undefined) {
            $scope.req.included = true;

            $scope.req.detalle.forEach(function(p){
                p.included = true;
                p.proveedor1 = $scope.proveedor;
                p.proveedor2 = $scope.proveedor;
                p.proveedor3 = $scope.proveedor;
                p.ps1 = '-1';
                p.ps2 = '-1';
                p.ps3 = '-1';
            });
            $scope.fr = '-1';
        }
    };

    $scope.updateProveedorNested = function(p) {
        console.log(p);
        p.proveedor1 = removeDuplicate(p.ps2, p.ps3);
        p.proveedor2 = removeDuplicate(p.ps1, p.ps3);
        p.proveedor3 = removeDuplicate(p.ps1, p.ps2);
    };

    function removeDuplicate(o1, o2) {
        var cc = [];
        $scope.proveedor.forEach(function(p) {
            if ( (o1 == -1 || p.id != o1) && (o2 == -1 || p.id != o2)) {
                cc.push(p);
            }
        });
        return cc;
    }

    $scope.saveOc = function () {

        var count = 0;
        $scope.requisicion.forEach(function(p) {
            p.detalle.forEach(function (q) {
                if (q.included) {
                    count++;
                }
            });
        });
        if (count == 0) {
            toastr.error('Debe agregar al menos una refacción');
            return;
        }
        var valid = true;
        $scope.requisicion.forEach(function(p) {
            p.detalle.forEach(function (q) {
                if (q.included && (q.ps1 == -1 || q.ps2 == -1 || q.ps3 == -1)) {
                    valid = false;
                }
            });
        });
        if (!valid) {
            toastr.error('Uno o más proveedores no han sido seleccionados');
            return;
        }
        $('#modalLoadingCommon').modal('show');
        giaFactory.postCotizacion({
            proveedor: {
                id: $scope.ps
            },
            usuarioCrea: {
                id: $scope.usuario.id
            }
        }).then(function(response) {
            console.log(response);
            if (response.data.id > 0) {
                var promises = [];
                $timeout(function() {
                    $scope.requisicion.forEach(function(p) {
                        p.detalle.forEach(function(q) {
                            if (q.included) {
                                var request = giaFactory.postCotizacionDetalle({
                                    requisicionDetalle : {
                                        id: q.id
                                    },
                                    cotizacion: {
                                        id: response.data.id,
                                    },
                                    cantidad: q.cantidad,
                                    precioUnitario: q.precioUnitario,
                                    proveedor1 : {
                                        id: q.ps1
                                    },
                                    proveedor2 : {
                                        id: q.ps2
                                    },
                                    proveedor3 : {
                                        id: q.ps3
                                    }
                                });
                                promises.push(request);
                            }
                        });
                    });
                    $q.all(promises).then(function(result){
                        $('#modalLoadingCommon').modal('hide');
                        $('#modalFinish').modal('show');
                    });
                },2000);
            }
        });
    };

    function init() {
        $scope.requisicion = undefined;
        $scope.proveedor = proveedor;
        $scope.usuario = usuario;
        console.log($scope.proveedor);
        $scope.ps = '-1';
        giaFactory.getRequisicion().then(function(data) {
            $scope.requisicion = data.data;
            $scope.requisicion.forEach(function(p) {
                p.included = false;
            });
            $scope.fr = '-1';
        });
    }
    init();
}]);
// Update Orden de compra
angular.module('giaApp.controllers').controller('cotizacionUpdateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {


    $scope.updateProveedorNested = function(p) {
        console.log(p);
        p.proveedor1 = removeDuplicate(p.ps2, p.ps3);
        p.proveedor2 = removeDuplicate(p.ps1, p.ps3);
        p.proveedor3 = removeDuplicate(p.ps1, p.ps2);
    };

    function removeDuplicate(o1, o2) {
        var cc = [];
        $scope.proveedor.forEach(function(p) {
            if ( (o1 == -1 || p.id != o1) && (o2 == -1 || p.id != o2)) {
                cc.push(p);
            }
        });
        return cc;
    }

    $scope.addRequisicion = function() {
        $scope.req = undefined;
        $scope.requisicion.forEach(function(p) {
            if (p.id == $scope.fr) {
                $scope.req = p;
            }
        });
        if ($scope.req != undefined) {
            $scope.req.included = true;
            $scope.req.detalle.forEach(function(p){
                p.included = true;
                p.proveedor1 = $scope.proveedor;
                p.proveedor2 = $scope.proveedor;
                p.proveedor3 = $scope.proveedor;
                p.ps1 = '-1';
                p.ps2 = '-1';
                p.ps3 = '-1';
            });
            $scope.fr = '-1';
        }
    };

    $scope.updateProveedor = function() {
        if ($scope.ps == "-1") {
            $scope.ps = $scope.ordencompra.proveedor.id;
            toastr.error('Proveedor no valido');
            return;
        }
        giaFactory.putOrdenCompra({
            id: $scope.ordencompra.id,
            proveedor: {
                id: $scope.ps
            }
        }).then(function(response) {
            console.log('response', response);
            if (response.data.id > 0) {
                toastr.success('Proveedor actualizado');
            } else {
                toastr.error('No se pudo actualizar el proveedor');
            }
        });
    };

    $scope.saveOc = function () {
        var count = 0;
        $scope.requisicion.forEach(function(p) {
            p.detalle.forEach(function (q) {
                if (q.included) {
                    count++;
                }
            });
        });
        if (count == 0) {
            toastr.error('Debe agregar al menos una refacción');
            return;
        }
        var valid = true;
        $scope.requisicion.forEach(function(p) {
            p.detalle.forEach(function (q) {
                if (q.included && (q.ps1 == -1 || q.ps2 == -1 || q.ps3 == -1)) {
                    valid = false;
                }
            });
        });
        if (!valid) {
            toastr.error('Uno o más proveedores no han sido seleccionados');
            return;
        }
        $('#modalLoadingCommon').modal('show');
        giaFactory.deleteDetalleCotizacion($scope.cotizacion.id).then(function(response) {
            console.log(response);
            if (response.data.id > 0) {
                var promises = [];
                $timeout(function() {
                    $scope.requisicion.forEach(function(p) {
                        p.detalle.forEach(function(q) {
                            if (q.included) {
                                var request = giaFactory.postCotizacionDetalle({
                                    requisicionDetalle : {
                                        id: q.id
                                    },
                                    cotizacion: {
                                        id: response.data.id,
                                    },
                                    cantidad: q.cantidad,
                                    precioUnitario: q.precioUnitario,
                                    proveedor1 : {
                                        id: q.ps1
                                    },
                                    proveedor2 : {
                                        id: q.ps2
                                    },
                                    proveedor3 : {
                                        id: q.ps3
                                    }
                                });
                                promises.push(request);
                            }
                        });
                    });
                    $q.all(promises).then(function(result){
                        $('#modalLoadingCommon').modal('hide');
                        $('#modalFinish').modal('show');
                    });
                },2000);
            }
        });
    };

    function init() {
        $scope.requisicion = undefined;
        $scope.proveedor = proveedor;
        $scope.usuario = usuario;
        $scope.cotizacion = form;
        $scope.detalle = detalle;
        console.log($scope.proveedor);
        giaFactory.getRequisicion().then(function(data) {
            $scope.requisicion = data.data;
            $scope.requisicion.forEach(function(p) {
                p.included = false;
            });
            $scope.fr = '-1';
            var requisicion = {
                detalle: [],
                included: true,
            };
            $scope.detalle.forEach(function(p) {
                p.id = p.requisicionDetalle.id; // Agregamos el id de la requisicion para no afectar el flujo
                console.log(p);
                p.included = true;
                p.ps1 = p.proveedor1.id;
                p.ps2 = p.proveedor2.id;
                p.ps3 = p.proveedor3.id;
                p.proveedor1 = $scope.proveedor;
                p.proveedor2 = $scope.proveedor;
                p.proveedor3 = $scope.proveedor;
                $scope.updateProveedorNested(p);
                p.almacenRefaccion = p.requisicionDetalle.almacenRefaccion;
                requisicion.detalle.push(p);
            });
            $scope.requisicion.push(requisicion);
        });
    }
    init();
}]);

angular.module('giaApp.controllers').controller('cotizacionUpdateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {


    $scope.updateProveedorNested = function(p) {
        console.log(p);
        p.proveedor1 = removeDuplicate(p.ps2, p.ps3);
        p.proveedor2 = removeDuplicate(p.ps1, p.ps3);
        p.proveedor3 = removeDuplicate(p.ps1, p.ps2);
    };

    function removeDuplicate(o1, o2) {
        var cc = [];
        $scope.proveedor.forEach(function(p) {
            if ( (o1 == -1 || p.id != o1) && (o2 == -1 || p.id != o2)) {
                cc.push(p);
            }
        });
        return cc;
    }

    $scope.addRequisicion = function() {
        $scope.req = undefined;
        $scope.requisicion.forEach(function(p) {
            if (p.id == $scope.fr) {
                $scope.req = p;
            }
        });
        if ($scope.req != undefined) {
            $scope.req.included = true;
            $scope.req.detalle.forEach(function(p){
                p.included = true;
                p.proveedor1 = $scope.proveedor;
                p.proveedor2 = $scope.proveedor;
                p.proveedor3 = $scope.proveedor;
                p.ps1 = '-1';
                p.ps2 = '-1';
                p.ps3 = '-1';
            });
            $scope.fr = '-1';
        }
    };

    $scope.updateProveedor = function() {
        if ($scope.ps == "-1") {
            $scope.ps = $scope.ordencompra.proveedor.id;
            toastr.error('Proveedor no valido');
            return;
        }
        giaFactory.putOrdenCompra({
            id: $scope.ordencompra.id,
            proveedor: {
                id: $scope.ps
            }
        }).then(function(response) {
            console.log('response', response);
            if (response.data.id > 0) {
                toastr.success('Proveedor actualizado');
            } else {
                toastr.error('No se pudo actualizar el proveedor');
            }
        });
    };

    $scope.saveOc = function () {
        var count = 0;
        $scope.requisicion.forEach(function(p) {
            p.detalle.forEach(function (q) {
                if (q.included) {
                    count++;
                }
            });
        });
        if (count == 0) {
            toastr.error('Debe agregar al menos una refacción');
            return;
        }
        var valid = true;
        $scope.requisicion.forEach(function(p) {
            p.detalle.forEach(function (q) {
                if (q.included && (q.ps1 == -1 || q.ps2 == -1 || q.ps3 == -1)) {
                    valid = false;
                }
            });
        });
        if (!valid) {
            toastr.error('Uno o más proveedores no han sido seleccionados');
            return;
        }
        $('#modalLoadingCommon').modal('show');
        giaFactory.deleteDetalleCotizacion($scope.cotizacion.id).then(function(response) {
            console.log(response);
            if (response.data.id > 0) {
                var promises = [];
                $timeout(function() {
                    $scope.requisicion.forEach(function(p) {
                        p.detalle.forEach(function(q) {
                            if (q.included) {
                                var request = giaFactory.postCotizacionDetalle({
                                    requisicionDetalle : {
                                        id: q.id
                                    },
                                    cotizacion: {
                                        id: response.data.id,
                                    },
                                    cantidad: q.cantidad,
                                    precioUnitario: q.precioUnitario,
                                    proveedor1 : {
                                        id: q.ps1
                                    },
                                    proveedor2 : {
                                        id: q.ps2
                                    },
                                    proveedor3 : {
                                        id: q.ps3
                                    }
                                });
                                promises.push(request);
                            }
                        });
                    });
                    $q.all(promises).then(function(result){
                        $('#modalLoadingCommon').modal('hide');
                        $('#modalFinish').modal('show');
                    });
                },2000);
            }
        });
    };

    function init() {
        $scope.requisicion = undefined;
        $scope.proveedor = proveedor;
        $scope.usuario = usuario;
        $scope.cotizacion = form;
        $scope.detalle = detalle;
        console.log($scope.proveedor);
        giaFactory.getRequisicion().then(function(data) {
            $scope.requisicion = data.data;
            $scope.requisicion.forEach(function(p) {
                p.included = false;
            });
            $scope.fr = '-1';
            var requisicion = {
                detalle: [],
                included: true,
            };
            $scope.detalle.forEach(function(p) {
                p.id = p.requisicionDetalle.id; // Agregamos el id de la requisicion para no afectar el flujo
                console.log(p);
                p.included = true;
                p.ps1 = p.proveedor1.id;
                p.ps2 = p.proveedor2.id;
                p.ps3 = p.proveedor3.id;
                p.proveedor1 = $scope.proveedor;
                p.proveedor2 = $scope.proveedor;
                p.proveedor3 = $scope.proveedor;
                $scope.updateProveedorNested(p);
                p.almacenRefaccion = p.requisicionDetalle.almacenRefaccion;
                requisicion.detalle.push(p);
            });
            $scope.requisicion.push(requisicion);
        });
    }
    init();
}]);

// Gestion Cotizacion
angular.module('giaApp.controllers').controller('cotizaciongestionController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.saveGestion = function() {
        var valid = true;
        $scope.detalle.forEach(function(p) {
            if (!p.p1.na && (p.p1.dias <= 0 || p.p1.precio <=0)) {
                valid = false;
            }
            if (!p.p2.na && (p.p2.dias <= 0 || p.p2.precio <=0)) {
                valid = false;
            }
            if (!p.p3.na && (p.p3.dias <= 0 || p.p3.precio <=0)) {
                valid = false;
            }
        });
        if (!valid) {
            toastr.error('Error, validar precios/dias de entrega de proveedores. El día de entrega debe ser mayor a 0');
            return;
        }
        $scope.detalle.forEach(function(p) {
            if (p.p1.na && p.p2.na && p.p3.na) {
                valid = false;
            }
        });
        if (!valid) {
            toastr.error('Error, debe incluir al menos un proveedor');
            return;
        }

        $('#modalFinish').modal('show');
        return;
    };

    $scope.sendGestion = function(cot, idx) {
        console.log(cot, idx);
        var precio,dias, na;
        if (idx == 1) {
            na = cot.p1.na;
            precio = cot.p1.precio;
            dias = cot.p1.dias;
        }
        if (idx == 2) {
            na = cot.p2.na;
            precio = cot.p2.precio;
            dias = cot.p2.dias;
        }
        if (idx == 3) {
            na = cot.p3.na;
            precio = cot.p3.precio;
            dias = cot.p3.dias;
        }
        giaFactory.postCotizacionGestion({
            id: cot.id,
            idx: idx,
            precio: precio,
            dias: dias,
            na: na
        }).then(function(response) {
            if (response.data.id > 0) {


            }
        })
    };

    $scope.showModalPdf = function(cot, idx) {
        $scope.cot = cot;
        $scope.idx = idx;
        $scope.btnSendPdf = true;
        $('#modalPdf').modal('show');
    };

    $scope.sendPdf = function () {
        console.log('file is');
        console.log($scope.filePdf);
        var form = new FormData();
        form.append('id', 1);
        form.append('file', $scope.filePdf);
        $scope.btnSendPdf = false;
        console.log('pdf', $scope.cot, $scope.idx);
        giaFactory.postFile('/api/cotizacion/pdf/' + $scope.cot.id + '/' + $scope.idx, form).then(function(response) {
            $('#modalPdf').modal('hide');
            console.log('data', response);
            if (response.data) {
                if ($scope.idx == 1) {
                    $scope.cot.includePdf1 = true;
                }
                if ($scope.idx == 2) {
                    $scope.cot.includePdf2 = true;
                }
                if ($scope.idx == 3) {
                    $scope.cot.includePdf3 = true;
                }
                toastr.info('Archivo guardado correctamente');
            } else {
                toastr.error('Ocurrio un error, por favor intente más tardes');
            }
        });
    };

    function init() {
        $scope.requisicion = undefined;
        $scope.proveedor = proveedor;
        $scope.usuario = usuario;
        $scope.cotizacion = form;
        $scope.detalle = detalle;
        $scope.detalle.forEach(function(p) {
            p.p1 = {
                na: p.na1,
                precio: p.precio1,
                dias: p.dias1,
            };
            p.p2 = {
                na: p.na2,
                precio: p.precio2,
                dias: p.dias2,
            };
            p.p3 = {
                na: p.na3,
                precio: p.precio3,
                dias: p.dias3,
            }
        });
        console.log('proveedores', $scope.proveedor);
        console.log('cotizacion', $scope.cotizacion);
        console.log('detalle', $scope.detalle);
        console.log('form', $scope.cotizacion);
    }
    init();
}]);

// Manejador de Cotizacion
angular.module('giaApp.controllers').controller('cotizacionmanageController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.seleccionarProveedor = function(p, idx) {
        console.log('proveedor', p, idx);
        p.proveedorSelected1 = idx==1;
        p.proveedorSelected2 = idx==2;
        p.proveedorSelected3 = idx==3;
        giaFactory.postCotizacionManage({
            id: p.id,
            idx: idx,
        }).then(function(response) {
            console.log('response', response);
        })
    };

    $scope.saveManage = function() {
        var valid = true;
        $scope.detalle.forEach(function (p) {
            if (!(p.proveedorSelected1 || p.proveedorSelected2 || p.proveedorSelected3)) {
                valid = false;
            }
        });
        if (!valid) {
            toastr.error('Debe seleccionar el proveedor en todos los articulos');
            return;
        }
        $('#modalFinish').modal('show');
    };

    function init() {
        $scope.requisicion = undefined;
        $scope.proveedor = proveedor;
        $scope.usuario = usuario;
        $scope.cotizacion = form;
        $scope.detalle = detalle;
        $scope.detalle.forEach(function(p) {
            p.p1 = {
                na: p.na1,
                precio: p.precio1,
                dias: p.dias1,
            };
            p.p2 = {
                na: p.na2,
                precio: p.precio2,
                dias: p.dias2,
            };
            p.p3 = {
                na: p.na3,
                precio: p.precio3,
                dias: p.dias3,
            };
            p.proveedorSelected1 = p.proveedorElegido==1;
            p.proveedorSelected2 = p.proveedorElegido==2;
            p.proveedorSelected3 = p.proveedorElegido==3;
        });
        console.log('proveedores', $scope.proveedor);
        console.log('cotizacion', $scope.cotizacion);
        console.log('detalle', $scope.detalle);
        console.log('form', $scope.cotizacion);
    }
    init();
}]);

// Create Orden de compra
angular.module('giaApp.controllers').controller('ocCreateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.addCotizacion = function() {
        $scope.req = undefined;
        console.log('req', $scope.foc );
        $scope.cotizacion.forEach(function(p) {
            if (p.id == $scope.foc) {
                $scope.req = p;
            }
        });
        if ($scope.req != undefined) {
            $scope.req.included = true;
        }
        $scope.foc = '-1';
    };

    $scope.delCotizacion = function(p) {
          p.included = false;
          console.log(p);
          if (p.ocd != undefined && p.ocd > 0) {
              giaFactory.deleteDetalleOrdenCompra(p.ocd).then(function(response) {
                  console.log(response.data);
              })
          }
    };

    $scope.saveOc = function () {
        var count = 0;
        $scope.cotizacion.forEach(function(p) {
            if (p.included) {
                count++;
            }
        });
        if (count == 0) {
            toastr.error('Debe agregar al menos una cotización');
            return;
        }
        $('#modalLoadingCommon').modal('show');
        giaFactory.postOrdenCompra({
            usuarioCrea: {
                id: $scope.usuario.id
            }
        }).then(function(response) {
            console.log(response);
            if (response.data.id > 0) {
                var promises = [];
                $timeout(function() {
                    $scope.cotizacion.forEach(function(p) {
                        if (p.included) {
                            var request = giaFactory.postOrdenCompraDetalle({
                                ordenCompra: {
                                    id: response.data.id,
                                },
                                cotizacion: {
                                    id: p.id,
                                }
                            });
                            promises.push(request);
                        }
                    });
                    $q.all(promises).then(function(result){
                        $('#modalLoadingCommon').modal('hide');
                        $('#modalFinish').modal('show');
                    });
                },2000);
            }
        });
    };

    function init() {
        $scope.cotizacion = undefined;
        $scope.proveedor = proveedor;
        $scope.usuario = usuario;
        console.log($scope.proveedor);
        $scope.foc = '-1';
        giaFactory.getCotizacionToOC().then(function(data) {
            console.log('response', data);
            $scope.cotizacion = data.data;
            $scope.cotizacion.forEach(function(p) {
                p.included = false;
                p.detalle.forEach(function(q) {
                    q.provslc  = {
                        precio: q.proveedorElegido == 1 ? q.precio1 : (q.proveedorElegido == 2 ? q.precio2 : q.precio3),
                        dias: q.proveedorElegido == 1 ? q.dias1 : (q.proveedorElegido == 2 ? q.dias2 : q.dias3),
                        proveedor: q.proveedorElegido == 1 ? q.proveedor1 : (q.proveedorElegido == 2 ? q.proveedor2 : q.proveedor3),
                    };
                })
            });
        });
    }
    init();
}]);

// Update Orden de compra
angular.module('giaApp.controllers').controller('ocUpdateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.addCotizacion = function() {
        $scope.req = undefined;
        console.log('req', $scope.foc );
        $scope.cotizacion.forEach(function(p) {
            if (p.id == $scope.foc) {
                $scope.req = p;
            }
        });
        if ($scope.req != undefined) {
            $scope.req.included = true;
        }
        $scope.foc = '-1';
    };

    $scope.delCotizacion = function(p) {
        p.included = false;
        console.log(p);
        if (p.odc != undefined && p.odc > 0) {
            giaFactory.deleteDetalleOrdenCompra(p.odc).then(function(response) {
                console.log(response.data);
            });
            p.odc = undefined;
        }
    };

    $scope.saveOc = function () {
        var count = 0;
        $scope.cotizacion.forEach(function(p) {
            if (p.included) {
                count++;
            }
        });
        if (count == 0) {
            toastr.error('Debe agregar al menos una cotización');
            return;
        }
        $('#modalLoadingCommon').modal('show');
        var promises = [];
        $timeout(function() {
            $scope.cotizacion.forEach(function(p) {
                if (p.included) {
                    if (p.odc == undefined || p.odc < 1) {
                        var request = giaFactory.postOrdenCompraDetalle({
                            ordenCompra: {
                                id: $scope.ordencompra.id,
                            },
                            cotizacion: {
                                id: p.id,
                            }
                        });
                    }
                    promises.push(request);
                }
            });
            $q.all(promises).then(function(result){
                $('#modalLoadingCommon').modal('hide');
                $('#modalFinish').modal('show');
            });
        },2000);
    };

    function init() {
        $scope.cotizacion = undefined;
        $scope.usuario = usuario;
        $scope.ordencompra = ordencompra;
        $scope.detalle = detalle;
        console.log('oc', $scope.ordencompra);
        console.log('detalle', $scope.detalle);
        $scope.foc = '-1';
        giaFactory.getCotizacionToOC().then(function(data) {
            console.log('response', data);
            $scope.cotizacion = data.data;
            $scope.cotizacion.forEach(function(p) {
                console.log('cot', p);
                if (p.estatus == 4) {
                    $scope.detalle.forEach(function(q) {
                        console.log('valid', p,q);
                        if (q.cotizacion.id == p.id) {
                            p.estatus = 3;
                        }
                    });
                }
            });
            $scope.cotizacion.forEach(function(p) {
                p.included = false;
                p.detalle.forEach(function(q) {
                    q.provslc  = {
                        precio: q.proveedorElegido == 1 ? q.precio1 : (q.proveedorElegido == 2 ? q.precio2 : q.precio3),
                        dias: q.proveedorElegido == 1 ? q.dias1 : (q.proveedorElegido == 2 ? q.dias2 : q.dias3),
                        proveedor: q.proveedorElegido == 1 ? q.proveedor1 : (q.proveedorElegido == 2 ? q.proveedor2 : q.proveedor3),
                    };
                });
                $scope.detalle.forEach(function(q) {
                    if (q.cotizacion.id === p.id) {
                        p.included = true;
                        p.odc = q.id;
                    }
                });
            });

        });
    }
    init();


}]);
