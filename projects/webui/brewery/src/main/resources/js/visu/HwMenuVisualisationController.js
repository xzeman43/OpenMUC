(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var HwMenuVisualisationController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('breweryGraphicMenu').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            //document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            start = svg_document.getElementById("start");
            start.addEventListener("click", function (e) {
                // ChannelsService.getChannel("HMI_Tlac_Start_SBR_1").then(async function(channel){
                //     var can = await channel.configs;
                //     if(can !== undefined){
                //         var channell = {
                //             id: can.id,
                //             type: can.valueType,
                //             newValue: "true"
                //         };
                //         ChannelsService.writeChannel(channell, true);
                //     }
                // });
            });

            stop = svg_document.getElementById("stop");
            stop.addEventListener("click", function (e) {
                // ChannelsService.getChannel("HMI_Tlac_Start_SBR_1").then(async function(channel){
                //     var can = await channel.configs;
                //     if(can !== undefined){
                //         var channell = {
                //             id: can.id,
                //             type: can.valueType,
                //             newValue: "true"
                //         };
                //         ChannelsService.writeChannel(channell, true);
                //     }
                // });
            });

            mainMenu = svg_document.getElementById("main_menu");
            mainMenu.addEventListener("click", function(e){
                window.location = "#!/brewery/hw";
                console.log(e)});
        };
    }
    HwMenuVisualisationController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('HwMenuVisualisationController', HwMenuVisualisationController);

})();