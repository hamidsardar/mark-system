'use strict';

var app = angular.module('xenon-app', [
	'ngCookies',

	'ui.router',
	'ui.bootstrap',

	'oc.lazyLoad',

	'xenon.controllers',
	'xenon.directives',
	'xenon.factory',
	'xenon.services',

	// Added in v1.3
	'FBAngular'
]);

app.run(function()
{
	// Page Loading Overlay
	public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

	jQuery(window).load(function()
	{
		public_vars.$pageLoadingOverlay.addClass('loaded');
	})
});


app.config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, ASSETS){

	$urlRouterProvider.otherwise('/app/dashboard');

	$stateProvider.
		// Main Layout Structure
		state('app', {
			abstract: true,
			url: '/app',
			templateUrl: appHelper.templatePath('layout/app-body'),
			controller: function($rootScope){
				$rootScope.isLoginPage        = false;
				$rootScope.isLightLoginPage   = false;
				$rootScope.isLockscreenPage   = false;
				$rootScope.isMainPage         = true;
			}
		}).

		// Dashboards
		state('app.dashboard', {
			url: '/dashboard',
			templateUrl: appHelper.templatePath('dashboard'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
						ASSETS.extra.toastr,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.profile', {
			url: '/profile',
			templateUrl: appHelper.templatePath('profile'),
			resolve: {
				jqui: function($ocLazyLoad){
					return $ocLazyLoad.load({
						files: ASSETS.core.jQueryUI
					});
				},
				select2: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.select2,
					]);
				},
				selectboxit: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.selectboxit,
					]);
				},
				tagsinput: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.tagsinput,
					]);
				},
				multiSelect: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.multiSelect,
					]);
				},
				typeahead: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.typeahead,
					]);
				},
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
					]);
				},
				timepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.timepicker,
					]);
				},
				daterangepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.moment,
						ASSETS.forms.daterangepicker,
					]);
				},
				colorpicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.colorpicker,
					]);
				},
			}
		}).
		// Dashboards
		state('app.dashboard-variant-1', {
			url: '/dashboard-variant-1',
			templateUrl: appHelper.templatePath('dashboards/variant-1'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
						ASSETS.extra.toastr,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.dashboard-variant-2', {
			url: '/dashboard-variant-2',
			templateUrl: appHelper.templatePath('dashboards/variant-2'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.dashboard-variant-3', {
			url: '/dashboard-variant-3',
			templateUrl: appHelper.templatePath('dashboards/variant-3'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
						ASSETS.maps.vectorMaps,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.dashboard-variant-4', {
			url: '/dashboard-variant-4',
			templateUrl: appHelper.templatePath('dashboards/variant-4'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.icons.meteocons,
						ASSETS.maps.vectorMaps,
					]);
				}
			}
		}).
		state('app.dashboard-variant-5', {
			url: '/dashboard-variant-5',
			templateUrl: appHelper.templatePath('dashboards/variant-5'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.icons.meteocons,
						ASSETS.maps.vectorMaps,
					]);
				}
			}
		}).
		// Update Highlights
		state('app.update-highlights', {
			url: '/update-highlights',
			templateUrl: appHelper.templatePath('update-highlights'),
		}).

		// Layouts
		state('app.layout-and-skins', {
			url: '/layout-and-skins',
			templateUrl: appHelper.templatePath('layout-and-skins'),
		}).

		// UI Elements
		state('app.ui-panels', {
			url: '/ui-panels',
			templateUrl: appHelper.templatePath('ui/panels'),
		}).
		state('app.ui-buttons', {
			url: '/ui-buttons',
			templateUrl: appHelper.templatePath('ui/buttons')
		}).
		state('app.ui-tabs-accordions', {
			url: '/ui-tabs-accordions',
			templateUrl: appHelper.templatePath('ui/tabs-accordions')
		}).
		state('app.ui-modals', {
			url: '/ui-modals',
			templateUrl: appHelper.templatePath('ui/modals'),
			controller: 'UIModalsCtrl'
		}).
		state('app.ui-breadcrumbs', {
			url: '/ui-breadcrumbs',
			templateUrl: appHelper.templatePath('ui/breadcrumbs')
		}).
		state('app.ui-blockquotes', {
			url: '/ui-blockquotes',
			templateUrl: appHelper.templatePath('ui/blockquotes')
		}).
		state('app.ui-progress-bars', {
			url: '/ui-progress-bars',
			templateUrl: appHelper.templatePath('ui/progress-bars')
		}).
		state('app.ui-navbars', {
			url: '/ui-navbars',
			templateUrl: appHelper.templatePath('ui/navbars')
		}).
		state('app.ui-alerts', {
			url: '/ui-alerts',
			templateUrl: appHelper.templatePath('ui/alerts')
		}).
		state('app.ui-pagination', {
			url: '/ui-pagination',
			templateUrl: appHelper.templatePath('ui/pagination')
		}).
		state('app.ui-typography', {
			url: '/ui-typography',
			templateUrl: appHelper.templatePath('ui/typography')
		}).
		state('app.ui-other-elements', {
			url: '/ui-other-elements',
			templateUrl: appHelper.templatePath('ui/other-elements')
		}).

		// Widgets
		state('app.widgets', {
			url: '/widgets',
			templateUrl: appHelper.templatePath('widgets'),
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.maps.vectorMaps,
						ASSETS.icons.meteocons
					]);
				}
			}
		}).

		// Mailbox
		state('app.mailbox-inbox', {
			url: '/mailbox-inbox',
			templateUrl: appHelper.templatePath('mailbox/inbox'),
		}).
		state('app.mailbox-compose', {
			url: '/mailbox-compose',
			templateUrl: appHelper.templatePath('mailbox/compose'),
			resolve: {
				bootstrap: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.bootstrap,
					]);
				},
				bootstrapWysihtml5: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.bootstrapWysihtml5,
					]);
				},
			}
		}).
		state('app.mailbox-message', {
			url: '/mailbox-message',
			templateUrl: appHelper.templatePath('mailbox/message'),
		}).

		// Tables
		state('app.tables-basic', {
			url: '/tables-basic',
			templateUrl: appHelper.templatePath('tables/basic'),
		}).
		state('app.tables-responsive', {
			url: '/tables-responsive',
			templateUrl: appHelper.templatePath('tables/responsive'),
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.rwd,
					]);
				}
			}
		}).
		state('app.tables-datatables', {
			url: '/tables-datatables',
			templateUrl: appHelper.templatePath('tables/datatables'),
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.datatables,
					]);
				},
			}
		}).
		state('app.reports-current-inventory', {
			url: '/reports-current-inventory',
			templateUrl: appHelper.templatePath('reports/current-inventory'),
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.datatables,
					]);
				},
			}
		}).
		state('app.user-manager-user-list', {
			url: '/user-manager-user-list',
			templateUrl: appHelper.templatePath('user-manager/user-list'),
			resolve: {
				deps: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.tables.datatables,
					]);
				},
			}
		}).
		state('app.user-manager-add-a-user', {
			url: '/user-manager-add-a-user',
			templateUrl: appHelper.templatePath('user-manager/user-add'),
			resolve: {
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
						ASSETS.forms.multiSelect,
						ASSETS.forms.select2,
					]);
				},
				//sssss
			}
		}).
		// Forms
		state('app.forms-native', {
			url: '/forms-native',
			templateUrl: appHelper.templatePath('forms/native-elements'),
		}).
		state('app.forms-advanced', {
			url: '/forms-advanced',
			templateUrl: appHelper.templatePath('forms/advanced-plugins'),
			resolve: {
				jqui: function($ocLazyLoad){
					return $ocLazyLoad.load({
						files: ASSETS.core.jQueryUI
					});
				},
				select2: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.select2,
					]);
				},
				selectboxit: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.selectboxit,
					]);
				},
				tagsinput: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.tagsinput,
					]);
				},
				multiSelect: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.multiSelect,
					]);
				},
				typeahead: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.typeahead,
					]);
				},
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
					]);
				},
				timepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.timepicker,
					]);
				},
				daterangepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.moment,
						ASSETS.forms.daterangepicker,
					]);
				},
				colorpicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.colorpicker,
					]);
				},
			}
		}).
		state('app.forms-wizard', {
			url: '/forms-wizard',
			templateUrl: appHelper.templatePath('forms/form-wizard'),
			resolve: {
				fwDependencies: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.bootstrap,
						ASSETS.core.jQueryUI,
						ASSETS.forms.jQueryValidate,
						ASSETS.forms.inputmask,
						ASSETS.forms.multiSelect,
						ASSETS.forms.datepicker,
						ASSETS.forms.selectboxit,
						ASSETS.forms.formWizard,
					]);
				},
				formWizard: function($ocLazyLoad){
					return $ocLazyLoad.load([
					]);
				},
			},
		}).
		state('app.forms-validation', {
			url: '/forms-validation',
			templateUrl: appHelper.templatePath('forms/form-validation'),
			resolve: {
				jQueryValidate: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
					]);
				},
			},
		}).
		state('app.forms-input-masks', {
			url: '/forms-input-masks',
			templateUrl: appHelper.templatePath('forms/input-masks'),
			resolve: {
				inputmask: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.inputmask,
					]);
				},
			},
		}).
		state('app.forms-file-upload', {
			url: '/forms-file-upload',
			templateUrl: appHelper.templatePath('forms/file-upload'),
			resolve: {
				dropzone: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.dropzone,
					]);
				},
			}
		}).
		state('app.forms-wysiwyg', {
			url: '/forms-wysiwyg',
			templateUrl: appHelper.templatePath('forms/wysiwyg'),
			resolve: {
				bootstrap: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.bootstrap,
					]);
				},
				bootstrapWysihtml5: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.bootstrapWysihtml5,
					]);
				},
				uikit: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.uikit.base,
						ASSETS.uikit.codemirror,
						ASSETS.uikit.marked,
					]);
				},
				uikitHtmlEditor: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.uikit.htmleditor,
					]);
				},
			}
		}).
		state('app.forms-sliders', {
			url: '/forms-sliders',
			templateUrl: appHelper.templatePath('forms/sliders'),
			resolve: {
				sliders: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.jQueryUI,
					]);
				},
			},
		}).
		state('app.forms-icheck', {
			url: '/forms-icheck',
			templateUrl: appHelper.templatePath('forms/icheck'),
			resolve: {
				iCheck: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.icheck,
					]);
				},
			}
		}).

		// Extra
		state('app.extra-icons-font-awesome', {
			url: '/extra-icons-font-awesome',
			templateUrl: appHelper.templatePath('extra/icons-font-awesome'),
			resolve: {
				fontAwesome: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.jQueryUI,
						ASSETS.extra.tocify,
					]);
				},
			}
		}).
		state('app.extra-icons-linecons', {
			url: '/extra-icons-linecons',
			templateUrl: appHelper.templatePath('extra/icons-linecons'),
			resolve: {
				linecons: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.jQueryUI,
						ASSETS.extra.tocify,
					]);
				},
			}
		}).
		state('app.extra-icons-elusive', {
			url: '/extra-icons-elusive',
			templateUrl: appHelper.templatePath('extra/icons-elusive'),
			resolve: {
				elusive: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.jQueryUI,
						ASSETS.extra.tocify,
						ASSETS.icons.elusive,
					]);
				},
			}
		}).
		state('app.extra-icons-meteocons', {
			url: '/extra-icons-meteocons',
			templateUrl: appHelper.templatePath('extra/icons-meteocons'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.jQueryUI,
						ASSETS.extra.tocify,
						ASSETS.icons.meteocons,
					]);
				},
			}
		}).
		state('app.extra-profile', {
			url: '/extra-profile',
			templateUrl: appHelper.templatePath('extra/profile'),
			resolve: {
				profile: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.googleMapsLoader,
						ASSETS.icons.elusive,
					]);
				},
			}
		}).
		state('app.extra-timeline', {
			url: '/extra-timeline',
			templateUrl: appHelper.templatePath('extra/timeline'),
			resolve: {
				timeline: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.googleMapsLoader,
					]);
				},
			}
		}).
		state('app.extra-timeline-centered', {
			url: '/extra-timeline-centered',
			templateUrl: appHelper.templatePath('extra/timeline-centered'),
			resolve: {
				elusive: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.googleMapsLoader,
					]);
				},
			}
		}).
		state('app.extra-calendar', {
			url: '/extra-calendar',
			templateUrl: appHelper.templatePath('extra/calendar'),
			resolve: {
				fullCalendar: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.jQueryUI,
						ASSETS.core.moment,
						ASSETS.extra.fullCalendar,
					]);
				},
			}
		}).
		state('app.extra-gallery', {
			url: '/extra-gallery',
			templateUrl: appHelper.templatePath('extra/gallery'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.jQueryUI,
					]);
				},
			}
		}).
		state('app.extra-notes', {
			url: '/extra-notes',
			templateUrl: appHelper.templatePath('extra/notes'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.xenonLib.notes,
					]);
				},
			}
		}).
		state('app.extra-image-crop', {
			url: '/extra-image-crop',
			templateUrl: appHelper.templatePath('extra/image-cropper'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.extra.cropper,
					]);
				},
			}
		}).
		state('app.extra-portlets', {
			url: '/extra-portlets',
			templateUrl: appHelper.templatePath('extra/portlets'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.jQueryUI,
					]);
				},
			}
		}).
		state('app.extra-search', {
			url: '/extra-search',
			templateUrl: appHelper.templatePath('extra/search')
		}).
		state('app.extra-invoice', {
			url: '/extra-invoice',
			templateUrl: appHelper.templatePath('extra/invoice')
		}).
		state('app.extra-page-404', {
			url: '/extra-page-404',
			templateUrl: appHelper.templatePath('extra/page-404')
		}).
		state('app.extra-tocify', {
			url: '/extra-tocify',
			templateUrl: appHelper.templatePath('extra/tocify'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.jQueryUI,
						ASSETS.extra.tocify,
					]);
				},
			}
		}).
		state('app.extra-loading-progress', {
			url: '/extra-loading-progress',
			templateUrl: appHelper.templatePath('extra/loading-progress')
		}).
		state('app.extra-notifications', {
			url: '/extra-notifications',
			templateUrl: appHelper.templatePath('extra/notifications'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.extra.toastr,
					]);
				},
			}
		}).
		state('app.extra-nestable-lists', {
			url: '/extra-nestable-lists',
			templateUrl: appHelper.templatePath('extra/nestable-lists'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.uikit.base,
						ASSETS.uikit.nestable,
					]);
				},
			}
		}).
		state('app.extra-scrollable', {
			url: '/extra-scrollable',
			templateUrl: appHelper.templatePath('extra/scrollable')
		}).
		state('app.extra-blank-page', {
			url: '/extra-blank-page',
			templateUrl: appHelper.templatePath('extra/blank-page')
		}).
		state('app.extra-maps-google', {
			url: '/extra-maps-google',
			templateUrl: appHelper.templatePath('extra/maps-google'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.googleMapsLoader,
					]);
				},
			}
		}).
		state('app.extra-maps-advanced', {
			url: '/extra-maps-advanced',
			templateUrl: appHelper.templatePath('extra/maps-advanced'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.core.googleMapsLoader,
					]);
				},
			}
		}).
		state('app.extra-maps-vector', {
			url: '/extra-maps-vector',
			templateUrl: appHelper.templatePath('extra/maps-vector'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.maps.vectorMaps,
					]);
				},
			}
		}).

		// Members
		state('app.extra-members-list', {
			url: '/extra-members-list',
			templateUrl: appHelper.templatePath('extra/members-list')
		}).
		state('app.extra-members-add', {
			url: '/extra-members-add',
			templateUrl: appHelper.templatePath('extra/members-add'),
			resolve: {
				datepicker: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.datepicker,
						ASSETS.forms.multiSelect,
						ASSETS.forms.select2,
					]);
				},
				//sssss
			}
		}).

		// Charts
		state('app.charts-variants', {
			url: '/charts-variants',
			templateUrl: appHelper.templatePath('charts/bars'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.charts-range-selector', {
			url: '/charts-range-selector',
			templateUrl: appHelper.templatePath('charts/range'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.charts-sparklines', {
			url: '/charts-sparklines',
			templateUrl: appHelper.templatePath('charts/sparklines'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.charts-gauges', {
			url: '/charts-gauges',
			templateUrl: appHelper.templatePath('charts/gauges'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.charts-bar-gauges', {
			url: '/charts-bar-gauges',
			templateUrl: appHelper.templatePath('charts/bar-gauges'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.charts-linear-gauges', {
			url: '/charts-linear-gauges',
			templateUrl: appHelper.templatePath('charts/gauges-linear'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
					]);
				},
			}
		}).
		state('app.charts-map-charts', {
			url: '/charts-map-charts',
			templateUrl: appHelper.templatePath('charts/map'),
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxGlobalize,
					]);
				},
				dxCharts: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.charts.dxCharts,
						ASSETS.charts.dxVMWorld,
					]);
				},
			}
		}).

		// Logins and Lockscreen
		state('login', {
			url: '/login',
			templateUrl: appHelper.templatePath('login'),
			controller: 'LoginCtrl',
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
						ASSETS.extra.toastr,
					]);
				},
			}
		}).
		state('login-light', {
			url: '/login-light',
			templateUrl: appHelper.templatePath('login-light'),
			controller: 'LoginLightCtrl',
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
					]);
				},
			}
		}).
		state('lockscreen', {
			url: '/lockscreen',
			templateUrl: appHelper.templatePath('lockscreen'),
			controller: 'LockscreenCtrl',
			resolve: {
				resources: function($ocLazyLoad){
					return $ocLazyLoad.load([
						ASSETS.forms.jQueryValidate,
						ASSETS.extra.toastr,
					]);
				},
			}
		});
});


