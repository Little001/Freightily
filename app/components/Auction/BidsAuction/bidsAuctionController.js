/**
* bidsAuctionController 
*
* @class bidsAuctionController
* @constructor
*/

angular.module('appControllers')
  .controller('bidsAuctionController', ['$scope', 'bidsAuction', 'vehicles', function($scope, bidsAuction, vehicles){
    $scope.setNavigationPath("home|bidsAuction");
    $scope.AuctionList = bidsAuction;
    $scope.route = "auction|bids";
    $scope.vehicles = vehicles;
    middle_no_padding();
    $(window).resize(function () {
      if(window.innerWidth <= 900){
        middle_no_padding();
      }
    });
  }

]);


