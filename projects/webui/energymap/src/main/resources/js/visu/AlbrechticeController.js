(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var AlbrechticeController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('albrechtice').contentDocument;

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
                        if (channel.id === "ALB_101_T401_Ua_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ua_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " V";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Ub_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ub_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " V";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Uc_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Uc_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " V";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Ia_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ia_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Ib_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ib_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Ic_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ic_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Pa_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Pa_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Pb_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Pb_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Qa_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Qa_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " VAR";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Qb_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Qb_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " VAR";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Qc_in"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Qc_in");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " VAR";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Ua_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ua_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " V";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Ub_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ub_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " V";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Uc_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Uc_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " V";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Ia_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ia_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Ib_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ib_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Ic_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Ic_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Pa_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Pa_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " W";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Pb_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Pb_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " W";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Pc_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Pc_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " W";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Qa_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Qa_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " VAR";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Qb_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Qb_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " VAR";
                            }
                        }
                        if (channel.id === "ALB_101_T401_Qc_out"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_Qc_out");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + " VAR";
                            }
                        }
                        if (channel.id === "ALB_101_T401_HT"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_HT");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_LT"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_LT");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_OT"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_OT");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_TT"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_TT");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_f"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_f");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_HJ"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_HJ");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_OD"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_OD");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_PR"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_PR");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_PO"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_PO");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_ZK"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_ZK");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = Math.trunc(channel.record.value) + "A";
                            }
                        }
                        if (channel.id === "ALB_101_T401_ZHJ"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_ZHJ");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = (channel.record.value);
                            }
                        }
                        if (channel.id === "ALB_101_T401_ZOD"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_ZOD");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = (channel.record.value);
                            }
                        }
                        if (channel.id === "ALB_101_T401_ZOR"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_ZOR");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = (channel.record.value);
                            }
                        }
                        if (channel.id === "ALB_101_T401_SPA"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_SPA");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = (channel.record.value);
                            }
                        }
                        if (channel.id === "ALB_101_T401_CPP"){
                            textChargingStation = svg_document.getElementById("ALB_101_T401_CPP");
                            if (textChargingStation != null) {
                                textChargingStation.textContent = (channel.record.value);
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

    AlbrechticeController.$inject = injectParams;

    angular.module('openmuc.energymap-visu').controller('AlbrechticeController', AlbrechticeController);

})();
