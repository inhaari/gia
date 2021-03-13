angular.module('giaApp.service').factory('giaFactory', ['$http', 'GlobalVariables', function($http, GlobalVariables){
    var giaFactory = {};

    giaFactory.postFile = function(url, form) {
        return $http.post(url, form, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    };

    giaFactory.requisicionUltimasVentas = function(id) {
        return $http({
            url: GlobalVariables.requisicionBaseUrl + '/previousproveedor/' + id,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    giaFactory.getRequisicion = function() {
        return $http({
            url: GlobalVariables.requisicionBaseUrl,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    giaFactory.postRequisicion = function(form) {
        return $http({
            url: GlobalVariables.requisicionBaseUrl,
            method: 'POST',
            contentType: 'application/json;charset=UTF-8',
            data: form
        });
    };

    giaFactory.putRequisicion = function(form) {
        return $http({
            url: GlobalVariables.requisicionBaseUrl,
            method: 'PUT',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.postRequisicionDetalle = function(form) {
        return $http({
            url: GlobalVariables.requisiciondetalleBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.putRequisicionDetalle = function(form) {
        return $http({
            url: GlobalVariables.requisiciondetalleBaseUrl,
            method: 'PUT',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.ordencompraValidador = function(estatusId) {
        return $http({
            url: GlobalVariables.ordencompraBaseUrl + '/validadores/' + estatusId,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    giaFactory.ordencompraRegisterValidador = function(estatusId, ordenCompraId) {
        return $http({
            url: GlobalVariables.ordencompraBaseUrl + '/validador/register/' + estatusId + '/' + ordenCompraId,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    giaFactory.ordencompraUnregisterValidador = function(estatusId, ordenCompraId) {
        return $http({
            url: GlobalVariables.ordencompraBaseUrl + '/validador/unregister/' + estatusId + '/' + ordenCompraId,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    giaFactory.getOrdenCompraValidador = function() {
        return $http({
            url: GlobalVariables.ordencompraestatusBaseUrl,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    giaFactory.getOrdenCompraValidadorUsuario = function() {
        return $http({
            url: GlobalVariables.ordencompraestatusBaseUrl + '/usuario',
            method: 'GET',
            contentType: 'application/json'
        });
    };

    giaFactory.addOrdenCompraValidadorUsuario = function(estatusId, userId) {
        return $http({
            url: GlobalVariables.ordencompraestatusBaseUrl + '/add/' + estatusId + '/' + userId,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    giaFactory.deleteOrdenCompraValidadorUsuario = function(userId) {
        return $http({
            url: GlobalVariables.ordencompraestatusBaseUrl + '/delete/' + userId,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    /**
     *
     * Cotizacion
     */
    giaFactory.postCotizacion = function(form) {
        return $http({
            url: GlobalVariables.cotizacionBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.postCotizacionDetalle = function(form) {
        return $http({
            url: GlobalVariables.cotizacionBaseUrl + '/detalle',
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.putCotizacion = function(form) {
        return $http({
            url: GlobalVariables.cotizacionBaseUrl,
            method: 'PUT',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.postCotizacionGestion = function(form) {
        return $http({
            url: GlobalVariables.cotizacionBaseUrl + '/gestion',
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.postCotizacionManage = function(form) {
        return $http({
            url: GlobalVariables.cotizacionBaseUrl + '/manage',
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.getCotizacionToOC = function() {
        return $http({
            url: GlobalVariables.cotizacionBaseUrl + '/oc',
            method: 'GET',
            contentType: 'application/json'
        });
    };

    /**
     * Ordenes de compra
     */

    giaFactory.postOrdenCompra = function(form) {
        return $http({
            url: GlobalVariables.ordencompraBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.postOrdenCompraDetalle = function(form) {
        return $http({
            url: GlobalVariables.ordencompraBaseUrl + '/detalle',
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.putOrdenCompra = function(form) {
        return $http({
            url: GlobalVariables.ordencompraBaseUrl,
            method: 'PUT',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.deleteDetalleOrdenCompra = function(id) {
        return $http({
            url: GlobalVariables.ordencompraBaseUrl + '/deletedetail/' + id,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    giaFactory.deleteDetalleCotizacion = function(id) {
        return $http({
            url: GlobalVariables.cotizacionBaseUrl + '/deletedetail/' + id,
            method: 'GET',
            contentType: 'application/json'
        });
    };

    /**
     * Reporte Preventivo
     */
    giaFactory.postReportePreventivo = function(form) {
        return $http({
            url: GlobalVariables.reportepreventivoBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.getReportePreventivoByFlota = function(id) {
        return $http({
            url: GlobalVariables.reportepreventivoBaseUrl + '/flota/' + id,
            method: 'GET',
            contentType: 'application/json',
        });
    };

    /**
     * Gestion de tarifa
     */
    giaFactory.getGestionParametro = function() {
        return $http({
            url: GlobalVariables.gestiontarifaBaseUrl + '/parametro',
            method: 'GET',
            contentType: 'application/json',
        });
    };

    giaFactory.putGestionParametro = function(form) {
        return $http({
            url: GlobalVariables.gestiontarifaBaseUrl + '/parametro',
            method: 'PUT',
            contentType: 'application/json',
            data: form,
        });
    };

    giaFactory.postGestionBuild = function(form) {
        return $http({
            url: GlobalVariables.gestiontarifaBaseUrl + '/build',
            method: 'POST',
            contentType: 'application/json',
            data: form,
        });
    };

    /**
     * Tickets
     */
    giaFactory.postSemaforeoLlanta = function(form) {
        return $http({
            url: GlobalVariables.semaforeollantaBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form,
        });
    };

    giaFactory.putSemaforeoLlanta = function(form) {
        return $http({
            url: GlobalVariables.semaforeollantaBaseUrl,
            method: 'PUT',
            contentType: 'application/json',
            data: form,
        });
    };

    /**
     * Gestion Inspeccion
     */
    giaFactory.postGestionCorrectivo = function(form) {
        return $http({
            url: GlobalVariables.gestioninspeccionBaseUrl + '/reportecorrectivo',
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.postGestionPreventivo = function(form) {
        return $http({
            url: GlobalVariables.gestioninspeccionBaseUrl + '/reportepreventivo',
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    /**
     * Inventario de almacen
     */
    giaFactory.getAlmacenInventario = function(id) {
        return $http({
            url: GlobalVariables.almaceninventarioBaseUrl + '/' + id,
            method: 'GET',
            contentType: 'application/json',
        });
    };

    /**
     * Control de herramienta
     */
    giaFactory.postControlHerramienta = function(form) {
        return $http({
            url: GlobalVariables.controlherramientaBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    /**
     * Control de herramienta
     */
    giaFactory.putControlHerramienta = function(form) {
        return $http({
            url: GlobalVariables.controlherramientaBaseUrl,
            method: 'PUT',
            contentType: 'application/json',
            data: form
        });
    };

    /**
     * Orden de trabajo
     */
    giaFactory.postOrdenTrabajo = function(form) {
        return $http({
            url: GlobalVariables.ordentrabajoBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.postOrdenSalida = function(form) {
        return $http({
            url: GlobalVariables.ordentrabajoBaseUrl + '/salida',
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.deleteOrdenTrabajoRefaccion = function(id) {
        return $http({
            url: GlobalVariables.ordentrabajoBaseUrl + '/' + id,
            method: 'DELETE',
            contentType: 'application/json',
        });
    };

    giaFactory.postOrdenTrabajoRefaccion = function(id, form) {
        return $http({
            url: GlobalVariables.ordentrabajorefaccionBaseUrl + '/bylist/' + id,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    /**
     * Salida de almacen
     */
    giaFactory.postSalidaOrdenTrabajoRefaccion = function(form) {
        return $http({
            url: GlobalVariables.ordentrabajorefaccionBaseUrl + '/salida',
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    /**
     * Viaje
     */
    giaFactory.postSolicitudViaje = function(form) {
        return $http({
            url: GlobalVariables.solicitudviajeBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    giaFactory.putSolicitudViaje = function(form) {
        return $http({
            url: GlobalVariables.solicitudviajeBaseUrl,
            method: 'PUT',
            contentType: 'application/json',
            data: form
        });
    };

    /**
     * Atencion Viaje
     */
    giaFactory.postAtencionViaje = function(form) {
        return $http({
            url: GlobalVariables.atencionviajeBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    /**
     * Asignacion Gasto viaje
     */
    giaFactory.postViajeGasto = function(form) {
        return $http({
            url: GlobalVariables.asignaciongastoviajeBaseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: form
        });
    };

    /**
     * Dashboard
     */
    giaFactory.getCostoTrailer = function(fecha) {
        return $http({
            url: GlobalVariables.dashboardBaseUrl + '/costotrailer/' + fecha,
            method: 'GET',
            contentType: 'application/json',
        });
    };

    giaFactory.getCostoGestionCombustible = function() {
        return $http({
            url: GlobalVariables.dashboardBaseUrl + '/gestioncombustible',
            method: 'GET',
            contentType: 'application/json',
        });
    };

    giaFactory.getCostoCompras = function() {
        return $http({
            url: GlobalVariables.dashboardBaseUrl + '/compras',
            method: 'GET',
            contentType: 'application/json',
        });
    };

    giaFactory.getCostoOrdenTrabajo = function() {
        return $http({
            url: GlobalVariables.dashboardBaseUrl + '/ordentrabajo',
            method: 'GET',
            contentType: 'application/json',
        });
    };

    giaFactory.getCostoSemaforeo = function() {
        return $http({
            url: GlobalVariables.dashboardBaseUrl + '/semaforeo',
            method: 'GET',
            contentType: 'application/json',
        });
    };
    return giaFactory;
}]);