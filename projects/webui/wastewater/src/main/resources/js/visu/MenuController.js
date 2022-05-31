(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var MenuController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('wastewaterMenu').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            //document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            back = svg_document.getElementById("back");
            back.addEventListener("click", function(e){
                window.location = "#!/wastewater/index";
                console.log(e)});

            blowers = svg_document.getElementById("blowers");
            blowers.addEventListener("click", function(e){
                window.location = "#!/wastewater/blowers";
                console.log(e)});

            pumps = svg_document.getElementById("pumps");
            pumps.addEventListener("click", function(e){
                window.location = "#!/wastewater/pumps";
                console.log(e)});

            reservoirs = svg_document.getElementById("reservoirs");
            reservoirs.addEventListener("click", function(e){
                window.location = "#!/wastewater/reservoirs";
                console.log(e)});

            drain = svg_document.getElementById("drain");
            drain.addEventListener("click", function(e){
                window.location = "#!/wastewater/drain";
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

    function selectRightColor(boolean) {
        if (boolean === true){
            return "#4cc046"
        }else{
            return "#FF0000"
        }
    }

    MenuController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('MenuController', MenuController);

})();
