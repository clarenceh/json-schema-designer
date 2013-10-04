'use strict';

angular.module('jsonSchemaDesignerApp')
    .controller('MainCtrl', function ($scope, $log) {

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.jsonObjArray = [];

        var canvas = new fabric.Canvas('c');

        $scope.handleDblClick = function($event) {
            $log.info('Double click was detected at X: ' + $event.pageX + ' and Y: ' + $event.pageY);

            var canvasArea = $($event.target);
            var canvasPosition = canvasArea.offset();
            $log.info('Canvas position is at: ' + canvasPosition.left + ', ' + canvasPosition.top);

            var clickPosX = $event.pageX - canvasPosition.left;
            var clickPosY = $event.pageY - canvasPosition.top;
            $log.info('Clicked Canvas position is at: ' + clickPosX + ', ' + clickPosY);

            // Create a new instance of JsonSchemaObj
            var jsonSchemaObj = new JsonSchemaObj();
            jsonSchemaObj.name = 'Testing2';

            // Define a text
            var text = new fabric.Text(jsonSchemaObj.name, {
                fontSize: 10
            }) ;

            // Define a rectangle
            var rect = new fabric.Rect({
                fill: '#eef',
                width: 150,
                height: 30
            });

            var group = new fabric.Group([rect, text], {
                left: clickPosX,
                top: clickPosY
            });

            //jsonSchemaObj.group = group;
            group.jsonSchemaObj = jsonSchemaObj;

            // Push the new object into the object array
            $scope.jsonObjArray.push(jsonSchemaObj);

            $log.info('No of objects: ' + $scope.jsonObjArray.length);
            canvas.add(group);
        }

        canvas.on('object:selected', function(options){

            var selectedShape = options.target;

            $log.info('An object was selected: ' + selectedShape.type);

            $log.info('Selected object name: ' + selectedShape.jsonSchemaObj.name);
        });

    });