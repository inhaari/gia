angular.module('giaApp.controllers').controller('atencionviajeCreateController', ['$scope', '$window', '$interval', '$timeout','$q', 'giaFactory', function($scope, $window, $interval, $timeout, $q, giaFactory) {

    $scope.max = 0;
    $scope.candidato = undefined;
    $scope.optimo = undefined;

    function init() {
        $scope.operadores = operadores;
        $scope.candidatos = candidatos;
        $scope.viaje = viaje;
        $scope.operador = operador;
        $scope.unidad = unidad;
        $scope.tanque = tanque;
        console.log('operadores', operadores);
        console.log('candidatos', candidatos);
        $scope.candidatos.forEach(function (p) {
            if ($scope.max < p.totalp) {
                $scope.max = p.totalp;
                $scope.optimo = p.flota.economico;
            }
        });
        operadores.forEach(function (value) {
            if ($scope.currentOperador == undefined) {
                $scope.currentOperador = value;
            }
        });
        if ($scope.unidad != undefined && $scope.unidad != null && $scope.unidad.length > 0) {
            var motorizado = null;
            $scope.unidad.forEach(function(p) {
                if (p.flota.motorizado) {
                    motorizado = p;
                }
            });
            $scope.candidatos.forEach(function (p) {
                if (p.flota.id == motorizado.flota.id) {
                    p.selected = true;
                }
            });
            // Leemos los tanques del formulario
            var tanques = [];
            $scope.unidad.forEach(function(p) {
                if (!p.flota.motorizado) {
                    tanques.push(p);
                }
            });
            if (tanques.length >0) {
                $scope.tanqueFirst = tanques[0].flota;
                $scope.tanque.forEach(function(q) {
                    if ($scope.tanqueFirst.id == q.id) {
                        $scope.tanqueFirst = q;
                    }
                });
                if (tanques.length > 1) {
                    $scope.tanqueSecond = tanques[1].flota;
                    $scope.tanque.forEach(function(q) {
                        if ($scope.tanqueSecond.id == q.id) {
                            $scope.tanqueSecond = q;
                        }
                    });
                }

            }


        }

        console.log('max', $scope.max);
    }

    $scope.loadMap = function(id) {
        $.get("/api/mantenimientosolicitudpreventivo/location/" + id, function(data, status){
            window.open("https://www.google.com/maps/search/?api=1&query=" + data, "_blank");
        });
    };

    $scope.selectCandidato = function(p) {
        $scope.candidatos.forEach(function (p) {
            p.selected = false;
        });
        p.selected = true;
        $scope.candidato = p;
    };
    $scope.save = function() {
        var candidatoSelected = false;
        var candidato = null;
        $scope.candidatos.forEach(function (p) {
            if (p.selected) {
                candidatoSelected = true;
                candidato = p;
            }
        });
        if (!candidatoSelected) {
            toastr.error("Debe seleccionar un candidato");
            return;
        }
        console.log('p', candidato.flota.economico);
        if ($scope.tanqueFirst == null || $scope.tanqueFirst == undefined) {
            toastr.error("Debe seleccionar un tanque");
            return;
        }
        if ($scope.tanqueFirst.capacidad < $scope.viaje.litros && ($scope.tanqueSecond == null || $scope.tanqueSecond == undefined)) {
            toastr.error("El segundo tanque es requerido");
            return;
        }

        var form = {
            viajeId: $scope.viaje.id,
            viajeOperador: {
                empleado: {
                    id: $scope.currentOperador.id,
                }
            },
            viajeUnidad: [{
                flota: {
                    id: candidato.flota.id,
                }
            }],
            razon: $scope.razon,
            maximo: $scope.max,
            seleccionado: candidato.totalp,
            unidad: candidato.flota.economico,
            optimo: $scope.optimo,
        };
        form.viajeUnidad.push({
            flota: {
                id: $scope.tanqueFirst.id,
            }
        });
        if ($scope.tanqueFirst.capacidad < $scope.viaje.litros) {
            form.viajeUnidad.push({
                flota: {
                    id: $scope.tanqueSecond.id,
                }
            });
        }
        giaFactory.postAtencionViaje(form).then(function(response) {
            if (response.data.viajeId > 0) {
                $('#modalFinish').modal('show');
            } else {
                toastr.error("Ocurrio un error al atender el viaje. Por favor contacte al administrador del sistema")
            }
        })
    };

    init();
}]);