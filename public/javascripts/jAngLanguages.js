/**
 * Created by jaric on 24.09.2014.
 */

function jAngLanguages(window, $scope, Localization) {
    $scope.Localization = Localization;
    $scope.validLanguages = $scope.Localization.listOfLanguages; // 0 index is default
    function getStorageLanguageValue(){
        // default param
        var param = $scope.Localization.defaultLanguage();
        var localStorage = window.localStorage;
        if (localStorage){
            var alterParam = localStorage.getItem('language');
            if (alterParam) {
                param = alterParam;
                console.log('we have value in localStorage:', param, ', it will be set now');
            }
        } else {
            console.error('no localStorage');
        }
        return param;
    }
    function setStorageLanguageValue(param){
        console.log('setting language storage value to', param);
        var localStorage = window.localStorage;
        if (localStorage) {
            localStorage.setItem('language', param);
        } else {
            console.error('no localStorage');
        }
    }
    $scope.getStorageLanguage = function(){
        var param = getStorageLanguageValue();
        $scope.storageLanguage = param;
        return param;
    };
    $scope.setStorageLanguage = function(param){
        if ($scope.validLanguages.indexOf(param) == -1) {
            console.warn('invalid language:', param, 'changing language to default value');
            param = $scope.Localization.defaultLanguage();
        }
        $scope.localization = $scope.Localization[param];
        $scope.language = param;
        setStorageLanguageValue(param);
    };
    // default value sets by $watch
    $scope.$watch($scope.getStorageLanguage, function(newValue, oldValue){
        console.log('language changed to', newValue, 'from', oldValue);
        $scope.setStorageLanguage(newValue);
    },false);
}