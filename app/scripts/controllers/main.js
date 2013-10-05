'use strict';

angular.module('jsonSchemaDesignerApp')
    .controller('MainCtrl', function ($scope, $log) {

        $scope.jsonObjArray = [];
        $scope.objName = '';
        var dblClickPos = {posX: 0, posY: 0};

        // Modal dialog for add new JSON schema object
        var addSchemaObjModal = $('#addSchemaObjModal');
        addSchemaObjModal.on('hidden.bs.modal', function () {
            $log.info('Add schema obj dialog closed');
            //$log.info('Obj name: ' + $scope.objName);
        });

        var canvas = new fabric.Canvas('c', { selection: false });

        // Draw a grid on Canvas
        var grid = 50;
        for (var i = 0; i < (500 / grid); i++) {
            canvas.add(new fabric.Line([ i * grid, 0, i * grid, 500], { stroke: '#ccc', selectable: false }));
            canvas.add(new fabric.Line([ 0, i * grid, 500, i * grid], { stroke: '#ccc', selectable: false }))
        }

        $scope.handleDblClick = function($event) {
            $log.info('Double click was detected at X: ' + $event.pageX + ' and Y: ' + $event.pageY);

            var canvasArea = $($event.target);
            var canvasPosition = canvasArea.offset();
            $log.info('Canvas position is at: ' + canvasPosition.left + ', ' + canvasPosition.top);

            //var clickPosX = $event.pageX - canvasPosition.left;
            //var clickPosY = $event.pageY - canvasPosition.top;
            dblClickPos.posX = $event.pageX - canvasPosition.left;
            dblClickPos.posY = $event.pageY - canvasPosition.top;
            $log.info('Clicked Canvas position is at: ' + dblClickPos.posX + ', ' + dblClickPos.posY);

            // Display modal
            addSchemaObjModal.modal('show');

        }

        $scope.addSchemaObjModalOk = function() {
            $log.info('Obj name: ' + $scope.objName);
            addSchemaObjModal.modal('hide');

            if ($scope.objName !== '') {
                // Create a new instance of JsonSchemaObj
                var jsonSchemaObj = new JsonSchemaObj();
                jsonSchemaObj.name = $scope.objName;

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
                    left: dblClickPos.posX,
                    top: dblClickPos.posY
                });

                //jsonSchemaObj.group = group;
                group.jsonSchemaObj = jsonSchemaObj;

                // Push the new object into the object array
                $scope.jsonObjArray.push(jsonSchemaObj);

                $log.info('No of objects: ' + $scope.jsonObjArray.length);
                canvas.add(group);

                $scope.objName = '';
            }
        };

        canvas.on('object:selected', function(options){

            var selectedShape = options.target;

            $log.info('An object was selected: ' + selectedShape.type);

            $log.info('Selected object name: ' + selectedShape.jsonSchemaObj.name);
        });

    });