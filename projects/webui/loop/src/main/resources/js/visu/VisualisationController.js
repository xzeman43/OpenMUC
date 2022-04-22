(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var VisualisationController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('loopGraphic').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            //document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            // item = svg_document.getElementById("shape1809-1279");
            // item.addEventListener("click", function(e){
            //     window.location = "#!/loop/omg";
            //     console.log(e)});
            // item1 = svg_document.getElementById("sokolnice");
            // item1.addEventListener("click", function(e){
            //     window.location = "#!/loop/sokolnice";
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
                        if (channel.id === "arm1_x"){
                            textPosArm1 = svg_document.getElementById("arm1_x");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm1_y"){
                            textPosArm1 = svg_document.getElementById("arm1_y");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm1_z"){
                            textPosArm1 = svg_document.getElementById("arm1_z");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm1_r"){
                            textPosArm1 = svg_document.getElementById("arm1_r");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm1_l"){
                            textPosArm1 = svg_document.getElementById("arm1_l");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                            objPosArm1 = svg_document.getElementById("arm1_rail_anim");
                            moveArmFigAnim(objPosArm1, calculateReal(channel.record.value))
                        }
                        if (channel.id === "arm1_state"){
                            objColorArm1 = svg_document.getElementById("arm1_state");
                            objColorArm1.setAttribute("fill", selectRightStateColor(channel.record.value));
                        }
                        if (channel.id === "arm1_suction"){
                            objColorArm1 = svg_document.getElementById("arm1_suction");
                            objColorArm1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "arm1_secure"){
                            objColorArm1 = svg_document.getElementById("arm1_secure");
                            objColorArm1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "arm1_rail_state"){
                            objColorArm1 = svg_document.getElementById("arm1_rail_state");
                            objColorArm1.setAttribute("fill", selectRightStateColor(channel.record.value));
                        }
                        if (channel.id === "arm2_x"){
                            textPosArm1 = svg_document.getElementById("arm2_x");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm2_y"){
                            textPosArm1 = svg_document.getElementById("arm2_y");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm2_z"){
                            textPosArm1 = svg_document.getElementById("arm2_z");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm2_r"){
                            textPosArm1 = svg_document.getElementById("arm2_r");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm2_state"){
                            objColorArm1 = svg_document.getElementById("arm2_state");
                            objColorArm1.setAttribute("fill", selectRightStateColor(channel.record.value));
                        }
                        if (channel.id === "arm2_suction"){
                            objColorArm1 = svg_document.getElementById("arm2_suction");
                            objColorArm1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "arm2_secure"){
                            objColorArm1 = svg_document.getElementById("arm2_secure");
                            objColorArm1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "arm3_x"){
                            textPosArm1 = svg_document.getElementById("arm3_x");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm3_y"){
                            textPosArm1 = svg_document.getElementById("arm3_y");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm3_z"){
                            textPosArm1 = svg_document.getElementById("arm3_z");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm3_r"){
                            textPosArm1 = svg_document.getElementById("arm3_r");
                            textPosArm1.textContent = calculateReal(channel.record.value);
                        }
                        if (channel.id === "arm3_state"){
                            objColorArm1 = svg_document.getElementById("arm3_state");
                            objColorArm1.setAttribute("fill", selectRightStateColor(channel.record.value));
                        }
                        if (channel.id === "arm3_suction"){
                            objColorArm1 = svg_document.getElementById("arm3_suction");
                            objColorArm1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "arm3_secure"){
                            objColorArm1 = svg_document.getElementById("arm3_secure");
                            objColorArm1.setAttribute("fill", selectRightColor(channel.record.value));
                        }
                        if (channel.id === "arm3_conveyor"){
                            objColorArm1 = svg_document.getElementById("arm3_conveyor");
                            objColorArm1.setAttribute("fill", selectRightStateColor(channel.record.value));
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
            return "#c05046"
        }
    }

    function selectRightStateColor(boolean) {
        if (boolean === true){
            return "#c05046"
        }else{
            return "#4cc046"
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
