(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var DrainController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('wastewaterDrain').contentDocument;

            back = svg_document.getElementById("back");
            back.addEventListener("click", function(e){
                window.location = "#!/wastewater/menu";
                console.log(e)});

            main = svg_document.getElementById("HMI_Tlac_Uvod");
            main.addEventListener("click", function(e){
                window.location = "#!/wastewater/index";
                console.log(e)});

            btnStartDrain = svg_document.getElementById("HMI_Tlac_Spustit_Cerpani");
            btnStartDrain.addEventListener("click", function (e) {
                ChannelsService.getChannel("HMI_Tlac_Spustit_Cerpani").then(async function(channel){
                    var can = await channel.configs;
                    if(can !== undefined){
                        var channell = {
                            id: can.id,
                            type: can.valueType,
                            newValue: "true"
                        };
                        ChannelsService.writeChannel(channell, true);
                    }
                });
            });

            btnStopDrain = svg_document.getElementById("HMI_Tlac_Zastavit_Cerpani");
            btnStopDrain.addEventListener("click", function (e) {
                ChannelsService.getChannel("HMI_Tlac_Zastavit_Cerpani").then(async function(channel){
                    var can = await channel.configs;
                    if(can !== undefined){
                        var channell = {
                            id: can.id,
                            type: can.valueType,
                            newValue: "false"
                        };
                        ChannelsService.writeChannel(channell, true);
                    }
                });
            });


            $scope.interval = "";
            $interval.cancel($scope.interval);
            $scope.interval = $interval(function(){
                ChannelsService.getAllChannels().then(async function(channels) {
                    $scope.channels = await channels.records;
                });
                if ($scope.channels != undefined){
                    $scope.channels.forEach(function(channel){
                        if (channel.id === "HMI_Kruh_Indikace"){
                            circle = svg_document.getElementById("HMI_Kruh_Indikace");
                            circle.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpaci_Min"){
                            blow1= svg_document.getElementById("HMI_Ctverec_Cerpaci_Min");
                            blow1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_SBR_1_Min"){
                            blow2 = svg_document.getElementById("HMI_Ctverec_SBR_1_Min");
                            blow2.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_SBR_2_Min"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_SBR_2_Min");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Kal_Min"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Kal_Min");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Dest_Min"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Dest_Min");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_10"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_10");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                    });
                }
            }, 500);
        };

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.interval);
        });

    };

    function selectRightColor(boolean) {
        if (boolean === true){
            return "#4cc046"
        }else{
            return "#FF0000"
        }
    }

    DrainController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('DrainController', DrainController);

})();
