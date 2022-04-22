(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var VisualisationController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('energyMapGraphic').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            //document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            item = svg_document.getElementById("shape1809-1279");
            item.addEventListener("click", function(e){
                window.location = "#!/energymap/omg";
                console.log(e)});
            item1 = svg_document.getElementById("sokolnice");
            item1.addEventListener("click", function(e){
                window.location = "#!/energymap/sokolnice";
                console.log(e)});


            $scope.interval = "";
            $interval.cancel($scope.interval);
            $scope.interval = $interval(function(){
                ChannelsService.getAllChannels().then(async function(channels) {
                    $scope.channels = await channels.records;
                });
                if ($scope.channels != undefined){
                    $scope.channels.forEach(function(channel){
                        // if (channel.id === "power_heatpump"){
                        //     textHeatPump = svg_document.getElementById("textHeatPump");
                        //     textHeatPump.textContent = channel.record.value + " kW";
                        // }
                        if (channel.id === "first"){
                            textChargingStation = svg_document.getElementById("textChargingStation");
                            textChargingStation.textContent = channel.record.value;
                        }
                        if (channel.id === "second"){
                            textChargingStation = svg_document.getElementById("textChargingStation");
                            textChargingStation.textContent = channel.record.value;
                        }
                        // if (channel.id === "power_photovoltaics"){
                        //     textPv = svg_document.getElementById("textPv");
                        //     textPv.textContent = channel.record.value + " kW";
                        // }
                        // if (channel.id === "power_grid"){
                        //     textGrid = svg_document.getElementById("textGrid");
                        //     textGrid.textContent = channel.record.value + " kW";
                        // }
                    });
                }
            }, 500);
        };

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.interval);
        });

    };

    VisualisationController.$inject = injectParams;

    angular.module('openmuc.energymap-visu').controller('VisualisationController', VisualisationController);

})();
