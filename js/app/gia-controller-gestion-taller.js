// Marca
angular.module('giaApp.controllers').controller('gestiontallerRecursosController', ['$scope', '$window', '$interval', '$timeout', 'giaFactory', function($scope, $window, $interval, $timeout, giaFactory) {

    $scope.addRefaccion = function(p) {
        p.refaccion.push({
            id:null,
            almacenRefaccion: {
                id: null,
            }
        })
    };

    $scope.removeRefaccion = function(p, q) {
        if (q.id > 0) {
            giaFactory.deleteOrdenTrabajoRefaccion(q.id).then(function(response) {
                console.log('response', response);
            })
        }
        console.log('refaccion', q);
        p.refaccion.splice(p.refaccion.indexOf(q), 1);
    };


    $scope.save = function(p) {
        console.log('function', p);
        if (p.principal.empleado.id == null) {
            toastr.error('Mecanico no seleccionado');
            return;
        }
        if (p.ordenTrabajo.auxiliar && p.secundario.empleado.id == null) {
            toastr.error('Mecanico auxiliar no seleccionado');
            return;
        }
        if (p.ordenTrabajo.auxiliar && (p.principal.empleado.id == p.secundario.empleado.id)) {
            toastr.error('Mecanico auxiliar no valido. Mecanico duplicado');
            return;
        }
        var noError = true;
        if (p.refaccion.length > 0) {
            var idRef = {};
            for (var i = 0; i < p.refaccion.length; i++) {
                var q = p.refaccion[i];
                if ((q.almacenRefaccion.id in idRef)) {
                    toastr.error('Una o más refacciones se encuentran duplicadas');
                    noError = false;
                    return;
                } else {
                    idRef[q.almacenRefaccion.id] = 1;
                }
                if (q.almacenRefaccion.id == null) {
                    noError = false;
                    toastr.error('Refacción requerida');
                    return;
                }
                if (q.cantidad == undefined || q.cantidad < 1) {
                    noError = false;
                    toastr.error('Todas las cantidades deben ser ingresadas');
                    return;
                }
            }
        }
        if (noError) {
            if (p.ordenTrabajo.id == null) {
                p.ordenTrabajo = p.back.ordenTrabajo;
            }
            giaFactory.postOrdenTrabajo(p).then(function (response) {
                console.log(response);
                p.ordenTrabajo.id = response.data.ordenTrabajo.id;
                p.ordenTrabajo.fot = response.data.ordenTrabajo.fot;
                if (response.data.ordenTrabajo.id > 0) {
                    toastr.info('Orden de trabajo generada correctamente');
                }
                if (response.data.ordenTrabajo.reporteGeneral.estatus == 2) {
                    toastr.success('Reporte completado correctamente');
                    $timeout( function(){
                        window.location.href = "/gestiontaller";
                    }, 3000 );
                }
            })
        }

    };

    function init() {
        $scope.form = [];
        $scope.empleado = empleado;
        $scope.empleado.forEach(function(p) {
            p.fullname = p.paterno + ' ' + p.materno + ' ' + p.nombre;
        });
        $scope.refaccion = refaccion;
        $scope.reporte = reporte;
        $scope.general = general;
        console.log('general', $scope.general);
        $scope.refaccion.forEach(function(p) {
            p.nombrecompuesto = p.codigo + ' -' + p.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.nombre + ' - ' + p.almacenModelo.almacenMarca.nombre + ' - ' + p.almacenModelo.nombre + ' - ' + p.nombre;
        });
        $scope.reporte.forEach(function(p) {
            console.log(p);
            var rf = [];
            $scope.refaccion.forEach(function(q) {
                if (q.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.id == 17) {
                    rf.push(q);
                }
            });
            if ($scope.general.tipo == 0) {
                // Correctivo
                $scope.refaccion.forEach(function(q) {
                    if (q.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.id == p.ordenTrabajo.reporteCorrectivoSurvey.mantenimientoServicio.almacenFamilia.id) {
                        rf.push(q);
                    }
                });
            }
            if ($scope.general.tipo == 2) {
                // Preventivo
                $scope.refaccion.forEach(function(q) {
                    if (q.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.id == p.ordenTrabajo.reportePreventivoSurvey.mantenimientoServicio.almacenFamilia.id) {
                        rf.push(q);
                    }
                });
            }
            if ($scope.general.tipo == 4) {
                // Checklist
                $scope.refaccion.forEach(function(q) {
                    if (q.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.id == p.ordenTrabajo.reporteChecklistSurvey.mantenimientoServicio.almacenFamilia.id) {
                        rf.push(q);
                    }
                });
            }

            if (p.ordenTrabajo.id > 0) {
                // Elemento guardado previamente
                p.rf = rf;
                $scope.form.push(p);
            } else {
                var principal = {
                    id: null,
                    ordenTrabajo: null,
                    empleado: {
                        id: null,
                    },
                    auxiliar: false
                };
                var secundario = {
                    id: null,
                    ordenTrabajo: null,
                    empleado: {
                        id: null,
                    },
                    auxiliar: true
                };
                var otf = {
                    ordenTrabajo: {
                        id: null,
                        preventivo: p.ordenTrabajo.preventivo,
                        auxiliar: false,
                    },
                    principal: principal,
                    secundario: secundario,
                    refaccion: [],
                    rf: rf,
                    mantenimientoServicio: p.ordenTrabajo.mantenimientoServicio,
                    back: p
                };
                $scope.form.push(otf);
            }

            console.log('otf', otf);

        });
    }
    init();
}]);

