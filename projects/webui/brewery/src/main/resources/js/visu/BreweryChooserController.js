(function(){

    var injectParams = ['$scope'];

    var BreweryChooserController = function($scope) {

        breweryChooser = function() {
            // visu_document = document.getElementById('hwvirt').contentDocument;
            console.log("?aaaa");
            hw = document.getElementById("hw");
            console.log(hw)
            hw.addEventListener("click", function(e){
                window.location = "#!/brewery/hw";
                console.log(e)});

            virt = document.getElementById("virt");
            virt.addEventListener("click", function(e){
                window.location = "#!/brewery/virt";
                console.log(e)});

        };
    };

    BreweryChooserController.$inject = injectParams;

    angular.module('openmuc.brewery-visu').controller('BreweryChooserController', BreweryChooserController);

})();
