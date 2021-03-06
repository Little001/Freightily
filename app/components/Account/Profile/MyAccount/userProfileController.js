/**
 * userProfileController
 *
 * @class userProfileController
 * @constructor
 */

angular.module('appControllers')
    .controller('userProfileController', ['$scope', '$filter', 'userInfo', 'UserAbility', function ($scope, $filter, userInfo, UserAbility) {
        $scope.route = "account|profile";
        $scope.userInfo = userInfo;

        $scope.setInfo = function () {
            var phone_number = $(".user-page #phone_number"),
                company_name = $(".user-page #company_name"),
                data;

            phone_number.removeClass("input-error");
            company_name.removeClass("input-error");

            if($scope.userInfo.phone_number.length < 9) {
                message(3, $filter('i18next')('errors.phone_number_must_me_greater_none'));
                phone_number.addClass("input-error");
                return;
            }
            if($scope.userInfo.company_name.length < 1) {
                message(3, $filter('i18next')('errors.company_name_is_required'));
                company_name.addClass("input-error");
                return;
            }

            data = {
                phone_number: $scope.userInfo.phone_number,
                company_name: $scope.userInfo.company_name
            };

            UserAbility.setInfo(data).then(function () {
                message(1, $filter('i18next')('success.set_account_info'));
            }).catch(function (error) {
                message(3, $filter('i18next')(getErrorKeyByCode(error)));
            })
        };
    }
    ]);



