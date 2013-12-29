'use strict';

angular.module('GeoHashingApp')
    .controller('EditMarkerCtrl',['$scope', '$rootScope', '$stateParams', '$http', '$upload',
        function ($scope, $rootScope, $stateParams, $http, $upload) {

        $rootScope.textAngularOpts = {
            toolbar: [
                ['h1', 'h2', 'h3', 'p', 'pre', 'bold', 'italics', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['html', 'insertImage', 'insertLink']
            ],
            classes: {
                toolbar: "btn-toolbar",
                toolbarGroup: "btn-group",
                toolbarButton: "btn btn-default",
                toolbarButtonActive: "active",
                textEditor: 'form-control',
                htmlEditor: 'form-control'
            }
        };

        $scope.id = $stateParams.id;
        $scope.user = '';
        $scope.latitude = '';
        $scope.longitude = '';
        $scope.description = '';

        var getMarker = function (markerId) {
            $http({method: 'GET', url: '/markers/get/marker/json/' + markerId}).
                success(function (data, status, headers, config) {
                    if (data && data.id) {
                        showMarker(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        };

        if ($scope.id) {
            getMarker($scope.id);
        }

        $scope.submit = function () {
            var markerJson = {
                'id': $scope.id,
                'user': $scope.user,
                'latitude': $scope.latitude,
                'longitude': $scope.longitude,
                'description': $scope.description
            };

            $http({method: 'POST', url: '/markers/edit/json', data: markerJson }).
                success(function (data, status, headers, config) {
                    if (data && data.id) {
                        showMarker(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        };


        var showMarker = function (markerJson) {
            $scope.id = markerJson.id;
            $scope.user = markerJson.user;
            $scope.latitude = markerJson.latitude;
            $scope.longitude = markerJson.longitude;
            $scope.description = markerJson.description;
        };


        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/marker/upload/images',
                    // method: POST or PUT,
                    // headers: {'headerKey': 'headerValue'}, withCredential: true,
                    data: {myObj: $scope.myModelObj},
                    file: file
                    // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                    /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                    //fileFormDataName: myFile,
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                    //formDataAppender: function(formData, key, val){}
                }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
                    });
                //.error(...)
                //.then(success, error, progress);
            }
        };

    }]);

