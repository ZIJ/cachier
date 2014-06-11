(function(window, document) {
    'use strict';

    var options = {
        configScriptId: 'cachier-config',
        localStoragePrefix: 'cachier-'
    };

    var body = document.body || document.getElementsByTagName('body')[0];

    /**
     * @constructor
     */
    var Cachier = function() {
        var config = this.config = this.readConfig(options.configScriptId);
        var deps = config.dependencies;
        this.remainingDepsCount = 0;
        for (var key in deps) {
            if (deps.hasOwnProperty(key)) {
                this.resolve(key, deps[key]);
            }
        }
        this.checkStatus();
    };

    /**
     * Reads JSON configuration from script tag
     * @param scriptId
     * @returns {*}
     */
    Cachier.prototype.readConfig = function(scriptId) {
        var config = document.getElementById(scriptId);
        // TODO more robust text content extraction
        var json = config.text;
        return JSON.parse(json);
    };

    /**
     * Injects cached script or loads it
     * @param key
     * @param url
     */
    Cachier.prototype.resolve = function(key, url) {
        // TODO support multiple url fallbacks
        var fullKey = options.localStoragePrefix + key;
        var text = localStorage.getItem(fullKey);
        if (text) {
            this.injectScript(text);
        } else {
            this.loadScript(key, url);
        }
    };

    /**
     * Injects <script> node with given content
     * @param text
     */
    Cachier.prototype.injectScript = function(text) {
        // TODO think of using defer and/or async
        var script = document.createElement('script');
        script.text = text;
        body.appendChild(script);
    };

    /**
     * Loads script from url provided
     * @param key
     * @param url
     */
    Cachier.prototype.loadScript = function(key, url) {
        var cachier = this;
        var xhr = new XMLHttpRequest();
        // TODO use promises or at least something more robust than naive counter
        cachier.remainingDepsCount += 1;
        xhr.open( 'GET', url );
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                cachier.remainingDepsCount -= 1;
                cachier.injectScript(xhr.responseText);
                if (key) {
                    cachier.saveScript(key, xhr.responseText);
                    cachier.checkStatus();
                }
            }
            // TODO handle error
        };
        // TODO manual timeout
        xhr.send();
    };

    /**
     * Saves script to local storage
     * @param key
     * @param scriptNode
     */
    Cachier.prototype.saveScript = function(key, text) {
        var fullKey = options.localStoragePrefix + key;
        // TODO handle quota excess
        localStorage.setItem(fullKey, text);
    };


    /**
     * Loads main script if all dependencies are already loaded
     */
    Cachier.prototype.checkStatus = function() {
        if (this.remainingDepsCount <= 0) {
            this.loadScript(null, this.config.main);
        }
    };

    /**
     * Removes all cached scripts from localStorage
     */
    Cachier.prototype.reset = function() {
        for (var key in localStorage ) {
            if (localStorage.hasOwnProperty(key) && key.indexOf(options.localStoragePrefix) === 0 ) {
                localStorage.removeItem(key);
            }
        }
    };

    window.cachier = new Cachier();

})(window, document);