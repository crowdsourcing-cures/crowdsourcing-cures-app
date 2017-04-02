var config = {};

config.appSettings  = {
    appDisplayName : 'ToBeNamed',
    lowercaseAppName : 'tobenamed',
    appDescription : "yourAppDescriptionHere",
    appleId: null,
    ionicAppId: null,
    cordovaLocalNotificationsEnabled : false,
    linkToChromeExtension : "https://chrome.google.com/webstore/detail/quantimodo-life-tracking/lncgjbhijecjdbdgeigfodmiimpmlelg",
    allowOffline : true,
    loaderImagePath : 'img/loaders/pop-tart-cat.gif',
    shoppingCartEnabled : true,
    qmApiHostName: 'app.quantimo.do',
    ionNavBarClass:'bar-positive',
    settingsPageOptions :
        {
            showReminderFrequencySelector : true
        },
    defaultState : 'app.measurements-variable-button-icons',
    welcomeState : 'app.welcome',
    appStorageIdentifier: 'MoodiModoData*',
    headline : 'Sync and Analyze Your Data',
    features: [
        ' - Automatically backup and sync your data across devices',
        ' - Track diet, treatments, symptoms, and anything else',
        ' - Analyze your data to see the strongest predictors of your mood'
    ],
    primaryOutcomeVariableDetails : {
        id : 1398,
        name : "Overall Mood",
        variableName: "Overall Mood",
        variableCategoryName : "Mood",
        unitAbbreviatedName : "/5",
        combinationOperation: "MEAN",
        description: 'positive',
        unitName: '1 to 5 Rating'
    },
    primaryOutcomeVariableRatingOptionLabels : [
        'Depressed',
        'Sad',
        'OK',
        'Happy',
        'Ecstatic'
    ],
    primaryOutcomeVariableRatingOptionLowercaseLabels : [
        'depressed',
        'sad',
        'ok',
        'happy',
        'ecstatic'
    ],
    /* END NEW STUFF */
    welcomeText:"Let's start off by adding your first medication!",
    primaryOutcomeVariableTrackingQuestion : "How are you",
    primaryOutcomeVariableAverageText : "Your average mood is ",
    mobileNotificationImage : "file://img/icons/icon_128.png",
    mobileNotificationText : "Time to track!",
    ratingValueToTextConversionDataSet: {
        "1": "depressed",
        "2": "sad",
        "3": "ok",
        "4": "happy",
        "5": "ecstatic"
    },
    ratingTextToValueConversionDataSet : {
        "depressed" : 1,
        "sad" : 2,
        "ok" : 3,
        "happy" : 4,
        "ecstatic": 5
    },
    "intro" : null,
    helpPopupMessages : {
        "#/app/example" :'You can see and edit your past mood ratings and notes by tapping on any item in the list.  <br/> <br/>You can also add a note by tapping on a mood rating in the list.',
    },
    remindersInbox : {},
    wordAliases : {},
    floatingMaterialButton : {
        button1 : {
            icon: 'ion-android-notifications-none',
            label: 'Add a Reminder',
            stateAndParameters: "'app.reminderSearch'"
        },
        button2 : {
            icon: 'ion-compose',
            label: 'Record a Measurement',
            stateAndParameters: "'app.measurementAddSearch'"
        },
        button3 : {
            icon: 'ion-ios-medkit-outline',
            label: 'Record a Dose',
            stateAndParameters: "'app.measurementAddSearch', {variableCategoryName: 'Treatments'}"
        },
        button4 : {
            icon: 'ion-sad-outline',
            label: 'Rate a Symptom',
            stateAndParameters: "'app.measurementAddSearch', {variableCategoryName: 'Symptoms'}"
        }
    },
    //****modified default reminders
    defaultVariables : [
        {   id:0,
            variableName : "Pulse",
            shortName :"Pulse",
            chineseName: "脉搏",
            defaultValue :  null,
            unitAbbreviatedName: "bpm",
            reminderFrequency : 0,
            icon: "ion-heart",
            variableCategoryName : "Vital Signs",
            img:"https://maxcdn.icons8.com/windows10/PNG/96/Programming/system_task-100.png",
            localImage:"img/iconImg/pulse.png",
            show:true

        },
        {
            id:12,
            variableName: "Blood Pressure",
            shortName :"Blood Pressure",
            chineseName:"血压",
            icon: "ion-heart",
            unitAbbreviatedName: "mmHg",
            reminderFrequency : "0",
            defaultValue:  "null",
            variableCategoryName : "Vital Signs",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Travel/scuba_pressure_gauge-100.png",
            localImage:"img/iconImg/bloodpressure.png",
            show:true
        },
        {
            id:1,
            variableName: "Blood Pressure (Systolic - Top Number)",
            icon: "ion-heart",
            unitAbbreviatedName: "mmHg",
            reminderFrequency: "0",
            defaultValue:  "null",
            variableCategoryName: "Vital Signs",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Travel/scuba_pressure_gauge-100.png",
            localImage:"img/iconImg/bloodpressure.png",
            show:false
        },
        {
            id:2,
            variableName: "Blood Pressure (Diastolic - Bottom Number)",
            icon: "ion-heart",
            unitAbbreviatedName: "mmHg",
            reminderFrequency: 0,
            defaultValue:  null,
            variableCategoryName: "Vital Signs",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Travel/scuba_pressure_gauge-100.png",
            localImage:"img/iconImg/bloodpressure.png",
            show:false
        },
        {
            id:3,
            variableName: "Core Body Temperature",
            shortName:"Body Temp",
            chineseName:"体温",
            icon: "null",
            unitAbbreviatedName: "C",
            reminderFrequency: 0,
            defaultValue:  null,
            variableCategoryName: "Vital Signs",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Science/temperature-100.png",
            localImage:"img/iconImg/Temperature.png",
            show:true
        },
        {
            id:4,
            variableName: "Oxygen Saturation",
            shortName:"H2O Oxygen",
            chineseName:"血氧饱和度",
            icon: null,
            unitAbbreviatedName: "%",
            reminderFrequency: 0,
            defaultValue:  null,
            variableCategoryName: "Vital Signs",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Science/oxygen-100.png",
            localImage:"img/iconImg/Oxygen.png",
            show:true
        },
        {
            id:5,
            variableName: "Height",
            shortName: "Height",
            chineseName: "身高",
            icon: null,
            unitAbbreviatedName: "cm",
            reminderFrequency: 0,
            defaultValue:  null,
            variableCategoryName: "Physique",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Science/height-100.png",
            localImage:"img/iconImg/Height.png",
            show:true
        },
        {
            id:6,
            variableName: "Weight",
            shortName:"Weight",
            chineseName:"体重",
            icon: null,
            unitAbbreviatedName: "kg",
            reminderFrequency: 0,
            defaultValue:  null,
            variableCategoryName: "Physique",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Science/weight-100.png",
            localImage:"img/iconImg/weight.png",
            show:true
        },
        {
            id:7,
            variableName: "Bowel Movements Count(Poop)",
            shortName: "Poop",
            chineseName: "排便",
            icon: null,
            unitAbbreviatedName: "count",
            reminderFrequency: 0,
            defaultValue:  null,
            variableCategoryName: "Symptoms",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Messaging/poo-100.png",
            localImage:"img/iconImg/Poo.png",
            show:true
        },
        {
            id:8,
            variableName: "Respiratory Rate",
            shortName:"Respiratory Rate",
            chineseName:"呼吸频率",
            icon: null,
            unitAbbreviatedName: "/minute",
            reminderFrequency : 0,
            defaultValue :  null,
            variableCategoryName : "Vital Signs",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Healthcare/lungs-100.png",
            localImage:"img/iconImg/Lungs.png",
            show:true
        },
        {
            id:9,
            variableName: "Blood Glucose Sugar",
            shortName: "Blood Sugar",
            chineseName: "血糖",
            icon: null,
            unitAbbreviatedName: "mg/dL",
            reminderFrequency: 0,
            defaultValue:  null,
            variableCategoryName : "Vital Signs",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Industry/water-100.png",
            localImage:"img/iconImg/glucose.png",
            show:true
        },
        {
            id:10,
            variableName: "Mood",
            shortName: "Mood",
            chineseName: "心情",
            icon: null,
            unitAbbreviatedName: "count",
            reminderFrequency: 0,
            defaultValue:  null,
            variableCategoryName : "Mood",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Messaging/poo-100.png",
            localImage:"img/iconImg/mood.png",
            show:true
        },
        {
            id:11,
            variableName: "Symptoms",
            shortName: "Symptoms",
            chineseName: "症状",
            icon: null,
            unitAbbreviatedName: "count",
            reminderFrequency: 0,
            defaultValue:  null,
            variableCategoryName: "Symptoms",
            img:"https://maxcdn.icons8.com/iOS7/PNG/100/Messaging/poo-100.png",
            localImage:"img/iconImg/symptoms.png",
            show:true
        }
    ],
    menuType : 'minimal'
};
if(!module){var module = {};}
module.exports = config.appSettings;