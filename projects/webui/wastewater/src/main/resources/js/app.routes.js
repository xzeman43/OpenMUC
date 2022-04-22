(function(){

    var app = angular.module('openmuc');

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.
            state('wastewater', {
                url: '/wastewater',
                templateUrl: 'wastewater/html/index.html',
                requireLogin: true
            }).
            state('wastewater.index', {
                url: '/index',
                templateUrl: 'wastewater/html/wastewater_main.html',
                controller: 'VisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.wastewater',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'wastewater/css/wastewater/main.css',
                                    'wastewater/js/visu/VisualisationController.js']
                            }
                        )
                    }
                }
            }).
            state('wastewater.menu', {
                url: '/menu',
                templateUrl: 'wastewater/html/wastewater_menu.html',
                controller: 'MenuController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.wastewater',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'wastewater/css/wastewater/main.css',
                                    'wastewater/js/visu/MenuController.js']
                            }
                        )
                    }
                }
            }).
            state('wastewater.omg', {
                url: '/omg',
                templateUrl: 'wastewater/html/wastewater_menu.html',
                controller: 'VisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.wastewater',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'wastewater/css/wastewater/main.css',
                                    'wastewater/js/visu/VisualisationController.js']
                            }
                        )
                    }
                }
            })
        }]);

})();