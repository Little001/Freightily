/**
 * User Service
 */
angular.module('appServices')
	.factory('User', ['$http', '$q', function ($http, $q) {
		'use strict';

		var User = {
			isLoggedIn: false,
			username: "",
			ID: "",
			role: "",
			roleName : "",
            hasNotPaidInvoice: false
		};

		//role:  1-sender 99-admin
		User.set = function (prop, value) {
			User[prop] = value;
		};

		User.setRole = function(role){
			switch(role){
				case 1: User.set('roleName', "User");
					break;
                case 99: User.set('roleName', "Admin");
                    break;
			}
		};
        User.isAdmin = function(){
            return User.role === 99;
        };

        User.isDriver = function(){
            return User.role === 2;
        };

        User.isPaid = function() {
            startLoading();
            return $q(function(resolve, reject) {
                $http({
                    method: 'GET',
                    headers: getTokenFromStorage(),
                    url: CONFIG.server.url+'company/checkNotPaidInvoices'
                }).then(function(response) {
                    User.set("hasNotPaidInvoice", response.data);
                    endLoading();
                    resolve();
                }).catch(function(error){
                    endLoading();
                    reject(error);
                })
            });
        };

		/* POST to REST api => Login */ 
		User.login = function(username, password){
			startLoading();
			var data = {
                userName: username,
                password: password,
                grant_type: "password"
			};
			return $q(function(resolve, reject) {
				$http({
					method: 'POST',
					data: param(data),
					url: CONFIG.server.url+'token'
				}).then(function(response) {
					var responseData = response.data;
					if (window.localStorage) {
						if(responseData && responseData.access_token){
							window.localStorage.setItem("access_token", responseData.access_token);
                            window.localStorage.setItem("refresh_token", responseData.refresh_token);
                            setTimeToNeedRefreshToken(responseData.expires_in);
						}
						else{
							throw "Server error";
						}						
					}
					User.set('isLoggedIn', true);
					User.set('username', responseData.username);
					User.set('role', Number(responseData.role));
					User.set('ID', Number(responseData.ID));
					User.setRole(Number(responseData.role));
					endLoading();
					resolve();
				}).catch(function(error){
					endLoading();
					reject(error);
				})
			});
    	};

		/* Refresh token */
        User.refreshToken = function() {
            var data = {
                refresh_token: getRefreshTokenFromStorage(),
                grant_type: "refresh_token"
            };

            return $q(function() {
                $http({
                    method: 'POST',
                    data: param(data),
                    url: CONFIG.server.url+'token',
                    headers: getTokenFromStorage()
                }).then(function(response) {
                    var responseData = response.data;
                    if (window.localStorage) {
                        if(responseData && responseData.access_token){
                            window.localStorage.setItem("access_token", responseData.access_token);
                            window.localStorage.setItem("refresh_token", responseData.refresh_token);
                            setTimeToNeedRefreshToken(responseData.expires_in);
                        }
                        else{
                            throw "Server error";
                        }
                    }
                    User.set('isLoggedIn', true);
                    User.set('username', responseData.username);
                    User.set('role', Number(responseData.role));
                    User.set('ID', Number(responseData.ID));
                    User.setRole(Number(responseData.role));
                })
            });
        };

		/* Logout */
		User.logout = function() {
			return $q(function(resolve) {
                User.set('isLoggedIn', false);
                window.localStorage.removeItem("access_token");
                window.localStorage.removeItem("refresh_token");
                window.localStorage.removeItem("time_refresh_token");

                resolve();
			});
		};

		/* POST to REST api => verify token */ 
		User.getUserForToken = function(){
			startLoading();
			return $q(function(resolve, reject) {
				$http({
					method: 'POST',
					url: CONFIG.server.url+'checkToken',
                    headers: getTokenFromStorage()
				}).then(function(response) {
                    var data = response.data;

					User.set('isLoggedIn', true);
					User.set('username', data.username);
					User.set('role', data.role);
					User.set('ID', data.ID);
					User.setRole(data.role);
					endLoading();
					resolve();
				}).catch(function(error){
					endLoading();
					reject(error);
				})
			});
		};

		/* POST to REST api => Registration user */
        User.registrationUser = function(data){
            startLoading();
            return $q(function(resolve, reject) {
                $http({
                    method: 'POST',
                    data: param(data),
                    url: CONFIG.server.url+'registration/user'
                }).then(function(response) {
                    endLoading();
                    resolve();
                }).catch(function(error){
                    endLoading();
                    reject(error);
                })
            });
        };

        /* POST to REST api => post code for activate account */
        User.activateAccount = function(activate_code) {
            var data = {
                activate_code: activate_code
            };
            startLoading();
            return $q(function(resolve, reject){
                $http({
                    method: 'POST',
                    data: param(data),
                    url: CONFIG.server.url+'registration/activate'
                }).then(function(response) {
                    endLoading();
                    resolve(response.data);
                }).catch(function(error){
                    endLoading();
                    reject(error);
                })
            });
        };

		/* POST to REST api => Add driver */
		User.AddUser = function(data){
			startLoading();
			return $q(function(resolve, reject) {
				$http({
					method: 'POST',
					data: param(data),
                    headers: getTokenFromStorage(),
					url: CONFIG.server.url+'registration/driver'
				}).then(function(response) {
					endLoading();
					resolve();
				}).catch(function(error){
					endLoading();
					reject(error);
				})
			});
		};

		/* POST to REST api => Set user vacation */
        User.SetVacation = function(data){
            startLoading();
            return $q(function(resolve, reject) {
                $http({
                    method: 'POST',
                    data: param(data),
                    headers: getTokenFromStorage(),
                    url: CONFIG.server.url+'company/vacation'
                }).then(function(response) {
                    endLoading();
                    resolve();
                }).catch(function(error){
                    endLoading();
                    reject(error);
                })
            });
        };

		/* DELETE to REST api => Delete user vacation */
        User.DeleteVacation = function(ID, date){
            startLoading();
            return $q(function(resolve, reject) {
                var parameters = "?";

                parameters += "id_user=" + ID;
                parameters += "&date=" + date;

                $http({
                    method: 'DELETE',
                    headers: getTokenFromStorage(),
                    url: CONFIG.server.url+'company/vacation'+parameters
                }).then(function(response) {
                    endLoading();
                    resolve();
                }).catch(function(error){
                    endLoading();
                    reject(error);
                })
            });
        };

        /* GET to REST api => get company */
		User.getCompany = function(data){
			startLoading();
			return $q(function(resolve, reject) {
				$http({
					method: 'GET',
					data: param(data),
                    headers: getTokenFromStorage(),
					url: CONFIG.server.url+'Account/company'
				}).then(function(response) {
					endLoading();
					resolve();
				}).catch(function(error){
					endLoading();
					reject(error);
				})
			});
		};

        /* GET to REST api => get users */
        User.GetUsers = function(){
            startLoading();
            return $q(function(resolve, reject) {
                $http({
                    method: 'GET',
                    headers: getTokenFromStorage(),
                    url: CONFIG.server.url+'admin/users'
                }).then(function(response) {
                    endLoading();
                    resolve(response.data);
                }).catch(function(error){
                    endLoading();
                    reject(error);
                })
            });
        };

		return User;
	}]
);
