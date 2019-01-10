/**
 * view new shipments
 *
 * @class newShipmentsView
 * @constructor
 */

angular.module('appControllers')
    .controller('newShipmentsController', ['$scope', 'newShipmentsResponse', 'User', '$state', '$filter',
        function($scope, newShipmentsResponse, User, $state, $filter){
        $scope.route = "shipments|new";
        $scope.shipments = newShipmentsResponse.shipments;
        $scope.shipmentsCount = newShipmentsResponse.Count;
        middle_no_padding();
        $(window).resize(function () {
            if(window.innerWidth <= 900){
                middle_no_padding();
            }
        });
    }
]);


