(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var VisualisationController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('breweryGraphic').contentDocument;



            $scope.interval = "";
            $interval.cancel($scope.interval);
            $scope.interval = $interval(function(){
                ChannelsService.getAllChannels().then(async function(channels) {
                    $scope.channels = await channels.records;
                });
                var v1 = "OFF";
                var v2 = "OFF";
                var v3 = "OFF";
                var v4 = "OFF";

                if ($scope.channels != undefined){
                    $scope.channels.forEach(function(channel){
                        // if (channel.id === "power_heatpump"){
                        //     textHeatPump = svg_document.getElementById("textHeatPump");
                        //     textHeatPump.textContent = channel.record.value + " kW";
                        // }
                        if (channel.id === "l"){
                            text = svg_document.getElementById("l");
                            if (channel.record.value === true){l
                                text.textContent = "ON";
                            }else{
                                text.textContent = "OFF";
                            }
                        }
                        if (channel.id === "hop"){
                            text = svg_document.getElementById("hop");
                            if (channel.record.value === true){
                                text.textContent = "ON";
                            }else{
                                text.textContent = "OFF";
                            }
                        }
                        if (channel.id === "c1"){
                            c1 = svg_document.getElementById("c1");
                            if (channel.record.value === true){
                                c1.textContent = "ON";
                            }else{
                                c1.textContent = "OFF";
                            }
                        }
                        if (channel.id === "c2"){
                            text = svg_document.getElementById("c2");
                            if (channel.record.value === true){
                                text.textContent = "ON";
                            }else{
                                text.textContent = "OFF";
                            }
                        }
                        if (channel.id === "c3"){
                            text = svg_document.getElementById("c3");
                            if (channel.record.value === true){
                                text.textContent = "ON";
                            }else{
                                text.textContent = "OFF";
                            }
                        }
                        if (channel.id === "c4"){
                            text = svg_document.getElementById("c4");
                            if (channel.record.value === true){
                                text.textContent = "ON";
                            }else{
                                text.textContent = "OFF";
                            }
                        }
                        if (channel.id === "c5"){
                            text = svg_document.getElementById("c5");
                            if (channel.record.value === true){
                                text.textContent = "ON";
                            }else{
                                text.textContent = "OFF";
                            }
                        }
                        if (channel.id === "c6"){
                            text = svg_document.getElementById("c6");
                            if (channel.record.value === true){
                                text.textContent = "ON";
                            }else{
                                text.textContent = "OFF";
                            }
                        } "valve1_
                        if (channel.id === "h1"){
                            text = svg_document.getElementById("h1");
                            var value = channel.record.value.toString().substring(0,4) + " L";
                            text.textContent = value;
                        }
                        if (channel.id === "h2"){
                            text = svg_document.getElementById("h2");
                            var value = channel.record.value.toString()
                            text.textContent = value.substring(0,4) + " L";
                        }
                        if (channel.id === "valve1_1"){
                            text = svg_document.getElementById("v1_1");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v1 = "1";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        if (channel.id === "valve1_2"){
                            text = svg_document.getElementById("v1_2");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v1="2";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        if (channel.id === "valve1_3"){
                            text = svg_document.getElementById("v1_3");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v1="3";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        valve1 = svg_document.getElementById("v1");
                        valve1.textContent = v1;

                        if (channel.id === "valve2_1"){
                            text = svg_document.getElementById("v2_1");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v2 = "1";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        if (channel.id === "valve2_2"){
                            text = svg_document.getElementById("v2_2");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v2="2";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        if (channel.id === "valve2_3"){
                            text = svg_document.getElementById("v2_3");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v2="3";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        if (channel.id === "valve2_4"){
                            text = svg_document.getElementById("v2_4");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v2="3";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        valve2 = svg_document.getElementById("v2");
                        valve2.textContent = v2;

                        if (channel.id === "valve3_1"){
                            text = svg_document.getElementById("v3_1");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v3 = "1";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        if (channel.id === "valve3_2"){
                            text = svg_document.getElementById("v3_2");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v3="2";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        if (channel.id === "valve3_3"){
                            text = svg_document.getElementById("v3_3");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v3="3";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        valve3 = svg_document.getElementById("v3");
                        valve3.textContent = v3;

                        if (channel.id === "valve4_1"){
                            text = svg_document.getElementById("v4_1");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v4 = "1";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        if (channel.id === "valve4_2"){
                            text = svg_document.getElementById("v4_2");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v4="2";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        if (channel.id === "valve4_3"){
                            text = svg_document.getElementById("v4_3");
                            if (channel.record.value === true){
                                text.classList.remove("st44");
                                text.classList.add("st46");
                                v4="3";
                            }else{
                                text.classList.remove("st46");
                                text.classList.add("st44");
                            }
                        }
                        valve4 = svg_document.getElementById("v4");
                        valve4.textContent = v4;
                    });
                }
            }, 500);
        };

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.interval);
        });

    };

    VisualisationController.$inject = injectParams;

    angular.module('openmuc.brewery-visu').controller('VisualisationController', VisualisationController);

})();