app.constant('ASSETS', {
	'core': {
		'bootstrap': appHelper.assetPath('js/bootstrap.min.js'), // Some plugins which do not support angular needs this

		'jQueryUI': [
			appHelper.assetPath('js/jquery-ui/jquery-ui.min.js'),
			appHelper.assetPath('js/jquery-ui/jquery-ui.structure.min.css'),
		],

		'moment': appHelper.assetPath('js/moment.min.js'),

		'googleMapsLoader': appHelper.assetPath('app/js/angular-google-maps/load-google-maps.js')
	},

	'charts': {

		'dxGlobalize': appHelper.assetPath('js/devexpress-web-14.1/js/globalize.min.js'),
		'dxCharts': appHelper.assetPath('js/devexpress-web-14.1/js/dx.chartjs.js'),
		'dxVMWorld': appHelper.assetPath('js/devexpress-web-14.1/js/vectormap-data/world.js'),
	},

	'xenonLib': {
		notes: appHelper.assetPath('js/xenon-notes.js'),
	},

	'maps': {

		'vectorMaps': [
			appHelper.assetPath('js/jvectormap/jquery-jvectormap-1.2.2.min.js'),
			appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-world-mill-en.js'),
			appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-it-mill-en.js'),
		],
	},

	'icons': {
		'meteocons': appHelper.assetPath('css/fonts/meteocons/css/meteocons.css'),
		'elusive': appHelper.assetPath('css/fonts/elusive/css/elusive.css'),
	},

	'tables': {
		'rwd': appHelper.assetPath('js/rwd-table/js/rwd-table.min.js'),

		'datatables': [
			appHelper.assetPath('js/datatables/dataTables.bootstrap.css'),
			appHelper.assetPath('js/datatables/datatables-angular.js'),
		],

	},

	'forms': {

		'select2': [
			appHelper.assetPath('js/select2/select2.css'),
			appHelper.assetPath('js/select2/select2-bootstrap.css'),

			appHelper.assetPath('js/select2/select2.min.js'),
		],

		'daterangepicker': [
			appHelper.assetPath('js/daterangepicker/daterangepicker-bs3.css'),
			appHelper.assetPath('js/daterangepicker/daterangepicker.js'),
		],

		'colorpicker': appHelper.assetPath('js/colorpicker/bootstrap-colorpicker.min.js'),

		'selectboxit': appHelper.assetPath('js/selectboxit/jquery.selectBoxIt.js'),

		'tagsinput': appHelper.assetPath('js/tagsinput/bootstrap-tagsinput.min.js'),

		'datepicker': appHelper.assetPath('js/datepicker/bootstrap-datepicker.js'),

		'timepicker': appHelper.assetPath('js/timepicker/bootstrap-timepicker.min.js'),

		'inputmask': appHelper.assetPath('js/inputmask/jquery.inputmask.bundle.js'),

		'formWizard': appHelper.assetPath('js/formwizard/jquery.bootstrap.wizard.min.js'),

		'jQueryValidate': appHelper.assetPath('js/jquery-validate/jquery.validate.min.js'),

		'dropzone': [
			appHelper.assetPath('js/dropzone/css/dropzone.css'),
			appHelper.assetPath('js/dropzone/dropzone.min.js'),
		],

		'typeahead': [
			appHelper.assetPath('js/typeahead.bundle.js'),
			appHelper.assetPath('js/handlebars.min.js'),
		],

		'multiSelect': [
			appHelper.assetPath('js/multiselect/css/multi-select.css'),
			appHelper.assetPath('js/multiselect/js/jquery.multi-select.js'),
		],

		'icheck': [
			appHelper.assetPath('js/icheck/skins/all.css'),
			appHelper.assetPath('js/icheck/icheck.min.js'),
		],

		'bootstrapWysihtml5': [
			appHelper.assetPath('js/wysihtml5/src/bootstrap-wysihtml5.css'),
			appHelper.assetPath('js/wysihtml5/wysihtml5-angular.js')
		],
	},

	'uikit': {
		'base': [
			appHelper.assetPath('js/uikit/uikit.css'),
			appHelper.assetPath('js/uikit/css/addons/uikit.almost-flat.addons.min.css'),
			appHelper.assetPath('js/uikit/js/uikit.min.js'),
		],

		'codemirror': [
			appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.js'),
			appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.css'),
		],

		'marked': appHelper.assetPath('js/uikit/vendor/marked.js'),
		'htmleditor': appHelper.assetPath('js/uikit/js/addons/htmleditor.min.js'),
		'nestable': appHelper.assetPath('js/uikit/js/addons/nestable.min.js'),
	},

	'extra': {
		'tocify': appHelper.assetPath('js/tocify/jquery.tocify.min.js'),

		'toastr': appHelper.assetPath('js/toastr/toastr.min.js'),

		'fullCalendar': [
			appHelper.assetPath('js/fullcalendar/fullcalendar.min.css'),
			appHelper.assetPath('js/fullcalendar/fullcalendar.min.js'),
		],

		'cropper': [
			appHelper.assetPath('js/cropper/cropper.min.js'),
			appHelper.assetPath('js/cropper/cropper.min.css'),
		]
	}
});