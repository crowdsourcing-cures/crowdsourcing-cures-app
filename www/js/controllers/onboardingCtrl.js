angular.module('starter')
.controller('OnboardingCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicLoading,
                                  $rootScope, $stateParams, quantimodoService) {

    $scope.$on('$ionicView.beforeEnter', function(e) {
        console.debug("OnboardingCtrl beforeEnter");
        $rootScope.hideNavigationMenu = true;
        if(!$rootScope.user){
            quantimodoService.setLocalStorageItem('afterLoginGoToState', 'app.onboarding');
            $state.go('app.login');
            return;
        }

        quantimodoService.setupOnboardingPages();
        if($rootScope.onboardingPages && $rootScope.user){
            $rootScope.onboardingPages = $rootScope.onboardingPages.filter(function( obj ) {
                return obj.id !== 'loginOnboardingPage';
            });
        }

        $ionicLoading.hide();
    });

    $scope.$on('$ionicView.enter', function(e) { console.debug("Entering state " + $state.current.name);

    });

    $scope.$on('$ionicView.afterEnter', function(){
        console.debug("OnboardingCtrl afterEnter");
        quantimodoService.setupHelpCards();
    });

    $scope.$on('$ionicView.beforeLeave', function(){
        console.debug("OnboardingCtrl beforeLeave");
        //Can't do this here because it makes menu show while searching for reminders
        //$rootScope.hideNavigationMenu = false; console.debug('$rootScope.hideNavigationMenu = false');
    });

    $scope.$on('$ionicView.leave', function(){

    });

    $scope.$on('$ionicView.afterLeave', function(){

    });

    var removeImportPage = function () {
        quantimodoService.setLocalStorageItem('afterLoginGoTo', window.location.href);
        var onboardingPages = $rootScope.onboardingPages.filter(function( obj ) {
            return obj.id.indexOf('import') === -1;
        });
        quantimodoService.setLocalStorageItem('onboardingPages', JSON.stringify(onboardingPages));
    };

    $rootScope.onboardingGoToImportPage = function () {
        $rootScope.hideHomeButton = true;
        $rootScope.hideMenuButton = true;
        removeImportPage();
        $rootScope.onboardingPages[0].nextPageButtonText = "Done connecting data sources";
        $state.go('app.import');
    };

    $rootScope.skipOnboarding = function () {
        $rootScope.hideMenuButton = false;
        $state.go(config.appSettings.defaultState);
    };

    $rootScope.showMoreOnboardingInfo = function () {
        $scope.onHelpButtonPress($rootScope.onboardingPages[0].title, $rootScope.onboardingPages[0].moreInfo);
    };

    $rootScope.goToReminderSearchCategoryFromOnboarding = function() {
        $rootScope.hideHomeButton = true;
        $rootScope.hideMenuButton = true;
        if(!$rootScope.user){
            $rootScope.onboardingPages = null;
            quantimodoService.deleteItemFromLocalStorage('onboardingPages');
            $state.go('app.onboarding');
            return;
        }

        $scope.goToReminderSearchCategory($rootScope.onboardingPages[0].variableCategoryName);
    };

    $rootScope.enableLocationTracking = function () {
        $rootScope.trackLocationChange(true, true);
        $rootScope.hideOnboardingPage();
    };

    $rootScope.doneOnboarding = function () {
        $rootScope.hideMenuButton = false;
        $rootScope.defaultHelpCards = null;
        var getStartedHelpCard = {
            id: "getStartedHelpCard",
                ngIfLogic: "stateParams.showHelpCards === true && !hideGetStartedHelpCard",
            title: 'Reminder Inbox',
            "backgroundColor": "#f09402",
            circleColor: "#fab952",
            iconClass: "icon positive ion-archive",
            image: {
                url: "img/variable_categories/vegetarian_food-96.png",
                    height: "96",
                    width: "96"
            },
            bodyText: "Scroll through the Inbox and press the appropriate button on each reminder notification. " +
                "Each one only takes a few seconds. You'll be " +
                "shocked at how much valuable data you can collect with just a few minutes in the Reminder Inbox each day!",
                buttons: [
                    {
                        id: "hideRecordMeasurementInfoCardButton",
                        clickFunctionCall: function(card){ $rootScope.hideHelpCard(card);},
                        buttonText: 'Got it!',
                        buttonIconClass: "ion-checkmark",
                        buttonClass: "button button-clear button-balanced"
                    }
                ]
        };

        $rootScope.defaultHelpCards = [getStartedHelpCard].concat($rootScope.defaultHelpCards);
        quantimodoService.deleteItemFromLocalStorage('onboardingPages');
        $rootScope.onboardingPages = null;
        if(!$rootScope.user.stripePlan){
            $state.go('app.upgrade');
        } else {
            $state.go('app.remindersInbox');
        }
    };

    $rootScope.hideOnboardingPage = function () {

        $rootScope.onboardingPages = $rootScope.onboardingPages.filter(function( obj ) {
            return obj.id !== $rootScope.onboardingPages[0].id;
        });

        quantimodoService.setLocalStorageItem('onboardingPages', JSON.stringify($rootScope.onboardingPages));

        if(!$rootScope.onboardingPages || $rootScope.onboardingPages.length === 0){
            $rootScope.hideMenuButton = false;
            $state.go(config.appSettings.defaultState);
        } else {
            $rootScope.hideMenuButton = true;
        }
    };

});
