'use strict';

/**
 * Author: Batu
 * Date: 2015/10/21
 */

app.controller('SiteAddController', function($scope, $rootScope, $state, $http, $timeout, countryGen, API_URL, regions, sitetypes){
  $scope.regions = regions;
  $scope.sitetypes = sitetypes;
  
  $scope.countries = countryGen.getCountryList();
  $scope.states = [];
  
	$("form").submit(function(){
		$scope.submitSite();
		return false;
	});
	$scope.submitSite = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/site/add?callback=JSON_CALLBACK",
			data: $scope.site,
			crossDomain : true,
		    xhrFields: {
		        withCredentials: true
		    }
		}).success(function(data, status, headers, cfg){
			if (data.status == 0){
				try{
					alert("Successfully Added");
				}catch(error){
				}
				
				$state.go('app.site-manager-site-list', {}, { reload: true });
			}else{
				try{
					alert(data.message);
				}catch(error){
				}
			}
			
			$scope.lock_form = false;
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.site = {};
		
		$scope.lock_form = false;
	}
	
	var adjustRegionsList = function(){
    $("#ddl_region").select2({
      placeholder: 'Select Region...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
	
	var adjustSitetypesList = function(){
    $("#ddl_sitetype").select2({
      placeholder: 'Select Site Type...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
	
	var adjustCountriesList = function(){
    $("#ddl_country").select2({
      placeholder: 'Select Country...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
	
	var adjustStatesList = function(){
    $("#ddl_state").select2({
      placeholder: 'Select State...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  $timeout(adjustCountriesList, 100); 
  $timeout(adjustStatesList, 100);
  $timeout(adjustRegionsList, 100); 
  $timeout(adjustSitetypesList, 100); 

	$scope.resetDefaults();
	
	$scope.$watch('site.country', function(newVal, oldVal){
	  if (newVal === oldVal) return; // on init
	  
	  $scope.state = "";
	  $scope.states = countryGen.getStateList($scope.site.country);
	});
}).
controller('SiteEditController', function($scope, $http, $state, $timeout, countryGen, API_URL, regions, sitetypes, data){
	if (!data || typeof data.status == "undefined" || Number(data.status) != 0){
		$state.go('app.site-manager-site-list', {}, { reload: true });
	}
	
	$scope.regions = regions;
  $scope.sitetypes = sitetypes;
  
  $scope.countries = countryGen.getCountryList();
  $scope.states = [];
  
  
  
	$scope.site = data.node;
	
	$scope.lock_form = false;

	$("form").submit(function(){
		$scope.submitSite();
		return false;
	});
	$scope.submitSite = function(){
		$scope.lock_form = true;
		
		$http({
			method: 'POST',
			dataType: 'jsonp',
			url: API_URL + "/site/edit/" + $scope.site.siteID + "?callback=JSON_CALLBACK",
			data: $scope.site,
			crossDomain : true,
		    xhrFields: {
		        withCredentials: true
		    }
		}).success(function(data, status, headers, cfg){
			if (data.status == 0){
				try{
					alert("Successfully Edited");
				}catch(error){
				}
			}else{
				try{
					alert(data.message);
				}catch(error){
				}
			}
			
			$state.go('app.site-manager-site-list', {}, { reload: true });
		})
	};
	
	$scope.resetDefaults = function(){
		$scope.site = {};
		
		$scope.lock_form = false;
	}
	
	var adjustRegionsList = function(){
    $("#ddl_region").select2({
      placeholder: 'Select Region...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  var adjustSitetypesList = function(){
    $("#ddl_sitetype").select2({
      placeholder: 'Select Site Type...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  var adjustCountriesList = function(){
    $("#ddl_country").select2({
      placeholder: 'Select Country...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  var adjustStatesList = function(){
    $("#ddl_state").select2({
      placeholder: 'Select State...',
      allowClear: true
    }).on('select2-open', function()
    {
      // Adding Custom Scrollbar
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  }
  
  $timeout(adjustCountriesList, 100); 
  $timeout(adjustStatesList, 100);
  $timeout(adjustRegionsList, 100); 
  $timeout(adjustSitetypesList, 100); 

  $scope.$watch('site.country', function(newVal, oldVal){
    if (newVal === oldVal) return; // on init
    
    $scope.state = "";
    $scope.states = countryGen.getStateList($scope.site.country);
  });
}).
controller('SiteListController', function($state, $scope, $http, countryGen, data, API_URL){
  $scope.data = data;
	
	$scope.deleteSite = function(site){
		var siteID = site.siteID;
		if (!siteID)
			return;
		if (confirm('Are you sure you want to delete?')) {
			$http({
				method: 'DELETE',
				dataType: 'jsonp',
				url: API_URL + "/site/" + siteID + "?callback=JSON_CALLBACK",
				crossDomain : true,
			    xhrFields: {
			        withCredentials: true
			    }
			}).success(function(data, status, headers, cfg){
				if (data.status == 0){
					//update the list
					site.deleted = true;
				}else{
					try{
						alert(data.message);
					}catch(error){
					}
				}
			}).error(function(data, status, headers, cfg){
				alert("Failed in Deleting Site");
			})
		} else {
		  // Do nothing!
		}
	}
	
	$scope.editSite = function(siteID){
		if (!siteID)
			return;
		$state.go('app.site-manager-edit-a-site', {siteID: siteID});
	}
	
	$scope.getCountryName = function(countryCode){
	  return countryGen.getCountryNameByCode(countryCode);
	}
	
	$scope.getStateName = function(countryCode, stateCode){
    return countryGen.getStateNameByCode(countryCode, stateCode);
  }
})