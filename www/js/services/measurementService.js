angular.module('starter')
	// Measurement Service
	.factory('measurementService', function($http, $q, QuantiModo, localStorageService, $rootScope){

        //flag to indicate if data syncing is in progress
        var isSyncing = false;

		// service methods
		var measurementService = {

            // get all data from date range to date range
            getAllLocalMeasurements : function(tillNow, callback){

                var allMeasurements;

                localStorageService.getItem('allMeasurements',function(measurementsFromLocalStorage){

                    measurementsFromLocalStorage = JSON.parse(measurementsFromLocalStorage);

                    var measurementsQueue = localStorageService.getItemAsObject('measurementsQueue');

                    if (measurementsFromLocalStorage) {
                        allMeasurements = measurementsFromLocalStorage.concat(measurementsQueue);
                    }
                    else {
                        allMeasurements = measurementsQueue;
                    }

                    // filtered measurements
                    var returnSorted = function(start, end){

                        allMeasurements = allMeasurements.sort(function(a, b){
                            if(!a.startTimeEpoch){
                                a.startTimeEpoch = a.timestamp;
                            }

                            if(!b.startTimeEpoch){
                                b.startTimeEpoch = b.timestamp;
                            }
                            return a.startTimeEpoch - b.startTimeEpoch;
                        });
						/*
                        var filtered = allMeasurements.filter(function(measurement){
                            if(!measurement.startTimeEpoch){
                                measurement.startTimeEpoch = measurement.timestamp;
                            }
                            return measurement.startTimeEpoch >= start && measurement.startTimeEpoch <= end;
                        });
                        */

                        return callback(allMeasurements);
                    };

                    if(!allMeasurements){
                        return callback(false);
                    }

                    // params
                    measurementService.getFromDate(function(start){
                        start = start / 1000;

                        var end;

                        if(tillNow){
                            end = Math.floor(Date.now()/1000);
                            returnSorted(start,end);
                        } else {
                            measurementService.getToDate(function(end){
                                end = end / 1000;
                                returnSorted(start,end);
                            });
                        }
                    });

                });
            },

            // get data from QuantiModo API
            getMeasurements : function(){
                var deferred = $q.defer();
                isSyncing = true;

                $rootScope.lastSyncTime = 0;

                localStorageService.getItem('lastSyncTime',function(lastSyncTime){
                    var nowDate = new Date();
                    var lastSyncDate = new Date(lastSyncTime);
                    var milliSecondsSinceLastSync = nowDate - lastSyncDate;
                    if(milliSecondsSinceLastSync < 5 * 60 * 1000){
                        deferred.resolve();
                        return deferred.promise;
                    }
                    if (lastSyncTime) {
                        $rootScope.lastSyncTime = lastSyncTime;
                    }

                });

                // send request
                var params;
                params = {
                    variableName : config.appSettings.primaryOutcomeVariableDetails.name,
                    'lastUpdated':'(ge)'+ $rootScope.lastSyncTime ,
                    sort : '-startTimeEpoch',
                    limit:200,
                    offset:0
                };

                localStorageService.getItem('user', function(user){
                    if(!user){
                        isSyncing = false;
                        deferred.resolve();
                    }
                });

                // send request
                QuantiModo.getMeasurements(params).then(function(response){
                    if(response){
                        localStorageService.setItem('lastSyncTime',moment.utc().format('YYYY-MM-DDTHH:mm:ss'));
                        localStorageService.getItem('lastSyncTime',function(val){
                            $rootScope.lastSyncTime = val;
                            console.log("lastSyncTime is " + $rootScope.lastSyncTime);
                        });
                        // set flag
                        isSyncing = false;
                        deferred.resolve(response);
                        $rootScope.$broadcast('updateCharts');
                    }
                    else {
                        deferred.reject(false);
                    }
                }, function(response){
                    isSyncing = false;
                    $rootScope.isSyncing = false;
                    deferred.reject(false);
                }, function(response){
                    if(response){
                        if(response.length > 0){
                            // update local data
                            var allMeasurements;
                            localStorageService.getItem('allMeasurements',function(allMeasurements){
                                allMeasurements = allMeasurements ? JSON.parse(allMeasurements) : [];

                                var filteredStoredMeasurements = [];

                                allMeasurements.forEach(function(storedMeasurement) {
                                    var found = false;
                                    var i = 0;
                                    while (!found && i < response.length) {
                                        var responseMeasurement = response[i];
                                        if (storedMeasurement.startTimeEpoch === responseMeasurement.startTimeEpoch &&
                                            storedMeasurement.id === responseMeasurement.id) {
                                            found = true;
                                        }
                                        i++;
                                    }
                                    if (!found) {
                                        filteredStoredMeasurements.push(storedMeasurement);
                                    }
                                });
                                allMeasurements = filteredStoredMeasurements.concat(response);


                                var s  = 9999999999999;
                                allMeasurements.forEach(function(x){
                                    if(!x.startTimeEpoch){
                                        x.startTimeEpoch = x.timestamp;
                                    }
                                    if(x.startTimeEpoch <= s){
                                        s = x.startTimeEpoch;
                                    }
                                });

                                measurementService.setDates(new Date().getTime(),s*1000);
                                //updating last updated time and data in local storage so that we syncing should continue from this point
                                //if user restarts the app or refreshes the page.
                                localStorageService.setItem('allMeasurements',JSON.stringify(allMeasurements));
                                $rootScope.lastSyncTime = moment.utc().format('YYYY-MM-DDTHH:mm:ss');
                                localStorageService.setItem('lastSyncTime', $rootScope.lastSyncTime);
                                console.log("lastSyncTime is " + $rootScope.lastSyncTime);

                            });

                        }
                    } else {
                        localStorageService.getItem('user', function(user){
                            if(!user){
                                isSyncing = false;
                                deferred.resolve();
                            }
                        });
                    }
                });
                
                return deferred.promise;
            },

            // sync the measurements in queue with QuantiModo API
            syncPrimaryOutcomeVariableMeasurements : function(){
                var defer = $q.defer();

                localStorageService.getItem('measurementsQueue',function(measurementsQueue) {

                    var measurementObjects = JSON.parse(measurementsQueue);

                    if(!measurementObjects || measurementObjects.length < 1){
                        defer.resolve();
                        console.debug('No measurements to sync!');
                        $rootScope.$broadcast('updateCharts');
                        return defer.promise;
                    }

                    // measurements set
                    var measurements = [
                        {
                            variableName: config.appSettings.primaryOutcomeVariableDetails.name,
                            source: config.get('clientSourceName'),
                            variableCategoryName: config.appSettings.primaryOutcomeVariableDetails.category,
                            combinationOperation: config.appSettings.primaryOutcomeVariableDetails.combinationOperation,
                            abbreviatedUnitName: config.appSettings.primaryOutcomeVariableDetails.abbreviatedUnitName,
                            measurements: measurementObjects
                        }
                    ];

                    console.debug('Syncing ', measurementObjects);

                    // send request
                    QuantiModo.postMeasurementsV2(measurements, function (response) {
                        // success
                        measurementService.getMeasurements();
                        // clear queue
                        localStorageService.setItem('measurementsQueue', JSON.stringify([]));
                        defer.resolve();
                        console.log("success", response);

                    }, function (response) {
                        // error

                        // resave queue
                        localStorageService.setItem('measurementsQueue', JSON.stringify(measurementsQueue));
                        console.log("error", response);
                        defer.resolve();


                    });

                });

                return defer.promise;
            },

			// date setter from - to
			setDates : function(to, from){
				localStorageService.setItem('toDate',parseInt(to));
                localStorageService.setItem('fromDate',parseInt(from));
			},

			// retrieve date to end on
			getToDate : function(callback){
                localStorageService.getItem('toDate',function(toDate){
                    if(toDate){
                        callback(parseInt(toDate));
                    }else{
                        callback(parseInt(Date.now()));
                    }
                });

			},

			// retrieve date to start from
			getFromDate : function(callback){
                localStorageService.getItem('fromDate',function(fromDate){
                    if(fromDate){
                        callback(parseInt(fromDate));
                    }else{
                        var date = new Date();

                        // Threshold 20 Days if not provided
                        date.setDate(date.getDate()-20);

                        console.log("The date returned is ", date.toString());
                        callback(parseInt(date.getTime()));
                    }
                });
			},

			// update primary outcome variable in local storage
            addToMeasurementsQueue : function(numericRatingValue){
                console.log("reported", numericRatingValue);
                var deferred = $q.defer();

                // if val is string (needs conversion)
                if(isNaN(parseFloat(numericRatingValue))){
                    numericRatingValue = config.appSettings.ratingTextToValueConversionDataSet[numericRatingValue] ?
                        config.appSettings.ratingTextToValueConversionDataSet[numericRatingValue] : false;
                }

                localStorageService.setItem('lastReportedPrimaryOutcomeVariableValue', numericRatingValue);
                //add to measurementsQueue to be synced later
                var startTimeEpoch  = new Date().getTime();
                // check queue
                localStorageService.getItem('measurementsQueue',function(measurementsQueue) {
                    measurementsQueue = measurementsQueue ? JSON.parse(measurementsQueue) : [];

                    // add to queue
                    measurementsQueue.push({
                        name: config.appSettings.primaryOutcomeVariableDetails.name,
                        variableDescription: config.appSettings.primaryOutcomeVariableDetails.description,
                        startTimeEpoch: Math.floor(startTimeEpoch / 1000),
                        abbreviatedUnitName: config.appSettings.primaryOutcomeVariableDetails.abbreviatedUnitName,
                        value: numericRatingValue,
                        note: ""
                    });
                    //resave queue
                    localStorageService.setItem('measurementsQueue', JSON.stringify(measurementsQueue));
                });

                return deferred.promise;
            },

			// edit existing measurement
			editPrimaryOutcomeVariable : function(startTimeEpoch, val, note){
				var deferred = $q.defer();
				// measurements set
				var measurements = [
					{
					   	name: config.appSettings.primaryOutcomeVariableDetails.name,
                        source: config.get('clientSourceName'),
                        category: config.appSettings.primaryOutcomeVariableDetails.category,
                        combinationOperation: config.appSettings.primaryOutcomeVariableDetails.combinationOperation,
                        unit: config.appSettings.primaryOutcomeVariableDetails.abbreviatedUnitName,
					   	measurements : [{
					   		startTimeEpoch:  startTimeEpoch,
					   		value: val,
					   		note : (note && note !== null)? note : null
					   	}]
					}
				];

			   console.log(measurements);

			   var measurementDataSet;
               localStorageService.getItem('allMeasurements',function(allMeasurements){
                   measurementDataSet = JSON.parse(allMeasurements);
                   // extract the measurement from localStorage
                   var selectedMeasurementDataSetItems = measurementDataSet.filter(function(x){return x.startTimeEpoch === startTimeEpoch;});

                   // update localstorage data
                   var selectedMeasurementItem = selectedMeasurementDataSetItems[0];

                   // extract value
                   selectedMeasurementItem.value = val;
                   selectedMeasurementItem.note = (selectedMeasurementItem.note && selectedMeasurementItem.note !== null)? selectedMeasurementItem.note : null;

                   // update localstorage
                   localStorageService.setItem('allMeasurements',JSON.stringify(measurementDataSet));

                   // send request
                   QuantiModo.postMeasurementsV2(measurements, function(response){

                       console.log("success", response);
                       deferred.resolve();

                   }, function(response){

                       console.log("error", response);
                       //save in measurementsQueue
                       localStorageService.getItem('measurementsQueue',function(queue){
                          queue.push(measurements);
                          deferred.resolve();

                       });

                   });
               });

				return deferred.promise;
			},

            getHistoryMeasurements : function(params){
                var deferred = $q.defer();

                QuantiModo.getV1Measurements(params, function(response){
                    deferred.resolve(response);
                }, function(error){
                    deferred.reject(error);
                });

                return deferred.promise;
            },

            getMeasurementById : function(measurementId){
                var params = {id : measurementId};
                QuantiModo.getV1Measurements(params, function(response){
                    var measurementArray = response.data;
                    if(!measurementArray[0]){
                        console.log('Could not get measurement with id: ' + measurementId);
                        return;
                    }
                    var measurementObject = measurementArray[0];
                    return measurementObject;
                }, function(error){
                    console.log(error);
                });
            },

            deleteMeasurement : function(measurement){
                QuantiModo.deleteV1Measurements(measurement, function(response){
                    console.log("success", response);
                    // update local data
                    var found = false;
                    if (measurement.id) {
                        var newAllMeasurements = [];
                        localStorageService.getItem('allMeasurements',function(oldAllMeasurements) {
                            oldAllMeasurements = oldAllMeasurements ? JSON.parse(oldAllMeasurements) : [];

                            oldAllMeasurements.forEach(function (storedMeasurement) {
                                // look for deleted measurement based on IDs
                                if (storedMeasurement.id !== measurement.id) {
                                    // copy non-deleted measurements to newAllMeasurements
                                    newAllMeasurements.push(storedMeasurement);
                                }
                                else {
                                    console.debug("deleted measurement found in allMeasurements");
                                    found = true;
                                }
                            });
                        });
                        if (found) {
                            localStorageService.setItem('allMeasurements',JSON.stringify(newAllMeasurements));
                        }
                    }
                    else {
                        var newMeasurementsQueue = [];
                        localStorageService.getItemAsObject('measurementsQueue',function(oldMeasurementsQueue) {
                            oldMeasurementsQueue.forEach(function(queuedMeasurement) {
                                // look for deleted measurement based on startTimeEpoch and FIXME value
                                if (queuedMeasurement.startTimeEpoch !== measurement.startTimeEpoch) {
                                    newMeasurementsQueue.push(queuedMeasurement);
                                }
                                else {
                                    console.debug("deleted measurement found in measurementsQueue");
                                    found = true;
                                }
                            });
                        });
                        if (found) {
                            localStorageService.setItem('measurementsQueue',JSON.stringify(newMeasurementsQueue));
                        }
                    }
                    if (!found){
                        console.debug("error: deleted measurement not found");
                    }


                }, function(response){
                    console.log("error", response);
                });
            },
		};
		return measurementService;
	});