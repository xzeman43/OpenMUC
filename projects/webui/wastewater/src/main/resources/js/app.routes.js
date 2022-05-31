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
            state('wastewater.blowers', {
                url: '/blowers',
                templateUrl: 'wastewater/html/wastewater_blowers.html',
                controller: 'BlowersController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.wastewater',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'wastewater/css/wastewater/main.css',
                                    'wastewater/js/visu/BlowersController.js']
                            }
                        )
                    }
                }
            }).state('wastewater.pumps', {
                url: '/pumps',
                templateUrl: 'wastewater/html/wastewater_pumps.html',
                controller: 'PumpsController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.wastewater',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'wastewater/css/wastewater/main.css',
                                    'wastewater/js/visu/PumpsController.js']
                            }
                        )
                    }
                }
            }).state('wastewater.reservoirs', {
                url: '/reservoirs',
                templateUrl: 'wastewater/html/wastewater_reservoirs.html',
                controller: 'ReservoirsController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.wastewater',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'wastewater/css/wastewater/main.css',
                                    'wastewater/js/visu/ReservoirsController.js']
                            }
                        )
                    }
                }
            }).state('wastewater.drain', {
                url: '/drain',
                templateUrl: 'wastewater/html/wastewater_drain.html',
                controller: 'DrainController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.wastewater',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'wastewater/css/wastewater/main.css',
                                    'wastewater/js/visu/DrainController.js']
                            }
                        )
                    }
                }
            })
        }]);

})();