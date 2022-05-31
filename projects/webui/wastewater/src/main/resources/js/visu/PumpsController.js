(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var PumpsController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('wastewaterPumps').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            //document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            back = svg_document.getElementById("back");
            back.addEventListener("click", function(e){
                window.location = "#!/wastewater/menu";
                console.log(e)});

            main = svg_document.getElementById("HMI_Tlac_Uvod");
            main.addEventListener("click", function(e){
                window.location = "#!/wastewater/index";
                console.log(e)});

            sbr1btnStart = svg_document.getElementById("HMI_Tlac_Start_SBR_1");
            sbr1btnStart.addEventListener("click", function (e) {
                ChannelsService.getChannel("HMI_Tlac_Start_SBR_1").then(async function(channel){
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

            sbr1btnStop = svg_document.getElementById("HMI_Tlac_Stop_SBR_1");
            sbr1btnStop.addEventListener("click", function (e) {
                ChannelsService.getChannel("HMI_Tlac_Stop_SBR_1").then(async function(channel){
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

            sbr2btnStart = svg_document.getElementById("HMI_Tlac_Start_SBR_2");
            sbr2btnStart.addEventListener("click", function (e) {
                ChannelsService.getChannel("HMI_Tlac_Start_SBR_2").then(async function(channel){
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
            sbr2btnStop = svg_document.getElementById("HMI_Tlac_Stop_SBR_2");
            sbr2btnStop.addEventListener("click", function (e) {
                ChannelsService.getChannel("HMI_Tlac_Stop_SBR_2").then(async function(channel){
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
                        if (channel.id === "HMI_Ctverec_Cerpadlo_1"){
                            blow1= svg_document.getElementById("HMI_Ctverec_Cerpadlo_1");
                            blow1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_2"){
                            blow2 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_2");
                            blow2.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_3"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_3");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_4"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_4");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_5"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_5");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_6"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_6");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_7"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_7");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_8"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_8");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_9"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_9");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpadlo_10"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Cerpadlo_10");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Napousteni"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Napousteni");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Text_Mikrosito_SBR"){
                            cycles = svg_document.getElementById("HMI_Text_Mikrosito_SBR");
                            if (cycles != null) {
                                cycles.textContent = Math.trunc(channel.record.value);
                            }
                        }
                        if (channel.id === "HMI_Text_Kal_SBR"){
                            aerationSbr = svg_document.getElementById("HMI_Text_Kal_SBR");
                            if (aerationSbr != null) {
                                aerationSbr.textContent = Math.trunc(channel.record.value);
                            }
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
    PumpsController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('PumpsController', PumpsController);

})();
