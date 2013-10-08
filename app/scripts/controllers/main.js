'use strict';

angular.module('jsonSchemaDesignerApp')
    .controller('MainCtrl', function ($scope, $log) {

        $scope.jsonObjArray = [];
        $scope.shapeArray = [];
        $scope.objName = '';
        $scope.selectedObjName = '';
        var dblClickPos = {posX: 0, posY: 0};

        // Modal dialog for add new JSON schema object
        var addSchemaObjModal = $('#addSchemaObjModal');
        addSchemaObjModal.on('hidden.bs.modal', function () {
            $log.info('Add schema obj dialog closed');
            //$log.info('Obj name: ' + $scope.objName);
        });

        var canvas = new fabric.Canvas('c', { selection: false });

        // Draw a grid on Canvas
        /*
        var grid = 50;
        for (var i = 0; i < (500 / grid); i++) {
            canvas.add(new fabric.Line([ i * grid, 0, i * grid, 500], { stroke: '#ccc', selectable: false }));
            canvas.add(new fabric.Line([ 0, i * grid, 500, i * grid], { stroke: '#ccc', selectable: false }))
        }
        */

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
                    height: 30,
                    strokeWidth: 1,
                    stroke: 'black'
                });

                var group = new fabric.Group([rect, text], {
                    left: dblClickPos.posX,
                    top: dblClickPos.posY
                });

                //jsonSchemaObj.group = group;
                group.jsonSchemaObj = jsonSchemaObj;

                // Push the new object into the object array
                $scope.jsonObjArray.push(jsonSchemaObj);

                // Add the shape into the shape array
                $scope.shapeArray.push(group);

                $log.info('No of objects: ' + $scope.jsonObjArray.length);
                canvas.add(group);

                $scope.objName = '';
            }
        };

        canvas.on('object:selected', function(options){

            $scope.selectedShape = options.target;
            $scope.selectedSchemaObj = $scope.selectedShape.jsonSchemaObj;

            $log.info('An object was selected: ' + $scope.selectedShape.type);

            $log.info('Selected object name: ' + $scope.selectedSchemaObj.name);
            $scope.selectedObjName = $scope.selectedSchemaObj.name;
            $scope.$apply();

        });

        $scope.addObjAttr = function() {
            $log.info('Adding object attribute to object: ' + $scope.selectedSchemaObj.name);

            $log.info('Selected object at left: ' + $scope.selectedShape.getLeft() + ' and top: ' + $scope.selectedShape.getTop());

            var objAttr = new JsonSchemaAttr();

            // Calculate number of cells in the selected shape
            var noOfCells = $scope.selectedSchemaObj.objAttrs.length;
            $log.info('No. of attributes for selected object: ' + noOfCells);
            var topOffset = 30 + (15 * noOfCells);
            $log.info('Adding cell at top offset: ' + topOffset);
            var cellTop = $scope.selectedShape.getTop() + topOffset;
            $log.info('Adding cell at top position: ' + cellTop);

            $scope.selectedSchemaObj.objAttrs.push(objAttr);

            // Add attribute to selected shape
            var rect = new fabric.Rect({
                fill: 'green',
                width: 150,
                height: 30,
                strokeWidth: 1,
                stroke: 'black',
                top: cellTop,
                left: $scope.selectedShape.getLeft()
            });

            $scope.selectedShape.addWithUpdate(rect);

            $log.info('Attr added to object');

            redrawCanvas();
        };

        $scope.objNameChanged = function() {
            $log.info('Object name changed to: ' + $scope.selectedObjName);

            $scope.selectedSchemaObj.name = $scope.selectedObjName;

            $scope.selectedShape.item(1).set({
                text: $scope.selectedObjName
            });

            $log.info('Redraw canvas');
            redrawCanvas();
        }

        function redrawCanvas() {
            canvas.clear().renderAll();

            $scope.shapeArray.forEach(function(element){
                canvas.add(element);
            });
        }

    });