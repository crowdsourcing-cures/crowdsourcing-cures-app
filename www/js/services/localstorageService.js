/**
 * Created by Abdullah on 8/14/2015.
 * //
 */

angular.module('starter')

    .factory('localStorageService',function(utilsService, $rootScope, $q){

        return{

            deleteItem : function(key){
                var keyIdentifier = config.appSettings.appStorageIdentifier;
                if ($rootScope.isChromeApp) {

                    // Code running in a Chrome extension (content script, background page, etc.)
                    chrome.storage.local.remove(keyIdentifier+key);

                } else {
                    localStorage.removeItem(keyIdentifier+key);
                }
            },

            deleteElementOfItemById : function(localStorageItemName, elementId){
                var deferred = $q.defer();
                var localStorageItemArray = JSON.parse(this.getItemSync(localStorageItemName));
                var elementsToKeep = [];
                for(var i = 0; i < localStorageItemArray.length; i++){
                    if(localStorageItemArray[i].id !== elementId){
                        elementsToKeep.push(localStorageItemArray[i]);
                    }
                }
                this.setItem(localStorageItemName, JSON.stringify(elementsToKeep));
                deferred.resolve();
                return deferred.promise;
            },

            replaceElementOfItemById : function(localStorageItemName, replacementElement){
                var deferred = $q.defer();
                var localStorageItemArray = JSON.parse(this.getItemSync(localStorageItemName));
                var elementsToKeep = [];
                for(var i = 0; i < localStorageItemArray.length; i++){
                    if(localStorageItemArray[i].id !== replacementElement.id){
                        elementsToKeep.push(localStorageItemArray[i]);
                    }
                    if(localStorageItemArray[i].id === replacementElement.id){
                        elementsToKeep.push(replacementElement);
                    }
                }
                this.setItem(localStorageItemName, JSON.stringify(elementsToKeep));
                deferred.resolve();
                return deferred.promise;
            },

            setItem:function(key, value){
                var keyIdentifier = config.appSettings.appStorageIdentifier;
                if ($rootScope.isChromeApp) {
                    // Code running in a Chrome extension (content script, background page, etc.)
                    var obj = {};
                    obj[keyIdentifier+key] = value;
                    chrome.storage.local.set(obj);

                } else {
                    localStorage.setItem(keyIdentifier+key,value);
                }
            },
            
            getItem:function(key,callback){
                var keyIdentifier = config.appSettings.appStorageIdentifier;
                if ($rootScope.isChromeApp) {
                    // Code running in a Chrome extension (content script, background page, etc.)
                    chrome.storage.local.get(keyIdentifier+key,function(val){
                        callback(val[keyIdentifier+key]);
                    });
                } else {
                    var val = localStorage.getItem(keyIdentifier+key);
                    callback(val);
                }
            },

            getItemSync: function (key) {
                var keyIdentifier = config.appSettings.appStorageIdentifier;
                if ($rootScope.isChromeApp) {
                    // Code running in a Chrome extension (content script, background page, etc.)
                    chrome.storage.local.get(keyIdentifier+key,function(val){
                        return val[keyIdentifier+key];
                    });
                } else {
                    return localStorage.getItem(keyIdentifier+key);
                }
            },

            getElementsFromItemWithProperty: function (localStorageItemName, filterPropertyName, filterPropertyValue) {
                var keyIdentifier = config.appSettings.appStorageIdentifier;
                var unfilteredElementArray = [];
                var matchingElements = [];
                if ($rootScope.isChromeApp) {
                    // Code running in a Chrome extension (content script, background page, etc.)
                    chrome.storage.local.get(keyIdentifier+localStorageItemName,function(localStorageItems){
                        unfilteredElementArray = localStorageItems[keyIdentifier + localStorageItemName];
                    });
                } else {
                    unfilteredElementArray = localStorage.getItem(keyIdentifier + localStorageItemName);
                }

                for(var i = 0; i < unfilteredElementArray.length; i++){
                    if(unfilteredElementArray[i][filterPropertyName] === filterPropertyValue){
                        matchingElements.push(unfilteredElementArray[i]);
                    }
                }
                
                return matchingElements;
            },

            getItemAsObject: function (key) {
                var keyIdentifier = config.appSettings.appStorageIdentifier;
                if ($rootScope.isChromeApp) {
                    // Code running in a Chrome extension (content script, background page, etc.)
                    chrome.storage.local.get(keyIdentifier+key,function(val){
                        var item = val[keyIdentifier+key];
                        item = utilsService.convertToObjectIfJsonString(item);
                        return item;
                    });
                } else {
                    var item = localStorage.getItem(keyIdentifier+key);
                    item = utilsService.convertToObjectIfJsonString(item);
                    return item;
                }
            },

            clear:function(){
                if ($rootScope.isChromeApp) {
                    chrome.storage.local.clear();
                } else {
                    localStorage.clear();
                }
            }
        };
    });