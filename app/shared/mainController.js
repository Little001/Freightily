/**
 * MainController
 *
 * @class MainController
 * @constructor
 */

angular.module('appControllers')
    .controller('MainController', ['$scope', '$i18next', 'User', '$state', function ($scope, $i18next, User, $state) {
        $scope.isLoggedUser = function () {
            if (User.isLoggedIn) {
                $scope.usernameMain = User.username;
                $scope.roleNameMain = User.roleName;
                $scope.isSender = User.isSender();
                $scope.isTransporter = User.isTransporter();
                $scope.isDriver = User.isDriver();
                $scope.isAdmin = User.isAdmin();
                return true;
            }
            $scope.usernameMain = "";
            $scope.roleNameMain = "";
            $scope.isSender = false;
            $scope.isTransporter = false;
            $scope.isAdmin = false;
            return false;
        };

        $scope.isLoggedAdmin = function () {
            return User.isAdmin();
        };

        $scope.logout = function () {
            User.logout().then(function () {
                console.log("Logout success");
                $state.go('login');
            }).catch(function () {
                console.log("Logout fail");
            })
        };

        $scope.ENlng = function () {
            $i18next.options.lng = 'EN';
            $i18next.options.resGetPath = '../locales/EN/translation.json';
        };
        $scope.CZlng = function () {
            $i18next.options.lng = 'CZ';
            $i18next.options.resGetPath = '../locales/CZ/translation.json';
        };

        $( window ).resize(function() {
            $scope.refreshFooter();
        });

        $scope.refreshFooter = function () {
            clearTimeout(this.renderDebouncer);
            this.renderDebouncer = setTimeout(function () {
                $scope.footerFix();
                $scope.formLabelsUpdate();
            }, 10);
        };

        // fix footer
        $scope.footerFix = function () {
            var win = window.innerHeight,
                $con = $('body').height(),
                $f = $('footer'),
                footerHeight = $f.height();

            $con += $f.css('position') === 'absolute' ? footerHeight : 0;
            if (win > $con) {
                $f.css({
                    position: 'absolute'
                });
            } else {
                $f.css({
                    position: 'relative'
                });
            }
        };

        // forms
        $scope.formLabels = function (name) {
            clearTimeout(this.formDebouncer);
            this.formDebouncer = setTimeout(function () {
                var $form = $("[name='" + name + "']"),
                    $icons,
                    $inputs,
                    $selects,
                    makeLabel = function (element) {
                        if ($(element).attr("data-label-moved")) return;
                        $(element).attr("data-label-moved", "true");
                        var inputType = $(element).attr('type');
                        if (inputType === "file" || inputType === "checkbox") {
                            return;
                        }
                        var labelElement = $("<div />").addClass("input-label").text($(element).attr("placeholder"));
                        labelElement.hide();
                        $(element).parents(".form-group").prepend(labelElement);
                        labelElement.fadeIn();
                    };
                if ($form.length > 0) {
                    $inputs = $form.find("input");
                    $icons = $form.find(".input-group-addon");
                    $selects = $form.find("select");
                    // standart inputs
                    $inputs.on("keydown", function () {
                        makeLabel(this);
                    });
                    // datepickers
                    $icons.on("click", function () {
                        makeLabel($(this).parents(".form-group").find("input"));
                    });
                    // selects
                    $selects.on("change", function () {
                        $(this).attr("placeholder", $($(this).find("option")[0]).text());
                        makeLabel(this);
                    });
                }
            }, 10);
        };

        $scope.formLabelsUpdate = function () {
            var labels = $(".input-label");

            labels.each(function (i, e) {
                $(e).text($($(e).parent().find("input")).attr("placeholder"));
            })
        }
    }
    ]);
