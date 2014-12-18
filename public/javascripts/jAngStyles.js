/**
 * Created by jaric on 24.09.2014.
 */

function jAngStlyes(window, $scope){
    $scope.validStyles = ['style', 'BlackWhite', 'materialDsgn']; // 0 index is default
//    $scope.validStyles = [
//        {
//            name: 'style',
//            filename: 'style'
//        },
//        {
//            name: 'BlackWhite',
//            filename: 'BlackWhite'
//        },
//        {
//            name: 'materialDsgn',
//            filename: 'materialDsgn'
//        }
//    ];
    function getStorageStyleValue(){
        var param = $scope.validStyles[0];
        var localStorage = window.localStorage;
        if (localStorage){
            var alterParam = localStorage.getItem("style");
            if (alterParam) {
                param = alterParam;
                console.log('we have value in localStorage:', param, ', it will be set now');
            }
        } else {
            console.error('no localStorage');
        }
        return param;
    }
    function setStorageStyleValue(param){
        console.log('setting style storage value to', param);
        var localStorage = window.localStorage;
        if (localStorage) {
            localStorage.setItem('style', param);
        } else {
            console.error('no localStorage');
        }
    }
    $scope.getStorageStyle = function(){
        var param = getStorageStyleValue();
        $scope.storageStyle = param;
        return param;
    };
    $scope.setStorageStyle = function(param){
        if ($scope.validStyles.indexOf(param) == -1) {
            console.warn('invalid style:', param, 'changing style to default value');
            param = $scope.validStyles[0];
        }
        console.log('changing css string to', param);
        $scope.css = '/stylesheets/' + param + '.css';
        setStorageStyleValue(param);
        // safe apply, but everywhere were written tis is bad practice
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
    // default value sets by $watch
    $scope.$watch($scope.getStorageStyle, function(newValue, oldValue){
        console.log('style changed to', newValue, 'from', oldValue);
        $scope.setStorageStyle(newValue);
    },false);
}