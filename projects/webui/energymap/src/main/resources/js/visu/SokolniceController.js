(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var SokolniceController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('sokolnice').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            //document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            // item = svg_document.getElementById("shape1809-1279");
            // item.addEventListener("click", function(e){
            //     window.location = "#!/simpledemovisualisation/omg";
            //     console.log(e)});
            // item1 = svg_document.getElementById("sokolnice");
            // item1.addEventListener("click", function(e){
            //     window.location = "#!/simpledemovisualisation/sokolnice";
            //     console.log(e)});


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
                        if (channel.id === "Ia"){
                            textChargingStation = svg_document.getElementById("401IaVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "Ib"){
                            textChargingStation = svg_document.getElementById("401IbVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "Ic"){
                            textChargingStation = svg_document.getElementById("401IcVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "Uab"){
                            textChargingStation = svg_document.getElementById("401UabVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "kV";
                            }
                        }
                        if (channel.id === "Ubc"){
                            textChargingStation = svg_document.getElementById("401UbcVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "kV";
                            }
                        }
                        if (channel.id === "Uca") {
                            textChargingStation = svg_document.getElementById("401UcaVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "kV";
                            }
                        }
                        if (channel.id === "Pa"){
                            textChargingStation = svg_document.getElementById("401PaVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "kW";
                            }
                        }
                        if (channel.id === "Pb"){
                            textChargingStation = svg_document.getElementById("401PbVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "kW";
                            }
                        }
                        if (channel.id === "Pc") {
                            textChargingStation = svg_document.getElementById("401PcVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "kW";
                            }
                        }
                        if (channel.id === "Qa"){
                            textChargingStation = svg_document.getElementById("401QaVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "kW";
                            }
                        }
                        if (channel.id === "Qb"){
                            textChargingStation = svg_document.getElementById("401QbVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "kW";
                            }
                        }
                        if (channel.id === "Qc") {
                            textChargingStation = svg_document.getElementById("401QcVstup");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "kW";
                            }
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

    SokolniceController.$inject = injectParams;

    angular.module('openmuc.energymap-visu').controller('SokolniceController', SokolniceController);

})();
