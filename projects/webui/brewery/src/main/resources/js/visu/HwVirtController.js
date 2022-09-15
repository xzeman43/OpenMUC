(function(){

    var injectParams = ['$scope', '$interval', 'ChannelsService'];

    var HwVirtController = function($scope, $interval, ChannelsService) {
        var svg_document;

        display_visualisation = function() {

            svg_document = document.getElementById('breweryHwVirt').contentDocument;

            //TODO addwtf
            //svg_document.parentElement.innerHTML;
            //const omg = svg_document.parentElement;
            //document.querySelector(".ng-scope").addEventListener("click", function(e){console.log(e)});
            hw = svg_document.getElementById("hw");
            hw.addEventListener("click", function(e){
                window.location = "#!/brewery/hwmenu";
                console.log(e)});

            virt = svg_document.getElementById("virt");
            virt.addEventListener("click", function(e){
                window.location = "#!/brewery/virt";
                console.log(e)});
        };
    }
    HwVirtController.$inject = injectParams;

    angular.module('openmuc.openmuc-visu').controller('HwVirtController', HwVirtController);

})();
