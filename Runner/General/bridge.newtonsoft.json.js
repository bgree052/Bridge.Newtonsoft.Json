/*
 * @version   : 1.0.0 - A Bridge.NET implementation of Newtonsoft.Json
 * @author    : Object.NET, Inc. http://www.bridge.net/
 * @date      : 2017-02-02
 * @copyright : Copyright (c) 2008-2017, Object.NET, Inc. (http://www.object.net/). All rights reserved.
 * @license   : See license.txt and https://github.com/bridgedotnet/Bridge.NET/blob/master/LICENSE.
 */


// @source @generated.js

/**
 * @version 1.0.0
 * @author Object.NET, Inc.
 * @copyright Copyright 2008-2017 Object.NET, Inc.
 * @compiler Bridge.NET 16.0.0-beta
 */
Bridge.assembly("Bridge.Newtonsoft.Json", function ($asm, globals) {
    "use strict";

    Bridge.define("Bridge.Newtonsoft.Json.JsonSerializerSettings", {
        statics: {
            fields: {
                DefaultNullValueHandling: 0,
                DefaultTypeNameHandling: 0
            },
            ctors: {
                init: function () {
                    this.DefaultNullValueHandling = Bridge.Newtonsoft.Json.NullValueHandling.Include;
                    this.DefaultTypeNameHandling = Bridge.Newtonsoft.Json.TypeNameHandling.None;
                }
            }
        },
        fields: {
            _typeNameHandling: null,
            _nullValueHandling: null
        },
        props: {
            NullValueHandling: {
                get: function () {
                    var $t;
                    return ($t = this._nullValueHandling, $t != null ? $t : Bridge.Newtonsoft.Json.JsonSerializerSettings.DefaultNullValueHandling);
                },
                set: function (value) {
                    this._nullValueHandling = value;
                }
            },
            TypeNameHandling: {
                get: function () {
                    var $t;
                    return ($t = this._typeNameHandling, $t != null ? $t : Bridge.Newtonsoft.Json.JsonSerializerSettings.DefaultTypeNameHandling);
                },
                set: function (value) {
                    this._typeNameHandling = value;
                }
            },
            ContractResolver: null
        }
    });

    Bridge.define("Bridge.Newtonsoft.Json.NullValueHandling", {
        $kind: "enum",
        statics: {
            fields: {
                Include: 0,
                Ignore: 1
            }
        }
    });

    Bridge.define("Bridge.Newtonsoft.Json.Serialization.IContractResolver", {
        $kind: "interface"
    });

    Bridge.define("Bridge.Newtonsoft.Json.TypeNameHandling", {
        $kind: "enum",
        statics: {
            fields: {
                None: 0,
                Objects: 1,
                Arrays: 2,
                All: 3,
                Auto: 4
            }
        },
        $flags: true
    });

    Bridge.define("Bridge.Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver", {
        inherits: [Bridge.Newtonsoft.Json.Serialization.IContractResolver]
    });
});


