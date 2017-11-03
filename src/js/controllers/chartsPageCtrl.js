angular.module('starter').controller('ChartsPageCtrl', ["$scope", "$q", "$state", "$timeout", "$rootScope", "$ionicLoading", "$ionicActionSheet", "$stateParams", "qmService", "qmLogService", "clipboard", function($scope, $q, $state, $timeout, $rootScope, $ionicLoading,  $ionicActionSheet, $stateParams, qmService, qmLogService, clipboard) {
    $scope.controller_name = "ChartsPageCtrl";
    $rootScope.showFilterBarSearchIcon = false;
    $scope.state = {title: "Charts"};
    function getVariableName() {
        if($stateParams.variableName){
            $scope.variableName = $stateParams.variableName;
            return $stateParams.variableName;
        }
        if($scope.variableName){return $scope.variableName;}
        $scope.variableName = qmService.getVariableNameFromStateParamsRootScopeOrUrl($stateParams, $scope);
        if($scope.variableName){return $scope.variableName;}
        $scope.goBack();
    }
    function getScopedVariableObject() {
        if($rootScope.variableObject && $rootScope.variableObject.name === getVariableName()){return $rootScope.variableObject;}
        if($stateParams.variableObject){$rootScope.variableObject = $stateParams.variableObject;}
        return $rootScope.variableObject;
    }
    function initializeCharts() {
        if(!getScopedVariableObject() || !getScopedVariableObject().charts){
            qmService.showBlackRingLoader();
            getCharts();
        } else {
            qmService.hideLoader();
        }
    }
    function getCharts(refresh) {
        qmService.getUserVariableByNameFromLocalStorageOrApiDeferred(getVariableName(), {includeCharts: true}, refresh)
            .then(function (variableObject) {
                $rootScope.variableObject = variableObject;
                $rootScope.showActionSheetMenu = qmService.getVariableObjectActionSheet(getVariableName());
                qmService.hideLoader();
                $scope.$broadcast('scroll.refreshComplete');
            });
    }
    $scope.refreshCharts = function () {getCharts(true);};
    $scope.$on('$ionicView.enter', function(e) { qmLogService.debug(null, 'Entering state ' + $state.current.name);
        $rootScope.hideNavigationMenu = false;
        $rootScope.variableName = getVariableName();
        $scope.state.title = qmService.getTruncatedVariableName(getVariableName());
        $rootScope.showActionSheetMenu = qmService.getVariableObjectActionSheet(null, getVariableName());
        initializeCharts();
        if (!clipboard.supported) {
            console.log('Sorry, copy to clipboard is not supported');
            $scope.hideClipboardButton = true;
        }
    });
    $scope.addNewReminderButtonClick = function() {
        qmLogService.debug(null, 'addNewReminderButtonClick', null);
        qmService.goToState('app.reminderAdd', {variableObject: $rootScope.variableObject, fromState: $state.current.name});
    };
    $scope.recordMeasurementButtonClick = function() {qmService.goToState('app.measurementAdd',
        {variableObject: $rootScope.variableObject, fromState: $state.current.name});};
    $scope.editSettingsButtonClick = function() {qmService.goToState('app.variableSettings',
        {variableObject: $rootScope.variableObject, variableName: $rootScope.variableObject.name});};
    $scope.shareCharts = function(variableObject, sharingUrl, ev){
        if(!variableObject.shareUserMeasurements){
            qmService.showShareVariableConfirmation(variableObject, sharingUrl, ev);
        } else {
            qmService.openSharingUrl(sharingUrl);
        }
    };
}]);
