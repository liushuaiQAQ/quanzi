
  /*
store(key, data);                 //单个存储字符串数据
store({key: data, key2: data2});  //批量存储多个字符串数据
store(key);                       //获取key的字符串数据
store();                          //获取所有key/data
//store(false);（弃用）          //因为传入空值 或者报错很容易清空库
store(key,false);                 //删除key包括key的字符串数据

store.set(key, data[, overwrite]);//=== store(key, data);
store.get(key[, alt]);            //=== store(key);
store.remove(key);                //===store(key,false)
store.clear();                    //清空所有key/data
store.keys();                     //返回所有key的数组
store.forEach(callback);          //循环遍历，返回false结束遍历

store.has(key);         //⇒判断是否存在返回true/false  火狐用不了,自己用get判断，chrome可以        

定时清除：
if (+new Date() > +new Date(2014, 11, 30)) {
    localStorage.removeItem("c");    //清除c的值
    // or localStorage.clear();
}
//⇒ 提供callback方法处理数据
store("test",function(arr){
    console.log(arr)//这里处理 通过test获取的数据
    return [3,4,5]//返回数据并存储
})

store(["key","key2"],function(arr){
    //获取多个key的数据处理，return 并保存；
    console.log("arr:",arr)
    return "逐个更改数据"
})
*/

(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }
        g.store = f();
    }
})
(function() {
    var define, module, exports;
    if (!window.localStorage) return;
    var storage = window.localStorage, store, _api, even_storage = function() {};
    function isJSON(obj) {
        return typeof obj === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
    }
    function stringify(val) {
        return val === undefined || typeof val === "function" ? val + "" : JSON.stringify(val);
    }
    function deserialize(value) {
        if (typeof value !== "string") {
            return undefined;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    }
    function isFunction(value) {
        return {}.toString.call(value) === "[object Function]";
    }
    function isArray(value) {
        return value instanceof Array;
    }
    function Store() {
        if (!(this instanceof Store)) {
            return new Store();
        }
    }
    Store.prototype = {		
        set: function(key, val) {
            even_storage("set", key, val);
            if (key && !isJSON(key)) {
                storage.setItem(key,stringify(val));
            } else if (key && isJSON(key) && !val) {
                for (var a in key) this.set(a,key[a]);
            }
            return this;
        },
        get: function(key) {
            if (!key) {
                var ret = {};
                this.forEach(function(key, val) {
                    ret[key] = val;
                });
                return ret;
            }
            return deserialize(storage.getItem(key));
        },
        clear: function() {
            this.forEach(function(key, val) {
                even_storage("clear", key, val);
            });
            storage.clear();
            return this;
        },
        remove: function(key) {
            var val = this.get(key);
            storage.removeItem(key);
            even_storage("remove", key, val);
            return val;
        },
        has: function(key) {
            return storage.hasOwnProperty(key);
        },
        keys: function() {
            var d = [];
            this.forEach(function(k, list) {
                d.push(k);
            });
            return d;
        },
        size: function() {
            return this.keys().length;
        },
        forEach: function(callback) {
            for (var i = 0; i < storage.length; i++) {
                var key = storage.key(i);
                if (callback(key, this.get(key)) === false) break;
            }
            return this;
        },
        search: function(str) {
            var arr = this.keys(), dt = {};
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].indexOf(str) > -1) dt[arr[i]] = this.get(arr[i]);
            }
            return dt;
        },
        onStorage: function(cb) {
            if (cb && isFunction(cb)) even_storage = cb;
            return this;
        }
    };
	
	
    store = function(key, data) {
        var argm = arguments, _Store = Store(), dt = null;
        if (argm.length === 0) return _Store.get();
        if (argm.length === 1) {
            if (typeof key === "string") return _Store.get(key);
            if (isJSON(key)) return _Store.set(key);
        }
        if (argm.length === 2 && typeof key === "string") {
            if (!data) return _Store.remove(key);
            if (data && typeof data === "string") return _Store.set(key, data);
            if (data && isFunction(data)) {
                dt = null;
                dt = data(key, _Store.get(key));
                return dt ? store.set(key, dt) : store;
            }
        }
        if (argm.length === 2 && isArray(key) && isFunction(data)) {
            for (var i = 0; i < key.length; i++) {
                dt = data(key[i], _Store.get(key[i]));
                store.set(key[i], dt);
            }
            return store;
        }
    };
    for (var a in Store.prototype) store[a] = Store.prototype[a];
    return store;
});