var PromiseFactory = {
    Promise: function (promises) {
        console.log(promises);
        return (new function () {

            var self = this;
            var _toDigest = [];
            var _busy = [];
            var _digesting = 0;
            var _args = {};
            promises = [].concat(promises);
            _digesting = promises.length;

            function digest() {
                var promise = promises.shift();
                if (!promise) {
                    if (_digesting == 0) {
                        if (_toDigest.length > 0) {
                            promises = [].concat(_toDigest.shift());
                            _digesting = promises.length;
                            digest();
                        }
                    }
                }
                else if (promise.resolve) {
                    promise.resolve(function (args) {
                        if (args) {
                            for (var k in args)
                                _args[k] = args[k];
                        }
                        _digesting--;
                        digest();
                    });
                    digest();
                }
                else if(promise.success)
                {
                    promise.success(function (args) {
                        if (args) {
                            for (var k in args)
                                _args[k] = args[k];
                        }
                        _digesting--;
                        digest();
                    });
                    digest();
                }
                else if (promise.complete) {
                    promise.complete(function (args) {
                        if (args) {
                            for (var k in args)
                                _args[k] = args[k];
                        }
                        _digesting--;
                        digest();
                    });
                    digest();
                }
                else if (promise.call) {
                    var response = promise(_args);
                    if (response && (response.resolve || response.call)) {
                        promises.unshift(response);
                        _digesting++;
                    }
                    else if (response instanceof Object) {
                        for (var k in response)
                            _args[k] = response[k];
                    }
                    _digesting--;
                    digest();
                }
            }

            this.resolve = function (callback) {
                self.then(function () {
                    callback(_args);
                });
                return self;
            };
            this.then = function (callback) {
                _toDigest.push([].concat(callback));
                digest();
                return self;
            }

            digest();

        });
    }
};