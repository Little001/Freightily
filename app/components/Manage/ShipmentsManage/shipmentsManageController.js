/**
 * shipmentsManageController
 *
 * @class shipmentsManageController
 * @constructor
 */

angular.module('appControllers')
    .controller('shipmentsManageController', ['$scope', 'WinAuction', 'drivers', 'assigments', 'UserAbility', 'Notification', '$filter',
        function($scope, WinAuction, drivers, assigments, UserAbility, Notification, $filter){
            $scope.setNavigationPath("home|manage|my_shipments");
            $scope.myWinAuction = WinAuction;
            $scope.route = "shipments|manage";
            $scope.assigments = assigments;
            $scope.drivers = drivers;

            $scope.showDetail = function(id) {
                $scope.$broadcast("openAuctionDetail",id);
            };

            $scope.fixAssignment = function(item) {
                var data = {
                    id_auction : item.id_auction,
                    id_driver : item.id_driver
                };

                if(item.is_fixed) {
                    return;
                }

                UserAbility.fixAssigment(data).then(function(){
                    message(1, $filter('i18next')('Zásilka byla přiřazena na řidiče na stálo'));
                    item.is_fixed = true;
                    $scope.refresh();
                }).catch(function(){
                    message(3, $filter('i18next')('Chyba při přiřazení na stálo'));
                })
            };

            $scope.refresh = function() {
                $scope.myWinAuction = WinAuction;
                $scope.assigments = assigments;
                $scope.drivers = drivers;
            };
        }
    ]);


