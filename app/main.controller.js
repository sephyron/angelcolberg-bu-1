/**
 * Main application controller
 */
(function() {
    angular
        .module('portfolio-app')
        .controller('MainController', MainController);

    MainController.$inject = ['$rootScope', '$routeParams'];

    function MainController($rootScope, $routeParams) {
        $rootScope.cssClass = 'view1';
        $rootScope.path = '/' + ($routeParams.dir || '');
        $rootScope.anno = new Date().getFullYear();

        initializeWaves();
    }

    function initializeWaves() {
        var wavesElement = document.getElementById('waves');

        if (!wavesElement || typeof SineWaves === 'undefined') {
            return;
        }

        var colors = [
            [62, 35, 255],
            [60, 255, 60],
            [255, 35, 98],
            [45, 175, 230],
            [255, 0, 255],
            [255, 128, 0]
        ];
        var step = 0;
        var colorIndices = [0, 1, 2, 3];
        var gradientSpeed = 0.002;

        new SineWaves({
            el: wavesElement,
            speed: 4,
            width: function() {
                return window.innerWidth;
            },
            height: function() {
                return window.innerHeight;
            },
            ease: 'SineInOut',
            wavesWidth: '70%',
            waves: [
                { timeModifier: 4, lineWidth: 1, amplitude: -25, wavelength: 25 },
                { timeModifier: 2, lineWidth: 2, amplitude: -50, wavelength: 50 },
                { timeModifier: 1, lineWidth: 1, amplitude: -100, wavelength: 100 },
                { timeModifier: 0.5, lineWidth: 1, amplitude: -200, wavelength: 200 },
                { timeModifier: 0.25, lineWidth: 2, amplitude: -400, wavelength: 400 }
            ],
            resizeEvent: function() {
                var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
                gradient.addColorStop(0, 'rgba(23, 210, 168, 0.2)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
                gradient.addColorStop(1, 'rgba(23, 210, 168, 0.2)');

                this.waves.forEach(function(wave) {
                    wave.strokeStyle = gradient;
                });
            }
        });

        function updateGradient() {
            if (!document.body.contains(wavesElement)) {
                return;
            }

            var currentLeft = colors[colorIndices[0]];
            var nextLeft = colors[colorIndices[1]];
            var currentRight = colors[colorIndices[2]];
            var nextRight = colors[colorIndices[3]];
            var inverseStep = 1 - step;
            var color1 = 'rgb(' + interpolateColor(currentLeft, nextLeft, inverseStep) + ')';
            var color2 = 'rgb(' + interpolateColor(currentRight, nextRight, inverseStep) + ')';

            wavesElement.style.background = 'linear-gradient(90deg, ' + color1 + ', ' + color2 + ')';

            step += gradientSpeed;
            if (step >= 1) {
                step %= 1;
                colorIndices[0] = colorIndices[1];
                colorIndices[2] = colorIndices[3];
                colorIndices[1] = nextColorIndex(colorIndices[1], colors.length);
                colorIndices[3] = nextColorIndex(colorIndices[3], colors.length);
            }

            window.setTimeout(updateGradient, 10);
        }

        function interpolateColor(from, to, amount) {
            return [0, 1, 2].map(function(index) {
                return Math.round(amount * from[index] + (1 - amount) * to[index]);
            }).join(',');
        }

        function nextColorIndex(current, length) {
            return (current + Math.floor(1 + Math.random() * (length - 1))) % length;
        }

        updateGradient();
    }
})();
