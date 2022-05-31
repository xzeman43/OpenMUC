(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var BlowersController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('wastewaterBlowers').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            //document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            back = svg_document.getElementById("back");
            back.addEventListener("click", function(e){
                window.location = "#!/wastewater/menu";
                console.log(e)});

            main_menu = svg_document.getElementById("HMI_Tlac_Uvod");
            main_menu.addEventListener("click", function(e){
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
                            circle.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Dmychadlo_1"){
                            blow1= svg_document.getElementById("HMI_Ctverec_Dmychadlo_1");
                            blow1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Dmychadlo_2"){
                            blow2 = svg_document.getElementById("HMI_Ctverec_Dmychadlo_2");
                            blow2.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Ctverec_Dmychadlo_3"){
                            blow3 = svg_document.getElementById("HMI_Ctverec_Dmychadlo_3");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "HMI_Text_Cykly"){
                            cycles = svg_document.getElementById("HMI_Text_Cykly");
                            if (cycles != null) {
                                cycles.textContent = Math.trunc(channel.record.value);
                            }
                        }
                        if (channel.id === "HMI_Text_DobaAerace_SBR"){
                            aerationSbr = svg_document.getElementById("HMI_Text_DobaAerace_SBR");
                            if (aerationSbr != null) {
                                aerationSbr.textContent = Math.trunc(channel.record.value);
                            }
                        }
                        if (channel.id === "HMI_Text_DobaSedi_SBR"){
                            sedi = svg_document.getElementById("HMI_Text_DobaSedi_SBR");
                            if (sedi != null) {
                                sedi.textContent = Math.trunc(channel.record.value);
                            }
                        }
                        if (channel.id === "HMI_Text_DobaAerace_Kal"){
                            aerationWaste = svg_document.getElementById("HMI_Text_DobaAerace_Kal");
                            if (aerationWaste != null) {
                                aerationWaste.textContent = Math.trunc(channel.record.value);
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
    BlowersController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('BlowersController', BlowersController);

})();