angular.module('giaApp.controllers').controller('gestiontallerSalidaController', ['$scope', '$window', '$interval', '$timeout', 'giaFactory', function($scope, $window, $interval, $timeout, giaFactory) {

    $scope.addRefaccion = function(p) {
        var tmp = {};
        p.refaccion.forEach(function(q) {
            tmp[parseInt(q.almacenRefaccion.id)] = 1;
        });
        var refaccionFiltered = [];
        $scope.refaccion.forEach(function(q) {
            if (!(q.id in tmp)) {
                refaccionFiltered.push(q);
            }
        });
        // Agregamos refaccion a la orden de trabajo
        p.refaccion.push({
            id:null,
            almacenRefaccion: {
                id: null,
            },
            clasificacion: 1,
            options: refaccionFiltered,
        })
    };

    $scope.updateFilterRefaccion = function(parent, r) {
        var tmp ={};
        parent.refaccion.forEach(function(p) {
            tmp[parseInt(p.almacenRefaccion.id)] = 1;
        });
        parent.refaccion.forEach(function(o) {
            var refaccionFiltered = [];
            $scope.refaccion.forEach(function(p) {
                if (p.id == o.almacenRefaccion.id || !(p.id in tmp)) {
                    refaccionFiltered.push(p);
                }
            });
            o.options = refaccionFiltered;
        });
    };

    $scope.removeRefaccion = function(p, q) {
        if (q.id > 0) {
            giaFactory.deleteOrdenTrabajoRefaccion(q.id).then(function(response) {
                console.log('response', response);
            })
        }
        console.log('refaccion', q);
        p.refaccion.splice(p.refaccion.indexOf(q), 1);
    };

    $scope.save = function(p) {
        console.log('function', p);
        if (p.principal.empleado.id == null) {
            toastr.error('Mecanico no seleccionado');
            return;
        }
        if (p.ordenTrabajo.auxiliar && p.secundario.empleado.id == null) {
            toastr.error('Mecanico auxiliar no seleccionado');
            return;
        }
        if (p.ordenTrabajo.auxiliar && (p.principal.empleado.id == p.secundario.empleado.id)) {
            toastr.error('Mecanico auxiliar no valido. Mecanico duplicado');
            return;
        }
        var noError = true;
        if (p.refaccion.length > 0) {
            var idRef = {};
            for (var i = 0; i < p.refaccion.length; i++) {
                var q = p.refaccion[i];
                if ((q.almacenRefaccion.id in idRef)) {
                    toastr.error('Una o más refacciones se encuentran duplicadas');
                    noError = false;
                    return;
                } else {
                    idRef[q.almacenRefaccion.id] = 1;
                }
                if (q.almacenRefaccion.id == null) {
                    noError = false;
                    toastr.error('Refacción requerida');
                    return;
                }
                if (q.cantidad == undefined || q.cantidad < 1) {
                    noError = false;
                    toastr.error('Todas las cantidades deben ser ingresadas');
                    return;
                }
            }
        }
        if (noError) {
            if (p.ordenTrabajo.id == null) {
                p.ordenTrabajo = p.back.ordenTrabajo;
            }
            p.ordenTrabajoCamioneta = {
                id: p.ordenTrabajoCamioneta
            };
            giaFactory.postOrdenSalida(p).then(function (response) {
                console.log(response);
                p.ordenTrabajo.id = response.data.ordenTrabajo.id;
                p.ordenTrabajo.fot = response.data.ordenTrabajo.fot;
                if (response.data.ordenTrabajo.id > 0) {
                    toastr.info('Orden de trabajo generada correctamente');
                }
                // Pendiente por arribo
                if ( (response.data.ordenTrabajo.reporteGeneral.reporteAuxilio != null && response.data.ordenTrabajo.reporteGeneral.reporteAuxilio.interno == 4) ||
                     (response.data.ordenTrabajo.reporteGeneral.reporteAccidente != null && response.data.ordenTrabajo.reporteGeneral.reporteAccidente.interno == 4))
                {
                    toastr.success('Reporte completado correctamente');
                    $timeout( function(){
                        window.location.href = "/gestiontaller";
                    }, 3000 );
                }
            })
        }

    };

    function init() {
        $scope.form = [];
        $scope.empleado = empleado;
        $scope.empleado.forEach(function(p) {
            p.fullname = p.paterno + ' ' + p.materno + ' ' + p.nombre;
        });
        $scope.refaccion = refaccion;
        $scope.reporte = reporte;
        $scope.general = general;
        $scope.clasificacion = clasificacion;
        console.log('general', $scope.general);
        $scope.flota = flota;

        $scope.clasificacion.forEach(function(p) {
            p.nombrecompuesto = p.almacenFamilia.nombre + ' - ' + p.nombre;
        });
        $scope.refaccion.forEach(function(p) {
            p.clasificacion = p.almacenModelo.almacenMarca.almacenClasificacion.id;
            p.nombrecompuesto = p.codigo + ' -' + p.almacenModelo.almacenMarca.almacenClasificacion.almacenFamilia.nombre + ' - ' + p.almacenModelo.almacenMarca.nombre + ' - ' + p.almacenModelo.nombre + ' - ' + p.nombre;
            console.log(p.nombrecompuesto);
        });
        $scope.reporte.forEach(function(p) {
            console.log(p);
            if (p.ordenTrabajo.id > 0) {
                // Elemento guardado previamente
                p.back = angular.copy(p);
                $scope.form.push(p);
            } else {
                var principal = {
                    id: null,
                    ordenTrabajo: null,
                    empleado: {
                        id: null,
                    },
                    auxiliar: false
                };
                var secundario = {
                    id: null,
                    ordenTrabajo: null,
                    empleado: {
                        id: null,
                    },
                    auxiliar: true
                };
                var otf = {
                    ordenTrabajo: {
                        id: null,
                        preventivo: p.ordenTrabajo.preventivo,
                        auxiliar: false,
                    },
                    principal: principal,
                    secundario: secundario,
                    refaccion: [],
                    mantenimientoServicio: p.ordenTrabajo.mantenimientoServicio,
                    back: p
                };
                $scope.form.push(otf);
            }

            console.log('otf', otf);

        });
    }
    init();
}]);

angular.module('giaApp.controllers').controller('gestiontallerDevolucionController', ['$scope', '$window', '$interval', '$timeout', 'giaFactory', function($scope, $window, $interval, $timeout, giaFactory) {

    $scope.save = function() {
        var valid = true;
        $scope.refaccion.forEach(function(p) {
            console.log(p);
            if (p.usada == null || p.usada < 0) {
                valid = false;
            }
        });
        if (!valid) {
            toastr.error('Por favor, valide las cantidades de las refacciones');
            return;
        }
        giaFactory.postOrdenTrabajoRefaccion($scope.general.id, $scope.refaccion).then(function(response) {
            console.log('response');
            if (response.data.estatus == 2) {
                toastr.success('Reporte completado correctamente');
                $timeout( function(){
                    window.location.href = "/gestiontaller";
                }, 3000 );
            }
        });
    };

    function init() {
        $scope.general = general;
        $scope.refaccion = refaccion;
        console.log('general', general);
        console.log('refaccion', $scope.refaccion);
    }
    init();
}]);