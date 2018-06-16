/**
 * UsersController
 *
 * @class UsersController
 * @constructor
 */

angular.module('appControllers')
    .controller('usersController', ['$scope', 'users', 'User', 'Notification', '$filter', '$state',
    function($scope, users, User, Notification, $filter, $state) {
        $scope.users = users;
        $scope.route = "admin|users";

        function getUser(id) {
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].ID === id) {
                    return $scope.users[i];
                }
            }
        }

        $scope.BanUser = function(id_user) {
            var ban = getUser(id_user).banned ? 0 : 1;

            User.BanUser(id_user, ban).then(function() {
                message(1, $filter('i18next')('success.ban_user'));
                // refresh data
                setTimeout(function() {
                    $state.transitionTo($state.current, {}, {
                        reload: true
                    });
                }, 50);
            }).catch(function() {
                message(3, $filter('i18next')('errors.ban_user'));
            })
        };

        $scope.DeleteUser = function(id_user) {
            var del = getUser(id_user).deleted ? 0 : 1;

            User.DeleteUser(id_user, del).then(function() {
                message(1, $filter('i18next')('success.delete_user'));
                // refresh data
                setTimeout(function() {
                    $state.transitionTo($state.current, {}, {
                        reload: true
                    });
                }, 50);
            }).catch(function() {
                message(3, $filter('i18next')('errors.delete_user'));
            })
        };

        $scope.VerifyUser = function(id_user) {
            var verify = getUser(id_user).verified ? 0 : 1;

            User.VerifyUser(id_user, verify).then(function() {
                message(1, $filter('i18next')('success.verify_user'));
                // refresh data
                setTimeout(function() {
                    $state.transitionTo($state.current, {}, {
                        reload: true
                    });
                }, 50);
            }).catch(function() {
                message(3, $filter('i18next')('errors.verify_user'));
            })
        };
    }
]);

