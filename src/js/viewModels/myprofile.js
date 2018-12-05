define(['ojs/ojcore', 'knockout', 'jquery', 'appController'],
        function (oj, ko, $, app) {

            function MyProflieViewModel() {
                var self = this;

                this.handleAttached = function () {
                    var headerModelFactory = {
                        createViewModel: function (params, valueAccessor) {
                            var model = {
                                router: app.router,
                                settingsCallback: function () {
                                    //self.pageContent('Page updated by settings button.');
                                },
                                handleBindingsApplied: function () {
                                    // Adjust content padding after header bindings are applied
                                    app.adjustContentPadding();
                                }
                            };
                            return Promise.resolve(model);
                        }
                    }
                    app.viewHeaderConfig({'viewName': 'myProflieHeader', 'viewModelFactory': headerModelFactory});
                };

            }

            return new MyProflieViewModel();
        }
);