(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var HwVisualisationController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('breweryGraphic').contentDocument;

            // back = svg_document.getElementById("back");
            // back.addEventListener("click", function(e){
            //     window.location = "#!/wastewater/menu";
            //     console.log(e)});


            $scope.interval = "";
            $interval.cancel($scope.interval);
            $scope.interval = $interval(function(){
                ChannelsService.getAllChannels().then(async function(channels) {
                    $scope.channels = await channels.records;
                });
                if ($scope.channels != undefined){
                    $scope.channels.forEach(function(channel){
                        if (channel.id === "KC2"){
                            circle = svg_document.getElementById("KC2");
                            circle.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "KC1"){
                            blow1= svg_document.getElementById("KC1");
                            blow1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH6"){
                            blow2 = svg_document.getElementById("OH6");
                            blow2.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "CR2"){
                            blow3 = svg_document.getElementById("CR2");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "CL1"){
                            blow3 = svg_document.getElementById("CL1");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH8"){
                            blow3 = svg_document.getElementById("OH8");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH2"){
                            blow3 = svg_document.getElementById("OH2");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH1"){
                            blow3 = svg_document.getElementById("OH1");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH7"){
                            blow3 = svg_document.getElementById("OH7");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "VV1"){
                            blow3 = svg_document.getElementById("VV1");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "VV2"){
                            blow3 = svg_document.getElementById("VV2");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "VP2"){
                            blow3 = svg_document.getElementById("VP2");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "VP3"){
                            blow3 = svg_document.getElementById("VP3");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "VP1"){
                            blow3 = svg_document.getElementById("VP1");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "VP7"){
                            blow3 = svg_document.getElementById("VP7");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "VP5"){
                            blow3 = svg_document.getElementById("VP5");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "VP6"){
                            blow3 = svg_document.getElementById("VP6");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "VP4"){
                            blow3 = svg_document.getElementById("VP4");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH4"){
                            blow3 = svg_document.getElementById("OH4");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH9"){
                            blow3 = svg_document.getElementById("OH9");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH5"){
                            blow3 = svg_document.getElementById("OH5");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH10"){
                            blow3 = svg_document.getElementById("OH10");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "ML1"){
                            blow3 = svg_document.getElementById("ML1");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OD1"){
                            blow3 = svg_document.getElementById("OD1");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                            blow4 = svg_document.getElementById("OD2");
                            blow4.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "CR1"){
                            blow3 = svg_document.getElementById("CR1");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "OH3"){
                            blow3 = svg_document.getElementById("OH3");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "PR1"){
                            blow3 = svg_document.getElementById("PR1");
                            blow3.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "TC1"){
                            cycles = svg_document.getElementById("TC1");
                            if (cycles != null) {
                                cycles.textContent = Math.trunc(channel.record.value)/100;
                            }
                        }
                        if (channel.id === "TC2"){
                            cycles = svg_document.getElementById("TC2");
                            if (cycles != null) {
                                cycles.textContent = Math.trunc(channel.record.value)/100;
                            }
                        }
                        if (channel.id === "VS1"){
                            cycles = svg_document.getElementById("VS1");
                            if (cycles != null) {
                                cycles.textContent = Math.trunc(channel.record.value)/100;
                            }
                        }
                        if (channel.id === "VS2"){
                            cycles = svg_document.getElementById("VS2");
                            if (cycles != null) {
                                cycles.textContent = Math.trunc(channel.record.value)/100;
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
    HwVisualisationController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('HwVisualisationController', HwVisualisationController);

})();
