(function(){

    var app = angular.module('openmuc');

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.
            state('brewery', {
                url: '/brewery',
                templateUrl: 'brewery/html/index.html',
                requireLogin: true
            }).
            state('brewery.index', {
                url: '/index',
                templateUrl: 'brewery/html/hwvirt.html',
                controller: 'HwVirtController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.brewery',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'brewery/css/brewery/main.css',
                                    'brewery/js/visu/HwVirtController.js']
                            }
                        )
                    }
                }
            }).
            state('brewery.virt', {
                url: '/virt',
                templateUrl: 'brewery/html/graphic_virt.html',
                controller: 'VirtVisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.brewery',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'brewery/css/brewery/main.css',
                                    'brewery/js/visu/VirtVisualisationController.js']
                            }
                        )
                    }
                }
              }).
            state('brewery.hwmenu', {
                url: '/hwmenu',
                templateUrl: 'brewery/html/graphic_hw_menu.html',
                controller: 'HwMenuVisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.brewery',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'brewery/css/brewery/main.css',
                                    'brewery/js/visu/HwMenuVisualisationController.js']
                            }
                        )
                    }
                }
            }).
            state('brewery.hw', {
                url: '/hw',
                templateUrl: 'brewery/html/graphic_hw.html',
                controller: 'HwVisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.brewery',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'brewery/css/brewery/main.css',
                                    'brewery/js/visu/HwVisualisationController.js']
                            }
                        )
                    }
                }
            })
        }]);
})();