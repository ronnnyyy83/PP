(function () {
    'use strict';
    angular
        .module('powerPlug').directive('optionsTab', ['$uibModal', function ($uibModal) {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/options.html',
                scope: {
                    jsonobject: '=',
                    saveEvent: '=' //Indcates there is no event that save the data to json .. every change is made will be made on the original json
                },
                link: function (scope, element, attrs) {
                  
                  // This code set's different id for checkboxes
                  function setId(){
                    var inputArr = element.find('input');
                    var labelArr = element.find('label');

                    for (var i = 0; i < labelArr.length; i++) {
                      var rand = Math.random();
                      inputArr[i].setAttribute('id', rand);
                      labelArr[i].setAttribute('for', rand);
                    }
                  };
                  setId();
                  // End this code set's different id for checkboxes
                  function getMessageObject(messageToCopy) {
                      var messageObj = {
                          allowAbort: false,
                          msgDisplaySec: 10,
                          msgSnooze: {
                              allowSnooze: false,
                              msgSnoozeDefMin: 10,
                              msgSnoozeMaxMin: 60,
                          },
                          msgText: '',
                          msgTitle: ''
                      }
                      messageObj.allowAbort = messageToCopy.allowAbort ? true : false;
                      messageObj.msgDisplaySec = messageToCopy.msgDisplaySec ? messageToCopy.msgDisplaySec : messageToCopy.msgDisplaySec;
                      if (messageToCopy.msgSnooze) {
                          messageObj.msgSnooze.allowSnooze = messageToCopy.msgSnooze.allowSnooze;
                          messageObj.msgSnooze.msgSnoozeDefMin = messageToCopy.msgSnooze.msgSnoozeDefMin;
                          messageObj.msgSnooze.msgSnoozeMaxMin = messageToCopy.msgSnooze.msgSnoozeMaxMin;
                      }
                      messageObj.msgText = messageToCopy.msgText ? messageToCopy.msgText : messageObj.msgText;
                      messageObj.msgTitle = messageToCopy.msgTitle ? messageToCopy.msgTitle : messageObj.msgTitle;
                      return messageObj;
                  }
                  function setMessageObj(message, messageToCopy) {
                      message.allowAbort = messageToCopy.allowAbort;
                      message.msgDisplaySec = messageToCopy.msgDisplaySec;
                      message.msgSnooze = {};
                      if (messageToCopy.msgSnooze) {
                          message.msgSnooze.allowSnooze = messageToCopy.msgSnooze.allowSnooze;
                          message.msgSnooze.msgSnoozeDefMin = messageToCopy.msgSnooze.msgSnoozeDefMin;
                          message.msgSnooze.msgSnoozeMaxMin = messageToCopy.msgSnooze.msgSnoozeMaxMin;
                      } else {
                          message.msgSnooze.allowSnooze = false;
                      }
                      message.msgText = messageToCopy.msgText;
                      message.msgTitle = messageToCopy.msgTitle;
                  }
                  scope.specifyMessageDialog = function () {
                      $uibModal.open({
                          templateUrl: 'views/powerplan/dialogs/specifyMessage.html',
                          resolve: {
                              message: function () {
                                  return scope.options.message
                              }
                          },
                          controller: DialogController,
                          backdrop: 'static'
                      })

                      function DialogController($scope, $uibModalInstance, message) {
                          $scope.options = [
                              {value: 1 , label: "1 minute"},
                              {value: 5 , label: "5 minutes"},
                              {value: 10 , label: "10 minutes"},
                              {value: 15 , label: "15 minutes"},
                              {value: 30 , label: "30 minutes"},
                              {value: 60 , label: "1 hour"},
                              {value: 120 , label: "2 hours"},
                              {value: 240, label: "4 hours"}
                          ]
                          $scope.message = getMessageObject(message);
                          $scope.upsertSavingApplication = function () {                              
                              setMessageObj(message, $scope.message);
                              $uibModalInstance.close();
                          };
                          $scope.closeSavingApplication = function () {
                              $uibModalInstance.dismiss();
                          };
                          $scope.getMsgDisplaySec = function () {
                              if ($scope.message.msgDisplaySec < 10) {
                                  $scope.message.msgDisplaySec = 10;
                              }
                          }
                      }
                  };

                    //copy array appMetrics - init
                    if (!scope.saveEvent) {
                        scope.$watch('jsonobject', function (newValue, oldValue){
                            if (typeof (newValue) != 'undefined') {
                                //copy by ref
                                scope.options = scope.jsonobject;
                                if (typeof (newValue.message) == 'undefined') {
                                    scope.options.messageChecked = false;
                                } else {
                                    scope.options.messageChecked = true
                                    scope.options.message = scope.jsonobject.message;
                                }
                            }
                        });
                    } else if (typeof (scope.jsonobject) != 'undefined') {
                        //Copy by Value
                        scope.options = {};
                        scope.options.force = scope.jsonobject.force;
                        scope.options.logoff = scope.jsonobject.logoff;
                        if (typeof (scope.jsonobject.message) == 'undefined' || scope.options.messageChecked == false) {
                            scope.options.messageChecked = false;
                        } else {
                            scope.options.messageChecked = true
                            scope.options.message = getMessageObject(scope.jsonobject.message)
                        }
                    }
                    scope.updateMessage = function () {
                        if (scope.options.messageChecked && !scope.jsonobject.message) {
                            scope.options.message = {}
                            scope.options.message.msgDisplaySec = 10;
                            scope.options.message.msgText = "";
                            scope.options.message.msgTitle = "";
                        } else if (!scope.messageChecked) {
                            delete scope.options.message;
                        }
                    }

                    scope.$on('saveSettings', function (event, data) {
                        scope.jsonobject.force = scope.options.force;
                        scope.jsonobject.logoff = scope.options.logoff;
                        if (scope.options.messageChecked) {
                            setMessageObj(scope.jsonobject.message, scope.options.message);
                        } else {
                            delete scope.jsonobject.message
                        }
                    });
                }
            }
        }])
}());
