angular.module('starter')
// Handles the Notifications (inapp, push)
    .factory('notificationService',function($rootScope, $ionicPlatform, $state){

        //Notification intervals in minutes
        var intervals = {
            'minutely':1,
            "every five minutes":5,
            "hourly":60,
            "every three hours":180,
            "twice a day": 720,
            "daily": 1440
        };

        return {

            scheduleAllNotifications: function(trackingReminders) {
                if(trackingReminders.length > 0){
                    if ($rootScope.isChromeExtension || $rootScope.isChromeApp)
                    {
                        chrome.alarms.clearAll();
                    }

                    if ($rootScope.isAndroid)
                    {
                        cordova.plugins.notification.local.cancelAll(function() {
                            console.log("Canceled all Android notifications!");
                        }, this);
                    }

                }
                for (var i = 0; i < trackingReminders.length; i++) {
                    this.scheduleNotification(false, trackingReminders[i]);
                }
            },
            
            scheduleNotification:function(interval, trackingReminder){

                function scheduleAndroidNotification(interval, trackingReminder) {

                    var notificationSettings = {
                        text: config.appSettings.mobileNotificationText,
                        every: intervals[interval],
                        icon: 'ic_stat_icon_bw',
                        id: config.appSettings.primaryOutcomeVariableDetails.id
                    };
                    if (interval && interval !== "never") {
                        cordova.plugins.notification.local.cancel(notificationSettings.id, function() {
                            console.log("Canceled Android notification " + notificationSettings.id);
                        });
                        cordova.plugins.notification.local.schedule(notificationSettings, function () {
                            console.log('notification scheduled', notificationSettings);
                        });
                        cordova.plugins.notification.local.on("click", function (notification) {
                            console.log("$state.go('app.remindersInbox')");
                            $state.go('app.remindersInbox');
                        });
                    } else if (trackingReminder) {
                        cordova.plugins.notification.local.cancel(trackingReminder.id, function() {
                            console.log("Canceled Android notification " + trackingReminder.id);
                        });
                        var firstAt = new Date(trackingReminder.nextReminderTimeEpochSeconds*1000);
                        var minuteFrequency  = trackingReminder.reminderFrequency / 60;
                        notificationSettings = {
                            autoClear: true,
                            badge: 0,
                            color: undefined,
                            data: undefined,
                            led: undefined,
                            sound: null,
                            ongoing: false,
                            title: "Track " + trackingReminder.variableName,
                            text: "Tap to open reminder inbox",
                            firstAt: firstAt,
                            every: minuteFrequency,
                            icon: 'ic_stat_icon_bw',
                            id: trackingReminder.id
                        };
                        //notificationSettings.sound = "res://platform_default";
                        //notificationSettings.smallIcon = 'ic_stat_icon_bw';
                        cordova.plugins.notification.local.schedule(notificationSettings,
                            function () {
                                console.debug('notification scheduled', notificationSettings);
                            });
                        cordova.plugins.notification.local.on("click", function (notification) {
                            console.debug("$state.go('app.remindersInbox')");
                            $state.go('app.remindersInbox');
                        });
                    }
                }

                function scheduleIosNotification(interval, trackingReminder) {
                    cordova.plugins.notification.local.cancelAll(function () {
                        var notificationSettings = {
                            text: config.appSettings.mobileNotificationText,
                            every: interval,
                            icon: config.appSettings.mobileNotificationImage,
                            id: config.appSettings.primaryOutcomeVariableDetails.id
                        };
                        if (interval && interval !== "never") {
                            cordova.plugins.notification.local.schedule(notificationSettings, function () {
                                console.log('iOS notification scheduled', notificationSettings);
                            });
                            cordova.plugins.notification.local.on("click", function (notification) {
                                console.log("$state.go('app.remindersInbox')");
                                $state.go('app.remindersInbox');
                            });
                        } else if (trackingReminder) {
                            cordova.plugins.notification.local.cancel(trackingReminder.id, function() {
                                console.log("Canceled iOS notification " + trackingReminder.id);
                            });
                            var firstAt = new Date(trackingReminder.nextReminderTimeEpochSeconds*1000);
                            var minuteFrequency  = trackingReminder.reminderFrequency / 60;
                            notificationSettings = {
                                autoClear: true,
                                badge: 0,
                                color: undefined,
                                data: undefined,
                                led: undefined,
                                ongoing: false,
                                sound: null,
                                title: "Track " + trackingReminder.variableName,
                                text: "Tap to open reminder inbox",
                                firstAt: firstAt,
                                every: minuteFrequency,
                                icon: config.appSettings.mobileNotificationImage,
                                id: trackingReminder.id
                            };
                            //notificationSettings.sound = "res://platform_default";
                            //notificationSettings.smallIcon = 'ic_stat_icon_bw';
                            cordova.plugins.notification.local.schedule(notificationSettings,
                                function () {
                                    console.debug('notification scheduled', notificationSettings);
                                });
                            cordova.plugins.notification.local.on("click", function (notification) {
                                console.debug("$state.go('app.remindersInbox')");
                                $state.go('app.remindersInbox');
                            });
                        }
                    });
                }

                function scheduleChromeExtensionNotification(interval, trackingReminder) {
                    var alarmInfo = {};
                    if(interval && interval !== "never"){
                        console.log('Reminder notification interval is ' + interval);
                        alarmInfo = {periodInMinutes: intervals[interval]};
                        chrome.alarms.clear("trackReportAlarm");
                        chrome.alarms.create("trackReportAlarm", alarmInfo);
                        console.log("Alarm set, every " + intervals[interval] + " minutes");
                    } else if (trackingReminder) {
                        console.debug('Creating reminder for ', trackingReminder);
                        alarmInfo.when =  trackingReminder.nextReminderTimeEpochSeconds * 1000;
                        alarmInfo.periodInMinutes = trackingReminder.reminderFrequency / 60;
                        var alarmName = JSON.stringify(trackingReminder);
                        chrome.alarms.clear(alarmName);
                        chrome.alarms.create(alarmName, alarmInfo);
                        console.debug('Created alarm for alarmName ' + alarmName, alarmInfo);
                    }


                }

                $ionicPlatform.ready(function () {

                    if (typeof cordova != "undefined") {
                        if (ionic.Platform.isAndroid()) {
                            scheduleAndroidNotification(interval, trackingReminder);
                        } else if (ionic.Platform.isIPad() || ionic.Platform.isIOS()) {
                            scheduleIosNotification(interval, trackingReminder);
                        }
                    } else if ($rootScope.isChromeExtension || $rootScope.isChromeApp) {
                        scheduleChromeExtensionNotification(interval, trackingReminder);
                    }
                });
            },

            // cancel all existing notifications
            cancelNotifications: function(){
                if(typeof cordova != "undefined"){
                    cordova.plugins.notification.local.cancelAll(function(){
                        console.log('notifications cancelled');
                    });
                }else if(typeof chrome.alarms != "undefined"){
                    chrome.alarms.clear("trackReportAlarm");
                }

            }
        };
    });