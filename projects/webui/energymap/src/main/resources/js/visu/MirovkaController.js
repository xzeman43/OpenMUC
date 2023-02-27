(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var MirovkaController = function($scope, $interval, ChannelsService) {
        let svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('mirovka').contentDocument;

            let mainSwitchBtn = document.getElementById("onoff");
            let tatbSwitchBtn = document.getElementById("tatb");

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
                        if (channel.id === "SPI"){
                            textChargingStation = document.getElementById("SPI");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "";
                            }

                            mainSwitchOn = svg_document.getElementById("T1_SPI_ON");
                            mainSwitchOff = svg_document.getElementById("T1_SPI_OFF");



                            if((mainSwitchOn != null) && (mainSwitchOff != null) && mainSwitchBtn != null) {
                                if (channel.record.value === 0) {
                                    mainSwitchOn.setAttribute("class", "st-orange");
                                    mainSwitchOff.setAttribute("class", "st-grey");
                                    mainSwitchBtn.checked = false;
                                }
                                if (channel.record.value === 1) {
                                    mainSwitchOn.setAttribute("class", "st-grey");
                                    mainSwitchOff.setAttribute("class", "st-orange");
                                    mainSwitchBtn.checked = false;
                                }
                            }
                        }
                        if (channel.id === "DPI"){
                            textChargingStation = document.getElementById("DPI");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "";
                            }

                            dpiBranchA = svg_document.getElementById("T1_DPI_A");
                            dpiBranchB = svg_document.getElementById("T1_DPI_B");
                            if((dpiBranchA != null) && (dpiBranchB != null) && (tatbSwitchBtn != null)) {
                                if (channel.record.value === 1) {
                                    dpiBranchA.setAttribute("class", "st-grey");
                                    dpiBranchB.setAttribute("class", "st-orange");
                                    tatbSwitchBtn.checked = true;
                                }
                                if (channel.record.value === 2) {
                                    dpiBranchA.setAttribute("class", "st-orange");
                                    dpiBranchB.setAttribute("class", "st-grey");
                                    tatbSwitchBtn.checked = false;
                                }
                            }
                        }
                        if (channel.id === "SFP"){
                            textChargingStation = document.getElementById("SFP");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " kV";
                            }
                            textChargingStation = svg_document.getElementById("T1_SFP");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " kV";
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

    MirovkaController.$inject = injectParams;

    angular.module('openmuc.energymap-visu').controller('MirovkaController', MirovkaController);

})();
