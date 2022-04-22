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
                templateUrl: 'brewery/html/graphic.html',
                controller: 'VisualisationController',
                requireLogin: true,
                resolve: {
                    openmuc: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            {
                                name: 'openmuc.brewery',
                                files: ['openmuc/js/channels/channelsService.js',
                                    'openmuc/js/channels/channelDataService.js',
                                    'brewery/css/brewery/main.css',
                                    'brewery/js/visu/VisualisationController.js']
                            }
                        )
                    }
                }
            })
        }]);
})();