/**
 * Work application controller
 *
 */
;
(function() {

    angular
        .module('portfolio-app')
        .controller('WorkController', WorkController);

    WorkController.$inject = ['LocalStorage', 'QueryService', '$rootScope', '$routeParams'];


    function WorkController(LocalStorage, QueryService, $rootScope, $routeParams) {

        // 'controller as' syntax
        var self = this;
        $rootScope.cssClass = 'view2 pt-page-current';
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