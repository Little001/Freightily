/**
* registrationController 
*
* @class registrationController
* @constructor
*/

angular.module('appControllers')
  .controller('registrationController', ['$scope', '$state', '$filter', 'User', function($scope, $state, $filter, User){
      $scope.user = {
      };
      $scope.clicked = false;

      $scope.registration = function() {
        var username = $("#username"),
            password = $("#password"),
            phone_number = $("#phone_number"),
            email = $("#email");

        $scope.clicked = true;
        if(!this.registrationForm.$valid) {
          message(3, $filter('i18next')('errors.set_all_inputs'));
          return;
        }
        username.removeClass("input-error");
        password.removeClass("input-error");
        phone_number.removeClass("input-error");
        email.removeClass("input-error");
        if($scope.user.username.length < 8) {
            message(3, $filter('i18next')('errors.username_must_me_greater_eight'));
            username.addClass("input-error");
            return;
        }
        if (!validateEmail($scope.user.email)) {
            message(3, $filter('i18next')('errors.wrong_email'));
            email.addClass("input-error");
            return;
        }
        if($scope.user.password.length < 8) {
          message(3, $filter('i18next')('errors.password_must_me_greater_eight'));
          password.addClass("input-error");
          return;
        }

        if($scope.user.phone_number.length < 9) {
            message(3, $filter('i18next')('errors.phone_number_must_me_greater_none'));
            phone_number.addClass("input-error");
            return;
        }

        if(!numberFieldsIsValid()) {
          return;
        }
        if(!($scope.user.accept_conditions)) {
          message(3, $filter('i18next')('errors.accept_conditions'));
          return;
        }
        if($scope.user.password !== $scope.user.confirmPassword){
          message(3, $filter('i18next')('errors.passwords_not_match'));
        }
        else{
          var data = {
            username: $scope.user.username,
            password: $scope.user.password,
            confirmpassword: $scope.user.confirmPassword,
            name: $scope.user.name,
            surname: $scope.user.surname,
            company_name: $scope.user.company_name,
            ico: $scope.user.ico,
            address_city: $scope.user.address_city,
            address_street: $scope.user.address_street,
            address_house_number: $scope.user.address_house_number,
            psc: $scope.user.psc,
            phone_number: $scope.user.phone_number,
            email: $scope.user.email,
            accept_conditions: $scope.user.accept_conditions
          };

          User.registrationUser(data).then(function(){
              message(1, $filter('i18next')('success.registration'));
              $state.go('login');
          }).catch(function(error){
              message(3, $filter('i18next')(getErrorKeyByCode(error)));
          })
        }
      };

      function numberFieldsIsValid() {
          var psc = $("#psc"),
              ico = $("#ico");

          if (!isValueNumber($scope.user.psc)) {
              psc.addClass("input-error");
              message(3, $filter('i18next')('errors.psc_is_number'));
              return false;
          }
          psc.removeClass("input-error");

          if (!isValueNumber($scope.user.ico)) {
              ico.addClass("input-error");
              message(3, $filter('i18next')('errors.ico_is_number'));
              return false;
          }
          ico.removeClass("input-error");
          return true;
      }

  }
]);
