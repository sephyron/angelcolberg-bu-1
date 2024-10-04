;
(function() {

    'use strict';

    angular
        .module('portfolio-app')
        .directive('footerNav', FooterNav);

    function FooterNav() {

        // Definition of directive
        var directiveDefinitionObject = {
            restrict: 'E',
            templateUrl: 'components/directives/footer.html'
        };

        return directiveDefinitionObject;
    }

})();