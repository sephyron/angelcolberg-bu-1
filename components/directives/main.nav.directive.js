;
(function() {

    'use strict';

    angular
        .module('portfolio-app')
        .directive('mainNav', tinMainNav);

    function tinMainNav() {



        // Definition of directive
        var directiveDefinitionObject = {
            restrict: 'E',
            templateUrl: 'components/directives/main-nav.html'
        };

        return directiveDefinitionObject;
    }

})();