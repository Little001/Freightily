/**
* MainController 
*
* @class MainController
* @constructor
*/

angular.module('appControllers')
  .controller('MainController', ['$scope', '$i18next', 'User', '$state', '$filter', function($scope, $i18next, User, $state, $filter){
    $scope.navigationPath = "";

    $scope.isLoggedUser = function(){
      if(User.isLoggedIn){
        $scope.usernameMain = User.username;
        $scope.roleNameMain = User.roleName;
        $scope.isSender = User.isSender();
        $scope.isDispatcher = User.isDispatcher();
        $scope.isTransporter = User.isTransporter(); 
        $scope.isDriver = User.isDriver();  
        return true;
      }
      $scope.usernameMain = "";
      $scope.roleNameMain = "";
      $scope.isSender = false;
      $scope.isDispatcher = false;
      $scope.isTransporter = false;
      return false;
    };

    $scope.logout = function(){
      User.logout().then(function(){
        console.log("Logout success");
        $state.go('login');
      }).catch(function(){
        console.log("Logout fail");
      })
    };

     $scope.ENlng = function(){
        $i18next.options.lng = 'EN';
        $i18next.options.resGetPath = '../locales/EN/translation.json';
      };
       $scope.CZlng = function(){
        $i18next.options.lng = 'CZ';
        $i18next.options.resGetPath = '../locales/CZ/translation.json';
      };

      $scope.setNavigationPath = function(path){
        if(!path) {
            $scope.navigationPath = {};
            return;
        }
        var pathArray = path.split("|"),
            navigationList = [],
            i = 0;

        for(i; i < pathArray.length; i++) {
            navigationList.push({
                link: pathArray[i],
                path: 'texts.navigation.' + pathArray[i]
            });
        }
        $scope.navigationPath = navigationList;
      };
      
  
  }
]);
