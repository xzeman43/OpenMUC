(function(){

    var app = angular.module('openmuc');

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.
            state('loop', {
                url: '/loop',
                templateUrl: 'loop/html/index.html',
                requireLogin: true
            }).
            state('loop.index', {
                url: '/index',
                templateUrl: 'loop/html/loop.html',
                controller: 'VisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.loop',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'loop/css/loop/main.css',
                                    'loop/js/visu/VisualisationController.js']
                            }
                        )
                    }
                }
            }).
            state('loop.sokolnice', {
                url: '/sokolnice',
                templateUrl: 'loop/html/sokolnice.html',
                controller: 'SokolniceController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.loop',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'loop/css/loop/main.css',
                                    'loop/js/visu/SokolniceController.js']
                            }
                        )
                    }
                }
            }).
            state('loop.omg', {
                url: '/omg',
                templateUrl: 'loop/html/kletna_station.html',
                controller: 'VisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.loop',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'loop/css/loop/main.css',
                                    'loop/js/visu/VisualisationController.js']
                            }
                        )
                    }
                }
            })
        }]);

})();