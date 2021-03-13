// Modelo
angular.module('giaApp.controllers').controller('semaforeoController', ['$scope', '$window', '$interval', 'giaFactory', function($scope, $window, $interval, giaFactory) {

    $scope.callWheel = function(id) {
        $scope.location = id;
        $scope.qtlSelected = undefined;
        $('#execQtl').modal('show');
    };

    /*
    $scope.completeQtl=function(string){
        var output=[];
        angular.forEach($scope.qtlList,function(qtl){
            if(qtl.toLowerCase().indexOf(string.toLowerCase())>=0){
                output.push(qtl);
            }
        });
        $scope.filterQtl=output;
    };
    $scope.fillTextboxQtl=function(string){
        $scope.qtlSelected=string;
        $scope.filterQtl=null;
    };
     */

    $scope.sendQtl = function() {
        if (!$scope.sinllanta && ($scope.mm < 0 || $scope.mm > 32)) {
            toastr.error('Milimetros invalidos [0-30]');
            $scope.mm = '';
            return;
        }
        giaFactory.postSemaforeoLlanta({
            semaforeoTicket: {
                id: $scope.ticket.id
            },
            usuario: {
                id: $scope.usuario.id
            },
            sinllanta: $scope.sinllanta,
            //qtl: $scope.qtlSelected,
            qtl: ($scope.sinllanta) ? '' : $scope.qtlSelected.qtl,
            posicion: $scope.location,
            mm: $scope.mm,
            presion: $scope.presion
        }).then(function(response) {
            console.log(response);
            $scope.sinllanta = false;
            $scope.mm = '';
            $scope.presion = '';
            $('#execQtl').modal('hide');
            toastr.success('¡Registro correcto!');
            var position = -1;

            $scope.process.forEach(function(p, index) {
                if (p.posicion === response.data.posicion) {
                    position = index;
                }
            });
            if (position > -1) {
                $scope.process.splice(position, 1);
            }
            console.log('qtl', response.data);
            $scope.process.push(response.data);
        })
    };

    $scope.showClose = function() {
        $('#execClose').modal('show');
    };

    function init() {
        $scope.qtl = qtl;
        $scope.usuario = usuario;
        $scope.ticket = ticket;
        $scope.total = 0;
        if ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.motorizado) {
            $scope.total = 2; // Eje direccional
            $scope.total += ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeTraccion1Llantas*2);
            if ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeTraccion2) {
                $scope.total += ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeTraccion2Llantas*2);
            }
        } else {
            if ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre1) $scope.total += ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre1Llantas*2);
            if ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre2) $scope.total += ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre2Llantas*2);
            if ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre3) $scope.total += ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre3Llantas*2);
            if ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre4) $scope.total += ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre4Llantas*2);
            if ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre5) $scope.total += ($scope.ticket.flota.flotaModelo.flotaMarca.flotaTipoUnidad.ejeArrastre5Llantas*2);
        }
        $scope.process = process;
        $scope.qtlList = [];
        $scope.qtl.forEach(function(p) {
            $scope.qtlList.push(p.qtl);
        });
        console.log('qtl', $scope.qtl);
        console.log('init semaforeo');
    }

    init();
}]);