// @source @JsonConvert.js

    Bridge.define("Bridge.Newtonsoft.Json.JsonConvert",
    {
        statics: {
            methods: {
                SerializeObject: function (obj, settings, returnRaw, possibleType) {
                    if (obj == null) {
                        if (settings && settings.NullValueHandling === Bridge.Newtonsoft.Json.NullValueHandling.Ignore) {
                            return;
                        }

                        return returnRaw ? null : JSON.stringify(null);
                    }

                    var objType = Bridge.getType(obj);

                    if (possibleType && objType) {
                        if (possibleType.$kind === "interface" || Bridge.Reflection.isAssignableFrom(possibleType, objType)) {
                            possibleType = null;
                        }
                    }

                    if (possibleType && Bridge.Reflection.isEnum(possibleType)) {
                        return System.Enum.toString(possibleType, obj);
                    }

                    if (possibleType && possibleType === System.Char) {
                        return String.fromCharCode(obj);
                    }

                    if (typeof obj === "function") {
                        var name = Bridge.getTypeName(obj);
                        return returnRaw ? name : JSON.stringify(name);
                    } else if (typeof obj === "object") {
                        var type = possibleType || objType,
                            arr,
                            i;

                        var removeGuard = Bridge.emptyFn;
                        if (!Bridge.$jsonGuard) {
                            Bridge.$jsonGuard = [];
                            removeGuard = function () {
                                delete Bridge.$jsonGuard;
                            };
                        }

                        if (Bridge.$jsonGuard.indexOf(obj) > -1) {
                            return;
                        }

                        if (type !== System.Guid &&
                            type !== System.Int64 &&
                            type !== System.UInt64 &&
                            type !== System.Decimal &&
                            type !== System.DateTime &&
                            type !== System.Char &&
                            !Bridge.Reflection.isEnum(type)) {
                            Bridge.$jsonGuard.push(obj);
                        } else {
                            removeGuard();
                        }

                        if (obj && obj.$boxed) {
                            obj = Bridge.unbox(obj, true);
                        }

                        if (type === System.Guid) {
                            return returnRaw ? obj.toString() : JSON.stringify(obj.toString());
                        } else if (type === System.Int64) {
                            return obj.toJSON();
                        } else if (type === System.UInt64) {
                            return obj.toJSON();
                        } else if (type === System.Decimal) {
                            return obj.toJSON();
                        } else if (type === System.DateTime) {
                            return returnRaw ? obj.toJSON() : JSON.stringify(obj);
                        } else if (Bridge.isArray(null, type)) {
                            if (type.$elementType === System.Byte) {
                                removeGuard();
                                var json = System.Convert.toBase64String(obj);
                                return returnRaw ? json : JSON.stringify(json);
                            }

                            arr = [];

                            for (i = 0; i < obj.length; i++) {
                                arr.push(Bridge.Newtonsoft.Json.JsonConvert.SerializeObject(obj[i], settings, true, type.$elementType));
                            }

                            obj = arr;
                        } else if (Bridge.Reflection.isEnum(type)) {
                            var name = System.Enum.toString(type, obj);
                            return returnRaw ? name : JSON.stringify(name);
                        } else if (type === System.Char) {
                            return returnRaw ? String.fromCharCode(obj) : JSON.stringify(String.fromCharCode(obj));
                        } else if (Bridge.Reflection.isAssignableFrom(System.Collections.IList, type)) {
                            var typeElement = System.Collections.Generic.List$1.getElementType(type),
                                count = System.Array.getCount(obj, type);

                            arr = [];

                            for (i = 0; i < count; i++) {
                                arr.push(Bridge.Newtonsoft.Json.JsonConvert.SerializeObject(System.Array.getItem(obj, i), settings, true, typeElement));
                            }

                            obj = arr;
                        } else if (Bridge.Reflection.isAssignableFrom(System.Collections.IDictionary, type)) {
                            var typesGeneric = System.Collections.Generic.Dictionary$2.getTypeParameters(type),
                                typeKey = typesGeneric[0],
                                typeValue = typesGeneric[1];

                            var dict = {},
                                enm = Bridge.getEnumerator(obj);

                            while (enm.moveNext()) {
                                var entr = enm.Current;
                                dict[Bridge.Newtonsoft.Json.JsonConvert.SerializeObject(entr.key, settings, true, typeKey)] = Bridge.Newtonsoft.Json.JsonConvert.SerializeObject(entr.value, settings, true, typeValue);
                            }

                            obj = dict;
                        } else {
                            var raw = {},
                                ignoreMetaData = type === System.Object || type === Object || type.$literal || type.$kind === "anonymous",
                                nometa = !Bridge.getMetadata(type);

                            if (!ignoreMetaData && nometa) {
                                throw new System.InvalidOperationException(Bridge.getTypeName(type) + " is not reflectable and cannot be serialized.");
                            }

                            if (settings && settings.TypeNameHandling) {
                                raw["$type"] = Bridge.Reflection.getTypeQName(type);
                            }

                            if (nometa) {
                                if (obj.toJSON) {
                                    raw = obj.toJSON();
                                } else {
                                    for (var key in obj) {
                                        if (obj.hasOwnProperty(key)) {
                                            raw[key] = Bridge.Newtonsoft.Json.JsonConvert.SerializeObject(obj[key], settings, true);
                                        }
                                    }
                                }
                            } else {
                                var fields = Bridge.Reflection.getMembers(type, 4, 20),
                                    camelCase = settings && Bridge.is(settings.ContractResolver, Bridge.Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver);

                                for (i = 0; i < fields.length; i++) {
                                    var f = fields[i],
                                        fname = camelCase ? (f.n.charAt(0).toLowerCase() + f.n.substr(1)) : f.n;
                                    raw[fname] = Bridge.Newtonsoft.Json.JsonConvert.SerializeObject(Bridge.Reflection.fieldAccess(f, obj), settings, true, f.rt);
                                }

                                var properties = Bridge.Reflection.getMembers(type, 16, 20);

                                for (i = 0; i < properties.length; i++) {
                                    var p = properties[i];
                                    if (!!p.g) {
                                        var pname = camelCase ? (p.n.charAt(0).toLowerCase() + p.n.substr(1)) : p.n;
                                        raw[pname] = Bridge.Newtonsoft.Json.JsonConvert.SerializeObject(Bridge.Reflection.midel(p.g, obj)(), settings, true, p.rt);
                                    }
                                }
                            }

                            obj = raw;
                        }

                        removeGuard();
                    }

                    return returnRaw ? obj : JSON.stringify(obj);
                },

                DeserializeObject: function (raw, type, settings, field) {
                    if (type.$kind === "interface") {
                        if (type === System.Collections.IList) {
                            type = System.Collections.Generic.List$1(System.Object);
                        } else if (Bridge.Reflection.isGenericType(type) && Bridge.Reflection.isAssignableFrom(System.Collections.Generic.IList$1, Bridge.Reflection.getGenericTypeDefinition(type))) {
                            type = System.Collections.Generic.List$1(System.Collections.Generic.List$1.getElementType(type) || System.Object);
                        } else if (System.Collections.IDictionary === type) {
                            type = System.Collections.Generic.Dictionary$2(System.Object, System.Object);
                        } else if (Bridge.Reflection.isGenericType(type) && Bridge.Reflection.isAssignableFrom(System.Collections.Generic.IDictionary$2, Bridge.Reflection.getGenericTypeDefinition(type))) {
                            var tPrms = System.Collections.Generic.Dictionary$2.getTypeParameters(type);
                            type = System.Collections.Generic.Dictionary$2(tPrms[0] || System.Object, tPrms[1] || System.Object);
                        }
                    }

                    if (!field && typeof raw === "string") {
                        var obj,
                            invalidJson = false;
                        try {
                            obj = JSON.parse(raw);
                        } catch (e) {
                            invalidJson = true;
                        }

                        if (!invalidJson && (typeof obj === "object" || Bridge.isArray(obj) || type === System.Array.type(System.Byte, 1) || type === Function || type === System.Guid || type === System.DateTime || type === System.Char || Bridge.Reflection.isEnum(type))) {
                            raw = obj;
                        }
                    }

                    var isObject = type === Object || type === System.Object;
                    if (isObject || type.$literal) {
                        return Bridge.merge(isObject ? {} : Bridge.createInstance(type), raw);
                    }

                    var def = Bridge.getDefaultValue(type);

                    if (raw === null) {
                        return def;
                    } else if (raw === false) {
                        if (type === System.String) {
                            return "false";
                        }
                        return def;
                    } else if (raw === true) {
                        if (type === System.Boolean) {
                            return true;
                        } else if (type === System.Int64) {
                            return System.Int64(1);
                        } else if (type === System.UInt64) {
                            return System.UInt64(1);
                        } else if (type === System.Decimal) {
                            return System.Decimal(1.0);
                        } else if (type === String.String) {
                            return "true";
                        } else if (type === System.DateTime) {
                            return new System.DateTime.fromTicks(1);
                        } else if (Bridge.Reflection.isEnum(type)) {
                            return Bridge.unbox(System.Enum.parse(type, 1));
                        } else {
                            if (typeof def === "number") {
                                return def + 1;
                            }

                            return null;
                        }
                    } else if (typeof raw === "number") {
                        if (type === System.Boolean) {
                            return raw !== 0;
                        } else if (Bridge.Reflection.isEnum(type)) {
                            return Bridge.unbox(System.Enum.parse(type, raw));
                        } else if (type === System.SByte) {
                            return raw | 0;
                        } else if (type === System.Byte) {
                            return raw >>> 0;
                        } else if (type === System.Int16) {
                            return raw | 0;
                        } else if (type === System.UInt16) {
                            return raw >>> 0;
                        } else if (type === System.Int32) {
                            return raw | 0;
                        } else if (type === System.UInt32) {
                            return raw >>> 0;
                        } else if (type === System.Int64) {
                            return System.Int64(raw);
                        } else if (type === System.UInt64) {
                            return System.UInt64(raw);
                        } else if (type === System.Single) {
                            return raw;
                        } else if (type === System.Double) {
                            return raw;
                        } else if (type === System.Decimal) {
                            return System.Decimal(raw);
                        } else if (type === System.Char) {
                            return raw | 0;
                        } else if (type === System.String) {
                            return raw.toString();
                        } else if (type === System.DateTime) {
                            return new System.DateTime.fromTicks(raw | 0);
                        } else {
                            return null;
                        }
                    } else if (typeof raw === "string") {
                        if (type === Function) {
                            return Bridge.Reflection.getType(raw);
                        } else if (type === System.Guid) {
                            return System.Guid.parse(raw);
                        } else if (type === System.Boolean) {
                            return raw !== "";
                        } else if (type === System.SByte) {
                            return raw | 0;
                        } else if (type === System.Byte) {
                            return raw >>> 0;
                        } else if (type === System.Int16) {
                            return raw | 0;
                        } else if (type === System.UInt16) {
                            return raw >>> 0;
                        } else if (type === System.Int32) {
                            return raw | 0;
                        } else if (type === System.UInt32) {
                            return raw >>> 0;
                        } else if (type === System.Int64) {
                            return System.Int64(raw);
                        } else if (type === System.UInt64) {
                            return System.UInt64(raw);
                        } else if (type === System.Single) {
                            return parseFloat(raw);
                        } else if (type === System.Double) {
                            return parseFloat(raw);
                        } else if (type === System.Decimal) {
                            try {
                                return System.Decimal(raw);
                            } catch (ex) {
                                return System.Decimal(0);
                            }
                        } else if (type === System.Char) {
                            if (raw.length === 0) {
                                return 0;
                            }

                            return raw.charCodeAt(0);
                        } else if (type === System.String) {
                            return field ? raw : JSON.parse(raw);
                        } else if (type === System.DateTime) {
                            return System.DateTime.parse(raw);
                        } else if (Bridge.Reflection.isEnum(type)) {
                            return Bridge.unbox(System.Enum.parse(type, raw));
                        } else if (type === System.Array.type(System.Byte, 1)) {
                            return System.Convert.fromBase64String(raw);
                        } else {
                            return null;
                        }
                    } else if (typeof raw === "object") {
                        if (def !== null && type.$kind !== "struct") {
                            return def;
                        } else if (Bridge.isArray(null, type)) {
                            if (raw.length === undefined) {
                                return [];
                            }

                            var arr = new Array();
                            System.Array.type(type.$elementType, type.$rank || 1, arr);

                            for (var i = 0; i < raw.length; i++) {
                                arr[i] = Bridge.Newtonsoft.Json.JsonConvert.DeserializeObject(raw[i], type.$elementType, settings, true);
                            }

                            return arr;
                        } else if (Bridge.Reflection.isAssignableFrom(System.Collections.IList, type)) {
                            var typeElement = System.Collections.Generic.List$1.getElementType(type) || System.Object;
                            var list = Bridge.createInstance(type);

                            if (raw.length === undefined) {
                                return list;
                            }

                            for (var i = 0; i < raw.length; i++) {
                                list.add(Bridge.Newtonsoft.Json.JsonConvert.DeserializeObject(raw[i], typeElement, settings, true));
                            }

                            return list;
                        } else if (Bridge.Reflection.isAssignableFrom(System.Collections.IDictionary, type)) {
                            var typesGeneric = System.Collections.Generic.Dictionary$2.getTypeParameters(type),
                                typeKey = typesGeneric[0] || System.Object,
                                typeValue = typesGeneric[1] || System.Object;

                            var dictionary = Bridge.createInstance(type);

                            for (var each in raw) {
                                if (raw.hasOwnProperty(each)) {
                                    dictionary.add(Bridge.Newtonsoft.Json.JsonConvert.DeserializeObject(each, typeKey, settings, true), Bridge.Newtonsoft.Json.JsonConvert.DeserializeObject(raw[each], typeValue, settings, true));
                                }
                            }

                            return dictionary;
                        } else {
                            if (settings && settings.TypeNameHandling > 0  && raw["$type"] != null) {
                                type = Bridge.Reflection.getType(raw["$type"].split(",")[0]);
                            }

                            if (type === null) {
                                throw TypeError(System.String.concat("Cannot find type: ", raw["$type"]));
                            }

                            var o = Bridge.createInstance(type);

                            var camelCase = settings && Bridge.is(settings.ContractResolver, Bridge.Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver),
                                fields = Bridge.Reflection.getMembers(type, 4, 20),
                                value,
                                f,
                                p,
                                mname,
                                i;

                            for (i = 0; i < fields.length; i++) {
                                f = fields[i];
                                mname = camelCase ? (f.n.charAt(0).toLowerCase() + f.n.substr(1)) : f.n;
                                value = raw[mname];

                                if (value !== undefined) {
                                    Bridge.Reflection.fieldAccess(f, o, Bridge.Newtonsoft.Json.JsonConvert.DeserializeObject(value, f.rt, settings, true));
                                }
                            }

                            var properties = Bridge.Reflection.getMembers(type, 16, 20);

                            for (i = 0; i < properties.length; i++) {
                                p = properties[i];
                                mname = camelCase ? (p.n.charAt(0).toLowerCase() + p.n.substr(1)) : p.n;
                                value = raw[mname];

                                if (value !== undefined) {
                                    if (!!p.s) {
                                        Bridge.Reflection.midel(p.s, o)(Bridge.Newtonsoft.Json.JsonConvert.DeserializeObject(value, p.rt, settings, true));
                                    }
                                    else if (type.$kind === "anonymous") {
                                        o[p.n] = Bridge.Newtonsoft.Json.JsonConvert.DeserializeObject(value, p.rt, settings, true);
                                    }
                                }
                            }

                            return o;
                        }
                    }
                }
            }
        }
    });