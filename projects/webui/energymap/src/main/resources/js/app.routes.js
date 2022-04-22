(function(){

    var app = angular.module('openmuc');

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.
            state('energymap', {
                url: '/energymap',
                templateUrl: 'energymap/html/index.html',
                requireLogin: true
            }).
            state('energymap.index', {
                url: '/index',
                templateUrl: 'energymap/html/graphic.html',
                controller: 'VisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.energymap',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'energymap/css/energymap/main.css',
                                    'energymap/js/visu/VisualisationController.js']
                            }
                        )
                    }
                }
            }).
            state('energymap.sokolnice', {
                url: '/sokolnice',
                templateUrl: 'energymap/html/sokolnice.html',
                controller: 'SokolniceController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.energymap',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'energymap/css/energymap/main.css',
                                    'energymap/js/visu/SokolniceController.js']
                            }
                        )
                    }
                }
            }).
            state('energymap.omg', {
                url: '/omg',
                templateUrl: 'energymap/html/kletna_station.html',
                controller: 'VisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.energymap',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'energymap/css/energymap/main.css',
                                    'energymap/js/visu/VisualisationController.js']
                            }
                        )
                    }
                }
            })
        }]);

})();