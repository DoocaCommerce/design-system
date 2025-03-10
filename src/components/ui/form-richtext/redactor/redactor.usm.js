if (void 0 === CodeMirror) var CodeMirror = void 0;
if (void 0 === jQuery) var jQuery = void 0;
!(function () {
  var s = {
      settings: {},
      post: function (t) {
        return new n('post', t);
      },
      get: function (t) {
        return new n('get', t);
      },
      request: function (t, e) {
        return new n(t, e);
      },
    },
    n = function (t, e) {
      var i = {
        method: t,
        url: '',
        before: function () {},
        success: function () {},
        error: function () {},
        data: !1,
        async: !0,
        headers: {},
      };
      (this.p = this.extend(i, e)),
        (this.p = this.extend(this.p, s.settings)),
        (this.p.method = this.p.method.toUpperCase()),
        this.prepareData(),
        (this.xhr = new XMLHttpRequest()),
        this.xhr.open(this.p.method, this.p.url, this.p.async),
        this.setHeaders(),
        !1 !== ('function' != typeof this.p.before || this.p.before(this.xhr)) && this.send();
    };
  n.prototype = {
    extend: function (t, e) {
      if (e) for (var i in e) t[i] = e[i];
      return t;
    },
    prepareData: function () {
      -1 === ['POST', 'PUT'].indexOf(this.p.method) ||
        this.isFormData() ||
        (this.p.headers['Content-Type'] = 'application/x-www-form-urlencoded'),
        'object' != typeof this.p.data || this.isFormData() || (this.p.data = this.toParams(this.p.data)),
        'GET' === this.p.method && (this.p.url = this.p.data ? this.p.url + '?' + this.p.data : this.p.url);
    },
    setHeaders: function () {
      for (var t in (this.xhr.setRequestHeader(
        'X-Requested-With',
        this.p.headers['X-Requested-With'] || 'XMLHttpRequest'
      ),
      this.p.headers))
        this.xhr.setRequestHeader(t, this.p.headers[t]);
    },
    isFormData: function () {
      return void 0 !== window.FormData && this.p.data instanceof window.FormData;
    },
    isComplete: function () {
      return !(this.xhr.status < 200 || (300 <= this.xhr.status && 304 !== this.xhr.status));
    },
    send: function () {
      this.p.async
        ? ((this.xhr.onload = this.loaded.bind(this)), this.xhr.send(this.p.data))
        : (this.xhr.send(this.p.data), this.loaded.call(this));
    },
    loaded: function () {
      if (this.isComplete()) {
        var t = this.parseResponse();
        'function' == typeof this.p.success && this.p.success(t, this.xhr);
      } else {
        t = this.parseResponse();
        'function' == typeof this.p.error && this.p.error(t, this.xhr, this.xhr.status);
      }
    },
    parseResponse: function () {
      var t = this.xhr.response,
        e = this.parseJson(t);
      return e || t;
    },
    parseJson: function (t) {
      try {
        var e = JSON.parse(t);
        if (e && 'object' == typeof e) return e;
      } catch (t) {}
      return !1;
    },
    toParams: function (e) {
      return Object.keys(e)
        .map(function (t) {
          return encodeURIComponent(t) + '=' + encodeURIComponent(e[t]);
        })
        .join('&');
    },
  };
  function c(t, e) {
    return this.parse(t, e);
  }
  var r = [0],
    o = 'data' + new Date().getTime(),
    a = 'is-hidden',
    l = 'is-hidden-mobile';
  (c.ready = function (t) {
    'loading' !== document.readyState ? t() : document.addEventListener('DOMContentLoaded', t);
  }),
    (c.prototype = {
      get sdom() {
        return !0;
      },
      get length() {
        return this.nodes.length;
      },
      parse: function (t, e) {
        var i;
        if (t) {
          if (t.sdom) return (this.nodes = t.nodes), t;
          i =
            'string' != typeof t
              ? t.nodeType && 11 === t.nodeType
                ? t.childNodes
                : t.nodeType || t === window
                  ? [t]
                  : t
              : /^\s*<(\w+|!)[^>]*>/.test(t)
                ? this.create(t)
                : this._query(t, e);
        } else i = [];
        this.nodes = this._slice(i);
      },
      create: function (t) {
        if (/^<(\w+)\s*\/?>(?:<\/\1>|)$/.test(t)) return [document.createElement(RegExp.$1)];
        var e = [],
          i = document.createElement('div'),
          s = i.childNodes;
        i.innerHTML = t;
        for (var n = 0, r = s.length; n < r; n++) e.push(s[n]);
        return e;
      },
      add: function (t) {
        this.nodes = this.nodes.concat(this._toArray(t));
      },
      get: function (t) {
        return this.nodes[t || 0] || !1;
      },
      getAll: function () {
        return this.nodes;
      },
      eq: function (t) {
        return new c(this.nodes[t]);
      },
      first: function () {
        return new c(this.nodes[0]);
      },
      last: function () {
        return new c(this.nodes[this.nodes.length - 1]);
      },
      contents: function () {
        return this.get().childNodes;
      },
      each: function (t) {
        for (var e = this.nodes.length, i = 0; i < e; i++)
          t.call(this, this.nodes[i].sdom ? this.nodes[i].get() : this.nodes[i], i);
        return this;
      },
      is: function (t) {
        return 0 < this.filter(t).length;
      },
      filter: function (e) {
        var t;
        return void 0 === e
          ? this
          : ((t =
              'function' == typeof e
                ? e
                : function (t) {
                    return e instanceof Node
                      ? e === t
                      : e && e.sdom
                        ? -1 !== e.nodes.indexOf(t)
                        : ((t.matches = t.matches || t.msMatchesSelector || t.webkitMatchesSelector),
                          1 === t.nodeType && t.matches(e || '*'));
                  }),
            new c(this.nodes.filter(t)));
      },
      not: function (e) {
        return this.filter(function (t) {
          return !new c(t).is(e || !0);
        });
      },
      find: function (s) {
        var n = [];
        return (
          this.each(function (t) {
            for (var e = this._query(s || '*', t), i = 0; i < e.length; i++) n.push(e[i]);
          }),
          new c(n)
        );
      },
      children: function (t) {
        var s = [];
        return (
          this.each(function (t) {
            if (t.children) for (var e = t.children, i = 0; i < e.length; i++) s.push(e[i]);
          }),
          new c(s).filter(t)
        );
      },
      parent: function (t) {
        var e = [];
        return (
          this.each(function (t) {
            t.parentNode && e.push(t.parentNode);
          }),
          new c(e).filter(t)
        );
      },
      parents: function (i, s) {
        s = this._getContext(s);
        var n = [];
        return (
          this.each(function (t) {
            for (var e = t.parentNode; e && e !== s; ) i ? new c(e).is(i) && n.push(e) : n.push(e), (e = e.parentNode);
          }),
          new c(n)
        );
      },
      closest: function (e, i) {
        (i = this._getContext(i)), (e = e.sdom ? e.get() : e);
        var s = [],
          n = e && e.nodeType;
        return (
          this.each(function (t) {
            do {
              if ((n && t === e) || new c(t).is(e)) return s.push(t);
            } while ((t = t.parentNode) && t !== i);
          }),
          new c(s)
        );
      },
      next: function (t) {
        return this._getSibling(t, 'nextSibling');
      },
      nextElement: function (t) {
        return this._getSibling(t, 'nextElementSibling');
      },
      prev: function (t) {
        return this._getSibling(t, 'previousSibling');
      },
      prevElement: function (t) {
        return this._getSibling(t, 'previousElementSibling');
      },
      css: function (s, n) {
        if (void 0 !== n || 'object' == typeof s)
          return this.each(function (t) {
            var e = {};
            for (var i in ('object' == typeof s ? (e = s) : (e[s] = n), e)) t.style && (t.style[i] = e[i]);
          });
        var t = this.get();
        return 'width' === s || 'height' === s
          ? t.style
            ? this._getHeightOrWidth(s, t, !1) + 'px'
            : void 0
          : t.style
            ? getComputedStyle(t, null)[s]
            : void 0;
      },
      attr: function (s, n, r) {
        if (((r = r ? 'data-' : ''), void 0 !== n || 'object' == typeof s))
          return this.each(function (t) {
            var e = {};
            for (var i in ('object' == typeof s ? (e = s) : (e[s] = n), e))
              3 !== t.nodeType && ('checked' === i ? (t.checked = e[i]) : t.setAttribute(r + i, e[i]));
          });
        var t = this.get();
        return t && 3 !== t.nodeType
          ? 'checked' === s
            ? t.checked
            : this._getBooleanFromStr(t.getAttribute(r + s))
          : void 0;
      },
      data: function (t, e) {
        if (void 0 !== t) return this.attr(t, e, !0);
        function i(t) {
          return t[1].toUpperCase();
        }
        var s = /^data-(.+)$/,
          n = this.get().attributes,
          r = {};
        for (var o in n)
          if (n[o] && s.test(n[o].nodeName)) {
            var a = n[o].nodeName.match(s)[1],
              l = n[o].value;
            (a = a.replace(/-([a-z])/g, i)),
              (l = this._isObjectString(l)
                ? this._toObject(l)
                : this._isNumber(l)
                  ? parseFloat(l)
                  : this._getBooleanFromStr(l)),
              (r[a] = l);
          }
        return r;
      },
      val: function (e) {
        if (void 0 !== e)
          return this.each(function (t) {
            t.value = e;
          });
        var t = this.get();
        return t.type && 'checkbox' === t.type ? t.checked : t.value;
      },
      removeAttr: function (t) {
        return this.each(function (e) {
          t.split(' ').forEach(function (t) {
            3 !== e.nodeType && e.removeAttribute(t);
          });
        });
      },
      removeData: function (t) {
        return this.each(function (e) {
          t.split(' ').forEach(function (t) {
            3 !== e.nodeType && e.removeAttribute('data-' + t);
          });
        });
      },
      dataset: function (e, i) {
        return this.each(function (t) {
          r[this.dataindex(t)][e] = i;
        });
      },
      dataget: function (t) {
        return r[this.dataindex(this.get())][t];
      },
      dataindex: function (t) {
        var e = t[o],
          i = r.length;
        return e || ((e = t[o] = i), (r[e] = {})), e;
      },
      addClass: function (t) {
        return this._eachClass(t, 'add');
      },
      removeClass: function (t) {
        return this._eachClass(t, 'remove');
      },
      toggleClass: function (t) {
        return this._eachClass(t, 'toggle');
      },
      hasClass: function (e) {
        return this.nodes.some(function (t) {
          return !!t.classList && t.classList.contains(e);
        });
      },
      empty: function () {
        return this.each(function (t) {
          t.innerHTML = '';
        });
      },
      html: function (t) {
        return void 0 === t ? this.get().innerHTML || '' : this.empty().append(t);
      },
      text: function (e) {
        return void 0 === e
          ? this.get().textContent || ''
          : this.each(function (t) {
              t.textContent = e;
            });
      },
      after: function (t) {
        return this._inject(t, function (t, e) {
          if ('string' == typeof t) e.insertAdjacentHTML('afterend', t);
          else if (null !== e.parentNode)
            for (var i = t instanceof Node ? [t] : this._toArray(t).reverse(), s = 0; s < i.length; s++)
              e.parentNode.insertBefore(i[s], e.nextSibling);
          return e;
        });
      },
      before: function (t) {
        return this._inject(t, function (t, e) {
          if ('string' == typeof t) e.insertAdjacentHTML('beforebegin', t);
          else
            for (var i = t instanceof Node ? [t] : this._toArray(t), s = 0; s < i.length; s++)
              e.parentNode.insertBefore(i[s], e);
          return e;
        });
      },
      append: function (t) {
        return this._inject(t, function (t, e) {
          if ('string' == typeof t || 'number' == typeof t) e.insertAdjacentHTML('beforeend', t);
          else for (var i = t instanceof Node ? [t] : this._toArray(t), s = 0; s < i.length; s++) e.appendChild(i[s]);
          return e;
        });
      },
      prepend: function (t) {
        return this._inject(t, function (t, e) {
          if ('string' == typeof t || 'number' == typeof t) e.insertAdjacentHTML('afterbegin', t);
          else
            for (var i = t instanceof Node ? [t] : this._toArray(t).reverse(), s = 0; s < i.length; s++)
              e.insertBefore(i[s], e.firstChild);
          return e;
        });
      },
      wrap: function (t) {
        return this._inject(t, function (t, e) {
          var i =
            'string' == typeof t || 'number' == typeof t
              ? this.create(t)[0]
              : t instanceof Node
                ? t
                : this._toArray(t)[0];
          return e.parentNode && e.parentNode.insertBefore(i, e), i.appendChild(e), new c(i);
        });
      },
      unwrap: function () {
        return this.each(function (t) {
          var e = new c(t);
          return e.replaceWith(e.contents());
        });
      },
      replaceWith: function (t) {
        return this._inject(t, function (t, e) {
          for (
            var i = document.createDocumentFragment(),
              s =
                'string' == typeof t || 'number' == typeof t
                  ? this.create(t)
                  : t instanceof Node
                    ? [t]
                    : this._toArray(t),
              n = 0;
            n < s.length;
            n++
          )
            i.appendChild(s[n]);
          var r = i.childNodes[0];
          return e.parentNode && e.parentNode.replaceChild(i, e), r;
        });
      },
      remove: function () {
        return this.each(function (t) {
          t.parentNode && t.parentNode.removeChild(t);
        });
      },
      clone: function (i) {
        var s = [];
        return (
          this.each(function (t) {
            var e = this._clone(t);
            i && (e = this._cloneEvents(t, e)), s.push(e);
          }),
          new c(s)
        );
      },
      show: function () {
        return this.each(
          function (t) {
            if (t.style && this._hasDisplayNone(t)) {
              var e,
                i = t.getAttribute('domTargetShow'),
                s = !!t.classList && t.classList.contains(a),
                n = !!t.classList && t.classList.contains(l);
              s
                ? ((e = a), t.classList.remove(a))
                : n
                  ? ((e = l), t.classList.remove(l))
                  : (t.style.display = i || 'block'),
                e && t.setAttribute('domTargetHide', e),
                t.removeAttribute('domTargetShow');
            }
          }.bind(this)
        );
      },
      hide: function () {
        return this.each(function (t) {
          if (t.style && !this._hasDisplayNone(t)) {
            var e = t.style.display,
              i = t.getAttribute('domTargetHide');
            i === a
              ? t.classList.add(a)
              : i === l
                ? t.classList.add(l)
                : ('block' !== e && t.setAttribute('domTargetShow', e), (t.style.display = 'none')),
              t.removeAttribute('domTargetHide');
          }
        });
      },
      scrollTop: function (t) {
        var e = this.get(),
          i = e === window,
          s = 9 === e.nodeType,
          n = s
            ? document.scrollingElement || document.body.parentNode || document.body || document.documentElement
            : e;
        if (void 0 === t)
          return s
            ? void 0 !== window.pageYOffset
              ? window.pageYOffset
              : document.documentElement.scrollTop
                ? document.documentElement.scrollTop
                : document.body.scrollTop
                  ? document.body.scrollTop
                  : 0
            : i
              ? window.pageYOffset
              : n.scrollTop;
        i ? window.scrollTo(0, t) : (n.scrollTop = t);
      },
      offset: function () {
        return this._getDim('Offset');
      },
      position: function () {
        return this._getDim('Position');
      },
      width: function (t, e) {
        return this._getSize('width', 'Width', t, e);
      },
      height: function (t, e) {
        return this._getSize('height', 'Height', t, e);
      },
      outerWidth: function () {
        return this._getInnerOrOuter('width', 'outer');
      },
      outerHeight: function () {
        return this._getInnerOrOuter('height', 'outer');
      },
      innerWidth: function () {
        return this._getInnerOrOuter('width', 'inner');
      },
      innerHeight: function () {
        return this._getInnerOrOuter('height', 'inner');
      },
      click: function () {
        return this._triggerEvent('click');
      },
      focus: function () {
        return this._triggerEvent('focus');
      },
      trigger: function (n) {
        return this.each(function (t) {
          for (var e = n.split(' '), i = 0; i < e.length; i++) {
            var s;
            try {
              s = new window.CustomEvent(e[i], { bubbles: !0, cancelable: !0 });
            } catch (t) {
              (s = document.createEvent('CustomEvent')).initCustomEvent(e[i], !0, !0);
            }
            t.dispatchEvent(s);
          }
        });
      },
      on: function (r, o, a) {
        return this.each(function (t) {
          for (var e = r.split(' '), i = 0; i < e.length; i++) {
            var s = this._getEventName(e[i]),
              n = this._getEventNamespace(e[i]);
            (o = a ? this._getOneHandler(o, r) : o),
              t.addEventListener(s, o),
              (t._e = t._e || {}),
              (t._e[n] = t._e[n] || {}),
              (t._e[n][s] = t._e[n][s] || []),
              t._e[n][s].push(o);
          }
        });
      },
      one: function (t, e) {
        return this.on(t, e, !0);
      },
      off: function (r, o) {
        function a(t, e, i) {
          return t === i;
        }
        function l(t, e, i, s) {
          return e === s;
        }
        function h(t, e, i, s) {
          return t === i && e === s;
        }
        function e() {
          return !0;
        }
        return void 0 === r
          ? this.each(function (t) {
              this._offEvent(t, !1, !1, o, e);
            })
          : this.each(function (t) {
              for (var e = r.split(' '), i = 0; i < e.length; i++) {
                var s = this._getEventName(e[i]),
                  n = this._getEventNamespace(e[i]);
                '_events' === n
                  ? this._offEvent(t, s, n, o, a)
                  : s || '_events' === n
                    ? this._offEvent(t, s, n, o, h)
                    : this._offEvent(t, s, n, o, l);
              }
            });
      },
      serialize: function (t) {
        for (var e = {}, i = this.get().elements, s = 0; s < i.length; s++) {
          var n = i[s];
          if ((!/(checkbox|radio)/.test(n.type) || n.checked) && n.name && !n.disabled && 'file' !== n.type) {
            if ('select-multiple' === n.type)
              for (var r = 0; r < n.options.length; r++) {
                var o = n.options[r];
                o.selected && (e[n.name] = o.value);
              }
            e[n.name] = this._isNumber(n.value) ? parseFloat(n.value) : this._getBooleanFromStr(n.value);
          }
        }
        return t ? e : this._toParams(e);
      },
      ajax: function (t, e) {
        if (void 0 !== n) {
          var i = this.attr('method') || 'post',
            s = { url: this.attr('action'), data: this.serialize(), success: t, error: e };
          return new n(i, s);
        }
      },
      _queryContext: function (t, e) {
        return 3 !== (e = this._getContext(e)).nodeType && 'function' == typeof e.querySelectorAll
          ? e.querySelectorAll(t)
          : [];
      },
      _query: function (t, e) {
        if (e) return this._queryContext(t, e);
        if (/^[.#]?[\w-]*$/.test(t)) {
          if ('#' !== t[0])
            return '.' === t[0] ? document.getElementsByClassName(t.slice(1)) : document.getElementsByTagName(t);
          var i = document.getElementById(t.slice(1));
          return i ? [i] : [];
        }
        return document.querySelectorAll(t);
      },
      _getContext: function (t) {
        return (t = 'string' == typeof t ? document.querySelector(t) : t) && t.sdom ? t.get() : t || document;
      },
      _inject: function (t, e) {
        for (var i = this.nodes.length, s = []; i--; ) {
          var n = 'function' == typeof t ? t.call(this, this.nodes[i]) : t,
            r = 0 === i ? n : this._clone(n),
            o = e.call(this, r, this.nodes[i]);
          o && (o.sdom ? s.push(o.get()) : s.push(o));
        }
        return new c(s);
      },
      _cloneEvents: function (t, e) {
        var i = t._e;
        if (i)
          for (var s in (e._e = i)._events)
            for (var n = 0; n < i._events[s].length; n++) e.addEventListener(s, i._events[s][n]);
        return e;
      },
      _clone: function (t) {
        if (void 0 !== t)
          return 'string' == typeof t
            ? t
            : t instanceof Node || t.nodeType
              ? t.cloneNode(!0)
              : 'length' in t
                ? [].map.call(this._toArray(t), function (t) {
                    return t.cloneNode(!0);
                  })
                : void 0;
      },
      _slice: function (t) {
        return t && 0 !== t.length ? (t.length ? [].slice.call(t.nodes || t) : [t]) : [];
      },
      _eachClass: function (t, i) {
        return this.each(function (e) {
          if (t) {
            t.split(' ').forEach(function (t) {
              e.classList && e.classList[i](t);
            });
          }
        });
      },
      _triggerEvent: function (t) {
        var e = this.get();
        return e && 3 !== e.nodeType && e[t](), this;
      },
      _getOneHandler: function (t, e) {
        var i = this;
        return function () {
          t.apply(this, arguments), i.off(e);
        };
      },
      _getEventNamespace: function (t) {
        var e = t.split('.'),
          i = e[1] ? e[1] : '_events';
        return e[2] ? i + e[2] : i;
      },
      _getEventName: function (t) {
        return t.split('.')[0];
      },
      _offEvent: function (t, e, i, s, n) {
        for (var r in t._e)
          for (var o in t._e[r])
            if (n(o, r, e, i))
              for (var a = t._e[r][o], l = 0; l < a.length; l++)
                (void 0 !== s && a[l].toString() !== s.toString()) ||
                  (t.removeEventListener(o, a[l]),
                  t._e[r][o].splice(l, 1),
                  0 === t._e[r][o].length && delete t._e[r][o],
                  0 === Object.keys(t._e[r]).length && delete t._e[r]);
      },
      _getInnerOrOuter: function (t, e) {
        return this[t](void 0, e);
      },
      _getDocSize: function (t, e) {
        var i = t.body,
          s = t.documentElement;
        return Math.max(i['scroll' + e], i['offset' + e], s['client' + e], s['scroll' + e], s['offset' + e]);
      },
      _getSize: function (e, t, i, s) {
        if (void 0 !== i)
          return this.each(
            function (t) {
              (i = parseFloat(i)),
                (i += this._adjustResultHeightOrWidth(e, t, s || 'normal')),
                new c(t).css(e, i + 'px');
            }.bind(this)
          );
        var n = this.get();
        return (
          (i =
            3 === n.nodeType
              ? 0
              : 9 === n.nodeType
                ? this._getDocSize(n, t)
                : n === window
                  ? window['inner' + t]
                  : this._getHeightOrWidth(e, n, s || 'normal')),
          Math.round(i)
        );
      },
      _getHeightOrWidth: function (t, e, i) {
        if (!e) return 0;
        var s = t.charAt(0).toUpperCase() + t.slice(1),
          n = 0,
          r = getComputedStyle(e, null),
          o = new c(e),
          a = o.parents().filter(function (t) {
            return 1 === t.nodeType && 'none' === getComputedStyle(t, null).display && t;
          });
        if (('none' === r.display && a.add(e), 0 !== a.length)) {
          var l = 'visibility: hidden !important; display: block !important;',
            h = [];
          a.each(function (t) {
            var e = new c(t),
              i = e.attr('style');
            null !== i && h.push(i), e.attr('style', null !== i ? i + ';' + l : l);
          }),
            (n = o.get()['offset' + s] - this._adjustResultHeightOrWidth(t, e, i)),
            a.each(function (t, e) {
              var i = new c(t);
              void 0 === h[e] ? i.removeAttr('style') : i.attr('style', h[e]);
            });
        } else n = e['offset' + s] - this._adjustResultHeightOrWidth(t, e, i);
        return n;
      },
      _adjustResultHeightOrWidth: function (t, e, i) {
        if (!e || !1 === i) return 0;
        var s = 0,
          n = getComputedStyle(e, null),
          r = 'border-box' === n.boxSizing;
        return (
          'height' === t
            ? (('inner' === i || ('normal' === i && r)) &&
                (s += (parseFloat(n.borderTopWidth) || 0) + (parseFloat(n.borderBottomWidth) || 0)),
              'outer' === i && (s -= (parseFloat(n.marginTop) || 0) + (parseFloat(n.marginBottom) || 0)))
            : (('inner' === i || ('normal' === i && r)) &&
                (s += (parseFloat(n.borderLeftWidth) || 0) + (parseFloat(n.borderRightWidth) || 0)),
              'outer' === i && (s -= (parseFloat(n.marginLeft) || 0) + (parseFloat(n.marginRight) || 0))),
          s
        );
      },
      _getDim: function (t) {
        var e = this.get();
        return 3 === e.nodeType ? { top: 0, left: 0 } : this['_get' + t](e);
      },
      _getPosition: function (t) {
        return { top: t.offsetTop, left: t.offsetLeft };
      },
      _getOffset: function (t) {
        var e = t.getBoundingClientRect(),
          i = t.ownerDocument,
          s = i.documentElement,
          n = i.defaultView;
        return { top: e.top + n.pageYOffset - s.clientTop, left: e.left + n.pageXOffset - s.clientLeft };
      },
      _getSibling: function (e, i) {
        var s,
          n = (e = e && e.sdom ? e.get() : e) && e.nodeType;
        return (
          this.each(function (t) {
            for (; (t = t[i]); ) if ((n && t === e) || new c(t).is(e)) return void (s = t);
          }),
          new c(s)
        );
      },
      _toArray: function (t) {
        if (t instanceof NodeList) {
          for (var e = [], i = 0; i < t.length; i++) e[i] = t[i];
          return e;
        }
        return void 0 === t ? [] : t.sdom ? t.nodes : t;
      },
      _toParams: function (t) {
        var e = '';
        for (var i in t) e += '&' + this._encodeUri(i) + '=' + this._encodeUri(t[i]);
        return e.replace(/^&/, '');
      },
      _toObject: function (t) {
        return new Function('return ' + t)();
      },
      _encodeUri: function (t) {
        return encodeURIComponent(t)
          .replace(/!/g, '%21')
          .replace(/'/g, '%27')
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
          .replace(/\*/g, '%2A')
          .replace(/%20/g, '+');
      },
      _isNumber: function (t) {
        return !isNaN(t) && !isNaN(parseFloat(t));
      },
      _isObjectString: function (t) {
        return -1 !== t.search(/^{/);
      },
      _getBooleanFromStr: function (t) {
        return 'true' === t || ('false' !== t && t);
      },
      _hasDisplayNone: function (t) {
        return (
          'none' === t.style.display ||
          'none' === (t.currentStyle ? t.currentStyle.display : getComputedStyle(t, null).display)
        );
      },
    });
  function y(t, e) {
    return i(t, e, [].slice.call(arguments, 2));
  }
  var p = 0;
  (y.app = []),
    (y.version = '3.5.2'),
    (y.options = {}),
    (y.modules = {}),
    (y.services = {}),
    (y.classes = {}),
    (y.plugins = {}),
    (y.mixins = {}),
    (y.modals = {}),
    (y.lang = {}),
    (y.dom = function (t, e) {
      return new c(t, e);
    }),
    (y.ajax = s),
    (y.Dom = c),
    (y.keycodes = {
      BACKSPACE: 8,
      DELETE: 46,
      UP: 38,
      DOWN: 40,
      ENTER: 13,
      SPACE: 32,
      ESC: 27,
      TAB: 9,
      CTRL: 17,
      META: 91,
      SHIFT: 16,
      ALT: 18,
      RIGHT: 39,
      LEFT: 37,
    }),
    (y.env = { plugin: 'plugins', module: 'modules', service: 'services', class: 'classes', mixin: 'mixins' }),
    void 0 !== jQuery &&
      (jQuery.fn.redactor = function (t) {
        return i(this.toArray(), t, [].slice.call(arguments, 1));
      });
  var i = function (t, e, i) {
    for (
      var s,
        n = 'redactor',
        r = Array.isArray(t) ? t : t && t.nodeType ? [t] : document.querySelectorAll(t),
        o = 'string' == typeof e || 'function' == typeof e,
        a = [],
        l = 0;
      l < r.length;
      l++
    ) {
      var h = r[l],
        c = y.dom(h);
      if (((s = c.dataget(n)) || o || ((s = new f(h, e, p)), c.dataset(n, s), (y.app[p] = s), p++), s && o)) {
        var d,
          u = 'destroy' === e;
        void 0 !==
          (d = 'function' == typeof (e = u ? 'stop' : e) ? e.apply(s, i) : (i.unshift(e), s.api.apply(s, i))) &&
          a.push(d),
          u && c.dataset(n, !1);
      }
    }
    return 0 === a.length || 1 === a.length ? (0 === a.length ? s : a[0]) : a;
  };
  (y.add = function (t, e, i) {
    if (void 0 !== y.env[t])
      if (
        (i.translations && (y.lang = y.extend(!0, {}, y.lang, i.translations)),
        i.modals && (y.modals = y.extend(!0, {}, y.modals, i.modals)),
        'mixin' === t)
      )
        y[y.env[t]][e] = i;
      else {
        function s() {}
        if ((s.prototype = i).mixins) for (var n = 0; n < i.mixins.length; n++) y.inherit(s, y.mixins[i.mixins[n]]);
        y[y.env[t]][e] = s;
      }
  }),
    (y.addLang = function (t, e) {
      void 0 === y.lang[t] && (y.lang[t] = {}), (y.lang[t] = y.extend(y.lang[t], e));
    }),
    (y.create = function (t) {
      var e = t.split('.'),
        i = [].slice.call(arguments, 1),
        s = 'classes';
      void 0 !== y.env[e[0]] && ((s = y.env[e[0]]), (t = e.slice(1).join('.')));
      var n = new y[s][t]();
      if (n.init) {
        var r = n.init.apply(n, i);
        return r || n;
      }
      return n;
    }),
    (y.inherit = function (t, e) {
      function i() {}
      i.prototype = e;
      var s = new i();
      for (var n in t.prototype)
        t.prototype.__lookupGetter__(n)
          ? s.__defineGetter__(n, t.prototype.__lookupGetter__(n))
          : (s[n] = t.prototype[n]);
      return (t.prototype = s), (t.prototype.super = e), t;
    }),
    (y.error = function (t) {
      throw t;
    }),
    (y.extend = function () {
      var i = {},
        s = !1,
        t = 0,
        e = arguments.length;
      '[object Boolean]' === Object.prototype.toString.call(arguments[0]) && ((s = arguments[0]), t++);
      function n(t) {
        for (var e in t)
          Object.prototype.hasOwnProperty.call(t, e) &&
            (s && '[object Object]' === Object.prototype.toString.call(t[e])
              ? (i[e] = y.extend(!0, i[e], t[e]))
              : (i[e] = t[e]));
      }
      for (; t < e; t++) {
        n(arguments[t]);
      }
      return i;
    }),
    (y.opts = {
      animation: !0,
      lang: 'en',
      direction: 'ltr',
      spellcheck: !0,
      structure: !1,
      scrollTarget: !1,
      styles: !0,
      stylesClass: 'redactor-styles',
      placeholder: !1,
      source: !0,
      showSource: !1,
      inline: !1,
      breakline: !1,
      markup: 'p',
      enterKey: !0,
      clickToEdit: !1,
      clickToSave: !1,
      clickToCancel: !1,
      focus: !1,
      focusEnd: !1,
      minHeight: !1,
      maxHeight: !1,
      maxWidth: !1,
      plugins: [],
      callbacks: {},
      preClass: !1,
      preSpaces: 4,
      tabindex: !1,
      tabAsSpaces: !1,
      tabKey: !0,
      autosave: !1,
      autosaveName: !1,
      autosaveData: !1,
      autosaveMethod: 'post',
      toolbar: !0,
      toolbarFixed: !0,
      toolbarFixedTarget: document,
      toolbarFixedTopOffset: 0,
      toolbarExternal: !1,
      toolbarContext: !0,
      air: !1,
      formatting: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      formattingAdd: !1,
      formattingHide: !1,
      buttons: ['html', 'format', 'bold', 'italic', 'deleted', 'lists', 'image', 'file', 'link'],
      buttonsTextLabeled: !1,
      buttonsAdd: [],
      buttonsAddFirst: [],
      buttonsAddAfter: !1,
      buttonsAddBefore: !1,
      buttonsHide: [],
      buttonsHideOnMobile: [],
      imageUpload: !1,
      imageUploadParam: 'file',
      imageData: !1,
      imageEditable: !0,
      imageCaption: !0,
      imageLink: !0,
      imagePosition: !1,
      imageResizable: !1,
      imageFloatMargin: '10px',
      imageFigure: !0,
      imageObserve: !0,
      imageSrcData: !1,
      fileUpload: !1,
      fileUploadParam: 'file',
      fileData: !1,
      fileAttachment: !1,
      uploadData: !1,
      dragUpload: !0,
      multipleUpload: !0,
      clipboardUpload: !0,
      uploadBase64: !1,
      linkTarget: !1,
      linkTitle: !1,
      linkNewTab: !0,
      linkNofollow: !1,
      linkSize: 30,
      linkValidation: !0,
      cleanOnEnter: !0,
      cleanInlineOnEnter: !1,
      paragraphize: !0,
      removeScript: !0,
      removeNewLines: !1,
      removeComments: !0,
      replaceTags: { b: 'strong', i: 'em', strike: 'del' },
      pastePlainText: !1,
      pasteLinkTarget: !1,
      pasteImages: !0,
      pasteLinks: !0,
      pasteClean: !0,
      pasteKeepStyle: [],
      pasteKeepClass: [],
      pasteKeepAttrs: ['td', 'th'],
      pasteBlockTags: [
        'pre',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'table',
        'tbody',
        'thead',
        'tfoot',
        'th',
        'tr',
        'td',
        'ul',
        'ol',
        'li',
        'blockquote',
        'p',
        'figure',
        'figcaption',
      ],
      pasteInlineTags: [
        'a',
        'img',
        'br',
        'strong',
        'ins',
        'code',
        'del',
        'span',
        'samp',
        'kbd',
        'sup',
        'sub',
        'mark',
        'var',
        'cite',
        'small',
        'b',
        'u',
        'em',
        'i',
        'abbr',
      ],
      activeButtons: {
        b: 'bold',
        strong: 'bold',
        i: 'italic',
        em: 'italic',
        del: 'deleted',
        strike: 'deleted',
        u: 'underline',
      },
      activeButtonsAdd: {},
      activeButtonsObservers: {},
      autoparse: !0,
      autoparseStart: !0,
      autoparsePaste: !0,
      autoparseLinks: !0,
      autoparseImages: !0,
      autoparseVideo: !0,
      autoparseHttps: !1,
      shortcodes: {
        'p.': { format: 'p' },
        'quote.': { format: 'blockquote' },
        'pre.': { format: 'pre' },
        'h1.': { format: 'h1' },
        'h2.': { format: 'h2' },
        'h3.': { format: 'h3' },
        'h4.': { format: 'h4' },
        'h5.': { format: 'h5' },
        'h6.': { format: 'h6' },
        '*.': { format: 'ul' },
      },
      shortcodesAdd: !1,
      shortcuts: {
        'ctrl+shift+m, meta+shift+m': { api: 'module.inline.clearformat' },
        'ctrl+b, meta+b': { api: 'module.inline.format', args: 'b' },
        'ctrl+i, meta+i': { api: 'module.inline.format', args: 'i' },
        'ctrl+u, meta+u': { api: 'module.inline.format', args: 'u' },
        'ctrl+h, meta+h': { api: 'module.inline.format', args: 'sup' },
        'ctrl+l, meta+l': { api: 'module.inline.format', args: 'sub' },
        'ctrl+k, meta+k': { api: 'module.link.open' },
        'ctrl+alt+0, meta+alt+0': { api: 'module.block.format', args: 'p' },
        'ctrl+alt+1, meta+alt+1': { api: 'module.block.format', args: 'h1' },
        'ctrl+alt+2, meta+alt+2': { api: 'module.block.format', args: 'h2' },
        'ctrl+alt+3, meta+alt+3': { api: 'module.block.format', args: 'h3' },
        'ctrl+alt+4, meta+alt+4': { api: 'module.block.format', args: 'h4' },
        'ctrl+alt+5, meta+alt+5': { api: 'module.block.format', args: 'h5' },
        'ctrl+alt+6, meta+alt+6': { api: 'module.block.format', args: 'h6' },
        'ctrl+shift+7, meta+shift+7': { api: 'module.list.toggle', args: 'ol' },
        'ctrl+shift+8, meta+shift+8': { api: 'module.list.toggle', args: 'ul' },
      },
      shortcutsAdd: !1,
      grammarly: !0,
      notranslate: !1,
      bufferLimit: 100,
      emptyHtml: '<p></p>',
      markerChar: '\ufeff',
      imageTypes: ['image/png', 'image/jpeg', 'image/gif'],
      imageAttrs: ['alt', 'title', 'src', 'class', 'width', 'height', 'srcset'],
      inlineTags: [
        'a',
        'span',
        'strong',
        'strike',
        'b',
        'u',
        'em',
        'i',
        'code',
        'del',
        'ins',
        'samp',
        'kbd',
        'sup',
        'sub',
        'mark',
        'var',
        'cite',
        'small',
        'abbr',
      ],
      blockTags: [
        'pre',
        'ul',
        'ol',
        'li',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'dl',
        'dt',
        'dd',
        'div',
        'table',
        'tbody',
        'thead',
        'tfoot',
        'tr',
        'th',
        'td',
        'blockquote',
        'output',
        'figcaption',
        'figure',
        'address',
        'section',
        'header',
        'footer',
        'aside',
        'article',
        'iframe',
      ],
      regex: {
        youtube:
          /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/gi,
        vimeo:
          /(http|https)?:\/\/(?:www.|player.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:\/[a-zA-Z0-9_-]+)?/gi,
        imageurl: /((https?|www)[^\s]+\.)(jpe?g|png|gif)(\?[^\s-]+)?/gi,
        url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z\u00F0-\u02AF0-9()!@:%_+.~#?&//=]*)/gi,
        aurl1: /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
        aurl2: /(^|[^\/])(www\.[\S]+(\b|$))/gim,
      },
      input: !0,
      zindex: !1,
      modes: {
        inline: {
          pastePlainText: !0,
          pasteImages: !1,
          enterKey: !1,
          toolbar: !1,
          autoparse: !1,
          source: !1,
          showSource: !1,
          styles: !1,
          air: !1,
        },
        original: { styles: !1 },
      },
    }),
    (y.lang.en = {
      format: 'Format',
      image: 'Image',
      file: 'File',
      link: 'Link',
      bold: 'Bold',
      italic: 'Italic',
      deleted: 'Strikethrough',
      underline: 'Underline',
      superscript: 'Superscript',
      subscript: 'Subscript',
      'bold-abbr': 'B',
      'italic-abbr': 'I',
      'deleted-abbr': 'S',
      'underline-abbr': 'U',
      'superscript-abbr': 'Sup',
      'subscript-abbr': 'Sub',
      lists: 'Lists',
      'link-insert': 'Insert Link',
      'link-edit': 'Edit Link',
      'link-in-new-tab': 'Open link in new tab',
      unlink: 'Unlink',
      cancel: 'Cancel',
      close: 'Close',
      insert: 'Insert',
      save: 'Save',
      delete: 'Delete',
      text: 'Text',
      edit: 'Edit',
      title: 'Alt',
      paragraph: 'Normal text',
      quote: 'Quote',
      code: 'Code',
      heading1: 'Heading 1',
      heading2: 'Heading 2',
      heading3: 'Heading 3',
      heading4: 'Heading 4',
      heading5: 'Heading 5',
      heading6: 'Heading 6',
      filename: 'Name',
      optional: 'optional',
      unorderedlist: 'Unordered List',
      orderedlist: 'Ordered List',
      outdent: 'Outdent',
      indent: 'Indent',
      horizontalrule: 'Line',
      upload: 'Upload',
      'upload-label': 'Drop files here or click to upload',
      'accessibility-help-label': 'Rich text editor',
      caption: 'Caption',
      bulletslist: 'Bullets',
      numberslist: 'Numbers',
      'image-position': 'Position',
      none: 'None',
      left: 'Left',
      right: 'Right',
      center: 'Center',
      undo: 'Undo',
      redo: 'Redo',
    }),
    (y.buttons = {
      html: { title: 'HTML', icon: !0, api: 'module.source.toggle' },
      undo: { title: '## undo ##', icon: !0, api: 'module.buffer.undo' },
      redo: { title: '## redo ##', icon: !0, api: 'module.buffer.redo' },
      format: {
        title: '## format ##',
        icon: !0,
        dropdown: {
          p: { title: '## paragraph ##', api: 'module.block.format', args: { tag: 'p' } },
          blockquote: { title: '## quote ##', api: 'module.block.format', args: { tag: 'blockquote' } },
          pre: { title: '## code ##', api: 'module.block.format', args: { tag: 'pre' } },
          h1: { title: '## heading1 ##', api: 'module.block.format', args: { tag: 'h1' } },
          h2: { title: '## heading2 ##', api: 'module.block.format', args: { tag: 'h2' } },
          h3: { title: '## heading3 ##', api: 'module.block.format', args: { tag: 'h3' } },
          h4: { title: '## heading4 ##', api: 'module.block.format', args: { tag: 'h4' } },
          h5: { title: '## heading5 ##', api: 'module.block.format', args: { tag: 'h5' } },
          h6: { title: '## heading6 ##', api: 'module.block.format', args: { tag: 'h6' } },
        },
      },
      bold: {
        title: '## bold-abbr ##',
        icon: !0,
        tooltip: '## bold ##',
        api: 'module.inline.format',
        args: { tag: 'b' },
      },
      italic: {
        title: '## italic-abbr ##',
        icon: !0,
        tooltip: '## italic ##',
        api: 'module.inline.format',
        args: { tag: 'i' },
      },
      deleted: {
        title: '## deleted-abbr ##',
        icon: !0,
        tooltip: '## deleted ##',
        api: 'module.inline.format',
        args: { tag: 'del' },
      },
      underline: {
        title: '## underline-abbr ##',
        icon: !0,
        tooltip: '## underline ##',
        api: 'module.inline.format',
        args: { tag: 'u' },
      },
      sup: {
        title: '## superscript-abbr ##',
        icon: !0,
        tooltip: '## superscript ##',
        api: 'module.inline.format',
        args: { tag: 'sup' },
      },
      sub: {
        title: '## subscript-abbr ##',
        icon: !0,
        tooltip: '## subscript ##',
        api: 'module.inline.format',
        args: { tag: 'sub' },
      },
      lists: {
        title: '## lists ##',
        icon: !0,
        observe: 'list',
        dropdown: {
          observe: 'list',
          unorderedlist: { title: '&bull; ## unorderedlist ##', api: 'module.list.toggle', args: 'ul' },
          orderedlist: { title: '1. ## orderedlist ##', api: 'module.list.toggle', args: 'ol' },
          outdent: { title: '< ## outdent ##', api: 'module.list.outdent' },
          indent: { title: '> ## indent ##', api: 'module.list.indent' },
        },
      },
      ul: { title: '&bull; ## bulletslist ##', icon: !0, api: 'module.list.toggle', observe: 'list', args: 'ul' },
      ol: { title: '1. ## numberslist ##', icon: !0, api: 'module.list.toggle', observe: 'list', args: 'ol' },
      outdent: { title: '## outdent ##', icon: !0, api: 'module.list.outdent', observe: 'list' },
      indent: { title: '## indent ##', icon: !0, api: 'module.list.indent', observe: 'list' },
      image: { title: '## image ##', icon: !0, api: 'module.image.open' },
      file: { title: '## file ##', icon: !0, api: 'module.file.open' },
      link: {
        title: '## link ##',
        icon: !0,
        observe: 'link',
        dropdown: {
          observe: 'link',
          link: { title: '## link-insert ##', api: 'module.link.open' },
          unlink: { title: '## unlink ##', api: 'module.link.unlink' },
        },
      },
      line: { title: '## horizontalrule ##', icon: !0, api: 'module.line.insert' },
    });
  var f = function (t, e, i) {
    (this.module = {}),
      (this.plugin = {}),
      (this.instances = {}),
      (this.started = !1),
      (this.stopped = !1),
      (this.uuid = i),
      (this.rootElement = t),
      (this.rootOpts = e),
      (this.dragInside = !1),
      (this.dragComponentInside = !1),
      (this.keycodes = y.keycodes),
      (this.namespace = 'redactor'),
      (this.$win = y.dom(window)),
      (this.$doc = y.dom(document)),
      (this.$body = y.dom('body')),
      (this.editorReadOnly = !1),
      (this.opts = y.create('service.options', e, t)),
      (this.lang = y.create('service.lang', this)),
      this.buildServices(),
      this.buildModules(),
      this.buildPlugins(),
      this.start();
  };
  (f.prototype = {
    start: function () {
      (this.stopped = !1),
        this.broadcast('start'),
        this.broadcast('startcode'),
        this.opts.clickToEdit
          ? this.broadcast('startclicktoedit')
          : (this.broadcast('enable'),
            this.opts.showSource && this.broadcast('startcodeshow'),
            this.broadcast('enablefocus')),
        this.broadcast('started'),
        (this.started = !0);
    },
    stop: function () {
      (this.started = !1),
        (this.stopped = !0),
        this.broadcast('stop'),
        this.broadcast('disable'),
        this.broadcast('stopped');
    },
    isStarted: function () {
      return this.started;
    },
    isStopped: function () {
      return this.stopped;
    },
    buildServices: function () {
      var t = ['options', 'lang'],
        e = ['uuid', 'keycodes', 'opts', 'lang', '$win', '$doc', '$body'],
        i = [];
      for (var s in y.services)
        -1 === t.indexOf(s) && ((this[s] = y.create('service.' + s, this)), i.push(s), e.push(s));
      for (var n = 0; n < i.length; n++)
        for (var r = i[n], o = 0; o < e.length; o++) {
          var a = e[o];
          r !== a && (this[r][a] = this[a]);
        }
    },
    buildModules: function () {
      for (var t in y.modules) (this.module[t] = y.create('module.' + t, this)), (this.instances[t] = this.module[t]);
    },
    buildPlugins: function () {
      for (var t = this.opts.plugins, e = 0; e < t.length; e++) {
        var i = t[e];
        void 0 !== y.plugins[i] &&
          ((this.plugin[i] = y.create('plugin.' + i, this)), (this.instances[i] = this.plugin[i]));
      }
    },
    isDragInside: function () {
      return this.dragInside;
    },
    setDragInside: function (t) {
      this.dragInside = t;
    },
    isDragComponentInside: function () {
      return this.dragComponentInside;
    },
    setDragComponentInside: function (t) {
      this.dragComponentInside = t;
    },
    getDragComponentInside: function () {
      return this.dragComponentInside;
    },
    isReadOnly: function () {
      return this.editorReadOnly;
    },
    enableReadOnly: function () {
      (this.editorReadOnly = !0),
        this.broadcast('enablereadonly'),
        this.component.clearActive(),
        this.toolbar.disableButtons();
    },
    disableReadOnly: function () {
      (this.editorReadOnly = !1), this.broadcast('disablereadonly'), this.toolbar.enableButtons();
    },
    callMessageHandler: function (t, e, i) {
      var s,
        n = e.split('.');
      if (1 === n.length) 'function' == typeof t['on' + e] && (s = t['on' + e].apply(t, i));
      else {
        n[0] = 'on' + n[0];
        var r = this.utils.checkProperty(t, n);
        'function' == typeof r && (s = r.apply(t, i));
      }
      return s;
    },
    broadcast: function (t) {
      var e,
        i = [].slice.call(arguments, 1);
      for (var s in this.instances) {
        var n = this.callMessageHandler(this.instances[s], t, i);
        void 0 !== n && (e = n);
      }
      var r = this.callback.trigger(t, i);
      return void 0 !== e ? e : r;
    },
    on: function (t, e) {
      this.callback.add(t, e);
    },
    off: function (t, e) {
      this.callback.remove(t, e);
    },
    api: function (t) {
      if ((this.isStarted() || 'start' === t) && (!this.isReadOnly() || 'disableReadOnly' === t)) {
        this.broadcast('state');
        var e = [].slice.call(arguments, 1),
          i = t.split('.'),
          s = 1 === i.length,
          n = 'on' === i[0] || 'off' === i[0],
          r = !n && 2 === i.length,
          o = 'plugin' === i[0],
          a = 'module' === i[0];
        if (s) {
          if ('function' == typeof this[i[0]]) return this.callInstanceMethod(this, i[0], e);
        } else {
          if (n) return 'on' === i[0] ? this.on(i[1], e[0]) : this.off(i[1], e[0] || void 0);
          if (r) {
            if (this.isInstanceExists(this, i[0])) return this.callInstanceMethod(this[i[0]], i[1], e);
            y.error(new Error('Service "' + i[0] + '" not found'));
          } else if (o) {
            if (this.isInstanceExists(this.plugin, i[1])) return this.callInstanceMethod(this.plugin[i[1]], i[2], e);
            y.error(new Error('Plugin "' + i[1] + '" not found'));
          } else if (a) {
            if (this.isInstanceExists(this.module, i[1])) return this.callInstanceMethod(this.module[i[1]], i[2], e);
            y.error(new Error('Module "' + i[1] + '" not found'));
          }
        }
      }
    },
    isInstanceExists: function (t, e) {
      return void 0 !== t[e];
    },
    callInstanceMethod: function (t, e, i) {
      if ('function' == typeof t[e]) return t[e].apply(t, i);
    },
  }),
    y.add('mixin', 'formatter', {
      buildArgs: function (t) {
        (this.args = { class: t.class || !1, style: t.style || !1, attr: t.attr || !1 }),
          this.args.class || this.args.style || this.args.attr || (this.args = !1);
      },
      applyArgs: function (t, e) {
        return (t = this.args ? this[this.type](this.args, !1, t, e) : this._clearAll(t, e));
      },
      clearClass: function (t, e) {
        this.selection.save();
        var i = e ? y.dom(e) : this.getElements(t, !0);
        return i.removeAttr('class'), (e = this._unwrapSpanWithoutAttr(i.getAll())), this.selection.restore(), e;
      },
      clearStyle: function (t, e) {
        this.selection.save();
        var i = e ? y.dom(e) : this.getElements(t, !0);
        return i.removeAttr('style'), (e = this._unwrapSpanWithoutAttr(i.getAll())), this.selection.restore(), e;
      },
      clearAttr: function (t, e) {
        this.selection.save();
        var i = e ? y.dom(e) : this.getElements(t, !0);
        return this._removeAllAttr(i), (e = this._unwrapSpanWithoutAttr(i.getAll())), this.selection.restore(), e;
      },
      set: function (t, e, i, s) {
        !1 !== s && this.selection.save();
        var n = i ? y.dom(i) : this.getElements(e);
        return (
          t.class && (n.removeAttr('class'), n.addClass(t.class)),
          t.style &&
            (n.removeAttr('style'),
            n.css(t.style),
            n.each(function (t) {
              var e = y.dom(t);
              e.attr('data-redactor-style-cache', e.attr('style'));
            })),
          t.attr && (this._removeAllAttr(n), n.attr(t.attr)),
          !1 !== s && this.selection.restore(),
          n.getAll()
        );
      },
      toggle: function (t, e, i, s) {
        !1 !== s && this.selection.save();
        var r,
          n = i ? y.dom(i) : this.getElements(e);
        return (
          t.class &&
            (n.toggleClass(t.class),
            n.each(function (t) {
              '' === t.className && t.removeAttribute('class');
            })),
          t.style &&
            ((r = t.style),
            n.each(
              function (t) {
                var e = y.dom(t);
                for (var i in r) {
                  var s = r[i],
                    n = e.css(i);
                  (n = this.utils.isRgb(n) ? this.utils.rgb2hex(n) : n.replace(/"/g, '')),
                    (s = this.utils.isRgb(s) ? this.utils.rgb2hex(s) : s.replace(/"/g, '')),
                    (n = this.utils.hex2long(n)),
                    ('string' == typeof (s = this.utils.hex2long(s)) ? s.toLowerCase() : s) ===
                    ('string' == typeof n ? n.toLowerCase() : n)
                      ? e.css(i, '')
                      : e.css(i, s);
                }
                this._convertStyleQuotes(e),
                  this.utils.removeEmptyAttr(t, 'style')
                    ? e.removeAttr('data-redactor-style-cache')
                    : e.attr('data-redactor-style-cache', e.attr('style'));
              }.bind(this)
            )),
          t.attr &&
            ((r = t.attr),
            n.each(function (t) {
              var e = y.dom(t);
              for (var i in r) e.attr(i) ? e.removeAttr(i) : e.attr(i, r[i]);
            })),
          !1 !== s && this.selection.restore(),
          n.getAll()
        );
      },
      add: function (t, e, i, s) {
        !1 !== s && this.selection.save();
        var n = i ? y.dom(i) : this.getElements(e);
        if ((t.class && n.addClass(t.class), t.style)) {
          var r = t.style;
          n.each(
            function (t) {
              var e = y.dom(t);
              e.css(r), e.attr('data-redactor-style-cache', e.attr('style')), this._convertStyleQuotes(e);
            }.bind(this)
          );
        }
        return t.attr && n.attr(t.attr), !1 !== s && this.selection.restore(), n.getAll();
      },
      remove: function (t, e, i, s) {
        !1 !== s && this.selection.save();
        var n = i ? y.dom(i) : this.getElements(e);
        if (
          (t.class &&
            (n.removeClass(t.class),
            n.each(function (t) {
              '' === t.className && t.removeAttribute('class');
            })),
          t.style)
        ) {
          var r = t.style;
          n.each(
            function (t) {
              var e = y.dom(t);
              e.css(r, ''),
                this.utils.removeEmptyAttr(t, 'style')
                  ? e.removeAttr('data-redactor-style-cache')
                  : e.attr('data-redactor-style-cache', e.attr('style'));
            }.bind(this)
          );
        }
        return (
          t.attr && n.removeAttr(t.attr),
          (i = this._unwrapSpanWithoutAttr(n.getAll())),
          !1 !== s && this.selection.restore(),
          i
        );
      },
      _removeAllAttr: function (t) {
        t.each(function (t) {
          for (var e = t.attributes.length; 0 < e--; ) {
            var i = t.attributes[e],
              s = i.name;
            'style' !== s && 'class' !== s && t.removeAttributeNode(i);
          }
        });
      },
      _convertStyleQuotes: function (t) {
        var e = t.attr('style');
        e && t.attr('style', e.replace(/"/g, "'"));
      },
      _clearAll: function (t, e) {
        !1 !== e && this.selection.save();
        for (var i = 0; i < t.length; i++)
          for (var s = t[i]; 0 < s.attributes.length; ) s.removeAttribute(s.attributes[0].name);
        return (t = this._unwrapSpanWithoutAttr(t)), !1 !== e && this.selection.restore(), t;
      },
      _unwrapSpanWithoutAttr: function (t) {
        for (var e = [], i = 0; i < t.length; i++) {
          var s = t[i];
          s.attributes.length <= 0 && 3 !== s.nodeType && 'SPAN' === s.tagName ? y.dom(s).unwrap() : e.push(s);
        }
        return e;
      },
    }),
    y.add('mixin', 'dom', y.Dom.prototype),
    y.add('mixin', 'component', {
      get cmnt() {
        return !0;
      },
    }),
    y.add('service', 'options', {
      init: function (t, e) {
        var i = y.dom(e),
          s = y.extend({}, y.opts, e ? i.data() : {}, y.options);
        return (s = y.extend(!0, s, t));
      },
    }),
    y.add('service', 'lang', {
      init: function (t) {
        (this.app = t), (this.opts = t.opts), (this.vars = this._build(this.opts.lang));
      },
      rebuild: function (t) {
        (this.opts.lang = t), (this.vars = this._build(t));
      },
      extend: function (t) {
        this.vars = y.extend(this.vars, t);
      },
      parse: function (t) {
        if (void 0 === t) return '';
        var e = t.match(/## (.*?) ##/g);
        if (e)
          for (var i = 0; i < e.length; i++) {
            var s = e[i].replace(/^##\s/g, '').replace(/\s##$/g, '');
            t = t.replace(e[i], this.get(s));
          }
        return t;
      },
      get: function (t) {
        var e = '';
        return (
          void 0 !== this.vars[t]
            ? (e = this.vars[t])
            : 'en' !== this.opts.lang && void 0 !== y.lang.en[t] && (e = y.lang.en[t]),
          e
        );
      },
      _build: function (t) {
        var e = y.lang.en;
        return 'en' !== t && (e = void 0 !== y.lang[t] ? y.lang[t] : e), e;
      },
    }),
    y.add('service', 'callback', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.callbacks = {}),
          this.opts.callbacks && this._set(this.opts.callbacks, '');
      },
      stop: function () {
        this.callbacks = {};
      },
      add: function (t, e) {
        this.callbacks[t] || (this.callbacks[t] = []), this.callbacks[t].push(e);
      },
      remove: function (t, e) {
        if (void 0 === e) delete this.callbacks[t];
        else {
          for (var i = 0; i < this.callbacks[t].length; i++) this.callbacks[t].splice(i, 1);
          0 === Object.keys(this.callbacks[t]).length && delete this.callbacks[t];
        }
      },
      trigger: function (t, e) {
        var i = this._loop(t, e, this.callbacks);
        return void 0 === i && e && !1 !== e[0] ? e[0] : i;
      },
      _set: function (t, e) {
        for (var i in t) {
          var s = '' === e ? i : e + '.' + i;
          'object' == typeof t[i] ? this._set(t[i], s) : ((this.callbacks[s] = []), this.callbacks[s].push(t[i]));
        }
      },
      _loop: function (t, e, i) {
        var s;
        for (var n in i) if (t === n) for (var r = 0; r < i[n].length; r++) s = i[n][r].apply(this.app, e);
        return s;
      },
    }),
    y.add('service', 'animate', {
      init: function (t) {
        this.animationOpt = t.opts.animation;
      },
      start: function (t, e, i, s) {
        var n = { duration: !1, iterate: !1, delay: !1, timing: !1, prefix: 'redactor-' };
        return (
          (n = 'function' == typeof i ? n : y.extend(n, i)),
          new y.AnimatePlay(t, e, n, (s = 'function' == typeof i ? i : s), this.animationOpt)
        );
      },
      stop: function (t) {
        (this.$el = y.dom(t)), this.$el.removeClass('redactor-animated');
        var e = this.$el.attr('redactor-animate-effect');
        this.$el.removeClass(e), this.$el.removeAttr('redactor-animate-effect');
        var i = this.$el.attr('redactor-animate-hide');
        i && this.$el.addClass(i).removeAttr('redactor-animate-hide'), this.$el.off('animationend webkitAnimationEnd');
      },
    }),
    ((y.AnimatePlay = function (t, e, i, s, n) {
      return (
        (this.hidableEffects = [
          'fadeOut',
          'flipOut',
          'slideUp',
          'zoomOut',
          'slideOutUp',
          'slideOutRight',
          'slideOutLeft',
        ]),
        (this.prefixes = ['', '-webkit-']),
        (this.$el = y.dom(t)),
        (this.$body = y.dom('body')),
        (this.callback = s),
        (this.animation = n ? e : this.buildAnimationOff(e)),
        (this.defaults = i),
        'slideUp' === this.animation && this.$el.height(this.$el.height()),
        this.isInanimate() ? this.inanimate() : this.animate()
      );
    }).prototype = {
      buildAnimationOff: function (t) {
        return this.isHidable(t) ? 'hide' : 'show';
      },
      buildHideClass: function () {
        return 'redactor-animate-hide';
      },
      isInanimate: function () {
        return 'show' === this.animation || 'hide' === this.animation;
      },
      isAnimated: function () {
        return this.$el.hasClass('redactor-animated');
      },
      isHidable: function (t) {
        return -1 !== this.hidableEffects.indexOf(t);
      },
      inanimate: function () {
        var t;
        return (
          (this.defaults.timing = 'linear'),
          'show' === this.animation
            ? ((t = this.buildHideClass()), this.$el.attr('redactor-animate-hide', t), this.$el.removeClass(t))
            : ((t = this.$el.attr('redactor-animate-hide')), this.$el.addClass(t).removeAttr('redactor-animate-hide')),
          'function' == typeof this.callback && this.callback(this),
          this
        );
      },
      animate: function () {
        var t = this.defaults.delay ? this.defaults.delay : 0;
        return (
          setTimeout(
            function () {
              if (
                (this.$body.addClass('no-scroll-x'),
                this.$el.addClass('redactor-animated'),
                !this.$el.attr('redactor-animate-hide'))
              ) {
                var t = this.buildHideClass();
                this.$el.attr('redactor-animate-hide', t), this.$el.removeClass(t);
              }
              this.$el.addClass(this.defaults.prefix + this.animation),
                this.$el.attr('redactor-animate-effect', this.defaults.prefix + this.animation),
                this.set(this.defaults.duration + 's', this.defaults.iterate, this.defaults.timing),
                this.complete();
            }.bind(this),
            1e3 * t
          ),
          this
        );
      },
      set: function (t, e, i) {
        for (var s = this.prefixes.length; s--; )
          (!1 === t && '' !== t) || this.$el.css(this.prefixes[s] + 'animation-duration', t),
            (!1 === e && '' !== e) || this.$el.css(this.prefixes[s] + 'animation-iteration-count', e),
            (!1 === i && '' !== i) || this.$el.css(this.prefixes[s] + 'animation-timing-function', i);
      },
      clean: function () {
        this.$body.removeClass('no-scroll-x'),
          this.$el.removeClass('redactor-animated'),
          this.$el.removeClass(this.defaults.prefix + this.animation),
          this.$el.removeAttr('redactor-animate-effect'),
          this.set('', '', '');
      },
      complete: function () {
        this.$el.one(
          'animationend webkitAnimationEnd',
          function () {
            if (
              (this.$el.hasClass(this.defaults.prefix + this.animation) && this.clean(), this.isHidable(this.animation))
            ) {
              var t = this.$el.attr('redactor-animate-hide');
              this.$el.addClass(t).removeAttr('redactor-animate-hide');
            }
            'slideUp' === this.animation && this.$el.height(''),
              'function' == typeof this.callback && this.callback(this.$el);
          }.bind(this)
        );
      },
    }),
    y.add('service', 'caret', {
      init: function (t) {
        this.app = t;
      },
      setStart: function (t) {
        this._setCaret('Start', t);
      },
      setEnd: function (t) {
        this._setCaret('End', t);
      },
      setBefore: function (t) {
        this._setCaret('Before', t);
      },
      setAfter: function (t) {
        this._setCaret('After', t);
      },
      isStart: function (t) {
        return this._isStartOrEnd(t, 'First');
      },
      isEnd: function (t) {
        return this._isStartOrEnd(t, 'Last');
      },
      setAtEnd: function (t) {
        var e = this.inspector.parse(t).getTag(),
          i = document.createRange();
        if (this._isInPage(t)) {
          if ('a' === e) {
            var s = this.utils.createInvisibleChar();
            y.dom(t).after(s), i.selectNodeContents(s), i.collapse(!0);
          } else i.selectNodeContents(t), i.collapse(!1);
          this.selection.setRange(i);
        }
      },
      setAtStart: function (t) {
        var e = document.createRange(),
          i = this.inspector.parse(t);
        if (this._isInPage(t)) {
          if ((e.setStart(t, 0), e.collapse(!0), i.isInline())) {
            var s = this.utils.createInvisibleChar();
            e.insertNode(s), e.selectNodeContents(s), e.collapse(!1);
          }
          this.selection.setRange(e);
        }
      },
      setAtBefore: function (t) {
        var e = this.inspector.parse(t),
          i = document.createRange();
        if (this._isInPage(t)) {
          if ((i.setStartBefore(t), i.collapse(!0), e.isInline())) {
            var s = this.utils.createInvisibleChar();
            t.parentNode.insertBefore(s, t), i.selectNodeContents(s), i.collapse(!1);
          }
          this.selection.setRange(i);
        }
      },
      setAtAfter: function (t) {
        var e = document.createRange();
        if (this._isInPage(t)) {
          e.setStartAfter(t), e.collapse(!0);
          var i = this.utils.createInvisibleChar();
          e.insertNode(i), e.selectNodeContents(i), e.collapse(!1), this.selection.setRange(e);
        }
      },
      setAtPrev: function (t) {
        var e = t.previousSibling;
        (e = e && (3 === e.nodeType && this._isEmptyTextNode(e) ? e.previousElementSibling : e)) && this.setEnd(e);
      },
      setAtNext: function (t) {
        var e = t.nextSibling;
        (e = e && (3 === e.nodeType && this._isEmptyTextNode(e) ? e.nextElementSibling : e)) && this.setStart(e);
      },
      _setCaret: function (t, e) {
        var i = this.inspector.parse(e),
          s = i.getNode();
        s && (this.component.clearActive(), this['_set' + t](s, i, i.getTag()));
      },
      _setStart: function (t, e, i) {
        if (e.isText()) return this.editor.focus(), this.setAtStart(t);
        if ('ul' === i || 'ol' === i) {
          t = e.findFirstNode('li');
          var s = this.utils.getFirstElement(t),
            n = this.inspector.parse(s);
          if (s && n.isComponent()) return this.setStart(n.getComponent());
        } else if ('dl' === i) t = e.findFirstNode('dt');
        else {
          if ('br' === i || 'hr' === i) return this.setBefore(t);
          if ('td' === i || 'th' === i) {
            var r = e.getFirstElement(t);
            if (r) return this.setStart(r);
          } else {
            if ('table' === i || 'tr' === i) return this.setStart(e.findFirstNode('th, td'));
            if (e.isComponentType('code') && !e.isFigcaption()) {
              var o = e.findLastNode('pre, code');
              return this.editor.focus(), this.setAtStart(o);
            }
            if ('figure' === i && e.isComponentType('table')) {
              var a = e.getTable(),
                l = this.inspector.parse(a);
              return this.setStart(l.findFirstNode('th, td'));
            }
            if (!e.isComponentType('table') && e.isComponent() && !e.isFigcaption()) return this.component.setActive(t);
          }
        }
        this.editor.focus(), this._setInline(t, 'Start') || this.setAtStart(t);
      },
      _setEnd: function (t, e, i) {
        if (e.isText()) return this.editor.focus(), this.setAtEnd(t);
        if ('ul' === i || 'ol' === i) {
          t = e.findLastNode('li');
          var s = this.utils.getLastElement(t),
            n = this.inspector.parse(s);
          if (s && n.isComponent()) return this.setEnd(n.getComponent());
        } else if ('dl' === i) t = e.findLastNode('dd');
        else {
          if ('br' === i || 'hr' === i) return this.setAfter(t);
          if ('td' === i || 'th' === i) {
            var r = e.getLastElement();
            if (r) return this.setEnd(r);
          } else {
            if ('table' === i || 'tr' === i) return this.setEnd(e.findLastNode('th, td'));
            if (e.isComponentType('code') && !e.isFigcaption()) {
              var o = e.findLastNode('pre, code');
              return this.editor.focus(), this.setAtEnd(o);
            }
            if ('figure' === i && e.isComponentType('table')) {
              var a = e.getTable(),
                l = this.inspector.parse(a);
              return this.setEnd(l.findLastNode('th, td'));
            }
            if (!e.isComponentType('table') && e.isComponent() && !e.isFigcaption()) return this.component.setActive(t);
          }
        }
        if ((this.editor.focus(), !this._setInline(t, 'End'))) {
          if (this.utils.isEmpty(t)) return this.setStart(t);
          this.setAtEnd(t);
        }
      },
      _setBefore: function (t, e, i) {
        return 3 === t.nodeType
          ? this.setAtBefore(t)
          : e.isInline()
            ? this.setAtBefore(t)
            : e.isFirstTableCell()
              ? this.setAtPrev(e.getComponent())
              : 'td' === i || 'th' === i
                ? this.setAtPrev(t)
                : e.isFirstListItem()
                  ? this.setAtPrev(e.getList())
                  : e.isFigcaption()
                    ? this.setStart(e.getComponent())
                    : !e.isComponentType('table') && e.isComponent()
                      ? this.setAtPrev(e.getComponent())
                      : e.isBlock()
                        ? this.setAtPrev(t)
                        : (this.editor.focus(), void this.setAtBefore(t));
      },
      _setAfter: function (t, e, i) {
        return 3 === t.nodeType
          ? this.setAtAfter(t)
          : e.isInline()
            ? this.setAtAfter(t)
            : e.isLastTableCell()
              ? this.setAtNext(e.getComponent())
              : 'td' === i || 'th' === i
                ? this.setAtNext(t)
                : e.isFirstListItem()
                  ? this.setAtNext(e.getList())
                  : !e.isComponentType('table') && e.isComponent()
                    ? this.setAtNext(e.getComponent())
                    : e.isBlock()
                      ? this.setAtNext(t)
                      : (this.editor.focus(), void this.setAtAfter(t));
      },
      _setInline: function (t, e) {
        var i = this._hasInlineChild(t, 'Start' === e ? 'first' : 'last');
        if (i) return 'Start' === e ? this.setStart(i) : this.setEnd(i), !0;
      },
      _isStartOrEnd: function (t, e) {
        var i = this.utils.getNode(t);
        if (!i) return !1;
        var s = this.inspector.parse(i);
        if ((i = this._getStartEndNode(i, s, e)) && 3 !== i.nodeType && 'LI' !== i.tagName) {
          var n = 3 === i.nodeType ? i.textContent : i.innerHTML;
          if ('' === (n = this.utils.trimSpaces(n))) return !0;
        }
        if (!s.isFigcaption() && s.isComponent() && !s.isComponentEditable()) return !0;
        var r = this.offset.get(i, !0);
        return !!r && ('First' === e ? 0 === r.start : r.end === this.offset.size(i, !0));
      },
      _isInPage: function (t) {
        return !(!t || !t.nodeType) && t !== document.body && document.body.contains(t);
      },
      _hasInlineChild: function (t, e) {
        var i = this.inspector.parse(t),
          s = 'first' === e ? i.getFirstNode() : i.getLastNode(),
          n = y.dom(s);
        if (
          s &&
          3 !== s.nodeType &&
          this.inspector.isInlineTag(s.tagName) &&
          !n.hasClass('redactor-component') &&
          !n.hasClass('non-editable')
        )
          return s;
      },
      _isEmptyTextNode: function (t) {
        var e = t.textContent.trim().replace(/\n/, '');
        return '' === (e = this.utils.removeInvisibleChars(e));
      },
      _getStartEndNode: function (t, e, i) {
        return (
          e.isFigcaption()
            ? (t = e.getFigcaption())
            : e.isTable()
              ? (t = e['find' + i + 'Node']('th, td'))
              : e.isList()
                ? (t = e['find' + i + 'Node']('li'))
                : e.isComponentType('code') && (t = e.findLastNode('pre, code')),
          t
        );
      },
    });
  var h = function (t) {
    return document.getSelection().containsNode(t, !0);
  };
  'containsNode' in Selection.prototype ||
    (h = function (t) {
      var e = document.getSelection(),
        i = e.anchorNode.parentNode,
        s = e.focusNode.parentNode,
        n = e.getRangeAt(0).getBoundingClientRect(),
        r = t.getBoundingClientRect();
      return !!y.dom(i).closest(t).length || !!y.dom(s).closest(t).length || (n.top < r.top && n.height > r.height);
    }),
    y.add('service', 'selection', {
      init: function (t) {
        this.app = t;
      },
      is: function () {
        var t = this.get();
        if (t) {
          var e = t.anchorNode;
          return 0 !== y.dom(e).closest('.redactor-in-' + this.uuid).length || e === this.editor.getElement().get();
        }
        return !1;
      },
      isCollapsed: function () {
        var t = this.get(),
          e = this.getRange();
        return !(!t || !t.isCollapsed) || !(!e || 0 !== e.toString().length);
      },
      isBackwards: function () {
        var t = !1,
          e = this.get();
        if (e && !e.isCollapsed) {
          var i = document.createRange();
          i.setStart(e.anchorNode, e.anchorOffset), i.setEnd(e.focusNode, e.focusOffset), (t = i.collapsed), i.detach();
        }
        return t;
      },
      isIn: function (t) {
        var e = y.dom(t).get(),
          i = this.getCurrent();
        return !(!i || !e) && e.contains(i);
      },
      isText: function () {
        var t = this.get();
        if (t) {
          var e = t.anchorNode,
            i = this.getBlock(e),
            s = this.getBlocks();
          if ((i && this.inspector.isTableCellTag(i.tagName)) || (!1 === i && 0 === s.length)) return !0;
        }
        return !1;
      },
      isAll: function (t) {
        var e = this.utils.getNode(t);
        if (!e) return !1;
        var i = this.editor.isEditor(e),
          s = this.inspector.parse(e);
        if (!s.isFigcaption() && this.component.isNonEditable(e) && this.component.isActive(e)) return !0;
        if (i) {
          var n = this.editor
            .getElement()
            .html()
            .replace(/<p><\/p>$/i, '');
          if (this.getHtml(!1).length !== n.length) return !1;
        }
        if ((i && this.editor.isEmpty()) || this.isCollapsed()) return !1;
        var r = this.offset.get(e, !0),
          o = this.offset.size(e, !0);
        return (
          !i && s.isComponentType('code') && (o = this.getText().trim().length), !(!r || 0 !== r.start || r.end !== o)
        );
      },
      hasNonEditable: function () {
        var t = this.getHtml(),
          e = y.dom('<div>').html(t);
        return !this.isCollapsed() && 0 !== e.find('.non-editable').length;
      },
      setRange: function (t) {
        var e = window.getSelection();
        e.removeAllRanges(), e.addRange(t);
      },
      setAll: function (t) {
        var e = this.utils.getNode(t);
        if (e) {
          var i = this.inspector.parse(e);
          if (
            (this.component.clearActive(),
            this.editor.focus(),
            this.editor.saveScroll(),
            this.editor.disableNonEditables(),
            e && 'TABLE' === e.tagName)
          ) {
            var s = i.findFirstNode('td, th'),
              n = i.findLastNode('td, th');
            y.dom(s).prepend(this.marker.build('start')),
              y.dom(n).append(this.marker.build('end')),
              this.restoreMarkers();
          } else if (!i.isFigcaption() && this.component.isNonEditable(e)) this.component.setActive(e);
          else {
            i.isComponentType('code') && (e = i.getComponentCodeElement()).focus();
            var r = document.createRange();
            r.selectNodeContents(e), this.setRange(r);
          }
          this.editor.enableNonEditables(), this.editor.restoreScroll();
        }
      },
      get: function () {
        var t = window.getSelection();
        return 0 < t.rangeCount ? t : null;
      },
      getRange: function () {
        var t = this.get();
        return t && t.getRangeAt(0) ? t.getRangeAt(0) : null;
      },
      getTextBeforeCaret: function (t) {
        t = void 0 === t ? 1 : t;
        var e = this.editor.getElement().get(),
          i = this.getRange(),
          s = !1;
        return i && ((i = i.cloneRange()).collapse(!0), i.setStart(e, 0), (s = i.toString().slice(-t))), s;
      },
      getTextAfterCaret: function (t) {
        t = void 0 === t ? 1 : t;
        var e = this.editor.getElement().get(),
          i = this.getRange(),
          s = !1;
        if (i) {
          var n = i.cloneRange();
          n.selectNodeContents(e), n.setStart(i.endContainer, i.endOffset), (s = n.toString().slice(0, t));
        }
        return s;
      },
      getPosition: function () {
        var t = this.getRange(),
          e = { top: 0, left: 0, width: 0, height: 0 };
        if (window.getSelection && t.getBoundingClientRect) {
          var i = (t = t.cloneRange()).startOffset - 1;
          t.setStart(t.startContainer, i < 0 ? 0 : i);
          var s = t.getBoundingClientRect();
          e = { top: s.top, left: s.left, width: s.right - s.left, height: s.bottom - s.top };
        }
        return e;
      },
      getCurrent: function () {
        var t = !1,
          e = this.get(),
          i = this.component.getActive();
        return i ? (t = i) : e && this.is() && (t = e.anchorNode !== this.editor.getElement().get() && e.anchorNode), t;
      },
      getParent: function () {
        var t = !1,
          e = this.getCurrent();
        if (e) {
          var i = e.parentNode;
          t = i !== this.editor.getElement().get() && i;
        }
        return t;
      },
      getElement: function (t) {
        for (var e = t || this.getCurrent(); e; ) {
          var i = this.inspector.parse(e);
          if (i.isElement() && i.isInEditor()) return e;
          e = e.parentNode;
        }
        return !1;
      },
      getInline: function (t) {
        for (var e = t || this.getCurrent(), i = !1; e; ) this._isInlineNode(e) && (i = e), (e = e.parentNode);
        return i;
      },
      getInlineFirst: function (t) {
        for (var e = t || this.getCurrent(); e; ) {
          if (this._isInlineNode(e)) return e;
          e = e.parentNode;
        }
        return !1;
      },
      getInlineAll: function (t) {
        for (var e = t || this.getCurrent(), i = []; e; ) this._isInlineNode(e) && i.push(e), (e = e.parentNode);
        return i;
      },
      getBlock: function (t) {
        for (var e = t || this.getCurrent(); e; ) {
          var i = this.inspector.parse(e);
          if (this.inspector.isBlockTag(e.tagName) && i.isInEditor(e)) return e;
          e = e.parentNode;
        }
        return !1;
      },
      getInlinesAllSelected: function (t) {
        if (this.isAll()) return [];
        var e = this.getInlines({ all: !0, inside: !0 }),
          i = this.getText().replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'),
          s = [];
        if ('' === i) s = e;
        else if (1 < e.length) for (var n = 0; n < e.length; n++) this._isTextSelected(e[n], i) && s.push(e[n]);
        else 1 === e.length && this._isTextSelected(e[0], i) && (s = e);
        return (s = t && t.tags ? this._filterNodesByTags(s, t.tags) : s);
      },
      getInlines: function (t) {
        for (var e = this.getNodes(), i = [], s = 0; s < e.length; s++) {
          var n;
          if (t && t.all)
            for (n = e[s]; n; ) this._isInlineNode(n) && !this._isInNodesArray(i, n) && i.push(n), (n = n.parentNode);
          else (n = this.getInline(e[s])) && !this._isInNodesArray(i, n) && i.push(n);
        }
        return (
          (i = t && t.tags ? this._filterNodesByTags(i, t.tags) : i),
          (i = t && t.inside ? this._filterInlinesInside(i, t) : i)
        );
      },
      getBlocks: function (t) {
        var e = this.getNodes(),
          i = this.getBlock();
        e = 0 === e.length && i ? [i] : e;
        for (var s = [], n = 0; n < e.length; n++) {
          var r = this.getBlock(e[n]);
          y.dom(r).hasClass('non-editable') || (r && !this._isInNodesArray(s, r) && s.push(r));
        }
        return (
          (s = t && t.tags ? this._filterNodesByTags(s, t.tags) : s),
          (s = t && t.first ? this._filterBlocksFirst(s, t) : s)
        );
      },
      getElements: function (t) {
        var e = this.getNodes({ textnodes: !1 }),
          i = this.getBlock();
        e = 0 === e.length && i ? [i] : e;
        for (var s = [], n = 0; n < e.length; n++) this._isInNodesArray(s, e[n]) || s.push(e[n]);
        return (s = t && t.tags ? this._filterNodesByTags(s, t.tags) : s);
      },
      getNodes: function (t) {
        var e = [],
          i = this.component.getActive();
        if (i) e = this._getNodesComponent(i);
        else if (this.isCollapsed()) {
          var s = this.getCurrent();
          e = s ? [s] : [];
        } else this.is() && !i && (e = this._getRangeSelectedNodes());
        return (
          (e = this._filterServicesNodes(e)),
          (e = this._filterEditor(e)),
          (e = t && t.tags ? this._filterNodesByTags(e, t.tags) : e),
          (e = t && t.textnodes ? this._filterNodesTexts(e, t) : e),
          (e = t && !t.textnodes ? this._filterNodesElements(e) : e)
        );
      },
      getText: function () {
        var t = this.get();
        return t ? this.utils.removeInvisibleChars(t.toString()) : '';
      },
      getHtml: function (t) {
        var e = '',
          i = this.get();
        if (i) {
          for (var s = document.createElement('div'), n = i.rangeCount, r = 0; r < n; ++r)
            s.appendChild(i.getRangeAt(r).cloneContents());
          (e = s.innerHTML), (e = (e = !1 !== t ? this.cleaner.output(e) : e).replace(/<p><\/p>$/i, ''));
        }
        return e;
      },
      clear: function () {
        this.component.clearActive(), this.get().removeAllRanges();
      },
      collapseToStart: function () {
        var t = this.get();
        t && !t.isCollapsed && t.collapseToStart();
      },
      collapseToEnd: function () {
        var t = this.get();
        t && !t.isCollapsed && t.collapseToEnd();
      },
      saveActiveComponent: function () {
        var t = this.component.getActive();
        return !!t && ((this.savedComponent = t), !0);
      },
      restoreActiveComponent: function () {
        return !!this.savedComponent && (this.component.setActive(this.savedComponent), !0);
      },
      save: function () {
        this._clearSaved();
        var t = this.getElement();
        !t ||
        -1 ===
          ['TD', 'TH', 'P', 'DIV', 'PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE'].indexOf(t.tagName) ||
        ('' !== t.innerHTML && '<br>' !== t.innerHTML)
          ? this.saveActiveComponent() || (this.saved = this.offset.get())
          : (this.savedElement = t);
      },
      restore: function () {
        (this.saved || this.savedComponent || this.savedElement) &&
          (this.editor.saveScroll(),
          this.savedElement
            ? this.caret.setStart(this.savedElement)
            : this.restoreActiveComponent() || this.offset.set(this.saved),
          this._clearSaved(),
          this.editor.restoreScroll());
      },
      saveMarkers: function () {
        this._clearSaved(), this.saveActiveComponent() || this.marker.insert();
      },
      restoreMarkers: function () {
        this.editor.saveScroll(),
          this.restoreActiveComponent() || this.marker.restore(),
          this._clearSaved(),
          this.editor.restoreScroll();
      },
      _getNextNode: function (t) {
        if (t.hasChildNodes()) return t.firstChild;
        for (; t && !t.nextSibling; ) t = t.parentNode;
        return t ? t.nextSibling : null;
      },
      _getNodesComponent: function (t) {
        var e = this.getCurrent(),
          i = this.inspector.parse(e);
        return i.isFigcaption() ? [i.getFigcaption()] : [t];
      },
      _getRangeSelectedNodes: function () {
        var t = [],
          e = this.getRange(),
          i = e.startContainer,
          s = e.startContainer,
          n = e.endContainer,
          r = this.editor.getElement();
        if (s === r.get() && this.isAll()) t = this.utils.getChildNodes(r);
        else if (i === n) t = [i];
        else {
          for (; i && i !== n; ) t.push((i = this._getNextNode(i)));
          for (i = e.startContainer; i && i !== e.commonAncestorContainer; ) t.unshift(i), (i = i.parentNode);
        }
        return t;
      },
      _isInNodesArray: function (t, e) {
        return -1 !== t.indexOf(e);
      },
      _filterEditor: function (t) {
        for (var e = [], i = 0; i < t.length; i++) {
          this.inspector.parse(t[i]).isInEditor() && e.push(t[i]);
        }
        return e;
      },
      _filterServicesNodes: function (t) {
        for (var e = [], i = 0; i < t.length; i++) {
          var s = y.dom(t[i]),
            n = !1;
          t[i] && 3 === t[i].nodeType && this.utils.isEmpty(t[i]) && (n = !0),
            (s.hasClass('redactor-script-tag') ||
              s.hasClass('redactor-component-caret') ||
              s.hasClass('redactor-selection-marker') ||
              s.hasClass('non-editable')) &&
              (n = !0),
            n || e.push(t[i]);
        }
        return e;
      },
      _filterNodesTexts: function (t, e) {
        for (var i = [], s = 0; s < t.length; s++) {
          if (3 === t[s].nodeType || (e.keepbr && 'BR' === t[s].tagName))
            (this.getInline(t[s]) && e && !1 === e.inline) || i.push(t[s]);
        }
        return i;
      },
      _filterNodesElements: function (t) {
        for (var e = [], i = 0; i < t.length; i++) 3 !== t[i].nodeType && e.push(t[i]);
        return e;
      },
      _filterNodesByTags: function (t, e, i) {
        for (var s = [], n = 0; n < t.length; n++)
          if (i && 3 === t[n].nodeType) s.push(t[n]);
          else if (3 !== t[n].nodeType) {
            var r = t[n].tagName.toLowerCase();
            -1 !== e.indexOf(r.toLowerCase()) && s.push(t[n]);
          }
        return s;
      },
      _filterBlocksFirst: function (t) {
        for (var e = [], i = 0; i < t.length; i++) {
          var s = y.dom(t[i]),
            n = s.parent().get(),
            r = s.parent().hasClass('redactor-in'),
            o = n && ('TD' === n.tagName || 'TH' === n.tagName);
          (r || o) && e.push(t[i]);
        }
        return e;
      },
      _filterInlinesInside: function (t) {
        for (var e = [], i = 0; i < t.length; i++) h(t[i], !0) && e.push(t[i]);
        return e;
      },
      _isTextSelected: function (t, e) {
        var i = 9 !== t.nodeType ? this.utils.removeInvisibleChars(t.textContent) : '';
        return e === i || -1 !== i.search(e) || -1 !== e.search(new RegExp('^' + this.utils.escapeRegExp(i) + '$'));
      },
      _isInlineNode: function (t) {
        var e = this.inspector.parse(t);
        return this.inspector.isInlineTag(t.tagName) && e.isInEditor();
      },
      _clearSaved: function () {
        (this.saved = !1), (this.savedComponent = !1), (this.savedElement = !1);
      },
    }),
    y.add('service', 'element', {
      init: function (t) {
        (this.app = t), (this.rootElement = t.rootElement), (this.$element = {}), (this.type = 'inline');
      },
      start: function () {
        this._build(), this._buildType();
      },
      isType: function (t) {
        return t === this.type;
      },
      getType: function () {
        return this.type;
      },
      getElement: function () {
        return this.$element;
      },
      _build: function () {
        this.$element = y.dom(this.rootElement);
      },
      _buildType: function () {
        var t = this.$element.get().tagName;
        (this.type = 'TEXTAREA' === t ? 'textarea' : this.type),
          (this.type = 'DIV' === t ? 'div' : this.type),
          (this.type = this.opts.inline ? 'inline' : this.type);
      },
    }),
    y.add('service', 'editor', {
      init: function (t) {
        (this.app = t), (this.scrolltop = !1), (this.pasting = !1);
      },
      start: function () {
        this._build();
      },
      focus: function () {
        this.isFocus() ||
          this._isContenteditableFocus() ||
          (this.saveScroll(), this.$editor.focus(), this.restoreScroll());
      },
      startFocus: function () {
        this.caret.setStart(this.getFirstNode());
      },
      endFocus: function () {
        this.caret.setEnd(this.getLastNode());
      },
      isPasting: function () {
        return this.pasting;
      },
      enablePasting: function () {
        this.pasting = !0;
      },
      disablePasting: function () {
        this.pasting = !1;
      },
      saveScroll: function () {
        (this.scrolltop = this._getScrollTarget().scrollTop()),
          this.opts.maxHeight && (this.scrolltopin = this.$editor.scrollTop());
      },
      restoreScroll: function () {
        !1 !== this.scrolltop && (this._getScrollTarget().scrollTop(this.scrolltop), (this.scrolltop = !1)),
          this.scrolltopin && (this.$editor.scrollTop(this.scrolltopin), (this.scrolltopin = !1));
      },
      disableNonEditables: function () {
        (this.$noneditables = this.$editor.find('[contenteditable=false]')),
          this.$noneditables.attr('contenteditable', !0);
      },
      enableNonEditables: function () {
        this.$noneditables &&
          setTimeout(
            function () {
              this.$noneditables.attr('contenteditable', !1);
            }.bind(this),
            1
          );
      },
      getFirstNode: function () {
        return this.$editor.contents()[0];
      },
      getLastNode: function () {
        var t = this.$editor.contents();
        return t[t.length - 1];
      },
      isSourceMode: function () {
        return this.source.getElement().hasClass('redactor-source-open');
      },
      isEditor: function (t) {
        return y.dom(t).get() === this.$editor.get();
      },
      isEmpty: function (t) {
        return this.utils.isEmptyHtml(this.$editor.html(), !1, t);
      },
      isFocus: function () {
        var t = y.dom(document.activeElement);
        return (
          0 !== this.$editor.find('.redactor-component-active').length ||
          0 !== t.closest('.redactor-in-' + this.uuid).length
        );
      },
      setEmpty: function () {
        this.$editor.html(this.opts.emptyHtml);
      },
      getElement: function () {
        return this.$editor;
      },
      _build: function () {
        var t = this.element.getElement(),
          e = this.element.isType('textarea') ? '<div>' : t.get();
        this.$editor = y.dom(e);
      },
      _getScrollTarget: function () {
        var t = this.$doc;
        return (t =
          this.opts.toolbarFixedTarget !== document
            ? y.dom(this.opts.toolbarFixedTarget)
            : this.opts.scrollTarget
              ? y.dom(this.opts.scrollTarget)
              : t);
      },
      _isContenteditableFocus: function () {
        var t = this.selection.getBlock();
        return 0 !== (t ? y.dom(t).closest('[contenteditable=true]').not('.redactor-in') : []).length;
      },
    }),
    y.add('service', 'container', {
      init: function (t) {
        this.app = t;
      },
      start: function () {
        this._build();
      },
      getElement: function () {
        return this.$container;
      },
      _build: function () {
        var t = this.element.isType('inline') ? '<span>' : '<div>';
        this.$container = y.dom(t);
      },
    }),
    y.add('service', 'source', {
      init: function (t) {
        (this.app = t), (this.$source = {}), (this.content = '');
      },
      start: function () {
        this._build(), this._buildName(), this._buildStartedContent();
      },
      getElement: function () {
        return this.$source;
      },
      getCode: function () {
        return this.$source.val();
      },
      getName: function () {
        return this.$source.attr('name');
      },
      getStartedContent: function () {
        return this.content;
      },
      setCode: function (t) {
        return this.insertion.set(t, !0, !1);
      },
      isNameGenerated: function () {
        return this.name;
      },
      rebuildStartedContent: function () {
        this._buildStartedContent();
      },
      _build: function () {
        var t = this.element.getElement(),
          e = this.element.isType('textarea') ? t.get() : '<textarea>';
        this.$source = y.dom(e);
      },
      _buildName: function () {
        var t = this.element.getElement();
        (this.name = t.attr('name')), this.$source.attr('name', this.name ? this.name : 'content-' + this.uuid);
      },
      _buildStartedContent: function () {
        var t = this.element.getElement(),
          e = this.element.isType('textarea') ? t.val() : t.html();
        this.content = e.trim();
      },
    }),
    y.add('service', 'statusbar', {
      init: function (t) {
        (this.app = t), (this.$statusbar = {}), (this.items = []);
      },
      start: function () {
        (this.$statusbar = y.dom('<ul>')), this.$statusbar.attr('dir', this.opts.direction);
      },
      add: function (t, e) {
        return this.update(t, e);
      },
      update: function (t, e) {
        var i;
        return (
          void 0 !== this.items[t]
            ? (i = this.items[t])
            : ((i = y.dom('<li>')), this.$statusbar.append(i), (this.items[t] = i)),
          i.html(e)
        );
      },
      get: function (t) {
        return !!this.items[t] && this.items[t];
      },
      remove: function (t) {
        this.items[t] && (this.items[t].remove(), delete this.items[t]);
      },
      getItems: function () {
        return this.items;
      },
      removeItems: function () {
        (this.items = {}), this.$statusbar.html('');
      },
      getElement: function () {
        return this.$statusbar;
      },
    }),
    y.add('service', 'toolbar', {
      init: function (t) {
        (this.app = t), (this.buttons = []), (this.dropdownOpened = !1), (this.buttonsObservers = {});
      },
      start: function () {
        this.is() &&
          ((this.opts.activeButtons = this.opts.activeButtonsAdd
            ? this._extendActiveButtons()
            : this.opts.activeButtons),
          this.create());
      },
      stopObservers: function () {
        this.buttonsObservers = {};
      },
      create: function () {
        (this.$wrapper = y.dom('<div>')), (this.$toolbar = y.dom('<div>'));
      },
      observe: function () {
        if (this.is()) {
          var t, e;
          for (var i in (this.setButtonsInactive(), this.buttonsObservers))
            (e = this.buttonsObservers[i]), (t = this.getButton(i)), this.app.broadcast('button.' + e + '.observe', t);
          var s = this.opts.activeButtons,
            n = this.selection.getInlinesAllSelected(),
            r = this.selection.getInline(),
            o = this.selection.getInlineAll();
          this.selection.isCollapsed() && (r && n.push(r), 0 !== o.length && (n = n.concat(o)));
          var a = this._inlinesToTags(n);
          for (var l in s) -1 !== a.indexOf(l) && (t = this.getButton(s[l])) && t.setActive();
        }
      },
      is: function () {
        return !(!this.opts.toolbar || (this.detector.isMobile() && this.opts.air));
      },
      isAir: function () {
        return !!this.is() && this.$toolbar.hasClass('redactor-air');
      },
      isFixed: function () {
        return !!this.is() && this.$toolbar.hasClass('redactor-toolbar-fixed');
      },
      isContextBar: function () {
        return this.$body.find('#redactor-context-toolbar-' + this.uuid).hasClass('open');
      },
      isTarget: function () {
        return this.opts.toolbarFixedTarget !== document;
      },
      getElement: function () {
        return this.$toolbar;
      },
      getWrapper: function () {
        return this.$wrapper;
      },
      getDropdown: function () {
        return this.dropdownOpened;
      },
      getTargetElement: function () {
        return y.dom(this.opts.toolbarFixedTarget);
      },
      getButton: function (t) {
        var e = this._findButton('.re-' + t);
        return 0 !== e.length && e.dataget('data-button-instance');
      },
      getButtons: function () {
        var i = [];
        return (
          this._findButtons().each(function (t) {
            var e = y.dom(t);
            i.push(e.dataget('data-button-instance'));
          }),
          i
        );
      },
      getButtonsKeys: function () {
        var i = [];
        return (
          this._findButtons().each(function (t) {
            var e = y.dom(t);
            i.push(e.attr('data-re-name'));
          }),
          i
        );
      },
      addButton: function (t, e, i, s, n) {
        i = i || 'end';
        var r = y.create('toolbar.button', this.app, t, e);
        if ((e.observe && (this.opts.activeButtonsObservers[t] = { observe: e.observe, button: r }), this.is()))
          if ('first' === i) this.$toolbar.prepend(r);
          else if ('after' === i) s.after(r);
          else if ('before' === i) s.before(r);
          else {
            var o = this.opts.buttons.indexOf(t);
            if (!0 !== n && -1 !== o)
              if (0 === o) this.$toolbar.prepend(r);
              else {
                var a = this._findButtons().eq(o - 1);
                0 < a.length ? a.after(r) : this.$toolbar.append(r);
              }
            else this.$toolbar.append(r);
          }
        return r;
      },
      addButtonFirst: function (t, e) {
        return this.addButton(t, e, 'first');
      },
      addButtonAfter: function (t, e, i) {
        var s = this.getButton(t);
        return s ? this.addButton(e, i, 'after', s) : this.addButton(e, i);
      },
      addButtonBefore: function (t, e, i) {
        var s = this.getButton(t);
        return s ? this.addButton(e, i, 'before', s) : this.addButton(e, i);
      },
      addButtonObserver: function (t, e) {
        this.buttonsObservers[t] = e;
      },
      setButtons: function (t) {
        this.buttons = t;
      },
      setDropdown: function (t) {
        this.dropdownOpened = t;
      },
      setButtonsInactive: function () {
        for (var t = this.getButtons(), e = 0; e < t.length; e++) t[e].setInactive();
      },
      setButtonsActive: function () {
        for (var t = this.getButtons(), e = 0; e < t.length; e++) t[e].setActive();
      },
      disableButtons: function () {
        for (var t = this.getButtons(), e = 0; e < t.length; e++) t[e].disable();
      },
      enableButtons: function () {
        for (var t = this.getButtons(), e = 0; e < t.length; e++) t[e].enable();
      },
      _findButton: function (t) {
        return this.is() ? this.$toolbar.find(t) : y.dom();
      },
      _findButtons: function () {
        return this.is() ? this.$toolbar.find('.re-button') : y.dom();
      },
      _extendActiveButtons: function () {
        return y.extend({}, this.opts.activeButtons, this.opts.activeButtonsAdd);
      },
      _inlinesToTags: function (t) {
        for (var e = [], i = 0; i < t.length; i++) e.push(t[i].tagName.toLowerCase());
        return e;
      },
    }),
    y.add('class', 'toolbar.button', {
      mixins: ['dom'],
      init: function (t, e, i) {
        (this.app = t),
          (this.opts = t.opts),
          (this.lang = t.lang),
          (this.$body = t.$body),
          (this.toolbar = t.toolbar),
          (this.detector = t.detector),
          (this.obj = i),
          (this.name = e),
          (this.dropdown = !1),
          (this.tooltip = !1),
          this._init();
      },
      isActive: function () {
        return this.hasClass('redactor-button-active');
      },
      isDisabled: function () {
        return this.hasClass('redactor-button-disabled');
      },
      hasIcon: function () {
        return this.obj.icon && !this.opts.buttonsTextLabeled;
      },
      setDropdown: function (t) {
        (this.obj.dropdown = t),
          (this.obj.message = !1),
          (this.dropdown = y.create('toolbar.dropdown', this.app, this.name, this.obj.dropdown)),
          this.attr('data-dropdown', !0);
      },
      setMessage: function (t, e) {
        (this.obj.message = t), (this.obj.args = e), (this.obj.dropdown = !1);
      },
      setApi: function (t, e) {
        (this.obj.api = t), (this.obj.args = e), (this.obj.dropdown = !1);
      },
      setTitle: function (t) {
        (this.obj.title = this.lang.parse(t)),
          (this.obj.tooltip = this.obj.title),
          this.attr({ alt: this.obj.tooltip, 'aria-label': this.obj.tooltip }),
          this.attr('data-re-icon') || this.html(this.obj.title);
      },
      setTooltip: function (t) {
        (this.obj.tooltip = this.lang.parse(t)), this.attr({ alt: this.obj.tooltip, 'aria-label': this.obj.tooltip });
      },
      setIcon: function (t) {
        this.opts.buttonsTextLabeled ||
          ((this.obj.icon = !0),
          (this.$icon = y.dom(t)),
          this.html(''),
          this.append(this.$icon),
          this.attr('data-re-icon', !0),
          this.addClass('re-button-icon'),
          this.setTooltip(this.obj.title),
          this._buildTooltip());
      },
      setActive: function () {
        this.addClass('redactor-button-active');
      },
      setInactive: function () {
        this.removeClass('redactor-button-active');
      },
      hideTooltip: function () {
        this.$body.find('.re-button-tooltip').remove();
      },
      getDropdown: function () {
        return this.dropdown;
      },
      disable: function () {
        this.addClass('redactor-button-disabled');
      },
      enable: function () {
        this.removeClass('redactor-button-disabled');
      },
      toggle: function (t) {
        t && t.preventDefault(),
          this.isDisabled() ||
            (this.obj.dropdown
              ? this.dropdown.toggle(t)
              : this.obj.api
                ? this.app.api(this.obj.api, this.obj.args, this.name)
                : this.obj.message && this.app.broadcast(this.obj.message, this.obj.args, this.name),
            this.hideTooltip());
      },
      _init: function () {
        this._parseTitle(),
          this._parseTooltip(),
          this._build(),
          this._buildCallback(),
          this._buildAttributes(),
          this._buildObserver(),
          this.hasIcon() ? (this._buildIcon(), this._buildTooltip()) : this.html(this.obj.title);
      },
      _parseTooltip: function () {
        this.obj.tooltip = this.obj.tooltip ? this.lang.parse(this.obj.tooltip) : this.obj.title;
      },
      _parseTitle: function () {
        this.obj.title = this.lang.parse(this.obj.title);
      },
      _build: function () {
        this.parse('<a>'),
          this.addClass('re-button re-' + this.name),
          this.attr('data-re-name', this.name),
          this.dataset('data-button-instance', this),
          this.obj.dropdown && this.setDropdown(this.obj.dropdown);
      },
      _buildCallback: function () {
        this.on('click', this.toggle.bind(this));
      },
      _buildAttributes: function () {
        var t = {
          href: '#',
          alt: this.obj.tooltip,
          rel: this.name,
          role: 'button',
          'aria-label': this.obj.tooltip,
          tabindex: '-1',
        };
        this.attr(t);
      },
      _buildObserver: function () {
        void 0 !== this.obj.observe && this.toolbar.addButtonObserver(this.name, this.obj.observe);
      },
      _buildIcon: function () {
        var t = this.obj.icon,
          e = /(<([^>]+)>)/gi.test(t);
        (this.$icon = y.dom(e ? t : '<i>')),
          e || this.$icon.addClass('re-icon-' + this.name),
          this.append(this.$icon),
          this.attr('data-re-icon', !0),
          this.addClass('re-button-icon');
      },
      _buildTooltip: function () {
        this.detector.isDesktop() && (this.tooltip = y.create('toolbar.button.tooltip', this.app, this));
      },
    }),
    y.add('class', 'toolbar.button.tooltip', {
      mixins: ['dom'],
      init: function (t, e) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.$body = t.$body),
          (this.toolbar = t.toolbar),
          (this.$button = e),
          (this.created = !1),
          this._init();
      },
      open: function () {
        if (!this.$button.hasClass('redactor-button-disabled') && !this.$button.hasClass('redactor-button-active')) {
          (this.created = !0),
            this.parse('<span>'),
            this.addClass('re-button-tooltip re-button-tooltip-' + this.uuid),
            this.$body.append(this),
            this.html(this.$button.attr('alt'));
          var t = this.$button.offset(),
            e = this.$button.height(),
            i = this.$button.width();
          this.css({ top: t.top + e + 4 + 'px', left: t.left + i / 2 - this.width() / 2 + 'px', position: 'absolute' }),
            this.show();
        }
      },
      close: function () {
        this.created && !this.$button.hasClass('redactor-button-disabled') && (this.remove(), (this.created = !1));
      },
      _init: function () {
        this.$button.on('mouseover', this.open.bind(this)), this.$button.on('mouseout', this.close.bind(this));
      },
    }),
    y.add('class', 'toolbar.dropdown', {
      mixins: ['dom'],
      init: function (t, e, i) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.$win = t.$win),
          (this.$doc = t.$doc),
          (this.$body = t.$body),
          (this.animate = t.animate),
          (this.toolbar = t.toolbar),
          (this.name = e),
          (this.started = !1),
          (this.items = 'format' === e ? y.extend({}, !0, i) : i),
          (this.$items = []);
      },
      toggle: function (t) {
        this.started || this._build(), this.isOpened() && this.isActive() ? this.close(!1) : this.open(t);
      },
      isOpened: function () {
        var t = this.$body.find('.redactor-dropdown-' + this.uuid + '.open');
        return 0 !== t.length && t.attr('data-re-name') === this.name;
      },
      isActive: function () {
        return 0 !== this.$body.find('#redactor-dropdown-' + this.uuid + '-' + this.name + '.open').length;
      },
      getName: function () {
        return this.attr('data-re-name');
      },
      getItem: function (t) {
        return this.$items[t];
      },
      getItemsByClass: function (t) {
        var e = [];
        for (var i in this.$items) {
          var s = this.$items[i];
          'object' == typeof s && s.attr('data-re-name') && s.hasClass(t) && e.push(s);
        }
        return e;
      },
      open: function (t) {
        this._closeAll(),
          (this.$btn = this.toolbar.getButton(this.name)),
          this.app.broadcast('dropdown.open', t, this, this.$btn),
          this.toolbar.setDropdown(this),
          this.show(),
          this.removeClass('redactor-animate-hide'),
          this.addClass('open'),
          this._observe(),
          this.$btn.hideTooltip(),
          this.$btn.setActive(),
          this.$doc.on('keyup.redactor.dropdown-' + this.uuid, this._handleKeyboard.bind(this)),
          this.$doc.on('click.redactor.dropdown-' + this.uuid, this.close.bind(this)),
          this.updatePosition(),
          this.app.broadcast('dropdown.opened', t, this, this.$btn);
      },
      close: function (t, e) {
        if (t) {
          var i = y.dom(t.target);
          if (
            this._isButton(t) ||
            i.hasClass('redactor-dropdown-not-close') ||
            i.hasClass('redactor-dropdown-item-disabled')
          )
            return void t.preventDefault();
        }
        this.app.broadcast('dropdown.close', this, this.$btn),
          this.toolbar.setDropdown(!1),
          this.$btn.setInactive(),
          !1 === e ? this._close() : this.animate.start(this, 'fadeOut', this._close.bind(this));
      },
      updatePosition: function () {
        this.toolbar.isFixed(), this.toolbar.isTarget();
        var t = this.$btn.height(),
          e = this.$btn.width(),
          i = this.$btn.offset(),
          s = i.left + 0,
          n = parseFloat(this.css('width')),
          r = s - (this.$win.width() < s + n ? n - e : 0),
          o = i.top + t + 2;
        (r = r < 0 ? 4 : r), this.css({ maxHeight: '', position: 'absolute', top: o + 'px', left: r + 'px' });
        var a = this.$win.height() - (o - this.$doc.scrollTop()) - 10;
        this.css('max-height', a + 'px');
      },
      _build: function () {
        this.parse('<div>'),
          this.attr('dir', this.opts.direction),
          this.attr('id', 'redactor-dropdown-' + this.uuid + '-' + this.name),
          this.attr('data-re-name', this.name),
          this.addClass('redactor-dropdown redactor-dropdown-' + this.uuid + ' redactor-dropdown-' + this.name),
          this.dataset('data-dropdown-instance', this),
          this.items.sdom || 'string' == typeof this.items ? this._buildDom() : this._buildItems(),
          this.$body.append(this),
          (this.started = !0);
      },
      _buildDom: function () {
        this.html('').append(y.dom(this.items));
      },
      _buildItems: function () {
        for (var t in ((this.items = 'format' === this.name ? this._buildFormattingItems() : this.items), this.items)) {
          var e = this.items[t];
          if ('observe' === t) this.attr('data-observe', this.items[t]);
          else {
            var i = y.create('toolbar.dropdown.item', this.app, t, e, this);
            (this.$items[t] = i), this.append(i);
          }
        }
      },
      _buildFormattingItems: function () {
        for (var t in this.items) -1 === this.opts.formatting.indexOf(t) && delete this.items[t];
        if (this.opts.formattingHide)
          for (var t in this.items) -1 !== this.opts.formattingHide.indexOf(t) && delete this.items[t];
        if (this.opts.formattingAdd) for (var t in this.opts.formattingAdd) this.items[t] = this.opts.formattingAdd[t];
        return this.items;
      },
      _handleKeyboard: function (t) {
        27 === t.which && this.close();
      },
      _isButton: function (t) {
        return y.dom(t.target).closest('.re-button').get() === this.$btn.get();
      },
      _close: function () {
        this.$btn.setInactive(),
          this.$doc.off('.redactor.dropdown-' + this.uuid),
          this.removeClass('open'),
          this.addClass('redactor-animate-hide'),
          this.app.broadcast('dropdown.closed', this, this.$btn);
      },
      _closeAll: function () {
        this.$body.find('.redactor-dropdown-' + this.uuid + '.open').each(function (t) {
          y.dom(t).dataget('data-dropdown-instance')._close();
        });
      },
      _observe: function () {
        var t = this.attr('data-observe');
        t && this.app.broadcast('dropdown.' + t + '.observe', this);
      },
    }),
    y.add('class', 'toolbar.dropdown.item', {
      mixins: ['dom'],
      init: function (t, e, i, s) {
        (this.app = t), (this.lang = t.lang), (this.dropdown = s), (this.name = e), (this.obj = i), this._init();
      },
      setTitle: function (t) {
        this.$span.html(t);
      },
      getTitle: function () {
        return this.$span.html();
      },
      enable: function () {
        this.removeClass('redactor-dropdown-item-disabled');
      },
      disable: function () {
        this.addClass('redactor-dropdown-item-disabled');
      },
      toggle: function (t) {
        t && t.preventDefault(),
          this.hasClass('redactor-dropdown-item-disabled') ||
            (this.obj.message
              ? this.app.broadcast(this.obj.message, this.obj.args, this.name)
              : this.obj.api && this.app.api(this.obj.api, this.obj.args, this.name));
      },
      _init: function () {
        this.parse('<a>'),
          this.attr('href', '#'),
          this.addClass('redactor-dropdown-item-' + this.name),
          this.obj.classname && this.addClass(this.obj.classname),
          this.attr('data-re-name', this.name),
          this.on('click', this.toggle.bind(this)),
          (this.$span = y.dom('<span>')),
          this.append(this.$span),
          this.setTitle(this.lang.parse(this.obj.title));
      },
    }),
    y.add('service', 'cleaner', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.storedComponents = []),
          (this.storedComments = []),
          (this.storedImages = []),
          (this.storedLinks = []),
          (this.deniedTags = ['font', 'html', 'head', 'link', 'title', 'body', 'meta', 'applet']),
          (this.convertRules = {}),
          (this.unconvertRules = {}),
          (this.reComments = /<!--[\s\S]*?-->\n?/g),
          (this.reSpacedEmpty = /^(||\s||<br\s?\/?>||&nbsp;)$/i),
          (this.reScriptTag = /<script(.*?[^>]?)>([\w\W]*?)<\/script>/gi);
      },
      addConvertRules: function (t, e) {
        this.convertRules[t] = e;
      },
      addUnconvertRules: function (t, e) {
        this.unconvertRules[t] = e;
      },
      input: function (t, e, i) {
        t = t.replace(/¤t/gi, '&current');
        var s = [];
        (t = this.storeComments(t, s)), (t = this.encodeCode(t));
        var n = this.utils.buildWrapper(t);
        n
          .find('a, b, i, strong, em, img, svg, details, audio')
          .removeAttr('onload onerror ontoggle onwheel onmouseover oncopy'),
          n.find('a, iframe, embed').each(function (t) {
            var e = y.dom(t),
              i = e.attr('href'),
              s = e.attr('src');
            i && -1 !== i.trim().search(/^data|javascript:/i) && e.attr('href', ''),
              s && -1 !== s.trim().search(/^data|javascript:/i) && e.attr('src', '');
          });
        var r = ['alt', 'title', 'src', 'class', 'width', 'height', 'srcset', 'style', 'usemap'];
        return (
          n.find('img').each(
            function (t) {
              if (0 < t.attributes.length)
                for (var e = t.attributes, i = e.length - 1; 0 <= i; i--) {
                  var s = -1 === e[i].name.search(/^data-/) && -1 === r.indexOf(e[i].name),
                    n = 'src' === e[i].name && -1 !== e[i].value.search(/^data|javascript:/i);
                  this.opts.imageSrcData && (n = !1), (s || n) && t.removeAttribute(e[i].name);
                }
            }.bind(this)
          ),
          (t = (t = (t = this.utils.getWrapperHtml(n)).replace(/\$/g, '&#36;')).replace(/&amp;/g, '&')),
          (t = y.create('cleaner.figure', this.app).convert(t, this.convertRules)),
          (t = this.storeComponents(t)),
          (t = this.replaceTags(t, this.opts.replaceTags)),
          (t = this._setSpanAttr(t)),
          (t = this._setStyleCache(t)),
          (t = this.removeTags(t, this.deniedTags)),
          (t = this.opts.removeScript ? this._removeScriptTag(t) : this._replaceScriptTag(t)),
          (t = this.opts.removeComments ? this.removeComments(t) : t),
          (t = this._isSpacedEmpty(t) ? this.opts.emptyHtml : t),
          (t = this.restoreComponents(t)),
          (t = this._cleanWrapped(t)),
          (t = this.restoreComments(t, s)),
          (t = e ? this.paragraphize(t) : t)
        );
      },
      output: function (t, e) {
        return (
          (t = this.removeInvisibleSpaces(t)),
          this.opts.breakline &&
            (t = (t = t.replace(/<\/(span|strong|b|i|em)><br\s?\/?><\/div>/gi, '</$1></div>')).replace(
              /<br\s?\/?><\/(span|strong|b|i|em)><\/div>/gi,
              '</$1></div>'
            )),
          (t = t.replace(/&#36;/g, '$')),
          this._isSpacedEmpty(t)
            ? ''
            : this._isParagraphEmpty(t)
              ? ''
              : ((t = this.removeServiceTagsAndAttrs(t, e)),
                (t = this.storeComponents(t)),
                (t = this.removeSpanWithoutAttributes(t)),
                (t = this.removeFirstBlockBreaklineInHtml(t)),
                (t = this.opts.removeScript ? t : this._unreplaceScriptTag(t)),
                (t = this.opts.preClass ? this._setPreClass(t) : t),
                (t = this.opts.linkNofollow ? this._setLinkNofollow(t) : t),
                (t = this.opts.removeNewLines ? this.cleanNewLines(t) : t),
                (t = this.restoreComponents(t)),
                (t = y.create('cleaner.figure', this.app).unconvert(t, this.unconvertRules)),
                (t = this.removeEmptyAttributes(t, ['style', 'class', 'rel', 'alt', 'title'])),
                (t = this.cleanSpacesInPre(t)),
                (t = (t = this.tidy(t)).replace(/&amp;/g, '&')),
                this.opts.breakline &&
                  (t = (t = t.replace(/<br\s?\/?>/gi, '<br>\n')).replace(/<br\s?\/?>\n+/gi, '<br>\n')),
                (t = '' === t.replace(/\n/g, '') ? '' : t))
        );
      },
      paste: function (t) {
        t = (t = this.storeComponents(t)).replace(/<!--[\s\S]*?-->/g, '');
        var e = this.deniedTags.concat(['iframe']);
        t = (t = (t = (t = this.removeTags(t, e)).replace(new RegExp('<!doctype([\\s\\S]+?)>', 'gi'), '')).replace(
          new RegExp('<style([\\s\\S]+?)</style>', 'gi'),
          ''
        )).replace(new RegExp('</p><br /><p', 'gi'), '</p><p');
        var i = this._isHtmlMsWord(t);
        if (((t = i ? t : this._cleanGDocs(t)), (t = i ? this._cleanMsWord(t) : t), !this.opts.pasteClean))
          return (t = this.restoreComponents(t));
        if (this.opts.pastePlainText) return (t = this.restoreComponents(t)), this.pastePlainText(t);
        (n = this.utils.buildWrapper(t)).find('*').removeAttr('style'),
          n.find('[data-redactor-tag]').each(
            function (t) {
              var e = y.dom(t);
              e.removeAttr('data-redactor-tag'),
                this.utils.isEmptyHtml(e.html())
                  ? e.html('<br>').unwrap()
                  : t.lastChild && 'BR' === t.lastChild.tagName
                    ? e.unwrap()
                    : e.append('<br>').unwrap();
            }.bind(this)
          ),
          (t = (t = (t = this.utils.getWrapperHtml(n)).replace(/<br\s?\/?>$/, '')).replace(
            /<br\s?\/?><\/(td|th)>/,
            '</$1>'
          ));
        var s = this.opts.pasteBlockTags.concat(this.opts.pasteInlineTags);
        (t = this.removeTagsExcept(t, s)),
          (t = this.opts.pasteLinks ? t : this.removeTags(t, ['a'])),
          (t = this.opts.pasteImages ? t : this.removeTags(t, ['img']));
        var n,
          r = (n = this.utils.buildWrapper(t)).find('*'),
          o = 0 !== this.opts.pasteKeepStyle.length ? ',' + this.opts.pasteKeepStyle.join(',') : '';
        r.not('[data-redactor-style-cache]' + o).removeAttr('style');
        var a = 0 !== this.opts.pasteKeepClass.length ? ',' + this.opts.pasteKeepClass.join(',') : '';
        r.not('[data-redactor-style-cache], span.redactor-component' + a).removeAttr('class');
        var l = 0 !== this.opts.pasteKeepAttrs.length ? ',' + this.opts.pasteKeepAttrs.join(',') : '';
        r.not('img, a, span.redactor-component, [data-redactor-style-cache]' + l).each(function (t) {
          for (var e = t.attributes, i = e.length - 1; 0 <= i; i--)
            'class' !== t.attributes[i].name && 'dir' !== t.attributes[i].name && t.removeAttribute(e[i].name);
        }),
          this.opts.pasteLinks &&
            !1 !== this.opts.pasteLinkTarget &&
            n.find('a').attr('target', this.opts.pasteLinkTarget),
          n.find('[data-redactor-style-cache]').each(function (t) {
            var e = t.getAttribute('data-redactor-style-cache');
            t.setAttribute('style', e);
          });
        var h = this.opts.imageAttrs;
        return (
          n.find('img').each(function (t) {
            if (0 < t.attributes.length)
              for (var e = t.attributes, i = e.length - 1; 0 <= i; i--)
                -1 === h.indexOf(e[i].name) && t.removeAttribute(e[i].name);
          }),
          n.find('span').each(function (t) {
            0 === t.attributes.length && y.dom(t).unwrap();
          }),
          n.find(this.opts.inlineTags.join(',')).each(
            function (t) {
              0 === t.attributes.length && this.utils.isEmptyHtml(t.innerHTML) && y.dom(t).unwrap();
            }.bind(this)
          ),
          n.find('ul, ol').each(function (t) {
            var e = t.previousSibling;
            if (e && 'LI' === e.tagName) {
              var i = y.dom(e);
              i.find('p').unwrap(), i.append(t);
            }
          }),
          (t = (t = (t = (t = (t = this.utils.getWrapperHtml(n)).replace(/<li><p>/gi, '<li>')).replace(
            /<\/p><\/li>/gi,
            '</li>'
          )).replace(/^<li/gi, '<ul><li')).replace(/<\/li>$/gi, '</li></ul>')),
          this.opts.breakline && (t = t.replace(/\n/g, '<br>')),
          (t = (t = t.replace(/<p>&nbsp;<\/p>/gi, '<p></p>')).replace(/<p><br\s?\/?><\/p>/gi, '<p></p>')),
          i && (t = (t = (t = t.replace(/<p><\/p>/gi, '')).replace(/<p>\s<\/p>/gi, '')).replace(/<td\n/gi, '<td ')),
          (t = this.restoreComponents(t))
        );
      },
      pastePlainText: function (t) {
        return (
          (t = this.opts.pasteLinks ? this.storeLinks(t) : t),
          (t = this.opts.pasteImages ? this.storeImages(t) : t),
          (t = this.getPlainText(t)),
          (t = this._replaceNlToBr(t)),
          (t = this.opts.pasteLinks ? this.restoreLinks(t) : t),
          (t = this.opts.pasteImages ? this.restoreImages(t) : t)
        );
      },
      tidy: function (t) {
        return t;
      },
      paragraphize: function (t) {
        return (t = y.create('cleaner.paragraphize', this.app).convert(t));
      },
      storeComments: function (t, e) {
        var i = t.match(new RegExp('\x3c!--([\\w\\W]*?)--\x3e', 'gi'));
        if (null !== i)
          for (var s = 0; s < i.length; s++)
            (t = t.replace(i[s], '#####xstarthtmlcommentzz' + s + 'xendhtmlcommentzz#####')), e.push(i[s]);
        return t;
      },
      restoreComments: function (t, e) {
        for (var i = 0; i < e.length; i++)
          t = t.replace('#####xstarthtmlcommentzz' + i + 'xendhtmlcommentzz#####', e[i]);
        return t;
      },
      getFlatText: function (t) {
        var e = y.dom('<div>');
        return (
          t.nodeType || t.dom ? e.append(t) : ((t = (t = t.toString()).trim()), e.html(t)),
          void 0 === (t = e.get().textContent || e.get().innerText || '') ? '' : t
        );
      },
      getPlainText: function (t) {
        t = (t = (t = (t = (t = (t = t.replace(/<!--[\s\S]*?-->/gi, '')).replace(/<style[\s\S]*?style>/gi, '')).replace(
          /<p><\/p>/g,
          ''
        )).replace(/<\/div>|<\/li>|<\/td>/gi, '\n')).replace(/<\/p>/gi, '\n\n')).replace(/<\/H[1-6]>/gi, '\n\n');
        var e = document.createElement('div');
        return (e.innerHTML = t), (t = e.textContent || e.innerText).trim();
      },
      replaceTags: function (t, e) {
        if (e) {
          var i = this,
            s = Object.keys(e),
            n = this.utils.buildWrapper(t);
          n.find(s.join(',')).each(function (t) {
            i.utils.replaceToTag(t, e[t.tagName.toLowerCase()]);
          }),
            (t = this.utils.getWrapperHtml(n));
        }
        return t;
      },
      replaceNbspToSpaces: function (t) {
        return t.replace('&nbsp;', ' ');
      },
      replaceBlocksToBr: function (t) {
        return (t = (t = (t = t.replace(/<div[^>]*><\/div>/gi, '')).replace(/<td[^>]*><\/td>/gi, '')).replace(
          /<\/div>|<\/li>|<\/td>|<\/p>|<\/H[1-6]>/gi,
          '<br>'
        ));
      },
      cleanNewLines: function (t) {
        return t.replace(/\r?\n/g, '');
      },
      cleanSpacesInPre: function (t) {
        return t.replace('&nbsp;&nbsp;&nbsp;&nbsp;', '    ');
      },
      removeInvisibleSpaces: function (t) {
        return (t = (t = this.utils.removeInvisibleChars(t)).replace(/&#65279;/gi, ''));
      },
      removeNl: function (t) {
        return (t = (t = t.replace(/\n/g, ' ')).replace(/\s+/g, 's'));
      },
      removeBrAtEnd: function (t) {
        return (t = (t = t.replace(/<br\s?\/?>$/gi, ' ')).replace(/<br\s?\/?><li/gi, '<li'));
      },
      removeTags: function (t, i) {
        var e = i ? /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi : /(<([^>]+)>)/gi,
          s = i
            ? function (t, e) {
                return -1 === i.indexOf(e.toLowerCase()) ? t : '';
              }
            : '';
        return t.replace(e, s);
      },
      removeTagsExcept: function (t, i) {
        if (void 0 === i) return t.replace(/(<([^>]+)>)/gi, '');
        return t.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, function (t, e) {
          return -1 === i.indexOf(e.toLowerCase()) ? '' : t;
        });
      },
      removeComments: function (t) {
        return t.replace(this.reComments, '');
      },
      removeServiceTagsAndAttrs: function (t, e) {
        var i = this.utils.buildWrapper(t),
          s = this;
        return (
          !1 !== e &&
            i.find('.redactor-selection-marker').each(function (t) {
              var e = y.dom(t);
              return '' === s.utils.removeInvisibleChars(e.text()) ? e.remove() : e.unwrap();
            }),
          i.find('[data-redactor-style-cache]').removeAttr('data-redactor-style-cache'),
          this.utils.getWrapperHtml(i)
        );
      },
      removeSpanWithoutAttributes: function (t) {
        var e = this.utils.buildWrapper(t);
        return (
          e
            .find('span')
            .removeAttr('data-redactor-span data-redactor-style-cache')
            .each(function (t) {
              0 === t.attributes.length && y.dom(t).unwrap();
            }),
          this.utils.getWrapperHtml(e)
        );
      },
      removeFirstBlockBreaklineInHtml: function (t) {
        return t.replace(new RegExp('</li><br\\s?/?>', 'gi'), '</li>');
      },
      removeEmptyAttributes: function (t, e) {
        for (var i = this.utils.buildWrapper(t), s = 0; s < e.length; s++) i.find('[' + e[s] + '=""]').removeAttr(e[s]);
        return this.utils.getWrapperHtml(i);
      },
      encodeHtml: function (t) {
        return (
          (t = (t = (t = (t = (t = (t = t.replace(/<br\s?\/?>/g, '\n')).replace(/&nbsp;/g, ' ')).replace(
            /”/g,
            '"'
          )).replace(/“/g, '"')).replace(/‘/g, "'")).replace(/’/g, "'")),
          (t = (t = this.encodeEntities(t)).replace(/\$/g, '&#36;')),
          this.opts.preSpaces && (t = t.replace(/\t/g, new Array(this.opts.preSpaces + 1).join(' '))),
          t
        );
      },
      encodeCode: function (t) {
        return (
          (t = (t = (t = (t = (t = (t = (t = (t = this.encodeAttrSings(t)).replace(/<\s/gi, '&lt; ')).replace(
            /<([^>]+)</gi,
            '&lt;$1<'
          )).replace(/<(.*?)>/gi, 'xtagstartz$1xtagendz')).replace(/xtagstartzpre(.*?)xtagendz/g, '<pre$1>')).replace(
            /xtagstartzcode(.*?)xtagendz/g,
            '<code$1>'
          )).replace(/xtagstartz\/codextagendz/g, '</code>')).replace(/xtagstartz\/prextagendz/g, '</pre>')),
          (t = (t = (t = this._encodeCode(t)).replace(/xtagstartz([\w\W]*?)xtagendz/g, '<$1>')).replace(
            /xtagstartz\/(.*?)xtagendz/g,
            '</$1>'
          )),
          (t = this.decodeAttrSings(t))
        );
      },
      _encodeCode: function (t) {
        var e = this.utils.buildWrapper(t);
        return e.find('pre code, pre, code').each(this._encodeNode.bind(this)), this.utils.getWrapperHtml(e);
      },
      _encodeNode: function (t) {
        var e = t.firstChild,
          i = t.innerHTML;
        if ('PRE' !== t.tagName || !e || 'CODE' !== e.tagName) {
          i = (i = i.replace(/xtagstartz/g, '<')).replace(/xtagendz/g, '>');
          var s = this.decodeEntities(i);
          t.textContent = this._encodeNodeHtml(s);
        }
      },
      _encodeNodeHtml: function (t) {
        return (
          (t = t.replace(/&nbsp;/g, ' ').replace(/<br\s?\/?>/g, '\n')),
          (t = this.opts.preSpaces ? t.replace(/\t/g, new Array(this.opts.preSpaces + 1).join(' ')) : t)
        );
      },
      encodeAttrSings: function (t) {
        var e = t.match(/="(.*?)"/g);
        if (null !== e)
          for (var i = 0; i < e.length; i++)
            if (-1 === e[i].search(/^"</) && -1 === e[i].search(/>"$/)) {
              var s = e[i].replace('>', 'xmoresignz');
              (s = s.replace('<', 'xlesssignz')), (t = t.replace(e[i], s));
            }
        return t;
      },
      encodeEntities: function (t) {
        return (t = (t = this.decodeEntities(t))
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;'));
      },
      encodePhpCode: function (t) {
        return (t = (t = (t = t.replace('<?php', '&lt;?php')).replace('<?', '&lt;?')).replace('?>', '?&gt;'));
      },
      decodeAttrSings: function (t) {
        return (t = (t = t.replace(/xmoresignz/gi, '>')).replace(/xlesssignz/gi, '<'));
      },
      decodeEntities: function (t) {
        return String(t)
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&');
      },
      storeComponents: function (t) {
        var e = this.utils.getElementsFromHtml(t, 'figure', 'table');
        return this._storeMatched(t, e, 'Components', 'figure');
      },
      restoreComponents: function (t) {
        return this._restoreMatched(t, 'Components', 'figure');
      },
      storeLinks: function (t) {
        var e = this.utils.getElementsFromHtml(t, 'a');
        return this._storeMatched(t, e, 'Links', 'a');
      },
      storeImages: function (t) {
        var e = this.utils.getElementsFromHtml(t, 'img');
        return this._storeMatched(t, e, 'Images', 'img');
      },
      restoreLinks: function (t) {
        return this._restoreMatched(t, 'Links', 'a');
      },
      restoreImages: function (t) {
        return this._restoreMatched(t, 'Images', 'img');
      },
      _cleanWrapped: function (t) {
        return (t = t.replace(new RegExp('<p><figure([\\w\\W]*?)</figure></p>', 'gi'), '<figure$1</figure>'));
      },
      _cleanGDocs: function (t) {
        return (t = (t = (t = (t = (t = (t = (t = (t = (t = t.replace(
          /<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi,
          '$2'
        )).replace(/<b(.*?)id="docs-internal-guid(.*?)">([\w\W]*?)<\/b>/gi, '$3')).replace(
          /<span[^>]*(font-style:\s?italic;\s?font-weight:\s?bold|font-weight:\s?bold;\s?font-style:\s?italic)[^>]*>([\w\W]*?)<\/span>/gi,
          '<b><i>$2</i></b>'
        )).replace(
          /<span[^>]*(font-style:\s?italic;\s?font-weight:\s?600|font-weight:\s?600;\s?font-style:\s?italic)[^>]*>([\w\W]*?)<\/span>/gi,
          '<b><i>$2</i></b>'
        )).replace(
          /<span[^>]*(font-style:\s?italic;\s?font-weight:\s?700|font-weight:\s?700;\s?font-style:\s?italic)[^>]*>([\w\W]*?)<\/span>/gi,
          '<b><i>$2</i></b>'
        )).replace(/<span[^>]*font-style:\s?italic[^>]*>([\w\W]*?)<\/span>/gi, '<i>$1</i>')).replace(
          /<span[^>]*font-weight:\s?bold[^>]*>([\w\W]*?)<\/span>/gi,
          '<b>$1</b>'
        )).replace(/<span[^>]*font-weight:\s?700[^>]*>([\w\W]*?)<\/span>/gi, '<b>$1</b>')).replace(
          /<span[^>]*font-weight:\s?600[^>]*>([\w\W]*?)<\/span>/gi,
          '<b>$1</b>'
        ));
      },
      _cleanMsWord: function (t) {
        t = (t = (t = (t = (t = t.replace(/<!--[\s\S]+?-->/gi, '')).replace(
          /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi,
          ''
        )).replace(/<(\/?)s>/gi, '<$1strike>')).replace(/&nbsp;/gi, ' ')).replace(
          /<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi,
          function (t, e) {
            return 0 < e.length
              ? e
                  .replace(/./, ' ')
                  .slice(Math.floor(e.length / 2))
                  .split('')
                  .join(' ')
              : '';
          }
        );
        var e = this.utils.buildWrapper(t);
        e.find('.MsoFootnoteText').each(function (t) {
          var e = y.dom(t),
            i = e.parent();
          0 !== i.length &&
            -1 !== i.attr('style').search(/mso-element:footnote/) &&
            e.find('a').attr('id', '_' + i.attr('id'));
        }),
          e.find('.MsoFootnoteReference').each(function (t) {
            var e = y.dom(t).parent();
            0 !== e.length && 'A' === e.get().tagName && e.attr('id', e.attr('name'));
          }),
          e.find('p').each(function (t) {
            var e = y.dom(t),
              i = e.attr('style'),
              s = /mso-list:\w+ \w+([0-9]+)/.exec(i);
            s && e.attr('data-listLevel', parseInt(s[1], 10));
          }),
          this._parseWordLists(e),
          e.find('[align]').removeAttr('align'),
          e.find('[name]').removeAttr('name'),
          e.find('span').each(function (t) {
            var e = y.dom(t),
              i = e.attr('style');
            /mso-list:Ignore/.exec(i) ? e.remove() : e.unwrap();
          }),
          e.find('[style]').removeAttr('style'),
          e.find("[class^='Mso']").removeAttr('class'),
          e
            .find('a')
            .filter(function (t) {
              return !t.hasAttribute('href');
            })
            .unwrap();
        for (
          var i = '',
            s = (t = (t = (t = (t = (t = this.utils.getWrapperHtml(e)).replace(/<p[^>]*><\/p>/gi, '')).replace(
              /<li>·/gi,
              '<li>'
            )).trim()).replace(
              /\/(p|ul|ol|h1|h2|h3|h4|h5|h6|blockquote)>\s+<(p|ul|ol|h1|h2|h3|h4|h5|h6|blockquote)/gi,
              '/$1>\n<$2'
            )).split(/\n/),
            n = 0;
          n < s.length;
          n++
        ) {
          var r = '' !== s[n] && -1 === s[n].search(/>$/) ? ' ' : '\n';
          i += s[n] + r;
        }
        return i;
      },
      _parseWordLists: function (t) {
        var a = 0,
          l = null,
          h = null,
          c = null;
        t.find('p').each(function (t) {
          var e = y.dom(t),
            i = e.attr('data-listLevel');
          if ((null === i && e.hasClass('MsoListParagraphCxSpMiddle') && (i = 1), null !== i)) {
            var s = e.text(),
              n = /^\s*\w+\./.test(s) ? '<ol></ol>' : '<ul></ul>';
            if (
              (e.hasClass('MsoListParagraphCxSpFirst') || e.hasClass('MsoNormal')
                ? ((h = y.dom(n)), e.before(h))
                : a < i && 0 !== a && ((c = y.dom(n)), l.append(c), (h = c)),
              i < a)
            )
              for (var r = a - i + 1, o = 0; o < r; o++) h = h.parent();
            e.find('span').first().unwrap(),
              (l = y.dom('<li>' + e.html().trim() + '</li>')),
              null === h && (e.before(n), (h = e.prev())),
              h.append(l),
              e.remove(),
              (a = i);
          } else (h = null), (a = 0);
        });
      },
      _isSpacedEmpty: function (t) {
        return -1 !== t.search(this.reSpacedEmpty);
      },
      _isParagraphEmpty: function (t) {
        return -1 !== t.search(/^<p><\/p>$/i);
      },
      _isHtmlMsWord: function (t) {
        return t.match(/class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i);
      },
      _setSpanAttr: function (t) {
        var e = this.utils.buildWrapper(t);
        return e.find('span').attr('data-redactor-span', !0), this.utils.getWrapperHtml(e);
      },
      _setStyleCache: function (t) {
        var e = this.utils.buildWrapper(t);
        return (
          e.find('[style]').each(function (t) {
            var e = y.dom(t);
            e.attr('data-redactor-style-cache', e.attr('style'));
          }),
          this.utils.getWrapperHtml(e)
        );
      },
      _setPreClass: function (t) {
        var e = this.utils.buildWrapper(t);
        return e.find('pre').addClass(this.opts.preClass), this.utils.getWrapperHtml(e);
      },
      _setLinkNofollow: function (t) {
        var e = this.utils.buildWrapper(t);
        return e.find('a').attr('rel', 'nofollow'), this.utils.getWrapperHtml(e);
      },
      _replaceScriptTag: function (t) {
        return t.replace(this.reScriptTag, '<script class="redactor-script-tag" $1>$2</script>');
      },
      _unreplaceScriptTag: function (t) {
        return t.replace(
          /<script class="redactor-script-tag"(.*?[^>]?)>([\w\W]*?)<\/script>/gi,
          '<script$1>$2</script>'
        );
      },
      _replaceNlToBr: function (t) {
        return t.replace(/\n/g, '<br />');
      },
      _removeScriptTag: function (t) {
        return t.replace(this.reScriptTag, '');
      },
      _storeMatched: function (t, e, i, s) {
        if (((this['stored' + i] = []), e))
          for (var n = 0; n < e.length; n++)
            (this['stored' + i][n] = e[n]), (t = t.replace(e[n], '####' + s + n + '####'));
        return t;
      },
      _restoreMatched: function (t, e, i) {
        if (this['stored' + e])
          for (var s = 0; s < this['stored' + e].length; s++)
            t = t.replace('####' + i + s + '####', this['stored' + e][s]);
        return t;
      },
    }),
    y.add('class', 'cleaner.figure', {
      init: function (t) {
        (this.app = t), (this.opts = t.opts), (this.utils = t.utils), (this.detector = t.detector);
      },
      convert: function (t, e) {
        var i = this.utils.buildWrapper(t);
        return (
          i.find('img').each(this._convertImage.bind(this)),
          i.find('hr').each(this._convertLine.bind(this)),
          i.find('iframe').each(this._convertIframe.bind(this)),
          i.find('table').each(this._convertTable.bind(this)),
          i.find('form').each(this._convertForm.bind(this)),
          i.find('figure pre').each(this._convertCode.bind(this)),
          i.find('[data-redactor-type=variable]').addClass('redactor-component'),
          i.find('figure').not('.redactor-component, .redactor-figure-code').each(this._convertWidget.bind(this)),
          i.find('figure pre').each(this._setContenteditableCode.bind(this)),
          i.find('.redactor-component, .non-editable').attr('contenteditable', !1),
          this.detector.isIe() && i.find('[data-redactor-type=table]').removeAttr('contenteditable'),
          i.find('figcaption, td, th').attr('contenteditable', !0),
          i.find('.redactor-component, figcaption').attr('tabindex', '-1'),
          this._acceptExtraRules(i, e),
          this.utils.getWrapperHtml(i)
        );
      },
      unconvert: function (t, e) {
        t = (t = t.replace(/<\/([^>]+)><div data-redactor-tag/g, '</$1>\n<div data-redactor-tag')).replace(
          /<\/([^>]+)><p/g,
          '</$1>\n<p'
        );
        var i = this.utils.buildWrapper(t);
        return (
          i.find('th, td, figcaption, figure, pre, code, .redactor-component').removeAttr('contenteditable tabindex'),
          i.find('figure').removeClass('redactor-component redactor-component-active redactor-uploaded-figure'),
          i.find('[data-redactor-type=variable]').removeClass('redactor-component redactor-component-active'),
          i.find('figure[data-redactor-type=line]').unwrap(),
          i.find('figure[data-redactor-type=widget]').each(this._unconvertWidget.bind(this)),
          i.find('figure[data-redactor-type=form]').each(this._unconvertForm.bind(this)),
          i.find('figure[data-redactor-type=table]').each(this._unconvertTable.bind(this)),
          i.find('figure[data-redactor-type=image]').removeAttr('rel').each(this._unconvertImages.bind(this)),
          i.find('img').removeAttr('data-redactor-type').removeClass('redactor-component'),
          i.find('.non-editable').removeAttr('contenteditable'),
          i.find('figure').each(this._removeTypes.bind(this)),
          i.find('span.redactor-component-caret').remove(),
          (i = this._unconvertBreakTag(i)),
          this._acceptExtraRules(i, e),
          (t = (t = (t = this.utils.getWrapperHtml(i)).replace(/<br\s?\/?>$/, '')).replace(
            /<br\s?\/?><\/(td|th)>/,
            '</$1>'
          ))
        );
      },
      _convertImage: function (t) {
        var e = y.dom(t);
        if (!this._isNonEditable(e)) {
          this.opts.imageObserve && !e.attr('data-image') && e.attr('data-image', this.utils.getRandomId());
          var i = e.closest('a'),
            s = e.closest('figure');
          if (0 === s.children().not('a, img, br, figcaption').length) {
            if (0 === s.length) {
              var n = 0 !== i.length ? i.closest('p') : e.closest('p');
              if (!1 === this.opts.imageFigure && 0 !== n.length)
                (s = this.utils.replaceToTag(n, 'figure')).addClass('redactor-replace-figure');
              else 0 !== n.length && n.unwrap(), (s = 0 !== i.length ? i.wrap('<figure>') : e.wrap('<figure>'));
            } else
              s.hasClass('redactor-uploaded-figure')
                ? s.removeClass('redactor-uploaded-figure')
                : s.addClass('redactor-keep-figure');
            this._setFigure(s, 'image');
          }
        }
      },
      _convertTable: function (t) {
        if (!this._isNonEditable(t)) {
          var e = this._wrapFigure(t);
          this._setFigure(e, 'table');
        }
      },
      _convertLine: function (t) {
        if (!this._isNonEditable(t)) {
          var e = this._wrapFigure(t);
          this._setFigure(e, 'line');
        }
      },
      _convertForm: function (t) {
        if (!this._isNonEditable(t)) {
          var e = this.utils.replaceToTag(t, 'figure');
          this._setFigure(e, 'form');
        }
      },
      _convertIframe: function (t) {
        if (!this._isNonEditable(t) && 0 === y.dom(t).closest('.redactor-component').length) {
          var e = t.getAttribute('src'),
            i = e && (e.match(this.opts.regex.youtube) || e.match(this.opts.regex.vimeo)),
            s = this._wrapFigure(t);
          i && this._setFigure(s, 'video');
        }
      },
      _convertCode: function (t) {
        if (!this._isNonEditable(t)) {
          var e = this._wrapFigure(t);
          this._setFigure(e, 'code');
        }
      },
      _convertWidget: function (t) {
        if (!this._isNonEditable(t)) {
          var e = y.dom(t);
          e.addClass('redactor-component'),
            e.attr('data-redactor-type', 'widget'),
            e.attr('data-widget-code', encodeURI(t.innerHTML.trim()));
        }
      },
      _unconvertBreakTag: function (t) {
        return (
          t.find('[data-redactor-tag]').each(
            function (t) {
              var e = y.dom(t);
              if ((e.removeAttr('data-redactor-tag'), 0 === t.attributes.length))
                if (t.lastChild && 'BR' === t.lastChild.tagName) e.unwrap();
                else {
                  var i = e.nextElement();
                  0 !== i.length && i.attr('data-redactor-tag') && t.appendChild(document.createElement('br')),
                    e.unwrap();
                }
              else t.lastChild && 'BR' === t.lastChild.tagName && y.dom(t.lastChild).remove();
            }.bind(this)
          ),
          t
        );
      },
      _unconvertForm: function (t) {
        this.utils.replaceToTag(t, 'form');
      },
      _unconvertTable: function (t) {
        y.dom(t).unwrap();
      },
      _unconvertWidget: function (t) {
        var e = y.dom(t);
        e.html(decodeURI(e.attr('data-widget-code'))), e.removeAttr('data-widget-code');
      },
      _unconvertImages: function (t) {
        var e = y.dom(t);
        e.removeClass('redactor-component');
        var i = 0 !== e.closest('li').length,
          s = 0 !== e.closest('table').length,
          n = 0 !== e.find('figcaption').length,
          r = e.attr('style'),
          o = !(null === r || '' === r),
          a = '' !== e.attr('class');
        (!i && (!s || n || o || a)) || e.unwrap();
      },
      _removeTypes: function (t) {
        var e = y.dom(t),
          i = e.attr('data-redactor-type');
        if (
          (i &&
            -1 !== ['image', 'widget', 'line', 'video', 'code', 'form', 'table'].indexOf(i) &&
            e.removeAttr('data-redactor-type'),
          e.hasClass('redactor-keep-figure'))
        )
          e.removeClass('redactor-keep-figure');
        else if ('image' === i && !1 === this.opts.imageFigure) {
          0 !== e.find('figcaption').length ||
            (e.hasClass('redactor-replace-figure') && e.removeClass('redactor-replace-figure'),
            this.utils.replaceToTag(e, 'p'));
        }
        e.removeClass('redactor-replace-figure');
      },
      _wrapFigure: function (t) {
        var e = y.dom(t),
          i = e.closest('figure');
        return 0 === i.length ? e.wrap('<figure>') : i;
      },
      _setFigure: function (t, e) {
        t.addClass('redactor-component'), t.attr('data-redactor-type', e);
      },
      _setContenteditableCode: function (t) {
        if (!this._isNonEditable(t)) {
          var e = y.dom(t),
            i = e.children('code').first();
          (0 !== i.length ? i : e).attr('contenteditable', !0).attr('tabindex', '-1');
        }
      },
      _acceptExtraRules: function (t, e) {
        for (var i in e) 'function' == typeof e[i] && e[i](t);
      },
      _isNonEditable: function (t) {
        return 0 !== y.dom(t).closest('.non-editable').length;
      },
    }),
    y.add('class', 'cleaner.paragraphize', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.utils = t.utils),
          (this.cleaner = t.cleaner),
          (this.element = t.element),
          (this.stored = []),
          (this.remStart = '#####replace'),
          (this.remEnd = '#####'),
          (this.paragraphizeTags = [
            'table',
            'div',
            'pre',
            'form',
            'ul',
            'ol',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'dl',
            'blockquote',
            'figcaption',
            'address',
            'section',
            'header',
            'footer',
            'aside',
            'article',
            'object',
            'style',
            'script',
            'iframe',
            'select',
            'input',
            'textarea',
            'button',
            'option',
            'map',
            'area',
            'math',
            'hr',
            'fieldset',
            'legend',
            'hgroup',
            'nav',
            'figure',
            'details',
            'menu',
            'summary',
            'p',
          ]);
      },
      convert: function (t) {
        var e = this._isConverted(t);
        return (e = !0 === e ? this._convert(t) : e), (e = this._convertTable(e));
      },
      _convert: function (t, e) {
        var i = this.opts.breakline || e ? 'sdivtag' : this.opts.markup,
          s = e ? 'tbr' : 'br';
        t = this._storeTags(t);
        var n = [];
        (t = (t = this.cleaner.storeComments(t, n)).trim()), (t = this._trimLinks(t));
        var r = this.opts.inlineTags.join('|');
        t = (t = (t = (t = (t = t.replace(
          new RegExp('<(' + r + ')(.*?[^>]?)>\n</(' + r + ')>', 'gi'),
          '<$1$2></$3>'
        )).replace(/xparagraphmarkerz(?:\r\n|\r|\n)$/g, '')).replace(/xparagraphmarkerz$/g, '')).replace(
          /xparagraphmarkerz(?:\r\n|\r|\n)/g,
          '\n'
        )).replace(/xparagraphmarkerz/g, '\n');
        for (
          var o = '',
            a = (t = this.opts.breakline
              ? (t = (t = t.replace(/<br\s?\/?>(?:\r\n|\r|\n)/gi, 'xbreakmarkerz\n')).replace(
                  /<br\s?\/?>/gi,
                  'xbreakmarkerz\n'
                )).replace(/xbreakmarkerz\n<\//gi, 'xbreakmarkerz</')
              : t.replace(/[\n]+/g, '\n')).split('\n'),
            l = 0;
          l < a.length;
          l++
        )
          o += '<' + i + '>' + a[l] + '</' + i + '>\n';
        return (
          (t = (t = (t = (t = o.replace(/\n$/, '')).replace(new RegExp('<' + i + '>\\s+#####', 'gi'), '#####')).replace(
            new RegExp('<' + i + '>#####', 'gi'),
            '#####'
          )).replace(new RegExp('#####</' + i + '>', 'gi'), '#####')),
          (t = this.opts.breakline ? t.replace(/xbreakmarkerz/gi, '<br>') : t),
          (t = this._restoreTags(t)),
          (t = this.cleaner.restoreComments(t, n)),
          this.opts.breakline &&
            (t = t.replace(new RegExp('<' + i + '></' + i + '>', 'gi'), '<' + i + '><br></' + i + '>')),
          (t = (t = (t = t.replace(new RegExp('<sdivtag>', 'gi'), '<div data-redactor-tag="' + s + '">')).replace(
            new RegExp('sdivtag', 'gi'),
            'div'
          )).replace(/<\/([^>]+)><div data-redactor-tag/g, '</$1>\n<div data-redactor-tag'))
        );
      },
      _convertTable: function (t) {
        var e = this.utils.buildWrapper(t);
        return e.find('td, th').each(this._convertCell.bind(this)), (t = this.utils.getWrapperHtml(e));
      },
      _convertCell: function (t) {
        var e = y.dom(t);
        this.stored = [];
        var i = this._convert(e.html(), !0);
        e.html(i);
      },
      _storeTags: function (t) {
        var s = this,
          e = this.utils.buildWrapper(t);
        return (
          e.find(this.paragraphizeTags.join(', ')).each(function (t, e) {
            var i = document.createTextNode(s.remStart + e + s.remEnd + 'xparagraphmarkerz');
            s.stored.push(t.outerHTML), t.parentNode.replaceChild(i, t);
          }),
          this.utils.getWrapperHtml(e)
        );
      },
      _restoreTags: function (t) {
        for (var e = 0; e < this.stored.length; e++)
          (this.stored[e] = this.stored[e].replace(/\$/g, '&#36;')),
            (t = t.replace(this.remStart + e + this.remEnd, this.stored[e]));
        return t;
      },
      _trimLinks: function (t) {
        var e = this.utils.buildWrapper(t);
        return e.find('a').each(this._trimLink.bind(this)), (t = this.utils.getWrapperHtml(e));
      },
      _trimLink: function (t) {
        var e = y.dom(t);
        e.html(e.html().trim());
      },
      _isConverted: function (t) {
        return this._isDisabled(t) ? t : !this._isEmptyHtml(t) || this.opts.emptyHtml;
      },
      _isDisabled: function () {
        return !1 === this.opts.paragraphize || this.element.isType('inline');
      },
      _isEmptyHtml: function (t) {
        return '' === t || '<p></p>' === t || '<div></div>' === t;
      },
    }),
    y.add('service', 'detector', {
      init: function (t) {
        (this.app = t), (this.userAgent = navigator.userAgent.toLowerCase());
      },
      isWebkit: function () {
        return /webkit/.test(this.userAgent);
      },
      isFirefox: function () {
        return -1 < this.userAgent.indexOf('firefox');
      },
      isIe: function (t) {
        return document.documentMode || /Edge/.test(navigator.userAgent)
          ? 'edge'
          : RegExp('msie' + (isNaN(t) ? '' : '\\s' + t), 'i').test(navigator.userAgent) ||
              !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
      },
      isMobile: function () {
        return /(iPhone|iPod|Android)/.test(navigator.userAgent);
      },
      isDesktop: function () {
        return !/(iPhone|iPod|iPad|Android)/.test(navigator.userAgent);
      },
      isIpad: function () {
        return /iPad/.test(navigator.userAgent);
      },
    }),
    y.add('service', 'offset', {
      init: function (t) {
        this.app = t;
      },
      get: function (t, e) {
        var i = { start: 0, end: 0 },
          s = this.utils.getNode(t);
        if (!s) return !1;
        var n = this.editor.isEditor(s),
          r = !!n || this.selection.isIn(s),
          o = this.selection.getRange();
        if (n || r) {
          if (this.selection.is() && r) {
            var a = y.dom(o.startContainer).hasClass('redactor-component') ? o.startOffset : 0,
              l = o.cloneRange();
            l.selectNodeContents(s), l.setEnd(o.startContainer, o.startOffset);
            var h = this._getString(o, e);
            (i.start = this._getString(l, e).length - a), (i.end = i.start + h.length + a);
          }
        } else i = !1;
        return i;
      },
      set: function (t, e) {
        if (!this._setComponentOffset(e)) {
          this.component.clearActive();
          var i = this.utils.getNode(e);
          if (i) {
            var s = this.size(i),
              n = 0,
              r = document.createRange();
            (t.end = t.end > s ? s : t.end), r.setStart(i, 0), r.collapse(!0);
            for (var o = [i], a = !1, l = !1; !l && (i = o.pop()); )
              if (3 === i.nodeType) {
                var h = n + i.length;
                !a &&
                  !this._isFigcaptionNext(i) &&
                  t.start >= n &&
                  t.start <= h &&
                  (r.setStart(i, t.start - n), (a = !0)),
                  a && t.end >= n && t.end <= h && (r.setEnd(i, t.end - n), (l = !0)),
                  (n = h);
              } else for (var c = i.childNodes.length; c--; ) o.push(i.childNodes[c]);
            this.selection.setRange(r);
          }
        }
      },
      size: function (t, e) {
        var i = this.utils.getNode(t);
        if (i) {
          var s = document.createRange().cloneRange();
          return s.selectNodeContents(i), this._getString(s, e).length;
        }
        return 0;
      },
      _getString: function (t, e) {
        var i = t.toString();
        return (i = this.editor.isEmpty() ? i.replace(/\uFEFF/g, '') : i), (i = e ? i.trim() : i);
      },
      _setComponentOffset: function (t) {
        return !!this.component.isNonEditable(t) && this.component.setActive(t);
      },
      _isFigcaptionNext: function (t) {
        var e = t.nextSibling;
        return '' === t.nodeValue.trim() && e && 'FIGCAPTION' === e.tagName;
      },
    }),
    y.add('service', 'inspector', {
      init: function (t) {
        this.app = t;
      },
      parse: function (t) {
        return y.create('inspector.parser', this.app, this, t);
      },
      isText: function (t) {
        if ('string' == typeof t && !/^\s*<(\w+|!)[^>]*>/.test(t)) return !0;
        var e = y.dom(t).get();
        return e && 3 === e.nodeType;
      },
      isInlineTag: function (t, e) {
        var i = this._extendTags(this.opts.inlineTags, e);
        return this._isTag(t) && -1 !== i.indexOf(t.toLowerCase());
      },
      isBlockTag: function (t, e) {
        var i = this._extendTags(this.opts.blockTags, e);
        return this._isTag(t) && -1 !== i.indexOf(t.toLowerCase());
      },
      isTableCellTag: function (t) {
        return -1 !== ['td', 'th'].indexOf(t.toLowerCase());
      },
      isHeadingTag: function (t) {
        return -1 !== ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(t.toLowerCase());
      },
      _isTag: function (t) {
        return void 0 !== t && t;
      },
      _extendTags: function (t, e) {
        if (((t = t.concat(t)), e)) for (var i = 0; i < e.length; i++) t.push(e[i]);
        return t;
      },
    }),
    y.add('class', 'inspector.parser', {
      init: function (t, e, i) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.utils = t.utils),
          (this.editor = t.editor),
          (this.selection = t.selection),
          (this.inspector = e);
        var s = this.editor.getElement();
        (this.el = i),
          (this.$el = y.dom(this.el, s)),
          (this.node = this.$el.get()),
          this.node && 8 === this.node.nodeType && (this.node = !1),
          (this.$component = this.$el.closest('.redactor-component', s));
      },
      isEditor: function () {
        return this.node === this.editor.getElement().get();
      },
      isInEditor: function () {
        return 0 !== this.$el.parents('.redactor-in-' + this.uuid).length;
      },
      isComponent: function () {
        return 0 !== this.$component.length;
      },
      isComponentType: function (t) {
        return this.getComponentType() === t;
      },
      isComponentActive: function () {
        return this.isComponent() && this.$component.hasClass('redactor-component-active');
      },
      isComponentEditable: function () {
        var t = this.getComponentType();
        return this.isComponent() && -1 !== ['code', 'table'].indexOf(t);
      },
      isFigcaption: function () {
        return this.getFigcaption();
      },
      isPre: function () {
        return this.getPre();
      },
      isCode: function () {
        var t = this.$el.closest('code'),
          e = t.parent('pre');
        return 0 !== t.length && 0 === e.length;
      },
      isList: function () {
        return this.getList();
      },
      isFirstListItem: function () {
        return this._getLastOrFirstListItem('first');
      },
      isLastListItem: function () {
        return this._getLastOrFirstListItem('last');
      },
      isFirstTableCell: function () {
        return this._getLastOrFirstTableCell('first');
      },
      isLastTableCell: function () {
        return this._getLastOrFirstTableCell('last');
      },
      isTable: function () {
        return this.isComponentType('table') || this.getTable();
      },
      isHeading: function () {
        return this.getHeading();
      },
      isBlockquote: function () {
        return this.getBlockquote();
      },
      isDl: function () {
        return this.getDl();
      },
      isParagraph: function () {
        return this.getParagraph();
      },
      isLink: function () {
        return this.getLink();
      },
      isFile: function () {
        return this.getFile();
      },
      isText: function () {
        return this.inspector.isText(this.el);
      },
      isInline: function () {
        var t = this.opts.inlineTags;
        return !!this.isElement() && -1 !== t.indexOf(this.node.tagName.toLowerCase());
      },
      isBlock: function () {
        var t = this.opts.blockTags;
        return !!this.isElement() && -1 !== t.indexOf(this.node.tagName.toLowerCase());
      },
      isElement: function () {
        return this.node && this.node.nodeType && 3 !== this.node.nodeType;
      },
      hasParent: function (t) {
        return 0 !== this.$el.closest(t.join(',')).length;
      },
      getNode: function () {
        return this.node;
      },
      getTag: function () {
        return !!this.isElement() && this.node.tagName.toLowerCase();
      },
      getComponent: function () {
        return !!this.isComponent() && this.$component.get();
      },
      getComponentType: function () {
        return !!this.isComponent() && this.$component.attr('data-redactor-type');
      },
      getFirstNode: function () {
        return this.utils.getFirstNode(this.node);
      },
      getLastNode: function () {
        return this.utils.getLastNode(this.node);
      },
      getFirstElement: function () {
        return this.utils.getFirstElement(this.node);
      },
      getLastElement: function () {
        return this.utils.getLastElement(this.node);
      },
      getFigcaption: function () {
        return this._getClosestNode('figcaption');
      },
      getPre: function () {
        return this._getClosestNode('pre');
      },
      getCode: function () {
        return this._getClosestNode('code');
      },
      getList: function () {
        return this._getClosestNode('ul, ol');
      },
      getParentList: function () {
        return this._getClosestUpNode('ul, ol');
      },
      getListItem: function () {
        return this._getClosestNode('li');
      },
      getTable: function () {
        return this.getComponentType('table') ? this.$component.find('table').get() : this._getClosestNode('table');
      },
      getTableCell: function () {
        var t = this.$el.closest('td, th');
        return 0 !== t.length && t.get();
      },
      getComponentCodeElement: function () {
        return !!this.isComponentType('code') && this.$component.find('pre code, pre').last().get();
      },
      getImageElement: function () {
        return !!this.isComponentType('image') && this.$component.find('img').get();
      },
      getParagraph: function () {
        return this._getClosestNode('p');
      },
      getHeading: function () {
        return this._getClosestNode('h1, h2, h3, h4, h5, h6');
      },
      getDl: function () {
        return this._getClosestNode('dl');
      },
      getBlockquote: function () {
        return this._getClosestNode('blockquote');
      },
      getLink: function () {
        var t = this.isComponent() && !this.isFigcaption();
        if (!this.isComponentType('table') && t) return !1;
        var e = this._getClosestElement('a');
        return !(!e || e.attr('data-file')) && e.get();
      },
      getFile: function () {
        var t = this.isComponent();
        if (!this.isComponentType('table') && t) return !1;
        var e = this._getClosestElement('a');
        return !(!e || !e.attr('data-file')) && e.get();
      },
      findFirstNode: function (t) {
        return this.$el.find(t).first().get();
      },
      findLastNode: function (t) {
        return this.$el.find(t).last().get();
      },
      _getLastOrFirstListItem: function (t) {
        var e = this.getList(),
          i = this.getTag();
        if (e && 'li' === i) {
          var s = y.dom(e).find('li')[t]().get();
          if (s && this.node === s) return !0;
        }
        return !1;
      },
      _getLastOrFirstTableCell: function (t) {
        var e = this.getTable(),
          i = this.getTag();
        if (e && ('td' === i || 'th' === i)) {
          var s = y.dom(e).find('td, th')[t]().get();
          if (s && this.node === s) return !0;
        }
        return !1;
      },
      _getClosestUpNode: function (t) {
        var e = this.editor.getElement(),
          i = this.$el.parents(t, e).last();
        return 0 !== i.length && i.get();
      },
      _getClosestNode: function (t) {
        var e = this.editor.getElement(),
          i = this.$el.closest(t, e);
        return 0 !== i.length && i.get();
      },
      _getClosestElement: function (t) {
        var e = this.editor.getElement(),
          i = this.$el.closest(t, e);
        return 0 !== i.length && i;
      },
    }),
    y.add('service', 'marker', {
      init: function (t) {
        this.app = t;
      },
      build: function (t, e) {
        var i = document.createElement('span');
        return (
          (i.id = 'selection-marker-' + this._getPos(t)),
          (i.className = 'redactor-selection-marker'),
          (i.innerHTML = this.opts.markerChar),
          e ? i.outerHTML : i
        );
      },
      buildHtml: function (t) {
        return this.build(t, !0);
      },
      insert: function (t) {
        this.remove();
        var e = 'both' !== t && ('start' === t || this.selection.isCollapsed());
        this.selection.is() || this.editor.focus();
        var i = this.selection.getRange();
        if (i) {
          var s = this.build('start'),
            n = this.build('end'),
            r = i.cloneRange();
          return (
            e || (r.collapse(!1), r.insertNode(n)),
            r.setStart(i.startContainer, i.startOffset),
            r.collapse(!0),
            r.insertNode(s),
            i.setStartAfter(s),
            e || i.setEndBefore(n),
            this.selection.setRange(i),
            s
          );
        }
      },
      find: function (t, e) {
        var i = this.editor.getElement(),
          s = (e || i).find('span#selection-marker-' + this._getPos(t));
        return 0 !== s.length && s.get();
      },
      restore: function () {
        var t = this.find('start'),
          e = this.find('end'),
          i = this.selection.getRange();
        if (((i && this.selection.is()) || (this.editor.focus(), (i = document.createRange())), t)) {
          var s = !!e && e.previousSibling,
            n = t.nextSibling;
          (n = (!n || 3 !== n.nodeType || '' !== n.textContent.replace(/[\n\t]/g, '')) && n),
            e
              ? n && 'selection-marker-end' === n.id
                ? this._restoreInject(i, t)
                : s && n
                  ? (i.selectNodeContents(s), i.collapse(!1), i.setStart(n, 0))
                  : s && !n
                    ? (i.selectNodeContents(s), i.collapse(!1), i.setStartAfter(t))
                    : (i.setStartAfter(t), i.setEndBefore(e))
              : n
                ? (i.selectNodeContents(n), i.collapse(!0))
                : this._restoreInject(i, t),
            this.selection.setRange(i),
            t && t.parentNode.removeChild(t),
            e && e.parentNode.removeChild(e);
        }
      },
      remove: function () {
        var t = this.find('start'),
          e = this.find('end');
        t && t.parentNode.removeChild(t), e && e.parentNode.removeChild(e);
      },
      _getPos: function (t) {
        return void 0 === t ? 'start' : t;
      },
      _restoreInject: function (t, e) {
        var i = this.utils.createInvisibleChar();
        y.dom(e).after(i), t.selectNodeContents(i), t.collapse(!1);
      },
    }),
    y.add('service', 'component', {
      init: function (t) {
        (this.app = t), (this.activeClass = 'redactor-component-active');
      },
      create: function (t, e) {
        return y.create(t + '.component', this.app, e);
      },
      build: function (t) {
        var e,
          i = y.dom(t).attr('data-redactor-type');
        return i && (e = this.create(i, t)), e || t;
      },
      remove: function (t, e) {
        var i = y.dom(t).closest('.redactor-component'),
          s = i.attr('data-redactor-type'),
          n = i.parent(),
          r = this.inspector.parse(n),
          o = this.utils.findSiblings(i, 'prev'),
          a = this.utils.findSiblings(i, 'next');
        if (!1 !== this.app.broadcast(s + '.delete', i)) {
          if (
            (i.remove(),
            this.app.broadcast(s + '.deleted', i),
            this.app.broadcast('contextbar.close'),
            this.app.broadcast('imageresizer.stop'),
            !1 !== e)
          ) {
            var l = r.getTableCell();
            l && this.utils.isEmptyHtml(l.innerHTML)
              ? this.caret.setStart(l)
              : a
                ? this.caret.setStart(a)
                : o
                  ? this.caret.setEnd(o)
                  : this.editor.startFocus();
          }
          this.editor.isEmpty() && (this.editor.setEmpty(), this.editor.startFocus(), this.app.broadcast('empty'));
        }
      },
      isNonEditable: function (t) {
        var e = this.inspector.parse(t);
        return e.isComponent() && !e.isComponentEditable();
      },
      isActive: function (t) {
        if (t) {
          var e = this.inspector.parse(t);
          return y.dom(e.getComponent()).hasClass(this.activeClass);
        }
        return 0 !== this._find().length;
      },
      getActive: function (t) {
        var e = this._find();
        return 0 !== e.length && (t ? e : e.get());
      },
      setActive: function (t) {
        this.clearActive(), this.editor.focus();
        var e = this.inspector.parse(t),
          i = e.getComponent(),
          s = y.dom(i);
        if (!e.isFigcaption()) {
          var n = s.find('.redactor-component-caret');
          0 === n.length && ((n = this._buildCaret()), s.prepend(n)), this.caret.setAtStart(n.get());
        }
        s.addClass(this.activeClass);
      },
      clearActive: function () {
        var t = this._find();
        t.removeClass(this.activeClass),
          t.find('.redactor-component-caret').remove(),
          this.app.broadcast('imageresizer.stop');
      },
      setOnEvent: function (t, e) {
        this.clearActive();
        var i = this.inspector.parse(t.target);
        i.isFigcaption() ||
          i.isComponentEditable() ||
          (i.isComponent() && (this.setActive(t.target), !0 !== e && t.preventDefault()));
      },
      executeScripts: function (t) {
        if (void 0 === t) {
          t = this.editor.getElement().find('[data-redactor-type]').find('script').getAll();
          this.executeScripts.call(this, t);
        } else
          for (var e = 0; e < t.length; e++)
            if ('' !== t[e].src) {
              var i = t[e].src;
              this.$doc.find('head script[src="' + i + '"]').remove();
              var s = y.dom('<script>');
              s.attr('src', i),
                s.attr('async defer'),
                (s.get().onload = function () {
                  -1 !== i.search('instagram') && window.instgrm.Embeds.process(), this.executeScripts(t.slice(e + 1));
                }.bind(this));
              var n = document.getElementsByTagName('head')[0];
              n && n.appendChild(s.get());
              break;
            }
      },
      _find: function () {
        return this.editor.getElement().find('.' + this.activeClass);
      },
      _buildCaret: function () {
        var t = y.dom('<span>');
        return t.addClass('redactor-component-caret'), t.attr('contenteditable', !0), t;
      },
    }),
    y.add('service', 'insertion', {
      init: function (t) {
        this.app = t;
      },
      set: function (t, e, i) {
        return (
          null === t && (t = ''),
          (t = !1 !== e ? this.cleaner.input(t) : t),
          (t = !1 !== e ? this.cleaner.paragraphize(t) : t),
          this.editor.getElement().html(t),
          !1 !== i && this.editor.endFocus(),
          t
        );
      },
      insertNode: function (t, e) {
        this.editor.focus();
        var i = this.utils.isFragment(t) ? t : this.utils.createFragment(t);
        return this._collapseSelection(), this._insertFragment(i), this._setCaret(e, i), this._sendNodes(i.nodes);
      },
      insertBreakLine: function () {
        return this.insertNode(document.createElement('br'), 'after');
      },
      insertNewline: function () {
        return this.insertNode(document.createTextNode('\n'), 'after');
      },
      insertText: function (t) {
        return this.insertHtml(this.cleaner.getFlatText(t));
      },
      insertChar: function (t) {
        return this.insertNode(t, 'after');
      },
      insertRaw: function (t) {
        return this.insertHtml(t, !1);
      },
      insertToEnd: function (t, e) {
        if (t) {
          3 === t.nodeType && -1 !== t.nodeValue.search(/^\n/) && (t = t.previousElementSibling);
          var i = y.dom(t);
          if (i.attr('data-redactor-type') === e) {
            var s = this.opts.breakline ? '<br>' : '<p>',
              n = y.dom(s);
            i.after(n), this.caret.setStart(n);
          }
        }
      },
      insertPoint: function (t) {
        var e,
          i = this.marker.build('start'),
          s = !1,
          n = t.clientX,
          r = t.clientY;
        if (document.caretPositionFromPoint) {
          var o = document.caretPositionFromPoint(n, r),
            a = document.getSelection();
          this.inspector.parse(o.offsetNode).isInEditor() &&
            ((e = a.getRangeAt(0)).setStart(o.offsetNode, o.offset), e.collapse(!0), e.insertNode(i), (s = !0));
        } else
          document.caretRangeFromPoint &&
            ((e = document.caretRangeFromPoint(n, r)),
            this.inspector.parse(e.startContainer).isInEditor() && (e.insertNode(i), (s = !0)));
        return s;
      },
      insertToPoint: function (t, e, i, s) {
        if (!(!0 === i || this.insertPoint(t))) {
          var n = this.editor.getLastNode();
          y.dom(n).after(this.marker.build('start'));
        }
        return this.component.clearActive(), this.selection.restoreMarkers(), this.insertHtml(e, s);
      },
      insertToOffset: function (t, e) {
        return this.offset.set({ start: t, end: t }), this.insertHtml(e);
      },
      insertHtml: function (t, e) {
        if (this.opts.input) {
          var i = this.utils.parseHtml(t);
          if (this.selection.isAll()) return this._insertToAllSelected(i);
          if (!this.selection.is()) {
            var s = y.dom('<p>');
            this.editor.getElement().append(s), this.caret.setStart(s);
          }
          var n = this.selection.isCollapsed(),
            r = this.selection.isText(),
            o = this.selection.getCurrent(),
            a = this.selection.getBlock(),
            l = this.inspector.parse(o);
          this._collapseSelection(), (i = this._getCleanedInput(i, l, e));
          var h,
            c,
            d = this._isFigure(i.html),
            u = this._isComponentSpan(i.html),
            p = this.inspector.isText(i.html);
          if (this.editor.isEmpty()) return this._insertToEmptyEditor(i.html);
          if (l.isComponent() && !l.isComponentEditable()) return this._insertToWidget(o, l, i.html);
          if (u) return this.insertNode(i.nodes, 'end');
          if (d && !r && !l.isList())
            return l.isInline()
              ? this._insertToInline(o, i)
              : ((h = this.utils.createFragment(i.html)),
                this.utils.splitNode(o, h),
                this.caret.setEnd(h.last),
                this._sendNodes(h.nodes));
          if (l.isCode()) return this._insertToCode(i, o, e);
          if (l.isPre()) return this._insertToPre(i, e);
          if (l.isHeading() || l.isFigcaption())
            return (
              (i.html = !1 !== e ? this.cleaner.removeTagsExcept(i.html, ['a']) : i.html),
              (i.html = !1 !== e ? this.cleaner.replaceNbspToSpaces(i.html) : i.html),
              (h = this.utils.createFragment(i.html)),
              this.insertNode(h, 'end')
            );
          if (this.opts.breakline && a && 'DIV' === a.tagName) {
            if (this._isPlainHtml(i.html)) return this.insertNode(i.nodes, 'end');
            (i.html = !1 !== e ? this.cleaner.paragraphize(i.html) : i.html), (h = this.utils.createFragment(i.html));
            var f = this.selection.getRange();
            return (
              f && !this.selection.isCollapsed() && f.deleteContents(),
              this.utils.splitNode(o, h),
              this.caret.setEnd(h.last),
              this._sendNodes(h.nodes)
            );
          }
          if (p)
            return !r && 'br' !== this.opts.markup && this._hasBlocksAndImages(i.nodes)
              ? ((i.html = !1 !== e ? this.cleaner.paragraphize(i.html) : i.html),
                (h = this.utils.createFragment(i.html)),
                this.utils.splitNode(o, h),
                this.caret.setEnd(h.last),
                this._sendNodes(h.nodes))
              : ((i.html = !1 !== e ? i.html.replace(/\n/g, '<br>') : i.html),
                (h = this.utils.createFragment(i.html)),
                this.insertNode(h.nodes, 'end'));
          if (!n && !d)
            return this._isPlainHtml(i.html)
              ? this.insertNode(i.nodes, 'end')
              : ((i.html = !1 !== e ? this.cleaner.paragraphize(i.html) : i.html),
                (h = this.utils.createFragment(i.html)),
                this.insertNode(h, 'end'));
          if (l.isInline() && !this._isPlainHtml(i.html)) return this._insertToInline(o, i);
          if (l.isBlockquote() || l.isDl())
            return (
              (c = this.opts.inlineTags).concat(['br']),
              (i.html = !1 !== e ? this.cleaner.replaceBlocksToBr(i.html) : i.html),
              (i.html = !1 !== e ? this.cleaner.removeTagsExcept(i.html, c) : i.html),
              (h = this.utils.createFragment(i.html)),
              this.insertNode(h, 'end')
            );
          if (l.isParagraph())
            return this._isPlainHtml(i.html)
              ? this.insertNode(i.nodes, 'end')
              : ((i.html = !1 !== e ? this.cleaner.paragraphize(i.html) : i.html),
                (h = this.utils.createFragment(i.html)),
                this.utils.splitNode(o, h),
                this.caret.setEnd(h.last),
                this._sendNodes(h.nodes));
          if (
            l.isList() &&
            ((c = (c = this.opts.inlineTags).concat(['br', 'li', 'ul', 'ol', 'img'])),
            (i.html = !1 !== e ? this.cleaner.replaceBlocksToBr(i.html) : i.html),
            (i.html = !1 !== e ? this.cleaner.removeTagsExcept(i.html, c) : i.html),
            (i.html = !1 !== e ? this.cleaner.removeBrAtEnd(i.html) : i.html),
            (h = this.utils.createFragment(i.html)),
            (i.nodes = h.nodes),
            this._containsTags(i.html, ['ul', 'ol', 'li']))
          ) {
            var m = this.selection.getElement(o);
            if (m && 'LI' === m.tagName && this.caret.isStart(m)) {
              (i.nodes = y.dom(h.nodes).unwrap('ul, ol').getAll()), y.dom(m).before(i.nodes);
              var g = i.nodes[i.nodes.length - 1];
              return this.caret.setEnd(g), this._sendNodes(i.nodes);
            }
            return this._isPlainHtml(i.html)
              ? this.insertNode(h, 'end')
              : ((h = this._buildList(i, m, h)),
                this.utils.splitNode(o, h, !0),
                this.caret.setEnd(h.last),
                this._sendNodes(h.nodes));
          }
          return this.insertNode(i.nodes, 'end');
        }
      },
      _insertToAllSelected: function (t) {
        var e = this.set(t.html),
          i = this.utils.parseHtml(e);
        return this._sendNodes(i.nodes);
      },
      _insertToEmptyEditor: function (t) {
        t = this.cleaner.paragraphize(t);
        var e = this.utils.createFragment(t),
          i = this.editor.getElement();
        return i.html(''), i.append(e.frag), this.caret.setEnd(e.last), this._sendNodes(e.nodes);
      },
      _insertToInline: function (t, e) {
        var i = this.utils.createFragment(e.html);
        return this.utils.splitNode(t, i, !1, !0), this.caret.setEnd(i.last), this._sendNodes(i.nodes);
      },
      _insertToCode: function (t, e, i) {
        (t.html = !1 !== i ? this.cleaner.encodeHtml(t.html) : t.html),
          (t.html = !1 !== i ? this.cleaner.removeNl(t.html) : t.html);
        var s = this.utils.createFragment(t.html),
          n = this.insertNode(s, 'end');
        return this.utils.normalizeTextNodes(e), n;
      },
      _insertToPre: function (t, e) {
        t.html = !1 !== e ? this.cleaner.encodeHtml(t.html) : t.html;
        var i = this.utils.createFragment(t.html);
        return this.insertNode(i, 'end');
      },
      _insertToWidget: function (t, e, i) {
        i = this._isComponentSpan(i) ? i : this.cleaner.paragraphize(i);
        var s = this.utils.createFragment(i),
          n = e.getComponent(),
          r = y.dom(n);
        return r.after(s.frag), r.remove(), this.caret.setEnd(s.last), this._sendNodes(s.nodes);
      },
      _insertFragment: function (t) {
        var e = this.selection.getRange();
        if (e) {
          if (this.selection.isCollapsed()) {
            var i = e.startContainer;
            3 !== i.nodeType && 'BR' === i.tagName && (this.caret.setAfter(i), i.parentNode.removeChild(i));
          } else e.deleteContents();
          e.insertNode(t.frag);
        }
      },
      _sendNodes: function (t) {
        for (var e = 0; e < t.length; e++) {
          var i = t[e],
            s = 3 !== i.nodeType && 'function' == typeof i.getAttribute && i.getAttribute('data-redactor-type');
          s && this.app.broadcast(s + '.inserted', this.component.build(i));
        }
        return (
          this.detector.isIe() &&
            this.editor.getElement().find('[data-redactor-type=table]').attr('contenteditable', !0),
          this.app.broadcast('inserted', t),
          this.component.executeScripts(),
          t
        );
      },
      _setCaret: function (t, e) {
        var i = this._isLastInline(e);
        t
          ? ((t = i && 'end' === t ? 'after' : t), this.caret['set' + this.utils.ucfirst(t)](e.last))
          : !1 !== t && i && this.caret.setAfter(e.last);
      },
      _isLastInline: function (t) {
        return !!t.last && this.inspector.parse(t.last).isInline();
      },
      _getCleanedInput: function (t, e, i) {
        var s = e.isCode() || e.isPre();
        return (
          (t.html = t.html.replace(/&nbsp;/g, ' ')),
          (t.html = s || !1 === i ? t.html : this.cleaner.input(t.html)),
          (t = s || !1 === i ? t : this.utils.parseHtml(t.html))
        );
      },
      _getContainer: function (t) {
        return y.dom(this.utils.createTmpContainer(t));
      },
      _buildList: function (t, e, i) {
        var s = t.nodes[0];
        if (s && 3 !== s.nodeType && 'li' === s.tagName) {
          var n = y.dom(e).get().tagName.toLowerCase(),
            r = y.dom('<' + n + ' />');
          return r.append(i.nodes), this.utils.createFragment(r.get().outerHTML);
        }
        return i;
      },
      _containsTags: function (t, e) {
        return 0 !== this._getContainer(t).find(e.join(',')).length;
      },
      _collapseSelection: function () {},
      _hasFigureOrTable: function (t) {
        return 0 !== this._getContainer(t).find('figure, table').length;
      },
      _hasBlocks: function (t) {
        return 0 !== this._getContainer(t).find(this.opts.blockTags.join(',')).length;
      },
      _hasBlocksAndImages: function (t) {
        return 0 !== this._getContainer(t).find(this.opts.blockTags.join(',') + ',img').length;
      },
      _isPlainHtml: function (t) {
        return 0 === this._getContainer(t).find(this.opts.blockTags.join(',') + ', img').length;
      },
      _isFigure: function (t) {
        if (this._isHtmlString(t)) return 0 !== y.dom(t).closest('figure').length;
      },
      _isComponentSpan: function (t) {
        if (this._isHtmlString(t)) return 0 !== y.dom(t).closest('span.redactor-component').length;
      },
      _isHtmlString: function (t) {
        return !('string' == typeof t && !/^\s*<(\w+|!)[^>]*>/.test(t));
      },
    }),
    y.add('service', 'block', {
      init: function (t) {
        (this.app = t), (this.tags = ['p', 'div', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
      },
      format: function (t) {
        return (
          (this.params = { args: !1 }),
          (this.params.type = t.type ? t.type : 'set'),
          (this.params.tag = 'string' == typeof t ? t : t.tag || this.opts.markup),
          (this.params.tag = this.params.tag.toLowerCase()),
          (this.params.args = { class: t.class || !1, style: t.style || !1, attr: t.attr || !1 }),
          t.class || t.style || t.attr || (this.params.args = !1),
          this._format()
        );
      },
      add: function (t, e, i) {
        return this._apply('add', t, e, !0, i);
      },
      set: function (t, e) {
        return this._apply('set', t, e);
      },
      toggle: function (t, e) {
        return this._apply('toggle', t, e);
      },
      remove: function (t, e) {
        return this._apply('remove', t, e);
      },
      clearFormat: function (t) {
        return this._clear(t, 'all');
      },
      clearStyle: function (t) {
        return this._clear(t, 'style');
      },
      clearClass: function (t) {
        return this._clear(t, 'class');
      },
      clearAttr: function (t) {
        return this._clear(t, 'attr');
      },
      _format: function () {
        var t = [];
        (this.collapsed = this.selection.isCollapsed()), this.selection.save();
        this.selection.getBlock();
        var e = this._getBlocks(),
          i = this._isToggleFormatType(e) ? 'toggle' : 'set',
          s = this._getReplacedTag(i);
        return (t = this._replaceBlocks(e, s)), (t = this._buildNodes(t)), this._restoreSelection(t), t;
      },
      _clear: function (t, e, i, s) {
        !1 !== i && this.selection.save();
        var n = this._getElements(t, s);
        return (
          'all' === e
            ? this._removeAllAttr(n, !1)
            : 'style' === e
              ? (n.removeAttr('style'), n.removeAttr('data-redactor-style-cache'))
              : 'class' === e
                ? n.removeAttr('class')
                : 'attr' === e && this._removeAllAttr(n),
          (s = n.getAll()),
          !1 !== i && this._restoreSelection(s),
          s
        );
      },
      _getElements: function (t, e) {
        return y.dom(e || this._getBlocks(t));
      },
      _getBlocks: function (t) {
        for (var e = this.selection.getBlocks({ tags: t || this.tags }), i = [], s = 0; s < e.length; s++)
          ('DIV' === e[s].tagName && !e[s].getAttribute('data-redactor-tag')) || i.push(e[s]);
        return i;
      },
      _getReplacedTag: function (t) {
        return this.opts.breakline
          ? 'toggle' === t
            ? 'div'
            : 'p' === this.params.tag
              ? 'div'
              : this.params.tag
          : 'toggle' === t
            ? this.opts.markup
            : this.params.tag;
      },
      _isStandardParagraph: function () {
        return !this.opts.breakline && 'p' === this.opts.markup;
      },
      _isStandardDiv: function () {
        return !this.opts.breakline && 'div' === this.opts.markup;
      },
      _isBreaklineBlock: function (t) {
        return t && 'DIV' === t.tagName && 'br' === t.getAttribute('data-redactor-tag');
      },
      _isToggleFormatType: function (t) {
        for (var e = 0, i = t.length, s = 0; s < i; s++) t[s] && this.params.tag === t[s].tagName.toLowerCase() && e++;
        return e === i;
      },
      _isCurrentBlockOneAndEmpty: function (t) {
        return this.collapsed && 1 === t.length && this.utils.isEmpty(t[0]);
      },
      _buildNodes: function (t) {
        return 0 < t.length && ((t = this._applyArgs(t, !1)), (t = this._combinePre(t)), (t = this._cleanBlocks(t))), t;
      },
      _replaceBlocks: function (t, e) {
        for (var i = [], s = 0; s < t.length; s++) {
          var n = this.utils.replaceToTag(t[s], e);
          i.push(n.get());
        }
        return i;
      },
      _combinePre: function (t) {
        for (var e = [], i = 0; i < t.length; i++) {
          var s = t[i].nextElementSibling;
          if (s && 'PRE' === t[i].tagName && 'PRE' === s.tagName) {
            var n = y.dom(t[i]),
              r = y.dom(s),
              o = document.createTextNode('\n');
            n.append(o), n.append(r), r.unwrap('pre');
          }
          e.push(t[i]);
        }
        return e;
      },
      _cleanBlocks: function (t) {
        for (var e = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], i = this.opts.inlineTags, s = 0; s < t.length; s++) {
          var n = t[s].tagName.toLowerCase(),
            r = y.dom(t[s]);
          -1 !== e.indexOf(n)
            ? r.find('span').not('.redactor-component, .non-editable, .redactor-selection-marker').unwrap()
            : 'pre' === n && r.find(i.join(',')).not('.redactor-selection-marker').unwrap(),
            !1 === this.params.args && 'p' === this.params.tag && r.removeAttr('class'),
            this.opts.breakline && 'div' === n ? r.attr('data-redactor-tag', 'br') : r.removeAttr('data-redactor-tag'),
            this.utils.normalizeTextNodes(t[s]);
        }
        return t;
      },
      _cleanEmptyClass: function (t) {
        t.each(function (t) {
          '' === t.className && t.removeAttribute('class');
        });
      },
      _cleanEmptyStyle: function (t) {
        this.utils.removeEmptyAttr(t.get(), 'style')
          ? t.removeAttr('data-redactor-style-cache')
          : t.attr('data-redactor-style-cache', t.attr('style'));
      },
      _apply: function (t, e, i, s, n) {
        !1 !== s && this.selection.save();
        var r = this._getElements(i, n);
        if (
          (e.class &&
            ('set' === t
              ? (r.removeAttr('class'), r.addClass(e.class))
              : 'add' === t
                ? r.addClass(e.class)
                : 'toggle' === t
                  ? r.toggleClass(e.class)
                  : 'remove' === t && r.removeClass(e.class),
            this._cleanEmptyClass(r)),
          e.attr &&
            ('set' === t
              ? (this._removeAllAttr(r), r.attr(e.attr))
              : 'add' === t
                ? r.attr(e.attr)
                : 'toggle' === t
                  ? ((o = e.attr),
                    r.each(function (t) {
                      var e = y.dom(t);
                      for (var i in o) e.attr(i) ? e.removeAttr(i) : e.attr(i, o[i]);
                    }))
                  : 'remove' === t && r.removeAttr(e.attr)),
          e.style)
        )
          if ('set' === t)
            r.removeAttr('style'),
              r.css(e.style),
              r.each(function (t) {
                var e = y.dom(t);
                e.attr('data-redactor-style-cache', e.attr('style'));
              });
          else if ('add' === t) {
            var o = e.style;
            r.each(
              function (t) {
                var e = y.dom(t);
                e.css(o), e.attr('data-redactor-style-cache', e.attr('style')), this._convertStyleQuotes(e);
              }.bind(this)
            );
          } else if ('toggle' === t) {
            o = e.style;
            r.each(
              function (t) {
                var e = y.dom(t);
                for (var i in o) {
                  var s = o[i],
                    n = e.css(i);
                  (n = this.utils.isRgb(n) ? this.utils.rgb2hex(n) : n.replace(/"/g, '')),
                    (s = this.utils.isRgb(s) ? this.utils.rgb2hex(s) : s.replace(/"/g, '')),
                    (n = this.utils.hex2long(n)),
                    ('string' == typeof (s = this.utils.hex2long(s)) ? s.toLowerCase() : s) ===
                    ('string' == typeof n ? n.toLowerCase() : n)
                      ? e.css(i, '')
                      : e.css(i, s);
                }
                this._convertStyleQuotes(e), this._cleanEmptyStyle(e);
              }.bind(this)
            );
          } else if ('remove' === t) {
            var a = e.style;
            r.each(
              function (t) {
                var e = y.dom(t);
                e.css(a, ''), this._cleanEmptyStyle(e);
              }.bind(this)
            );
          }
        return (n = r.getAll()), !1 !== s && this._restoreSelection(n), n;
      },
      _applyArgs: function (t) {
        return (t = this.params.args
          ? this._apply(this.params.type, this.params.args, !1, !1, t)
          : this._clear(!1, 'all', !1, t));
      },
      _removeAllAttr: function (t, r) {
        t.each(function (t) {
          var e = ['data-redactor-tag', 'data-redactor-style-cache'];
          !1 === r && (e.push('style'), e.push('class'));
          for (var i = t.attributes.length; 0 < i--; ) {
            var s = t.attributes[i],
              n = s.name;
            -1 === e.indexOf(n) && t.removeAttributeNode(s);
          }
        });
      },
      _restoreSelection: function (t) {
        this._isCurrentBlockOneAndEmpty(t)
          ? this.caret.setStart(t[0])
          : setTimeout(
              function () {
                this.selection.restore();
              }.bind(this),
              1
            );
      },
      _convertStyleQuotes: function (t) {
        var e = t.attr('style');
        e && t.attr('style', e.replace(/"/g, "'"));
      },
    }),
    y.add('service', 'inline', {
      mixins: ['formatter'],
      init: function (t) {
        (this.app = t), (this.count = 0);
      },
      format: function (t) {
        if (!this._isFormat()) return [];
        (this.type = t.type ? t.type : 'set'),
          (this.tag = 'string' == typeof t ? t : t.tag),
          (this.tag = this.tag.toLowerCase()),
          (this.tag = this.arrangeTag(this.tag)),
          'string' == typeof t ? (this.args = !1) : this.buildArgs(t),
          this.detector.isIe() || this.editor.disableNonEditables();
        var e = this.selection.isCollapsed() ? this.formatCollapsed() : this.formatUncollapsed();
        return this.detector.isIe() || this.editor.enableNonEditables(), e;
      },
      _isFormat: function () {
        var t = this.selection.getCurrent(),
          e = this.inspector.parse(t),
          i = e.isComponent() && !e.isComponentType('table') && !e.isFigcaption();
        return !(!1 !== t || !this.selection.isAll()) || !(!t || e.isPre() || e.isCode() || i);
      },
      arrangeTag: function (t) {
        var e = this.opts.replaceTags;
        for (var i in e) t === i && (t = e[i]);
        return t;
      },
      formatCollapsed: function () {
        var t,
          e,
          i,
          s,
          n = [],
          r = this.selection.getInlineFirst(),
          o = this.selection.getInlines({ all: !0 }),
          a = y.dom(r);
        if (r) {
          var l = this.inspector.parse(r);
          if (this.utils.isEmptyHtml(r.innerHTML))
            if (r.tagName.toLowerCase() === this.tag)
              if (this.hasSameArgs(r)) {
                this.caret.setAfter(r), a.remove();
                var h = this.selection.getElement();
                this.utils.normalizeTextNodes(h);
              } else
                'span' === this.tag
                  ? ((n = this.applyArgs([r], !1)), this.caret.setStart(r))
                  : (n = this.insertInline(n));
            else
              l.hasParent([this.tag])
                ? ((e = (t = a.closest(this.tag)).get()),
                  this.hasSameArgs(e) ? (t.unwrap(), this.caret.setStart(r)) : (n = this.insertInline(n)))
                : (n = this.insertInline(n));
          else if (r.tagName.toLowerCase() === this.tag)
            this.hasSameArgs(r)
              ? ((s = this.utils.extractHtmlFromCaret(r)),
                (i = y.dom('<' + this.tag + ' />')),
                (i = this.utils.cloneAttributes(r, i)),
                a.after(i.append(s)),
                '' === i.html().trim() && i.remove(),
                this.caret.setAfter(r))
              : (n = this.insertInline(n));
          else if (l.hasParent([this.tag]))
            if (((e = (t = a.closest(this.tag)).get()), this.hasSameArgs(e))) {
              var c, d;
              (s = this.utils.extractHtmlFromCaret(e, e)),
                (i = y.dom('<' + this.tag + ' />')),
                (i = this.utils.cloneAttributes(e, i));
              var u = 0;
              o = o.reverse();
              for (var p = 0; p < o.length; p++)
                o[p] !== e &&
                  ((d = y.dom('<' + o[p].tagName.toLowerCase() + '>')), 0 === u ? (c = d) : c.append(d), u++);
              t.after(i.append(s)), t.after(c), this.caret.setStart(d);
            } else n = this.insertInline(n);
          else n = this.insertInline(n);
        } else n = this.insertInline(n);
        return n;
      },
      insertInline: function (t) {
        var e = document.createElement(this.tag);
        return (t = this.insertion.insertNode(e, 'start')), this.applyArgs(t, !1);
      },
      hasSameArgs: function (t) {
        if (0 === t.attributes.length && !1 === this.args) return !0;
        var e = !0;
        if (this.args) {
          var i = 0;
          for (var s in this.args) {
            var n = y.dom(t),
              r = this.args[s],
              o = this.utils.toParams(r),
              a = n.attr(s);
            if (r)
              if ('style' === s) {
                o = o.trim().replace(/;$/, '');
                for (
                  var l = this.utils.styleToObj(n.attr('style')), h = o.split(';'), c = 0, d = 0;
                  d < h.length;
                  d++
                ) {
                  var u = h[d].split(':'),
                    p = u[0].trim(),
                    f = u[1].trim();
                  if (-1 !== p.search(/color/)) {
                    var m = n.css(p);
                    !m || (m !== f && this.utils.rgb2hex(m) !== f) || c++;
                  } else n.css(p) === f && c++;
                }
                c === h.length && Object.keys(l).length === h.length && i++;
              } else a === o && i++;
            else (a && '' !== a) || i++;
          }
          e = i === Object.keys(this.args).length;
        }
        return e;
      },
      formatUncollapsed: function () {
        var t = this.selection.getInlines({ all: !0, inside: !0 });
        this.detector.isIe() ? this.selection.saveMarkers() : this.selection.save(),
          this._convertTags('u'),
          this._convertTags('del'),
          this._convertToStrike(t),
          this.detector.isIe() ? this.selection.restoreMarkers() : this.selection.restore(),
          document.execCommand('strikethrough'),
          this._clearDecoration(),
          this.selection.save();
        var e = this._revertToInlines();
        e = this.applyArgs(e, !1);
        for (var i = 0; i < e.length; i++) {
          var s = e[i],
            n = s.tagName.toLowerCase(),
            r = s.attributes.length;
          n === this.tag && 0 === r && this.args && (y.dom(s).unwrap(), e.splice(i, 1));
        }
        return this.selection.restore(), this._clearEmptyStyle(), (e = this._normalizeBlocks(e));
      },
      _convertTags: function (e) {
        this.tag !== e &&
          this.editor
            .getElement()
            .find(e)
            .each(
              function (t) {
                this.utils.replaceToTag(t, 'span').addClass('redactor-convertable-' + e);
              }.bind(this)
            );
      },
      _revertTags: function (i) {
        this.editor
          .getElement()
          .find('span.redactor-convertable-' + i)
          .each(
            function (t) {
              var e = this.utils.replaceToTag(t, i);
              e.removeClass('redactor-convertable-' + i),
                this.utils.removeEmptyAttr(e, 'class') && e.removeAttr('class');
            }.bind(this)
          );
      },
      _convertToStrike: function (t) {
        for (var e = this.selection.getText().replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'), i = 0; i < t.length; i++) {
          var s = this.arrangeTag(t[i].tagName.toLowerCase()),
            n = t[i],
            r = y.dom(n),
            o = this.hasSameArgs(n);
          if (s === this.tag)
            if ('span' === this.tag && this._isTextSelected(n, e)) r.addClass('redactor-convertable-apply');
            else if (o && 'a' !== this.tag) this._replaceToStrike(r);
            else if ('span' === this.tag) {
              if (this.args && this.args.style) for (var a in this.args.style) r.css(a, '');
              this.utils.removeEmptyAttr(r.get(), 'style')
                ? r.addClass('redactor-convertable-apply')
                : r.addClass('redactor-unconvertable-apply');
            } else o || r.addClass('redactor-convertable-apply');
        }
      },
      _replaceToStrike: function (t) {
        t.replaceWith(function () {
          return y.dom('<strike>').append(t.contents());
        });
      },
      _revertToInlines: function () {
        var i = [],
          t = this.editor.getElement();
        return (
          'u' !== this.tag && t.find('u').unwrap(),
          t.find('.redactor-convertable-u').each(function (t) {
            i.push(t);
          }),
          t.find('.redactor-convertable-apply').each(
            function (t) {
              var e = y.dom(t);
              e.find('strike').unwrap(), this._forceRemoveClass(e, 'redactor-convertable-apply'), i.push(t);
            }.bind(this)
          ),
          t.find('span.redactor-unconvertable-apply').each(
            function (t) {
              var e = y.dom(t);
              this._forceRemoveClass(e, 'redactor-unconvertable-apply');
            }.bind(this)
          ),
          t.find('strike').each(
            function (t) {
              var e = this.utils.replaceToTag(t, this.tag);
              i.push(e.get());
            }.bind(this)
          ),
          this._revertTags('u'),
          this._revertTags('del'),
          i
        );
      },
      _normalizeBlocks: function (e) {
        var t = this.opts.inlineTags,
          i = this.selection.getBlocks();
        if (i)
          for (var s = 0; s < i.length; s++) {
            if ('PRE' === i[s].tagName)
              y.dom(i[s])
                .find(t.join(','))
                .not('.redactor-selection-marker')
                .each(
                  function (t) {
                    -1 !== e.indexOf(t) && (e = this.utils.removeFromArrayByValue(e, t)), y.dom(t).unwrap();
                  }.bind(this)
                );
          }
        return e;
      },
      _clearDecoration: function () {
        this.editor
          .getElement()
          .find(this.opts.inlineTags.join(','))
          .each(function (t) {
            if ('line-through' === t.style.textDecoration || 'line-through' === t.style.textDecorationLine) {
              var e = y.dom(t);
              e.css('textDecorationLine', ''), e.css('textDecoration', ''), e.wrap('<strike>');
            }
          });
      },
      _clearEmptyStyle: function () {
        for (var t = this.getInlines(), e = 0; e < t.length; e++) {
          this._clearEmptyStyleAttr(t[e]);
          var i = t[e].childNodes;
          if (i) for (var s = 0; s < i.length; s++) this._clearEmptyStyleAttr(i[s]);
        }
      },
      _clearEmptyStyleAttr: function (t) {
        3 !== t.nodeType &&
          this.utils.removeEmptyAttr(t, 'style') &&
          (t.removeAttribute('style'), t.removeAttribute('data-redactor-style-cache'));
      },
      _forceRemoveClass: function (t, e) {
        t.removeClass(e), this.utils.removeEmptyAttr(t, 'class') && t.removeAttr('class');
      },
      _isTextSelected: function (t, e) {
        var i = this.utils.removeInvisibleChars(t.textContent);
        return e === i || -1 !== e.search(new RegExp('^' + this.utils.escapeRegExp(i) + '$'));
      },
      getInlines: function (t) {
        return t ? this.selection.getInlines({ tags: t, all: !0 }) : this.selection.getInlines({ all: !0 });
      },
      getElements: function (t) {
        return y.dom(this.getInlines(t));
      },
      clearFormat: function () {
        this.selection.save();
        for (var t = this.selection.getInlines({ all: !0 }), e = 0; e < t.length; e++) {
          var i = y.dom(t[e]);
          this.selection.getInline(t[e]) && i.unwrap();
        }
        this.selection.restore();
      },
    }),
    y.add('service', 'autoparser', {
      init: function (t) {
        (this.app = t), (this.cleaner = this.app.cleaner);
      },
      observe: function () {
        var t = this.editor
          .getElement()
          .find('.redactor-autoparser-object')
          .each(function (t) {
            var e = y.dom(t);
            e.removeClass('redactor-autoparser-object'), '' === e.attr('class') && e.removeAttr('class');
          });
        0 < t.length &&
          t.each(
            function (t) {
              var e,
                i = !1,
                s = t.tagName;
              'A' === s ? (e = 'link') : 'IMG' === s ? (e = 'image') : 'IFRAME' === s && (e = 'video'),
                e &&
                  ((i = y.create(e + '.component', this.app, t)),
                  this.app.broadcast(e + '.inserted', i),
                  this.app.broadcast('autoparse', e, i));
            }.bind(this)
          );
      },
      format: function (t, e) {
        this._isKey(e) && this._format(e === this.keycodes.ENTER);
      },
      parse: function (t) {
        var e = ['figure', 'html', 'form', 'pre', 'object', 'video', 'iframe', 'code', 'a', 'img'],
          i = [],
          s = 0,
          n = [];
        (t = this.cleaner.storeComments(t, n)),
          (t = (t = (t = this.cleaner.encodeCode(t)).replace(/\$/g, '&#36;')).replace(/&amp;/g, '&'));
        for (var r = 0; r < e.length; r++) {
          var o = 'img' === e[r] ? '<' + e[r] + '[^>]*>' : '<' + e[r] + '([\\w\\W]*?)</' + e[r] + '>';
          if (null !== (p = t.match(new RegExp(o, 'gi'))))
            for (var a = 0; a < p.length; a++)
              (t = t.replace(p[a], '#####replaceparse' + s + '#####')), i.push(p[a]), s++;
        }
        if (this.opts.autoparseImages && t.match(this.opts.regex.imageurl)) {
          var l = t.match(this.opts.regex.imageurl);
          for (r = 0; r < l.length; r++)
            t = t.replace(l[r], '<img class="redactor-autoparser-object" src="' + l[r] + '">');
        }
        if (this.opts.autoparseVideo && (t.match(this.opts.regex.youtube) || t.match(this.opts.regex.vimeo))) {
          var h,
            c,
            d = this.opts.autoparseHttps ? 'https:' : '';
          t.match(this.opts.regex.youtube)
            ? ((h = d + '//www.youtube.com/embed/$1'), (c = this.opts.regex.youtube))
            : t.match(this.opts.regex.vimeo) && ((h = d + '//player.vimeo.com/video/$2'), (c = this.opts.regex.vimeo));
          var u = this.component.create(
            'video',
            '<iframe width="500" height="281" src="' + h + '" frameborder="0" allowfullscreen></iframe>'
          );
          t = t.replace(c, u.get().outerHTML);
        }
        for (r = 0; r < e.length; r++) {
          var p;
          o = 'img' === e[r] ? '<' + e[r] + '[^>]*>' : '<' + e[r] + '([\\w\\W]*?)</' + e[r] + '>';
          if (null !== (p = t.match(new RegExp(o, 'gi'))))
            for (a = 0; a < p.length; a++) (t = t.replace(p[a], '#####replaceparse' + s + '#####')), i.push(p[a]), s++;
        }
        return (
          this.opts.autoparseLinks && t.match(this.opts.regex.url) && (t = this._formatLinks(t)),
          (t = this._restoreReplaced(i, t)),
          (t = this._restoreReplaced(i, t)),
          (t = this.cleaner.restoreComments(t, n))
        );
      },
      _isKey: function (t) {
        return t === this.keycodes.ENTER || t === this.keycodes.SPACE;
      },
      _format: function (t) {
        var e = this.selection.getParent(),
          i = y.dom(e);
        if (!(e && 0 !== i.closest('figure, pre, code, img, a, iframe').length) && this.selection.isCollapsed()) {
          var s = this.utils.createInvisibleChar();
          this.selection.getRange().insertNode(s);
          var n = this.selection.getCurrent(),
            r = this.inspector.parse(n),
            o = y.dom(n);
          if ((s.parentNode.removeChild(s), n && 3 === n.nodeType)) {
            var a,
              l = n.textContent;
            if (this.opts.autoparseImages && l.match(this._convertToRegExp(this.opts.regex.imageurl))) {
              var h = r.isList(),
                c = l.match(this.opts.regex.imageurl),
                d = h ? void 0 : '<figure><img></figure>',
                u = this.component.create('image', d);
              u.setSrc(c[0]),
                u.addClass('redactor-autoparser-object'),
                (l = l.replace(c[0], u.get().outerHTML)),
                (a = 'image');
            } else if (
              this.opts.autoparseVideo &&
              (l.match(this._convertToRegExp(this.opts.regex.youtube)) ||
                l.match(this._convertToRegExp(this.opts.regex.vimeo)))
            ) {
              var p, f;
              l.match(this.opts.regex.youtube)
                ? ((p = '//www.youtube.com/embed/$1'), (f = this.opts.regex.youtube))
                : l.match(this.opts.regex.vimeo) && ((p = '//player.vimeo.com/video/$2'), (f = this.opts.regex.vimeo));
              var m = this.component.create(
                'video',
                '<iframe width="500" height="281" src="' + p + '" frameborder="0" allowfullscreen></iframe>'
              );
              m.addClass('redactor-autoparser-object'), (l = l.replace(f, m.get().outerHTML)), (a = 'video');
            } else
              this.opts.autoparseLinks &&
                l.match(this._convertToRegExp(this.opts.regex.url)) &&
                ((l = this._formatLinks(l, t)), (a = 'link'));
            if (a) {
              t ? (this.selection.save(), o.replaceWith(l), this.selection.restore()) : o.replaceWith(l);
              var g = this.editor
                .getElement()
                .find('.redactor-autoparser-object')
                .removeClass('redactor-autoparser-object');
              if (((g = 'link' === a ? y.create('link.component', this.app, g) : g), 'link' === a))
                t || this.caret.setAfter(g), this.app.broadcast('link.inserted', g);
              else {
                this.caret.setAfter(g);
                var v = g.clone();
                g.remove(), (g = this.insertion.insertHtml(v)), (g = this.component.build(g));
              }
              this.app.broadcast('autoparse', a, g);
            }
          }
        }
      },
      _formatLinks: function (t) {
        var s = !1 !== this.opts.pasteLinkTarget ? ' target="' + this.opts.pasteLinkTarget + '"' : '',
          n = ' class="redactor-autoparser-object"',
          r = this;
        return (t = (t = t.replace(this.opts.regex.aurl1, function (t) {
          return '<a href="' + t + '"' + s + n + '>' + r._subLinkText(t) + '</a>';
        })).replace(this.opts.regex.aurl2, function (t, e, i) {
          return e + '<a href="http://' + i + '"' + s + n + '>' + r._subLinkText(i) + '</a>';
        }));
      },
      _subLinkText: function (t) {
        return (t =
          -1 === (t = t.length > this.opts.linkSize ? t.substring(0, this.opts.linkSize) + '...' : t).search('%')
            ? decodeURIComponent(t)
            : t);
      },
      _restoreReplaced: function (t, e) {
        for (var i = 0; i < t.length; i++) e = e.replace('#####replaceparse' + i + '#####', t[i]);
        return e;
      },
      _convertToRegExp: function (t) {
        return new RegExp(String(t).replace(/^\//, '').replace(/\/ig$/, '').replace(/\/gi$/, '') + '$', 'gi');
      },
    }),
    y.add('service', 'storage', {
      init: function (t) {
        (this.app = t), (this.data = []);
      },
      observeImages: function () {
        this.opts.imageObserve && this.editor.getElement().find('[data-image]').each(this._addImage.bind(this));
      },
      observeFiles: function () {
        this.editor.getElement().find('[data-file]').each(this._addFile.bind(this));
      },
      setStatus: function (t, e) {
        this.data[t].status = e;
      },
      getChanges: function () {
        var t = this.editor.getElement();
        for (var e in this.data) {
          var i = this.data[e],
            s = t.find('[data-' + i.type + '="' + i.id + '"]');
          this.setStatus(i.id, 0 !== s.length);
        }
        return this.data;
      },
      add: function (t, e) {
        var i = y.dom(e),
          s = i.attr('data-' + t);
        this.data[s] = { type: t, status: !0, node: i.get(), id: i.attr('data-' + t) };
      },
      _addImage: function (t) {
        this.add('image', t);
      },
      _addFile: function (t) {
        this.add('file', t);
      },
    }),
    y.add('service', 'utils', {
      init: function (t) {
        this.app = t;
      },
      isEmpty: function (t) {
        var e = !1;
        return (
          (t = y.dom(t).get()) &&
            (e = 3 === t.nodeType ? '' === t.textContent.trim().replace(/\n/, '') : '' === t.innerHTML),
          e
        );
      },
      isEmptyHtml: function (t, e, i) {
        return (
          (t = (t = (t = (t = (t = (t = this.removeInvisibleChars(t)).replace(/&nbsp;/gi, '')).replace(
            /<\/?br\s?\/?>/g,
            e ? 'br' : ''
          )).replace(/\s/g, '')).replace(/^<p>[^\W\w\D\d]*?<\/p>$/i, '')).replace(/^<div>[^\W\w\D\d]*?<\/div>$/i, '')),
          i && (t = (t = t.replace(/<ul(.*?[^>])>$/i, 'ul')).replace(/<ol(.*?[^>])>$/i, 'ol')),
          '' ===
            (t = (t = (t = (t = (t = (t = t.replace(/<hr(.*?[^>])>$/i, 'hr')).replace(
              /<iframe(.*?[^>])>$/i,
              'iframe'
            )).replace(/<source(.*?[^>])>$/i, 'source')).replace(/<[^\/>][^>]*><\/[^>]+>/gi, '')).replace(
              /<[^\/>][^>]*><\/[^>]+>/gi,
              ''
            )).trim())
        );
      },
      trimSpaces: function (t) {
        return this.removeInvisibleChars(t.trim());
      },
      createInvisibleChar: function () {
        return document.createTextNode(this.opts.markerChar);
      },
      searchInvisibleChars: function (t) {
        return t.search(/^\uFEFF$/g);
      },
      removeInvisibleChars: function (t) {
        return t.replace(/\uFEFF/g, '');
      },
      trimInvisibleChars: function (t) {
        if (this.selection.isCollapsed()) {
          var e = this.selection.getCurrent(),
            i = 'left' === t ? this.selection.getTextBeforeCaret() : this.selection.getTextAfterCaret();
          if (e && 3 === e.nodeType && 0 === this.searchInvisibleChars(i))
            if ('left' === t) y.dom(e).replaceWith(e.textContent.trim());
            else {
              var s = this.offset.get();
              this.offset.set({ start: s.start + 1, end: s.end + 1 });
            }
        }
      },
      buildWrapper: function (t) {
        return y.dom('<div>').html(t);
      },
      getWrapperHtml: function (t) {
        var e = t.html();
        return t.remove(), e;
      },
      createTmpContainer: function (t) {
        var e = y.dom('<div>');
        return 'string' == typeof t ? e.html(t) : e.append(y.dom(t).clone(!0)), e.get();
      },
      createFragment: function (t) {
        for (
          var e, i, s, n = this.createTmpContainer(t), r = document.createDocumentFragment(), o = [], a = 0;
          (e = n.firstChild);

        ) {
          a++;
          var l = r.appendChild(e);
          1 === a && (i = l), o.push(l), (s = l);
        }
        return { frag: r, first: i, last: s, nodes: o };
      },
      isFragment: function (t) {
        return 'object' == typeof t && t.frag;
      },
      parseHtml: function (t) {
        var e = this.createTmpContainer(t);
        return { html: e.innerHTML, nodes: e.childNodes };
      },
      splitNode: function (t, e, i, s) {
        var n;
        (e = this.isFragment(e) ? e.frag : e),
          (n = s
            ? this.inspector.isInlineTag(t.tagName)
              ? t
              : this.selection.getInline(t)
            : this.inspector.isBlockTag(t.tagName)
              ? t
              : this.selection.getBlock(t));
        var r = y.dom(n);
        if (!s && this.isEmptyHtml(n.innerHTML, !0)) return r.after(e), r.remove(), e;
        var o = r.get().tagName.toLowerCase(),
          a = this.caret.isEnd(n),
          l = this.caret.isStart(n);
        if (!a && !l) {
          var h = this.extractHtmlFromCaret(s),
            c = y.dom('<' + o + ' />');
          (c = this.cloneAttributes(n, c)), r.after(c.append(h));
        }
        if (l) return r.before(e);
        if (i) return r.append(e);
        e = r.after(e);
        var d = r.html();
        return '' === (d = (d = this.removeInvisibleChars(d)).replace(/&nbsp;/gi, '')) && r.remove(), e;
      },
      extractHtmlFromCaret: function (t, e) {
        var i = this.selection.getRange();
        if (i && (e = e || (t ? this.selection.getInline() : this.selection.getBlock()))) {
          var s = i.cloneRange();
          return s.selectNodeContents(e), s.setStart(i.endContainer, i.endOffset), s.extractContents();
        }
      },
      createMarkup: function (t) {
        var e = document.createElement(this.opts.markup);
        this.opts.breakline && e.setAttribute('data-redactor-tag', 'br'), y.dom(t).after(e), this.caret.setStart(e);
      },
      createMarkupBefore: function (t) {
        var e = document.createElement(this.opts.markup);
        this.opts.breakline && e.setAttribute('data-redactor-tag', 'br'), y.dom(t).before(e), this.caret.setEnd(e);
      },
      getNode: function (t) {
        var e = y.dom(t).get(),
          i = this.editor.getElement().get();
        return void 0 === t ? i : e || !1;
      },
      findSiblings: function (t, e) {
        for (t = y.dom(t).get(), e = 'next' === e ? 'nextSibling' : 'previousSibling'; (t = t[e]); )
          if ((3 !== t.nodeType || '' !== t.textContent.trim()) && 'BR' !== t.tagName) return t;
        return !1;
      },
      getElementsFromHtml: function (t, e, i) {
        var s = document.createElement('div');
        s.innerHTML = t;
        var n = s.querySelectorAll(e);
        return function (t, e) {
          if ('number' == typeof this.length && 'function' == typeof t) {
            var i = [];
            if ('object' == typeof this)
              for (var s = 0; s < this.length; s++) {
                if (!(s in this)) return;
                i[s] = t.call(e || this, this[s], s, this);
              }
            return i;
          }
        }.call(n, function (t) {
          var e = t.getAttribute('data-redactor-type');
          if (!i || !e || e !== i) return t.outerHTML;
        });
      },
      getChildNodes: function (t, e, i) {
        var s = (t = t && t.nodeType && 11 === t.nodeType ? t : y.dom(t).get()).childNodes,
          n = [];
        if (s)
          for (var r = 0; r < s.length; r++)
            if (
              !(
                (!0 === i && 3 === s[r].nodeType) ||
                (3 === s[r].nodeType && this.isEmpty(s[r])) ||
                (n.push(s[r]), !1 === e)
              )
            ) {
              var o = this.getChildNodes(s[r], i);
              0 < o.length && (n = n.concat(o));
            }
        return n;
      },
      getChildElements: function (t) {
        return this.getChildNodes(t, !0, !0);
      },
      getFirstNode: function (t) {
        return this._getFirst(this.getChildNodes(t, !1));
      },
      getLastNode: function (t) {
        return this._getLast(this.getChildNodes(t, !1));
      },
      getFirstElement: function (t) {
        return this._getFirst(this.getChildNodes(t, !1, !0));
      },
      getLastElement: function (t) {
        return this._getLast(this.getChildNodes(t, !1, !0));
      },
      replaceToTag: function (t, n) {
        return y.dom(t).replaceWith(function (t) {
          var e = y.dom('<' + n + '>').append(y.dom(t).contents());
          if (t.attributes) for (var i = t.attributes, s = 0; s < i.length; s++) e.attr(i[s].nodeName, i[s].value);
          return e;
        });
      },
      ucfirst: function (t) {
        return t.charAt(0).toUpperCase() + t.slice(1);
      },
      removeFromArrayByValue: function (t, e) {
        for (var i, s = arguments, n = s.length; 1 < n && t.length; )
          for (e = s[--n]; -1 !== (i = t.indexOf(e)); ) t.splice(i, 1);
        return t;
      },
      removeEmptyAttr: function (t, e) {
        var i = y.dom(t);
        return void 0 === i.attr(e) || null === i.attr(e) || ('' === i.attr(e) && (i.removeAttr(e), !0));
      },
      cloneAttributes: function (t, e) {
        (t = y.dom(t).get()), (e = y.dom(e));
        for (var i = t.attributes, s = i.length; s--; ) {
          var n = i[s];
          e.attr(n.name, n.value);
        }
        return e;
      },
      toParams: function (t) {
        if ('object' != typeof t) return t;
        var e = Object.keys(t);
        if (!e.length) return '';
        for (var i = '', s = 0; s < e.length; s++) {
          var n = e[s];
          i += n + ':' + t[n] + ';';
        }
        return i;
      },
      styleToObj: function (t) {
        var e = {};
        if (t)
          for (var i = t.replace(/;$/, '').split(';'), s = 0; s < i.length; s++) {
            var n = i[s].split(':');
            e[n[0].trim()] = n[1].trim();
          }
        return e;
      },
      checkProperty: function (t) {
        for (
          var e = arguments[1] && Array.isArray(arguments[1]) ? arguments[1] : [].slice.call(arguments, 1), i = 0;
          i < e.length;
          i++
        ) {
          if (!t || void 0 === t[e[i]]) return !1;
          t = t[e[i]];
        }
        return t;
      },
      extendData: function (r, t) {
        for (var e in t) {
          if ('elements' === e)
            y.dom(t[e]).each(
              function (t) {
                var e = y.dom(t);
                if ('FORM' === t.tagName) {
                  var i = e.serialize(!0);
                  for (var s in i) r = this._setData(r, s, i[s]);
                } else {
                  var n = e.attr('name') ? e.attr('name') : e.attr('id');
                  r = this._setData(r, n, e.val());
                }
              }.bind(this)
            );
          else r = this._setData(r, e, t[e]);
        }
        return r;
      },
      _setData: function (t, e, i) {
        return t instanceof FormData ? t.append(e, i) : (t[e] = i), t;
      },
      normalizeTextNodes: function (t) {
        (t = y.dom(t).get()) && t.normalize();
      },
      isRgb: function (t) {
        return 0 === t.search(/^rgb/i);
      },
      rgb2hex: function (t) {
        return (t = t.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i)) && 4 === t.length
          ? '#' +
              ('0' + parseInt(t[1], 10).toString(16)).slice(-2) +
              ('0' + parseInt(t[2], 10).toString(16)).slice(-2) +
              ('0' + parseInt(t[3], 10).toString(16)).slice(-2)
          : '';
      },
      hex2long: function (t) {
        return -1 !== t.search(/^#/) && 4 === t.length && (t = '#' + t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), t;
      },
      escapeRegExp: function (t) {
        return t.replace(/[-\/\\^$*~+?.()|[\]{}]/g, '\\$&');
      },
      getRandomId: function () {
        for (var t = '', e = 'abcdefghijklmnopqrstuvwxyz0123456789', i = 0; i < 12; i++)
          t += e.charAt(Math.floor(Math.random() * e.length));
        return t;
      },
      _getFirst: function (t) {
        return 0 !== t.length && t[0];
      },
      _getLast: function (t) {
        return 0 !== t.length && t[t.length - 1];
      },
    }),
    y.add('service', 'progress', {
      init: function (t) {
        (this.app = t), (this.$box = null), (this.$bar = null);
      },
      show: function () {
        this._is() || this._build(), this.$box.show();
      },
      hide: function () {
        this._is() && this.animate.start(this.$box, 'fadeOut', this._destroy.bind(this));
      },
      update: function (t) {
        this.show(), this.$bar.css('width', t + '%');
      },
      _is: function () {
        return null !== this.$box;
      },
      _build: function () {
        (this.$bar = y.dom('<span />')),
          (this.$box = y.dom('<div id="redactor-progress" />')),
          this.$box.append(this.$bar),
          this.$body.append(this.$box);
      },
      _destroy: function () {
        this._is() && this.$box.remove(), (this.$box = null), (this.$bar = null);
      },
    }),
    y.add('module', 'starter', {
      init: function (t) {
        (this.app = t), (this.opts = t.opts), (this.plugin = t.plugin), (this.module = t.module);
      },
      onstart: function () {
        this._startStop('start', this.app, ['element', 'container', 'source', 'editor', 'statusbar', 'toolbar']),
          this._startStop('start', this.module, [
            'element',
            'container',
            'source',
            'editor',
            'statusbar',
            'contextbar',
            'input',
          ]);
      },
      onstop: function () {
        this._startStop('stop', this.module, ['observer', 'element', 'container', 'source', 'editor', 'contextbar']);
      },
      onenable: function () {
        var t = this.opts.plugins;
        this._startStop('start', this.module, ['observer', 'toolbar']), this._startStop('start', this.plugin, t);
      },
      ondisable: function () {
        var t = this.opts.plugins;
        this._startStop('stop', this.module, ['observer', 'toolbar']), this._startStop('stop', this.plugin, t);
      },
      _startStop: function (t, e, i) {
        for (var s = 0; s < i.length; s++) void 0 !== e[i[s]] && this.app.callInstanceMethod(e[i[s]], t);
      },
    }),
    y.add('module', 'element', {
      init: function (t) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.namespace = t.namespace),
          (this.element = t.element),
          (this.rootOpts = y.extend({}, !0, y.options, t.rootOpts));
      },
      start: function () {
        this._build(), this._buildModes(), this._buildMarkup();
      },
      stop: function () {
        this.element.getElement().removeData(this.namespace + '-uuid');
      },
      _build: function () {
        this.element.getElement().data(this.namespace + '-uuid', this.uuid);
      },
      _buildModes: function () {
        var t = this.element.getType();
        'inline' === t && this._redefineOptions(this.opts.modes.inline),
          'div' === t && this._redefineOptions(this.opts.modes.original),
          'inline' !== t &&
            (this._isRootOption('styles') && this.rootOpts.styles && (this.opts.styles = !0),
            this._isRootOption('source') && !this.rootOpts.source && (this.opts.showSource = !1));
      },
      _buildMarkup: function () {
        'inline' === this.element.getType()
          ? (this.opts.emptyHtml = '')
          : this.opts.breakline
            ? ((this.opts.markup = 'div'),
              (this.opts.emptyHtml = '<div data-redactor-tag="br">' + this.opts.markerChar + '</div>'))
            : (this.opts.emptyHtml = '<' + this.opts.markup + '></' + this.opts.markup + '>');
      },
      _redefineOptions: function (t) {
        for (var e in t) this.opts[e] = t[e];
      },
      _isRootOption: function () {
        return void 0 !== this.rootOpts.styles;
      },
    }),
    y.add('module', 'editor', {
      init: function (t) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.editor = t.editor),
          (this.source = t.source),
          (this.element = t.element),
          (this.component = t.component),
          (this.container = t.container),
          (this.inspector = t.inspector),
          (this.autoparser = t.autoparser),
          (this.placeholder = !1),
          (this.events = !1);
      },
      onenable: function () {
        this.enable();
      },
      ondisable: function () {
        this.disable();
      },
      onenablefocus: function () {
        this._enableFocus();
      },
      oncontextmenu: function (t) {
        this.component.setOnEvent(t, !0);
      },
      onclick: function (t) {
        this.component.setOnEvent(t);
      },
      onkeyup: function (t) {
        this.inspector.parse(t.target).isComponent() || this.component.clearActive();
      },
      onenablereadonly: function () {
        this._enableReadOnly();
      },
      ondisablereadonly: function () {
        this._disableReadOnly();
      },
      onautoparseobserve: function () {
        this.autoparser.observe();
      },
      onplaceholder: {
        build: function () {
          this._buildPlaceholder();
        },
        toggle: function () {
          this._togglePlacehodler();
        },
      },
      start: function () {
        this._build(), this._buildEvents(), this._buildOptions(), this._buildAccesibility();
      },
      stop: function () {
        var t = this.editor.getElement(),
          e = this.container.getElement(),
          i = ['redactor-in', 'redactor-in-' + this.uuid, 'redactor-structure', 'redactor-placeholder', 'notranslate'];
        '' !== this.opts.stylesClass && i.push(this.opts.stylesClass);
        t.removeAttr('spellcheck'),
          t.removeAttr('dir'),
          t.removeAttr('contenteditable'),
          t.removeAttr('placeholder'),
          t.removeAttr('data-gramm_editor'),
          t.removeClass(i.join(' ')),
          e.removeClass(
            [
              'redactor-focus',
              'redactor-blur',
              'redactor-over',
              'redactor-styles-on',
              'redactor-styles-off',
              'redactor-toolbar-on',
              'redactor-text-labeled-on',
              'redactor-source-view',
            ].join(' ')
          ),
          this._destroyEvents(),
          0 === t.get().classList.length && t.removeAttr('class');
      },
      enable: function () {
        var t = this.editor.getElement(),
          e = this.container.getElement();
        t.addClass('redactor-in redactor-in-' + this.uuid),
          t.attr({ contenteditable: !0 }),
          this.opts.structure && t.addClass('redactor-structure'),
          !this.opts.toolbar || this.opts.air || this.opts.toolbarExternal || e.addClass('redactor-toolbar-on'),
          this._disableBrowsersEditing();
      },
      disable: function () {
        var t = this.editor.getElement(),
          e = this.container.getElement();
        t.removeClass('redactor-in redactor-in-' + this.uuid),
          t.removeClass('redactor-structure'),
          t.removeAttr('contenteditable'),
          e.addClass('redactor-toolbar-on');
      },
      _build: function () {
        var t = this.editor.getElement(),
          e = this.element.getElement(),
          i = this.container.getElement();
        i.addClass('redactor-blur'),
          this.opts.grammarly || t.attr('data-gramm_editor', !1),
          this.opts.notranslate && t.addClass('notranslate'),
          this.opts.styles
            ? (t.addClass(this.opts.stylesClass), i.addClass('redactor-styles-on'))
            : i.addClass('redactor-styles-off'),
          this.opts.buttonsTextLabeled && i.addClass('redactor-text-labeled-on'),
          this.element.isType('textarea') && e.before(t);
      },
      _buildEvents: function () {
        this.events = y.create('editor.events', this.app);
      },
      _buildOptions: function () {
        var t = this.editor.getElement();
        t.attr('dir', this.opts.direction),
          this.opts.spellcheck || t.attr('spellcheck', !1),
          this.opts.tabindex && t.attr('tabindex', this.opts.tabindex),
          this.opts.minHeight && t.css('min-height', this.opts.minHeight),
          this.opts.maxHeight && t.css('max-height', this.opts.maxHeight),
          this.opts.maxWidth && t.css({ 'max-width': this.opts.maxWidth, margin: 'auto' });
      },
      _buildAccesibility: function () {
        this.editor.getElement().attr({ 'aria-labelledby': 'redactor-voice-' + this.uuid, role: 'presentation' });
      },
      _buildPlaceholder: function () {
        this.placeholder = y.create('editor.placeholder', this.app);
      },
      _enableFocus: function () {
        this.opts.showSource ? this._enableFocusSource() : this._enableFocusEditor();
      },
      _enableFocusSource: function () {
        var t = this.source.getElement();
        this.opts.focus ? (t.focus(), t.get().setSelectionRange(0, 0)) : this.opts.focusEnd && t.focus();
      },
      _enableFocusEditor: function () {
        this.opts.focus
          ? setTimeout(this.editor.startFocus.bind(this.editor), 100)
          : this.opts.focusEnd && setTimeout(this.editor.endFocus.bind(this.editor), 100);
      },
      _togglePlacehodler: function () {
        this.placeholder && this.placeholder.toggle();
      },
      _disableBrowsersEditing: function () {
        try {
          document.execCommand('enableObjectResizing', !1, !1),
            document.execCommand('enableInlineTableEditing', !1, !1),
            document.execCommand('AutoUrlDetect', !1, !1);
          var t = this.editor.getElement().get();
          t.addEventListener
            ? t.addEventListener('mscontrolselect', function (t) {
                t.preventDefault();
              })
            : t.attachEvent('oncontrolselect', function (t) {
                t.returnValue = !1;
              });
        } catch (t) {}
      },
      _destroyEvents: function () {
        this.events && this.events.destroy();
      },
      _enableReadOnly: function () {
        var t = this.editor.getElement();
        this._getEditables(t).removeAttr('contenteditable'),
          t.removeAttr('contenteditable'),
          t.addClass('redactor-read-only'),
          this.events && this.events.destroy();
      },
      _disableReadOnly: function () {
        var t = this.editor.getElement();
        this._getEditables(t).attr({ contenteditable: !0 }),
          t.removeClass('redactor-read-only'),
          t.attr({ contenteditable: !0 }),
          this._buildEvents();
      },
      _getEditables: function (t) {
        return t.find('figcaption, td, th');
      },
    }),
    y.add('class', 'editor.placeholder', {
      init: function (t) {
        (this.app = t), (this.opts = t.opts), (this.editor = t.editor), (this.element = t.element), this.build();
      },
      build: function () {
        var t = this.element.getElement(),
          e = this.editor.getElement();
        if (!1 !== this.opts.placeholder || t.attr('placeholder')) {
          var i = !1 !== this.opts.placeholder ? this.opts.placeholder : t.attr('placeholder');
          e.attr('placeholder', i), this.toggle();
        }
      },
      toggle: function () {
        return this.editor.isEmpty(!0) ? this.show() : this.hide();
      },
      show: function () {
        this.editor.getElement().addClass('redactor-placeholder');
      },
      hide: function () {
        this.editor.getElement().removeClass('redactor-placeholder');
      },
    }),
    y.add('class', 'editor.events', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.$doc = t.$doc),
          (this.uuid = t.uuid),
          (this.source = t.source),
          (this.editor = t.editor),
          (this.cleaner = t.cleaner),
          (this.container = t.container),
          (this.insertion = t.insertion),
          (this.inspector = t.inspector),
          (this.selection = t.selection),
          (this.component = t.component),
          (this.blurNamespace = '.redactor-blur.' + this.uuid),
          (this.eventsList = [
            'paste',
            'click',
            'contextmenu',
            'keydown',
            'keyup',
            'mouseup',
            'touchstart',
            'cut',
            'copy',
            'dragenter',
            'dragstart',
            'drop',
            'dragover',
            'dragleave',
          ]),
          this._init();
      },
      destroy: function () {
        this.editor.getElement().off('.redactor-focus'),
          this.$doc.off('keyup' + this.blurNamespace + ' mousedown' + this.blurNamespace),
          this._loop('off');
      },
      focus: function (t) {
        var e = this.container.getElement();
        this.editor.isPasting() ||
          e.hasClass('redactor-focus') ||
          (e.addClass('redactor-focus'),
          e.removeClass('redactor-blur'),
          this.app.broadcast('observe', t),
          this.app.broadcast('focus', t),
          (this.isFocused = !0),
          (this.isBlured = !1));
      },
      blur: function (t) {
        var e = this.container.getElement(),
          i = y.dom(t.target),
          s = [
            '.redactor-in-' + this.uuid,
            '.redactor-toolbar',
            '.redactor-dropdown',
            '.redactor-context-toolbar',
            '.redactor-modal-box',
            '#redactor-image-resizer',
          ];
        this.app.broadcast('originalblur', t),
          this.app.stopBlur ||
            (this.app.isStarted() &&
              !this.editor.isPasting() &&
              0 === i.closest(s.join(',')).length &&
              (this.isBlured ||
                e.hasClass('redactor-blur') ||
                (e.removeClass('redactor-focus'),
                e.addClass('redactor-blur'),
                this.app.broadcast('blur', t),
                (this.isFocused = !1),
                (this.isBlured = !0))));
      },
      cut: function (t) {
        var e = this.selection.getCurrent(),
          i = this.inspector.parse(e);
        this.app.broadcast('state', t),
          this.component.isNonEditable(e) && (this._passSelectionToClipboard(t, i, !0), t.preventDefault());
      },
      copy: function (t) {
        var e = this.selection.getCurrent(),
          i = this.inspector.parse(e);
        this.app.broadcast('state', t),
          this.component.isNonEditable(e) && (this._passSelectionToClipboard(t, i, !1), t.preventDefault());
      },
      drop: function (t) {
        if (((t = t.originalEvent || t).stopPropagation(), this._removeOverClass(), !1 !== this.opts.dragUpload)) {
          if (this.app.isDragComponentInside()) {
            var e = y.dom(this.app.getDragComponentInside()),
              i = e.clone(!0);
            return (
              this.insertion.insertToPoint(t, i),
              e.remove(),
              this.app.setDragComponentInside(!1),
              this.app.broadcast('state', t),
              this.app.broadcast('drop', t),
              this.app.broadcast('image.observe', t),
              void t.preventDefault()
            );
          }
          if (this.app.isDragInside() && this.opts.input) {
            this.insertion.insertPoint(t);
            var s = t.dataTransfer.getData('text/html'),
              n = this.selection.getRange();
            if (n) {
              var r = this.selection.getBlocks();
              n.deleteContents();
              for (var o = 0; o < r.length; o++) '' === r[o].innerHTML && y.dom(r[o]).remove();
            }
            return (
              y.create('input.paste', this.app, t, !0, s, !0),
              this.app.broadcast('state', t),
              this.app.broadcast('drop', t),
              this.app.setDragInside(!1),
              void t.preventDefault()
            );
          }
          this.app.broadcast('state', t), this.app.broadcast('paste', t, t.dataTransfer), this.app.broadcast('drop', t);
        } else t.preventDefault();
      },
      dragenter: function (t) {
        t.preventDefault();
      },
      dragstart: function (t) {
        this.app.setDragComponentInside(!1), this.app.setDragInside(!1);
        var e = this.inspector.parse(t.target);
        !e.isComponent() || e.isComponentEditable() || e.isFigcaption()
          ? this.selection.is() && !this.selection.isCollapsed() && (this.app.setDragInside(!0), this._setDragData(t))
          : this.app.setDragComponentInside(e.getComponent()),
          this.app.broadcast('dragstart', t);
      },
      dragover: function (t) {
        this.app.broadcast('dragover', t);
      },
      dragleave: function (t) {
        this.app.broadcast('dragleave', t);
      },
      paste: function (t) {
        this.app.broadcast('paste', t);
      },
      contextmenu: function (t) {},
      click: function (t) {
        if (3 === t.detail) {
          t.preventDefault();
          var e = this.selection.getBlock();
          if (e) {
            var i = document.createRange();
            i.selectNodeContents(e), this.selection.setRange(i);
          }
        }
        var s = y.dom(t.target);
        if (s.hasClass('redactor-in')) {
          var n = s.offset().top,
            r = parseFloat(s.css('padding-bottom'));
          n + s.height() - 2 * r < t.pageY
            ? this.app.broadcast('bottomclick', t)
            : s.hasClass('redactor-placeholder') && this.editor.startFocus(this.editor);
        }
        this.app.broadcast('state', t), this.app.broadcast('click', t);
      },
      keydown: function (t) {
        if ((this.app.broadcast('state', t), !1 === this.app.broadcast('keydown', t))) return t.preventDefault();
      },
      keyup: function (t) {
        this.app.broadcast('keyup', t);
      },
      mouseup: function (t) {
        this.app.broadcast('observe', t), this.app.broadcast('state', t);
      },
      touchstart: function (t) {
        this.app.broadcast('observe', t), this.app.broadcast('state', t);
      },
      _init: function () {
        this.editor.getElement().on('focus.redactor-focus click.redactor-focus', this.focus.bind(this)),
          this.$doc.on('keyup' + this.blurNamespace + ' mousedown' + this.blurNamespace, this.blur.bind(this)),
          this._loop('on');
      },
      _removeOverClass: function () {
        this.editor.getElement().removeClass('over');
      },
      _loop: function (t) {
        for (var e = this.editor.getElement(), i = 0; i < this.eventsList.length; i++) {
          var s = this.eventsList[i] + '.redactor-events',
            n = this.eventsList[i];
          e[t](s, this[n].bind(this));
        }
      },
      _passAllToClipboard: function (t) {
        var e = t.clipboardData,
          i = this.source.getCode();
        e.setData('text/html', i), e.setData('text/plain', i.toString().replace(/\n$/, ''));
      },
      _passSelectionToClipboard: function (t, e, i) {
        var s = t.clipboardData,
          n = e.getComponent(),
          r = y.dom(n).clone();
        r.find('.redactor-component-caret').remove(),
          r.removeClass('redactor-component-active'),
          r.removeAttr('contenteditable'),
          r.removeAttr('tabindex');
        var o = r.get().outerHTML;
        i && this.component.remove(n),
          s.setData('text/html', o),
          s.setData('text/plain', o.toString().replace(/\n$/, ''));
      },
      _setDragData: function (t) {
        var e = (t = t.originalEvent || t).dataTransfer;
        (e.effectAllowed = 'move'), e.setData('text/Html', this.selection.getHtml());
      },
    }),
    y.add('module', 'container', {
      init: function (t) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.lang = t.lang),
          (this.element = t.element),
          (this.container = t.container);
      },
      start: function () {
        this._build(), this._buildAccesibility();
      },
      stop: function () {
        var t = this.element.getElement(),
          e = this.container.getElement();
        e.after(t), e.remove(), t.show();
      },
      _build: function () {
        var t = this.element.getElement(),
          e = this.container.getElement();
        e.addClass('redactor-box'),
          e.attr('dir', this.opts.direction),
          this.element.isType('inline') && e.addClass('redactor-inline'),
          t.after(e),
          e.append(t);
      },
      _buildAccesibility: function () {
        var t = this.container.getElement(),
          e = y.dom('<span />');
        e.addClass('redactor-voice-label'),
          e.attr({ id: 'redactor-voice-' + this.uuid, 'aria-hidden': !1 }),
          e.html(this.lang.get('accessibility-help-label')),
          t.prepend(e);
      },
    }),
    y.add('module', 'source', {
      init: function (t) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.utils = t.utils),
          (this.element = t.element),
          (this.source = t.source),
          (this.editor = t.editor),
          (this.toolbar = t.toolbar),
          (this.cleaner = t.cleaner),
          (this.component = t.component),
          (this.container = t.container),
          (this.autoparser = t.autoparser),
          (this.selection = t.selection),
          (this.syncedHtml = '');
      },
      onstartcode: function () {
        var t = this.source.getStartedContent(),
          e = this.editor.getElement(),
          i = this.source.getElement();
        this.opts.autoparse && this.opts.autoparseStart && (t = this.autoparser.parse(t));
        var s = this.cleaner.input(t, !0, !0),
          n = this.cleaner.output(s);
        e.html(s),
          i.val(n),
          (this.syncedHtml = n),
          this.app.broadcast('placeholder.build'),
          this.app.broadcast('autoparseobserve'),
          this.component.executeScripts();
      },
      onstartcodeshow: function () {
        this.show();
      },
      ontrytosync: function () {
        this.sync();
      },
      onhardsync: function () {
        var t = this.editor.getElement().html();
        (t = this.app.broadcast('syncBefore', t)), (t = this.cleaner.output(t)), this._syncing(t);
      },
      start: function () {
        this._build(), this._buildClasses();
      },
      stop: function () {
        var t = this.element.getElement(),
          e = this.source.getElement();
        t.removeClass('redactor-source redactor-source-open'),
          e.off('input.redactor-source'),
          e.removeAttr('data-gramm_editor'),
          0 === e.get().classList.length && e.removeAttr('class'),
          this.source.isNameGenerated() || t.removeAttr('name'),
          this.element.isType('textarea') || e.remove();
      },
      getCode: function () {
        return this.source.getCode();
      },
      toggle: function () {
        if (this.opts.source)
          return this.source.getElement().hasClass('redactor-source-open') ? this.hide() : this.show();
      },
      show: function () {
        if (this.opts.source) {
          var t = this.editor.getElement(),
            e = this.source.getElement(),
            i = this.container.getElement(),
            s = e.val();
          this.app.isStarted() && (s = this.app.broadcast('source.open', s));
          var n = t.height();
          if (
            (t.hide(),
            e.height(n),
            e.val(s.trim()),
            e.show(),
            e.addClass('redactor-source-open'),
            e.on('input.redactor-source-events', this._onChangedSource.bind(this)),
            e.on('keydown.redactor-source-events', this._onTabKey.bind(this)),
            e.on('focus.redactor-source-events', this._onFocus.bind(this)),
            this.opts.source.hasOwnProperty('codemirror'))
          ) {
            var r = 'object' == typeof this.opts.source.codemirror ? this.opts.source.codemirror : {},
              o = void 0 !== this.opts.source.codemirrorSrc ? this.opts.source.codemirrorSrc : CodeMirror;
            (this.codemirror = o.fromTextArea(e.get(), r)),
              this.codemirror.setSize(null, n),
              this.codemirror.on('change', function (t, e) {
                t.save();
              }),
              this.codemirror.on('change', this._onChangedSource.bind(this));
          } else i.addClass('redactor-source-view');
          setTimeout(
            function () {
              this._disableButtons(), this._setActiveSourceButton();
            }.bind(this),
            100
          ),
            this.app.isStarted() && this.app.broadcast('source.opened');
        }
      },
      hide: function () {
        if (this.opts.source) {
          var t = this.editor.getElement(),
            e = this.source.getElement(),
            i = this.container.getElement(),
            s = e.val();
          this.opts.source.hasOwnProperty('codemirror') &&
            ((s = this.codemirror.getValue()), this.codemirror.toTextArea()),
            (s = this.cleaner.input(s, !0)),
            (s = this.utils.isEmptyHtml(s) ? this.opts.emptyHtml : s),
            (s = this.app.broadcast('source.close', s)),
            this._enableButtons(),
            this._setInactiveSourceButton(),
            e.hide(),
            e.removeClass('redactor-source-open'),
            e.off('.redactor-source-events'),
            t.show(),
            t.html(s),
            i.removeClass('redactor-source-view'),
            setTimeout(
              function () {
                this.editor.startFocus(), this.component.executeScripts();
              }.bind(this),
              0
            ),
            this.app.broadcast('source.closed');
        }
      },
      sync: function () {
        var t = this,
          e = this.editor.getElement().html();
        (e = this.app.broadcast('syncBefore', e)),
          (e = this.cleaner.output(e)),
          this._isSync(e) &&
            (this.timeout && clearTimeout(this.timeout),
            (this.timeout = setTimeout(function () {
              t._syncing(e);
            }, 200)));
      },
      _build: function () {
        var t = this.source.getElement(),
          e = this.element.getElement();
        t.hide(), this.opts.grammarly || t.attr('data-gramm_editor', !1), this.element.isType('textarea') || e.after(t);
      },
      _buildClasses: function () {
        this.source.getElement().addClass('redactor-source');
      },
      _syncing: function (t) {
        (t = this.app.broadcast('syncing', t)),
          this.source.getElement().val(t),
          this.app.broadcast('synced', t),
          this.app.broadcast('changed', t);
      },
      _isSync: function (t) {
        return this.syncedHtml !== t && ((this.syncedHtml = t), !0);
      },
      _onChangedSource: function () {
        var t = this.source.getElement().val();
        this.app.broadcast('changed', t), this.app.broadcast('source.changed', t);
      },
      _onTabKey: function (t) {
        if (9 !== t.keyCode) return !0;
        t.preventDefault();
        var e = this.source.getElement(),
          i = e.get(),
          s = i.selectionStart;
        e.val(e.val().substring(0, s) + '    ' + e.val().substring(i.selectionEnd)),
          (i.selectionStart = i.selectionEnd = s + 4);
      },
      _onFocus: function () {
        this.app.broadcast('sourcefocus');
      },
      _disableButtons: function () {
        this.toolbar.disableButtons();
      },
      _enableButtons: function () {
        this.toolbar.enableButtons();
      },
      _setActiveSourceButton: function () {
        var t = this.toolbar.getButton('html');
        t.enable(), t.setActive();
      },
      _setInactiveSourceButton: function () {
        this.toolbar.getButton('html').setInactive();
      },
    }),
    y.add('module', 'observer', {
      init: function (t) {
        (this.app = t), (this.editor = t.editor), (this.observerUnit = !1);
      },
      start: function () {
        if (window.MutationObserver) {
          var t = this.editor.getElement().get();
          (this.observerUnit = this._build(t)),
            this.observerUnit.observe(t, {
              attributes: !0,
              subtree: !0,
              childList: !0,
              characterData: !0,
              characterDataOldValue: !0,
            });
        }
      },
      stop: function () {
        this.observerUnit && this.observerUnit.disconnect();
      },
      _build: function (e) {
        var i = this;
        return new MutationObserver(function (t) {
          i._observe(t[t.length - 1], e);
        });
      },
      _observe: function (t, e) {
        this.app.isReadOnly() ||
          ('attributes' === t.type && t.target === e) ||
          (this.app.broadcast('observe'), this.app.broadcast('trytosync'), this.app.broadcast('placeholder.toggle'));
      },
    }),
    y.add('module', 'clicktoedit', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.source = t.source),
          (this.editor = t.editor),
          (this.container = t.container),
          (this.selection = t.selection);
      },
      onstartclicktoedit: function () {
        this.start();
      },
      onenablereadonly: function () {
        this.opts.clickToEdit && (this._isEnabled() || this.stop());
      },
      ondisablereadonly: function () {
        this.opts.clickToEdit && (this._isEnabled() || this.start());
      },
      onstop: function () {
        this.stop();
      },
      start: function () {
        this._build();
      },
      stop: function () {
        this.buttonSave && this.buttonSave.stop(),
          this.buttonCancel && this.buttonCancel.stop(),
          this._destroy(),
          this.app.broadcast('disable');
      },
      enable: function () {
        this.app.broadcast('clickStart');
        var t = this.editor.isEmpty();
        t || this.selection.saveMarkers(),
          this._setFocus(),
          this._destroy(),
          this.app.broadcast('enable'),
          this.buttonSave.enable(),
          this.buttonCancel.enable(),
          t || this.selection.restoreMarkers(),
          t && this.editor.focus(),
          this.container.getElement().addClass('redactor-clicktoedit-enabled'),
          this.source.rebuildStartedContent(),
          this.app.broadcast('startcode'),
          this.app.broadcast('image.observe');
      },
      save: function (t) {
        t && t.preventDefault();
        var e = this.source.getCode();
        this.app.broadcast('disable'),
          this.app.broadcast('clickSave', e),
          this.app.broadcast('clickStop'),
          this.app.broadcast('toolbar.removeexternal'),
          this._build();
      },
      cancel: function (t) {
        t && t.preventDefault();
        var e = this.saved;
        this.editor.getElement().html(e),
          (this.saved = ''),
          this.app.broadcast('disable'),
          this.app.broadcast('clickCancel', e),
          this.app.broadcast('clickStop'),
          this.app.broadcast('toolbar.removeexternal'),
          this._build();
      },
      _build: function () {
        (this.buttonSave = y.create('clicktoedit.button', 'save', this.app, this)),
          (this.buttonCancel = y.create('clicktoedit.button', 'cancel', this.app, this)),
          this.buttonSave.stop(),
          this.buttonCancel.stop();
        var t = this.editor.getElement(),
          e = this.container.getElement();
        t.on('click.redactor-click-to-edit mouseup.redactor-click-to-edit', this.enable.bind(this)),
          e.addClass('redactor-over'),
          e.removeClass('redactor-clicktoedit-enabled');
      },
      _isEnabled: function () {
        return this.container.getElement().hasClass('redactor-clicktoedit-enabled');
      },
      _destroy: function () {
        var t = this.editor.getElement(),
          e = this.container.getElement();
        t.off('.redactor-click-to-edit'), e.removeClass('redactor-over redactor-clicktoedit-enabled');
      },
      _setFocus: function () {
        (this.saved = this.source.getCode()), this.buttonSave.start(), this.buttonCancel.start();
      },
    }),
    y.add('class', 'clicktoedit.button', {
      init: function (t, e, i) {
        (this.app = e),
          (this.opts = e.opts),
          (this.toolbar = e.toolbar),
          (this.context = i),
          (this.type = t),
          (this.name = 'save' === t ? 'clickToSave' : 'clickToCancel'),
          (this.objected = !1),
          (this.enabled = !1),
          (this.namespace = '.redactor-click-to-edit'),
          this._build();
      },
      enable: function () {
        if (this.objected) {
          var t = this.opts[this.name];
          (t.api = 'module.clicktoedit.' + this.type), this.toolbar.addButton(this.type, t), (this.enabled = !0);
        }
      },
      start: function () {
        this.objected ||
          (this.$button.off(this.namespace),
          this.$button.show(),
          this.$button.on('click' + this.namespace, this.context[this.type].bind(this.context)));
      },
      stop: function () {
        !this.objected && this.enabled && this.$button.hide();
      },
      _build: function () {
        (this.objected = 'object' == typeof this.opts[this.name]),
          this.objected || ((this.$button = y.dom(this.opts[this.name])), (this.enabled = !0));
      },
    }),
    y.add('module', 'statusbar', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.element = t.element),
          (this.statusbar = t.statusbar),
          (this.container = t.container);
      },
      start: function () {
        if (!this.element.isType('inline')) {
          var t = this.statusbar.getElement(),
            e = this.container.getElement();
          t.addClass('redactor-statusbar'), e.append(t);
        }
      },
    }),
    y.add('module', 'contextbar', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.uuid = t.uuid),
          (this.$win = t.$win),
          (this.$doc = t.$doc),
          (this.$body = t.$body),
          (this.editor = t.editor),
          (this.toolbar = t.toolbar),
          (this.detector = t.detector),
          (this.$target = this.toolbar.isTarget() ? this.toolbar.getTargetElement() : this.$body);
      },
      onstop: function () {
        this.stop();
      },
      onenablereadonly: function () {
        this.stop();
      },
      ondisablereadonly: function () {
        this.start();
      },
      oncontextbar: {
        close: function () {
          this.close();
        },
      },
      start: function () {
        if (this.opts.toolbarContext) {
          var t = this.editor.getElement();
          this._build(),
            t.on('click.redactor-context mouseup.redactor-context', this.open.bind(this)),
            this.opts.scrollTarget
              ? y.dom(this.opts.scrollTarget).on('scroll.redactor-context', this.close.bind(this))
              : !1 !== this.opts.maxHeight && t.on('scroll.redactor-context', this.close.bind(this));
        }
      },
      stop: function () {
        this.editor.getElement().off('.redactor-context'),
          this.$doc.off('.redactor-context'),
          this.$win.off('.redactor-context'),
          this.$contextbar && this.$contextbar.remove(),
          this.opts.scrollTarget && y.dom(this.opts.scrollTarget).off('.redactor-context');
      },
      is: function () {
        return this.$contextbar && this.$contextbar.hasClass('open');
      },
      set: function (t, e, i, s) {
        for (var n in (this.$contextbar.html(''), (this.$el = y.dom(e)), i)) {
          var r = y.create('contextbar.button', this.app, i[n]);
          '' !== r.html() && this.$contextbar.append(r);
        }
        var o = this._buildPosition(t, this.$el, s);
        this.$contextbar.css(o),
          this.$contextbar.show(),
          this.$contextbar.addClass('open'),
          this.$doc.on('click.redactor-context mouseup.redactor-context', this.close.bind(this)),
          this.$win.on('resize.redactor-context', this.close.bind(this));
      },
      open: function (t) {
        setTimeout(
          function () {
            this.app.broadcast('contextbar', t, this);
          }.bind(this),
          0
        );
      },
      close: function (t) {
        if (this.$contextbar) {
          if (t) {
            var e = y.dom(t.target);
            if (this.$el && 0 !== e.closest(this.$el).length) return;
          }
          this.$contextbar.hide(), this.$contextbar.removeClass('open'), this.$doc.off('.redactor.context');
        }
      },
      _build: function () {
        (this.$contextbar = y.dom('<div>')),
          this.$contextbar.attr('id', 'redactor-context-toolbar-' + this.uuid),
          this.$contextbar.attr('dir', this.opts.direction),
          this.$contextbar.addClass('redactor-context-toolbar'),
          this.$contextbar.hide(),
          this.$target.append(this.$contextbar);
      },
      _buildPosition: function (t, e, i) {
        var s,
          n,
          r = this.toolbar.isTarget(),
          o = r ? e.position() : e.offset(),
          a = e.width(),
          l = e.height(),
          h = this.$contextbar.width(),
          c = this.$contextbar.height(),
          d = r ? this.$target.scrollTop() + this.$doc.scrollTop() : this.$doc.scrollTop(),
          u = this.$target.offset(),
          p = r ? u.left : 0,
          f = r ? u.top : 0;
        return (
          i
            ? 'top' === i
              ? ((s = o.top - c), (n = o.left + a / 2 - h / 2))
              : 'bottom' === i && ((s = o.top + l), (n = o.left + a / 2 - h / 2))
            : ((s = t.clientY + d - c), (n = t.clientX - h / 2)),
          n < 0 && (n = 0),
          { top: s - f + 'px', left: n - p + 'px' }
        );
      },
    }),
    y.add('class', 'contextbar.button', {
      mixins: ['dom'],
      init: function (t, e) {
        (this.app = t), (this.obj = e), this._init();
      },
      _init: function () {
        if ((this.parse('<a>'), 'string' != typeof this.obj.title)) {
          var t = this.obj.title.attr('href');
          this.attr('href', t), -1 === t.search(/^#/) && this.attr('target', '_blank'), this.text(this.obj.html || t);
        } else this.attr('href', '#'), this._buildTitle(), this._buildMessage();
      },
      _buildTitle: function () {
        this.html(this.obj.title);
      },
      _buildMessage: function () {
        (void 0 === this.obj.message && void 0 === this.obj.api) || this.on('click', this._toggle.bind(this));
      },
      _toggle: function (t) {
        t.preventDefault(),
          this.obj.message
            ? this.app.broadcast(this.obj.message, this.obj.args)
            : this.obj.api && this.app.api(this.obj.api, this.obj.args);
      },
    }),
    y.add('module', 'toolbar', {
      init: function (t) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.utils = t.utils),
          (this.toolbar = t.toolbar),
          (this.detector = t.detector),
          (this.buttons = []),
          (this.toolbarModule = !1);
      },
      onsource: {
        open: function () {
          !this.toolbar.isAir() && this.toolbar.isFixed() && this.toolbarModule.resetPosition();
        },
        opened: function () {
          this.toolbar.isAir() && this.toolbarModule && this.toolbarModule.createSourceHelper(),
            setTimeout(
              function () {
                y.dom('.re-button-tooltip-' + this.uuid).remove();
              }.bind(this),
              100
            );
        },
        close: function () {
          this.toolbar.isAir() && this.toolbarModule && this.toolbarModule.destroySourceHelper();
        },
        closed: function () {
          this.toolbar.is() && this.opts.air && this.toolbarModule.openSelected();
        },
      },
      ontoolbar: {
        removeexternal: function () {
          !this.opts.air &&
            this.opts.toolbarExternal &&
            this.opts.clickToEdit &&
            y.dom(this.opts.toolbarExternal).html('');
        },
      },
      onobserve: function () {
        this.toolbar.is() && this.toolbar.observe();
      },
      onfocus: function () {
        this._setExternalOnFocus();
      },
      onsourcefocus: function () {
        this._setExternalOnFocus();
      },
      onempty: function () {
        this.toolbar.isFixed() && this.toolbarModule.resetPosition();
      },
      onenablereadonly: function () {
        this.toolbar.isAir() && this.toolbarModule.close();
      },
      start: function () {
        this.toolbar.is() && (this._buildButtons(), this._initToolbar(), this._initButtons());
      },
      stop: function () {
        this.toolbarModule && this.toolbarModule.stop(),
          y.dom('.re-button-tooltip-' + this.uuid).remove(),
          y.dom('.redactor-dropdown-' + this.uuid).remove();
      },
      _buildButtons: function () {
        (this.buttons = this.opts.buttons.concat()),
          this._buildImageButton(),
          this._buildFileButton(),
          this._buildSourceButton(),
          this._buildAdditionalButtons(),
          this._buildHiddenButtons();
      },
      _buildImageButton: function () {
        this.opts.imageUpload || this.opts.imageManagerJson || this.utils.removeFromArrayByValue(this.buttons, 'image');
      },
      _buildFileButton: function () {
        this.opts.fileUpload || this.utils.removeFromArrayByValue(this.buttons, 'file');
      },
      _buildSourceButton: function () {
        this.opts.source || this.utils.removeFromArrayByValue(this.buttons, 'html');
      },
      _buildAdditionalButtons: function () {
        var t, e;
        if (
          (0 !== this.opts.buttonsAdd.length &&
            ((this.opts.buttonsAdd = this._removeExistButtons(this.opts.buttonsAdd)),
            (this.buttons = this.buttons.concat(this.opts.buttonsAdd))),
          0 !== this.opts.buttonsAddFirst.length &&
            ((this.opts.buttonsAddFirst = this._removeExistButtons(this.opts.buttonsAddFirst)),
            this.buttons.unshift(this.opts.buttonsAddFirst)),
          !1 !== this.opts.buttonsAddAfter)
        ) {
          (t = this.buttons.indexOf(this.opts.buttonsAddAfter.after) + 1), (e = this.opts.buttonsAddAfter.buttons);
          for (var i = 0; i < e.length; i++) this.buttons.splice(t + i, 0, e[i]);
        }
        if (!1 !== this.opts.buttonsAddBefore) {
          (t = this.buttons.indexOf(this.opts.buttonsAddBefore.before) + 1), (e = this.opts.buttonsAddBefore.buttons);
          for (i = 0; i < e.length; i++) this.buttons.splice(t - (1 - i), 0, e[i]);
        }
      },
      _buildHiddenButtons: function () {
        if (0 !== this.opts.buttonsHide.length)
          for (var t = this.opts.buttonsHide, e = 0; e < t.length; e++)
            this.utils.removeFromArrayByValue(this.buttons, t[e]);
        if (this.detector.isMobile() && 0 !== this.opts.buttonsHideOnMobile.length)
          for (t = this.opts.buttonsHideOnMobile, e = 0; e < t.length; e++)
            this.utils.removeFromArrayByValue(this.buttons, t[e]);
      },
      _removeExistButtons: function (t) {
        for (var e = 0; e < t.length; e++)
          -1 !== this.opts.buttons.indexOf(t[e]) && this.utils.removeFromArrayByValue(t, t[e]);
        return t;
      },
      _setExternalOnFocus: function () {
        !this.opts.air && this.opts.toolbarExternal && this.toolbarModule.setExternal();
      },
      _initToolbar: function () {
        this.toolbarModule = this.opts.air ? y.create('toolbar.air', this.app) : y.create('toolbar.standard', this.app);
      },
      _initButtons: function () {
        this.toolbar.setButtons(this.buttons);
        for (var t = 0; t < this.buttons.length; t++) {
          var e = this.buttons[t];
          y.buttons[e] && this.toolbar.addButton(e, y.extend(!0, {}, y.buttons[e]), !1, !1, !0);
        }
      },
    }),
    y.add('class', 'toolbar.air', {
      init: function (t) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.$doc = t.$doc),
          (this.$win = t.$win),
          (this.utils = t.utils),
          (this.editor = t.editor),
          (this.animate = t.animate),
          (this.toolbar = t.toolbar),
          (this.container = t.container),
          (this.inspector = t.inspector),
          (this.selection = t.selection),
          (this.clicks = 0),
          this._init();
      },
      stop: function () {
        this.toolbar.getWrapper().remove(),
          this.editor.getElement().off('.redactor-air-trigger-' + this.uuid),
          this.$doc.off('.redactor-air-' + this.uuid),
          this.$doc.off('.redactor-air-trigger-' + this.uuid),
          this.toolbar.stopObservers();
      },
      createSourceHelper: function () {
        (this.$airHelper = y.dom('<span>')),
          this.$airHelper.addClass('redactor-air-helper'),
          this.$airHelper.html('<i class="re-icon-html"></i>'),
          this.$airHelper.on(
            'click',
            function (t) {
              t.preventDefault(), this.app.api('module.source.hide');
            }.bind(this)
          ),
          this.container.getElement().append(this.$airHelper);
      },
      destroySourceHelper: function () {
        this.$airHelper && this.$airHelper.remove();
      },
      openSelected: function () {
        setTimeout(
          function () {
            this._isSelection() && this._open(!1);
          }.bind(this),
          0
        );
      },
      close: function () {
        this.$doc.off('.redactor-air-' + this.uuid);
        var t = this.toolbar.getElement();
        t.removeClass('open'), t.hide();
      },
      _init: function () {
        this.toolbar.create();
        var t = this.toolbar.getWrapper(),
          e = this.toolbar.getElement(),
          i = this.editor.getElement(),
          s = this.container.getElement();
        t.addClass('redactor-toolbar-wrapper-air'),
          e.addClass('redactor-air'),
          e.hide(),
          t.append(e),
          s.prepend(t),
          this.openSelected(),
          this.$doc.on('mouseup.redactor-air-trigger-' + this.uuid, this._open.bind(this)),
          i.on('keyup.redactor-air-trigger-' + this.uuid, this._openCmd.bind(this));
      },
      _isSelection: function () {
        return this.selection.is() && !this.selection.isCollapsed();
      },
      _isOpened: function () {
        return this.toolbar.getElement().hasClass('open');
      },
      _open: function (t) {
        var e = !!t && t.target,
          i = !!t && y.dom(t.target),
          s = this.inspector.parse(e),
          n = s.isComponent() && !s.isComponentType('table'),
          r = s.isFigcaption(),
          o = i && 0 !== i.closest('.redactor-modal').length,
          a = t && 0 !== i.closest('.re-button').length;
        if (
          !((t && 0 !== i.closest('.redactor-dropdown').length) || a || o || r || n || this.toolbar.isContextBar()) &&
          this._isSelection()
        ) {
          var l = this.selection.getPosition();
          setTimeout(
            function () {
              this.app.isReadOnly() || (this._isSelection() && this._doOpen(l));
            }.bind(this),
            1
          );
        }
      },
      _openCmd: function () {
        if (this.selection.isAll()) {
          var t = this.toolbar.getElement(),
            e = this.selection.getPosition();
          (e.top = e.top < 20 ? 0 : e.top - t.height()), (e.height = 0), this._doOpen(e);
        }
      },
      _doOpen: function (t) {
        var e = this.toolbar.getWrapper(),
          i = this.toolbar.getElement(),
          s = this.container.getElement().offset(),
          n = 0,
          r = this.$win.width(),
          o = i.width();
        r < t.left + o && (n = o - this.selection.getPosition().width);
        e.css({ left: t.left - s.left - n + 'px', top: t.top - s.top + t.height + this.$doc.scrollTop() + 'px' }),
          this.app.broadcast('airOpen'),
          i.addClass('open'),
          i.show(),
          this.$doc.on('click.redactor-air-' + this.uuid, this._close.bind(this)),
          this.$doc.on('keydown.redactor-air-' + this.uuid, this._close.bind(this)),
          this.app.broadcast('airOpened');
      },
      _close: function (t) {
        var e = !!t && y.dom(t.target),
          i = t && 0 !== e.closest('[data-dropdown], .redactor-dropdown-not-close').length;
        ((!i && t && 0 !== e.closest('.re-button').length) || (!i && this._isOpened())) &&
          (this.app.broadcast('airClose'), this.close(), this.app.broadcast('airClosed'));
      },
    }),
    y.add('class', 'toolbar.fixed', {
      init: function (t) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.$doc = t.$doc),
          (this.$win = t.$win),
          (this.editor = t.editor),
          (this.toolbar = t.toolbar),
          (this.detector = t.detector),
          (this.container = t.container),
          this._init();
      },
      stop: function () {
        this.$fixedTarget.off('.redactor-toolbar-' + this.uuid), this.$win.off('.redactor-toolbar-' + this.uuid);
      },
      reset: function () {
        var t = this.toolbar.getElement();
        this.toolbar.getWrapper().css('height', ''),
          t.removeClass('redactor-toolbar-fixed'),
          t.css({ position: '', top: '', left: '', width: '' });
        var e = this.toolbar.getDropdown();
        e && e.updatePosition();
      },
      _init: function () {
        (this.$fixedTarget = this.toolbar.isTarget() ? this.toolbar.getTargetElement() : this.$win),
          this._doFixed(),
          this.toolbar.isTarget() &&
            (this.$win.on('scroll.redactor-toolbar-' + this.uuid, this._doFixed.bind(this)),
            this.$win.on('resize.redactor-toolbar-' + this.uuid, this._doFixed.bind(this))),
          this.$fixedTarget.on('scroll.redactor-toolbar-' + this.uuid, this._doFixed.bind(this)),
          this.$fixedTarget.on('resize.redactor-toolbar-' + this.uuid, this._doFixed.bind(this));
      },
      _doFixed: function () {
        var t = this.editor.getElement(),
          e = this.container.getElement(),
          i = this.toolbar.getElement(),
          s = this.toolbar.getWrapper();
        if (
          !this.editor.isSourceMode() &&
          0 ===
            e.parents().filter(function (t) {
              return 'none' === getComputedStyle(t, null).display && t;
            }).length
        ) {
          var n = t.height() < 100,
            r = this.editor.isEmpty();
          if (n || r) this.reset();
          else if (!this.editor.isSourceMode()) {
            var o = i.height(),
              a = (this.toolbar.isTarget() ? e.position() : e.offset()).top,
              l = a + e.height() - 60,
              h = this.$fixedTarget.scrollTop() + this.opts.toolbarFixedTopOffset,
              c = this.toolbar.isTarget() ? this.$fixedTarget.offset().top - this.$win.scrollTop() : 0;
            if (this.toolbar.isTarget() && 'fixed' === this.$fixedTarget.css('position')) {
              var d =
                this.$fixedTarget.hasClass('modal') && this.$fixedTarget.hasClass('fade')
                  ? e.closest('.modal-dialog').position().top
                  : 0;
              c = this.$fixedTarget.scrollTop() - d;
            }
            if (a < h && h < l) {
              var u = this.detector.isDesktop() ? 'fixed' : 'absolute';
              (c = this.detector.isDesktop() ? c : h - a),
                this.detector.isMobile() &&
                  (this.fixedScrollTimeout && clearTimeout(this.fixedScrollTimeout),
                  i.hide(),
                  (this.fixedScrollTimeout = setTimeout(function () {
                    i.show();
                  }, 250))),
                s.height(o),
                i.addClass('redactor-toolbar-fixed'),
                e.hasClass('redactor-box-fullscreen')
                  ? i.css({ position: u, top: '0px', width: e.width() + 'px' })
                  : i.css({ position: u, top: c + this.opts.toolbarFixedTopOffset + 'px', width: e.width() + 'px' });
              var p = this.toolbar.getDropdown();
              p && p.updatePosition(), this.app.broadcast('toolbar.fixed');
            } else this.reset(), this.app.broadcast('toolbar.unfixed');
          }
        }
      },
    }),
    y.add('class', 'toolbar.standard', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.uuid = t.uuid),
          (this.$body = t.$body),
          (this.toolbar = t.toolbar),
          (this.container = t.container),
          (this.isExternalMultiple = !1),
          (this.toolbarFixed = !1),
          this._init();
      },
      stop: function () {
        this.toolbar.getWrapper().remove(),
          this.toolbarFixed && this.toolbarFixed.stop(),
          this.opts.toolbarExternal && this._findToolbars(),
          this.toolbar.stopObservers(),
          this.$body.find('.re-button-tooltip-' + this.uuid).remove();
      },
      setExternal: function () {
        this._findToolbars(),
          this.isExternalMultiple &&
            (this.$toolbars.hide(), this.$external.find('.redactor-toolbar-external-' + this.uuid).show());
      },
      resetPosition: function () {
        this.toolbarFixed && this.toolbarFixed.reset();
      },
      _init: function () {
        (this._build(), this.opts.toolbarExternal)
          ? this._buildExternal()
          : (this._buildFixed(), this.toolbar.getElement().show());
      },
      _build: function () {
        this.toolbar.create();
        var t = this.toolbar.getWrapper(),
          e = this.toolbar.getElement();
        t.addClass('redactor-toolbar-wrapper'),
          e.addClass('redactor-toolbar'),
          e.hide(),
          t.append(e),
          this.opts.toolbarExternal || this.container.getElement().prepend(t);
      },
      _buildExternal: function () {
        (this._initExternal(), this._findToolbars(), this.isExternalMultiple)
          ? this._hideToolbarsExceptFirst()
          : this.toolbar.getElement().show();
      },
      _buildFixed: function () {
        this.opts.toolbarFixed && (this.toolbarFixed = y.create('toolbar.fixed', this.app));
      },
      _initExternal: function () {
        var t = this.toolbar.getElement(),
          e = this.toolbar.getElement();
        t.addClass('redactor-toolbar-external redactor-toolbar-external-' + this.uuid),
          (this.$external = y.dom(this.opts.toolbarExternal)),
          this.$external.append(e);
      },
      _findToolbars: function () {
        (this.$toolbars = this.$external.find('.redactor-toolbar-external')),
          (this.isExternalMultiple = 1 < this.$toolbars.length);
      },
      _hideToolbarsExceptFirst: function () {
        this.$toolbars.hide(), this.$toolbars.first().show();
      },
    }),
    y.add('module', 'line', {
      init: function (t) {
        (this.app = t),
          (this.lang = t.lang),
          (this.component = t.component),
          (this.inspector = t.inspector),
          (this.insertion = t.insertion);
      },
      oncontextbar: function (t, e) {
        var i = this.inspector.parse(t.target);
        if (i.isComponentType('line')) {
          var s = i.getComponent(),
            n = { remove: { title: this.lang.get('delete'), api: 'module.line.remove', args: s } };
          e.set(t, s, n, 'bottom');
        }
      },
      insert: function () {
        var t = this.component.create('line');
        this.insertion.insertRaw(t);
      },
      remove: function (t) {
        this.component.remove(t);
      },
    }),
    y.add('class', 'line.component', {
      mixins: ['dom', 'component'],
      init: function (t, e) {
        return (this.app = t), e && void 0 !== e.cmnt ? e : this._init(e);
      },
      _init: function (t) {
        var e, i;
        if (void 0 !== t) {
          var s = y.dom(t),
            n = s.get();
          'HR' === n.tagName ? (i = n) : 'FIGURE' === n.tagName && ((e = n), (i = s.find('hr').get()));
        }
        this._buildWrapper(e), this._buildElement(i), this._initWrapper();
      },
      _buildElement: function (t) {
        t ? (this.$element = y.dom(t)) : ((this.$element = y.dom('<hr>')), this.append(this.$element));
      },
      _buildWrapper: function (t) {
        (t = t || '<figure>'), this.parse(t);
      },
      _initWrapper: function () {
        this.addClass('redactor-component'),
          this.attr({ 'data-redactor-type': 'line', tabindex: '-1', contenteditable: !1 });
      },
    }),
    y.add('module', 'link', {
      modals: {
        link: '<form action="">                 <div class="form-item">                     <label for="modal-link-url">URL <span class="req">*</span></label>                     <input type="text" id="modal-link-url" name="url">                 </div>                 <div class="form-item">                     <label for="modal-link-text">## text ##</label>                     <input type="text" id="modal-link-text" name="text">                 </div>                 <div class="form-item form-item-title">                     <label for="modal-link-title">## title ##</label>                     <input type="text" id="modal-link-title" name="title">                 </div>                 <div class="form-item form-item-target">                     <label class="checkbox">                         <input type="checkbox" name="target"> ## link-in-new-tab ##                     </label>                 </div>             </form>',
      },
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.lang = t.lang),
          (this.caret = t.caret),
          (this.utils = t.utils),
          (this.inline = t.inline),
          (this.editor = t.editor),
          (this.inspector = t.inspector),
          (this.insertion = t.insertion),
          (this.selection = t.selection),
          (this.isCurrentLink = !1),
          (this.currentText = !1);
      },
      onmodal: {
        link: {
          open: function (t, e) {
            this._setFormData(e, t);
          },
          opened: function (t, e) {
            this._setFormFocus(e);
          },
          update: function (t, e) {
            var i = e.getData();
            this._validateData(e, i) && this._update(i);
          },
          insert: function (t, e) {
            var i = e.getData();
            this._validateData(e, i) && this._insert(i);
          },
          unlink: function () {
            this._unlink();
          },
        },
      },
      onbutton: {
        link: {
          observe: function (t) {
            this._observeButton(t);
          },
        },
      },
      ondropdown: {
        link: {
          observe: function (t) {
            this._observeUnlink(t), this._observeEdit(t);
          },
        },
      },
      oncontextbar: function (t, e) {
        var i = this._getCurrent(),
          s = this.inspector.parse(i);
        if (s.isLink() || s.isFile()) {
          var n = s.isFile() ? s.getFile() : s.getLink(),
            r = y.dom(n),
            o = y.dom('<a>'),
            a = r.attr('href');
          o.text(this._truncateText(a)), o.attr('href', a), o.attr('target', '_blank');
          var l = {
            link: { title: o, html: this._truncateText(a) },
            edit: { title: this.lang.get('edit'), api: 'module.link.open' },
            unlink: { title: this.lang.get('unlink'), api: 'module.link.unlink' },
          };
          e.set(t, n, l, 'bottom');
        }
      },
      open: function () {
        (this.$link = this._buildCurrent()), this.app.api('module.modal.build', this._getModalData());
      },
      insert: function (t) {
        this._insert(t);
      },
      update: function (t) {
        this._update(t);
      },
      unlink: function () {
        this._unlink();
      },
      _observeButton: function (t) {
        var e = this.selection.getCurrent(),
          i = this.inspector.parse(e);
        i.isPre() || i.isCode() ? t.disable() : t.enable();
      },
      _observeUnlink: function (t) {
        var e = t.getItem('unlink');
        0 === this._getLinks().length ? e.disable() : e.enable();
      },
      _observeEdit: function (t) {
        var e = this._getCurrent(),
          i = t.getItem('link'),
          s = this.inspector.parse(e),
          n = s.isLink() || s.isFile() ? this.lang.get('link-edit') : this.lang.get('link-insert');
        i.setTitle(n);
      },
      _unlink: function () {
        this.app.api('module.modal.close');
        var t = [],
          e = this._getLinks();
        this.selection.save();
        for (var i = 0; i < e.length; i++) {
          var s = y.create('link.component', this.app, e[i]);
          t.push(this.selection.getElement(e[i])), s.unwrap(), this.app.broadcast('link.deleted', s);
        }
        this.selection.restore();
        for (i = 0; i < t.length; i++) {
          var n = t[i] ? t[i] : this.editor.getElement();
          this.utils.normalizeTextNodes(n);
        }
        this._resetCurrent();
      },
      _update: function (t) {
        this.app.api('module.modal.close');
        var e = this._getLinks();
        this._setLinkData(e, t, 'updated'), this._resetCurrent(), this.app.broadcast('link.changed', e);
      },
      _insert: function (t) {
        this.app.api('module.modal.close');
        var e = this._getLinks();
        this._insertSingle(e, t) || (this._removeInSelection(e), this._insertMultiple(t)), this._resetCurrent();
      },
      _removeInSelection: function (t) {
        this.selection.save();
        for (var e = 0; e < t.length; e++) {
          var i = y.create('link.component', this.app, t[e]),
            s = i.clone();
          i.unwrap(), this.app.broadcast('link.deleted', s);
        }
        this.selection.restore();
      },
      _insertMultiple: function (t) {
        var e = this.selection.getRange();
        e && this._isCurrentTextChanged(t) && this._deleteContents(e);
        var i = this.inline.format({ tag: 'a' });
        this._setLinkData(i, t, 'inserted');
      },
      _insertSingle: function (t, e) {
        var i = this.selection.getInline();
        if (1 === t.length && (t[0].textContext === this.selection.getText() || (i && 'A' === i.tagName))) {
          var s = y.create('link.component', this.app, t[0]);
          return s.setData(e), this.caret.setAfter(s), this.app.broadcast('link.inserted', s), !0;
        }
        return !1;
      },
      _setLinkData: function (t, e, i) {
        e.text = '' === e.text.trim() ? this._truncateText(e.url) : e.text;
        var s = !this.currentText || this.currentText !== e.text;
        this.selection.save();
        for (var n = 0; n < t.length; n++) {
          var r = y.create('link.component', this.app, t[n]),
            o = {};
          e.text && s && (o.text = e.text),
            e.url && (o.url = e.url),
            void 0 !== e.title && (o.title = e.title),
            void 0 !== e.target && (o.target = e.target),
            r.setData(o),
            this.app.broadcast('link.' + i, r);
        }
        setTimeout(this.selection.restore.bind(this.selection), 0);
      },
      _deleteContents: function (t) {
        var e = this.selection.getHtml(),
          i = this.utils.parseHtml(e).nodes[0];
        if (i && 3 !== i.nodeType) {
          var s = i.tagName.toLowerCase(),
            n = document.createElement(s);
          this.insertion.insertNode(n, 'start');
        } else t.deleteContents();
      },
      _getModalData: function () {
        var t;
        return (
          (t = this._isLink()
            ? {
                update: { title: this.lang.get('save') },
                unlink: { title: this.lang.get('unlink'), type: 'danger' },
                cancel: { title: this.lang.get('cancel') },
              }
            : { insert: { title: this.lang.get('insert') }, cancel: { title: this.lang.get('cancel') } }),
          {
            name: 'link',
            title: this._isLink() ? this.lang.get('link-edit') : this.lang.get('link-insert'),
            handle: this._isLink() ? 'update' : 'insert',
            commands: t,
          }
        );
      },
      _isLink: function () {
        return this.currentLink;
      },
      _isCurrentTextChanged: function (t) {
        return this.currentText && this.currentText !== t.text;
      },
      _buildCurrent: function () {
        var t,
          e = this._getCurrent(),
          i = this.inspector.parse(e);
        if (i.isLink() || i.isFile())
          (this.currentLink = !0),
            (t = i.isFile() ? i.getFile() : i.getLink()),
            (t = y.create('link.component', this.app, t));
        else {
          (this.currentLink = !1), (t = y.create('link.component', this.app));
          var s = { text: this.selection.getText() };
          t.setData(s);
        }
        return t;
      },
      _getCurrent: function () {
        return this.selection.getInlinesAllSelected({ tags: ['a'] })[0];
      },
      _getLinks: function () {
        for (var t = this.selection.getInlines({ all: !0, tags: ['a'] }), e = [], i = 0; i < t.length; i++) {
          var s = this.inspector.parse(t[i]);
          (s.isLink() || s.isFile()) && e.push(t[i]);
        }
        return e;
      },
      _resetCurrent: function () {
        (this.isCurrentLink = !1), (this.currentText = !1);
      },
      _truncateText: function (t) {
        return t && t.length > this.opts.linkSize ? t.substring(0, this.opts.linkSize) + '...' : t;
      },
      _validateData: function (t, e) {
        return '' !== e.url.trim() || t.setError('url');
      },
      _setFormFocus: function (t) {
        t.getField('url').focus();
      },
      _setFormData: function (t, e) {
        var i = this.$link.getData(),
          s = { url: i.url, text: i.text, title: i.title, target: this.opts.linkTarget || i.target };
        this.opts.linkNewTab || e.find('.form-item-target').hide(),
          this.opts.linkTitle || e.find('.form-item-title').hide(),
          t.setData(s),
          (this.currentText = t.getField('text').val());
      },
    }),
    y.add('class', 'link.component', {
      mixins: ['dom', 'component'],
      init: function (t, e) {
        return (
          (this.app = t),
          (this.opts = t.opts),
          (this.reUrl =
            /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i),
          e && void 0 !== e.cmnt ? e : this._init(e)
        );
      },
      setData: function (t) {
        for (var e in t) this._set(e, t[e]);
      },
      getData: function () {
        for (var t = ['url', 'text', 'target', 'title'], e = {}, i = 0; i < t.length; i++) e[t[i]] = this._get(t[i]);
        return e;
      },
      _init: function (t) {
        var e = y.dom(t);
        void 0 === t ? this.parse('<a>') : this.parse(e);
      },
      _set: function (t, e) {
        this['_set_' + t](e);
      },
      _get: function (t) {
        return this['_get_' + t]();
      },
      _get_target: function () {
        return !!this.attr('target') && this.attr('target');
      },
      _get_url: function () {
        return this.attr('href');
      },
      _get_title: function () {
        return this.attr('title');
      },
      _get_text: function () {
        return this._getContext().text();
      },
      _getContext: function () {
        return this._findDeepestChild(this).element;
      },
      _set_target: function (t) {
        !1 === t ? this.removeAttr('target') : t && this.attr('target', !0 === t ? '_blank' : t);
      },
      _set_text: function (t) {
        (t = this._escapeHtml(t)), this._getContext().html(t);
      },
      _set_title: function (t) {
        t && '' !== t ? this.attr('title', t) : this.removeAttr('title');
      },
      _set_url: function (t) {
        this.opts.linkValidation &&
          ((t = this._cleanUrl(t)),
          this._isMailto(t)
            ? (t = 'mailto:' + t.replace('mailto:', ''))
            : this._isUrl(t) &&
              -1 === t.search(/^(ftp|https?)/i) &&
              (t = 'http://' + t.replace(/(ftp|https?):\/\//i, ''))),
          this.attr('href', t);
      },
      _isMailto: function (t) {
        return -1 !== t.search('@') && !1 === /(ftp|https?):\/\//i.test(t);
      },
      _isUrl: function (t) {
        return this.reUrl.test(t);
      },
      _cleanUrl: function (t) {
        return (t = this._escapeHtml(t)).trim().replace(/[^\W\w\D\d+&\'@#/%?=~_|!:,.;\(\)]/gi, '');
      },
      _escapeHtml: function (t) {
        return t.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
      },
      _findDeepestChild: function (s) {
        var n = { depth: 0, element: s };
        return (
          s.children().each(
            function (t) {
              var e = y.dom(t);
              if (t.outerHTML === s.html()) {
                var i = this._findDeepestChild(e);
                i.depth + 1 > n.depth && (n = { depth: 1 + i.depth, element: i.element });
              }
            }.bind(this)
          ),
          n
        );
      },
    }),
    y.add('module', 'modal', {
      init: function (t) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.lang = t.lang),
          (this.$doc = t.$doc),
          (this.$win = t.$win),
          (this.$body = t.$body),
          (this.utils = t.utils),
          (this.editor = t.editor),
          (this.animate = t.animate),
          (this.detector = t.detector),
          (this.selection = t.selection),
          (this.$box = !1),
          (this.$modal = !1),
          (this.selectionMarkers = !1),
          (this.defaults = { name: !1, url: !1, title: !1, width: '600px', height: !1, handle: !1, commands: !1 });
      },
      build: function (t) {
        this._open(t);
      },
      close: function () {
        this._close();
      },
      onstop: function () {
        this.$body.find('#redactor-modal-' + this.uuid).remove(),
          this.$body.find('#redactor-overlay-' + this.uuid).remove();
      },
      stop: function () {
        this.$box && (this.$box.remove(), (this.$box = !1), (this.$modal = !1)),
          this.$overlay && this.$overlay.remove(),
          this.$doc.off('.redactor.modal'),
          this.$win.off('.redactor.modal');
      },
      resize: function () {
        this.$modal.setWidth(this.p.width), this.$modal.updatePosition();
      },
      _isOpened: function () {
        return this.$modal && this.$modal.hasClass('open');
      },
      _open: function (t) {
        this._buildDefaults(t), this.p.url ? this._openUrl() : this._openTemplate();
      },
      _openUrl: function () {
        y.ajax.post({ url: this.p.url, success: this._doOpen.bind(this) });
      },
      _openTemplate: function () {
        if (void 0 !== y.modals[this.p.name]) {
          var t = this.lang.parse(y.modals[this.p.name]);
          this._doOpen(t);
        }
      },
      _doOpen: function (t) {
        this.stop(),
          this.selection.isCollapsed()
            ? (this.selection.save(), (this.selectionMarkers = !1))
            : (this.selection.saveMarkers(), (this.selectionMarkers = !0)),
          this.detector.isDesktop() || document.activeElement.blur(),
          this._createModal(t),
          this._buildModalBox(),
          this._buildOverlay(),
          this._buildModal(),
          this._buildModalForm(),
          this._buildModalCommands(),
          this._broadcast('open'),
          this.$modal.updatePosition(),
          this._buildModalTabs(),
          this.animate.start(this.$box, 'fadeIn', this._opened.bind(this)),
          this.animate.start(this.$overlay, 'fadeIn');
      },
      _opened: function () {
        this.$modal.addClass('open'),
          this.$box.on('mousedown.redactor.modal', this._close.bind(this)),
          this.$doc.on('keyup.redactor.modal', this._handleEscape.bind(this)),
          this.$win.on('resize.redactor.modal', this.resize.bind(this)),
          this.$modal
            .getBody()
            .find('input[type=text],input[type=url],input[type=email]')
            .on('keydown.redactor.modal', this._handleEnter.bind(this)),
          window.jQuery && window.jQuery(document).off('focusin.modal'),
          this._broadcast('opened');
      },
      _close: function (t) {
        if (this.$box && this._isOpened()) {
          if (t) {
            if (!this._needToClose(t.target)) return;
            t.stopPropagation(), t.preventDefault();
          }
          this.selectionMarkers ? this.selection.restoreMarkers() : this.selection.restore(),
            (this.selectionMarkers = !1),
            this._broadcast('close'),
            this.animate.start(this.$box, 'fadeOut', this._closed.bind(this)),
            this.animate.start(this.$overlay, 'fadeOut');
        }
      },
      _closed: function () {
        this.$modal.removeClass('open'),
          this.$box.off('.redactor.modal'),
          this.$doc.off('.redactor.modal'),
          this.$win.off('.redactor.modal'),
          this._broadcast('closed');
      },
      _createModal: function (t) {
        this.$modal = y.create('modal.element', this.app, t);
      },
      _broadcast: function (t) {
        this.app.broadcast('modal.' + t, this.$modal, this.$modalForm),
          this.app.broadcast('modal.' + this.p.name + '.' + t, this.$modal, this.$modalForm);
      },
      _buildDefaults: function (t) {
        this.p = y.extend({}, this.defaults, t);
      },
      _buildModalBox: function () {
        (this.$box = y.dom('<div>')),
          this.$box.attr('id', 'redactor-modal-' + this.uuid),
          this.$box.addClass('redactor-modal-box redactor-animate-hide'),
          this.$box.html(''),
          this.$body.append(this.$box);
      },
      _buildOverlay: function () {
        (this.$overlay = y.dom('#redactor-overlay-' + this.uuid)),
          0 === this.$overlay.length &&
            ((this.$overlay = y.dom('<div>')),
            this.$overlay.attr('id', 'redactor-overlay-' + this.uuid),
            this.$overlay.addClass('redactor-overlay redactor-animate-hide'),
            this.$body.prepend(this.$overlay));
      },
      _buildModal: function () {
        this.$box.append(this.$modal),
          this.$modal.setTitle(this.p.title),
          this.$modal.setHeight(this.p.height),
          this.$modal.setWidth(this.p.width);
      },
      _buildModalCommands: function () {
        if (this.p.commands) {
          var t = this.p.commands,
            e = this.$modal.getFooter();
          for (var i in t) {
            var s = y.dom('<button>');
            s.html(t[i].title),
              s.attr('data-command', i),
              'cancel' === i && (s.attr('data-action', 'close'), s.addClass('redactor-button-unstyled')),
              void 0 !== t[i].type && 'danger' === t[i].type && s.addClass('redactor-button-danger'),
              s.on('click', this._handleCommand.bind(this)),
              e.append(s);
          }
        }
      },
      _buildModalTabs: function () {
        var t = this.$modal.getBody(),
          e = t.find('.redactor-modal-tab'),
          n = t.find('.redactor-modal-tabs');
        1 < e.length &&
          ((n = 0 === n.length ? y.dom('<div>') : n.html('')).addClass('redactor-modal-tabs'),
          e.each(
            function (t, e) {
              var i = y.dom(t),
                s = y.dom('<a>');
              s.attr('href', '#'),
                s.attr('rel', e),
                s.text(i.attr('data-title')),
                s.on('click', this._showTab.bind(this)),
                0 === e && s.addClass('active'),
                n.append(s);
            }.bind(this)
          ),
          t.prepend(n)),
          1 === e.length && e.show();
      },
      _buildModalForm: function () {
        this.$modalForm = y.create('modal.form', this.app, this.$modal.getForm());
      },
      _showTab: function (t) {
        t.preventDefault();
        var e = y.dom(t.target),
          i = e.attr('rel'),
          s = this.$modal.getBody(),
          n = s.find('.redactor-modal-tab');
        n.hide(), n.eq(i).show(), s.find('.redactor-modal-tabs a').removeClass('active'), e.addClass('active');
      },
      _needToClose: function (t) {
        var e = y.dom(t);
        return !(
          'close' !== e.attr('data-action') &&
          !this.$modal.isCloseNode(t) &&
          0 !== e.closest('.redactor-modal').length
        );
      },
      _handleCommand: function (t) {
        var e = y.dom(t.target).closest('button').attr('data-command');
        'cancel' !== e && t.preventDefault(), this._broadcast(e);
      },
      _handleEnter: function (t) {
        13 === t.which && this.p.handle && (t.preventDefault(), this._broadcast(this.p.handle));
      },
      _handleEscape: function (t) {
        27 === t.which && this._close();
      },
    }),
    y.add('class', 'modal.element', {
      mixins: ['dom'],
      init: function (t, e) {
        (this.app = t), (this.opts = t.opts), (this.$win = t.$win), this._init(e);
      },
      getForm: function () {
        return this.find('form');
      },
      getHeader: function () {
        return this.$modalHeader;
      },
      getBody: function () {
        return this.$modalBody;
      },
      getFooter: function () {
        return this.$modalFooter;
      },
      setTitle: function (t) {
        t && this.$modalHeader.html(t);
      },
      setWidth: function (t) {
        (t = parseInt(t) >= this.$win.width() ? '96%' : t), this.css('max-width', t);
      },
      setHeight: function (t) {
        !1 !== t && this.$modalBody.css('height', t);
      },
      updatePosition: function () {
        var t = this.width();
        this.css({ left: '50%', 'margin-left': '-' + t / 2 + 'px' });
        var e = this.$win.height(),
          i = this.height(),
          s = e / 2 - i / 2;
        i < e && 0 != s && this.css('margin-top', s + 'px');
      },
      isCloseNode: function (t) {
        return t === this.$modalClose.get();
      },
      _init: function (t) {
        this._build(),
          this._buildClose(),
          this._buildHeader(),
          this._buildBody(),
          this._buildFooter(),
          this._buildTemplate(t);
      },
      _build: function () {
        this.parse('<div>'), this.addClass('redactor-modal'), this.attr('dir', this.opts.direction);
      },
      _buildClose: function () {
        (this.$modalClose = y.dom('<span>')),
          this.$modalClose.addClass('redactor-close'),
          this.append(this.$modalClose);
      },
      _buildHeader: function () {
        (this.$modalHeader = y.dom('<div>')),
          this.$modalHeader.addClass('redactor-modal-header'),
          this.append(this.$modalHeader);
      },
      _buildBody: function () {
        (this.$modalBody = y.dom('<div>')),
          this.$modalBody.addClass('redactor-modal-body'),
          this.append(this.$modalBody);
      },
      _buildFooter: function () {
        (this.$modalFooter = y.dom('<div>')),
          this.$modalFooter.addClass('redactor-modal-footer'),
          this.append(this.$modalFooter);
      },
      _buildTemplate: function (t) {
        this.$modalBody.html(t);
      },
    }),
    y.add('class', 'modal.form', {
      mixins: ['dom'],
      init: function (t, e) {
        (this.app = t), this.build(e);
      },
      build: function (t) {
        this.parse(t);
      },
      getData: function () {
        var i = {};
        return (
          this.find('[name]').each(function (t) {
            var e = y.dom(t);
            i[e.attr('name')] = e.val();
          }),
          i
        );
      },
      setData: function (s) {
        this.find('[name]').each(function (t) {
          var e = y.dom(t),
            i = e.attr('name');
          s.hasOwnProperty(i) && (t.type && 'checkbox' === t.type ? (t.checked = s[i]) : e.val(s[i]));
        });
      },
      getField: function (t) {
        return this.find('[name=' + t + ']');
      },
      setError: function (t) {
        var e = this.getField(t);
        return e.addClass('error'), e.one(this._getFieldEventName(e.get()), this._clearError), !1;
      },
      _clearError: function () {
        return y.dom(this).removeClass('error');
      },
      _getFieldEventName: function (t) {
        return 'SELECT' === t.tagName || 'checkbox' === t.type || 'radio' === t.type ? 'change' : 'keyup';
      },
    }),
    y.add('module', 'block', {
      init: function (t) {
        (this.app = t), (this.block = t.block);
      },
      format: function (t) {
        var e = this.block.format(t);
        this.app.broadcast('format', 'block', e);
      },
      clearformat: function () {
        this.block.clearFormat();
      },
      clearstyle: function () {
        this.block.clearStyle();
      },
      clearclass: function () {
        this.block.clearClass();
      },
      clearattr: function () {
        this.block.clearAttr();
      },
      add: function (t, e) {
        this.block.add(t, e);
      },
      toggle: function (t, e) {
        this.block.toggle(t, e);
      },
      set: function (t, e) {
        this.block.set(t, e);
      },
      remove: function (t, e) {
        this.block.remove(t, e);
      },
    }),
    y.add('module', 'inline', {
      init: function (t) {
        (this.app = t), (this.inline = t.inline);
      },
      format: function (t) {
        var e = this.inline.format(t);
        this.app.broadcast('format', 'inline', e);
      },
      clearformat: function () {
        this.inline.clearFormat();
      },
      clearstyle: function () {
        this.inline.clearStyle();
      },
      clearclass: function () {
        this.inline.clearClass();
      },
      clearattr: function () {
        this.inline.clearAttr();
      },
      add: function (t, e) {
        this.inline.add(t, e);
      },
      toggle: function (t, e) {
        this.inline.toggle(t, e);
      },
      set: function (t, e) {
        this.inline.set(t, e);
      },
      remove: function (t, e) {
        this.inline.remove(t, e);
      },
    }),
    y.add('module', 'autosave', {
      init: function (t) {
        (this.app = t), (this.opts = t.opts), (this.utils = t.utils), (this.source = t.source);
      },
      onsynced: function () {
        this.opts.autosave && this._send();
      },
      _send: function () {
        var e = this.opts.autosaveName ? this.opts.autosaveName : this.source.getName(),
          i = {};
        (i[e] = this.source.getCode()),
          (i = this.utils.extendData(i, this.opts.autosaveData)),
          y.ajax.request(this.opts.autosaveMethod, {
            url: this.opts.autosave,
            data: i,
            success: function (t) {
              this._complete(t, e, i);
            }.bind(this),
          });
      },
      _complete: function (t, e, i) {
        var s = t && t.error ? 'autosaveError' : 'autosave';
        this.app.broadcast(s, e, i, t);
      },
    }),
    y.add('module', 'input', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.utils = t.utils),
          (this.editor = t.editor),
          (this.keycodes = t.keycodes),
          (this.element = t.element),
          (this.selection = t.selection),
          (this.insertion = t.insertion),
          (this.inspector = t.inspector),
          (this.autoparser = t.autoparser),
          (this.lastShiftKey = !1);
      },
      onpaste: function (t, e) {
        if (this.opts.input) return y.create('input.paste', this.app, t, e);
      },
      onkeydown: function (t) {
        if (this.opts.input) {
          var e = t.which;
          if (!y.create('input.shortcut', this.app, t).is()) {
            if ((t.ctrlKey || t.metaKey) && !t.altKey && 65 === e) return t.preventDefault(), this._selectAll();
            var i = [this.keycodes.ENTER, this.keycodes.SPACE, this.keycodes.BACKSPACE, this.keycodes.DELETE],
              s = [this.keycodes.UP, this.keycodes.DOWN, this.keycodes.LEFT, this.keycodes.RIGHT],
              n = -1 !== i.indexOf(e),
              r = -1 !== s.indexOf(e),
              o = (t.ctrlKey || t.metaKey) && 88 === e,
              a = !t.ctrlKey && !t.metaKey && ((48 <= e && e <= 57) || (65 <= e && e <= 90));
            if (this.selection.isAll() && r && (o || (!t.ctrlKey && !t.metaKey && !t.altKey && !t.shiftKey))) {
              if (o) return this.editor.disableNonEditables(), void this.app.broadcast('empty');
              if (this._isArrowKey(e)) return !0;
              if ((n && t.preventDefault(), this.element.isType('inline')))
                this.editor.getElement().html(''), this.editor.startFocus();
              else this.insertion.set(this.opts.emptyHtml);
              if (n) return;
              this.app.broadcast('empty');
            }
            if ((this.opts.autoparse && this.autoparser.format(t, e), !a || !this.selection.hasNonEditable()))
              return e === this.keycodes.ENTER
                ? y.create('input.enter', this.app, t, e)
                : t.metaKey && 219 === e
                  ? (t.preventDefault(), void this.app.api('module.list.outdent'))
                  : e === this.keycodes.TAB || (t.metaKey && 221 === e)
                    ? y.create('input.tab', this.app, t, e)
                    : e === this.keycodes.SPACE
                      ? y.create('input.space', this.app, t, e, this.lastShiftKey)
                      : this._isDeleteKey(e)
                        ? y.create('input.delete', this.app, t, e)
                        : this._isArrowKey(e)
                          ? y.create('input.arrow', this.app, t, e)
                          : void 0;
            t.preventDefault();
          }
        }
      },
      onkeyup: function (t) {
        if (this.opts.input) {
          var e = t.which;
          if (
            ((this.lastShiftKey = t.shiftKey),
            this.app.broadcast('contextbar.close'),
            !y.create('input.shortcode', this.app, t, e).is())
          ) {
            if (e === this.keycodes.BACKSPACE) {
              var i = this.editor.getElement(),
                s = this.utils.trimSpaces(i.html());
              if ('' === (s = (s = s.replace(/<br\s?\/?>/g, '')).replace(/<div><\/div>/, '')))
                return t.preventDefault(), this.editor.setEmpty(), void this.editor.startFocus();
            }
            this.editor.isEmpty() && this.app.broadcast('empty');
          }
        }
      },
      start: function () {
        this.opts.shortcutsAdd && (this.opts.shortcuts = y.extend({}, !0, this.opts.shortcuts, this.opts.shortcutsAdd));
      },
      _selectAll: function () {
        var t,
          e = this.selection.getCurrent(),
          i = this.inspector.parse(e);
        return i.isComponentType('table')
          ? ((t = i.getTable()), void this.selection.setAll(t))
          : i.isComponentType('code')
            ? ((t = i.getComponentCodeElement()), void this.selection.setAll(t))
            : void this.selection.setAll();
      },
      _isArrowKey: function (t) {
        return -1 !== [this.keycodes.UP, this.keycodes.DOWN, this.keycodes.RIGHT, this.keycodes.LEFT].indexOf(t);
      },
      _isDeleteKey: function (t) {
        return t === this.keycodes.BACKSPACE || t === this.keycodes.DELETE;
      },
    }),
    y.add('class', 'input.arrow', {
      init: function (t, e, i) {
        (this.app = t),
          (this.opts = t.opts),
          (this.utils = t.utils),
          (this.caret = t.caret),
          (this.offset = t.offset),
          (this.marker = t.marker),
          (this.editor = t.editor),
          (this.keycodes = t.keycodes),
          (this.component = t.component),
          (this.inspector = t.inspector),
          (this.selection = t.selection),
          (this.key = i),
          this._init(e);
      },
      _init: function (t) {
        if (!this._isRightLeftKey() || !this._isExitVariable(t)) {
          if (this._isRightDownKey()) {
            if (this._isExitOnDownRight(t)) return;
            if (this._selectComponent(t, 'End', 'next')) return;
          }
          if (this._isLeftUpKey()) {
            if (this._isExitOnUpLeft(t)) return;
            if (this._selectComponent(t, 'Start', 'prev')) return;
          }
          this.key === this.keycodes.LEFT
            ? this.utils.trimInvisibleChars('left')
            : this.key === this.keycodes.RIGHT && this.utils.trimInvisibleChars('right');
        }
      },
      _isRightDownKey: function () {
        return -1 !== [this.keycodes.DOWN, this.keycodes.RIGHT].indexOf(this.key);
      },
      _isLeftUpKey: function () {
        return -1 !== [this.keycodes.UP, this.keycodes.LEFT].indexOf(this.key);
      },
      _isRightLeftKey: function () {
        return -1 !== [this.keycodes.RIGHT, this.keycodes.LEFT].indexOf(this.key);
      },
      _isExitVariable: function (t) {
        var e = this.selection.getCurrent(),
          i = this.inspector.parse(e),
          s = i.getComponent();
        if (i.isComponentType('variable') && i.isComponentActive()) {
          t.preventDefault();
          var n = this.key === this.keycodes.LEFT ? 'setBefore' : 'setAfter';
          this.caret[n](s);
        } else;
      },
      _isExitOnUpLeft: function (t) {
        var e = this.selection.getCurrent(),
          i = this.selection.getBlock(e),
          s = this.inspector.parse(e),
          n = i.previousElementSibling,
          r = this.caret.isStart(i);
        if (r && n && 'TABLE' === n.tagName) return t.preventDefault(), this.caret.setEnd(n), !0;
        if (s.isFigcaption()) {
          (i = s.getFigcaption()), (r = this.caret.isStart(i));
          var o = y.dom(i).closest('.redactor-component');
          if (r && 0 !== o.length) return t.preventDefault(), this.caret.setEnd(o), !0;
        } else {
          if (s.isTable() && r) return t.preventDefault(), this.caret.setEnd(i.previousElementSibling), !0;
          if (!s.isComponentEditable() && s.isComponent() && !s.isComponentType('variable')) {
            var a = s.getComponent();
            if (!a.previousElementSibling)
              return t.preventDefault(), this.component.clearActive(), this._exitPrevElement(t, s.getComponent());
            if (a.previousElementSibling)
              return t.preventDefault(), this.component.clearActive(), this.caret.setEnd(a.previousElementSibling), !0;
          }
        }
      },
      _isExitOnDownRight: function (t) {
        var e,
          i,
          s = this.editor.getElement(),
          n = this.selection.getCurrent(),
          r = this.inspector.parse(n),
          o = this.caret.isEnd();
        if (r.isTable()) {
          if (((e = r.getTable()), (i = this.caret.isEnd(e)) || o)) return this._exitNextElement(t, r.getComponent());
        } else if (r.isFigcaption()) {
          if (((e = r.getFigcaption()), (i = this.caret.isEnd(e)) || o))
            return this._exitNextElement(t, r.getComponent());
        } else if (r.isComponentType('code')) {
          var a = r.getComponent(),
            l = y.dom(r.getComponentCodeElement()).closest('pre');
          i = this.caret.isEnd(e);
          var h = l && l.get().nextElementSibling;
          if (i && !h) return this._exitNextElement(t, a);
        } else if (r.isPre() || r.isBlockquote() || r.isDl()) {
          if (o) {
            if (r.isPre()) return this._exitNextElement(t, r.getPre());
            if (r.isBlockquote()) return this._exitNextElement(t, r.getBlockquote());
            if (r.isDl()) return this._exitNextElement(t, r.getDl());
          }
        } else if (r.isList()) {
          var c = y.dom(n).parents('ul, ol', s).last();
          if ((i = this.caret.isEnd(c)) || o) return this._exitNextElement(t, c.get());
        } else if (r.isComponent() && !r.isComponentType('variable') && 'span' !== r.getTag())
          return this.component.clearActive(), this._exitNextElement(t, r.getComponent());
      },
      _exitPrevElement: function (t, e) {
        return (
          t.preventDefault(),
          e.previousElementSibling ? this.caret.setEnd(e.previousElementSibling) : this.utils.createMarkupBefore(e),
          !0
        );
      },
      _exitNextElement: function (t, e) {
        return (
          t.preventDefault(),
          e.nextElementSibling ? this.caret.setStart(e.nextElementSibling) : this.utils.createMarkup(e),
          !0
        );
      },
      _selectComponent: function (t, e, i) {
        var s = this.selection.getCurrent(),
          n = this.selection.getBlock(s),
          r = this.utils.findSiblings(s, i),
          o = this.utils.findSiblings(n, i);
        r && this.caret['is' + e](s)
          ? this._selectComponentItem(t, r, e)
          : o && this.caret['is' + e](n) && this._selectComponentItem(t, o, e);
      },
      _selectComponentItem: function (t, e, i) {
        if (this.component.isNonEditable(e)) return t.preventDefault(), this.caret['set' + i](e), !0;
      },
    }),
    y.add('class', 'input.delete', {
      init: function (t, e, i) {
        (this.app = t),
          (this.opts = t.opts),
          (this.caret = t.caret),
          (this.utils = t.utils),
          (this.editor = t.editor),
          (this.marker = t.marker),
          (this.keycodes = t.keycodes),
          (this.component = t.component),
          (this.inspector = t.inspector),
          (this.selection = t.selection),
          (this.insertion = t.insertion),
          (this.key = i),
          this._init(e);
      },
      _init: function (t) {
        if (!this._removeActiveComponent(t) && !this._removeAllSelectedTable(t)) {
          if (this.key === this.keycodes.BACKSPACE) {
            var e = this.editor.getElement();
            if (this.utils.trimSpaces(e.html()) === this.opts.emptyHtml) return void t.preventDefault();
          }
          if (this._detectVariableOrNonEditable() || this.selection.hasNonEditable()) t.preventDefault();
          else {
            if (this.selection.isAll()) return t.preventDefault(), void this.insertion.set(this.opts.emptyHtml);
            this.selection.isCollapsed() &&
              (this.key === this.keycodes.BACKSPACE
                ? this._traverseBackspace(t)
                : this.key === this.keycodes.DELETE && this._traverseDelete(t)),
              this.key === this.keycodes.BACKSPACE && this.utils.trimInvisibleChars('left'),
              this._removeUnwantedStyles(),
              this._removeEmptySpans(),
              this._removeSpanTagsInHeadings(),
              this._removeInlineTagsInPre();
          }
        }
      },
      _detectVariableOrNonEditable: function () {
        var t,
          e = this.selection.getBlock(),
          i = this.caret.isStart(e),
          s = this.caret.isEnd(e);
        if (this.key === this.keycodes.BACKSPACE && i) {
          if (((t = e.previousSibling), this._isNonEditable(t))) return !0;
        } else if (this.key === this.keycodes.DELETE && s && ((t = e.nextSibling), this._isNonEditable(t))) return !0;
        var n = this.selection.getCurrent(),
          r = this.caret.isStart(n),
          o = this.caret.isEnd(n),
          a = '' === this.selection.getTextBeforeCaret().trim(),
          l = '' === this.selection.getTextAfterCaret().trim();
        if (this.key === this.keycodes.BACKSPACE && r && !a) {
          if (((t = n.previousSibling), this._isVariable(t))) return this.caret.setEnd(t), !0;
          if (this._isNonEditable(t)) return !0;
        } else if (this.key === this.keycodes.DELETE && o && !l) {
          if (((t = n.nextSibling), this._isVariable(t))) return this.caret.setStart(t), !0;
          if (this._isNonEditable(t)) return !0;
        }
      },
      _isVariable: function (t) {
        return 0 !== y.dom(t).closest('[data-redactor-type="variable"]').length;
      },
      _isNonEditable: function (t) {
        return 0 !== y.dom(t).closest('.non-editable').length;
      },
      _getBlock: function () {
        var t = this.editor.getElement(),
          e = this.selection.getBlock(),
          i = this.inspector.parse(e);
        return (
          (e = i.isList() ? y.dom(e).parents('ul, ol', t).last().get() : e),
          (e = i.isDl() ? i.getDl() : e),
          (e = i.isTable() ? i.getTable() : e)
        );
      },
      _traverseDelete: function (t) {
        var e,
          i,
          s,
          n = this.selection.getCurrent(),
          r = this.inspector.parse(n);
        if (r.isFigcaption()) {
          if (((e = r.getFigcaption()), (i = this.caret.isEnd(e)))) return void t.preventDefault();
        } else if (r.isComponentType('code') && ((e = r.getComponent()), (i = this.caret.isEnd(e))))
          return void t.preventDefault();
        e = this._getBlock();
        var o = this.utils.findSiblings(e, 'next');
        if (o) {
          i = this.caret.isEnd(e);
          var a = this.inspector.parse(o),
            l = 'P' === o.tagName || 'DIV' === o.tagName;
          if (i && a.isComponentType('table')) return t.preventDefault(), void this.caret.setStart(o);
          if (i && a.isComponentEditable()) return t.preventDefault(), void this.component.remove(o, !1);
          if (i && a.isComponent())
            return (
              t.preventDefault(),
              this.caret.setStart(o),
              void (this.utils.isEmptyHtml(e.innerHTML) && y.dom(e).remove())
            );
          if (i && a.isList()) {
            var h = y.dom(e);
            if (((s = y.dom(o)), r.isList())) return t.preventDefault(), h.append(s), void s.unwrap();
            var c = s.children('li').first(),
              d = c.find('ul, ol');
            if (0 !== d.length) return t.preventDefault(), s.prepend(d), d.unwrap(), h.append(c), void c.unwrap();
          } else if (i && !r.isList() && !r.isTable() && l && !this.utils.isEmptyHtml(e.innerHTML)) {
            t.preventDefault();
            var u = y.dom(e);
            return (s = y.dom(o)), u.append(s), void s.unwrap();
          }
        }
      },
      _traverseBackspace: function (t) {
        var e,
          i,
          s,
          n,
          r = this.selection.getCurrent(),
          o = this.inspector.parse(r);
        if (o.isFigcaption()) {
          if (((e = o.getFigcaption()), (i = this.caret.isStart(e)))) return void t.preventDefault();
        } else if (
          o.isComponentType('code') &&
          ((e = o.getComponent()), (i = this.caret.isStart(e)) && e.previousElementSibling)
        )
          return t.preventDefault(), this.caret.setEnd(e.previousElementSibling), !0;
        e = this._getBlock();
        var a = this.utils.findSiblings(e, 'prev');
        if (a) {
          i = this.caret.isStart(e);
          var l = this.inspector.parse(a),
            h = 'P' === a.tagName || 'DIV' === a.tagName;
          if (i && l.isComponentType('code')) return t.preventDefault(), void this.component.remove(a, !1);
          if (i && l.isComponentType('table')) return t.preventDefault(), void this.caret.setEnd(a);
          if (i && l.isComponent())
            return (
              t.preventDefault(),
              this.caret.setStart(a),
              void (this.utils.isEmptyHtml(e.innerHTML) && y.dom(e).remove())
            );
          if (i && o.isList())
            if ((t.preventDefault(), (n = y.dom(e)), (s = y.dom(a)), l.isList()))
              n.children('li').first().prepend(this.marker.build('start')),
                s.append(n),
                n.unwrap(),
                this.selection.restoreMarkers();
            else {
              var c = n.children('li').first(),
                d = c.get(),
                u = c.find('ul, ol'),
                p = this.utils.replaceToTag(d, this.opts.markup);
              this.opts.breakline && p.attr('data-redactor-tag', 'br'),
                n.before(p),
                this.caret.setStart(p),
                0 !== u.length && (n.prepend(u), u.unwrap());
            }
          else if (i && h) {
            if ((t.preventDefault(), this.utils.isEmpty(a))) return void (s = y.dom(a)).remove();
            var f = this.utils.createInvisibleChar(),
              m = y.dom(e);
            return (s = y.dom(a)), this.caret.setEnd(s), m.prepend(f), s.append(m.contents()), void m.remove();
          }
        } else setTimeout(this._replaceBlock.bind(this), 1);
      },
      _replaceBlock: function () {
        var t = this.selection.getBlock(),
          e = y.dom(t);
        if ('p' === this.opts.markup && t && this._isNeedToReplaceBlock(t)) {
          var i = document.createElement(this.opts.markup);
          e.replaceWith(i), this.caret.setStart(i);
        }
        this.opts.breakline && t && 'DIV' === t.tagName && e.attr('data-redactor-tag', 'br');
      },
      _isNeedToReplaceBlock: function (t) {
        return 'DIV' === t.tagName && this.utils.isEmptyHtml(t.innerHTML);
      },
      _removeActiveComponent: function (t) {
        var e = this.selection.getCurrent(),
          i = this.inspector.parse(e),
          s = i.getComponent();
        if (i.isComponent() && this.component.isActive(s)) return t.preventDefault(), this.component.remove(s), !0;
      },
      _removeAllSelectedTable: function (t) {
        var e = this.selection.getCurrent(),
          i = this.inspector.parse(e).getTable();
        if (i && this.selection.isAll(i)) return t.preventDefault(), this.component.remove(i), !0;
      },
      _removeUnwantedStyles: function () {
        var t = this.editor.getElement();
        setTimeout(function () {
          t.find('*[style]')
            .not('img, figure, figcaption, iframe, [data-redactor-style-cache], [data-redactor-span]')
            .removeAttr('style');
        }, 0);
      },
      _removeEmptySpans: function () {
        var t = this.editor.getElement();
        setTimeout(function () {
          t.find('span').each(function (t) {
            0 === t.attributes.length && y.dom(t).replaceWith(t.childNodes);
          });
        }, 0);
      },
      _removeSpanTagsInHeadings: function () {
        var t = this.editor.getElement();
        setTimeout(function () {
          t.find('h1, h2, h3, h4, h5, h6').each(function (t) {
            var e = y.dom(t);
            0 === e.closest('figure').length &&
              e
                .find('span')
                .not(
                  '.redactor-component, .non-editable, .redactor-selection-marker, [data-redactor-style-cache], [data-redactor-span]'
                )
                .unwrap();
          });
        }, 1);
      },
      _removeInlineTagsInPre: function () {
        var t = this.editor.getElement(),
          i = this.opts.inlineTags;
        setTimeout(function () {
          t.find('pre').each(function (t) {
            var e = y.dom(t);
            0 === e.closest('figure').length && e.find(i.join(',')).not('code, .redactor-selection-marker').unwrap();
          });
        }, 1);
      },
    }),
    y.add('class', 'input.enter', {
      init: function (t, e) {
        (this.app = t),
          (this.opts = t.opts),
          (this.utils = t.utils),
          (this.caret = t.caret),
          (this.editor = t.editor),
          (this.keycodes = t.keycodes),
          (this.detector = t.detector),
          (this.insertion = t.insertion),
          (this.selection = t.selection),
          (this.inspector = t.inspector),
          this._init(e);
      },
      _init: function (t) {
        return this.opts.enterKey
          ? !1 === this.app.broadcast('enter', t)
            ? t.preventDefault()
            : this.selection.hasNonEditable()
              ? void t.preventDefault()
              : t.ctrlKey || t.shiftKey
                ? this._insertBreak(t)
                : void (this._isExit(t) || this._traverse(t))
          : this._disable(t);
      },
      _disable: function (t) {
        t.preventDefault();
        var e = this.selection.getRange();
        e && !e.collapsed && e.deleteContents();
      },
      _insertBreak: function (t) {
        t.preventDefault();
        var e = this.selection.getCurrent(),
          i = this.selection.getBlock(),
          s = this.inspector.parse(e);
        if (s.isHeading() && this.caret.isStart(i)) {
          var n = y.dom(i),
            r = n.clone().html('');
          n.before(r), this.caret.setStart(n);
        } else {
          if ((s.isComponent() && !s.isComponentEditable()) || s.isCode()) return;
          s.isPre() ? this.insertion.insertNewline() : this.insertion.insertBreakLine();
        }
      },
      _isExit: function (t) {
        var e = this.editor.getElement(),
          i = this.selection.getBlock(),
          s = this.inspector.parse(i),
          n = this.caret.isEnd(i),
          r = this.selection.getCurrent(),
          o = r.previousSibling;
        if (s.isBlockquote()) {
          var a = n && this._isExitableBlock(i, 'P'),
            l = n && this._isExitableDblBreak(o);
          if (a || l) return this._exitFromElement(t, l ? o : i, s.getBlockquote());
        } else if (!s.isComponentType('code') && s.isPre()) {
          if (n) {
            var h = i.innerHTML;
            if (null !== (h = this.utils.removeInvisibleChars(h)).match(/(\n\n\n)$/))
              return y.dom(o.previousSibling.previousSibling).remove(), this._exitFromElement(t, o, i);
          }
        } else if (s.isDl()) {
          if (n && this._isExitableBlock(i, 'DT')) return this._exitFromElement(t, i, s.getDl());
        } else if (s.isList()) {
          var c = y.dom(r).parents('ul, ol', e).last();
          if ((n = this.caret.isEnd(c)) && this._isExitableBlock(i, 'LI')) return this._exitFromElement(t, i, c);
        } else if (s.isComponent() && s.isComponentActive() && !s.isFigcaption() && !s.isComponentEditable())
          return this._exitFromElement(t, !1, s.getComponent());
      },
      _isExitableDblBreak: function (t) {
        var e = !!t && t.nextSibling;
        if (e) {
          var i = this.utils.removeInvisibleChars(e.textContent);
          return 3 === e.nodeType && '' === i.trim();
        }
      },
      _isExitableBlock: function (t, e) {
        return t && t.tagName === e && this.utils.isEmptyHtml(t.innerHTML);
      },
      _exitFromElement: function (t, e, i) {
        return t.preventDefault(), e && y.dom(e).remove(), this.utils.createMarkup(i), !0;
      },
      _exitNextElement: function (t, e) {
        return t.preventDefault(), e.nextSibling ? this.caret.setStart(e.nextSibling) : this.utils.createMarkup(e), !0;
      },
      _traverse: function (t) {
        var e = this.selection.getCurrent(),
          i = this.selection.isText(),
          s = this.selection.getBlock(),
          n = this.inspector.parse(e),
          r = !!s && s.tagName.toLowerCase(),
          o = y.dom(e).closest('[data-redactor-type=variable]');
        if ((0 !== o.length && this.caret.setAfter(o), n.isPre()))
          return t.preventDefault(), this.insertion.insertNewline();
        if (n.isBlockquote())
          return (s = this.selection.getBlock(e)) && 'BLOCKQUOTE' === s.tagName
            ? (t.preventDefault(), this.insertion.insertBreakLine())
            : void 0;
        if (n.isFigcaption()) {
          s = n.getFigcaption();
          var a = this.caret.isEnd(s),
            l = this.caret.isEnd();
          return a || l ? this._exitNextElement(t, n.getComponent()) : void t.preventDefault();
        }
        if (n.isDl()) return t.preventDefault(), this._traverseDl(e);
        if (this.opts.breakline && 'div' === r) setTimeout(this._replaceBlock.bind(this), 1);
        else {
          if (i) return t.preventDefault(), this.insertion.insertBreakLine();
          if (!n.isList()) {
            var h = this.detector.isDesktop() ? 50 : 1;
            setTimeout(this._replaceBlock.bind(this), h);
          }
        }
      },
      _traverseDl: function (t) {
        var e = this.selection.getBlock(t),
          i = this.inspector.parse(e).getTag(),
          s = y.dom(e),
          n = s.get().nextSibling || !1,
          r = y.dom(n),
          o = n && r.is('dd'),
          a = n && r.is('dt'),
          l = this.caret.isEnd(e);
        if ('dt' === i && !o && l) {
          var h = document.createElement('dd');
          return s.after(h), void this.caret.setStart(h);
        }
        if ('dd' !== i || a || !l) return this.insertion.insertBreakLine();
        var c = document.createElement('dt');
        return s.after(c), void this.caret.setStart(c);
      },
      _replaceBlock: function () {
        var t = this.selection.getBlock(),
          e = y.dom(t);
        if ('p' === this.opts.markup && t && this._isNeedToReplaceBlock(t)) {
          var i = document.createElement(this.opts.markup);
          e.replaceWith(i), this.caret.setStart(i);
        } else if (t)
          if (this.utils.isEmptyHtml(t.innerHTML)) this._clearBlock(e, t);
          else {
            var s = this.utils.getFirstNode(t);
            s && 'BR' === s.tagName && (y.dom(s).remove(), this.caret.setStart(t));
          }
        e.removeAttr('id'),
          t && this._isNeedToCleanBlockStyle(t) && this.opts.cleanOnEnter && e.removeAttr('class style'),
          this.opts.breakline && t && t.tagName;
      },
      _clearBlock: function (t, e) {
        'DIV' === e.tagName && t.find('br').remove(),
          (!this.opts.cleanInlineOnEnter && '<br>' !== e.innerHTML) || t.html(''),
          this.caret.setStart(e);
      },
      _isNeedToReplaceBlock: function (t) {
        return 'DIV' === t.tagName && this.utils.isEmptyHtml(t.innerHTML);
      },
      _isNeedToCleanBlockStyle: function (t) {
        return 'P' === t.tagName && this.utils.isEmptyHtml(t.innerHTML);
      },
    }),
    y.add('class', 'input.paste', {
      init: function (t, e, i, s, n) {
        (this.app = t),
          (this.opts = t.opts),
          (this.editor = t.editor),
          (this.cleaner = t.cleaner),
          (this.container = t.container),
          (this.inspector = t.inspector),
          (this.insertion = t.insertion),
          (this.selection = t.selection),
          (this.autoparser = t.autoparser),
          (this.pasteHtml = s),
          (this.pointInserted = n),
          (this.dataTransfer = i),
          this._init(e);
      },
      _init: function (t) {
        var e,
          i = this.dataTransfer || t.clipboardData,
          s = this.selection.getCurrent(),
          n = this.inspector.parse(s);
        if (
          ((this.dropPasted = this.dataTransfer),
          (this.isRawCode = n.isPre() || n.isCode()),
          this.editor.enablePasting(),
          this.editor.saveScroll(),
          this.dropPasted || this.selection.saveMarkers(),
          this.isRawCode || !i)
        )
          return (
            (e =
              this.isRawCode || i || !window.clipboardData
                ? i.getData('text/plain')
                : window.clipboardData.getData('text')),
            t.preventDefault(),
            void this._insert(t, e)
          );
        if (this.pasteHtml) t.preventDefault(), this._insert(t, this.pasteHtml);
        else {
          var r = i.getData('URL'),
            o = this._isPlainText(i) ? this.cleaner.encodeEntities(i.getData('text/plain')) : i.getData('text/html');
          if (((o = r && '' !== r ? r : o), null !== i.files && 0 < i.files.length && '' === o)) {
            for (var a = [], l = 0; l < i.files.length; l++) {
              var h = i.files[l] || i.items[l].getAsFile();
              h && a.push(h);
            }
            if (0 < a.length) return t.preventDefault(), void this._insertFiles(t, a);
          }
          t.preventDefault(), this._insert(t, o);
        }
      },
      _isPlainText: function (t) {
        var e = t.getData('text/plain'),
          i = t.getData('text/html');
        if (!e || !i) return null !== e;
        var s = document.createElement('div');
        return (s.innerHTML = i), s.textContent === e ? !s.querySelector(':not(meta)') : void 0;
      },
      _restoreSelection: function () {
        this.editor.restoreScroll(), this.editor.disablePasting(), this.dropPasted || this.selection.restoreMarkers();
      },
      _insert: function (t, e) {
        var i = this.app.broadcast('pasteBefore', e);
        if (
          ((e = (e = void 0 === i ? e : i).trim()),
          (e = (e = this.isRawCode ? e : this.cleaner.paste(e)).trim()),
          (e = this.isRawCode ? this.cleaner.encodePhpCode(e) : e),
          (e = void 0 === (i = this.app.broadcast('pasting', e)) ? e : i),
          this._restoreSelection(),
          this.opts.input)
        ) {
          this.app.broadcast('state', !1);
          var s = [];
          if (this.isRawCode) {
            e = e.replace('&lt;?php', '<?php');
            var n = document.createTextNode(e);
            (s = this.insertion.insertNode(n, 'after')), this.app.broadcast('pasted', s);
          } else
            this.opts.autoparse && this.opts.autoparsePaste && (e = this.autoparser.parse(e)),
              (s = this.dropPasted
                ? this.insertion.insertToPoint(t, e, this.pointInserted)
                : this.insertion.insertHtml(e)),
              this.app.broadcast('pasted', s),
              this.app.broadcast('autoparseobserve');
        }
      },
      _insertFiles: function (t, e) {
        this._restoreSelection();
        var i = -1 !== this.opts.imageTypes.indexOf(e[0].type),
          s = void 0 === this.dropPasted;
        i ? this.app.broadcast('dropimage', t, e, s) : this.app.broadcast('dropfile', t, e, s);
      },
    }),
    y.add('class', 'input.shortcode', {
      init: function (t, e, i) {
        (this.app = t),
          (this.opts = t.opts),
          (this.utils = t.utils),
          (this.marker = t.marker),
          (this.keycodes = t.keycodes),
          (this.selection = t.selection),
          (this.worked = !1),
          i === this.keycodes.SPACE && this._init();
      },
      is: function () {
        return this.worked;
      },
      _init: function () {
        var t = this.selection.getCurrent();
        if (t && 3 === t.nodeType) {
          var e = this.utils.removeInvisibleChars(t.textContent),
            i = this.opts.shortcodes;
          for (var s in i) {
            var n = new RegExp('^' + this.utils.escapeRegExp(s));
            if (null !== e.match(n) && void 0 !== i[s].format) return this._format(i[s].format, t, n);
          }
        }
      },
      _format: function (t, e, i) {
        var s = (e = this.marker.insert('start').previousSibling).textContent;
        (s = (s = this.utils.trimSpaces(s)).replace(i, '')), (e.textContent = s);
        var n = 'ul' === t || 'ol' === t ? 'module.list.toggle' : 'module.block.format';
        this.app.api(n, t), this.selection.restoreMarkers(), (this.worked = !0);
      },
    }),
    y.add('class', 'input.shortcut', {
      init: function (t, e) {
        (this.app = t),
          (this.opts = t.opts),
          (this.worked = !1),
          (this.hotkeys = {
            8: 'backspace',
            9: 'tab',
            10: 'return',
            13: 'return',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            19: 'pause',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'insert',
            46: 'del',
            59: ';',
            61: '=',
            96: '0',
            97: '1',
            98: '2',
            99: '3',
            100: '4',
            101: '5',
            102: '6',
            103: '7',
            104: '8',
            105: '9',
            106: '*',
            107: '+',
            109: '-',
            110: '.',
            111: '/',
            112: 'f1',
            113: 'f2',
            114: 'f3',
            115: 'f4',
            116: 'f5',
            117: 'f6',
            118: 'f7',
            119: 'f8',
            120: 'f9',
            121: 'f10',
            122: 'f11',
            123: 'f12',
            144: 'numlock',
            145: 'scroll',
            173: '-',
            186: ';',
            187: '=',
            188: ',',
            189: '-',
            190: '.',
            191: '/',
            192: '`',
            219: '[',
            220: '\\',
            221: ']',
            222: "'",
          }),
          (this.hotkeysShiftNums = {
            '`': '~',
            1: '!',
            2: '@',
            3: '#',
            4: '$',
            5: '%',
            6: '^',
            7: '&',
            8: '*',
            9: '(',
            0: ')',
            '-': '_',
            '=': '+',
            ';': ': ',
            "'": '"',
            ',': '<',
            '.': '>',
            '/': '?',
            '\\': '|',
          }),
          this._init(e);
      },
      is: function () {
        return this.worked;
      },
      _init: function (t) {
        if (!1 !== this.opts.shortcuts) for (var e in this.opts.shortcuts) this._build(t, e, this.opts.shortcuts[e]);
        else (!t.ctrlKey && !t.metaKey) || (66 !== t.which && 73 !== t.which) || t.preventDefault();
      },
      _build: function (t, e, i) {
        for (var s = e.split(','), n = s.length, r = 0; r < n; r++)
          'string' == typeof s[r] && this._handler(t, s[r].trim(), i);
      },
      _handler: function (t, e, i) {
        e = e.toLowerCase().split(' ');
        for (
          var s = this.hotkeys[t.keyCode],
            n = String.fromCharCode(t.which).toLowerCase(),
            r = '',
            o = {},
            a = ['meta', 'ctrl', 'alt', 'shift'],
            l = 0;
          l < a.length;
          l++
        ) {
          var h = a[l];
          t[h + 'Key'] && s !== h && (r += h + '+');
        }
        s && (o[r + s] = !0),
          n &&
            ((o[r + n] = !0),
            (o[r + this.hotkeysShiftNums[n]] = !0),
            'shift+' === r && (o[this.hotkeysShiftNums[n]] = !0));
        var c = e.length;
        for (l = 0; l < c; l++)
          if (o[e[l]])
            return (
              t.preventDefault(),
              (this.worked = !0),
              void (i.message
                ? (this.app.broadcast(i.message, i.args), this.app.broadcast('buffer.trigger'))
                : i.api && (this.app.api(i.api, i.args), this.app.broadcast('buffer.trigger')))
            );
      },
    }),
    y.add('class', 'input.space', {
      init: function (t, e, i, s) {
        (this.app = t),
          (this.keycodes = t.keycodes),
          (this.insertion = t.insertion),
          (this.selection = t.selection),
          (this.key = i),
          (this.lastShiftKey = s),
          this._init(e);
      },
      _init: function (t) {
        if (!this.selection.hasNonEditable())
          return this.lastShiftKey || this.key !== this.keycodes.SPACE || (!t.ctrlKey && !t.shiftKey) || t.metaKey
            ? void 0
            : (t.preventDefault(), void this.insertion.insertChar('&nbsp;'));
        t.preventDefault();
      },
    }),
    y.add('class', 'input.tab', {
      init: function (t, e) {
        (this.app = t),
          (this.opts = t.opts),
          (this.inspector = t.inspector),
          (this.insertion = t.insertion),
          (this.selection = t.selection),
          this._init(e);
      },
      _init: function (t) {
        if (this.opts.tabKey) {
          if (!1 === this.app.broadcast('tab', t)) return t.preventDefault();
          this._traverse(t);
        }
      },
      _traverse: function (t) {
        var e = this.selection.getCurrent(),
          i = this.inspector.parse(e);
        return !i.isComponent() && t.shiftKey
          ? this._insertHardTab(t, 4)
          : i.isList()
            ? (t.preventDefault(), this.app.api('module.list.indent'))
            : i.isPre() || (i.isComponentType('code') && !i.isFigcaption())
              ? this._tabCode(t)
              : !1 !== this.opts.tabAsSpaces
                ? this._insertHardTab(t, this.opts.tabAsSpaces)
                : void 0;
      },
      _insertHardTab: function (t, e) {
        t.preventDefault();
        var i = document.createTextNode(Array(e + 1).join(' '));
        return this.insertion.insertNode(i, 'end');
      },
      _tabCode: function (t) {
        t.preventDefault();
        var e = this.opts.preSpaces
          ? document.createTextNode(Array(this.opts.preSpaces + 1).join(' '))
          : document.createTextNode('\t');
        return this.insertion.insertNode(e, 'end');
      },
    }),
    y.add('module', 'upload', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.lang = t.lang),
          (this.utils = t.utils),
          (this.editor = t.editor),
          (this.progress = t.progress),
          (this.defaults = { event: !1, element: !1, name: !1, files: !1, url: !1, data: !1, paramName: !1 });
      },
      build: function (t) {
        (this.p = y.extend(this.defaults, t)),
          (this.$el = y.dom(this.p.element)),
          'INPUT' === this.$el.get().tagName ? this._buildInput() : this._buildBox();
      },
      send: function (t) {
        (this.p = y.extend(this.defaults, t)),
          (this.$uploadbox = this.editor.getElement()),
          this._send(this.p.event, this.p.files);
      },
      complete: function (t, e) {
        this._complete(t, e);
      },
      _buildInput: function () {
        (this.box = !1),
          (this.prefix = ''),
          (this.$uploadbox = y.dom('<div class="upload-redactor-box" />')),
          this.$el.hide(),
          this.$el.after(this.$uploadbox),
          this.opts.multipleUpload ? this.$el.attr('multiple', 'multiple') : this.$el.removeAttr('multiple'),
          'file' !== this.p.name && this.$el.attr('accept', 'image/*'),
          this._buildPlaceholder(),
          this._buildEvents();
      },
      _buildBox: function () {
        (this.box = !0),
          (this.prefix = 'box-'),
          (this.$uploadbox = this.$el),
          this.$uploadbox.attr('ondragstart', 'return false;'),
          this.$uploadbox.on('drop.redactor.upload', this._onDropBox.bind(this)),
          this.$uploadbox.on('dragover.redactor.upload', this._onDragOver.bind(this)),
          this.$uploadbox.on('dragleave.redactor.upload', this._onDragLeave.bind(this));
      },
      _buildPlaceholder: function () {
        (this.$placeholder = y.dom('<div class="upload-redactor-placeholder" />')),
          this.$placeholder.html(this.lang.get('upload-label')),
          this.$uploadbox.append(this.$placeholder);
      },
      _buildEvents: function () {
        this.$el.on('change.redactor.upload', this._onChange.bind(this)),
          this.$uploadbox.on('click.redactor.upload', this._onClick.bind(this)),
          this.$uploadbox.on('drop.redactor.upload', this._onDrop.bind(this)),
          this.$uploadbox.on('dragover.redactor.upload', this._onDragOver.bind(this)),
          this.$uploadbox.on('dragleave.redactor.upload', this._onDragLeave.bind(this));
      },
      _onClick: function (t) {
        t.preventDefault(), this.$el.click();
      },
      _onChange: function (t) {
        this._send(t, this.$el.get().files);
      },
      _onDrop: function (t) {
        t.preventDefault(), this._clear(), this._setStatusDrop(), this._send(t);
      },
      _onDragOver: function (t) {
        return t.preventDefault(), this._setStatusHover(), !1;
      },
      _onDragLeave: function (t) {
        return t.preventDefault(), this._removeStatusHover(), !1;
      },
      _onDropBox: function (t) {
        t.preventDefault(), this._clear(), this._setStatusDrop(), this._send(t);
      },
      _removeStatusHover: function () {
        this.$uploadbox.removeClass('upload-redactor-' + this.prefix + 'hover');
      },
      _setStatusDrop: function () {
        this.$uploadbox.addClass('upload-redactor-' + this.prefix + 'drop');
      },
      _setStatusHover: function () {
        this.$uploadbox.addClass('upload-redactor-' + this.prefix + 'hover');
      },
      _setStatusError: function () {
        this.$uploadbox.addClass('upload-redactor-' + this.prefix + 'error');
      },
      _setStatusSuccess: function () {
        this.$uploadbox.addClass('upload-redactor-' + this.prefix + 'success');
      },
      _clear: function () {
        for (var t = ['drop', 'hover', 'error', 'success'], e = 0; e < t.length; e++)
          this.$uploadbox.removeClass('upload-redactor-' + this.prefix + t[e]);
        this.$uploadbox.removeAttr('ondragstart');
      },
      _send: function (t, e) {
        (t = t.originalEvent || t), (e = e || t.dataTransfer.files);
        var i = new FormData(),
          s = this._getUploadParam();
        (i = this._buildData(s, e, i)),
          (i = this.utils.extendData(i, this.p.data)),
          !1 !== this.app.broadcast('upload.start', t, i, e) && this._sendData(i, e, t);
      },
      _sendData: function (t, e, s) {
        if ((this.progress.show(), 'function' == typeof this.p.url)) {
          var i = this.p.url(t, e, s, this);
          i instanceof Promise || this._complete(i, s);
        } else
          y.ajax.post({
            url: this.p.url,
            data: t,
            before: function (t) {
              return this.app.broadcast('upload.beforeSend', t);
            }.bind(this),
            success: function (t) {
              this._complete(t, s);
            }.bind(this),
            error: function (t, e, i) {
              this._complete(t, s, i);
            }.bind(this),
          });
      },
      _getUploadParam: function () {
        return this.p.paramName ? this.p.paramName : 'file';
      },
      _buildData: function (t, e, i) {
        if (1 === e.length) i.append(t + '[]', e[0]);
        else if (1 < e.length && !1 !== this.opts.multipleUpload)
          for (var s = 0; s < e.length; s++) i.append(t + '[]', e[s]);
        return i;
      },
      _complete: function (t, e, i) {
        this._clear(),
          this.progress.hide(),
          t && t.error
            ? (this._setStatusError(),
              this.app.broadcast('upload.' + this.p.name + '.error', t, e, i),
              this.app.broadcast('upload.error', t, i))
            : (this._setStatusSuccess(),
              this.app.broadcast('upload.' + this.p.name + '.complete', t, e),
              this.app.broadcast('upload.complete', t),
              setTimeout(this._clear.bind(this), 500));
      },
    }),
    y.add('class', 'code.component', {
      mixins: ['dom', 'component'],
      init: function (t, e) {
        return (this.app = t), e && void 0 !== e.cmnt ? e : this._init(e);
      },
      _init: function (t) {
        var e;
        if (void 0 !== t) {
          var i = y.dom(t).closest('figure');
          0 !== i.length ? this.parse(i) : (this.parse('<figure>'), this.append(t)),
            (e = this.find('pre code, pre').last());
        } else (e = y.dom('<pre>')), this.parse('<figure>'), this.append(e);
        this._initElement(e), this._initWrapper();
      },
      _initElement: function (t) {
        t.attr({ tabindex: '-1', contenteditable: !0 });
      },
      _initWrapper: function () {
        this.addClass('redactor-component'),
          this.attr({ 'data-redactor-type': 'code', tabindex: '-1', contenteditable: !1 });
      },
    }),
    y.add('module', 'form', {
      init: function (t) {
        (this.app = t), (this.lang = t.lang), (this.component = t.component), (this.inspector = t.inspector);
      },
      onform: {
        remove: function (t) {
          this._remove(t);
        },
      },
      oncontextbar: function (t, e) {
        var i = this.inspector.parse(t.target);
        if (i.isComponentType('form')) {
          var s = i.getComponent(),
            n = { remove: { title: this.lang.get('delete'), api: 'module.form.remove', args: s } };
          e.set(t, s, n, 'top');
        }
      },
      _remove: function (t) {
        this.component.remove(t);
      },
    }),
    y.add('class', 'form.component', {
      mixins: ['dom', 'component'],
      init: function (t, e) {
        return (this.app = t), (this.utils = t.utils), e && void 0 !== e.cmnt ? e : this._init(e);
      },
      _init: function (t) {
        if (void 0 !== t)
          if (0 !== y.dom(t).closest('form').length) {
            var e = this.utils.replaceToTag(t, 'figure');
            this.parse(e);
          } else this.parse('<figure>'), this.append(t);
        else this.parse('<figure>');
        this._initWrapper();
      },
      _initWrapper: function () {
        this.addClass('redactor-component'),
          this.attr({ 'data-redactor-type': 'form', tabindex: '-1', contenteditable: !1 });
      },
    }),
    y.add('module', 'image', {
      modals: {
        image:
          '<div class="redactor-modal-tab redactor-modal-tab-upload" data-title="## upload ##"><form action="">                 <input type="file" name="file">             </form></div>',
        imageedit:
          '<div class="redactor-modal-group">                 <div id="redactor-modal-image-preview" class="redactor-modal-side"></div>                 <form action="" class="redactor-modal-area">                     <div class="form-item">                         <label for="modal-image-title"> ## title ##</label>                         <input type="text" id="modal-image-title" name="title" />                     </div>                     <div class="form-item form-item-caption">                         <label for="modal-image-caption">## caption ##</label>                         <input type="text" id="modal-image-caption" name="caption" aria-label="## caption ##" />                     </div>                     <div class="form-item form-item-align">                         <label>## image-position ##</label>                         <select name="align" aria-label="## image-position ##">                             <option value="none">## none ##</option>                             <option value="left">## left ##</option>                             <option value="center">## center ##</option>                             <option value="right">## right ##</option>                         </select>                     </div>                     <div class="form-item form-item-link">                         <label for="modal-image-url">## link ##</label>                         <input type="text" id="modal-image-url" name="url" aria-label="## link ##" />                     </div>                     <div class="form-item form-item-link">                         <label class="checkbox"><input type="checkbox" name="target" aria-label="## link-in-new-tab ##"> ## link-in-new-tab ##</label>                     </div>                 </form>             </div>',
      },
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.lang = t.lang),
          (this.caret = t.caret),
          (this.utils = t.utils),
          (this.editor = t.editor),
          (this.storage = t.storage),
          (this.component = t.component),
          (this.inspector = t.inspector),
          (this.insertion = t.insertion),
          (this.selection = t.selection),
          (this.justResized = !1);
      },
      oninsert: function () {
        this._observeImages();
      },
      onstarted: function () {
        this.storage.observeImages(),
          this.opts.imageResizable && (this.resizer = y.create('image.resize', this.app)),
          this._observeImages();
      },
      ondropimage: function (t, e, i) {
        if (this.opts.imageUpload) {
          var s = {
            url: this.opts.imageUpload,
            event: !i && t,
            files: e,
            name: 'imagedrop',
            data: this.opts.imageData,
            paramName: this.opts.imageUploadParam,
          };
          this.app.api('module.upload.send', s);
        }
      },
      onstop: function () {
        this.resizer && this.resizer.stop();
      },
      onbottomclick: function () {
        this.insertion.insertToEnd(this.editor.getLastNode(), 'image');
      },
      onimageresizer: {
        stop: function () {
          this.resizer && this.resizer.hide();
        },
      },
      onsource: {
        open: function () {
          this.resizer && this.resizer.hide();
        },
        closed: function () {
          this._observeImages(), this.resizer && this.resizer.rebuild();
        },
      },
      onupload: {
        complete: function () {
          this._observeImages();
        },
        image: {
          complete: function (t) {
            this._insert(t), this.app.broadcast('state', !1);
          },
          error: function (t) {
            this._uploadError(t);
          },
        },
        imageedit: {
          complete: function (t) {
            this._change(t);
          },
          error: function (t) {
            this._uploadError(t);
          },
        },
        imagedrop: {
          complete: function (t, e) {
            this._insert(t, e);
          },
          error: function (t) {
            this._uploadError(t);
          },
        },
        imagereplace: {
          complete: function (t) {
            this._change(t, !1);
          },
          error: function (t) {
            this._uploadError(t);
          },
        },
      },
      onmodal: {
        image: {
          open: function (t, e) {
            this._setUpload(t, e);
          },
        },
        imageedit: {
          open: function (t, e) {
            this._setFormData(t, e);
          },
          opened: function (t, e) {
            this._setFormFocus(e);
          },
          remove: function () {
            this._remove(this.$image);
          },
          save: function (t, e) {
            this._save(t, e);
          },
        },
      },
      onimage: {
        observe: function () {
          this._observeImages();
        },
        resized: function () {
          this.justResized = !0;
        },
      },
      oncontextbar: function (t, e) {
        if (this.justResized) this.justResized = !1;
        else {
          var i = this.selection.getCurrent(),
            s = this.inspector.parse(i),
            n = y.dom(i).closest('img');
          if ((!s.isFigcaption() && s.isComponentType('image')) || 0 !== n.length) {
            var r = 0 !== n.length ? n.get() : s.getComponent(),
              o = {
                edit: { title: this.lang.get('edit'), api: 'module.image.open' },
                remove: { title: this.lang.get('delete'), api: 'module.image.remove', args: r },
              };
            e.set(t, r, o);
          }
        }
      },
      open: function () {
        (this.$image = this._getCurrent()), this.app.api('module.modal.build', this._getModalData());
      },
      insert: function (t) {
        this._insert(t);
      },
      remove: function (t) {
        this._remove(t);
      },
      _getModalData: function () {
        return this._isImage() && this.opts.imageEditable
          ? {
              name: 'imageedit',
              width: '800px',
              title: this.lang.get('edit'),
              handle: 'save',
              commands: {
                save: { title: this.lang.get('save') },
                remove: { title: this.lang.get('delete'), type: 'danger' },
                cancel: { title: this.lang.get('cancel') },
              },
            }
          : { name: 'image', title: this.lang.get('image') };
      },
      _isImage: function () {
        return this.$image;
      },
      _getCurrent: function () {
        var t = this.selection.getCurrent(),
          e = this.inspector.parse(t),
          i = y.dom(t).closest('img');
        return 0 !== i.length
          ? this.component.create('image', i)
          : !(!e.isComponentType('image') || !e.isComponentActive()) &&
              this.component.create('image', e.getComponent());
      },
      _insert: function (t, e) {
        if ((this.app.api('module.modal.close'), Array.isArray(t))) {
          for (var i = {}, s = 0; s < t.length; s++) i = y.extend(i, t[s]);
          t = i;
        } else 'string' == typeof t && (t = { file: { url: t } });
        if ('object' == typeof t) {
          var n = 0;
          for (var r in t) 'object' == typeof t[r] && n++;
          1 < n ? this._insertMultiple(t, e) : this._insertSingle(t, e);
        }
      },
      _insertSingle: function (t, e) {
        for (var i in t)
          if ('object' == typeof t[i]) {
            var s = this._createImageAndStore(t[i]),
              n = e ? this.insertion.insertToPoint(e, s, !1, !1) : this.insertion.insertHtml(s, !1);
            this._removeSpaceBeforeFigure(n[0]),
              this.component.setActive(n[0]),
              this.app.broadcast('image.uploaded', n[0], t);
          }
      },
      _insertMultiple: function (t, e) {
        var i,
          s = 0,
          n = [];
        for (var r in t)
          if ('object' == typeof t[r]) {
            s++;
            var o = this._createImageAndStore(t[r]);
            if (1 === s) n = e ? this.insertion.insertToPoint(e, o, !1, !1) : this.insertion.insertHtml(o, !1);
            else y.dom(n[0]).after(o), (n = [o.get()]), this.app.broadcast('image.inserted', o);
            (i = n[0]), this._removeSpaceBeforeFigure(n[0]), this.app.broadcast('image.uploaded', n[0], t);
          }
        this.component.setActive(i);
      },
      _createImageAndStore: function (t) {
        var e = this.component.create('image');
        return (
          e.addClass('redactor-uploaded-figure'),
          e.setData({ src: t.url, id: t.id ? t.id : this.utils.getRandomId() }),
          this.storage.add('image', e.getElement()),
          e
        );
      },
      _removeSpaceBeforeFigure: function (t) {
        if (t) {
          var e = t.previousSibling,
            i = t.nextSibling,
            s = y.dom(e),
            n = y.dom(i);
          this.opts.breakline &&
            (i && 'br' === n.attr('data-redactor-tag') && n.find('br').first().remove(),
            e && 'br' === s.attr('data-redactor-tag') && s.find('br').last().remove()),
            e && (this._removeInvisibleSpace(e), this._removeInvisibleSpace(e.previousSibling));
        }
      },
      _removeInvisibleSpace: function (t) {
        t && 3 === t.nodeType && -1 !== this.utils.searchInvisibleChars(t.textContent) && t.parentNode.removeChild(t);
      },
      _save: function (t, e) {
        var i = e.getData(),
          s = { title: i.title };
        this.opts.imageLink && (s.link = { url: i.url, target: i.target }),
          this.opts.imageCaption && (s.caption = i.caption),
          this.opts.imagePosition && (s.align = i.align),
          this.$image.setData(s),
          this.resizer && this.resizer.rebuild(),
          this.app.broadcast('image.changed', this.$image),
          this.app.api('module.modal.close');
      },
      _change: function (t, e) {
        if (('string' == typeof t && (t = { file: { url: t } }), 'object' == typeof t)) {
          var i;
          for (var s in t)
            if ('object' == typeof t[s]) {
              (i = y.dom('<img>')).attr('src', t[s].url),
                this.$image.changeImage(t[s]),
                this.app.broadcast('image.changed', this.$image, t),
                this.app.broadcast('image.uploaded', this.$image, t),
                this.app.broadcast('hardsync');
              break;
            }
          !1 !== e &&
            i.on(
              'load',
              function () {
                this.$previewBox.html(i);
              }.bind(this)
            );
        }
      },
      _uploadError: function (t) {
        this.app.broadcast('image.uploadError', t);
      },
      _remove: function (t) {
        this.app.api('module.modal.close'), this.component.remove(t);
      },
      _observeImages: function () {
        var t = this.editor.getElement(),
          i = this;
        t.find('img').each(function (t) {
          var e = y.dom(t);
          e.off('.drop-to-replace'),
            e.on('dragover.drop-to-replace dragenter.drop-to-replace', function (t) {
              t.preventDefault();
            }),
            e.on('drop.drop-to-replace', function (t) {
              if (!i.app.isDragComponentInside()) return i._setReplaceUpload(t, e);
            });
        });
      },
      _setFormData: function (t, e) {
        this._buildPreview(t), this._buildPreviewUpload();
        var i = this.$image.getData(),
          s = { title: i.title };
        this.opts.imageCaption ? (s.caption = i.caption) : t.find('.form-item-caption').hide(),
          this.opts.imagePosition ? (s.align = i.align) : t.find('.form-item-align').hide(),
          this.opts.imageLink
            ? i.link && ((s.url = i.link.url), i.link.target && (s.target = !0))
            : t.find('.form-item-link').hide(),
          e.setData(s);
      },
      _setFormFocus: function (t) {
        t.getField('title').focus();
      },
      _setReplaceUpload: function (t, e) {
        if (((t = t.originalEvent || t).stopPropagation(), t.preventDefault(), this.opts.imageUpload)) {
          this.$image = this.component.create('image', e);
          var i = {
            url: this.opts.imageUpload,
            files: t.dataTransfer.files,
            name: 'imagereplace',
            data: this.opts.imageData,
            paramName: this.opts.imageUploadParam,
          };
          this.app.api('module.upload.send', i);
        }
      },
      _setUpload: function (t, e) {
        this.opts.imageUpload || t.getBody().find('.redactor-modal-tab-upload').remove();
        var i = {
          url: this.opts.imageUpload,
          element: e.getField('file'),
          name: 'image',
          data: this.opts.imageData,
          paramName: this.opts.imageUploadParam,
        };
        this.app.api('module.upload.build', i);
      },
      _buildPreview: function (t) {
        this.$preview = t.find('#redactor-modal-image-preview');
        var e = this.$image.getData(),
          i = y.dom('<img>');
        i.attr('src', e.src),
          (this.$previewBox = y.dom('<div>')),
          this.$previewBox.append(i),
          this.$preview.html(''),
          this.$preview.append(this.$previewBox);
      },
      _buildPreviewUpload: function () {
        if (this.opts.imageUpload) {
          var t = y.dom('<div class="desc">');
          t.html(this.lang.get('upload-change-label')), this.$preview.append(t);
          var e = {
            url: this.opts.imageUpload,
            element: this.$previewBox,
            name: 'imageedit',
            data: this.opts.imageData,
            paramName: this.opts.imageUploadParam,
          };
          this.app.api('module.upload.build', e);
        }
      },
    }),
    y.add('class', 'image.component', {
      mixins: ['dom', 'component'],
      init: function (t, e) {
        return (
          (this.app = t),
          (this.opts = t.opts),
          (this.selection = t.selection),
          e && void 0 !== e.cmnt ? e : this._init(e)
        );
      },
      setData: function (t) {
        for (var e in t) this._set(e, t[e]);
      },
      getData: function () {
        for (var t = ['src', 'title', 'caption', 'align', 'link', 'id'], e = {}, i = 0; i < t.length; i++)
          e[t[i]] = this._get(t[i]);
        return e;
      },
      getElement: function () {
        return this.$element;
      },
      changeImage: function (t) {
        this.$element.attr('src', t.url);
      },
      _init: function (t) {
        var e = y.dom(t),
          i = e.closest('figure');
        void 0 === t
          ? ((this.$element = y.dom('<img>')), this.parse('<figure>'), this.append(this.$element))
          : 0 === i.length
            ? (this.parse('<figure>'), (this.$element = e), this.$element.wrap(this))
            : (this.parse(i), (this.$element = this.find('img'))),
          this._initWrapper();
      },
      _set: function (t, e) {
        this['_set_' + t](e);
      },
      _get: function (t) {
        return this['_get_' + t]();
      },
      _set_src: function (t) {
        this.$element.attr('src', t);
      },
      _set_id: function (t) {
        this.opts.imageObserve && this.$element.attr('data-image', t);
      },
      _set_title: function (t) {
        '' === (t = t.trim().replace(/(<([^>]+)>)/gi, ''))
          ? this.$element.removeAttr('alt')
          : this.$element.attr('alt', t);
      },
      _set_caption: function (t) {
        var e = this.find('figcaption');
        return (
          0 === e.length && ((e = y.dom('<figcaption>')).attr('contenteditable', 'true'), this.append(e)),
          '' === t ? e.remove() : e.html(t),
          e
        );
      },
      _set_align: function (t) {
        var e = '',
          i = '',
          s = '',
          n = this,
          r = this.find('img'),
          o = this.find('figcaption');
        if ('object' == typeof this.opts.imagePosition) {
          var a = this.opts.imagePosition;
          for (var l in a) n.removeClass(a[l]);
          var h = void 0 !== a[t] && a[t];
          h && n.addClass(h);
        } else {
          var c = r.width();
          switch (t) {
            case 'left':
              (e = 'left'), (i = this.opts.imageFloatMargin);
              break;
            case 'right':
              (e = 'right'), (i = this.opts.imageFloatMargin);
              break;
            case 'center':
              (s = 'center'), (i = 'auto');
          }
          n.css({
            float: e,
            width: c + 'px',
            maxWidth: c + 'px',
            'margin-left': i,
            'margin-right': i,
            'text-align': s,
          }),
            n.attr('rel', n.attr('style')),
            'none' === t && (n.css('max-width', ''), n.css('width', '')),
            'center' === t
              ? (n.css('max-width', ''), n.css('width', ''), o.css('text-align', 'center'))
              : o.css('text-align', '');
        }
      },
      _set_link: function (t) {
        var e = this._findLink();
        if ('' !== t.url)
          return (
            e || ((e = y.dom('<a>')), this.$element.wrap(e)),
            e.attr('href', t.url),
            t.target ? e.attr('target', !0 === t.target ? '_blank' : t.target) : e.removeAttr('target'),
            e
          );
        e && e.unwrap();
      },
      _get_src: function () {
        return this.$element.attr('src');
      },
      _get_id: function () {
        return this.$element.attr('data-image');
      },
      _get_title: function () {
        var t = this.$element.attr('alt');
        return t || '';
      },
      _get_caption: function () {
        var t = this.find('figcaption');
        return 0 === t.length ? '' : t.html();
      },
      _get_align: function () {
        var t = '';
        if ('object' == typeof this.opts.imagePosition) {
          t = 'none';
          var e = this.opts.imagePosition;
          for (var i in e)
            if (this.hasClass(e[i])) {
              t = i;
              break;
            }
        } else t = 'center' === this.css('text-align') ? 'center' : this.css('float');
        return t;
      },
      _get_link: function () {
        var t = this._findLink();
        if (t) {
          var e = !!t.attr('target');
          return { url: t.attr('href'), target: e };
        }
      },
      _initWrapper: function () {
        this.addClass('redactor-component'),
          this.attr({ 'data-redactor-type': 'image', tabindex: '-1', contenteditable: !1 });
      },
      _findLink: function () {
        var t = this.find('a').filter(function (t) {
          return 0 === y.dom(t).closest('figcaption').length;
        });
        return 0 !== t.length && t;
      },
    }),
    y.add('class', 'image.resize', {
      init: function (t) {
        (this.app = t),
          (this.$doc = t.$doc),
          (this.$win = t.$win),
          (this.$body = t.$body),
          (this.editor = t.editor),
          (this.toolbar = t.toolbar),
          (this.inspector = t.inspector),
          (this.$target = this.toolbar.isTarget() ? this.toolbar.getTargetElement() : this.$body),
          this._init();
      },
      rebuild: function () {
        this._setResizerPosition();
      },
      hide: function () {
        this.$target.find('#redactor-image-resizer').remove();
      },
      stop: function () {
        this.editor.getElement().off('.redactor.image-resize'),
          this.$doc.off('.redactor.image-resize'),
          this.$win.off('resize.redactor.image-resize'),
          this.hide();
      },
      _init: function () {
        this.editor.getElement().on('click.redactor.image-resize', this._build.bind(this)),
          this.$win.on('resize.redactor.image-resize', this._setResizerPosition.bind(this));
      },
      _build: function (t) {
        if ((this.$target.find('#redactor-image-resizer').remove(), !this.app.isReadOnly())) {
          var e = this.inspector.parse(t.target),
            i = this.editor.getElement();
          e.isComponentType('image') &&
            ((this.$resizableBox = i),
            (this.$resizableImage = y.dom(e.getImageElement())),
            (this.$resizer = y.dom('<span>')),
            this.$resizer.attr('id', 'redactor-image-resizer'),
            this.$target.append(this.$resizer),
            this._setResizerPosition(),
            this.$resizer.on('mousedown touchstart', this._set.bind(this)));
        }
      },
      _setResizerPosition: function () {
        if (this.$resizer) {
          var t = this.toolbar.isTarget(),
            e = this.$target.offset(),
            i = t ? 7 - e.top + this.$target.scrollTop() : 7,
            s = t ? 7 - e.left : 7,
            n = this.$resizableImage.offset(),
            r = this.$resizableImage.width(),
            o = this.$resizableImage.height(),
            a = this.$resizer.width(),
            l = this.$resizer.height();
          this.$resizer.css({ top: Math.round(n.top + o - l + i) + 'px', left: Math.round(n.left + r - a + s) + 'px' });
        }
      },
      _set: function (t) {
        t.preventDefault(),
          (this.resizeHandle = {
            x: t.pageX,
            y: t.pageY,
            el: this.$resizableImage,
            $figure: this.$resizableImage.closest('figure'),
            ratio: this.$resizableImage.width() / this.$resizableImage.height(),
            h: this.$resizableImage.height(),
          }),
          (t = t.originalEvent || t).targetTouches &&
            ((this.resizeHandle.x = t.targetTouches[0].pageX), (this.resizeHandle.y = t.targetTouches[0].pageY)),
          this.app.broadcast('contextbar.close'),
          this.app.broadcast('image.resize', this.$resizableImage),
          this._start();
      },
      _start: function () {
        this.$doc.on('mousemove.redactor.image-resize touchmove.redactor.image-resize', this._move.bind(this)),
          this.$doc.on('mouseup.redactor.image-resize touchend.redactor.image-resize', this._stop.bind(this));
      },
      _stop: function () {
        this.$doc.off('.redactor.image-resize'), this.app.broadcast('image.resized', this.$resizableImage);
      },
      _move: function (t) {
        t.preventDefault(), (t = t.originalEvent || t);
        var e = this.resizeHandle.h;
        t.targetTouches ? (e += t.targetTouches[0].pageY - this.resizeHandle.y) : (e += t.pageY - this.resizeHandle.y);
        var i = e * this.resizeHandle.ratio;
        (i = Math.round(i)),
          (e = Math.round(e)) < 20 ||
            i < 100 ||
            this._getResizableBoxWidth() <= i ||
            (0 !== this.resizeHandle.$figure.length &&
              '' !== this.resizeHandle.$figure.css('max-width') &&
              this.resizeHandle.$figure.css({ width: i + 'px', 'max-width': i + 'px' }),
            this.resizeHandle.el.attr({ width: i, height: e }),
            this.resizeHandle.el.width(i),
            this.resizeHandle.el.css('max-width', i + 'px'),
            this.resizeHandle.el.height(e),
            this._setResizerPosition());
      },
      _getResizableBoxWidth: function () {
        return (
          this.$resizableBox.width() -
          parseInt(this.$resizableBox.css('padding-left')) -
          parseInt(this.$resizableBox.css('padding-right'))
        );
      },
    }),
    y.add('module', 'file', {
      modals: {
        file: '<div class="redactor-modal-tab" data-title="## upload ##"><form action="">                 <div class="form-item form-item-title">                     <label for="modal-file-title"> ## filename ## <span class="desc">(## optional ##)</span></label>                     <input type="text" id="modal-file-title" name="title" />                 </div>                 <input type="file" name="file">             </form></div>',
      },
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.lang = t.lang),
          (this.caret = t.caret),
          (this.utils = t.utils),
          (this.storage = t.storage),
          (this.component = t.component),
          (this.inspector = t.inspector),
          (this.insertion = t.insertion),
          (this.selection = t.selection);
      },
      onstarted: function () {
        this.storage.observeFiles();
      },
      ondropfile: function (t, e, i) {
        if (this.opts.fileUpload) {
          var s = { url: this.opts.fileUpload, event: !i && t, files: e, name: 'filedrop', data: this.opts.fileData };
          this.app.api('module.upload.send', s);
        }
      },
      onmodal: {
        file: {
          open: function (t, e) {
            this._setFormData(t, e), this._setUpload(e);
          },
          opened: function (t, e) {
            this._setFormFocus(e), (this.$form = e);
          },
        },
      },
      onupload: {
        file: {
          complete: function (t) {
            this._insert(t);
          },
          error: function (t) {
            this._uploadError(t);
          },
        },
        filedrop: {
          complete: function (t, e) {
            this._insert(t, e);
          },
          error: function (t) {
            this._uploadError(t);
          },
        },
      },
      open: function () {
        this._open();
      },
      insert: function (t) {
        this._insert(t);
      },
      remove: function (t) {
        this._remove(t);
      },
      _open: function () {
        this.app.api('module.modal.build', this._getModalData());
      },
      _getModalData: function () {
        return { name: 'file', title: this.lang.get('file') };
      },
      _insert: function (t, e) {
        if ((this.app.api('module.modal.close'), 'object' == typeof t)) {
          if (Array.isArray(t)) {
            for (var i = {}, s = 0; s < t.length; s++) i = y.extend(i, t[s]);
            t = i;
          }
          1 < Object.keys(t).length ? this._insertMultiple(t, e) : this._insertSingle(t, e), (this.$form = !1);
        }
      },
      _insertSingle: function (t, e) {
        var i = [];
        for (var s in t) {
          var n = this._createFileAndStore(t[s]);
          (i = this.opts.fileAttachment
            ? this._insertAsAttachment(n)
            : e
              ? this.insertion.insertToPoint(e, n)
              : this.insertion.insertRaw(n)),
            this.app.broadcast('file.uploaded', i[0], t);
        }
      },
      _insertMultiple: function (t, e) {
        var i,
          s = 0,
          n = [];
        for (var r in t) {
          s++;
          var o = this._createFileAndStore(t[r]);
          if (this.opts.fileAttachment) n = this._insertAsAttachment(o, t);
          else if (1 === s) n = e ? this.insertion.insertToPoint(e, o) : this.insertion.insertRaw(o);
          else y.dom(n[0]).after(o).after(' '), (n = [o.get()]), this.app.broadcast('file.inserted', o);
          (i = o), this.app.broadcast('file.uploaded', n[0], t);
        }
        this.opts.fileAttachment || this.caret.setAfter(i);
      },
      _insertAsAttachment: function (t, e) {
        var i = y.dom(this.opts.fileAttachment),
          s = t.wrapAttachment();
        i.append(s);
        var n = [s.get()];
        return this.app.broadcast('file.appended', n[0], e), n;
      },
      _createFileAndStore: function (t) {
        var e = !!this.$form && this.$form.getData(),
          i = t.name ? t.name : t.url,
          s = !this.opts.fileAttachment && e && '' !== e.title ? e.title : this._truncateUrl(i),
          n = this.component.create('file');
        return (
          n.attr('href', t.url),
          n.attr('data-file', t.id ? t.id : this.utils.getRandomId()),
          n.attr('data-name', t.name),
          n.html(s),
          this.storage.add('file', n),
          n
        );
      },
      _remove: function (t) {
        this.selection.save();
        var e = this.component.create('file', t);
        !1 !== this.app.broadcast('file.delete', e)
          ? (e.unwrap(), this.selection.restore(), this.app.broadcast('file.deleted', e))
          : this.selection.restore();
      },
      _truncateUrl: function (t) {
        return -1 !== t.search(/^http/) && 20 < t.length ? t.substring(0, 20) + '...' : t;
      },
      _setUpload: function (t) {
        var e = {
          url: this.opts.fileUpload,
          element: t.getField('file'),
          name: 'file',
          data: this.opts.fileData,
          paramName: this.opts.fileUploadParam,
        };
        this.app.api('module.upload.build', e);
      },
      _setFormData: function (t, e) {
        this.opts.fileAttachment ? t.find('.form-item-title').hide() : e.setData({ title: this.selection.getText() });
      },
      _setFormFocus: function (t) {
        t.getField('title').focus();
      },
      _uploadError: function (t) {
        this.app.broadcast('file.uploadError', t);
      },
    }),
    y.add('class', 'file.component', {
      mixins: ['dom', 'component'],
      init: function (t, e) {
        return (this.app = t), (this.opts = t.opts), e && void 0 !== e.cmnt ? e : this._init(e);
      },
      wrapAttachment: function () {
        return (
          (this.$wrapper = y.dom('<span class="redactor-file-item">')),
          (this.$remover = y.dom('<span class="redactor-file-remover">')),
          this.$remover.html('&times;'),
          this.$remover.on('click', this.removeAttachment.bind(this)),
          this.$wrapper.append(this),
          this.$wrapper.append(this.$remover),
          this.$wrapper
        );
      },
      removeAttachment: function (t) {
        t.preventDefault(),
          !1 !== this.app.broadcast('file.delete', this, this.$wrapper) &&
            (this.$wrapper.remove(),
            this.app.broadcast('file.deleted', this),
            this.app.broadcast('file.removeAttachment', this));
      },
      _init: function (t) {
        if (void 0 === t) this.parse('<a>');
        else {
          var e = y.dom(t).closest('a');
          this.parse(e);
        }
      },
    }),
    y.add('module', 'buffer', {
      init: function (t) {
        (this.app = t),
          (this.opts = t.opts),
          (this.editor = t.editor),
          (this.offset = t.offset),
          (this.keycodes = t.keycodes),
          (this.selection = t.selection),
          (this.state = !1),
          (this.passed = !1),
          (this.keyPressed = !1),
          (this.undoStorage = []),
          (this.redoStorage = []);
      },
      onkeydown: function (t) {
        this._listen(t);
      },
      onsyncing: function () {
        this.keyPressed || this.trigger(), (this.keyPressed = !1);
      },
      onbuffer: {
        trigger: function () {
          this.trigger();
        },
      },
      onstate: function (t, e, i) {
        (t && (t.ctrlKey || t.metaKey)) ||
          (t && (this._isUndo(t) || this._isRedo(t))) ||
          ((this.passed = !1), this._saveState(e, i), !1 === t && this._setUndo());
      },
      onenable: function () {
        this.clear();
      },
      clear: function () {
        (this.state = !1), (this.undoStorage = []), (this.redoStorage = []);
      },
      undo: function () {
        this._getUndo();
      },
      redo: function () {
        this._getRedo();
      },
      trigger: function () {
        this.state && !1 === this.passed && this._setUndo();
      },
      _saveState: function (t, e) {
        var i = this.editor.getElement();
        this.state = { html: t || i.html(), offset: e || this.offset.get() };
      },
      _listen: function (t) {
        var e = t.which,
          i = t.ctrlKey || t.metaKey,
          s = i || t.shiftKey || t.altKey,
          n = [
            this.keycodes.SPACE,
            this.keycodes.ENTER,
            this.keycodes.BACKSPACE,
            this.keycodes.DELETE,
            this.keycodes.TAB,
            this.keycodes.LEFT,
            this.keycodes.RIGHT,
            this.keycodes.UP,
            this.keycodes.DOWN,
          ];
        return this._isUndo(t)
          ? (t.preventDefault(), void this.undo())
          : this._isRedo(t)
            ? (t.preventDefault(), void this.redo())
            : (((i || -1 === n.indexOf(e)) && (!i || (88 !== e && 67 !== e))) || ((s = !0), this.trigger()),
              s || this._hasUndo() || this.trigger(),
              void (this.keyPressed = !0));
      },
      _isUndo: function (t) {
        var e = t.which;
        return (t.ctrlKey || t.metaKey) && 90 === e && !t.shiftKey && !t.altKey;
      },
      _isRedo: function (t) {
        var e = t.which;
        return (t.ctrlKey || t.metaKey) && ((90 === e && t.shiftKey) || (89 === e && !t.shiftKey)) && !t.altKey;
      },
      _setUndo: function () {
        var t = this.undoStorage[this.undoStorage.length - 1];
        (void 0 !== t && t[0] === this.state.html) ||
          (this.undoStorage.push([this.state.html, this.state.offset]), this._removeOverStorage());
      },
      _setRedo: function () {
        var t = this.editor.getElement(),
          e = this.offset.get(),
          i = t.html();
        this.redoStorage.push([i, e]), (this.redoStorage = this.redoStorage.slice(0, this.opts.bufferLimit));
      },
      _getUndo: function () {
        if (this._hasUndo()) {
          this.passed = !0;
          var t = this.editor.getElement(),
            e = this.undoStorage.pop();
          this._setRedo(),
            t.html(e[0]),
            this.offset.set(e[1]),
            this._saveState(e[0], e[1]),
            this.app.broadcast('undo', e[0], e[1]);
        }
      },
      _getRedo: function () {
        if (this._hasRedo()) {
          this.passed = !0;
          var t = this.editor.getElement(),
            e = this.redoStorage.pop();
          this._setUndo(),
            t.html(e[0]),
            this.offset.set(e[1]),
            this._saveState(e[0], e[1]),
            this.app.broadcast('redo', e[0], e[1]);
        }
      },
      _removeOverStorage: function () {
        this.undoStorage.length > this.opts.bufferLimit &&
          (this.undoStorage = this.undoStorage.slice(0, this.undoStorage.length - this.opts.bufferLimit));
      },
      _hasUndo: function () {
        return 0 !== this.undoStorage.length;
      },
      _hasRedo: function () {
        return 0 !== this.redoStorage.length;
      },
    }),
    y.add('module', 'list', {
      init: function (t) {
        (this.app = t),
          (this.uuid = t.uuid),
          (this.opts = t.opts),
          (this.utils = t.utils),
          (this.block = t.block),
          (this.editor = t.editor),
          (this.toolbar = t.toolbar),
          (this.inspector = t.inspector),
          (this.selection = t.selection);
      },
      onbutton: {
        list: {
          observe: function (t) {
            this._observeButton(t);
          },
        },
      },
      ondropdown: {
        list: {
          observe: function (t) {
            this._observeDropdown(t);
          },
        },
      },
      toggle: function (t) {
        var e = this._getBlocks(),
          i = this.selection.getBlock(),
          s = y.dom(i).parents('ul, ol', this.editor.getElement()).last();
        return (
          0 === e.length && 0 !== s.length && (e = [s.get()]),
          !i || ('TD' !== i.tagName && 'TH' !== i.tagName) || (e = this.block.format('div')),
          this.selection.saveMarkers(),
          (e = 0 !== e.length && this._isUnformat(t, e) ? this._unformat(t, e) : this._format(t, e)),
          this.selection.restoreMarkers(),
          e
        );
      },
      indent: function () {
        var t = this.selection.isCollapsed(),
          e = this.selection.getCurrent(),
          i = this.inspector.parse(e),
          s = !!i.isList() && i.getListItem(),
          n = y.dom(s),
          r = n.prevElement(),
          o = r.get();
        if (t && s && o && 'LI' === o.tagName) {
          this.selection.saveMarkers();
          var a = (r = y.dom(o)).children('ul, ol'),
            l = n.closest('ul, ol');
          if (0 !== a.length) a.append(n);
          else {
            var h = l.get().tagName.toLowerCase(),
              c = y.dom('<' + h + '>');
            c.append(n), r.append(c);
          }
          this.selection.restoreMarkers(), this.utils.isEmptyHtml(n.html()) && this.app.caret.setStart(n);
        }
      },
      outdent: function () {
        var t = this.selection.isCollapsed(),
          e = this.selection.getCurrent(),
          i = this.inspector.parse(e),
          s = !!i.isList() && i.getListItem(),
          n = y.dom(s);
        if (t && s) {
          var r,
            o,
            a,
            l = n.parent(),
            h = l.closest('li', '.redactor-in-' + this.uuid),
            c = n.prevElement(),
            d = n.nextElement(),
            u = c.get(),
            p = d.get(),
            f = !1 === u,
            m = !1 !== u && !1 !== p,
            g = !f && !1 === p;
          if ((this.selection.saveMarkers(), 0 !== h.length))
            if (m) {
              (r = this._getAllNext(n.get())), (a = y.dom('<' + l.get().tagName.toLowerCase() + '>'));
              for (var v = 0; v < r.length; v++) a.append(r[v]);
              h.after(n), n.append(a);
            } else h.after(n), 0 === l.children().length ? l.remove() : f && n.append(l);
          else {
            var b = this._createUnformatContainer(n),
              _ = b.find('ul, ol').first();
            if (f) l.before(b);
            else if (g) l.after(b);
            else if (m) {
              (a = y.dom('<' + l.get().tagName.toLowerCase() + '>')), (r = this._getAllNext(n.get()));
              for (v = 0; v < r.length; v++) a.append(r[v]);
              l.after(b), b.after(a);
            }
            0 !== _.length &&
              ((o = b.nextElement().get()) && o.tagName === l.get().tagName
                ? (y.dom(o).prepend(_), _.unwrap())
                : b.after(_)),
              n.remove();
          }
          this.selection.restoreMarkers();
        }
      },
      _getAllNext: function (t) {
        for (var e = []; t; ) {
          if (!(t = y.dom(t).nextElement().get())) return e;
          e.push(t);
        }
        return e;
      },
      _isUnformat: function (t, e) {
        for (var i = 0, s = 0; s < e.length; s++)
          if (3 !== e[s].nodeType) {
            var n = e[s].tagName.toLowerCase();
            (n !== t && 'figure' !== n) || i++;
          }
        return i === e.length;
      },
      _format: function (t, e) {
        var i = this._uniteBlocks(e, ['p', 'div', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol']),
          s = [];
        for (var n in i) {
          for (var r = i[n], o = this._createList(t, i[n]), a = 0; a < r.length; a++) {
            var l;
            if (3 === r[a].nodeType || ('UL' !== r[a].tagName && 'OL' !== r[a].tagName)) {
              var h = (l = this._createListItem(r[a])).get().lastChild;
              h && 'BR' === h.tagName && y.dom(h).remove(), this.utils.normalizeTextNodes(l), o.append(l);
            } else {
              var c = y.dom(r[a]);
              (l = c.contents()), o.append(l), this.utils.isEmpty(c) && c.remove();
            }
          }
          s.push(o.get());
        }
        return s;
      },
      _uniteBlocks: function (t, e) {
        for (var i = 0, s = { 0: [] }, n = !1, r = 0; r < t.length; r++) {
          var o = y.dom(t[r]).closest('th, td');
          0 !== o.length
            ? (o.get() !== n && (s[++i] = []), this._isUniteBlock(t[r], e) && s[i].push(t[r]))
            : this._isUniteBlock(t[r], e)
              ? s[i].push(t[r])
              : (s[++i] = []),
            (n = o.get());
        }
        return s;
      },
      _isUniteBlock: function (t, e) {
        return 3 === t.nodeType || -1 !== e.indexOf(t.tagName.toLowerCase());
      },
      _createList: function (t, e) {
        var i = e[e.length - 1],
          s = y.dom(i),
          n = y.dom('<' + t + '>');
        return s.after(n), n;
      },
      _createListItem: function (t) {
        var e = y.dom('<li>');
        if (3 === t.nodeType) e.append(t);
        else {
          var i = y.dom(t);
          e.append(i.contents()), i.remove();
        }
        return e;
      },
      _unformat: function (t, e) {
        if (1 === e.length) {
          var i = y.dom(e[0]),
            s = i.find('li'),
            n = this.selection.getNodes({ tags: ['li'] }),
            r = this.selection.getBlock(),
            o = y.dom(r).closest('li');
          if ((0 === n.length && 0 !== o.length && (n = [o.get()]), n.length === s.length))
            return this._unformatEntire(e[0]);
          var a = this._getItemsPosition(s, n);
          if ('Top' === a) return this._unformatAtSide('before', n, i);
          if ('Bottom' === a) return n.reverse(), this._unformatAtSide('after', n, i);
          if ('Middle' === a) {
            var l = y.dom(n[n.length - 1]),
              h = !1,
              c = !1,
              d = y.dom('<' + i.get().tagName.toLowerCase() + '>');
            s.each(function (t) {
              if (h) {
                var e = y.dom(t);
                0 !== e.closest('.redactor-split-item').length ||
                  (!1 !== c && 0 !== e.closest(c).length) ||
                  e.addClass('redactor-split-item'),
                  (c = e);
              }
              t === l.get() && (h = !0);
            }),
              s.filter('.redactor-split-item').each(function (t) {
                y.dom(t).removeClass('redactor-split-item'), d.append(t);
              }),
              i.after(d),
              n.reverse();
            for (var u = 0; u < n.length; u++) {
              var p = y.dom(n[u]),
                f = this._createUnformatContainer(p);
              i.after(f), f.find('ul, ol').remove(), p.remove();
            }
            return;
          }
        } else
          for (u = 0; u < e.length; u++)
            3 !== e[u].nodeType && e[u].tagName.toLowerCase() === t && this._unformatEntire(e[u]);
      },
      _unformatEntire: function (t) {
        var s = y.dom(t);
        s.find('li').each(
          function (t) {
            var e = y.dom(t),
              i = this._createUnformatContainer(e);
            e.remove(), s.before(i);
          }.bind(this)
        ),
          s.remove();
      },
      _unformatAtSide: function (t, s, e) {
        for (var n = 0; n < s.length; n++) {
          var i = y.dom(s[n]),
            r = this._createUnformatContainer(i);
          e[t](r);
          var o = r.find('ul, ol').first();
          i.append(o),
            o.each(function (t) {
              var e = y.dom(t),
                i = e.closest('li');
              i.get() === s[n] && (e.unwrap(), i.addClass('r-unwrapped'));
            }),
            this.utils.isEmptyHtml(i.html()) && i.remove();
        }
        e.find('.r-unwrapped').each(function (t) {
          var e = y.dom(t);
          '' === e.html().trim() ? e.remove() : e.removeClass('r-unwrapped');
        });
      },
      _getItemsPosition: function (t, e) {
        var i = 'Middle',
          s = e[0],
          n = e[e.length - 1],
          r = t.first().get(),
          o = t.last().get();
        return r === s && o !== n ? (i = 'Top') : r !== s && o === n && (i = 'Bottom'), i;
      },
      _createUnformatContainer: function (t) {
        var e = y.dom('<' + this.opts.markup + '>');
        return this.opts.breakline && e.attr('data-redactor-tag', 'br'), e.append(t.contents()), e;
      },
      _getBlocks: function () {
        return this.selection.getBlocks({ first: !0 });
      },
      _observeButton: function () {
        var t = this.selection.getCurrent(),
          e = this.inspector.parse(t),
          i = e.isPre() || e.isCode() || e.isFigcaption();
        this._observeButtonsList(i, ['lists', 'ul', 'ol', 'outdent', 'indent']);
        var s = this.toolbar.getButton('outdent'),
          n = this.toolbar.getButton('indent');
        this._observeIndent(n, s);
      },
      _observeDropdown: function (t) {
        var e = t.getItem('outdent'),
          i = t.getItem('indent');
        this._observeIndent(i, e);
      },
      _observeIndent: function (t, e) {
        var i = this.selection.isCollapsed(),
          s = this.selection.getCurrent(),
          n = this.inspector.parse(s),
          r = !!n.isList() && n.getListItem(),
          o = y.dom(r).prevElement().get(),
          a = i && r && o && 'LI' === o.tagName;
        e && (r && i ? e.enable() : e.disable()), t && (r && a ? t.enable() : t.disable());
      },
      _observeButtonsList: function (t, e) {
        for (var i = 0; i < e.length; i++) {
          var s = this.toolbar.getButton(e[i]);
          s && (t ? s.disable() : s.enable());
        }
      },
    }),
    y.add('class', 'video.component', {
      mixins: ['dom', 'component'],
      init: function (t, e) {
        return (this.app = t), e && void 0 !== e.cmnt ? e : this._init(e);
      },
      _init: function (t) {
        if (void 0 !== t) {
          var e = y.dom(t).closest('figure');
          0 !== e.length ? this.parse(e) : (this.parse('<figure>'), this.append(t));
        } else this.parse('<figure>');
        this._initWrapper();
      },
      _initWrapper: function () {
        this.addClass('redactor-component'),
          this.attr({ 'data-redactor-type': 'video', tabindex: '-1', contenteditable: !1 });
      },
    }),
    y.add('class', 'widget.component', {
      mixins: ['dom', 'component'],
      init: function (t, e) {
        return (this.app = t), e && void 0 !== e.cmnt ? e : this._init(e);
      },
      getData: function () {
        return { html: this._getHtml() };
      },
      _init: function (t) {
        if (void 0 !== t) {
          var e = y.dom(t).closest('figure');
          0 !== e.length ? this.parse(e) : (this.parse('<figure>'), this.html(t));
        } else this.parse('<figure>');
        this._initWrapper();
      },
      _getHtml: function () {
        var t = y.dom('<div>');
        return t.html(this.html()), t.find('.redactor-component-caret').remove(), t.html();
      },
      _initWrapper: function () {
        this.addClass('redactor-component'),
          this.attr({ 'data-redactor-type': 'widget', tabindex: '-1', contenteditable: !1 });
      },
    });
  var t = y;
  (window.Redactor = window.$R = y),
    window.addEventListener('load', function () {
      y('[data-redactor]');
    }),
    'object' == typeof module && module.exports && ((module.exports = t), (module.exports.Redactor = t));
})();
export default Redactor;
