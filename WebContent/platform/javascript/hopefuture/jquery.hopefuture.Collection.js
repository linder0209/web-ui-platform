/*
 * 一个拥有数字下标（numeric indexes）和键值（key）的集合类
 * 参考ExtJs实现，Ext.util.MixedCollection去掉了部分功能
 * 该类依赖于jquery.hopefuture.js
 */
(function($, undefined) {
	/**
	 * javascript 集合类
	 * 
	 * @returns {$.hopefuture.platform.Collection}
	 */

	// collection
	$.everbridge.platform.Collection = function(keyFn) {
		this.items = [];
		this.map = {};
		this.keys = [];
		this.length = 0;
		if (keyFn) {
			this.getKey = keyFn;
		}
	};

	jQuery.extend($.everbridge.platform.Collection.prototype, {

		/**
		 * default return object id
		 */
		getKey : function(o) {
			return o.id;
		},

		/**
		 * add to a item
		 */
		add : function(key, o) {
			if (arguments.length == 1) {
				o = arguments[0];
				key = this.getKey(o);
			}
			if (typeof key != 'undefined' && key !== null) {
				var old = this.map[key];
				if (typeof old != 'undefined') {
					return this.replace(key, o);
				}
				this.map[key] = o;
			}
			this.length++;
			this.items.push(o);
			this.keys.push(key);
			return o;
		},

		replace : function(key, o) {
			if (arguments.length == 1) {
				o = arguments[0];
				key = this.getKey(o);
			}
			var old = this.map[key];
			if (typeof key == 'undefined' || key === null || typeof old == 'undefined') {
				return this.add(key, o);
			}
			var index = this.indexOfKey(key);
			this.items[index] = o;
			this.map[key] = o;
			return o;
		},

		addAll : function(objs) {
			if (arguments.length > 1 || Object.prototype.toString.apply(objs) === '[object Array]') {
				var args = arguments.length > 1 ? arguments : objs;
				for ( var i = 0, len = args.length; i < len; i++) {
					this.add(args[i]);
				}
			} else {
				for ( var key in objs) {
					this.add(key, objs[key]);
				}
			}
		},

		insert : function(index, key, o) {
			if (arguments.length == 2) {
				o = arguments[1];
				key = this.getKey(o);
			}
			if (this.containsKey(key)) {
				this.removeKey(key);
			}
			if (index >= this.length) {
				return this.add(key, o);
			}
			this.length++;
			this.items.splice(index, 0, o);
			if (typeof key != 'undefined' && key !== null) {
				this.map[key] = o;
			}
			this.keys.splice(index, 0, key);
			return o;
		},

		key : function(key) {
			return this.map[key];
		},

		item : function(key) {
			var mk = this.map[key], item = mk !== undefined ? mk : (typeof key == 'number') ? this.items[key]
					: undefined;
			return item;
		},

		itemAt : function(index) {
			return this.items[index];
		},

		removeAt : function(index) {
			if (index < this.length && index >= 0) {
				this.length--;
				var o = this.items[index];
				this.items.splice(index, 1);
				var key = this.keys[index];
				if (typeof key != 'undefined') {
					delete this.map[key];
				}
				this.keys.splice(index, 1);
				return o;
			}
			return false;
		},

		removeByKey : function(key) {
			return this.removeAt(this.indexOfKey(key));
		},

		removeAll : function() {
			this.length = 0;
			this.items = [];
			this.keys = [];
			this.map = {};
		},

		getCount : function() {
			return this.length;
		},

		contains : function(o) {
			return this.indexOf(o) != -1;
		},

		containsKey : function(key) {
			return typeof this.map[key] != 'undefined';
		},

		indexOfKey : function(key) {
			return this.keys.indexOf(key);
		},

		indexOf : function(o) {
			return this.items.indexOf(o);
		},

		each : function(fn, scope) {
			var items = [].concat(this.items); // each safe for removal to
			// clone array
			for ( var i = 0, len = items.length; i < len; i++) {
				if (fn.call(scope || items[i], items[i], i, len) === false) {
					break;
				}
			}
		},

		clone : function() {
			var r = new $.everbridge.platform.Collection();
			var k = this.keys, it = this.items;
			for ( var i = 0, len = it.length; i < len; i++) {
				r.add(k[i], it[i]);
			}
			r.getKey = this.getKey;
			return r;
		}
	});
	
})(jQuery);