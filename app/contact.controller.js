/**
 * Main application controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 *
 */
;
(function() {

    angular
        .module('portfolio-app')
        .controller('ContactController', ContactController);

    ContactController.$inject = ['LocalStorage', 'QueryService', '$rootScope', '$routeParams'];


    function ContactController(LocalStorage, QueryService, $rootScope, $routeParams) {

        // 'controller as' syntax
        var self = this;
        $rootScope.cssClass = 'view3 pt-page-current';
        $rootScope.path = '/' + $routeParams.dir;
        var $ = jQuery.noConflict();
        ////////////  function definitions


        /**
         * Load some data
         * @return {Object} Returned object
         */
        // QueryService.query('GET', 'posts', {}, {})
        //   .then(function(ovocie) {
        //     self.ovocie = ovocie.data;
        //   });
    }


})();