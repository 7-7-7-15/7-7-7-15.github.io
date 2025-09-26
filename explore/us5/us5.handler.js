if (!self.__us5) {
    __us5Hook(self, self.__us5$config, self.__us5$config.bare);
};

async function __us5Hook(window, config = {}, bare = '/bare/') {
    if ('__us5' in window && window.__us5 instanceof Ultraviolet) return false;

    if (window.document && !!window.window) {
        window.document.querySelectorAll("script[__us5-script]").forEach(node => node.remove())
    };

    const worker = !window.window;
    const master = '__us5';
    const methodPrefix = '__us5$';
    const __us5 = new Ultraviolet({
        ...config,
        window,
    });

    if (typeof config.construct === 'function') {
        config.construct(__us5, worker ? 'worker' : 'window');
    };

    const { client } = __us5;
    const {
        HTMLMediaElement,
        HTMLScriptElement,
        HTMLAudioElement,
        HTMLVideoElement,
        HTMLInputElement,
        HTMLEmbedElement,
        HTMLTrackElement,
        HTMLAnchorElement,
        HTMLIFrameElement,
        HTMLAreaElement,
        HTMLLinkElement,
        HTMLBaseElement,
        HTMLFormElement,
        HTMLImageElement,
        HTMLSourceElement,
    } = window;

    client.nativeMethods.defineProperty(window, '__us5', {
        value: __us5,
        enumerable: false,
    });


    __us5.meta.origin = location.origin;
    __us5.location = client.location.emulate(
        (href) => {
            if (href === 'about:srcdoc') return new URL(href);
            if (href.startsWith('blob:')) href = href.slice('blob:'.length);
            return new URL(__us5.sourceUrl(href));
        },
        (href) => {
            return __us5.rewriteUrl(href);
        },
    );

    __us5.cookieStr = window.__us5$cookies || '';
    __us5.meta.url = __us5.location;
    __us5.domain = __us5.meta.url.host;
    __us5.blobUrls = new window.Map();
    __us5.referrer = '';
    __us5.cookies = [];
    __us5.localStorageObj = {};
    __us5.sessionStorageObj = {};

    try {
        __us5.bare = new URL(bare, window.location.href);
    } catch(e) {
        __us5.bare = window.parent.__us5.bare;
    };

    if (__us5.location.href === 'about:srcdoc') {
        __us5.meta = window.parent.__us5.meta;
    };

    if (window.EventTarget) {
        __us5.addEventListener = window.EventTarget.prototype.addEventListener;
        __us5.removeListener = window.EventTarget.prototype.removeListener;
        __us5.dispatchEvent = window.EventTarget.prototype.dispatchEvent;
    };

    // Storage wrappers
    client.nativeMethods.defineProperty(client.storage.storeProto, '__us5$storageObj', {
        get() {
            if (this === client.storage.sessionStorage) return __us5.sessionStorageObj;
            if (this === client.storage.localStorage) return __us5.localStorageObj;
        },
        enumerable: false,
    });

    if (window.localStorage) {
        for (const key in window.localStorage) {
            if (key.startsWith(methodPrefix + __us5.location.origin + '@')) {
                __us5.localStorageObj[key.slice((methodPrefix + __us5.location.origin + '@').length)] = window.localStorage.getItem(key);
            };
        };

        __us5.lsWrap = client.storage.emulate(client.storage.localStorage, __us5.localStorageObj);
    };

    if (window.sessionStorage) {
        for (const key in window.sessionStorage) {
            if (key.startsWith(methodPrefix + __us5.location.origin + '@')) {
                __us5.sessionStorageObj[key.slice((methodPrefix + __us5.location.origin + '@').length)] = window.sessionStorage.getItem(key);
            };
        };

        __us5.ssWrap = client.storage.emulate(client.storage.sessionStorage, __us5.sessionStorageObj);
    };



    let rawBase = window.document ? client.node.baseURI.get.call(window.document) : window.location.href;
    let base = __us5.sourceUrl(rawBase);

    client.nativeMethods.defineProperty(__us5.meta, 'base', {
        get() {
            if (!window.document) return __us5.meta.url.href;

            if (client.node.baseURI.get.call(window.document) !== rawBase) {
                rawBase = client.node.baseURI.get.call(window.document);
                base = __us5.sourceUrl(rawBase);
            };

            return base;
        },
    });


    __us5.methods = {
        setSource: methodPrefix + 'setSource',
        source: methodPrefix + 'source',
        location: methodPrefix + 'location',
        function: methodPrefix + 'function',
        string: methodPrefix + 'string',
        eval: methodPrefix + 'eval',
        parent: methodPrefix + 'parent',
        top: methodPrefix + 'top',
    };

    __us5.filterKeys = [
        master,
        __us5.methods.setSource,
        __us5.methods.source,
        __us5.methods.location,
        __us5.methods.function,
        __us5.methods.string,
        __us5.methods.eval,
        __us5.methods.parent,
        __us5.methods.top,
        methodPrefix + 'protocol',
        methodPrefix + 'storageObj',
        methodPrefix + 'url',
        methodPrefix + 'modifiedStyle',
        methodPrefix + 'config',
        methodPrefix + 'dispatched',
        'Ultraviolet',
        '__us5Hook',
    ];


    client.on('wrap', (target, wrapped) => {
        client.nativeMethods.defineProperty(wrapped, 'name', client.nativeMethods.getOwnPropertyDescriptor(target, 'name'));
        client.nativeMethods.defineProperty(wrapped, 'length', client.nativeMethods.getOwnPropertyDescriptor(target, 'length'));

        client.nativeMethods.defineProperty(wrapped, __us5.methods.string, {
            enumerable: false,
            value: client.nativeMethods.fnToString.call(target),
        });

        client.nativeMethods.defineProperty(wrapped, __us5.methods.function, {
            enumerable: false,
            value: target,
        });
    });

    client.fetch.on('request', event => {
        event.data.input = __us5.rewriteUrl(event.data.input);
    });

    client.fetch.on('requestUrl', event => {
        event.data.value = __us5.sourceUrl(event.data.value);
    });

    client.fetch.on('responseUrl', event => {
        event.data.value = __us5.sourceUrl(event.data.value);
    });

    // XMLHttpRequest
    client.xhr.on('open', event => {
        event.data.input = __us5.rewriteUrl(event.data.input);
    });

    client.xhr.on('responseUrl', event => {
        event.data.value = __us5.sourceUrl(event.data.value);
    });


    // Workers
    client.workers.on('worker', event => {
        event.data.url = __us5.rewriteUrl(event.data.url);
    });

    client.workers.on('addModule', event => {
        event.data.url = __us5.rewriteUrl(event.data.url);
    });

    client.workers.on('importScripts', event => {
        for (const i in event.data.scripts) {
            event.data.scripts[i] = __us5.rewriteUrl(event.data.scripts[i]);
        };
    });

    client.workers.on('postMessage', event => {
        let to = event.data.origin;

        event.data.origin = '*';
        event.data.message = {
            __data: event.data.message,
            __origin: __us5.meta.url.origin,
            __to: to,
        };
    });

    // Navigator
    client.navigator.on('sendBeacon', event => {
        event.data.url = __us5.rewriteUrl(event.data.url);
    });

    // Cookies
    client.document.on('getCookie', event => {
        event.data.value = __us5.cookieStr;
    });

    client.document.on('setCookie', event => {
        Promise.resolve(__us5.cookie.setCookies(event.data.value, __us5.db, __us5.meta)).then(() => {
            __us5.cookie.db().then(db => {
                __us5.cookie.getCookies(db).then(cookies => {
                    __us5.cookieStr = __us5.cookie.serialize(cookies, __us5.meta, true);
                });
            });
        });
        const cookie = __us5.cookie.setCookie(event.data.value)[0];

        if (!cookie.path) cookie.path = '/';
        if (!cookie.domain) cookie.domain = __us5.meta.url.hostname;

        if (__us5.cookie.validateCookie(cookie, __us5.meta, true)) {
            if (__us5.cookieStr.length) __us5.cookieStr += '; ';
            __us5.cookieStr += `${cookie.name}=${cookie.value}`;
        };

        event.respondWith(event.data.value);
    });

    // HTML
    client.element.on('setInnerHTML', event => {
        switch (event.that.tagName) {
            case 'SCRIPT':
                event.data.value = __us5.js.rewrite(event.data.value);
                break;
            case 'STYLE':
                event.data.value = __us5.rewriteCSS(event.data.value);
                break;
            default:
                event.data.value = __us5.rewriteHtml(event.data.value);
        };
    });

    client.element.on('getInnerHTML', event => {
        switch (event.that.tagName) {
            case 'SCRIPT':
                event.data.value = __us5.js.source(event.data.value);
                break;
            default:
                event.data.value = __us5.sourceHtml(event.data.value);
        };
    });

    client.element.on('setOuterHTML', event => {
        event.data.value = __us5.rewriteHtml(event.data.value, { document: event.that.tagName === 'HTML' });
    });

    client.element.on('getOuterHTML', event => {
        switch (event.that.tagName) {
            case 'HEAD':
                event.data.value = __us5.sourceHtml(
                    event.data.value.replace(/<head(.*)>(.*)<\/head>/s, '<op-head$1>$2</op-head>')
                ).replace(/<op-head(.*)>(.*)<\/op-head>/s, '<head$1>$2</head>');
                break;
            case 'BODY':
                event.data.value = __us5.sourceHtml(
                    event.data.value.replace(/<body(.*)>(.*)<\/body>/s, '<op-body$1>$2</op-body>')
                ).replace(/<op-body(.*)>(.*)<\/op-body>/s, '<body$1>$2</body>');
                break;
            default:
                event.data.value = __us5.sourceHtml(event.data.value, { document: event.that.tagName === 'HTML' });
                break;
        };

        //event.data.value = __us5.sourceHtml(event.data.value, { document: event.that.tagName === 'HTML' });
    });

    client.document.on('write', event => {
        if (!event.data.html.length) return false;
        event.data.html = [__us5.rewriteHtml(event.data.html.join(''))];
    });

    client.document.on('writeln', event => {
        if (!event.data.html.length) return false;
        event.data.html = [__us5.rewriteHtml(event.data.html.join(''))];
    });

    client.element.on('insertAdjacentHTML', event => {
        event.data.html = __us5.rewriteHtml(event.data.html);
    });

    // EventSource

    client.eventSource.on('construct', event => {
        event.data.url = __us5.rewriteUrl(event.data.url);
    });


    client.eventSource.on('url', event => {
        event.data.url = __us5.rewriteUrl(event.data.url);
    });

    // History
    client.history.on('replaceState', event => {
        if (event.data.url) event.data.url = __us5.rewriteUrl(event.data.url, '__us5' in event.that ? event.that.__us5.meta : __us5.meta);
    });
    client.history.on('pushState', event => {
        if (event.data.url) event.data.url = __us5.rewriteUrl(event.data.url, '__us5' in event.that ? event.that.__us5.meta : __us5.meta);
    });

    // Element get set attribute methods
    client.element.on('getAttribute', event => {
        if (client.element.hasAttribute.call(event.that, __us5.attributePrefix + '-attr-' + event.data.name)) {
            event.respondWith(
                event.target.call(event.that, __us5.attributePrefix + '-attr-' + event.data.name)
            );
        };
    });

    // Message
    client.message.on('postMessage', event => {
        let to = event.data.origin;
        let call = __us5.call;


        if (event.that) {
            call = event.that.__us5$source.call;
        };

        event.data.origin = '*';
        event.data.message = {
            __data: event.data.message,
            __origin: (event.that || event.target).__us5$source.location.origin,
            __to: to,
        };

        event.respondWith(
            worker ?
            call(event.target, [event.data.message, event.data.transfer], event.that) :
            call(event.target, [event.data.message, event.data.origin, event.data.transfer], event.that)
        );

    });

    client.message.on('data', event => {
        const { value: data } = event.data;
        if (typeof data === 'object' && '__data' in data && '__origin' in data) {
            event.respondWith(data.__data);
        };
    });

    client.message.on('origin', event => {
        const data = client.message.messageData.get.call(event.that);
        if (typeof data === 'object' && data.__data && data.__origin) {
            event.respondWith(data.__origin);
        };
    });

    client.overrideDescriptor(window, 'origin', {
        get: (target, that) => {
            return __us5.location.origin;
        },
    });

    client.node.on('baseURI', event => {
        if (event.data.value.startsWith(window.location.origin)) event.data.value = __us5.sourceUrl(event.data.value);
    });

    client.element.on('setAttribute', event => {
        if (event.that instanceof HTMLMediaElement && event.data.name === 'src' && event.data.value.startsWith('blob:')) {
            event.target.call(event.that, __us5.attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value = __us5.blobUrls.get(event.data.value);
            return;
        };

        if (__us5.attrs.isUrl(event.data.name)) {
            event.target.call(event.that, __us5.attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value = __us5.rewriteUrl(event.data.value);
        };

        if (__us5.attrs.isStyle(event.data.name)) {
            event.target.call(event.that, __us5.attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value = __us5.rewriteCSS(event.data.value, { context: 'declarationList' });
        };

        if (__us5.attrs.isHtml(event.data.name)) {
            event.target.call(event.that, __us5.attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value = __us5.rewriteHtml(event.data.value, {...__us5.meta, document: true, injectHead:__us5.createHtmlInject(__us5.handlerScript, __us5.bundleScript, __us5.configScript, __us5.cookieStr, window.location.href) });
        };

        if (__us5.attrs.isSrcset(event.data.name)) {
            event.target.call(event.that, __us5.attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value = __us5.html.wrapSrcset(event.data.value);
        };

        if (__us5.attrs.isForbidden(event.data.name)) {
            event.data.name = __us5.attributePrefix + '-attr-' + event.data.name;
        };
    });

    client.element.on('audio', event => {
        event.data.url = __us5.rewriteUrl(event.data.url);
    });

    // Element Property Attributes
    client.element.hookProperty([HTMLAnchorElement, HTMLAreaElement, HTMLLinkElement, HTMLBaseElement], 'href', {
        get: (target, that) => {
            return __us5.sourceUrl(
                target.call(that)
            );
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that, __us5.attributePrefix + '-attr-href', val)
            target.call(that, __us5.rewriteUrl(val));
        },
    }); 

    client.element.hookProperty([HTMLScriptElement, HTMLAudioElement, HTMLVideoElement,  HTMLMediaElement, HTMLImageElement, HTMLInputElement, HTMLEmbedElement, HTMLIFrameElement, HTMLTrackElement, HTMLSourceElement], 'src', {
        get: (target, that) => {
            return __us5.sourceUrl(
                target.call(that)
            );
        },
        set: (target, that, [val]) => {
            if (new String(val).toString().trim().startsWith('blob:') && that instanceof HTMLMediaElement) {
                client.element.setAttribute.call(that, __us5.attributePrefix + '-attr-src', val)
                return target.call(that, __us5.blobUrls.get(val) || val);
            };

            client.element.setAttribute.call(that, __us5.attributePrefix + '-attr-src', val)
            target.call(that, __us5.rewriteUrl(val));
        },
    });

    client.element.hookProperty([HTMLFormElement], 'action', {
        get: (target, that) => {
            return __us5.sourceUrl(
                target.call(that)
            );
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that, __us5.attributePrefix + '-attr-action', val)
            target.call(that, __us5.rewriteUrl(val));
        },
    });

    client.element.hookProperty([HTMLImageElement], 'srcset', {
        get: (target, that) => {
            return client.element.getAttribute.call(that, __us5.attributePrefix + '-attr-srcset') || target.call(that);
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that, __us5.attributePrefix + '-attr-srcset', val)
            target.call(that, __us5.html.wrapSrcset(val));
        },
    });

    client.element.hookProperty(HTMLScriptElement, 'integrity', {
        get: (target, that) => {
            return client.element.getAttribute.call(that, __us5.attributePrefix + '-attr-integrity');
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that, __us5.attributePrefix + '-attr-integrity', val);
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'sandbox', {
        get: (target, that) => {
            return client.element.getAttribute.call(that, __us5.attributePrefix + '-attr-sandbox') || target.call(that);
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that, __us5.attributePrefix + '-attr-sandbox', val);
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'contentWindow', {
        get: (target, that) => {
            const win = target.call(that);
            try {
                if (!win.__us5) __us5Hook(win, config, bare);
                return win;
            } catch (e) {
                return win;
            };
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'contentDocument', {
        get: (target, that) => {
            const doc = target.call(that);
            try {
                const win = doc.defaultView
                if (!win.__us5) __us5Hook(win, config, bare);
                return doc;
            } catch (e) {
                return win;
            };
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'srcdoc', {
        get: (target, that) => {
            return client.element.getAttribute.call(that, __us5.attributePrefix + '-attr-srcdoc') || target.call(that);
        },
        set: (target, that, [val]) => {
            target.call(that, __us5.rewriteHtml(val, {
                document: true,
                injectHead: __us5.createHtmlInject(__us5.handlerScript, __us5.bundleScript, __us5.configScript, __us5.cookieStr, window.location.href)
            }))
        },
    });

    client.node.on('getTextContent', event => {
        if (event.that.tagName === 'SCRIPT') {
            event.data.value = __us5.js.source(event.data.value);
        };
    });

    client.node.on('setTextContent', event => {
        if (event.that.tagName === 'SCRIPT') {
            event.data.value = __us5.js.rewrite(event.data.value);
        };
    });

    // Until proper rewriting is implemented for service workers.
    // Not sure atm how to implement it with the already built in service worker
    if ('serviceWorker' in window.navigator) {
        delete window.Navigator.prototype.serviceWorker;
    };

    // Document
    client.document.on('getDomain', event => {
        event.data.value = __us5.domain;
    });
    client.document.on('setDomain', event => {
        if (!event.data.value.toString().endsWith(__us5.meta.url.hostname.split('.').slice(-2).join('.'))) return event.respondWith('');
        event.respondWith(__us5.domain = event.data.value);
    })

    client.document.on('url', event => {
        event.data.value = __us5.location.href;
    });

    client.document.on('documentURI', event => {
        event.data.value = __us5.location.href;
    });

    client.document.on('referrer', event => {
        event.data.value = __us5.referrer || __us5.sourceUrl(event.data.value);
    });

    client.document.on('parseFromString', event => {
        if (event.data.type !== 'text/html') return false;
        event.data.string = __us5.rewriteHtml(event.data.string, {...__us5.meta, document: true, });
    });

    // Attribute (node.attributes)
    client.attribute.on('getValue', event => {
        if (client.element.hasAttribute.call(event.that.ownerElement, __us5.attributePrefix + '-attr-' + event.data.name)) {
            event.data.value = client.element.getAttribute.call(event.that.ownerElement, __us5.attributePrefix + '-attr-' + event.data.name);
        };
    });

    client.attribute.on('setValue', event => {
        if (__us5.attrs.isUrl(event.data.name)) {
            client.element.setAttribute.call(event.that.ownerElement, __us5.attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value = __us5.rewriteUrl(event.data.value);
        };

        if (__us5.attrs.isStyle(event.data.name)) {
            client.element.setAttribute.call(event.that.ownerElement, __us5.attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value = __us5.rewriteCSS(event.data.value, { context: 'declarationList' });
        };

        if (__us5.attrs.isHtml(event.data.name)) {
            client.element.setAttribute.call(event.that.ownerElement, __us5.attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value = __us5.rewriteHtml(event.data.value, {...__us5.meta, document: true, injectHead:__us5.createHtmlInject(__us5.handlerScript, __us5.bundleScript, __us5.configScript, __us5.cookieStr, window.location.href) });
        };

        if (__us5.attrs.isSrcset(event.data.name)) {
            client.element.setAttribute.call(event.that.ownerElement, __us5.attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value = __us5.html.wrapSrcset(event.data.value);
        };

    });

    // URL
    client.url.on('createObjectURL', event => {
        let url = event.target.call(event.that, event.data.object);
        if (url.startsWith('blob:' + location.origin)) {
            let newUrl = 'blob:' + (__us5.meta.url.href !== 'about:blank' ?  __us5.meta.url.origin : window.parent.__us5.meta.url.origin) + url.slice('blob:'.length + location.origin.length);
            __us5.blobUrls.set(newUrl, url);
            event.respondWith(newUrl);
        } else {
            event.respondWith(url);
        };
    });

    client.url.on('revokeObjectURL', event => {
        if (__us5.blobUrls.has(event.data.url)) {
            const old = event.data.url;
            event.data.url = __us5.blobUrls.get(event.data.url);
            __us5.blobUrls.delete(old);
        };
    });

    client.storage.on('get', event => {
        event.data.name = methodPrefix + __us5.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('set', event => {
        if (event.that.__us5$storageObj) {
            event.that.__us5$storageObj[event.data.name] = event.data.value;
        };
        event.data.name = methodPrefix + __us5.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('delete', event => {
        if (event.that.__us5$storageObj) {
            delete event.that.__us5$storageObj[event.data.name];
        };
        event.data.name = methodPrefix + __us5.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('getItem', event => {
        event.data.name = methodPrefix + __us5.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('setItem', event => {
        if (event.that.__us5$storageObj) {
            event.that.__us5$storageObj[event.data.name] = event.data.value;
        };
        event.data.name = methodPrefix + __us5.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('removeItem', event => {
        if (event.that.__us5$storageObj) {
            delete event.that.__us5$storageObj[event.data.name];
        };
        event.data.name = methodPrefix + __us5.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('clear', event => {
        if (event.that.__us5$storageObj) {
            for (const key of client.nativeMethods.keys.call(null, event.that.__us5$storageObj)) {
                delete event.that.__us5$storageObj[key];
                client.storage.removeItem.call(event.that, methodPrefix + __us5.meta.url.origin + '@' + key);
                event.respondWith();
            };
        };
    });

    client.storage.on('length', event => {
        if (event.that.__us5$storageObj) {
            event.respondWith(client.nativeMethods.keys.call(null, event.that.__us5$storageObj).length);
        };
    });

    client.storage.on('key', event => {
        if (event.that.__us5$storageObj) {
            event.respondWith(
                (client.nativeMethods.keys.call(null, event.that.__us5$storageObj)[event.data.index] || null)
            );
        };
    });

    client.websocket.on('websocket', async event => {
        let url;
        try {
            url = new URL(event.data.url);
        } catch(e) {
            return;
        };

        const headers = {
            Host: url.host,
            Origin: __us5.meta.url.origin,
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            Upgrade: 'websocket',
            'User-Agent': window.navigator.userAgent,
            'Connection': 'Upgrade',
        };

        const cookies = __us5.cookie.serialize(__us5.cookies, { url }, false);

        if (cookies) headers.Cookie = cookies;
        const protocols = [...event.data.protocols];

        const remote = {
            protocol: url.protocol,
            host: url.hostname,
            port: url.port || (url.protocol === 'wss:' ? '443' : '80'),
            path: url.pathname + url.search,
        };

        if (protocols.length) headers['Sec-WebSocket-Protocol'] = protocols.join(', ');

       event.data.url =  (
    __us5.bare.protocol === 'https:' || __us5.bare.protocol === 'wss:'
        ? 'wss://'
        : 'ws://'
    ) + __us5.bare.host + __us5.bare.pathname + 'v1/';
        event.data.protocols = [
            'bare',
            __us5.encodeProtocol(JSON.stringify({
                remote,
                headers,
                forward_headers: [
                    'accept',
                    'accept-encoding',
                    'accept-language',
                    'sec-websocket-extensions',
                    'sec-websocket-key',
                    'sec-websocket-version',
                ],
            })),
        ];

        const ws = new event.target(event.data.url, event.data.protocols);

        client.nativeMethods.defineProperty(ws, methodPrefix + 'url', {
            enumerable: false,
            value: url.href,
        });

        event.respondWith(
            ws
        );
    });

    client.websocket.on('url', event => {
        if ('__us5$url' in event.that) {
            event.data.value = event.that.__us5$url;
        };
    });

    client.websocket.on('protocol', event => {
        if ('__us5$protocol' in event.that) {
            event.data.value = event.that.__us5$protocol;
        };
    });

    client.function.on('function', event => {
        event.data.script = __us5.rewriteJS(event.data.script);
    });

    client.function.on('toString', event => {
        if (__us5.methods.string in event.that) event.respondWith(event.that[__us5.methods.string]);
    });

    client.object.on('getOwnPropertyNames', event => {
        event.data.names = event.data.names.filter(element => !(__us5.filterKeys.includes(element)));
    });

    client.object.on('getOwnPropertyDescriptors', event => {
        for (const forbidden of __us5.filterKeys) {
            delete event.data.descriptors[forbidden];
        };

    });

    client.style.on('setProperty', event => {
        if (client.style.dashedUrlProps.includes(event.data.property)) {
            event.data.value = __us5.rewriteCSS(event.data.value, {
                context: 'value',
                ...__us5.meta
            })
        };
    });

    client.style.on('getPropertyValue', event => {
        if (client.style.dashedUrlProps.includes(event.data.property)) {
            event.respondWith(
                __us5.sourceCSS(
                    event.target.call(event.that, event.data.property),
                    {
                        context: 'value',
                        ...__us5.meta
                    }
                )
            );
        };
    });

    if ('CSS2Properties' in window) {
        for (const key of client.style.urlProps) {
            client.overrideDescriptor(window.CSS2Properties.prototype, key, {
                get: (target, that) => {
                    return __us5.sourceCSS(
                        target.call(that),
                        {
                            context: 'value',
                            ...__us5.meta
                        }
                    )
                },
                set: (target, that, val) => {
                    target.call(
                        that,
                        __us5.rewriteCSS(val, {
                            context: 'value',
                            ...__us5.meta
                        })
                    );
                }
            });
        };
    } else if ('HTMLElement' in window) {

        client.overrideDescriptor(
            window.HTMLElement.prototype,
            'style',
            {
                get: (target, that) => {
                    const value = target.call(that);
                    if (!value[methodPrefix + 'modifiedStyle']) {

                        for (const key of client.style.urlProps) {
                            client.nativeMethods.defineProperty(value, key, {
                                enumerable: true,
                                configurable: true,
                                get() {
                                    const value = client.style.getPropertyValue.call(this, key) || '';
                                    return __us5.sourceCSS(
                                        value,
                                        {
                                            context: 'value',
                                            ...__us5.meta
                                        }
                                    )
                                },
                                set(val) {
                                    client.style.setProperty.call(this, 
                                        (client.style.propToDashed[key] || key),
                                        __us5.rewriteCSS(val, {
                                            context: 'value',
                                            ...__us5.meta
                                        })    
                                    )
                                }
                            });
                            client.nativeMethods.defineProperty(value, methodPrefix + 'modifiedStyle', {
                                enumerable: false,
                                value: true
                            });
                        };
                    };
                    return value;
                }
            }
        );
    };

    client.style.on('setCssText', event => {
        event.data.value = __us5.rewriteCSS(event.data.value, {
            context: 'declarationList',
            ...__us5.meta
        });
    });

    client.style.on('getCssText', event => {
        event.data.value = __us5.sourceCSS(event.data.value, {
            context: 'declarationList',
            ...__us5.meta
        });
    });

    // Proper hash emulation.
    if (!!window.window) {
        __us5.addEventListener.call(window, 'hashchange', event => {
            if (event.__us5$dispatched) return false;
            event.stopImmediatePropagation();
            const hash = window.location.hash;
            client.history.replaceState.call(window.history, '', '', event.oldURL);
            __us5.location.hash = hash;
        });
    };

    client.location.on('hashchange', (oldUrl, newUrl, ctx) => {
        if (ctx.HashChangeEvent && client.history.replaceState) {
            client.history.replaceState.call(window.history, '', '', __us5.rewriteUrl(newUrl));

            const event = new ctx.HashChangeEvent('hashchange', { newURL: newUrl, oldURL: oldUrl });

            client.nativeMethods.defineProperty(event, methodPrefix + 'dispatched', {
                value: true,
                enumerable: false,
            }); 

            __us5.dispatchEvent.call(window, event);
        };
    });

    // Hooking functions & descriptors
    client.fetch.overrideRequest();
    client.fetch.overrideUrl();
    client.xhr.overrideOpen();
    client.xhr.overrideResponseUrl();
    client.element.overrideHtml();
    client.element.overrideAttribute();
    client.element.overrideInsertAdjacentHTML();
    client.element.overrideAudio();
    // client.element.overrideQuerySelector();
    client.node.overrideBaseURI();
    client.node.overrideTextContent();
    client.attribute.overrideNameValue();
    client.document.overrideDomain();
    client.document.overrideURL();
    client.document.overrideDocumentURI();
    client.document.overrideWrite();
    client.document.overrideReferrer();
    client.document.overrideParseFromString();
    client.storage.overrideMethods();
    client.storage.overrideLength();
    //client.document.overrideQuerySelector();
    client.object.overrideGetPropertyNames();
    client.object.overrideGetOwnPropertyDescriptors();
    client.history.overridePushState();
    client.history.overrideReplaceState();
    client.eventSource.overrideConstruct();
    client.eventSource.overrideUrl();
    client.websocket.overrideWebSocket();
    client.websocket.overrideProtocol();
    client.websocket.overrideUrl();
    client.url.overrideObjectURL();
    client.document.overrideCookie();
    client.message.overridePostMessage();
    client.message.overrideMessageOrigin();
    client.message.overrideMessageData();
    client.workers.overrideWorker();
    client.workers.overrideAddModule();
    client.workers.overrideImportScripts();
    client.workers.overridePostMessage();
    client.style.overrideSetGetProperty();
    client.style.overrideCssText();
    client.navigator.overrideSendBeacon();
    client.function.overrideFunction();
    client.function.overrideToString();
    client.location.overrideWorkerLocation(
        (href) => {
            return new URL(__us5.sourceUrl(href));
        }
    );

    client.overrideDescriptor(window, 'localStorage', {
        get: (target, that) => {
            return (that || window).__us5.lsWrap;
        },
    });
    client.overrideDescriptor(window, 'sessionStorage', {
        get: (target, that) => {
            return (that || window).__us5.ssWrap;
        },
    });


    client.override(window, 'open', (target, that, args) => {
        if (!args.length) return target.apply(that, args);
        let [url] = args;

        url = __us5.rewriteUrl(url);

        return target.call(that, url);
    });

    __us5.$wrap = function(name) {
        if (name === 'location') return __us5.methods.location;
        if (name === 'eval') return __us5.methods.eval;
        return name;
    };


    __us5.$get = function(that) {
        if (that === window.location) return __us5.location;
        if (that === window.eval) return __us5.eval;
        if (that === window.parent) {
            return window.__us5$parent;
        };
        if (that === window.top) {
            return window.__us5$top;
        };
        return that;
    };

    __us5.eval = client.wrap(window, 'eval', (target, that, args) => {
        if (!args.length || typeof args[0] !== 'string') return target.apply(that, args);
        let [script] = args;

        script = __us5.rewriteJS(script);
        return target.call(that, script);
    });

    __us5.call = function(target, args, that) {
        return that ? target.apply(that, args) : target(...args);
    };

    __us5.call$ = function(obj, prop, args = []) {
        return obj[prop].apply(obj, args);
    };

    client.nativeMethods.defineProperty(window.Object.prototype, master, {
        get: () => {
            return __us5;
        },
        enumerable: false
    });

    client.nativeMethods.defineProperty(window.Object.prototype, __us5.methods.setSource, {
        value: function(source) {
            if (!client.nativeMethods.isExtensible(this)) return this;

            client.nativeMethods.defineProperty(this, __us5.methods.source, {
                value: source,
                writable: true,
                enumerable: false
            });

            return this;
        },
        enumerable: false,
    });

    client.nativeMethods.defineProperty(window.Object.prototype, __us5.methods.source, {
        value: __us5,
        writable: true,
        enumerable: false
    });

    client.nativeMethods.defineProperty(window.Object.prototype, __us5.methods.location, {
        configurable: true,
        get() {
            return (this === window.document || this === window) ? __us5.location : this.location;
        },
        set(val) {
            if (this === window.document || this === window) {
                __us5.location.href = val;
            } else {
                this.location = val;
            };
        },
    });

    client.nativeMethods.defineProperty(window.Object.prototype, __us5.methods.parent, {
        configurable: true,
        get() {
            const val = this.parent;

            if (this === window) {
                try {
                    return '__us5' in val ? val : this;
                } catch (e) {
                    return this;
                };
            };
            return val;
        },
        set(val) {
            this.parent = val;
        },
    });

    client.nativeMethods.defineProperty(window.Object.prototype, __us5.methods.top, {
        configurable: true,
        get() {
            const val = this.top;

            if (this === window) {
                if (val === this.parent) return this[__us5.methods.parent];
                try {
                    if (!('__us5' in val)) {
                        let current = this;

                        while (current.parent !== val) {
                            current = current.parent
                        };

                        return '__us5' in current ? current : this;

                    } else {
                        return val;
                    };
                } catch (e) {
                    return this;
                };
            };
            return val;
        },
        set(val) {
            this.top = val;
        },
    });


    client.nativeMethods.defineProperty(window.Object.prototype, __us5.methods.eval, {
        configurable: true,
        get() {
            return this === window ? __us5.eval : this.eval;
        },
        set(val) {
            this.eval = val;
        },
    });
};
