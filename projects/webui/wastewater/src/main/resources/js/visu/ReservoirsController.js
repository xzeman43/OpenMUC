(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var ReservoirsController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('wastewaterReservoirs').contentDocument;

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
                        if (channel.id === "HMI_Kruh_Indikace"){
                            circle = svg_document.getElementById("HMI_Kruh_Indikace");
                            circle.setAttribute("fill", selectRightColorMax(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpaci_Min"){
                            blow1= svg_document.getElementById("HMI_Ctverec_Cerpaci_Min");
                            blow1.setAttribute("fill", selectRightColorMin(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Cerpaci_Max"){
                            blow2 = svg_document.getElementById("HMI_Ctverec_Cerpaci_Max");
                            blow2.setAttribute("fill", selectRightColorMax(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_SBR_1_Min"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_SBR_1_Min");
                            blow3.setAttribute("fill", selectRightColorMin(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_SBR_1_Max"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_SBR_1_Max");
                            blow3.setAttribute("fill", selectRightColorMax(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_SBR_2_Min"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_SBR_2_Min");
                            blow3.setAttribute("fill", selectRightColorMin(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_SBR_2_Max"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_SBR_2_Max");
                            blow3.setAttribute("fill", selectRightColorMax(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Kal_Min"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Kal_Min");
                            blow3.setAttribute("fill", selectRightColorMin(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Kal_Max"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Kal_Max");
                            blow3.setAttribute("fill", selectRightColorMax(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Dest_Min"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Dest_Min");
                            blow3.setAttribute("fill", selectRightColorMin(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Dest_Max"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Dest_Max");
                            blow3.setAttribute("fill", selectRightColorMax(channel.record.value));
                        }
                    });
                }
            }, 500);
        };

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.interval);
        });

    };

    function selectRightColorMin(boolean) {
        if (boolean === false){
            return "#4cc046"
        }else{
            return "#FF0000"
        }
    }

    function selectRightColorMax(boolean) {
        if (boolean === true){
            return "#4cc046"
        }else{
            return "#FF0000"
        }
    }

    ReservoirsController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('ReservoirsController', ReservoirsController);

})();
