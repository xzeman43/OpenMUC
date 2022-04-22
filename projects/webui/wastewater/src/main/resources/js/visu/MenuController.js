(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var MenuController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('wastewaterMenu').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            //document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            back = svg_document.getElementById("back");
            back.addEventListener("click", function(e){
                window.location = "#!/wastewater/index";
                console.log(e)});

            blowers = svg_document.getElementById("blowers");
            blowers.addEventListener("click", function(e){
                window.location = "#!/wastewater/blowers";
                console.log(e)});

            pumps = svg_document.getElementById("pumps");
            pumps.addEventListener("click", function(e){
                window.location = "#!/wastewater/pumps";
                console.log(e)});

            reservoirs = svg_document.getElementById("reservoirs");
            reservoirs.addEventListener("click", function(e){
                window.location = "#!/wastewater/reservoirs";
                console.log(e)});

            drains = svg_document.getElementById("drains");
            drains.addEventListener("click", function(e){
                window.location = "#!/wastewater/drains";
                console.log(e)});

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

    MenuController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('MenuController', MenuController);

})();
