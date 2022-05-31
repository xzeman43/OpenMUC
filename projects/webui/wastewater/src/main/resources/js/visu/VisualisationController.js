(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var VisualisationController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('wastewaterGraphic').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            // document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            item = svg_document.getElementById("menu");
            item.addEventListener("click", function(e){
                window.location = "#!/wastewater/menu";
                console.log(e)});
            btnStart = svg_document.getElementById("start");
            btnStart.addEventListener("click", function (e) {
                var configs;
                ChannelsService.getChannelDatas("HMI_Tlac_Start").then(async function(conf){
                    configs = await conf.data.configs;
                    if(configs !== undefined){
                        var channel = {
                            id: configs.id,
                            type: configs.valueType,
                            newValue: "true"
                        };
                        ChannelsService.writeChannel(channel, true);
                    }
                });
            });
            btnStop = svg_document.getElementById("stop");
            btnStop.addEventListener("click", function (e) {
                ChannelsService.getChannel("HMI_Tlac_Stop2").then(async function(channel){
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
                // ChannelsService.getAllChannels().then(async function(channels) {
                //     $scope.channels = await channels.records;
                // });
                ChannelsService.getAllChannels().then((channels) => $scope.channels = channels.records);
                if ($scope.channels !== undefined){
                    $scope.channels.forEach(function(channel){
                        // if (channel.id === "power_heatpump"){
                        //     textHeatPump = svg_document.getElementById("textHeatPump");
                        //     textHeatPump.textContent = channel.record.value + " kW";
                        // }
                        if (channel.id === "HMI_Kruh_Indikace"){
                            objColorArm1 = svg_document.getElementById("HMI_Kruh_Indikace");
                            objColorArm1.setAttribute("fill", selectRightColor(channel.record.value));
                        }

                    });
                }
            }, 500);
        };

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.interval);
        });

    };

    function calculateReal(number) {
        if (number > 10000){
            return (number - 20000)/10
        }else{
            return number/10
        }
    }

    function selectRightColor(boolean) {
        if (boolean === true){
            return "#4cc046"
        }else{
            return "#FF0000"
        }
    }

    function moveArmFig(element, value) {
        objCurrTransform = element.getAttribute("transform");
        const splitted = objCurrTransform.split(/\(|,|\)/);
        let text = "translate(".concat((1000+(value*3)).toString(),",",splitted[2], ")" );
        element.setAttribute("transform",  text);
    }

    function moveArmFigAnim(element, value) {
        // objCurrFrom = element.getAttribute("from");
        objCurrTo = element.getAttribute("to");
        const splitted = objCurrTo.split(/,/);
        if(1000+(value*3) != splitted[0]){
            element.setAttribute("from", objCurrTo);
            let text = "".concat((1000+(value*3)).toString(),",",splitted[1] );
            element.setAttribute("to", text);
            element.beginElement()
        }
    }

    VisualisationController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('VisualisationController', VisualisationController);

})();
