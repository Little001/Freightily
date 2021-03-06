var param = function(obj) {
		var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

		for(name in obj) {
		value = obj[name];

		if(value instanceof Array) {
			for(i=0; i<value.length; ++i) {
			subValue = value[i];
			fullSubName = name + '[' + i + ']';
			innerObj = {};
			innerObj[fullSubName] = subValue;
			query += param(innerObj) + '&';
			}
		}
		else if(value instanceof Object) {
			for(subName in value) {
			subValue = value[subName];
			fullSubName = name + '[' + subName + ']';
			innerObj = {};
			innerObj[fullSubName] = subValue;
			query += param(innerObj) + '&';
			}
		}
		else if(value !== undefined && value !== null)
			query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}

		return query.length ? query.substr(0, query.length - 1) : query;
  };

function getErrorKeyByCode(error) {
	var errorData = error.data,
		code;

	if (error.status === 401) {
        return 'errors.codes.unauthorized';
	}

	if (errorData && errorData.errorCode) {
        code = errorData.errorCode;
        return 'errors.codes.' + code;
	}
    return 'errors.codes.fatal';
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValueNumber(value) {
	var val = value.replace(/ /g,'');

	return $.isNumeric(val);
}

function getTokenFromStorage() {
	return {
        'Authorization': "Bearer " + window.localStorage.getItem("access_token")
    };
}

function getRefreshTokenFromStorage() {
    return window.localStorage.getItem("refresh_token")
}

function setTimeToNeedRefreshToken(expired_in) {
    var now = new Date(),
		hour = 3000; //10700

    console.log("expired_in", expired_in);
    now.setSeconds(now.getSeconds() + expired_in - hour);
    console.log("refresh_token_from", now);
    window.localStorage.setItem("time_refresh_token", now);
}

function needRestartToken() {
	var timeRefreshToken = window.localStorage.getItem("time_refresh_token");

	return timeRefreshToken && new Date(timeRefreshToken) < new Date();
}

function toggleDetail(detailElement) {
    var detail = detailElement.find(".auction-detail"),
        scrollY = window.scrollY,
		visible = !detail.is(":visible");

    detail.stop().slideToggle(200);
    window.scrollTo(0, scrollY);

    clearInterval(toggleInterval);
    toggleInterval = setInterval(function () {
        window.dispatchEvent(new Event('resize'));
    }, 33);
    setTimeout(function () {
        clearInterval(toggleInterval);
    }, 240);

    return visible;
}

function computePoint(items) {
    var firstItemAmount = items[0].amount,
        lastItemAmount = items[items.length - 1].amount,
        avg = (firstItemAmount - lastItemAmount) / items.length,
        value = lastItemAmount - avg,
        result = Math.floor(value/100)*100;

    return result <= 500 ? 0 : result;
}

function redirect($state, $stateParams) {
    $state.transitionTo($state.current.name, {
        sort: $stateParams.sort,
        order: $stateParams.order,
        page: $stateParams.page,
        minPrice: $stateParams.minPrice,
        maxPrice: $stateParams.maxPrice,
        type: $stateParams.type,
        expired: $stateParams.expired,
        address_from: $stateParams.address_from,
        address_to: $stateParams.address_to
    }, {
        reload: true
    });
}

var checkListAuctionRunning = false;
var checkFavouriteAuctionRunning = false;
var checkBidsAuctionRunning = false;
var checkDetailAuctionRunning = false;
var toggleInterval;