define(['ojs/ojcore','knockout', 'ojs/ojrouter', 'ojs/ojarraytabledatasource', 'ojs/ojmoduleanimations'],
        function (oj,ko) {
            function ControllerViewModel() {
                var self = this;

                // Save the theme so we can perform platform specific navigational animations
                var platform = oj.ThemeUtils.getThemeTargetPlatform();

                // Router setup
                self.router = oj.Router.rootInstance;

                self.router.configure({
                    'home': {label: 'Home', isDefault: true},
                    'resume': {label: 'Resume'},
                    'portfolio': {label: 'Portfolio'},
                    'myprofile': {label: 'My Profile'}
                });

                oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

                // Callback function that can return different animations based on application logic.
                function switcherCallback(context) {
                    if (platform === 'android')
                        return 'fade';
                    return null;
                }
                ;

                function mergeConfig(original) {
                    return $.extend(true, {}, original, {
                        'animation': oj.ModuleAnimations.switcher(switcherCallback)
                    });
                }

                self.moduleConfig = mergeConfig(self.router.moduleConfig);

                // Navigation setup
                var navData = [
                    {name: 'Home', id: 'home',
                        iconClass: 'oj-navigationlist-item-icon fas fa-home'}, //demo-icon-font-24 for large size
                    {name: 'Resume', id: 'resume',
                        iconClass: 'oj-navigationlist-item-icon fab fa-readme'},
                    {name: 'Portfolio', id: 'portfolio',
                        iconClass: 'oj-navigationlist-item-icon fas fa-briefcase'},
                    {name: 'My Profile', id: 'myprofile',
                        iconClass: 'oj-navigationlist-item-icon fas fa-user'}
                ];

                self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});

                // Header region that each view controls
                var headerModelFactory = {
                    createViewModel: function (params, valueAccessor) {
                        var model = {
                            createView: function () {
                                return Promise.resolve('');
                            },
                            handleBindingsApplied: function () {
                                // Adjust content padding after header bindings have been applied
                                self.adjustContentPadding();
                            }
                        };
                        return Promise.resolve(model);
                    }
                }
                self.viewHeaderConfig = ko.observable({'createViewFunction': 'createView', 'viewModelFactory': headerModelFactory});


                // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions. 
                // This method should be called whenever your fixed region height may change.  The application
                // can also adjust content paddings with css classes if the fixed region height is not changing between 
                // views.
                self.adjustContentPadding = function () {
                    var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
                    var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
                    var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

                    if (topElem) {
                        contentElem.style.paddingTop = topElem.offsetHeight + 'px';
                    }
                    if (bottomElem) {
                        contentElem.style.paddingBottom = bottomElem.offsetHeight + 'px';
                    }
                    // Add oj-complete marker class to signal that the content area can be unhidden.
                    // See the override.css file to see when the content area is hidden.
                    contentElem.classList.add('oj-complete');
                }
            }

            return new ControllerViewModel();
        }
);