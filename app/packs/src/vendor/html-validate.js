var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// <define:process>
var define_process_default;
var init_define_process = __esm({
  "<define:process>"() {
    define_process_default = { env: { NODE_ENV: "production" } };
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a2;
        return (_a2 = this._str) !== null && _a2 !== void 0 ? _a2 : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a2;
        return (_a2 = this._names) !== null && _a2 !== void 0 ? _a2 : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate2(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate2(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify2(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify2;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState = exports.UsedValueState || (exports.UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a2, _b;
        if (((_b = (_a2 = this._parent) === null || _a2 === void 0 ? void 0 : _a2._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a2;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a2 = value.key) !== null && _a2 !== void 0 ? _a2 : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not2(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a2;
        this.else = (_a2 = this.else) === null || _a2 === void 0 ? void 0 : _a2.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a2, _b;
        super.optimizeNodes();
        (_a2 = this.catch) === null || _a2 === void 0 ? void 0 : _a2.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a2, _b;
        super.optimizeNames(names, constants);
        (_a2 = this.catch) === null || _a2 === void 0 ? void 0 : _a2.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not2(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not2;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema2) {
      if (typeof schema2 == "boolean")
        return schema2;
      if (Object.keys(schema2).length === 0)
        return true;
      checkUnknownRules(it, schema2);
      return !schemaHasRules(schema2, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema2 = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema2 === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema2) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema2, rules) {
      if (typeof schema2 == "boolean")
        return !schema2;
      for (const key in schema2)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema2, RULES) {
      if (typeof schema2 == "boolean")
        return !schema2;
      for (const key in schema2)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema2, keyword, $data) {
      if (!$data) {
        if (typeof schema2 == "number" || typeof schema2 == "boolean")
          return schema2;
        if (typeof schema2 == "string")
          return (0, codegen_1._)`${schema2}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type = exports.Type || (exports.Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      errors: new codegen_1.Name("errors"),
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema: schema2, validateName } = it;
      if (schema2 === false) {
        falseSchemaError(it, false);
      } else if (typeof schema2 == "object" && schema2.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema: schema2 } = it;
      if (schema2 === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema: schema2, self }, type2) {
      const group = self.RULES.types[type2];
      return group && group !== true && shouldUseGroup(schema2, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema2, group) {
      return group.rules.some((rule) => shouldUseRule(schema2, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema2, rule) {
      var _a2;
      return schema2[rule.keyword] !== void 0 || ((_a2 = rule.definition.implements) === null || _a2 === void 0 ? void 0 : _a2.some((kwd) => schema2[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType = exports.DataType || (exports.DataType = {}));
    function getSchemaTypes(schema2) {
      const types3 = getJSONTypes(schema2.type);
      const hasNull = types3.includes("null");
      if (hasNull) {
        if (schema2.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types3.length && schema2.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema2.nullable === true)
          types3.push("null");
      }
      return types3;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types3 = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types3.every(rules_1.isJSONType))
        return types3;
      throw new Error("type must be JSONType or JSONType[]: " + types3.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types3) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types3, opts.coerceTypes);
      const checkTypes = types3.length > 0 && !(coerceTo.length === 0 && types3.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types3[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types3, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types3, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types3, coerceTypes) {
      return coerceTypes ? types3.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types3, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types3, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types3 = (0, util_1.toHash)(dataTypes);
      if (types3.array && types3.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types3.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types3.null;
        delete types3.array;
        delete types3.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types3.number)
        delete types3.integer;
      for (const t in types3)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema: schema2 }) => `must be ${schema2}`,
      params: ({ schema: schema2, schemaValue }) => typeof schema2 == "string" ? (0, codegen_1._)`{type: ${schema2}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema: schema2 } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema2, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema2.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema2,
        params: {},
        it
      };
    }
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties: properties2, items } = it.schema;
      if (ty === "object" && properties2) {
        for (const key in properties2) {
          assignDefault(it, key, properties2[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue2) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue2 === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue2)}`);
    }
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties2, missing) {
      return (0, codegen_1.or)(...properties2.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema: schema2, keyword, it } = cxt;
      if (!Array.isArray(schema2))
        throw new Error("ajv implementation error");
      const alwaysValid = schema2.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema2.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema: schema2, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema2, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a2;
      const { gen, keyword, schema: schema2, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema2, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a3;
        gen.if((0, codegen_1.not)((_a3 = def.valid) !== null && _a3 !== void 0 ? _a3 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema2, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema2) : st === "object" ? schema2 && typeof schema2 == "object" && !Array.isArray(schema2) : typeof schema2 == st || allowUndefined && typeof schema2 == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema: schema2, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema2, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema2[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema: schema2, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema2 !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema2 !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema: schema2,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    init_define_process();
    module.exports = function equal(a, b) {
      if (a === b)
        return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor)
          return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length)
            return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i]))
              return false;
          return true;
        }
        if (a.constructor === RegExp)
          return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
          return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
          return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length)
          return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
            return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key]))
            return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/html-validate/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "node_modules/html-validate/node_modules/json-schema-traverse/index.js"(exports, module) {
    "use strict";
    init_define_process();
    var traverse = module.exports = function(schema2, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema2, "", schema2);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema2, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema2 && typeof schema2 == "object" && !Array.isArray(schema2)) {
        pre(schema2, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema2) {
          var sch = schema2[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema2, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema2, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema2);
          }
        }
        post(schema2, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema2, limit = true) {
      if (typeof schema2 == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema2);
      if (!limit)
        return false;
      return countKeys(schema2) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema2) {
      for (const key in schema2) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema2[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema2) {
      let count = 0;
      for (const key in schema2) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema2[key] == "object") {
          (0, util_1.eachItem)(schema2[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema2, baseId) {
      if (typeof schema2 == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema2[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema2, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let baseId2 = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          baseId2 = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = baseId2;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(baseId2 ? _resolve(baseId2, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema: schema2, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema2, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema2, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema: schema2, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema2.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema2, opts) {
      const schId = typeof schema2 == "object" && schema2[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema: schema2, self }) {
      if (typeof schema2 == "boolean")
        return !schema2;
      for (const key in schema2)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema: schema2, gen, opts } = it;
      if (opts.$comment && schema2.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types3 = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types3);
      schemaKeywords(it, types3, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema: schema2, errSchemaPath, opts, self } = it;
      if (schema2.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema2, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema: schema2, opts } = it;
      if (schema2.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema: schema2, errSchemaPath, opts }) {
      const msg = schema2.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types3, typeErrors, errsCount) {
      const { gen, schema: schema2, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema2.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema2, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types3);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema2, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types3.length === 1 && types3[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema: schema2, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema2, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types3) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types3);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types3);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types3) {
      if (!types3.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types3;
        return;
      }
      types3.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types3);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type: type2 } = rule.definition;
          if (type2.length && !type2.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type2.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a2;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema2;
        if (typeof env.schema == "object")
          schema2 = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a2 = env.baseId) !== null && _a2 !== void 0 ? _a2 : (0, resolve_1.normalizeId)(schema2 === null || schema2 === void 0 ? void 0 : schema2[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema2 === null || schema2 === void 0 ? void 0 : schema2.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a2;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === void 0) {
        const schema2 = (_a2 = root.localRefs) === null || _a2 === void 0 ? void 0 : _a2[ref];
        const { schemaId } = this.opts;
        if (schema2)
          _sch = new SchemaEnv({ schema: schema2, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema: schema2 } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema2[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema: schema2, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema: schema2, root }) {
      var _a2;
      if (((_a2 = parsedRef.fragment) === null || _a2 === void 0 ? void 0 : _a2[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema2 === "boolean")
          return;
        const partSchema = schema2[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema2 = partSchema;
        const schId = typeof schema2 === "object" && schema2[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema2 != "boolean" && schema2.$ref && !(0, util_1.schemaHasRulesButRef)(schema2, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema2.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema: schema2, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// node_modules/html-validate/node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// node_modules/uri-js/dist/es5/uri.all.js
var require_uri_all = __commonJS({
  "node_modules/uri-js/dist/es5/uri.all.js"(exports, module) {
    init_define_process();
    (function(global, factory2) {
      typeof exports === "object" && typeof module !== "undefined" ? factory2(exports) : typeof define === "function" && define.amd ? define(["exports"], factory2) : factory2(global.URI = global.URI || {});
    })(exports, function(exports2) {
      "use strict";
      function merge() {
        for (var _len = arguments.length, sets = Array(_len), _key = 0; _key < _len; _key++) {
          sets[_key] = arguments[_key];
        }
        if (sets.length > 1) {
          sets[0] = sets[0].slice(0, -1);
          var xl = sets.length - 1;
          for (var x = 1; x < xl; ++x) {
            sets[x] = sets[x].slice(1, -1);
          }
          sets[xl] = sets[xl].slice(1);
          return sets.join("");
        } else {
          return sets[0];
        }
      }
      function subexp(str) {
        return "(?:" + str + ")";
      }
      function typeOf(o) {
        return o === void 0 ? "undefined" : o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase();
      }
      function toUpperCase(str) {
        return str.toUpperCase();
      }
      function toArray2(obj) {
        return obj !== void 0 && obj !== null ? obj instanceof Array ? obj : typeof obj.length !== "number" || obj.split || obj.setInterval || obj.call ? [obj] : Array.prototype.slice.call(obj) : [];
      }
      function assign(target, source) {
        var obj = target;
        if (source) {
          for (var key in source) {
            obj[key] = source[key];
          }
        }
        return obj;
      }
      function buildExps(isIRI2) {
        var ALPHA$$ = "[A-Za-z]", CR$ = "[\\x0D]", DIGIT$$ = "[0-9]", DQUOTE$$ = "[\\x22]", HEXDIG$$2 = merge(DIGIT$$, "[A-Fa-f]"), LF$$ = "[\\x0A]", SP$$ = "[\\x20]", PCT_ENCODED$2 = subexp(subexp("%[EFef]" + HEXDIG$$2 + "%" + HEXDIG$$2 + HEXDIG$$2 + "%" + HEXDIG$$2 + HEXDIG$$2) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$2 + "%" + HEXDIG$$2 + HEXDIG$$2) + "|" + subexp("%" + HEXDIG$$2 + HEXDIG$$2)), GEN_DELIMS$$ = "[\\:\\/\\?\\#\\[\\]\\@]", SUB_DELIMS$$ = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", RESERVED$$ = merge(GEN_DELIMS$$, SUB_DELIMS$$), UCSCHAR$$ = isIRI2 ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", IPRIVATE$$ = isIRI2 ? "[\\uE000-\\uF8FF]" : "[]", UNRESERVED$$2 = merge(ALPHA$$, DIGIT$$, "[\\-\\.\\_\\~]", UCSCHAR$$), SCHEME$ = subexp(ALPHA$$ + merge(ALPHA$$, DIGIT$$, "[\\+\\-\\.]") + "*"), USERINFO$ = subexp(subexp(PCT_ENCODED$2 + "|" + merge(UNRESERVED$$2, SUB_DELIMS$$, "[\\:]")) + "*"), DEC_OCTET$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("[1-9]" + DIGIT$$) + "|" + DIGIT$$), DEC_OCTET_RELAXED$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("0?[1-9]" + DIGIT$$) + "|0?0?" + DIGIT$$), IPV4ADDRESS$ = subexp(DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$), H16$ = subexp(HEXDIG$$2 + "{1,4}"), LS32$ = subexp(subexp(H16$ + "\\:" + H16$) + "|" + IPV4ADDRESS$), IPV6ADDRESS1$ = subexp(subexp(H16$ + "\\:") + "{6}" + LS32$), IPV6ADDRESS2$ = subexp("\\:\\:" + subexp(H16$ + "\\:") + "{5}" + LS32$), IPV6ADDRESS3$ = subexp(subexp(H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{4}" + LS32$), IPV6ADDRESS4$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,1}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{3}" + LS32$), IPV6ADDRESS5$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,2}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{2}" + LS32$), IPV6ADDRESS6$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,3}" + H16$) + "?\\:\\:" + H16$ + "\\:" + LS32$), IPV6ADDRESS7$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,4}" + H16$) + "?\\:\\:" + LS32$), IPV6ADDRESS8$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,5}" + H16$) + "?\\:\\:" + H16$), IPV6ADDRESS9$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,6}" + H16$) + "?\\:\\:"), IPV6ADDRESS$ = subexp([IPV6ADDRESS1$, IPV6ADDRESS2$, IPV6ADDRESS3$, IPV6ADDRESS4$, IPV6ADDRESS5$, IPV6ADDRESS6$, IPV6ADDRESS7$, IPV6ADDRESS8$, IPV6ADDRESS9$].join("|")), ZONEID$ = subexp(subexp(UNRESERVED$$2 + "|" + PCT_ENCODED$2) + "+"), IPV6ADDRZ$ = subexp(IPV6ADDRESS$ + "\\%25" + ZONEID$), IPV6ADDRZ_RELAXED$ = subexp(IPV6ADDRESS$ + subexp("\\%25|\\%(?!" + HEXDIG$$2 + "{2})") + ZONEID$), IPVFUTURE$ = subexp("[vV]" + HEXDIG$$2 + "+\\." + merge(UNRESERVED$$2, SUB_DELIMS$$, "[\\:]") + "+"), IP_LITERAL$ = subexp("\\[" + subexp(IPV6ADDRZ_RELAXED$ + "|" + IPV6ADDRESS$ + "|" + IPVFUTURE$) + "\\]"), REG_NAME$ = subexp(subexp(PCT_ENCODED$2 + "|" + merge(UNRESERVED$$2, SUB_DELIMS$$)) + "*"), HOST$ = subexp(IP_LITERAL$ + "|" + IPV4ADDRESS$ + "(?!" + REG_NAME$ + ")|" + REG_NAME$), PORT$ = subexp(DIGIT$$ + "*"), AUTHORITY$ = subexp(subexp(USERINFO$ + "@") + "?" + HOST$ + subexp("\\:" + PORT$) + "?"), PCHAR$ = subexp(PCT_ENCODED$2 + "|" + merge(UNRESERVED$$2, SUB_DELIMS$$, "[\\:\\@]")), SEGMENT$ = subexp(PCHAR$ + "*"), SEGMENT_NZ$ = subexp(PCHAR$ + "+"), SEGMENT_NZ_NC$ = subexp(subexp(PCT_ENCODED$2 + "|" + merge(UNRESERVED$$2, SUB_DELIMS$$, "[\\@]")) + "+"), PATH_ABEMPTY$ = subexp(subexp("\\/" + SEGMENT$) + "*"), PATH_ABSOLUTE$ = subexp("\\/" + subexp(SEGMENT_NZ$ + PATH_ABEMPTY$) + "?"), PATH_NOSCHEME$ = subexp(SEGMENT_NZ_NC$ + PATH_ABEMPTY$), PATH_ROOTLESS$ = subexp(SEGMENT_NZ$ + PATH_ABEMPTY$), PATH_EMPTY$ = "(?!" + PCHAR$ + ")", PATH$ = subexp(PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$), QUERY$ = subexp(subexp(PCHAR$ + "|" + merge("[\\/\\?]", IPRIVATE$$)) + "*"), FRAGMENT$ = subexp(subexp(PCHAR$ + "|[\\/\\?]") + "*"), HIER_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$), URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"), RELATIVE_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$), RELATIVE$ = subexp(RELATIVE_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"), URI_REFERENCE$ = subexp(URI$ + "|" + RELATIVE$), ABSOLUTE_URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?"), GENERIC_REF$ = "^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$", RELATIVE_REF$ = "^(){0}" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$", ABSOLUTE_REF$ = "^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?$", SAMEDOC_REF$ = "^" + subexp("\\#(" + FRAGMENT$ + ")") + "?$", AUTHORITY_REF$ = "^" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?$";
        return {
          NOT_SCHEME: new RegExp(merge("[^]", ALPHA$$, DIGIT$$, "[\\+\\-\\.]"), "g"),
          NOT_USERINFO: new RegExp(merge("[^\\%\\:]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          NOT_HOST: new RegExp(merge("[^\\%\\[\\]\\:]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          NOT_PATH: new RegExp(merge("[^\\%\\/\\:\\@]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          NOT_PATH_NOSCHEME: new RegExp(merge("[^\\%\\/\\@]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          NOT_QUERY: new RegExp(merge("[^\\%]", UNRESERVED$$2, SUB_DELIMS$$, "[\\:\\@\\/\\?]", IPRIVATE$$), "g"),
          NOT_FRAGMENT: new RegExp(merge("[^\\%]", UNRESERVED$$2, SUB_DELIMS$$, "[\\:\\@\\/\\?]"), "g"),
          ESCAPE: new RegExp(merge("[^]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          UNRESERVED: new RegExp(UNRESERVED$$2, "g"),
          OTHER_CHARS: new RegExp(merge("[^\\%]", UNRESERVED$$2, RESERVED$$), "g"),
          PCT_ENCODED: new RegExp(PCT_ENCODED$2, "g"),
          IPV4ADDRESS: new RegExp("^(" + IPV4ADDRESS$ + ")$"),
          IPV6ADDRESS: new RegExp("^\\[?(" + IPV6ADDRESS$ + ")" + subexp(subexp("\\%25|\\%(?!" + HEXDIG$$2 + "{2})") + "(" + ZONEID$ + ")") + "?\\]?$")
          //RFC 6874, with relaxed parsing rules
        };
      }
      var URI_PROTOCOL = buildExps(false);
      var IRI_PROTOCOL = buildExps(true);
      var slicedToArray = /* @__PURE__ */ function() {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = void 0;
          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);
              if (i && _arr.length === i)
                break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"])
                _i["return"]();
            } finally {
              if (_d)
                throw _e;
            }
          }
          return _arr;
        }
        return function(arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();
      var toConsumableArray = function(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i];
          return arr2;
        } else {
          return Array.from(arr);
        }
      };
      var maxInt = 2147483647;
      var base = 36;
      var tMin = 1;
      var tMax = 26;
      var skew = 38;
      var damp = 700;
      var initialBias = 72;
      var initialN = 128;
      var delimiter = "-";
      var regexPunycode = /^xn--/;
      var regexNonASCII = /[^\0-\x7E]/;
      var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
      var errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      };
      var baseMinusTMin = base - tMin;
      var floor = Math.floor;
      var stringFromCharCode = String.fromCharCode;
      function error$1(type2) {
        throw new RangeError(errors[type2]);
      }
      function map(array, fn) {
        var result = [];
        var length = array.length;
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      function mapDomain(string, fn) {
        var parts = string.split("@");
        var result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          string = parts[1];
        }
        string = string.replace(regexSeparators, ".");
        var labels = string.split(".");
        var encoded = map(labels, fn).join(".");
        return result + encoded;
      }
      function ucs2decode(string) {
        var output = [];
        var counter2 = 0;
        var length = string.length;
        while (counter2 < length) {
          var value = string.charCodeAt(counter2++);
          if (value >= 55296 && value <= 56319 && counter2 < length) {
            var extra = string.charCodeAt(counter2++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter2--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      var ucs2encode = function ucs2encode2(array) {
        return String.fromCodePoint.apply(String, toConsumableArray(array));
      };
      var basicToDigit = function basicToDigit2(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      };
      var digitToBasic = function digitToBasic2(digit, flag2) {
        return digit + 22 + 75 * (digit < 26) - ((flag2 != 0) << 5);
      };
      var adapt = function adapt2(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (
          ;
          /* no initialization */
          delta > baseMinusTMin * tMax >> 1;
          k += base
        ) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      };
      var decode = function decode2(input) {
        var output = [];
        var inputLength = input.length;
        var i = 0;
        var n = initialN;
        var bias = initialBias;
        var basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (var j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error$1("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (var index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          var oldi = i;
          for (
            var w = 1, k = base;
            ;
            /* no condition */
            k += base
          ) {
            if (index >= inputLength) {
              error$1("invalid-input");
            }
            var digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i) / w)) {
              error$1("overflow");
            }
            i += digit * w;
            var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            var baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error$1("overflow");
            }
            w *= baseMinusT;
          }
          var out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);
          if (floor(i / out) > maxInt - n) {
            error$1("overflow");
          }
          n += floor(i / out);
          i %= out;
          output.splice(i++, 0, n);
        }
        return String.fromCodePoint.apply(String, output);
      };
      var encode = function encode2(input) {
        var output = [];
        input = ucs2decode(input);
        var inputLength = input.length;
        var n = initialN;
        var delta = 0;
        var bias = initialBias;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = void 0;
        try {
          for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _currentValue2 = _step.value;
            if (_currentValue2 < 128) {
              output.push(stringFromCharCode(_currentValue2));
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
        var basicLength = output.length;
        var handledCPCount = basicLength;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          var m = maxInt;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = void 0;
          try {
            for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var currentValue = _step2.value;
              if (currentValue >= n && currentValue < m) {
                m = currentValue;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
          var handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error$1("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = void 0;
          try {
            for (var _iterator3 = input[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _currentValue = _step3.value;
              if (_currentValue < n && ++delta > maxInt) {
                error$1("overflow");
              }
              if (_currentValue == n) {
                var q = delta;
                for (
                  var k = base;
                  ;
                  /* no condition */
                  k += base
                ) {
                  var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                  if (q < t) {
                    break;
                  }
                  var qMinusT = q - t;
                  var baseMinusT = base - t;
                  output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                  q = floor(qMinusT / baseMinusT);
                }
                output.push(stringFromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                delta = 0;
                ++handledCPCount;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      };
      var toUnicode = function toUnicode2(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      };
      var toASCII = function toASCII2(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
        });
      };
      var punycode = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        "version": "2.1.0",
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      var SCHEMES = {};
      function pctEncChar(chr) {
        var c = chr.charCodeAt(0);
        var e = void 0;
        if (c < 16)
          e = "%0" + c.toString(16).toUpperCase();
        else if (c < 128)
          e = "%" + c.toString(16).toUpperCase();
        else if (c < 2048)
          e = "%" + (c >> 6 | 192).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase();
        else
          e = "%" + (c >> 12 | 224).toString(16).toUpperCase() + "%" + (c >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase();
        return e;
      }
      function pctDecChars(str) {
        var newStr = "";
        var i = 0;
        var il = str.length;
        while (i < il) {
          var c = parseInt(str.substr(i + 1, 2), 16);
          if (c < 128) {
            newStr += String.fromCharCode(c);
            i += 3;
          } else if (c >= 194 && c < 224) {
            if (il - i >= 6) {
              var c2 = parseInt(str.substr(i + 4, 2), 16);
              newStr += String.fromCharCode((c & 31) << 6 | c2 & 63);
            } else {
              newStr += str.substr(i, 6);
            }
            i += 6;
          } else if (c >= 224) {
            if (il - i >= 9) {
              var _c = parseInt(str.substr(i + 4, 2), 16);
              var c3 = parseInt(str.substr(i + 7, 2), 16);
              newStr += String.fromCharCode((c & 15) << 12 | (_c & 63) << 6 | c3 & 63);
            } else {
              newStr += str.substr(i, 9);
            }
            i += 9;
          } else {
            newStr += str.substr(i, 3);
            i += 3;
          }
        }
        return newStr;
      }
      function _normalizeComponentEncoding(components, protocol) {
        function decodeUnreserved2(str) {
          var decStr = pctDecChars(str);
          return !decStr.match(protocol.UNRESERVED) ? str : decStr;
        }
        if (components.scheme)
          components.scheme = String(components.scheme).replace(protocol.PCT_ENCODED, decodeUnreserved2).toLowerCase().replace(protocol.NOT_SCHEME, "");
        if (components.userinfo !== void 0)
          components.userinfo = String(components.userinfo).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(protocol.NOT_USERINFO, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        if (components.host !== void 0)
          components.host = String(components.host).replace(protocol.PCT_ENCODED, decodeUnreserved2).toLowerCase().replace(protocol.NOT_HOST, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        if (components.path !== void 0)
          components.path = String(components.path).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(components.scheme ? protocol.NOT_PATH : protocol.NOT_PATH_NOSCHEME, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        if (components.query !== void 0)
          components.query = String(components.query).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(protocol.NOT_QUERY, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        if (components.fragment !== void 0)
          components.fragment = String(components.fragment).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(protocol.NOT_FRAGMENT, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        return components;
      }
      function _stripLeadingZeros(str) {
        return str.replace(/^0*(.*)/, "$1") || "0";
      }
      function _normalizeIPv4(host, protocol) {
        var matches = host.match(protocol.IPV4ADDRESS) || [];
        var _matches = slicedToArray(matches, 2), address = _matches[1];
        if (address) {
          return address.split(".").map(_stripLeadingZeros).join(".");
        } else {
          return host;
        }
      }
      function _normalizeIPv6(host, protocol) {
        var matches = host.match(protocol.IPV6ADDRESS) || [];
        var _matches2 = slicedToArray(matches, 3), address = _matches2[1], zone = _matches2[2];
        if (address) {
          var _address$toLowerCase$ = address.toLowerCase().split("::").reverse(), _address$toLowerCase$2 = slicedToArray(_address$toLowerCase$, 2), last = _address$toLowerCase$2[0], first = _address$toLowerCase$2[1];
          var firstFields = first ? first.split(":").map(_stripLeadingZeros) : [];
          var lastFields = last.split(":").map(_stripLeadingZeros);
          var isLastFieldIPv4Address = protocol.IPV4ADDRESS.test(lastFields[lastFields.length - 1]);
          var fieldCount = isLastFieldIPv4Address ? 7 : 8;
          var lastFieldsStart = lastFields.length - fieldCount;
          var fields = Array(fieldCount);
          for (var x = 0; x < fieldCount; ++x) {
            fields[x] = firstFields[x] || lastFields[lastFieldsStart + x] || "";
          }
          if (isLastFieldIPv4Address) {
            fields[fieldCount - 1] = _normalizeIPv4(fields[fieldCount - 1], protocol);
          }
          var allZeroFields = fields.reduce(function(acc, field, index) {
            if (!field || field === "0") {
              var lastLongest = acc[acc.length - 1];
              if (lastLongest && lastLongest.index + lastLongest.length === index) {
                lastLongest.length++;
              } else {
                acc.push({ index, length: 1 });
              }
            }
            return acc;
          }, []);
          var longestZeroFields = allZeroFields.sort(function(a, b) {
            return b.length - a.length;
          })[0];
          var newHost = void 0;
          if (longestZeroFields && longestZeroFields.length > 1) {
            var newFirst = fields.slice(0, longestZeroFields.index);
            var newLast = fields.slice(longestZeroFields.index + longestZeroFields.length);
            newHost = newFirst.join(":") + "::" + newLast.join(":");
          } else {
            newHost = fields.join(":");
          }
          if (zone) {
            newHost += "%" + zone;
          }
          return newHost;
        } else {
          return host;
        }
      }
      var URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i;
      var NO_MATCH_IS_UNDEFINED = "".match(/(){0}/)[1] === void 0;
      function parse3(uriString) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var components = {};
        var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
        if (options.reference === "suffix")
          uriString = (options.scheme ? options.scheme + ":" : "") + "//" + uriString;
        var matches = uriString.match(URI_PARSE);
        if (matches) {
          if (NO_MATCH_IS_UNDEFINED) {
            components.scheme = matches[1];
            components.userinfo = matches[3];
            components.host = matches[4];
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = matches[7];
            components.fragment = matches[8];
            if (isNaN(components.port)) {
              components.port = matches[5];
            }
          } else {
            components.scheme = matches[1] || void 0;
            components.userinfo = uriString.indexOf("@") !== -1 ? matches[3] : void 0;
            components.host = uriString.indexOf("//") !== -1 ? matches[4] : void 0;
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = uriString.indexOf("?") !== -1 ? matches[7] : void 0;
            components.fragment = uriString.indexOf("#") !== -1 ? matches[8] : void 0;
            if (isNaN(components.port)) {
              components.port = uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? matches[4] : void 0;
            }
          }
          if (components.host) {
            components.host = _normalizeIPv6(_normalizeIPv4(components.host, protocol), protocol);
          }
          if (components.scheme === void 0 && components.userinfo === void 0 && components.host === void 0 && components.port === void 0 && !components.path && components.query === void 0) {
            components.reference = "same-document";
          } else if (components.scheme === void 0) {
            components.reference = "relative";
          } else if (components.fragment === void 0) {
            components.reference = "absolute";
          } else {
            components.reference = "uri";
          }
          if (options.reference && options.reference !== "suffix" && options.reference !== components.reference) {
            components.error = components.error || "URI is not a " + options.reference + " reference.";
          }
          var schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
          if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
            if (components.host && (options.domainHost || schemeHandler && schemeHandler.domainHost)) {
              try {
                components.host = punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase());
              } catch (e) {
                components.error = components.error || "Host's domain name can not be converted to ASCII via punycode: " + e;
              }
            }
            _normalizeComponentEncoding(components, URI_PROTOCOL);
          } else {
            _normalizeComponentEncoding(components, protocol);
          }
          if (schemeHandler && schemeHandler.parse) {
            schemeHandler.parse(components, options);
          }
        } else {
          components.error = components.error || "URI can not be parsed.";
        }
        return components;
      }
      function _recomposeAuthority(components, options) {
        var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
        var uriTokens = [];
        if (components.userinfo !== void 0) {
          uriTokens.push(components.userinfo);
          uriTokens.push("@");
        }
        if (components.host !== void 0) {
          uriTokens.push(_normalizeIPv6(_normalizeIPv4(String(components.host), protocol), protocol).replace(protocol.IPV6ADDRESS, function(_, $1, $2) {
            return "[" + $1 + ($2 ? "%25" + $2 : "") + "]";
          }));
        }
        if (typeof components.port === "number" || typeof components.port === "string") {
          uriTokens.push(":");
          uriTokens.push(String(components.port));
        }
        return uriTokens.length ? uriTokens.join("") : void 0;
      }
      var RDS1 = /^\.\.?\//;
      var RDS2 = /^\/\.(\/|$)/;
      var RDS3 = /^\/\.\.(\/|$)/;
      var RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/;
      function removeDotSegments(input) {
        var output = [];
        while (input.length) {
          if (input.match(RDS1)) {
            input = input.replace(RDS1, "");
          } else if (input.match(RDS2)) {
            input = input.replace(RDS2, "/");
          } else if (input.match(RDS3)) {
            input = input.replace(RDS3, "/");
            output.pop();
          } else if (input === "." || input === "..") {
            input = "";
          } else {
            var im = input.match(RDS5);
            if (im) {
              var s = im[0];
              input = input.slice(s.length);
              output.push(s);
            } else {
              throw new Error("Unexpected dot segment condition");
            }
          }
        }
        return output.join("");
      }
      function serialize(components) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var protocol = options.iri ? IRI_PROTOCOL : URI_PROTOCOL;
        var uriTokens = [];
        var schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
        if (schemeHandler && schemeHandler.serialize)
          schemeHandler.serialize(components, options);
        if (components.host) {
          if (protocol.IPV6ADDRESS.test(components.host)) {
          } else if (options.domainHost || schemeHandler && schemeHandler.domainHost) {
            try {
              components.host = !options.iri ? punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase()) : punycode.toUnicode(components.host);
            } catch (e) {
              components.error = components.error || "Host's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
            }
          }
        }
        _normalizeComponentEncoding(components, protocol);
        if (options.reference !== "suffix" && components.scheme) {
          uriTokens.push(components.scheme);
          uriTokens.push(":");
        }
        var authority = _recomposeAuthority(components, options);
        if (authority !== void 0) {
          if (options.reference !== "suffix") {
            uriTokens.push("//");
          }
          uriTokens.push(authority);
          if (components.path && components.path.charAt(0) !== "/") {
            uriTokens.push("/");
          }
        }
        if (components.path !== void 0) {
          var s = components.path;
          if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
            s = removeDotSegments(s);
          }
          if (authority === void 0) {
            s = s.replace(/^\/\//, "/%2F");
          }
          uriTokens.push(s);
        }
        if (components.query !== void 0) {
          uriTokens.push("?");
          uriTokens.push(components.query);
        }
        if (components.fragment !== void 0) {
          uriTokens.push("#");
          uriTokens.push(components.fragment);
        }
        return uriTokens.join("");
      }
      function resolveComponents(base2, relative) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var skipNormalization = arguments[3];
        var target = {};
        if (!skipNormalization) {
          base2 = parse3(serialize(base2, options), options);
          relative = parse3(serialize(relative, options), options);
        }
        options = options || {};
        if (!options.tolerant && relative.scheme) {
          target.scheme = relative.scheme;
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
            target.userinfo = relative.userinfo;
            target.host = relative.host;
            target.port = relative.port;
            target.path = removeDotSegments(relative.path || "");
            target.query = relative.query;
          } else {
            if (!relative.path) {
              target.path = base2.path;
              if (relative.query !== void 0) {
                target.query = relative.query;
              } else {
                target.query = base2.query;
              }
            } else {
              if (relative.path.charAt(0) === "/") {
                target.path = removeDotSegments(relative.path);
              } else {
                if ((base2.userinfo !== void 0 || base2.host !== void 0 || base2.port !== void 0) && !base2.path) {
                  target.path = "/" + relative.path;
                } else if (!base2.path) {
                  target.path = relative.path;
                } else {
                  target.path = base2.path.slice(0, base2.path.lastIndexOf("/") + 1) + relative.path;
                }
                target.path = removeDotSegments(target.path);
              }
              target.query = relative.query;
            }
            target.userinfo = base2.userinfo;
            target.host = base2.host;
            target.port = base2.port;
          }
          target.scheme = base2.scheme;
        }
        target.fragment = relative.fragment;
        return target;
      }
      function resolve(baseURI, relativeURI, options) {
        var schemelessOptions = assign({ scheme: "null" }, options);
        return serialize(resolveComponents(parse3(baseURI, schemelessOptions), parse3(relativeURI, schemelessOptions), schemelessOptions, true), schemelessOptions);
      }
      function normalize(uri, options) {
        if (typeof uri === "string") {
          uri = serialize(parse3(uri, options), options);
        } else if (typeOf(uri) === "object") {
          uri = parse3(serialize(uri, options), options);
        }
        return uri;
      }
      function equal(uriA, uriB, options) {
        if (typeof uriA === "string") {
          uriA = serialize(parse3(uriA, options), options);
        } else if (typeOf(uriA) === "object") {
          uriA = serialize(uriA, options);
        }
        if (typeof uriB === "string") {
          uriB = serialize(parse3(uriB, options), options);
        } else if (typeOf(uriB) === "object") {
          uriB = serialize(uriB, options);
        }
        return uriA === uriB;
      }
      function escapeComponent(str, options) {
        return str && str.toString().replace(!options || !options.iri ? URI_PROTOCOL.ESCAPE : IRI_PROTOCOL.ESCAPE, pctEncChar);
      }
      function unescapeComponent(str, options) {
        return str && str.toString().replace(!options || !options.iri ? URI_PROTOCOL.PCT_ENCODED : IRI_PROTOCOL.PCT_ENCODED, pctDecChars);
      }
      var handler = {
        scheme: "http",
        domainHost: true,
        parse: function parse4(components, options) {
          if (!components.host) {
            components.error = components.error || "HTTP URIs must have a host.";
          }
          return components;
        },
        serialize: function serialize2(components, options) {
          var secure = String(components.scheme).toLowerCase() === "https";
          if (components.port === (secure ? 443 : 80) || components.port === "") {
            components.port = void 0;
          }
          if (!components.path) {
            components.path = "/";
          }
          return components;
        }
      };
      var handler$1 = {
        scheme: "https",
        domainHost: handler.domainHost,
        parse: handler.parse,
        serialize: handler.serialize
      };
      function isSecure(wsComponents) {
        return typeof wsComponents.secure === "boolean" ? wsComponents.secure : String(wsComponents.scheme).toLowerCase() === "wss";
      }
      var handler$2 = {
        scheme: "ws",
        domainHost: true,
        parse: function parse4(components, options) {
          var wsComponents = components;
          wsComponents.secure = isSecure(wsComponents);
          wsComponents.resourceName = (wsComponents.path || "/") + (wsComponents.query ? "?" + wsComponents.query : "");
          wsComponents.path = void 0;
          wsComponents.query = void 0;
          return wsComponents;
        },
        serialize: function serialize2(wsComponents, options) {
          if (wsComponents.port === (isSecure(wsComponents) ? 443 : 80) || wsComponents.port === "") {
            wsComponents.port = void 0;
          }
          if (typeof wsComponents.secure === "boolean") {
            wsComponents.scheme = wsComponents.secure ? "wss" : "ws";
            wsComponents.secure = void 0;
          }
          if (wsComponents.resourceName) {
            var _wsComponents$resourc = wsComponents.resourceName.split("?"), _wsComponents$resourc2 = slicedToArray(_wsComponents$resourc, 2), path = _wsComponents$resourc2[0], query = _wsComponents$resourc2[1];
            wsComponents.path = path && path !== "/" ? path : void 0;
            wsComponents.query = query;
            wsComponents.resourceName = void 0;
          }
          wsComponents.fragment = void 0;
          return wsComponents;
        }
      };
      var handler$3 = {
        scheme: "wss",
        domainHost: handler$2.domainHost,
        parse: handler$2.parse,
        serialize: handler$2.serialize
      };
      var O = {};
      var isIRI = true;
      var UNRESERVED$$ = "[A-Za-z0-9\\-\\.\\_\\~" + (isIRI ? "\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF" : "") + "]";
      var HEXDIG$$ = "[0-9A-Fa-f]";
      var PCT_ENCODED$ = subexp(subexp("%[EFef]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%" + HEXDIG$$ + HEXDIG$$));
      var ATEXT$$ = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]";
      var QTEXT$$ = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]";
      var VCHAR$$ = merge(QTEXT$$, '[\\"\\\\]');
      var SOME_DELIMS$$ = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]";
      var UNRESERVED = new RegExp(UNRESERVED$$, "g");
      var PCT_ENCODED = new RegExp(PCT_ENCODED$, "g");
      var NOT_LOCAL_PART = new RegExp(merge("[^]", ATEXT$$, "[\\.]", '[\\"]', VCHAR$$), "g");
      var NOT_HFNAME = new RegExp(merge("[^]", UNRESERVED$$, SOME_DELIMS$$), "g");
      var NOT_HFVALUE = NOT_HFNAME;
      function decodeUnreserved(str) {
        var decStr = pctDecChars(str);
        return !decStr.match(UNRESERVED) ? str : decStr;
      }
      var handler$4 = {
        scheme: "mailto",
        parse: function parse$$1(components, options) {
          var mailtoComponents = components;
          var to = mailtoComponents.to = mailtoComponents.path ? mailtoComponents.path.split(",") : [];
          mailtoComponents.path = void 0;
          if (mailtoComponents.query) {
            var unknownHeaders = false;
            var headers = {};
            var hfields = mailtoComponents.query.split("&");
            for (var x = 0, xl = hfields.length; x < xl; ++x) {
              var hfield = hfields[x].split("=");
              switch (hfield[0]) {
                case "to":
                  var toAddrs = hfield[1].split(",");
                  for (var _x = 0, _xl = toAddrs.length; _x < _xl; ++_x) {
                    to.push(toAddrs[_x]);
                  }
                  break;
                case "subject":
                  mailtoComponents.subject = unescapeComponent(hfield[1], options);
                  break;
                case "body":
                  mailtoComponents.body = unescapeComponent(hfield[1], options);
                  break;
                default:
                  unknownHeaders = true;
                  headers[unescapeComponent(hfield[0], options)] = unescapeComponent(hfield[1], options);
                  break;
              }
            }
            if (unknownHeaders)
              mailtoComponents.headers = headers;
          }
          mailtoComponents.query = void 0;
          for (var _x2 = 0, _xl2 = to.length; _x2 < _xl2; ++_x2) {
            var addr = to[_x2].split("@");
            addr[0] = unescapeComponent(addr[0]);
            if (!options.unicodeSupport) {
              try {
                addr[1] = punycode.toASCII(unescapeComponent(addr[1], options).toLowerCase());
              } catch (e) {
                mailtoComponents.error = mailtoComponents.error || "Email address's domain name can not be converted to ASCII via punycode: " + e;
              }
            } else {
              addr[1] = unescapeComponent(addr[1], options).toLowerCase();
            }
            to[_x2] = addr.join("@");
          }
          return mailtoComponents;
        },
        serialize: function serialize$$1(mailtoComponents, options) {
          var components = mailtoComponents;
          var to = toArray2(mailtoComponents.to);
          if (to) {
            for (var x = 0, xl = to.length; x < xl; ++x) {
              var toAddr = String(to[x]);
              var atIdx = toAddr.lastIndexOf("@");
              var localPart = toAddr.slice(0, atIdx).replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_LOCAL_PART, pctEncChar);
              var domain = toAddr.slice(atIdx + 1);
              try {
                domain = !options.iri ? punycode.toASCII(unescapeComponent(domain, options).toLowerCase()) : punycode.toUnicode(domain);
              } catch (e) {
                components.error = components.error || "Email address's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
              }
              to[x] = localPart + "@" + domain;
            }
            components.path = to.join(",");
          }
          var headers = mailtoComponents.headers = mailtoComponents.headers || {};
          if (mailtoComponents.subject)
            headers["subject"] = mailtoComponents.subject;
          if (mailtoComponents.body)
            headers["body"] = mailtoComponents.body;
          var fields = [];
          for (var name in headers) {
            if (headers[name] !== O[name]) {
              fields.push(name.replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFNAME, pctEncChar) + "=" + headers[name].replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFVALUE, pctEncChar));
            }
          }
          if (fields.length) {
            components.query = fields.join("&");
          }
          return components;
        }
      };
      var URN_PARSE = /^([^\:]+)\:(.*)/;
      var handler$5 = {
        scheme: "urn",
        parse: function parse$$1(components, options) {
          var matches = components.path && components.path.match(URN_PARSE);
          var urnComponents = components;
          if (matches) {
            var scheme = options.scheme || urnComponents.scheme || "urn";
            var nid = matches[1].toLowerCase();
            var nss = matches[2];
            var urnScheme = scheme + ":" + (options.nid || nid);
            var schemeHandler = SCHEMES[urnScheme];
            urnComponents.nid = nid;
            urnComponents.nss = nss;
            urnComponents.path = void 0;
            if (schemeHandler) {
              urnComponents = schemeHandler.parse(urnComponents, options);
            }
          } else {
            urnComponents.error = urnComponents.error || "URN can not be parsed.";
          }
          return urnComponents;
        },
        serialize: function serialize$$1(urnComponents, options) {
          var scheme = options.scheme || urnComponents.scheme || "urn";
          var nid = urnComponents.nid;
          var urnScheme = scheme + ":" + (options.nid || nid);
          var schemeHandler = SCHEMES[urnScheme];
          if (schemeHandler) {
            urnComponents = schemeHandler.serialize(urnComponents, options);
          }
          var uriComponents = urnComponents;
          var nss = urnComponents.nss;
          uriComponents.path = (nid || options.nid) + ":" + nss;
          return uriComponents;
        }
      };
      var UUID = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;
      var handler$6 = {
        scheme: "urn:uuid",
        parse: function parse4(urnComponents, options) {
          var uuidComponents = urnComponents;
          uuidComponents.uuid = uuidComponents.nss;
          uuidComponents.nss = void 0;
          if (!options.tolerant && (!uuidComponents.uuid || !uuidComponents.uuid.match(UUID))) {
            uuidComponents.error = uuidComponents.error || "UUID is not valid.";
          }
          return uuidComponents;
        },
        serialize: function serialize2(uuidComponents, options) {
          var urnComponents = uuidComponents;
          urnComponents.nss = (uuidComponents.uuid || "").toLowerCase();
          return urnComponents;
        }
      };
      SCHEMES[handler.scheme] = handler;
      SCHEMES[handler$1.scheme] = handler$1;
      SCHEMES[handler$2.scheme] = handler$2;
      SCHEMES[handler$3.scheme] = handler$3;
      SCHEMES[handler$4.scheme] = handler$4;
      SCHEMES[handler$5.scheme] = handler$5;
      SCHEMES[handler$6.scheme] = handler$6;
      exports2.SCHEMES = SCHEMES;
      exports2.pctEncChar = pctEncChar;
      exports2.pctDecChars = pctDecChars;
      exports2.parse = parse3;
      exports2.removeDotSegments = removeDotSegments;
      exports2.serialize = serialize;
      exports2.resolveComponents = resolveComponents;
      exports2.resolve = resolve;
      exports2.normalize = normalize;
      exports2.equal = equal;
      exports2.escapeComponent = escapeComponent;
      exports2.unescapeComponent = unescapeComponent;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/html-validate/node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_uri_all();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a2 = o.code) === null || _a2 === void 0 ? void 0 : _a2.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv2 = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = {};
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema2, _meta) {
        const sch = this._addSchema(schema2, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema2, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema2, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema2, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema2)) {
          for (const sch of schema2)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema2 === "object") {
          const { schemaId } = this.opts;
          id = schema2[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema2, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema2, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema2, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema2, throwOrLogError) {
        if (typeof schema2 == "boolean")
          return true;
        let $schema2;
        $schema2 = schema2.$schema;
        if ($schema2 !== void 0 && typeof $schema2 != "string") {
          throw new Error("$schema must be a string");
        }
        $schema2 = $schema2 || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema2) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema2, schema2);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey2 = schemaKeyRef;
            this._cache.delete(cacheKey2);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions2) {
        for (const def of definitions2)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format2) {
        if (typeof format2 == "string")
          format2 = new RegExp(format2);
        this.formats[name] = format2;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema2 = keywords[key];
            if ($data && schema2)
              keywords[key] = schemaOrData(schema2);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema2, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema2 == "object") {
          id = schema2[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema2 != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema2);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema2, baseId);
        sch = new compile_1.SchemaEnv({ schema: schema2, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema2, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    exports.default = Ajv2;
    Ajv2.ValidationError = validation_error_1.default;
    Ajv2.MissingRefError = ref_error_1.default;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format2 = this.opts.formats[name];
        if (format2)
          this.addFormat(name, format2);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a2;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a2 = definition.implements) === null || _a2 === void 0 ? void 0 : _a2.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema2) {
      return { anyOf: [schema2, $dataRef] };
    }
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a2;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a2 = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a2 === void 0 ? void 0 : _a2.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { data, $data, schema: schema2, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        const regExp = $data ? (0, codegen_1._)`(new RegExp(${schemaCode}, ${u}))` : (0, code_1.usePattern)(cxt, schema2);
        cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema: schema2, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema2.length === 0)
          return;
        const useLoop = schema2.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema2) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema2) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema2, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema: schema2, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema2)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema: schema2 } = cxt;
        if ($data || schema2 && typeof schema2 == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema2} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema: schema2, schemaCode, it } = cxt;
        if (!$data && schema2.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema2.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema2))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema2.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema2[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema: schema2, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema2 === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema2 == "object" && !(0, util_1.alwaysValidSchema)(it, schema2)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema: schema2, it } = cxt;
        if (Array.isArray(schema2))
          return validateTuple(cxt, "additionalItems", schema2);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema2))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema: schema2, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema2))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema: schema2, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema2)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema: schema2 }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema2) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema2[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema2[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema: schema2, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema2))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema: schema2, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema2))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema2 === false) {
            deleteAdditional(key);
            return;
          }
          if (schema2 === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema2 == "object" && !(0, util_1.alwaysValidSchema)(it, schema2)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema: schema2, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema2);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties2 = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema2[p]));
        if (properties2.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties2) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema2[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema: schema2, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema2);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema2[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema: schema2, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema2)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema: schema2, parentSchema, it } = cxt;
        if (!Array.isArray(schema2))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema2;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema: schema2, it } = cxt;
        if (!Array.isArray(schema2))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema2.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema2 = it.schema[keyword];
      return schema2 !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema2);
    }
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema: schema2, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format2 = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format2, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format2, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format2}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format2}(${data}) : ${format2}(${data}))` : (0, codegen_1._)`${format2}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format2} == "function" ? ${callFormat} : ${format2}.test(${data}))`;
            return (0, codegen_1._)`${format2} && ${format2} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema2];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format2, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema2}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema2)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema2, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format2 == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format2 = [format_1.default];
    exports.default = format2;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError = exports.DiscrError || (exports.DiscrError = {}));
  }
});

// node_modules/html-validate/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema: schema2, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema2.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema2.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping2 = getMapping();
          gen.if(false);
          for (const tagValue in mapping2) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping2[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a2;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, sch === null || sch === void 0 ? void 0 : sch.$ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
            }
            const propSch = (_a2 = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a2 === void 0 ? void 0 : _a2[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/html-validate/node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
    module.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// node_modules/html-validate/node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "node_modules/html-validate/node_modules/ajv/dist/ajv.js"(exports, module) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv2 = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    module.exports = exports = Ajv2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv2;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// node_modules/@sidvind/better-ajv-errors/node_modules/color-name/index.js
var require_color_name = __commonJS({
  "node_modules/@sidvind/better-ajv-errors/node_modules/color-name/index.js"(exports, module) {
    "use strict";
    init_define_process();
    module.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// node_modules/@sidvind/better-ajv-errors/node_modules/color-convert/conversions.js
var require_conversions = __commonJS({
  "node_modules/@sidvind/better-ajv-errors/node_modules/color-convert/conversions.js"(exports, module) {
    init_define_process();
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
    var convert = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    module.exports = convert;
    for (const model of Object.keys(convert)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert[model];
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", { value: channels });
      Object.defineProperty(convert[model], "labels", { value: labels });
    }
    convert.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Infinity;
      let currentClosestKeyword;
      for (const keyword of Object.keys(cssKeywords)) {
        const value = cssKeywords[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb) {
      let r = rgb[0] / 255;
      let g = rgb[1] / 255;
      let b = rgb[2] / 255;
      r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
      g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
      b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      const xyz = convert.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t2;
      let t3;
      let val;
      if (s === 0) {
        val = l * 255;
        return [val, val, val];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (~~(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map((char) => {
          return char + char;
        }).join("");
      }
      const integer = parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let grayscale;
      let hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hsv = convert.gray.hsl;
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      const val = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (val << 16) + (val << 8) + val;
      const string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [val / 255 * 100];
    };
  }
});

// node_modules/@sidvind/better-ajv-errors/node_modules/color-convert/route.js
var require_route = __commonJS({
  "node_modules/@sidvind/better-ajv-errors/node_modules/color-convert/route.js"(exports, module) {
    init_define_process();
    var conversions = require_conversions();
    function buildGraph() {
      const graph = {};
      const models = Object.keys(conversions);
      for (let len = models.length, i = 0; i < len; i++) {
        graph[models[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions[current]);
        for (let len = adjacents.length, i = 0; i < len; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      const path = [graph[toModel].parent, toModel];
      let fn = conversions[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path;
      return fn;
    }
    module.exports = function(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models = Object.keys(graph);
      for (let len = models.length, i = 0; i < len; i++) {
        const toModel = models[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// node_modules/@sidvind/better-ajv-errors/node_modules/color-convert/index.js
var require_color_convert = __commonJS({
  "node_modules/@sidvind/better-ajv-errors/node_modules/color-convert/index.js"(exports, module) {
    init_define_process();
    var conversions = require_conversions();
    var route = require_route();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    models.forEach((fromModel) => {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
      const routes = route(fromModel);
      const routeModels = Object.keys(routes);
      routeModels.forEach((toModel) => {
        const fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module.exports = convert;
  }
});

// node_modules/@sidvind/better-ajv-errors/node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS({
  "node_modules/@sidvind/better-ajv-errors/node_modules/ansi-styles/index.js"(exports, module) {
    "use strict";
    init_define_process();
    var wrapAnsi16 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${code + offset}m`;
    };
    var wrapAnsi256 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${38 + offset};5;${code}m`;
    };
    var wrapAnsi16m = (fn, offset) => (...args) => {
      const rgb = fn(...args);
      return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
    };
    var ansi2ansi = (n) => n;
    var rgb2rgb = (r, g, b) => [r, g, b];
    var setLazyProperty = (object, property, get) => {
      Object.defineProperty(object, property, {
        get: () => {
          const value = get();
          Object.defineProperty(object, property, {
            value,
            enumerable: true,
            configurable: true
          });
          return value;
        },
        enumerable: true,
        configurable: true
      });
    };
    var colorConvert;
    var makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
      if (colorConvert === void 0) {
        colorConvert = require_color_convert();
      }
      const offset = isBackground ? 10 : 0;
      const styles = {};
      for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
        const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
        if (sourceSpace === targetSpace) {
          styles[name] = wrap(identity, offset);
        } else if (typeof suite === "object") {
          styles[name] = wrap(suite[targetSpace], offset);
        }
      }
      return styles;
    };
    function assembleStyles() {
      const codes = /* @__PURE__ */ new Map();
      const styles = {
        modifier: {
          reset: [0, 0],
          // 21 isn't widely supported and 22 does the same thing
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          // Bright color
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          // Bright color
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      styles.color.gray = styles.color.blackBright;
      styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
      styles.color.grey = styles.color.blackBright;
      styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
      for (const [groupName, group] of Object.entries(styles)) {
        for (const [styleName, style] of Object.entries(group)) {
          styles[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false
        });
      }
      Object.defineProperty(styles, "codes", {
        value: codes,
        enumerable: false
      });
      styles.color.close = "\x1B[39m";
      styles.bgColor.close = "\x1B[49m";
      setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
      setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
      return styles;
    }
    Object.defineProperty(module, "exports", {
      enumerable: true,
      get: assembleStyles
    });
  }
});

// node_modules/@sidvind/better-ajv-errors/node_modules/supports-color/browser.js
var require_browser = __commonJS({
  "node_modules/@sidvind/better-ajv-errors/node_modules/supports-color/browser.js"(exports, module) {
    "use strict";
    init_define_process();
    module.exports = {
      stdout: false,
      stderr: false
    };
  }
});

// node_modules/@sidvind/better-ajv-errors/node_modules/chalk/source/util.js
var require_util2 = __commonJS({
  "node_modules/@sidvind/better-ajv-errors/node_modules/chalk/source/util.js"(exports, module) {
    "use strict";
    init_define_process();
    var stringReplaceAll = (string, substring, replacer) => {
      let index = string.indexOf(substring);
      if (index === -1) {
        return string;
      }
      const substringLength = substring.length;
      let endIndex = 0;
      let returnValue = "";
      do {
        returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
        endIndex = index + substringLength;
        index = string.indexOf(substring, endIndex);
      } while (index !== -1);
      returnValue += string.substr(endIndex);
      return returnValue;
    };
    var stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
      let endIndex = 0;
      let returnValue = "";
      do {
        const gotCR = string[index - 1] === "\r";
        returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
        endIndex = index + 1;
        index = string.indexOf("\n", endIndex);
      } while (index !== -1);
      returnValue += string.substr(endIndex);
      return returnValue;
    };
    module.exports = {
      stringReplaceAll,
      stringEncaseCRLFWithFirstIndex
    };
  }
});

// node_modules/@sidvind/better-ajv-errors/node_modules/chalk/source/templates.js
var require_templates = __commonJS({
  "node_modules/@sidvind/better-ajv-errors/node_modules/chalk/source/templates.js"(exports, module) {
    "use strict";
    init_define_process();
    var TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
    var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
    var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
    var ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
    var ESCAPES = /* @__PURE__ */ new Map([
      ["n", "\n"],
      ["r", "\r"],
      ["t", "	"],
      ["b", "\b"],
      ["f", "\f"],
      ["v", "\v"],
      ["0", "\0"],
      ["\\", "\\"],
      ["e", "\x1B"],
      ["a", "\x07"]
    ]);
    function unescape(c) {
      const u = c[0] === "u";
      const bracket = c[1] === "{";
      if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
        return String.fromCharCode(parseInt(c.slice(1), 16));
      }
      if (u && bracket) {
        return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
      }
      return ESCAPES.get(c) || c;
    }
    function parseArguments(name, arguments_) {
      const results = [];
      const chunks = arguments_.trim().split(/\s*,\s*/g);
      let matches;
      for (const chunk of chunks) {
        const number = Number(chunk);
        if (!Number.isNaN(number)) {
          results.push(number);
        } else if (matches = chunk.match(STRING_REGEX)) {
          results.push(matches[2].replace(ESCAPE_REGEX, (m, escape2, character) => escape2 ? unescape(escape2) : character));
        } else {
          throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
        }
      }
      return results;
    }
    function parseStyle2(style) {
      STYLE_REGEX.lastIndex = 0;
      const results = [];
      let matches;
      while ((matches = STYLE_REGEX.exec(style)) !== null) {
        const name = matches[1];
        if (matches[2]) {
          const args = parseArguments(name, matches[2]);
          results.push([name].concat(args));
        } else {
          results.push([name]);
        }
      }
      return results;
    }
    function buildStyle(chalk5, styles) {
      const enabled = {};
      for (const layer of styles) {
        for (const style of layer.styles) {
          enabled[style[0]] = layer.inverse ? null : style.slice(1);
        }
      }
      let current = chalk5;
      for (const [styleName, styles2] of Object.entries(enabled)) {
        if (!Array.isArray(styles2)) {
          continue;
        }
        if (!(styleName in current)) {
          throw new Error(`Unknown Chalk style: ${styleName}`);
        }
        current = styles2.length > 0 ? current[styleName](...styles2) : current[styleName];
      }
      return current;
    }
    module.exports = (chalk5, temporary) => {
      const styles = [];
      const chunks = [];
      let chunk = [];
      temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
        if (escapeCharacter) {
          chunk.push(unescape(escapeCharacter));
        } else if (style) {
          const string = chunk.join("");
          chunk = [];
          chunks.push(styles.length === 0 ? string : buildStyle(chalk5, styles)(string));
          styles.push({ inverse, styles: parseStyle2(style) });
        } else if (close) {
          if (styles.length === 0) {
            throw new Error("Found extraneous } in Chalk template literal");
          }
          chunks.push(buildStyle(chalk5, styles)(chunk.join("")));
          chunk = [];
          styles.pop();
        } else {
          chunk.push(character);
        }
      });
      chunks.push(chunk.join(""));
      if (styles.length > 0) {
        const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
        throw new Error(errMessage);
      }
      return chunks.join("");
    };
  }
});

// node_modules/@sidvind/better-ajv-errors/node_modules/chalk/source/index.js
var require_source = __commonJS({
  "node_modules/@sidvind/better-ajv-errors/node_modules/chalk/source/index.js"(exports, module) {
    "use strict";
    init_define_process();
    var ansiStyles = require_ansi_styles();
    var { stdout: stdoutColor, stderr: stderrColor } = require_browser();
    var {
      stringReplaceAll,
      stringEncaseCRLFWithFirstIndex
    } = require_util2();
    var { isArray } = Array;
    var levelMapping = [
      "ansi",
      "ansi",
      "ansi256",
      "ansi16m"
    ];
    var styles = /* @__PURE__ */ Object.create(null);
    var applyOptions = (object, options = {}) => {
      if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
        throw new Error("The `level` option should be an integer from 0 to 3");
      }
      const colorLevel = stdoutColor ? stdoutColor.level : 0;
      object.level = options.level === void 0 ? colorLevel : options.level;
    };
    var ChalkClass = class {
      constructor(options) {
        return chalkFactory(options);
      }
    };
    var chalkFactory = (options) => {
      const chalk6 = {};
      applyOptions(chalk6, options);
      chalk6.template = (...arguments_) => chalkTag(chalk6.template, ...arguments_);
      Object.setPrototypeOf(chalk6, Chalk.prototype);
      Object.setPrototypeOf(chalk6.template, chalk6);
      chalk6.template.constructor = () => {
        throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
      };
      chalk6.template.Instance = ChalkClass;
      return chalk6.template;
    };
    function Chalk(options) {
      return chalkFactory(options);
    }
    for (const [styleName, style] of Object.entries(ansiStyles)) {
      styles[styleName] = {
        get() {
          const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
          Object.defineProperty(this, styleName, { value: builder });
          return builder;
        }
      };
    }
    styles.visible = {
      get() {
        const builder = createBuilder(this, this._styler, true);
        Object.defineProperty(this, "visible", { value: builder });
        return builder;
      }
    };
    var usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
    for (const model of usedModels) {
      styles[model] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
            return createBuilder(this, styler, this._isEmpty);
          };
        }
      };
    }
    for (const model of usedModels) {
      const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
      styles[bgModel] = {
        get() {
          const { level } = this;
          return function(...arguments_) {
            const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
            return createBuilder(this, styler, this._isEmpty);
          };
        }
      };
    }
    var proto = Object.defineProperties(() => {
    }, {
      ...styles,
      level: {
        enumerable: true,
        get() {
          return this._generator.level;
        },
        set(level) {
          this._generator.level = level;
        }
      }
    });
    var createStyler = (open, close, parent) => {
      let openAll;
      let closeAll;
      if (parent === void 0) {
        openAll = open;
        closeAll = close;
      } else {
        openAll = parent.openAll + open;
        closeAll = close + parent.closeAll;
      }
      return {
        open,
        close,
        openAll,
        closeAll,
        parent
      };
    };
    var createBuilder = (self, _styler, _isEmpty) => {
      const builder = (...arguments_) => {
        if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
          return applyStyle(builder, chalkTag(builder, ...arguments_));
        }
        return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
      };
      Object.setPrototypeOf(builder, proto);
      builder._generator = self;
      builder._styler = _styler;
      builder._isEmpty = _isEmpty;
      return builder;
    };
    var applyStyle = (self, string) => {
      if (self.level <= 0 || !string) {
        return self._isEmpty ? "" : string;
      }
      let styler = self._styler;
      if (styler === void 0) {
        return string;
      }
      const { openAll, closeAll } = styler;
      if (string.indexOf("\x1B") !== -1) {
        while (styler !== void 0) {
          string = stringReplaceAll(string, styler.close, styler.open);
          styler = styler.parent;
        }
      }
      const lfIndex = string.indexOf("\n");
      if (lfIndex !== -1) {
        string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
      }
      return openAll + string + closeAll;
    };
    var template;
    var chalkTag = (chalk6, ...strings) => {
      const [firstString] = strings;
      if (!isArray(firstString) || !isArray(firstString.raw)) {
        return strings.join(" ");
      }
      const arguments_ = strings.slice(1);
      const parts = [firstString.raw[0]];
      for (let i = 1; i < firstString.length; i++) {
        parts.push(
          String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"),
          String(firstString.raw[i])
        );
      }
      if (template === void 0) {
        template = require_templates();
      }
      return template(chalk6, parts.join(""));
    };
    Object.defineProperties(Chalk.prototype, styles);
    var chalk5 = Chalk();
    chalk5.supportsColor = stdoutColor;
    chalk5.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 });
    chalk5.stderr.supportsColor = stderrColor;
    module.exports = chalk5;
  }
});

// node_modules/js-tokens/index.js
var require_js_tokens = __commonJS({
  "node_modules/js-tokens/index.js"(exports) {
    init_define_process();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyus]{1,6}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g;
    exports.matchToToken = function(match) {
      var token = { type: "invalid", value: match[0], closed: void 0 };
      if (match[1])
        token.type = "string", token.closed = !!(match[3] || match[4]);
      else if (match[5])
        token.type = "comment";
      else if (match[6])
        token.type = "comment", token.closed = !!match[7];
      else if (match[8])
        token.type = "regex";
      else if (match[9])
        token.type = "number";
      else if (match[10])
        token.type = "name";
      else if (match[11])
        token.type = "punctuator";
      else if (match[12])
        token.type = "whitespace";
      return token;
    };
  }
});

// node_modules/@babel/helper-validator-identifier/lib/identifier.js
var require_identifier = __commonJS({
  "node_modules/@babel/helper-validator-identifier/lib/identifier.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isIdentifierChar = isIdentifierChar;
    exports.isIdentifierName = isIdentifierName;
    exports.isIdentifierStart = isIdentifierStart;
    var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
    var nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\u30FB\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F\uFF65";
    var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
    var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
    nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
    var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 4026, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 757, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191];
    var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 81, 2, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 9, 5351, 0, 7, 14, 13835, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 983, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
    function isInAstralSet(code, set) {
      let pos = 65536;
      for (let i = 0, length = set.length; i < length; i += 2) {
        pos += set[i];
        if (pos > code)
          return false;
        pos += set[i + 1];
        if (pos >= code)
          return true;
      }
      return false;
    }
    function isIdentifierStart(code) {
      if (code < 65)
        return code === 36;
      if (code <= 90)
        return true;
      if (code < 97)
        return code === 95;
      if (code <= 122)
        return true;
      if (code <= 65535) {
        return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
      }
      return isInAstralSet(code, astralIdentifierStartCodes);
    }
    function isIdentifierChar(code) {
      if (code < 48)
        return code === 36;
      if (code < 58)
        return true;
      if (code < 65)
        return false;
      if (code <= 90)
        return true;
      if (code < 97)
        return code === 95;
      if (code <= 122)
        return true;
      if (code <= 65535) {
        return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
      }
      return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
    }
    function isIdentifierName(name) {
      let isFirst = true;
      for (let i = 0; i < name.length; i++) {
        let cp = name.charCodeAt(i);
        if ((cp & 64512) === 55296 && i + 1 < name.length) {
          const trail = name.charCodeAt(++i);
          if ((trail & 64512) === 56320) {
            cp = 65536 + ((cp & 1023) << 10) + (trail & 1023);
          }
        }
        if (isFirst) {
          isFirst = false;
          if (!isIdentifierStart(cp)) {
            return false;
          }
        } else if (!isIdentifierChar(cp)) {
          return false;
        }
      }
      return !isFirst;
    }
  }
});

// node_modules/@babel/helper-validator-identifier/lib/keyword.js
var require_keyword2 = __commonJS({
  "node_modules/@babel/helper-validator-identifier/lib/keyword.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.isKeyword = isKeyword;
    exports.isReservedWord = isReservedWord;
    exports.isStrictBindOnlyReservedWord = isStrictBindOnlyReservedWord;
    exports.isStrictBindReservedWord = isStrictBindReservedWord;
    exports.isStrictReservedWord = isStrictReservedWord;
    var reservedWords = {
      keyword: ["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete"],
      strict: ["implements", "interface", "let", "package", "private", "protected", "public", "static", "yield"],
      strictBind: ["eval", "arguments"]
    };
    var keywords = new Set(reservedWords.keyword);
    var reservedWordsStrictSet = new Set(reservedWords.strict);
    var reservedWordsStrictBindSet = new Set(reservedWords.strictBind);
    function isReservedWord(word, inModule) {
      return inModule && word === "await" || word === "enum";
    }
    function isStrictReservedWord(word, inModule) {
      return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
    }
    function isStrictBindOnlyReservedWord(word) {
      return reservedWordsStrictBindSet.has(word);
    }
    function isStrictBindReservedWord(word, inModule) {
      return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
    }
    function isKeyword(word) {
      return keywords.has(word);
    }
  }
});

// node_modules/@babel/helper-validator-identifier/lib/index.js
var require_lib = __commonJS({
  "node_modules/@babel/helper-validator-identifier/lib/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "isIdentifierChar", {
      enumerable: true,
      get: function() {
        return _identifier.isIdentifierChar;
      }
    });
    Object.defineProperty(exports, "isIdentifierName", {
      enumerable: true,
      get: function() {
        return _identifier.isIdentifierName;
      }
    });
    Object.defineProperty(exports, "isIdentifierStart", {
      enumerable: true,
      get: function() {
        return _identifier.isIdentifierStart;
      }
    });
    Object.defineProperty(exports, "isKeyword", {
      enumerable: true,
      get: function() {
        return _keyword.isKeyword;
      }
    });
    Object.defineProperty(exports, "isReservedWord", {
      enumerable: true,
      get: function() {
        return _keyword.isReservedWord;
      }
    });
    Object.defineProperty(exports, "isStrictBindOnlyReservedWord", {
      enumerable: true,
      get: function() {
        return _keyword.isStrictBindOnlyReservedWord;
      }
    });
    Object.defineProperty(exports, "isStrictBindReservedWord", {
      enumerable: true,
      get: function() {
        return _keyword.isStrictBindReservedWord;
      }
    });
    Object.defineProperty(exports, "isStrictReservedWord", {
      enumerable: true,
      get: function() {
        return _keyword.isStrictReservedWord;
      }
    });
    var _identifier = require_identifier();
    var _keyword = require_keyword2();
  }
});

// node_modules/picocolors/picocolors.browser.js
var require_picocolors_browser = __commonJS({
  "node_modules/picocolors/picocolors.browser.js"(exports, module) {
    init_define_process();
    var x = String;
    var create = function() {
      return { isColorSupported: false, reset: x, bold: x, dim: x, italic: x, underline: x, inverse: x, hidden: x, strikethrough: x, black: x, red: x, green: x, yellow: x, blue: x, magenta: x, cyan: x, white: x, gray: x, bgBlack: x, bgRed: x, bgGreen: x, bgYellow: x, bgBlue: x, bgMagenta: x, bgCyan: x, bgWhite: x };
    };
    module.exports = create();
    module.exports.createColors = create;
  }
});

// node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = __commonJS({
  "node_modules/escape-string-regexp/index.js"(exports, module) {
    "use strict";
    init_define_process();
    var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    module.exports = function(str) {
      if (typeof str !== "string") {
        throw new TypeError("Expected a string");
      }
      return str.replace(matchOperatorsRe, "\\$&");
    };
  }
});

// node_modules/color-name/index.js
var require_color_name2 = __commonJS({
  "node_modules/color-name/index.js"(exports, module) {
    "use strict";
    init_define_process();
    module.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// node_modules/color-convert/conversions.js
var require_conversions2 = __commonJS({
  "node_modules/color-convert/conversions.js"(exports, module) {
    init_define_process();
    var cssKeywords = require_color_name2();
    var reverseKeywords = {};
    for (key in cssKeywords) {
      if (cssKeywords.hasOwnProperty(key)) {
        reverseKeywords[cssKeywords[key]] = key;
      }
    }
    var key;
    var convert = module.exports = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    for (model in convert) {
      if (convert.hasOwnProperty(model)) {
        if (!("channels" in convert[model])) {
          throw new Error("missing channels property: " + model);
        }
        if (!("labels" in convert[model])) {
          throw new Error("missing channel labels property: " + model);
        }
        if (convert[model].labels.length !== convert[model].channels) {
          throw new Error("channel and label counts mismatch: " + model);
        }
        channels = convert[model].channels;
        labels = convert[model].labels;
        delete convert[model].channels;
        delete convert[model].labels;
        Object.defineProperty(convert[model], "channels", { value: channels });
        Object.defineProperty(convert[model], "labels", { value: labels });
      }
    }
    var channels;
    var labels;
    var model;
    convert.rgb.hsl = function(rgb) {
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var min = Math.min(r, g, b);
      var max = Math.max(r, g, b);
      var delta = max - min;
      var h;
      var s;
      var l;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb) {
      var rdif;
      var gdif;
      var bdif;
      var h;
      var s;
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var v = Math.max(r, g, b);
      var diff = v - Math.min(r, g, b);
      var diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      var r = rgb[0];
      var g = rgb[1];
      var b = rgb[2];
      var h = convert.rgb.hsl(rgb)[0];
      var w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var c;
      var m;
      var y;
      var k;
      k = Math.min(1 - r, 1 - g, 1 - b);
      c = (1 - r - k) / (1 - k) || 0;
      m = (1 - g - k) / (1 - k) || 0;
      y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2) + Math.pow(x[2] - y[2], 2);
    }
    convert.rgb.keyword = function(rgb) {
      var reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      var currentClosestDistance = Infinity;
      var currentClosestKeyword;
      for (var keyword in cssKeywords) {
        if (cssKeywords.hasOwnProperty(keyword)) {
          var value = cssKeywords[keyword];
          var distance = comparativeDistance(rgb, value);
          if (distance < currentClosestDistance) {
            currentClosestDistance = distance;
            currentClosestKeyword = keyword;
          }
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb) {
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
      var x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      var y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      var z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      var xyz = convert.rgb.xyz(rgb);
      var x = xyz[0];
      var y = xyz[1];
      var z = xyz[2];
      var l;
      var a;
      var b;
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
      l = 116 * y - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      var h = hsl[0] / 360;
      var s = hsl[1] / 100;
      var l = hsl[2] / 100;
      var t1;
      var t2;
      var t3;
      var rgb;
      var val;
      if (s === 0) {
        val = l * 255;
        return [val, val, val];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      t1 = 2 * l - t2;
      rgb = [0, 0, 0];
      for (var i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i] = val * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      var h = hsl[0];
      var s = hsl[1] / 100;
      var l = hsl[2] / 100;
      var smin = s;
      var lmin = Math.max(l, 0.01);
      var sv;
      var v;
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      v = (l + s) / 2;
      sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      var h = hsv[0] / 60;
      var s = hsv[1] / 100;
      var v = hsv[2] / 100;
      var hi = Math.floor(h) % 6;
      var f = h - Math.floor(h);
      var p = 255 * v * (1 - s);
      var q = 255 * v * (1 - s * f);
      var t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert.hsv.hsl = function(hsv) {
      var h = hsv[0];
      var s = hsv[1] / 100;
      var v = hsv[2] / 100;
      var vmin = Math.max(v, 0.01);
      var lmin;
      var sl;
      var l;
      l = (2 - s) * v;
      lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      var h = hwb[0] / 360;
      var wh = hwb[1] / 100;
      var bl = hwb[2] / 100;
      var ratio = wh + bl;
      var i;
      var v;
      var f;
      var n;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      i = Math.floor(6 * h);
      v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      n = wh + f * (v - wh);
      var r;
      var g;
      var b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      var c = cmyk[0] / 100;
      var m = cmyk[1] / 100;
      var y = cmyk[2] / 100;
      var k = cmyk[3] / 100;
      var r;
      var g;
      var b;
      r = 1 - Math.min(1, c * (1 - k) + k);
      g = 1 - Math.min(1, m * (1 - k) + k);
      b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      var x = xyz[0] / 100;
      var y = xyz[1] / 100;
      var z = xyz[2] / 100;
      var r;
      var g;
      var b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      var x = xyz[0];
      var y = xyz[1];
      var z = xyz[2];
      var l;
      var a;
      var b;
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
      l = 116 * y - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);
      return [l, a, b];
    };
    convert.lab.xyz = function(lab) {
      var l = lab[0];
      var a = lab[1];
      var b = lab[2];
      var x;
      var y;
      var z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      var y2 = Math.pow(y, 3);
      var x2 = Math.pow(x, 3);
      var z2 = Math.pow(z, 3);
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      var l = lab[0];
      var a = lab[1];
      var b = lab[2];
      var hr;
      var h;
      var c;
      hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      var l = lch[0];
      var c = lch[1];
      var h = lch[2];
      var a;
      var b;
      var hr;
      hr = h / 360 * 2 * Math.PI;
      a = c * Math.cos(hr);
      b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args) {
      var r = args[0];
      var g = args[1];
      var b = args[2];
      var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2];
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      var ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      var r = args[0];
      var g = args[1];
      var b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      var ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      var color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      var mult = (~~(args > 50) + 1) * 0.5;
      var r = (color & 1) * mult * 255;
      var g = (color >> 1 & 1) * mult * 255;
      var b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        var c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      var rem;
      var r = Math.floor(args / 36) / 5 * 255;
      var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      var b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      var integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      var string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      var colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map(function(char) {
          return char + char;
        }).join("");
      }
      var integer = parseInt(colorString, 16);
      var r = integer >> 16 & 255;
      var g = integer >> 8 & 255;
      var b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      var r = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var max = Math.max(Math.max(r, g), b);
      var min = Math.min(Math.min(r, g), b);
      var chroma = max - min;
      var grayscale;
      var hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma + 4;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      var s = hsl[1] / 100;
      var l = hsl[2] / 100;
      var c = 1;
      var f = 0;
      if (l < 0.5) {
        c = 2 * s * l;
      } else {
        c = 2 * s * (1 - l);
      }
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      var s = hsv[1] / 100;
      var v = hsv[2] / 100;
      var c = s * v;
      var f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      var h = hcg[0] / 360;
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      var pure = [0, 0, 0];
      var hi = h % 1 * 6;
      var v = hi % 1;
      var w = 1 - v;
      var mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      var v = c + g * (1 - c);
      var f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      var l = g * (1 - c) + 0.5 * c;
      var s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      var v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      var w = hwb[1] / 100;
      var b = hwb[2] / 100;
      var v = 1 - b;
      var c = v - w;
      var g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = convert.gray.hsv = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      var val = Math.round(gray[0] / 100 * 255) & 255;
      var integer = (val << 16) + (val << 8) + val;
      var string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [val / 255 * 100];
    };
  }
});

// node_modules/color-convert/route.js
var require_route2 = __commonJS({
  "node_modules/color-convert/route.js"(exports, module) {
    init_define_process();
    var conversions = require_conversions2();
    function buildGraph() {
      var graph = {};
      var models = Object.keys(conversions);
      for (var len = models.length, i = 0; i < len; i++) {
        graph[models[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      var graph = buildGraph();
      var queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length) {
        var current = queue.pop();
        var adjacents = Object.keys(conversions[current]);
        for (var len = adjacents.length, i = 0; i < len; i++) {
          var adjacent = adjacents[i];
          var node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      var path = [graph[toModel].parent, toModel];
      var fn = conversions[graph[toModel].parent][toModel];
      var cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path;
      return fn;
    }
    module.exports = function(fromModel) {
      var graph = deriveBFS(fromModel);
      var conversion = {};
      var models = Object.keys(graph);
      for (var len = models.length, i = 0; i < len; i++) {
        var toModel = models[i];
        var node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// node_modules/color-convert/index.js
var require_color_convert2 = __commonJS({
  "node_modules/color-convert/index.js"(exports, module) {
    init_define_process();
    var conversions = require_conversions2();
    var route = require_route2();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      var wrappedFn = function(args) {
        if (args === void 0 || args === null) {
          return args;
        }
        if (arguments.length > 1) {
          args = Array.prototype.slice.call(arguments);
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      var wrappedFn = function(args) {
        if (args === void 0 || args === null) {
          return args;
        }
        if (arguments.length > 1) {
          args = Array.prototype.slice.call(arguments);
        }
        var result = fn(args);
        if (typeof result === "object") {
          for (var len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    models.forEach(function(fromModel) {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
      var routes = route(fromModel);
      var routeModels = Object.keys(routes);
      routeModels.forEach(function(toModel) {
        var fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module.exports = convert;
  }
});

// node_modules/ansi-styles/index.js
var require_ansi_styles2 = __commonJS({
  "node_modules/ansi-styles/index.js"(exports, module) {
    "use strict";
    init_define_process();
    var colorConvert = require_color_convert2();
    var wrapAnsi16 = (fn, offset) => function() {
      const code = fn.apply(colorConvert, arguments);
      return `\x1B[${code + offset}m`;
    };
    var wrapAnsi256 = (fn, offset) => function() {
      const code = fn.apply(colorConvert, arguments);
      return `\x1B[${38 + offset};5;${code}m`;
    };
    var wrapAnsi16m = (fn, offset) => function() {
      const rgb = fn.apply(colorConvert, arguments);
      return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
    };
    function assembleStyles() {
      const codes = /* @__PURE__ */ new Map();
      const styles = {
        modifier: {
          reset: [0, 0],
          // 21 isn't widely supported and 22 does the same thing
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          gray: [90, 39],
          // Bright color
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          // Bright color
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      styles.color.grey = styles.color.gray;
      for (const groupName of Object.keys(styles)) {
        const group = styles[groupName];
        for (const styleName of Object.keys(group)) {
          const style = group[styleName];
          styles[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false
        });
        Object.defineProperty(styles, "codes", {
          value: codes,
          enumerable: false
        });
      }
      const ansi2ansi = (n) => n;
      const rgb2rgb = (r, g, b) => [r, g, b];
      styles.color.close = "\x1B[39m";
      styles.bgColor.close = "\x1B[49m";
      styles.color.ansi = {
        ansi: wrapAnsi16(ansi2ansi, 0)
      };
      styles.color.ansi256 = {
        ansi256: wrapAnsi256(ansi2ansi, 0)
      };
      styles.color.ansi16m = {
        rgb: wrapAnsi16m(rgb2rgb, 0)
      };
      styles.bgColor.ansi = {
        ansi: wrapAnsi16(ansi2ansi, 10)
      };
      styles.bgColor.ansi256 = {
        ansi256: wrapAnsi256(ansi2ansi, 10)
      };
      styles.bgColor.ansi16m = {
        rgb: wrapAnsi16m(rgb2rgb, 10)
      };
      for (let key of Object.keys(colorConvert)) {
        if (typeof colorConvert[key] !== "object") {
          continue;
        }
        const suite = colorConvert[key];
        if (key === "ansi16") {
          key = "ansi";
        }
        if ("ansi16" in suite) {
          styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
          styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
        }
        if ("ansi256" in suite) {
          styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
          styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
        }
        if ("rgb" in suite) {
          styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
          styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
        }
      }
      return styles;
    }
    Object.defineProperty(module, "exports", {
      enumerable: true,
      get: assembleStyles
    });
  }
});

// node_modules/supports-color/browser.js
var require_browser2 = __commonJS({
  "node_modules/supports-color/browser.js"(exports, module) {
    "use strict";
    init_define_process();
    module.exports = {
      stdout: false,
      stderr: false
    };
  }
});

// node_modules/chalk/templates.js
var require_templates2 = __commonJS({
  "node_modules/chalk/templates.js"(exports, module) {
    "use strict";
    init_define_process();
    var TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
    var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
    var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
    var ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;
    var ESCAPES = /* @__PURE__ */ new Map([
      ["n", "\n"],
      ["r", "\r"],
      ["t", "	"],
      ["b", "\b"],
      ["f", "\f"],
      ["v", "\v"],
      ["0", "\0"],
      ["\\", "\\"],
      ["e", "\x1B"],
      ["a", "\x07"]
    ]);
    function unescape(c) {
      if (c[0] === "u" && c.length === 5 || c[0] === "x" && c.length === 3) {
        return String.fromCharCode(parseInt(c.slice(1), 16));
      }
      return ESCAPES.get(c) || c;
    }
    function parseArguments(name, args) {
      const results = [];
      const chunks = args.trim().split(/\s*,\s*/g);
      let matches;
      for (const chunk of chunks) {
        if (!isNaN(chunk)) {
          results.push(Number(chunk));
        } else if (matches = chunk.match(STRING_REGEX)) {
          results.push(matches[2].replace(ESCAPE_REGEX, (m, escape2, chr) => escape2 ? unescape(escape2) : chr));
        } else {
          throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
        }
      }
      return results;
    }
    function parseStyle2(style) {
      STYLE_REGEX.lastIndex = 0;
      const results = [];
      let matches;
      while ((matches = STYLE_REGEX.exec(style)) !== null) {
        const name = matches[1];
        if (matches[2]) {
          const args = parseArguments(name, matches[2]);
          results.push([name].concat(args));
        } else {
          results.push([name]);
        }
      }
      return results;
    }
    function buildStyle(chalk5, styles) {
      const enabled = {};
      for (const layer of styles) {
        for (const style of layer.styles) {
          enabled[style[0]] = layer.inverse ? null : style.slice(1);
        }
      }
      let current = chalk5;
      for (const styleName of Object.keys(enabled)) {
        if (Array.isArray(enabled[styleName])) {
          if (!(styleName in current)) {
            throw new Error(`Unknown Chalk style: ${styleName}`);
          }
          if (enabled[styleName].length > 0) {
            current = current[styleName].apply(current, enabled[styleName]);
          } else {
            current = current[styleName];
          }
        }
      }
      return current;
    }
    module.exports = (chalk5, tmp) => {
      const styles = [];
      const chunks = [];
      let chunk = [];
      tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
        if (escapeChar) {
          chunk.push(unescape(escapeChar));
        } else if (style) {
          const str = chunk.join("");
          chunk = [];
          chunks.push(styles.length === 0 ? str : buildStyle(chalk5, styles)(str));
          styles.push({ inverse, styles: parseStyle2(style) });
        } else if (close) {
          if (styles.length === 0) {
            throw new Error("Found extraneous } in Chalk template literal");
          }
          chunks.push(buildStyle(chalk5, styles)(chunk.join("")));
          chunk = [];
          styles.pop();
        } else {
          chunk.push(chr);
        }
      });
      chunks.push(chunk.join(""));
      if (styles.length > 0) {
        const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
        throw new Error(errMsg);
      }
      return chunks.join("");
    };
  }
});

// node_modules/chalk/index.js
var require_chalk = __commonJS({
  "node_modules/chalk/index.js"(exports, module) {
    "use strict";
    init_define_process();
    var escapeStringRegexp = require_escape_string_regexp();
    var ansiStyles = require_ansi_styles2();
    var stdoutColor = require_browser2().stdout;
    var template = require_templates2();
    var isSimpleWindowsTerm = define_process_default.platform === "win32" && !(define_process_default.env.TERM || "").toLowerCase().startsWith("xterm");
    var levelMapping = ["ansi", "ansi", "ansi256", "ansi16m"];
    var skipModels = /* @__PURE__ */ new Set(["gray"]);
    var styles = /* @__PURE__ */ Object.create(null);
    function applyOptions(obj, options) {
      options = options || {};
      const scLevel = stdoutColor ? stdoutColor.level : 0;
      obj.level = options.level === void 0 ? scLevel : options.level;
      obj.enabled = "enabled" in options ? options.enabled : obj.level > 0;
    }
    function Chalk(options) {
      if (!this || !(this instanceof Chalk) || this.template) {
        const chalk5 = {};
        applyOptions(chalk5, options);
        chalk5.template = function() {
          const args = [].slice.call(arguments);
          return chalkTag.apply(null, [chalk5.template].concat(args));
        };
        Object.setPrototypeOf(chalk5, Chalk.prototype);
        Object.setPrototypeOf(chalk5.template, chalk5);
        chalk5.template.constructor = Chalk;
        return chalk5.template;
      }
      applyOptions(this, options);
    }
    if (isSimpleWindowsTerm) {
      ansiStyles.blue.open = "\x1B[94m";
    }
    for (const key of Object.keys(ansiStyles)) {
      ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), "g");
      styles[key] = {
        get() {
          const codes = ansiStyles[key];
          return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
        }
      };
    }
    styles.visible = {
      get() {
        return build.call(this, this._styles || [], true, "visible");
      }
    };
    ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), "g");
    for (const model of Object.keys(ansiStyles.color.ansi)) {
      if (skipModels.has(model)) {
        continue;
      }
      styles[model] = {
        get() {
          const level = this.level;
          return function() {
            const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
            const codes = {
              open,
              close: ansiStyles.color.close,
              closeRe: ansiStyles.color.closeRe
            };
            return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
          };
        }
      };
    }
    ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), "g");
    for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
      if (skipModels.has(model)) {
        continue;
      }
      const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
      styles[bgModel] = {
        get() {
          const level = this.level;
          return function() {
            const open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments);
            const codes = {
              open,
              close: ansiStyles.bgColor.close,
              closeRe: ansiStyles.bgColor.closeRe
            };
            return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
          };
        }
      };
    }
    var proto = Object.defineProperties(() => {
    }, styles);
    function build(_styles, _empty, key) {
      const builder = function() {
        return applyStyle.apply(builder, arguments);
      };
      builder._styles = _styles;
      builder._empty = _empty;
      const self = this;
      Object.defineProperty(builder, "level", {
        enumerable: true,
        get() {
          return self.level;
        },
        set(level) {
          self.level = level;
        }
      });
      Object.defineProperty(builder, "enabled", {
        enumerable: true,
        get() {
          return self.enabled;
        },
        set(enabled) {
          self.enabled = enabled;
        }
      });
      builder.hasGrey = this.hasGrey || key === "gray" || key === "grey";
      builder.__proto__ = proto;
      return builder;
    }
    function applyStyle() {
      const args = arguments;
      const argsLen = args.length;
      let str = String(arguments[0]);
      if (argsLen === 0) {
        return "";
      }
      if (argsLen > 1) {
        for (let a = 1; a < argsLen; a++) {
          str += " " + args[a];
        }
      }
      if (!this.enabled || this.level <= 0 || !str) {
        return this._empty ? "" : str;
      }
      const originalDim = ansiStyles.dim.open;
      if (isSimpleWindowsTerm && this.hasGrey) {
        ansiStyles.dim.open = "";
      }
      for (const code of this._styles.slice().reverse()) {
        str = code.open + str.replace(code.closeRe, code.open) + code.close;
        str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
      }
      ansiStyles.dim.open = originalDim;
      return str;
    }
    function chalkTag(chalk5, strings) {
      if (!Array.isArray(strings)) {
        return [].slice.call(arguments, 1).join(" ");
      }
      const args = [].slice.call(arguments, 2);
      const parts = [strings.raw[0]];
      for (let i = 1; i < strings.length; i++) {
        parts.push(String(args[i - 1]).replace(/[{}\\]/g, "\\$&"));
        parts.push(String(strings.raw[i]));
      }
      return template(chalk5, parts.join(""));
    }
    Object.defineProperties(Chalk.prototype, styles);
    module.exports = Chalk();
    module.exports.supportsColor = stdoutColor;
    module.exports.default = module.exports;
  }
});

// node_modules/@babel/highlight/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@babel/highlight/lib/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = highlight;
    exports.shouldHighlight = shouldHighlight;
    var _jsTokens = require_js_tokens();
    var _helperValidatorIdentifier = require_lib();
    var _picocolors = _interopRequireWildcard(require_picocolors_browser(), true);
    function _getRequireWildcardCache(e) {
      if ("function" != typeof WeakMap)
        return null;
      var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function(e2) {
        return e2 ? t : r;
      })(e);
    }
    function _interopRequireWildcard(e, r) {
      if (!r && e && e.__esModule)
        return e;
      if (null === e || "object" != typeof e && "function" != typeof e)
        return { default: e };
      var t = _getRequireWildcardCache(r);
      if (t && t.has(e))
        return t.get(e);
      var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u in e)
        if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
          var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
          i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
        }
      return n.default = e, t && t.set(e, n), n;
    }
    var colors = typeof define_process_default === "object" && (define_process_default.env.FORCE_COLOR === "0" || define_process_default.env.FORCE_COLOR === "false") ? (0, _picocolors.createColors)(false) : _picocolors.default;
    var compose = (f, g) => (v) => f(g(v));
    var sometimesKeywords = /* @__PURE__ */ new Set(["as", "async", "from", "get", "of", "set"]);
    function getDefs(colors2) {
      return {
        keyword: colors2.cyan,
        capitalized: colors2.yellow,
        jsxIdentifier: colors2.yellow,
        punctuator: colors2.yellow,
        number: colors2.magenta,
        string: colors2.green,
        regex: colors2.magenta,
        comment: colors2.gray,
        invalid: compose(compose(colors2.white, colors2.bgRed), colors2.bold)
      };
    }
    var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
    var BRACKET = /^[()[\]{}]$/;
    var tokenize2;
    {
      const JSX_TAG = /^[a-z][\w-]*$/i;
      const getTokenType = function(token, offset, text) {
        if (token.type === "name") {
          if ((0, _helperValidatorIdentifier.isKeyword)(token.value) || (0, _helperValidatorIdentifier.isStrictReservedWord)(token.value, true) || sometimesKeywords.has(token.value)) {
            return "keyword";
          }
          if (JSX_TAG.test(token.value) && (text[offset - 1] === "<" || text.slice(offset - 2, offset) == "</")) {
            return "jsxIdentifier";
          }
          if (token.value[0] !== token.value[0].toLowerCase()) {
            return "capitalized";
          }
        }
        if (token.type === "punctuator" && BRACKET.test(token.value)) {
          return "bracket";
        }
        if (token.type === "invalid" && (token.value === "@" || token.value === "#")) {
          return "punctuator";
        }
        return token.type;
      };
      tokenize2 = function* (text) {
        let match;
        while (match = _jsTokens.default.exec(text)) {
          const token = _jsTokens.matchToToken(match);
          yield {
            type: getTokenType(token, match.index, text),
            value: token.value
          };
        }
      };
    }
    function highlightTokens(defs, text) {
      let highlighted = "";
      for (const {
        type: type2,
        value
      } of tokenize2(text)) {
        const colorize = defs[type2];
        if (colorize) {
          highlighted += value.split(NEWLINE).map((str) => colorize(str)).join("\n");
        } else {
          highlighted += value;
        }
      }
      return highlighted;
    }
    function shouldHighlight(options) {
      return colors.isColorSupported || options.forceColor;
    }
    var pcWithForcedColor = void 0;
    function getColors(forceColor) {
      if (forceColor) {
        var _pcWithForcedColor;
        (_pcWithForcedColor = pcWithForcedColor) != null ? _pcWithForcedColor : pcWithForcedColor = (0, _picocolors.createColors)(true);
        return pcWithForcedColor;
      }
      return colors;
    }
    function highlight(code, options = {}) {
      if (code !== "" && shouldHighlight(options)) {
        const defs = getDefs(getColors(options.forceColor));
        return highlightTokens(defs, code);
      } else {
        return code;
      }
    }
    {
      let chalk5, chalkWithForcedColor;
      exports.getChalk = ({
        forceColor
      }) => {
        var _chalk;
        (_chalk = chalk5) != null ? _chalk : chalk5 = require_chalk();
        if (forceColor) {
          var _chalkWithForcedColor;
          (_chalkWithForcedColor = chalkWithForcedColor) != null ? _chalkWithForcedColor : chalkWithForcedColor = new chalk5.constructor({
            enabled: true,
            level: 1
          });
          return chalkWithForcedColor;
        }
        return chalk5;
      };
    }
  }
});

// node_modules/@babel/code-frame/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/@babel/code-frame/lib/index.js"(exports) {
    "use strict";
    init_define_process();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.codeFrameColumns = codeFrameColumns3;
    exports.default = _default;
    var _highlight = require_lib2();
    var _picocolors = _interopRequireWildcard(require_picocolors_browser(), true);
    function _getRequireWildcardCache(e) {
      if ("function" != typeof WeakMap)
        return null;
      var r = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = function(e2) {
        return e2 ? t : r;
      })(e);
    }
    function _interopRequireWildcard(e, r) {
      if (!r && e && e.__esModule)
        return e;
      if (null === e || "object" != typeof e && "function" != typeof e)
        return { default: e };
      var t = _getRequireWildcardCache(r);
      if (t && t.has(e))
        return t.get(e);
      var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var u in e)
        if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
          var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
          i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
        }
      return n.default = e, t && t.set(e, n), n;
    }
    var colors = typeof define_process_default === "object" && (define_process_default.env.FORCE_COLOR === "0" || define_process_default.env.FORCE_COLOR === "false") ? (0, _picocolors.createColors)(false) : _picocolors.default;
    var compose = (f, g) => (v) => f(g(v));
    var pcWithForcedColor = void 0;
    function getColors(forceColor) {
      if (forceColor) {
        var _pcWithForcedColor;
        (_pcWithForcedColor = pcWithForcedColor) != null ? _pcWithForcedColor : pcWithForcedColor = (0, _picocolors.createColors)(true);
        return pcWithForcedColor;
      }
      return colors;
    }
    var deprecationWarningShown = false;
    function getDefs(colors2) {
      return {
        gutter: colors2.gray,
        marker: compose(colors2.red, colors2.bold),
        message: compose(colors2.red, colors2.bold)
      };
    }
    var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
    function getMarkerLines(loc, source, opts) {
      const startLoc = Object.assign({
        column: 0,
        line: -1
      }, loc.start);
      const endLoc = Object.assign({}, startLoc, loc.end);
      const {
        linesAbove = 2,
        linesBelow = 3
      } = opts || {};
      const startLine = startLoc.line;
      const startColumn = startLoc.column;
      const endLine = endLoc.line;
      const endColumn = endLoc.column;
      let start = Math.max(startLine - (linesAbove + 1), 0);
      let end = Math.min(source.length, endLine + linesBelow);
      if (startLine === -1) {
        start = 0;
      }
      if (endLine === -1) {
        end = source.length;
      }
      const lineDiff = endLine - startLine;
      const markerLines = {};
      if (lineDiff) {
        for (let i = 0; i <= lineDiff; i++) {
          const lineNumber = i + startLine;
          if (!startColumn) {
            markerLines[lineNumber] = true;
          } else if (i === 0) {
            const sourceLength = source[lineNumber - 1].length;
            markerLines[lineNumber] = [startColumn, sourceLength - startColumn + 1];
          } else if (i === lineDiff) {
            markerLines[lineNumber] = [0, endColumn];
          } else {
            const sourceLength = source[lineNumber - i].length;
            markerLines[lineNumber] = [0, sourceLength];
          }
        }
      } else {
        if (startColumn === endColumn) {
          if (startColumn) {
            markerLines[startLine] = [startColumn, 0];
          } else {
            markerLines[startLine] = true;
          }
        } else {
          markerLines[startLine] = [startColumn, endColumn - startColumn];
        }
      }
      return {
        start,
        end,
        markerLines
      };
    }
    function codeFrameColumns3(rawLines, loc, opts = {}) {
      const highlighted = (opts.highlightCode || opts.forceColor) && (0, _highlight.shouldHighlight)(opts);
      const colors2 = getColors(opts.forceColor);
      const defs = getDefs(colors2);
      const maybeHighlight = (fmt, string) => {
        return highlighted ? fmt(string) : string;
      };
      const lines = rawLines.split(NEWLINE);
      const {
        start,
        end,
        markerLines
      } = getMarkerLines(loc, lines, opts);
      const hasColumns = loc.start && typeof loc.start.column === "number";
      const numberMaxWidth = String(end).length;
      const highlightedLines = highlighted ? (0, _highlight.default)(rawLines, opts) : rawLines;
      let frame = highlightedLines.split(NEWLINE, end).slice(start, end).map((line, index) => {
        const number = start + 1 + index;
        const paddedNumber = ` ${number}`.slice(-numberMaxWidth);
        const gutter = ` ${paddedNumber} |`;
        const hasMarker = markerLines[number];
        const lastMarkerLine = !markerLines[number + 1];
        if (hasMarker) {
          let markerLine = "";
          if (Array.isArray(hasMarker)) {
            const markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " ");
            const numberOfMarkers = hasMarker[1] || 1;
            markerLine = ["\n ", maybeHighlight(defs.gutter, gutter.replace(/\d/g, " ")), " ", markerSpacing, maybeHighlight(defs.marker, "^").repeat(numberOfMarkers)].join("");
            if (lastMarkerLine && opts.message) {
              markerLine += " " + maybeHighlight(defs.message, opts.message);
            }
          }
          return [maybeHighlight(defs.marker, ">"), maybeHighlight(defs.gutter, gutter), line.length > 0 ? ` ${line}` : "", markerLine].join("");
        } else {
          return ` ${maybeHighlight(defs.gutter, gutter)}${line.length > 0 ? ` ${line}` : ""}`;
        }
      }).join("\n");
      if (opts.message && !hasColumns) {
        frame = `${" ".repeat(numberMaxWidth + 1)}${opts.message}
${frame}`;
      }
      if (highlighted) {
        return colors2.reset(frame);
      } else {
        return frame;
      }
    }
    function _default(rawLines, lineNumber, colNumber, opts = {}) {
      if (!deprecationWarningShown) {
        deprecationWarningShown = true;
        const message = "Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`.";
        if (define_process_default.emitWarning) {
          define_process_default.emitWarning(message, "DeprecationWarning");
        } else {
          const deprecationError = new Error(message);
          deprecationError.name = "DeprecationWarning";
          console.warn(new Error(message));
        }
      }
      colNumber = Math.max(colNumber, 0);
      const location = {
        start: {
          column: colNumber,
          line: lineNumber
        }
      };
      return codeFrameColumns3(rawLines, location, opts);
    }
  }
});

// (disabled):fs
var require_fs = __commonJS({
  "(disabled):fs"() {
    init_define_process();
  }
});

// node_modules/html-validate/node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/html-validate/node_modules/semver/internal/constants.js"(exports, module) {
    init_define_process();
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// node_modules/html-validate/node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/html-validate/node_modules/semver/internal/debug.js"(exports, module) {
    init_define_process();
    var debug = typeof define_process_default === "object" && define_process_default.env && define_process_default.env.NODE_DEBUG && /\bsemver\b/i.test(define_process_default.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug;
  }
});

// node_modules/html-validate/node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/html-validate/node_modules/semver/internal/re.js"(exports, module) {
    init_define_process();
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src = exports.src = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/html-validate/node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/html-validate/node_modules/semver/internal/parse-options.js"(exports, module) {
    init_define_process();
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module.exports = parseOptions;
  }
});

// node_modules/html-validate/node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/html-validate/node_modules/semver/internal/identifiers.js"(exports, module) {
    init_define_process();
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/html-validate/node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/html-validate/node_modules/semver/classes/semver.js"(exports, module) {
    init_define_process();
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version2, options) {
        options = parseOptions(options);
        if (version2 instanceof _SemVer) {
          if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
            return version2;
          } else {
            version2 = version2.version;
          }
        } else if (typeof version2 !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version2}".`);
        }
        if (version2.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version2, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version2.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version2}`);
        }
        this.raw = version2;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (!identifier && identifierBase === false) {
              throw new Error("invalid increment argument: identifier is empty");
            }
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module.exports = SemVer;
  }
});

// node_modules/html-validate/node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/parse.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var parse3 = (version2, options, throwErrors = false) => {
      if (version2 instanceof SemVer) {
        return version2;
      }
      try {
        return new SemVer(version2, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module.exports = parse3;
  }
});

// node_modules/html-validate/node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/valid.js"(exports, module) {
    init_define_process();
    var parse3 = require_parse();
    var valid = (version2, options) => {
      const v = parse3(version2, options);
      return v ? v.version : null;
    };
    module.exports = valid;
  }
});

// node_modules/html-validate/node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/clean.js"(exports, module) {
    init_define_process();
    var parse3 = require_parse();
    var clean = (version2, options) => {
      const s = parse3(version2.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module.exports = clean;
  }
});

// node_modules/html-validate/node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/inc.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var inc = (version2, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version2 instanceof SemVer ? version2.version : version2,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module.exports = inc;
  }
});

// node_modules/html-validate/node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/diff.js"(exports, module) {
    init_define_process();
    var parse3 = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse3(version1, null, true);
      const v2 = parse3(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (highVersion.patch) {
          return "patch";
        }
        if (highVersion.minor) {
          return "minor";
        }
        return "major";
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module.exports = diff;
  }
});

// node_modules/html-validate/node_modules/semver/functions/major.js
var require_major = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/major.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module.exports = major;
  }
});

// node_modules/html-validate/node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/minor.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module.exports = minor;
  }
});

// node_modules/html-validate/node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/patch.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module.exports = patch;
  }
});

// node_modules/html-validate/node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/prerelease.js"(exports, module) {
    init_define_process();
    var parse3 = require_parse();
    var prerelease = (version2, options) => {
      const parsed = parse3(version2, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module.exports = prerelease;
  }
});

// node_modules/html-validate/node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/compare.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module.exports = compare;
  }
});

// node_modules/html-validate/node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/rcompare.js"(exports, module) {
    init_define_process();
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module.exports = rcompare;
  }
});

// node_modules/html-validate/node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/compare-loose.js"(exports, module) {
    init_define_process();
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module.exports = compareLoose;
  }
});

// node_modules/html-validate/node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/compare-build.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module.exports = compareBuild;
  }
});

// node_modules/html-validate/node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/sort.js"(exports, module) {
    init_define_process();
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module.exports = sort;
  }
});

// node_modules/html-validate/node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/rsort.js"(exports, module) {
    init_define_process();
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module.exports = rsort;
  }
});

// node_modules/html-validate/node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/gt.js"(exports, module) {
    init_define_process();
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module.exports = gt;
  }
});

// node_modules/html-validate/node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/lt.js"(exports, module) {
    init_define_process();
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module.exports = lt;
  }
});

// node_modules/html-validate/node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/eq.js"(exports, module) {
    init_define_process();
    var compare = require_compare();
    var eq2 = (a, b, loose) => compare(a, b, loose) === 0;
    module.exports = eq2;
  }
});

// node_modules/html-validate/node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/neq.js"(exports, module) {
    init_define_process();
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module.exports = neq;
  }
});

// node_modules/html-validate/node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/gte.js"(exports, module) {
    init_define_process();
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module.exports = gte;
  }
});

// node_modules/html-validate/node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/lte.js"(exports, module) {
    init_define_process();
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module.exports = lte;
  }
});

// node_modules/html-validate/node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/cmp.js"(exports, module) {
    init_define_process();
    var eq2 = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq2(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module.exports = cmp;
  }
});

// node_modules/html-validate/node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/coerce.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var parse3 = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version2, options) => {
      if (version2 instanceof SemVer) {
        return version2;
      }
      if (typeof version2 === "number") {
        version2 = String(version2);
      }
      if (typeof version2 !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version2.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version2)) && (!match || match.index + match[0].length !== version2.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse3(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module.exports = coerce;
  }
});

// node_modules/html-validate/node_modules/yallist/iterator.js
var require_iterator = __commonJS({
  "node_modules/html-validate/node_modules/yallist/iterator.js"(exports, module) {
    "use strict";
    init_define_process();
    module.exports = function(Yallist) {
      Yallist.prototype[Symbol.iterator] = function* () {
        for (let walker = this.head; walker; walker = walker.next) {
          yield walker.value;
        }
      };
    };
  }
});

// node_modules/html-validate/node_modules/yallist/yallist.js
var require_yallist = __commonJS({
  "node_modules/html-validate/node_modules/yallist/yallist.js"(exports, module) {
    "use strict";
    init_define_process();
    module.exports = Yallist;
    Yallist.Node = Node;
    Yallist.create = Yallist;
    function Yallist(list) {
      var self = this;
      if (!(self instanceof Yallist)) {
        self = new Yallist();
      }
      self.tail = null;
      self.head = null;
      self.length = 0;
      if (list && typeof list.forEach === "function") {
        list.forEach(function(item) {
          self.push(item);
        });
      } else if (arguments.length > 0) {
        for (var i = 0, l = arguments.length; i < l; i++) {
          self.push(arguments[i]);
        }
      }
      return self;
    }
    Yallist.prototype.removeNode = function(node) {
      if (node.list !== this) {
        throw new Error("removing node which does not belong to this list");
      }
      var next = node.next;
      var prev = node.prev;
      if (next) {
        next.prev = prev;
      }
      if (prev) {
        prev.next = next;
      }
      if (node === this.head) {
        this.head = next;
      }
      if (node === this.tail) {
        this.tail = prev;
      }
      node.list.length--;
      node.next = null;
      node.prev = null;
      node.list = null;
      return next;
    };
    Yallist.prototype.unshiftNode = function(node) {
      if (node === this.head) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var head = this.head;
      node.list = this;
      node.next = head;
      if (head) {
        head.prev = node;
      }
      this.head = node;
      if (!this.tail) {
        this.tail = node;
      }
      this.length++;
    };
    Yallist.prototype.pushNode = function(node) {
      if (node === this.tail) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var tail = this.tail;
      node.list = this;
      node.prev = tail;
      if (tail) {
        tail.next = node;
      }
      this.tail = node;
      if (!this.head) {
        this.head = node;
      }
      this.length++;
    };
    Yallist.prototype.push = function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        push(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.unshift = function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        unshift(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.pop = function() {
      if (!this.tail) {
        return void 0;
      }
      var res = this.tail.value;
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.shift = function() {
      if (!this.head) {
        return void 0;
      }
      var res = this.head.value;
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.forEach = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.head, i = 0; walker !== null; i++) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
      }
    };
    Yallist.prototype.forEachReverse = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
      }
    };
    Yallist.prototype.get = function(n) {
      for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
        walker = walker.next;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.getReverse = function(n) {
      for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
        walker = walker.prev;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.map = function(fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.head; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
      }
      return res;
    };
    Yallist.prototype.mapReverse = function(fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.tail; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
      }
      return res;
    };
    Yallist.prototype.reduce = function(fn, initial) {
      var acc;
      var walker = this.head;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
      } else {
        throw new TypeError("Reduce of empty list with no initial value");
      }
      for (var i = 0; walker !== null; i++) {
        acc = fn(acc, walker.value, i);
        walker = walker.next;
      }
      return acc;
    };
    Yallist.prototype.reduceReverse = function(fn, initial) {
      var acc;
      var walker = this.tail;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
      } else {
        throw new TypeError("Reduce of empty list with no initial value");
      }
      for (var i = this.length - 1; walker !== null; i--) {
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
      }
      return acc;
    };
    Yallist.prototype.toArray = function() {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.head; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.next;
      }
      return arr;
    };
    Yallist.prototype.toArrayReverse = function() {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.tail; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.prev;
      }
      return arr;
    };
    Yallist.prototype.slice = function(from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
        walker = walker.next;
      }
      for (; walker !== null && i < to; i++, walker = walker.next) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.sliceReverse = function(from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
        walker = walker.prev;
      }
      for (; walker !== null && i > from; i--, walker = walker.prev) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.splice = function(start, deleteCount, ...nodes) {
      if (start > this.length) {
        start = this.length - 1;
      }
      if (start < 0) {
        start = this.length + start;
      }
      for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
        walker = walker.next;
      }
      var ret = [];
      for (var i = 0; walker && i < deleteCount; i++) {
        ret.push(walker.value);
        walker = this.removeNode(walker);
      }
      if (walker === null) {
        walker = this.tail;
      }
      if (walker !== this.head && walker !== this.tail) {
        walker = walker.prev;
      }
      for (var i = 0; i < nodes.length; i++) {
        walker = insert(this, walker, nodes[i]);
      }
      return ret;
    };
    Yallist.prototype.reverse = function() {
      var head = this.head;
      var tail = this.tail;
      for (var walker = head; walker !== null; walker = walker.prev) {
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
      }
      this.head = tail;
      this.tail = head;
      return this;
    };
    function insert(self, node, value) {
      var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);
      if (inserted.next === null) {
        self.tail = inserted;
      }
      if (inserted.prev === null) {
        self.head = inserted;
      }
      self.length++;
      return inserted;
    }
    function push(self, item) {
      self.tail = new Node(item, self.tail, null, self);
      if (!self.head) {
        self.head = self.tail;
      }
      self.length++;
    }
    function unshift(self, item) {
      self.head = new Node(item, null, self.head, self);
      if (!self.tail) {
        self.tail = self.head;
      }
      self.length++;
    }
    function Node(value, prev, next, list) {
      if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
      }
      this.list = list;
      this.value = value;
      if (prev) {
        prev.next = this;
        this.prev = prev;
      } else {
        this.prev = null;
      }
      if (next) {
        next.prev = this;
        this.next = next;
      } else {
        this.next = null;
      }
    }
    try {
      require_iterator()(Yallist);
    } catch (er) {
    }
  }
});

// node_modules/html-validate/node_modules/lru-cache/index.js
var require_lru_cache = __commonJS({
  "node_modules/html-validate/node_modules/lru-cache/index.js"(exports, module) {
    "use strict";
    init_define_process();
    var Yallist = require_yallist();
    var MAX = Symbol("max");
    var LENGTH = Symbol("length");
    var LENGTH_CALCULATOR = Symbol("lengthCalculator");
    var ALLOW_STALE = Symbol("allowStale");
    var MAX_AGE = Symbol("maxAge");
    var DISPOSE = Symbol("dispose");
    var NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet");
    var LRU_LIST = Symbol("lruList");
    var CACHE = Symbol("cache");
    var UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet");
    var naiveLength = () => 1;
    var LRUCache = class {
      constructor(options) {
        if (typeof options === "number")
          options = { max: options };
        if (!options)
          options = {};
        if (options.max && (typeof options.max !== "number" || options.max < 0))
          throw new TypeError("max must be a non-negative number");
        const max = this[MAX] = options.max || Infinity;
        const lc = options.length || naiveLength;
        this[LENGTH_CALCULATOR] = typeof lc !== "function" ? naiveLength : lc;
        this[ALLOW_STALE] = options.stale || false;
        if (options.maxAge && typeof options.maxAge !== "number")
          throw new TypeError("maxAge must be a number");
        this[MAX_AGE] = options.maxAge || 0;
        this[DISPOSE] = options.dispose;
        this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
        this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
        this.reset();
      }
      // resize the cache when the max changes.
      set max(mL) {
        if (typeof mL !== "number" || mL < 0)
          throw new TypeError("max must be a non-negative number");
        this[MAX] = mL || Infinity;
        trim(this);
      }
      get max() {
        return this[MAX];
      }
      set allowStale(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
      }
      get allowStale() {
        return this[ALLOW_STALE];
      }
      set maxAge(mA) {
        if (typeof mA !== "number")
          throw new TypeError("maxAge must be a non-negative number");
        this[MAX_AGE] = mA;
        trim(this);
      }
      get maxAge() {
        return this[MAX_AGE];
      }
      // resize the cache when the lengthCalculator changes.
      set lengthCalculator(lC) {
        if (typeof lC !== "function")
          lC = naiveLength;
        if (lC !== this[LENGTH_CALCULATOR]) {
          this[LENGTH_CALCULATOR] = lC;
          this[LENGTH] = 0;
          this[LRU_LIST].forEach((hit) => {
            hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
            this[LENGTH] += hit.length;
          });
        }
        trim(this);
      }
      get lengthCalculator() {
        return this[LENGTH_CALCULATOR];
      }
      get length() {
        return this[LENGTH];
      }
      get itemCount() {
        return this[LRU_LIST].length;
      }
      rforEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this[LRU_LIST].tail; walker !== null; ) {
          const prev = walker.prev;
          forEachStep(this, fn, walker, thisp);
          walker = prev;
        }
      }
      forEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this[LRU_LIST].head; walker !== null; ) {
          const next = walker.next;
          forEachStep(this, fn, walker, thisp);
          walker = next;
        }
      }
      keys() {
        return this[LRU_LIST].toArray().map((k) => k.key);
      }
      values() {
        return this[LRU_LIST].toArray().map((k) => k.value);
      }
      reset() {
        if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
          this[LRU_LIST].forEach((hit) => this[DISPOSE](hit.key, hit.value));
        }
        this[CACHE] = /* @__PURE__ */ new Map();
        this[LRU_LIST] = new Yallist();
        this[LENGTH] = 0;
      }
      dump() {
        return this[LRU_LIST].map((hit) => isStale(this, hit) ? false : {
          k: hit.key,
          v: hit.value,
          e: hit.now + (hit.maxAge || 0)
        }).toArray().filter((h) => h);
      }
      dumpLru() {
        return this[LRU_LIST];
      }
      set(key, value, maxAge) {
        maxAge = maxAge || this[MAX_AGE];
        if (maxAge && typeof maxAge !== "number")
          throw new TypeError("maxAge must be a number");
        const now = maxAge ? Date.now() : 0;
        const len = this[LENGTH_CALCULATOR](value, key);
        if (this[CACHE].has(key)) {
          if (len > this[MAX]) {
            del(this, this[CACHE].get(key));
            return false;
          }
          const node = this[CACHE].get(key);
          const item = node.value;
          if (this[DISPOSE]) {
            if (!this[NO_DISPOSE_ON_SET])
              this[DISPOSE](key, item.value);
          }
          item.now = now;
          item.maxAge = maxAge;
          item.value = value;
          this[LENGTH] += len - item.length;
          item.length = len;
          this.get(key);
          trim(this);
          return true;
        }
        const hit = new Entry(key, value, len, now, maxAge);
        if (hit.length > this[MAX]) {
          if (this[DISPOSE])
            this[DISPOSE](key, value);
          return false;
        }
        this[LENGTH] += hit.length;
        this[LRU_LIST].unshift(hit);
        this[CACHE].set(key, this[LRU_LIST].head);
        trim(this);
        return true;
      }
      has(key) {
        if (!this[CACHE].has(key))
          return false;
        const hit = this[CACHE].get(key).value;
        return !isStale(this, hit);
      }
      get(key) {
        return get(this, key, true);
      }
      peek(key) {
        return get(this, key, false);
      }
      pop() {
        const node = this[LRU_LIST].tail;
        if (!node)
          return null;
        del(this, node);
        return node.value;
      }
      del(key) {
        del(this, this[CACHE].get(key));
      }
      load(arr) {
        this.reset();
        const now = Date.now();
        for (let l = arr.length - 1; l >= 0; l--) {
          const hit = arr[l];
          const expiresAt = hit.e || 0;
          if (expiresAt === 0)
            this.set(hit.k, hit.v);
          else {
            const maxAge = expiresAt - now;
            if (maxAge > 0) {
              this.set(hit.k, hit.v, maxAge);
            }
          }
        }
      }
      prune() {
        this[CACHE].forEach((value, key) => get(this, key, false));
      }
    };
    var get = (self, key, doUse) => {
      const node = self[CACHE].get(key);
      if (node) {
        const hit = node.value;
        if (isStale(self, hit)) {
          del(self, node);
          if (!self[ALLOW_STALE])
            return void 0;
        } else {
          if (doUse) {
            if (self[UPDATE_AGE_ON_GET])
              node.value.now = Date.now();
            self[LRU_LIST].unshiftNode(node);
          }
        }
        return hit.value;
      }
    };
    var isStale = (self, hit) => {
      if (!hit || !hit.maxAge && !self[MAX_AGE])
        return false;
      const diff = Date.now() - hit.now;
      return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
    };
    var trim = (self) => {
      if (self[LENGTH] > self[MAX]) {
        for (let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null; ) {
          const prev = walker.prev;
          del(self, walker);
          walker = prev;
        }
      }
    };
    var del = (self, node) => {
      if (node) {
        const hit = node.value;
        if (self[DISPOSE])
          self[DISPOSE](hit.key, hit.value);
        self[LENGTH] -= hit.length;
        self[CACHE].delete(hit.key);
        self[LRU_LIST].removeNode(node);
      }
    };
    var Entry = class {
      constructor(key, value, length, now, maxAge) {
        this.key = key;
        this.value = value;
        this.length = length;
        this.now = now;
        this.maxAge = maxAge || 0;
      }
    };
    var forEachStep = (self, fn, node, thisp) => {
      let hit = node.value;
      if (isStale(self, hit)) {
        del(self, node);
        if (!self[ALLOW_STALE])
          hit = void 0;
      }
      if (hit)
        fn.call(thisp, hit.value, hit.key, self);
    };
    module.exports = LRUCache;
  }
});

// node_modules/html-validate/node_modules/semver/classes/range.js
var require_range = __commonJS({
  "node_modules/html-validate/node_modules/semver/classes/range.js"(exports, module) {
    init_define_process();
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.format();
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().split(/\s+/).join(" ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.format();
      }
      format() {
        this.range = this.set.map((comps) => comps.join(" ").trim()).join("||").trim();
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache2.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache2.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version2) {
        if (!version2) {
          return false;
        }
        if (typeof version2 === "string") {
          try {
            version2 = new SemVer(version2, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version2, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Range;
    var LRU = require_lru_cache();
    var cache2 = new LRU({ max: 1e3 });
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version2, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version2)) {
          return false;
        }
      }
      if (version2.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// node_modules/html-validate/node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "node_modules/html-validate/node_modules/semver/classes/comparator.js"(exports, module) {
    init_define_process();
    var ANY = Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version2) {
        debug("Comparator.test", version2, this.options.loose);
        if (this.semver === ANY || version2 === ANY) {
          return true;
        }
        if (typeof version2 === "string") {
          try {
            version2 = new SemVer(version2, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version2, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// node_modules/html-validate/node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "node_modules/html-validate/node_modules/semver/functions/satisfies.js"(exports, module) {
    init_define_process();
    var Range = require_range();
    var satisfies = (version2, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version2);
    };
    module.exports = satisfies;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/to-comparators.js"(exports, module) {
    init_define_process();
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module.exports = toComparators;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/max-satisfying.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module.exports = maxSatisfying;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/min-satisfying.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module.exports = minSatisfying;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/min-version.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module.exports = minVersion;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/valid.js"(exports, module) {
    init_define_process();
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module.exports = validRange;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/outside.js"(exports, module) {
    init_define_process();
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version2, range, hilo, options) => {
      version2 = new SemVer(version2, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version2, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version2, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version2, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module.exports = outside;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/gtr.js"(exports, module) {
    init_define_process();
    var outside = require_outside();
    var gtr = (version2, range, options) => outside(version2, range, ">", options);
    module.exports = gtr;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/ltr.js"(exports, module) {
    init_define_process();
    var outside = require_outside();
    var ltr = (version2, range, options) => outside(version2, range, "<", options);
    module.exports = ltr;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/intersects.js"(exports, module) {
    init_define_process();
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module.exports = intersects;
  }
});

// node_modules/html-validate/node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/simplify.js"(exports, module) {
    init_define_process();
    var satisfies = require_satisfies();
    var compare = require_compare();
    module.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version2 of v) {
        const included = satisfies(version2, range, options);
        if (included) {
          prev = version2;
          if (!first) {
            first = version2;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// node_modules/html-validate/node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "node_modules/html-validate/node_modules/semver/ranges/subset.js"(exports, module) {
    init_define_process();
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER:
        for (const simpleSub of sub.set) {
          for (const simpleDom of dom.set) {
            const isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub) {
              continue OUTER;
            }
          }
          if (sawNonNull) {
            return false;
          }
        }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq2 of eqSet) {
        if (gt && !satisfies(eq2, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq2, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq2, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    };
    module.exports = subset;
  }
});

// node_modules/html-validate/node_modules/semver/index.js
var require_semver2 = __commonJS({
  "node_modules/html-validate/node_modules/semver/index.js"(exports, module) {
    init_define_process();
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse3 = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq2 = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module.exports = {
      parse: parse3,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq: eq2,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// vendor/html-validate.js
init_define_process();

// node_modules/html-validate/dist/es/browser.js
init_define_process();

// node_modules/html-validate/dist/es/core-browser.js
init_define_process();

// node_modules/html-validate/dist/es/core.js
init_define_process();
var import_ajv = __toESM(require_ajv(), 1);

// node_modules/html-validate/dist/es/elements.js
init_define_process();

// node_modules/html-validate/dist/es/meta-helper.js
init_define_process();

// node_modules/html-validate/dist/es/utils/natural-join.js
init_define_process();
function naturalJoin(values, conjunction = "or") {
  switch (values.length) {
    case 0:
      return "";
    case 1:
      return values[0];
    case 2:
      return `${values[0]} ${conjunction} ${values[1]}`;
    default:
      return `${values.slice(0, -1).join(", ")} ${conjunction} ${values.slice(-1)[0]}`;
  }
}

// node_modules/html-validate/dist/es/meta-helper.js
function defineMetadata(metatable) {
  return metatable;
}
function allowedIfAttributeIsPresent(...attr) {
  return (node) => {
    if (attr.some((it) => node.hasAttribute(it))) {
      return null;
    }
    const expected = naturalJoin(attr.map((it) => `"${it}"`));
    return `requires ${expected} attribute to be present`;
  };
}
function allowedIfAttributeIsAbsent(...attr) {
  return (node) => {
    const present = attr.filter((it) => node.hasAttribute(it));
    if (present.length === 0) {
      return null;
    }
    const expected = naturalJoin(present.map((it) => `"${it}"`));
    return `cannot be used at the same time as ${expected}`;
  };
}
function allowedIfAttributeHasValue(key, expectedValue, { defaultValue: defaultValue2 } = {}) {
  return (node) => {
    const attr = node.getAttribute(key);
    if (attr && typeof attr !== "string") {
      return null;
    }
    const actualValue = attr ? attr : defaultValue2;
    if (actualValue && expectedValue.includes(actualValue.toLocaleLowerCase())) {
      return null;
    }
    const expected = naturalJoin(expectedValue.map((it) => `"${it}"`));
    return `"${key}" attribute must be ${expected}`;
  };
}
function allowedIfParentIsPresent(...tags) {
  return (node) => {
    const match = tags.some((it) => node.closest(it));
    if (match) {
      return null;
    }
    const expected = naturalJoin(tags.map((it) => `<${it}>`));
    return `requires ${expected} as parent`;
  };
}
var metadataHelper = {
  allowedIfAttributeIsPresent,
  allowedIfAttributeIsAbsent,
  allowedIfAttributeHasValue,
  allowedIfParentIsPresent
};

// node_modules/html-validate/dist/es/elements.js
var {
  allowedIfAttributeIsPresent: allowedIfAttributeIsPresent2,
  allowedIfAttributeIsAbsent: allowedIfAttributeIsAbsent2,
  allowedIfAttributeHasValue: allowedIfAttributeHasValue2,
  allowedIfParentIsPresent: allowedIfParentIsPresent2
} = metadataHelper;
var validId = "/\\S+/";
var ReferrerPolicy = [
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
];
function isInsideLandmark(node) {
  const selectors2 = [
    "article",
    "aside",
    "main",
    "nav",
    "section",
    '[role="article"]',
    '[role="complementary"]',
    '[role="main"]',
    '[role="navigation"]',
    '[role="region"]'
  ];
  return Boolean(node.closest(selectors2.join(",")));
}
function linkBodyOk(node) {
  if (node.hasAttribute("itemprop")) {
    return true;
  }
  const rel = node.getAttribute("rel");
  if (!rel) {
    return false;
  }
  if (typeof rel !== "string") {
    return false;
  }
  const bodyOk = [
    "dns-prefetch",
    "modulepreload",
    "pingback",
    "preconnect",
    "prefetch",
    "preload",
    "stylesheet"
  ];
  const tokens = rel.toLowerCase().split(/\s+/);
  return tokens.some((keyword) => bodyOk.includes(keyword));
}
var html5 = defineMetadata({
  "*": {
    attributes: {
      contenteditable: {
        omit: true,
        enum: ["true", "false"]
      },
      contextmenu: {
        deprecated: true
      },
      dir: {
        enum: ["ltr", "rtl", "auto"]
      },
      draggable: {
        enum: ["true", "false"]
      },
      hidden: {
        boolean: true
      },
      id: {
        enum: [validId]
      },
      inert: {
        boolean: true
      },
      tabindex: {
        enum: ["/-?\\d+/"]
      }
    }
  },
  a: {
    flow: true,
    focusable(node) {
      return node.hasAttribute("href");
    },
    phrasing: true,
    interactive: true,
    transparent: true,
    attributes: {
      charset: {
        deprecated: true
      },
      coords: {
        deprecated: true
      },
      datafld: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      download: {
        allowed: allowedIfAttributeIsPresent2("href"),
        omit: true,
        enum: ["/.+/"]
      },
      href: {
        enum: ["/.*/"]
      },
      hreflang: {
        allowed: allowedIfAttributeIsPresent2("href")
      },
      itemprop: {
        allowed: allowedIfAttributeIsPresent2("href")
      },
      methods: {
        deprecated: true
      },
      name: {
        deprecated: true
      },
      ping: {
        allowed: allowedIfAttributeIsPresent2("href")
      },
      referrerpolicy: {
        allowed: allowedIfAttributeIsPresent2("href"),
        enum: ReferrerPolicy
      },
      rel: {
        allowed(node, attr) {
          if (!node.hasAttribute("href")) {
            return `requires "href" attribute to be present`;
          }
          if (!attr || attr === "" || typeof attr !== "string") {
            return null;
          }
          const disallowed = [
            /* whatwg */
            "canonical",
            "dns-prefetch",
            "expect",
            "icon",
            "manifest",
            "modulepreload",
            "pingback",
            "preconnect",
            "prefetch",
            "preload",
            "stylesheet",
            /* microformats.org */
            "apple-touch-icon",
            "apple-touch-icon-precomposed",
            "apple-touch-startup-image",
            "authorization_endpoint",
            "component",
            "chrome-webstore-item",
            "dns-prefetch",
            "edit",
            "gbfs",
            "gtfs-static",
            "gtfs-realtime",
            "import",
            "mask-icon",
            "meta",
            "micropub",
            "openid.delegate",
            "openid.server",
            "openid2.local_id",
            "openid2.provider",
            "p3pv1",
            "pgpkey",
            "schema.dcterms",
            "service",
            "shortlink",
            "sitemap",
            "subresource",
            "sword",
            "timesheet",
            "token_endpoint",
            "wlwmanifest",
            "stylesheet/less",
            "token_endpoint",
            "yandex-tableau-widget"
          ];
          const tokens = attr.toLowerCase().split(/\s+/);
          for (const keyword of tokens) {
            if (disallowed.includes(keyword)) {
              return `<a> does not allow rel="${keyword}"`;
            }
            if (keyword.startsWith("dcterms.")) {
              return `<a> does not allow rel="${keyword}"`;
            }
          }
          return null;
        },
        list: true,
        enum: ["/.+/"]
      },
      shape: {
        deprecated: true
      },
      target: {
        allowed: allowedIfAttributeIsPresent2("href"),
        enum: ["/[^_].*/", "_blank", "_self", "_parent", "_top"]
      },
      type: {
        allowed: allowedIfAttributeIsPresent2("href")
      },
      urn: {
        deprecated: true
      }
    },
    permittedDescendants: [{ exclude: "@interactive" }],
    aria: {
      implicitRole(node) {
        return node.hasAttribute("href") ? "link" : "generic";
      },
      naming(node) {
        return node.hasAttribute("href") ? "allowed" : "prohibited";
      }
    }
  },
  abbr: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      naming: "prohibited"
    }
  },
  acronym: {
    deprecated: {
      message: "use <abbr> instead",
      documentation: "`<abbr>` can be used as a replacement.",
      source: "html5"
    }
  },
  address: {
    flow: true,
    aria: {
      implicitRole: "group"
    },
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: ["address", "header", "footer", "@heading", "@sectioning"] }]
  },
  applet: {
    deprecated: {
      source: "html5"
    },
    attributes: {
      datafld: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      }
    }
  },
  area: {
    flow: ["isDescendant", "map"],
    focusable(node) {
      return node.hasAttribute("href");
    },
    phrasing: ["isDescendant", "map"],
    void: true,
    attributes: {
      alt: {},
      coords: {
        allowed(node) {
          const attr = node.getAttribute("shape");
          if (attr === "default") {
            return `cannot be used when "shape" attribute is "default"`;
          } else {
            return null;
          }
        }
      },
      download: {
        allowed: allowedIfAttributeIsPresent2("href")
      },
      nohref: {
        deprecated: true
      },
      itemprop: {
        allowed: allowedIfAttributeIsPresent2("href")
      },
      ping: {
        allowed: allowedIfAttributeIsPresent2("href")
      },
      referrerpolicy: {
        allowed: allowedIfAttributeIsPresent2("href"),
        enum: ReferrerPolicy
      },
      rel: {
        allowed(node, attr) {
          if (!node.hasAttribute("href")) {
            return `requires "href" attribute to be present`;
          }
          if (!attr || attr === "" || typeof attr !== "string") {
            return null;
          }
          const disallowed = [
            /* whatwg */
            "canonical",
            "dns-prefetch",
            "expect",
            "icon",
            "manifest",
            "modulepreload",
            "pingback",
            "preconnect",
            "prefetch",
            "preload",
            "stylesheet",
            /* microformats.org */
            "apple-touch-icon",
            "apple-touch-icon-precomposed",
            "apple-touch-startup-image",
            "authorization_endpoint",
            "component",
            "chrome-webstore-item",
            "dns-prefetch",
            "edit",
            "gbfs",
            "gtfs-static",
            "gtfs-realtime",
            "import",
            "mask-icon",
            "meta",
            "micropub",
            "openid.delegate",
            "openid.server",
            "openid2.local_id",
            "openid2.provider",
            "p3pv1",
            "pgpkey",
            "schema.dcterms",
            "service",
            "shortlink",
            "sitemap",
            "subresource",
            "sword",
            "timesheet",
            "token_endpoint",
            "wlwmanifest",
            "stylesheet/less",
            "token_endpoint",
            "yandex-tableau-widget"
          ];
          const tokens = attr.toLowerCase().split(/\s+/);
          for (const keyword of tokens) {
            if (disallowed.includes(keyword)) {
              return `<area> does not allow rel="${keyword}"`;
            }
            if (keyword.startsWith("dcterms.")) {
              return `<area> does not allow rel="${keyword}"`;
            }
          }
          return null;
        }
      },
      shape: {
        allowed(node, attr) {
          const shape = attr ?? "rect";
          switch (shape) {
            case "circ":
            case "circle":
            case "poly":
            case "polygon":
            case "rect":
            case "rectangle":
              return allowedIfAttributeIsPresent2("coords")(node, attr);
            default:
              return null;
          }
        },
        enum: ["rect", "circle", "poly", "default"]
      },
      target: {
        allowed: allowedIfAttributeIsPresent2("href"),
        enum: ["/[^_].*/", "_blank", "_self", "_parent", "_top"]
      }
    },
    aria: {
      implicitRole(node) {
        return node.hasAttribute("href") ? "link" : "generic";
      },
      naming(node) {
        return node.hasAttribute("href") ? "allowed" : "prohibited";
      }
    },
    requiredAncestors: ["map"]
  },
  article: {
    flow: true,
    sectioning: true,
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: ["main"] }],
    aria: {
      implicitRole: "article"
    }
  },
  aside: {
    flow: true,
    sectioning: true,
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: ["main"] }],
    aria: {
      implicitRole: "complementary"
    }
  },
  audio: {
    flow: true,
    focusable(node) {
      return node.hasAttribute("controls");
    },
    phrasing: true,
    embedded: true,
    interactive: ["hasAttribute", "controls"],
    transparent: ["@flow"],
    attributes: {
      crossorigin: {
        omit: true,
        enum: ["anonymous", "use-credentials"]
      },
      itemprop: {
        allowed: allowedIfAttributeIsPresent2("src")
      },
      preload: {
        omit: true,
        enum: ["none", "metadata", "auto"]
      }
    },
    permittedContent: ["@flow", "track", "source"],
    permittedDescendants: [{ exclude: ["audio", "video"] }],
    permittedOrder: ["source", "track", "@flow"]
  },
  b: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  base: {
    metadata: true,
    void: true,
    permittedParent: ["head"],
    aria: {
      naming: "prohibited"
    }
  },
  basefont: {
    deprecated: {
      message: "use CSS instead",
      documentation: "Use CSS `font-size` property instead.",
      source: "html4"
    }
  },
  bdi: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  bdo: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  bgsound: {
    deprecated: {
      message: "use <audio> instead",
      documentation: "Use the `<audio>` element instead but consider accessibility concerns with autoplaying sounds.",
      source: "non-standard"
    }
  },
  big: {
    deprecated: {
      message: "use CSS instead",
      documentation: "Use CSS `font-size` property instead.",
      source: "html5"
    }
  },
  blink: {
    deprecated: {
      documentation: "`<blink>` has no direct replacement and blinking text is frowned upon by accessibility standards.",
      source: "non-standard"
    }
  },
  blockquote: {
    flow: true,
    sectioning: true,
    aria: {
      implicitRole: "blockquote"
    },
    permittedContent: ["@flow"]
  },
  body: {
    permittedContent: ["@flow"],
    permittedParent: ["html"],
    attributes: {
      alink: {
        deprecated: true
      },
      background: {
        deprecated: true
      },
      bgcolor: {
        deprecated: true
      },
      link: {
        deprecated: true
      },
      marginbottom: {
        deprecated: true
      },
      marginheight: {
        deprecated: true
      },
      marginleft: {
        deprecated: true
      },
      marginright: {
        deprecated: true
      },
      margintop: {
        deprecated: true
      },
      marginwidth: {
        deprecated: true
      },
      text: {
        deprecated: true
      },
      vlink: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  br: {
    flow: true,
    phrasing: true,
    void: true,
    attributes: {
      clear: {
        deprecated: true
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  button: {
    flow: true,
    focusable: true,
    phrasing: true,
    interactive: true,
    formAssociated: {
      disablable: true,
      listed: true
    },
    labelable: true,
    attributes: {
      autofocus: {
        boolean: true
      },
      datafld: {
        deprecated: true
      },
      dataformatas: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      disabled: {
        boolean: true
      },
      formaction: {
        allowed: allowedIfAttributeHasValue2("type", ["submit"], { defaultValue: "submit" })
      },
      formenctype: {
        allowed: allowedIfAttributeHasValue2("type", ["submit"], { defaultValue: "submit" })
      },
      formmethod: {
        allowed: allowedIfAttributeHasValue2("type", ["submit"], { defaultValue: "submit" }),
        enum: ["get", "post", "dialog"]
      },
      formnovalidate: {
        allowed: allowedIfAttributeHasValue2("type", ["submit"], { defaultValue: "submit" }),
        boolean: true
      },
      formtarget: {
        allowed: allowedIfAttributeHasValue2("type", ["submit"], { defaultValue: "submit" }),
        enum: ["/[^_].*/", "_blank", "_self", "_parent", "_top"]
      },
      type: {
        enum: ["submit", "reset", "button"]
      }
    },
    aria: {
      implicitRole: "button"
    },
    permittedContent: ["@phrasing"],
    permittedDescendants: [{ exclude: ["@interactive"] }],
    textContent: "accessible"
  },
  canvas: {
    flow: true,
    phrasing: true,
    embedded: true,
    transparent: true
  },
  caption: {
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: ["table"] }],
    attributes: {
      align: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "caption",
      naming: "prohibited"
    }
  },
  center: {
    deprecated: {
      message: "use CSS instead",
      documentation: "Use the CSS `text-align` or `margin: auto` properties instead.",
      source: "html4"
    }
  },
  cite: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      naming: "prohibited"
    }
  },
  code: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "code",
      naming: "prohibited"
    }
  },
  col: {
    attributes: {
      align: {
        deprecated: true
      },
      char: {
        deprecated: true
      },
      charoff: {
        deprecated: true
      },
      span: {
        enum: ["/\\d+/"]
      },
      valign: {
        deprecated: true
      },
      width: {
        deprecated: true
      }
    },
    void: true,
    aria: {
      naming: "prohibited"
    }
  },
  colgroup: {
    implicitClosed: ["colgroup"],
    attributes: {
      span: {
        enum: ["/\\d+/"]
      }
    },
    permittedContent: ["col", "template"],
    aria: {
      naming: "prohibited"
    }
  },
  data: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  datalist: {
    flow: true,
    phrasing: true,
    aria: {
      implicitRole: "listbox",
      naming: "prohibited"
    },
    permittedContent: ["@phrasing", "option"]
  },
  dd: {
    implicitClosed: ["dd", "dt"],
    permittedContent: ["@flow"],
    requiredAncestors: ["dl > dd", "dl > div > dd"]
  },
  del: {
    flow: true,
    phrasing: true,
    transparent: true,
    aria: {
      implicitRole: "deletion",
      naming: "prohibited"
    }
  },
  details: {
    flow: true,
    sectioning: true,
    interactive: true,
    attributes: {
      open: {
        boolean: true
      }
    },
    aria: {
      implicitRole: "group"
    },
    permittedContent: ["summary", "@flow"],
    permittedOrder: ["summary", "@flow"],
    requiredContent: ["summary"]
  },
  dfn: {
    flow: true,
    phrasing: true,
    aria: {
      implicitRole: "term"
    },
    permittedContent: ["@phrasing"],
    permittedDescendants: [{ exclude: ["dfn"] }]
  },
  dialog: {
    flow: true,
    permittedContent: ["@flow"],
    attributes: {
      open: {
        boolean: true
      }
    },
    aria: {
      implicitRole: "dialog"
    }
  },
  dir: {
    deprecated: {
      documentation: "The non-standard `<dir>` element has no direct replacement but MDN recommends replacing with `<ul>` and CSS.",
      source: "html4"
    }
  },
  div: {
    flow: true,
    permittedContent: ["@flow", "dt", "dd"],
    attributes: {
      align: {
        deprecated: true
      },
      datafld: {
        deprecated: true
      },
      dataformatas: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  dl: {
    flow: true,
    permittedContent: ["@script", "dt", "dd", "div"],
    attributes: {
      compact: {
        deprecated: true
      }
    }
  },
  dt: {
    implicitClosed: ["dd", "dt"],
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: ["header", "footer", "@sectioning", "@heading"] }],
    requiredAncestors: ["dl > dt", "dl > div > dt"]
  },
  em: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "emphasis",
      naming: "prohibited"
    }
  },
  embed: {
    flow: true,
    phrasing: true,
    embedded: true,
    interactive: true,
    void: true,
    attributes: {
      src: {
        required: true,
        enum: ["/.+/"]
      },
      title: {
        required: true
      }
    }
  },
  fieldset: {
    flow: true,
    formAssociated: {
      disablable: true,
      listed: true
    },
    attributes: {
      datafld: {
        deprecated: true
      },
      disabled: {
        boolean: true
      }
    },
    aria: {
      implicitRole: "group"
    },
    permittedContent: ["@flow", "legend?"],
    permittedOrder: ["legend", "@flow"]
  },
  figcaption: {
    permittedContent: ["@flow"],
    aria: {
      naming: "prohibited"
    }
  },
  figure: {
    flow: true,
    aria: {
      implicitRole: "figure"
    },
    permittedContent: ["@flow", "figcaption?"],
    permittedOrder: ["figcaption", "@flow", "figcaption"]
  },
  font: {
    deprecated: {
      message: "use CSS instead",
      documentation: "Use CSS font properties instead.",
      source: "html4"
    }
  },
  footer: {
    flow: true,
    aria: {
      implicitRole(node) {
        if (isInsideLandmark(node)) {
          return "generic";
        } else {
          return "contentinfo";
        }
      },
      naming(node) {
        if (isInsideLandmark(node)) {
          return "prohibited";
        } else {
          return "allowed";
        }
      }
    },
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: ["header", "footer", "main"] }]
  },
  form: {
    flow: true,
    form: true,
    attributes: {
      action: {
        enum: [/^\s*\S+\s*$/]
      },
      accept: {
        deprecated: true
      },
      autocomplete: {
        enum: ["on", "off"]
      },
      method: {
        enum: ["get", "post", "dialog"]
      },
      novalidate: {
        boolean: true
      },
      rel: {
        allowed(_, attr) {
          if (!attr || attr === "" || typeof attr !== "string") {
            return null;
          }
          const disallowed = [
            /* whatwg */
            "alternate",
            "canonical",
            "author",
            "bookmark",
            "dns-prefetch",
            "expect",
            "icon",
            "manifest",
            "modulepreload",
            "pingback",
            "preconnect",
            "prefetch",
            "preload",
            "privacy-policy",
            "stylesheet",
            "tag",
            "terms-of-service"
          ];
          const tokens = attr.toLowerCase().split(/\s+/);
          for (const keyword of tokens) {
            if (disallowed.includes(keyword)) {
              return `<form> does not allow rel="${keyword}"`;
            }
          }
          return null;
        },
        list: true,
        enum: ["/.+/"]
      },
      target: {
        enum: ["/[^_].*/", "_blank", "_self", "_parent", "_top"]
      }
    },
    aria: {
      implicitRole: "form"
    },
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: ["@form"] }]
  },
  frame: {
    deprecated: {
      documentation: "The `<frame>` element can be replaced with the `<iframe>` element but a better solution is to remove usage of frames entirely.",
      source: "html5"
    },
    attributes: {
      datafld: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      title: {
        required: true
      }
    }
  },
  frameset: {
    deprecated: {
      documentation: "The `<frameset>` element can be replaced with the `<iframe>` element but a better solution is to remove usage of frames entirely.",
      source: "html5"
    }
  },
  h1: {
    flow: true,
    heading: true,
    permittedContent: ["@phrasing"],
    attributes: {
      align: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "heading"
    }
  },
  h2: {
    flow: true,
    heading: true,
    permittedContent: ["@phrasing"],
    attributes: {
      align: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "heading"
    }
  },
  h3: {
    flow: true,
    heading: true,
    permittedContent: ["@phrasing"],
    attributes: {
      align: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "heading"
    }
  },
  h4: {
    flow: true,
    heading: true,
    permittedContent: ["@phrasing"],
    attributes: {
      align: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "heading"
    }
  },
  h5: {
    flow: true,
    heading: true,
    permittedContent: ["@phrasing"],
    attributes: {
      align: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "heading"
    }
  },
  h6: {
    flow: true,
    heading: true,
    permittedContent: ["@phrasing"],
    attributes: {
      align: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "heading"
    }
  },
  head: {
    permittedContent: ["base?", "title?", "@meta"],
    permittedParent: ["html"],
    requiredContent: ["title"],
    attributes: {
      profile: {
        deprecated: true
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  header: {
    flow: true,
    aria: {
      implicitRole(node) {
        if (isInsideLandmark(node)) {
          return "generic";
        } else {
          return "banner";
        }
      },
      naming(node) {
        if (isInsideLandmark(node)) {
          return "prohibited";
        } else {
          return "allowed";
        }
      }
    },
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: ["header", "footer", "main"] }]
  },
  hgroup: {
    flow: true,
    heading: true,
    permittedContent: ["p", "@heading?"],
    permittedDescendants: [{ exclude: ["hgroup"] }],
    requiredContent: ["@heading"],
    aria: {
      implicitRole: "group"
    }
  },
  hr: {
    flow: true,
    void: true,
    attributes: {
      align: {
        deprecated: true
      },
      color: {
        deprecated: true
      },
      noshade: {
        deprecated: true
      },
      size: {
        deprecated: true
      },
      width: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "separator"
    }
  },
  html: {
    permittedContent: ["head?", "body?"],
    permittedOrder: ["head", "body"],
    requiredContent: ["head", "body"],
    attributes: {
      lang: {
        required: true
      },
      version: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "document",
      naming: "prohibited"
    }
  },
  i: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  iframe: {
    flow: true,
    phrasing: true,
    embedded: true,
    interactive: true,
    attributes: {
      align: {
        deprecated: true
      },
      allowtransparency: {
        deprecated: true
      },
      datafld: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      frameborder: {
        deprecated: true
      },
      hspace: {
        deprecated: true
      },
      marginheight: {
        deprecated: true
      },
      marginwidth: {
        deprecated: true
      },
      referrerpolicy: {
        enum: ReferrerPolicy
      },
      scrolling: {
        deprecated: true
      },
      src: {
        enum: ["/.+/"]
      },
      title: {
        required: true
      },
      vspace: {
        deprecated: true
      }
    },
    permittedContent: []
  },
  img: {
    flow: true,
    phrasing: true,
    embedded: true,
    interactive: ["hasAttribute", "usemap"],
    void: true,
    attributes: {
      align: {
        deprecated: true
      },
      border: {
        deprecated: true
      },
      crossorigin: {
        omit: true,
        enum: ["anonymous", "use-credentials"]
      },
      datafld: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      decoding: {
        enum: ["sync", "async", "auto"]
      },
      hspace: {
        deprecated: true
      },
      ismap: {
        boolean: true
      },
      lowsrc: {
        deprecated: true
      },
      name: {
        deprecated: true
      },
      referrerpolicy: {
        enum: ReferrerPolicy
      },
      src: {
        required: true,
        enum: ["/.+/"]
      },
      srcset: {
        enum: ["/[^]+/"]
      },
      vspace: {
        deprecated: true
      }
    },
    aria: {
      implicitRole(node) {
        const alt = node.getAttribute("alt");
        const ariaLabel = node.getAttribute("aria-label");
        const ariaLabelledBy = node.getAttribute("aria-labelledby");
        const title2 = node.getAttribute("title");
        if (alt === "" && !ariaLabel && !ariaLabelledBy && !title2) {
          return "none";
        } else {
          return "img";
        }
      },
      naming(node) {
        const alt = node.getAttribute("alt");
        const ariaLabel = node.getAttribute("aria-label");
        const ariaLabelledBy = node.getAttribute("aria-labelledby");
        const title2 = node.getAttribute("title");
        if (!alt && !ariaLabel && !ariaLabelledBy && !title2) {
          return "prohibited";
        } else {
          return "allowed";
        }
      }
    }
  },
  input: {
    flow: true,
    focusable(node) {
      return node.getAttribute("type") !== "hidden";
    },
    phrasing: true,
    interactive: ["matchAttribute", ["type", "!=", "hidden"]],
    void: true,
    formAssociated: {
      disablable: true,
      listed: true
    },
    labelable: ["matchAttribute", ["type", "!=", "hidden"]],
    attributes: {
      align: {
        deprecated: true
      },
      autofocus: {
        boolean: true
      },
      capture: {
        omit: true,
        enum: ["environment", "user"]
      },
      checked: {
        boolean: true
      },
      datafld: {
        deprecated: true
      },
      dataformatas: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      disabled: {
        boolean: true
      },
      formaction: {
        allowed: allowedIfAttributeHasValue2("type", ["submit", "image"], {
          defaultValue: "submit"
        })
      },
      formenctype: {
        allowed: allowedIfAttributeHasValue2("type", ["submit", "image"], {
          defaultValue: "submit"
        })
      },
      formmethod: {
        allowed: allowedIfAttributeHasValue2("type", ["submit", "image"], {
          defaultValue: "submit"
        }),
        enum: ["get", "post", "dialog"]
      },
      formnovalidate: {
        allowed: allowedIfAttributeHasValue2("type", ["submit", "image"], {
          defaultValue: "submit"
        }),
        boolean: true
      },
      formtarget: {
        allowed: allowedIfAttributeHasValue2("type", ["submit", "image"], {
          defaultValue: "submit"
        }),
        enum: ["/[^_].*/", "_blank", "_self", "_parent", "_top"]
      },
      hspace: {
        deprecated: true
      },
      inputmode: {
        enum: ["none", "text", "decimal", "numeric", "tel", "search", "email", "url"]
      },
      ismap: {
        deprecated: true
      },
      multiple: {
        boolean: true
      },
      readonly: {
        boolean: true
      },
      required: {
        boolean: true
      },
      spellcheck: {
        enum: ["default", "false", "true"]
      },
      type: {
        enum: [
          "button",
          "checkbox",
          "color",
          "date",
          "datetime-local",
          "email",
          "file",
          "hidden",
          "image",
          "month",
          "number",
          "password",
          "radio",
          "range",
          "reset",
          "search",
          "submit",
          "tel",
          "text",
          "time",
          "url",
          "week"
        ]
      },
      usemap: {
        deprecated: true
      },
      vspace: {
        deprecated: true
      }
    },
    aria: {
      /* eslint-disable-next-line complexity -- the standard is complicated */
      implicitRole(node) {
        const list = node.hasAttribute("list");
        if (list) {
          return "combobox";
        }
        const type2 = node.getAttribute("type");
        switch (type2) {
          case "button":
            return "button";
          case "checkbox":
            return "checkbox";
          case "color":
            return null;
          case "date":
            return null;
          case "datetime-local":
            return null;
          case "email":
            return "textbox";
          case "file":
            return null;
          case "hidden":
            return null;
          case "image":
            return "button";
          case "month":
            return null;
          case "number":
            return "spinbutton";
          case "password":
            return null;
          case "radio":
            return "radio";
          case "range":
            return "slider";
          case "reset":
            return "button";
          case "search":
            return "searchbox";
          case "submit":
            return "button";
          case "tel":
            return "textbox";
          case "text":
            return "textbox";
          case "time":
            return null;
          case "url":
            return "textbox";
          case "week":
            return null;
          default:
            return "textbox";
        }
      },
      naming(node) {
        return node.getAttribute("type") !== "hidden" ? "allowed" : "prohibited";
      }
    }
  },
  ins: {
    flow: true,
    phrasing: true,
    transparent: true,
    aria: {
      implicitRole: "insertion",
      naming: "prohibited"
    }
  },
  isindex: {
    deprecated: {
      source: "html4"
    }
  },
  kbd: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      naming: "prohibited"
    }
  },
  keygen: {
    flow: true,
    phrasing: true,
    interactive: true,
    void: true,
    labelable: true,
    deprecated: true
  },
  label: {
    flow: true,
    phrasing: true,
    interactive: true,
    permittedContent: ["@phrasing"],
    permittedDescendants: [{ exclude: ["label"] }],
    attributes: {
      datafld: {
        deprecated: true
      },
      dataformatas: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      for: {
        enum: [validId]
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  legend: {
    permittedContent: ["@phrasing", "@heading"],
    attributes: {
      align: {
        deprecated: true
      },
      datafld: {
        deprecated: true
      },
      dataformatas: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  li: {
    implicitClosed: ["li"],
    permittedContent: ["@flow"],
    permittedParent: ["ul", "ol", "menu", "template"],
    attributes: {
      type: {
        deprecated: true
      }
    },
    aria: {
      implicitRole(node) {
        return node.closest("ul, ol, menu") ? "listitem" : "generic";
      }
    }
  },
  link: {
    metadata: true,
    flow(node) {
      return linkBodyOk(node);
    },
    phrasing(node) {
      return linkBodyOk(node);
    },
    void: true,
    attributes: {
      as: {
        allowed: allowedIfAttributeHasValue2("rel", ["prefetch", "preload", "modulepreload"]),
        enum: [
          "audio",
          "audioworklet",
          "document",
          "embed",
          "fetch",
          "font",
          "frame",
          "iframe",
          "image",
          "manifest",
          "object",
          "paintworklet",
          "report",
          "script",
          "serviceworker",
          "sharedworker",
          "style",
          "track",
          "video",
          "webidentity",
          "worker",
          "xslt"
        ]
      },
      blocking: {
        allowed: allowedIfAttributeHasValue2("rel", ["stylesheet", "preload", "modulepreload"]),
        list: true,
        enum: ["render"]
      },
      charset: {
        deprecated: true
      },
      crossorigin: {
        omit: true,
        enum: ["anonymous", "use-credentials"]
      },
      disabled: {
        allowed: allowedIfAttributeHasValue2("rel", ["stylesheet"]),
        boolean: true
      },
      href: {
        required: true,
        enum: ["/.+/"]
      },
      integrity: {
        allowed: allowedIfAttributeHasValue2("rel", ["stylesheet", "preload", "modulepreload"]),
        enum: ["/.+/"]
      },
      methods: {
        deprecated: true
      },
      referrerpolicy: {
        enum: ReferrerPolicy
      },
      rel: {
        allowed(_, attr) {
          if (!attr || attr === "" || typeof attr !== "string") {
            return null;
          }
          const disallowed = [
            /* whatwg */
            "bookmark",
            "external",
            "nofollow",
            "noopener",
            "noreferrer",
            "opener",
            "tag",
            /* microformats.org */
            "disclosure",
            "entry-content",
            "lightbox",
            "lightvideo"
          ];
          const tokens = attr.toLowerCase().split(/\s+/);
          for (const keyword of tokens) {
            if (disallowed.includes(keyword)) {
              return `<link> does not allow rel="${keyword}"`;
            }
          }
          return null;
        },
        list: true,
        enum: ["/.+/"]
      },
      target: {
        deprecated: true
      },
      urn: {
        deprecated: true
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  listing: {
    deprecated: {
      source: "html32"
    }
  },
  main: {
    flow: true,
    aria: {
      implicitRole: "main"
    }
  },
  map: {
    flow: true,
    phrasing: true,
    transparent: true,
    attributes: {
      name: {
        required: true,
        enum: ["/\\S+/"]
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  mark: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      naming: "prohibited"
    }
  },
  marquee: {
    deprecated: {
      documentation: "Marked as obsolete by both W3C and WHATWG standards but still implemented in most browsers. Animated text should be avoided for accessibility reasons as well.",
      source: "html5"
    },
    attributes: {
      datafld: {
        deprecated: true
      },
      dataformatas: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      }
    }
  },
  math: {
    flow: true,
    foreign: true,
    phrasing: true,
    embedded: true,
    attributes: {
      align: {
        deprecated: true
      },
      dir: {
        enum: ["ltr", "rtl"]
      },
      display: {
        enum: ["block", "inline"]
      },
      hspace: {
        deprecated: true
      },
      name: {
        deprecated: true
      },
      overflow: {
        enum: ["linebreak", "scroll", "elide", "truncate", "scale"]
      },
      vspace: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "math"
    }
  },
  menu: {
    flow: true,
    aria: {
      implicitRole: "list"
    },
    permittedContent: ["@script", "li"]
  },
  meta: {
    flow: ["hasAttribute", "itemprop"],
    phrasing: ["hasAttribute", "itemprop"],
    metadata: true,
    void: true,
    attributes: {
      charset: {
        enum: ["utf-8"]
      },
      content: {
        allowed: allowedIfAttributeIsPresent2("name", "http-equiv", "itemprop", "property")
      },
      itemprop: {
        allowed: allowedIfAttributeIsAbsent2("http-equiv", "name")
      },
      name: {
        allowed: allowedIfAttributeIsAbsent2("http-equiv", "itemprop")
      },
      "http-equiv": {
        allowed: allowedIfAttributeIsAbsent2("name", "itemprop")
      },
      scheme: {
        deprecated: true
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  meter: {
    flow: true,
    phrasing: true,
    labelable: true,
    aria: {
      implicitRole: "meter"
    },
    permittedContent: ["@phrasing"],
    permittedDescendants: [{ exclude: "meter" }]
  },
  multicol: {
    deprecated: {
      message: "use CSS instead",
      documentation: "Use CSS columns instead.",
      source: "html5"
    }
  },
  nav: {
    flow: true,
    sectioning: true,
    aria: {
      implicitRole: "navigation"
    },
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: "main" }]
  },
  nextid: {
    deprecated: {
      source: "html32"
    }
  },
  nobr: {
    deprecated: {
      message: "use CSS instead",
      documentation: "Use CSS `white-space` property instead.",
      source: "non-standard"
    }
  },
  noembed: {
    deprecated: {
      source: "non-standard"
    }
  },
  noframes: {
    deprecated: {
      source: "html5"
    }
  },
  noscript: {
    metadata: true,
    flow: true,
    phrasing: true,
    transparent: true,
    permittedDescendants: [{ exclude: "noscript" }],
    aria: {
      naming: "prohibited"
    }
  },
  object: {
    flow: true,
    phrasing: true,
    embedded: true,
    interactive: ["hasAttribute", "usemap"],
    transparent: true,
    formAssociated: {
      disablable: false,
      listed: true
    },
    attributes: {
      align: {
        deprecated: true
      },
      archive: {
        deprecated: true
      },
      blocking: {
        list: true,
        enum: ["render"]
      },
      border: {
        deprecated: true
      },
      classid: {
        deprecated: true
      },
      code: {
        deprecated: true
      },
      codebase: {
        deprecated: true
      },
      codetype: {
        deprecated: true
      },
      data: {
        enum: ["/.+/"],
        required: true
      },
      datafld: {
        deprecated: true
      },
      dataformatas: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      declare: {
        deprecated: true
      },
      hspace: {
        deprecated: true
      },
      name: {
        enum: ["/[^_].*/"]
      },
      standby: {
        deprecated: true
      },
      vspace: {
        deprecated: true
      }
    },
    permittedContent: ["param", "@flow"],
    permittedOrder: ["param", "@flow"]
  },
  ol: {
    flow: true,
    attributes: {
      compact: {
        deprecated: true
      },
      reversed: {
        boolean: true
      },
      type: {
        enum: ["a", "A", "i", "I", "1"]
      }
    },
    aria: {
      implicitRole: "list"
    },
    permittedContent: ["@script", "li"]
  },
  optgroup: {
    implicitClosed: ["optgroup"],
    attributes: {
      disabled: {
        boolean: true
      }
    },
    aria: {
      implicitRole: "group"
    },
    permittedContent: ["@script", "option"]
  },
  option: {
    implicitClosed: ["option"],
    attributes: {
      dataformatas: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      disabled: {
        boolean: true
      },
      name: {
        deprecated: true
      },
      selected: {
        boolean: true
      }
    },
    aria: {
      implicitRole: "option"
    },
    permittedContent: []
  },
  output: {
    flow: true,
    phrasing: true,
    formAssociated: {
      disablable: false,
      listed: true
    },
    labelable: true,
    aria: {
      implicitRole: "status"
    },
    permittedContent: ["@phrasing"]
  },
  p: {
    flow: true,
    implicitClosed: [
      "address",
      "article",
      "aside",
      "blockquote",
      "div",
      "dl",
      "fieldset",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "hr",
      "main",
      "nav",
      "ol",
      "p",
      "pre",
      "section",
      "table",
      "ul"
    ],
    permittedContent: ["@phrasing"],
    attributes: {
      align: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "paragraph",
      naming: "prohibited"
    }
  },
  param: {
    void: true,
    attributes: {
      datafld: {
        deprecated: true
      },
      type: {
        deprecated: true
      },
      valuetype: {
        deprecated: true
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  picture: {
    flow: true,
    phrasing: true,
    embedded: true,
    permittedContent: ["@script", "source", "img"],
    permittedOrder: ["source", "img"],
    aria: {
      naming: "prohibited"
    }
  },
  plaintext: {
    deprecated: {
      message: "use <pre> or CSS instead",
      documentation: "Use the `<pre>` element or use CSS to set a monospace font.",
      source: "html2"
    }
  },
  pre: {
    flow: true,
    permittedContent: ["@phrasing"],
    attributes: {
      width: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  progress: {
    flow: true,
    phrasing: true,
    labelable: true,
    aria: {
      implicitRole: "progressbar"
    },
    permittedContent: ["@phrasing"],
    permittedDescendants: [{ exclude: "progress" }]
  },
  q: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  rb: {
    implicitClosed: ["rb", "rt", "rtc", "rp"],
    permittedContent: ["@phrasing"]
  },
  rp: {
    implicitClosed: ["rb", "rt", "rtc", "rp"],
    permittedContent: ["@phrasing"],
    aria: {
      naming: "prohibited"
    }
  },
  rt: {
    implicitClosed: ["rb", "rt", "rtc", "rp"],
    permittedContent: ["@phrasing"],
    aria: {
      naming: "prohibited"
    }
  },
  rtc: {
    implicitClosed: ["rb", "rtc", "rp"],
    permittedContent: ["@phrasing", "rt"]
  },
  ruby: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing", "rb", "rp", "rt", "rtc"]
  },
  s: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "deletion",
      naming: "prohibited"
    }
  },
  samp: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  script: {
    metadata: true,
    flow: true,
    phrasing: true,
    scriptSupporting: true,
    attributes: {
      async: {
        boolean: true
      },
      crossorigin: {
        omit: true,
        enum: ["anonymous", "use-credentials"]
      },
      defer: {
        boolean: true
      },
      event: {
        deprecated: true
      },
      for: {
        deprecated: true
      },
      integrity: {
        allowed: allowedIfAttributeIsPresent2("src"),
        enum: ["/.+/"]
      },
      language: {
        deprecated: true
      },
      nomodule: {
        boolean: true
      },
      referrerpolicy: {
        enum: ReferrerPolicy
      },
      src: {
        enum: ["/.+/"]
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  search: {
    flow: true,
    aria: {
      implicitRole: "search"
    }
  },
  section: {
    flow: true,
    sectioning: true,
    aria: {
      implicitRole(node) {
        const name = node.hasAttribute("aria-label") || node.hasAttribute("aria-labelledby");
        return name ? "region" : "generic";
      }
    },
    permittedContent: ["@flow"]
  },
  select: {
    flow: true,
    focusable: true,
    phrasing: true,
    interactive: true,
    formAssociated: {
      disablable: true,
      listed: true
    },
    labelable: true,
    attributes: {
      autofocus: {
        boolean: true
      },
      disabled: {
        boolean: true
      },
      multiple: {
        boolean: true
      },
      required: {
        boolean: true
      },
      size: {
        enum: ["/\\d+/"]
      }
    },
    aria: {
      implicitRole(node) {
        const multiple = node.hasAttribute("multiple");
        if (multiple) {
          return "listbox";
        }
        const size = node.getAttribute("size");
        if (typeof size === "string") {
          const parsed = parseInt(size, 10);
          if (parsed > 1) {
            return "listbox";
          }
        }
        return "combobox";
      }
    },
    permittedContent: ["@script", "datasrc", "datafld", "dataformatas", "option", "optgroup"]
  },
  slot: {
    flow: true,
    phrasing: true,
    transparent: true,
    aria: {
      naming: "prohibited"
    }
  },
  small: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  source: {
    void: true,
    attributes: {
      type: {},
      media: {},
      src: {
        allowed: allowedIfParentIsPresent2("audio", "video")
      },
      srcset: {
        allowed: allowedIfParentIsPresent2("picture")
      },
      sizes: {
        allowed: allowedIfParentIsPresent2("picture")
      },
      width: {
        allowed: allowedIfParentIsPresent2("picture"),
        enum: ["/\\d+/"]
      },
      height: {
        allowed: allowedIfParentIsPresent2("picture"),
        enum: ["/\\d+/"]
      }
    },
    aria: {
      naming: "prohibited"
    }
  },
  spacer: {
    deprecated: {
      message: "use CSS instead",
      documentation: "Use CSS margin or padding instead.",
      source: "non-standard"
    }
  },
  span: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    attributes: {
      datafld: {
        deprecated: true
      },
      dataformatas: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  strike: {
    deprecated: {
      message: "use <del> or <s> instead",
      documentation: "Use the `<del>` or `<s>` element instead.",
      source: "html5"
    }
  },
  strong: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "strong",
      naming: "prohibited"
    }
  },
  style: {
    metadata: true,
    aria: {
      naming: "prohibited"
    }
  },
  sub: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "subscript",
      naming: "prohibited"
    }
  },
  summary: {
    permittedContent: ["@phrasing", "@heading"],
    focusable(node) {
      return Boolean(node.closest("details"));
    },
    aria: {
      implicitRole: "button"
    }
  },
  sup: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "superscript",
      naming: "prohibited"
    }
  },
  svg: {
    flow: true,
    foreign: true,
    phrasing: true,
    embedded: true,
    aria: {
      implicitRole: "graphics-document"
    }
  },
  /* while not part of HTML 5 specification these two elements are handled as
   * special cases to allow them as accessible text and to avoid issues with
   * "no-unknown-elements" they are added here */
  "svg:desc": {},
  "svg:title": {},
  table: {
    flow: true,
    permittedContent: ["@script", "caption?", "colgroup", "tbody", "tfoot?", "thead?", "tr"],
    permittedOrder: ["caption", "colgroup", "thead", "tbody", "tr", "tfoot"],
    attributes: {
      align: {
        deprecated: true
      },
      background: {
        deprecated: true
      },
      bgcolor: {
        deprecated: true
      },
      bordercolor: {
        deprecated: true
      },
      cellpadding: {
        deprecated: true
      },
      cellspacing: {
        deprecated: true
      },
      dataformatas: {
        deprecated: true
      },
      datapagesize: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      frame: {
        deprecated: true
      },
      rules: {
        deprecated: true
      },
      summary: {
        deprecated: true
      },
      width: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "table"
    }
  },
  tbody: {
    implicitClosed: ["tbody", "tfoot"],
    permittedContent: ["@script", "tr"],
    attributes: {
      align: {
        deprecated: true
      },
      background: {
        deprecated: true
      },
      char: {
        deprecated: true
      },
      charoff: {
        deprecated: true
      },
      valign: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "rowgroup"
    }
  },
  td: {
    flow: true,
    implicitClosed: ["td", "th"],
    attributes: {
      align: {
        deprecated: true
      },
      axis: {
        deprecated: true
      },
      background: {
        deprecated: true
      },
      bgcolor: {
        deprecated: true
      },
      char: {
        deprecated: true
      },
      charoff: {
        deprecated: true
      },
      colspan: {
        enum: ["/\\d+/"]
      },
      height: {
        deprecated: true
      },
      nowrap: {
        deprecated: true
      },
      rowspan: {
        enum: ["/\\d+/"]
      },
      scope: {
        deprecated: true
      },
      valign: {
        deprecated: true
      },
      width: {
        deprecated: true
      }
    },
    aria: {
      implicitRole(node) {
        const table2 = node.closest("table");
        const tableRole = (table2 == null ? void 0 : table2.getAttribute("role")) ?? "table";
        switch (tableRole) {
          case "table":
            return "cell";
          case "grid":
          case "treegrid":
            return "gridcell";
          default:
            return null;
        }
      }
    },
    permittedContent: ["@flow"]
  },
  template: {
    metadata: true,
    flow: true,
    phrasing: true,
    scriptSupporting: true,
    aria: {
      naming: "prohibited"
    }
  },
  textarea: {
    flow: true,
    focusable: true,
    phrasing: true,
    interactive: true,
    formAssociated: {
      disablable: true,
      listed: true
    },
    labelable: true,
    attributes: {
      autocomplete: {
        enum: ["on", "off"]
      },
      autofocus: {
        boolean: true
      },
      cols: {
        enum: ["/\\d+/"]
      },
      datafld: {
        deprecated: true
      },
      datasrc: {
        deprecated: true
      },
      disabled: {
        boolean: true
      },
      maxlength: {
        enum: ["/\\d+/"]
      },
      minlength: {
        enum: ["/\\d+/"]
      },
      readonly: {
        boolean: true
      },
      required: {
        boolean: true
      },
      rows: {
        enum: ["/\\d+/"]
      },
      spellcheck: {
        enum: ["true", "default", "false"]
      },
      wrap: {
        enum: ["hard", "soft"]
      }
    },
    aria: {
      implicitRole: "textbox"
    },
    permittedContent: []
  },
  tfoot: {
    implicitClosed: ["tbody"],
    permittedContent: ["@script", "tr"],
    attributes: {
      align: {
        deprecated: true
      },
      background: {
        deprecated: true
      },
      char: {
        deprecated: true
      },
      charoff: {
        deprecated: true
      },
      valign: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "rowgroup"
    }
  },
  th: {
    flow: true,
    implicitClosed: ["td", "th"],
    attributes: {
      align: {
        deprecated: true
      },
      axis: {
        deprecated: true
      },
      background: {
        deprecated: true
      },
      bgcolor: {
        deprecated: true
      },
      char: {
        deprecated: true
      },
      charoff: {
        deprecated: true
      },
      colspan: {
        enum: ["/\\d+/"]
      },
      height: {
        deprecated: true
      },
      nowrap: {
        deprecated: true
      },
      rowspan: {
        enum: ["/\\d+/"]
      },
      scope: {
        enum: ["row", "col", "rowgroup", "colgroup"]
      },
      valign: {
        deprecated: true
      },
      width: {
        deprecated: true
      }
    },
    aria: {
      implicitRole(node) {
        const table2 = node.closest("table");
        const tableRole = (table2 == null ? void 0 : table2.getAttribute("role")) ?? "table";
        if (typeof tableRole !== "string" || !["table", "grid", "treegrid"].includes(tableRole)) {
          return null;
        }
        const scope2 = node.getAttribute("scope");
        switch (scope2) {
          case "col":
            return "columnheader";
          case "row":
            return "rowheader";
          default:
            return tableRole === "table" ? "cell" : "gridcell";
        }
      }
    },
    permittedContent: ["@flow"],
    permittedDescendants: [{ exclude: ["header", "footer", "@sectioning", "@heading"] }]
  },
  thead: {
    implicitClosed: ["tbody", "tfoot"],
    permittedContent: ["@script", "tr"],
    attributes: {
      align: {
        deprecated: true
      },
      background: {
        deprecated: true
      },
      char: {
        deprecated: true
      },
      charoff: {
        deprecated: true
      },
      valign: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "rowgroup"
    }
  },
  time: {
    flow: true,
    phrasing: true,
    aria: {
      implicitRole: "time",
      naming: "prohibited"
    },
    permittedContent: ["@phrasing"]
  },
  title: {
    metadata: true,
    permittedContent: [],
    permittedParent: ["head"],
    aria: {
      naming: "prohibited"
    }
  },
  tr: {
    implicitClosed: ["tr"],
    permittedContent: ["@script", "td", "th"],
    attributes: {
      align: {
        deprecated: true
      },
      background: {
        deprecated: true
      },
      bgcolor: {
        deprecated: true
      },
      char: {
        deprecated: true
      },
      charoff: {
        deprecated: true
      },
      valign: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "row"
    }
  },
  track: {
    void: true,
    aria: {
      naming: "prohibited"
    }
  },
  tt: {
    deprecated: {
      documentation: "Use a more semantically correct element such as `<code>`, `<var>` or `<pre>`.",
      source: "html4"
    }
  },
  u: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      implicitRole: "generic",
      naming: "prohibited"
    }
  },
  ul: {
    flow: true,
    permittedContent: ["@script", "li"],
    attributes: {
      compact: {
        deprecated: true
      },
      type: {
        deprecated: true
      }
    },
    aria: {
      implicitRole: "list"
    }
  },
  var: {
    flow: true,
    phrasing: true,
    permittedContent: ["@phrasing"],
    aria: {
      naming: "prohibited"
    }
  },
  video: {
    flow: true,
    focusable(node) {
      return node.hasAttribute("controls");
    },
    phrasing: true,
    embedded: true,
    interactive: ["hasAttribute", "controls"],
    transparent: ["@flow"],
    attributes: {
      crossorigin: {
        omit: true,
        enum: ["anonymous", "use-credentials"]
      },
      itemprop: {
        allowed: allowedIfAttributeIsPresent2("src")
      },
      preload: {
        omit: true,
        enum: ["none", "metadata", "auto"]
      }
    },
    permittedContent: ["@flow", "track", "source"],
    permittedDescendants: [{ exclude: ["audio", "video"] }],
    permittedOrder: ["source", "track", "@flow"]
  },
  wbr: {
    flow: true,
    phrasing: true,
    void: true,
    aria: {
      naming: "prohibited"
    }
  },
  xmp: {
    deprecated: {
      documentation: "Use `<pre>` or `<code>` and escape content using HTML entities instead.",
      source: "html32"
    }
  }
});
var bundledElements = {
  html5
};
var entities = [
  "&Aacute",
  "&aacute",
  "&Aacute;",
  "&aacute;",
  "&Abreve;",
  "&abreve;",
  "&ac;",
  "&acd;",
  "&acE;",
  "&Acirc",
  "&acirc",
  "&Acirc;",
  "&acirc;",
  "&acute",
  "&acute;",
  "&Acy;",
  "&acy;",
  "&AElig",
  "&aelig",
  "&AElig;",
  "&aelig;",
  "&af;",
  "&Afr;",
  "&afr;",
  "&Agrave",
  "&agrave",
  "&Agrave;",
  "&agrave;",
  "&alefsym;",
  "&aleph;",
  "&Alpha;",
  "&alpha;",
  "&Amacr;",
  "&amacr;",
  "&amalg;",
  "&AMP",
  "&amp",
  "&AMP;",
  "&amp;",
  "&And;",
  "&and;",
  "&andand;",
  "&andd;",
  "&andslope;",
  "&andv;",
  "&ang;",
  "&ange;",
  "&angle;",
  "&angmsd;",
  "&angmsdaa;",
  "&angmsdab;",
  "&angmsdac;",
  "&angmsdad;",
  "&angmsdae;",
  "&angmsdaf;",
  "&angmsdag;",
  "&angmsdah;",
  "&angrt;",
  "&angrtvb;",
  "&angrtvbd;",
  "&angsph;",
  "&angst;",
  "&angzarr;",
  "&Aogon;",
  "&aogon;",
  "&Aopf;",
  "&aopf;",
  "&ap;",
  "&apacir;",
  "&apE;",
  "&ape;",
  "&apid;",
  "&apos;",
  "&ApplyFunction;",
  "&approx;",
  "&approxeq;",
  "&Aring",
  "&aring",
  "&Aring;",
  "&aring;",
  "&Ascr;",
  "&ascr;",
  "&Assign;",
  "&ast;",
  "&asymp;",
  "&asympeq;",
  "&Atilde",
  "&atilde",
  "&Atilde;",
  "&atilde;",
  "&Auml",
  "&auml",
  "&Auml;",
  "&auml;",
  "&awconint;",
  "&awint;",
  "&backcong;",
  "&backepsilon;",
  "&backprime;",
  "&backsim;",
  "&backsimeq;",
  "&Backslash;",
  "&Barv;",
  "&barvee;",
  "&Barwed;",
  "&barwed;",
  "&barwedge;",
  "&bbrk;",
  "&bbrktbrk;",
  "&bcong;",
  "&Bcy;",
  "&bcy;",
  "&bdquo;",
  "&becaus;",
  "&Because;",
  "&because;",
  "&bemptyv;",
  "&bepsi;",
  "&bernou;",
  "&Bernoullis;",
  "&Beta;",
  "&beta;",
  "&beth;",
  "&between;",
  "&Bfr;",
  "&bfr;",
  "&bigcap;",
  "&bigcirc;",
  "&bigcup;",
  "&bigodot;",
  "&bigoplus;",
  "&bigotimes;",
  "&bigsqcup;",
  "&bigstar;",
  "&bigtriangledown;",
  "&bigtriangleup;",
  "&biguplus;",
  "&bigvee;",
  "&bigwedge;",
  "&bkarow;",
  "&blacklozenge;",
  "&blacksquare;",
  "&blacktriangle;",
  "&blacktriangledown;",
  "&blacktriangleleft;",
  "&blacktriangleright;",
  "&blank;",
  "&blk12;",
  "&blk14;",
  "&blk34;",
  "&block;",
  "&bne;",
  "&bnequiv;",
  "&bNot;",
  "&bnot;",
  "&Bopf;",
  "&bopf;",
  "&bot;",
  "&bottom;",
  "&bowtie;",
  "&boxbox;",
  "&boxDL;",
  "&boxDl;",
  "&boxdL;",
  "&boxdl;",
  "&boxDR;",
  "&boxDr;",
  "&boxdR;",
  "&boxdr;",
  "&boxH;",
  "&boxh;",
  "&boxHD;",
  "&boxHd;",
  "&boxhD;",
  "&boxhd;",
  "&boxHU;",
  "&boxHu;",
  "&boxhU;",
  "&boxhu;",
  "&boxminus;",
  "&boxplus;",
  "&boxtimes;",
  "&boxUL;",
  "&boxUl;",
  "&boxuL;",
  "&boxul;",
  "&boxUR;",
  "&boxUr;",
  "&boxuR;",
  "&boxur;",
  "&boxV;",
  "&boxv;",
  "&boxVH;",
  "&boxVh;",
  "&boxvH;",
  "&boxvh;",
  "&boxVL;",
  "&boxVl;",
  "&boxvL;",
  "&boxvl;",
  "&boxVR;",
  "&boxVr;",
  "&boxvR;",
  "&boxvr;",
  "&bprime;",
  "&Breve;",
  "&breve;",
  "&brvbar",
  "&brvbar;",
  "&Bscr;",
  "&bscr;",
  "&bsemi;",
  "&bsim;",
  "&bsime;",
  "&bsol;",
  "&bsolb;",
  "&bsolhsub;",
  "&bull;",
  "&bullet;",
  "&bump;",
  "&bumpE;",
  "&bumpe;",
  "&Bumpeq;",
  "&bumpeq;",
  "&Cacute;",
  "&cacute;",
  "&Cap;",
  "&cap;",
  "&capand;",
  "&capbrcup;",
  "&capcap;",
  "&capcup;",
  "&capdot;",
  "&CapitalDifferentialD;",
  "&caps;",
  "&caret;",
  "&caron;",
  "&Cayleys;",
  "&ccaps;",
  "&Ccaron;",
  "&ccaron;",
  "&Ccedil",
  "&ccedil",
  "&Ccedil;",
  "&ccedil;",
  "&Ccirc;",
  "&ccirc;",
  "&Cconint;",
  "&ccups;",
  "&ccupssm;",
  "&Cdot;",
  "&cdot;",
  "&cedil",
  "&cedil;",
  "&Cedilla;",
  "&cemptyv;",
  "&cent",
  "&cent;",
  "&CenterDot;",
  "&centerdot;",
  "&Cfr;",
  "&cfr;",
  "&CHcy;",
  "&chcy;",
  "&check;",
  "&checkmark;",
  "&Chi;",
  "&chi;",
  "&cir;",
  "&circ;",
  "&circeq;",
  "&circlearrowleft;",
  "&circlearrowright;",
  "&circledast;",
  "&circledcirc;",
  "&circleddash;",
  "&CircleDot;",
  "&circledR;",
  "&circledS;",
  "&CircleMinus;",
  "&CirclePlus;",
  "&CircleTimes;",
  "&cirE;",
  "&cire;",
  "&cirfnint;",
  "&cirmid;",
  "&cirscir;",
  "&ClockwiseContourIntegral;",
  "&CloseCurlyDoubleQuote;",
  "&CloseCurlyQuote;",
  "&clubs;",
  "&clubsuit;",
  "&Colon;",
  "&colon;",
  "&Colone;",
  "&colone;",
  "&coloneq;",
  "&comma;",
  "&commat;",
  "&comp;",
  "&compfn;",
  "&complement;",
  "&complexes;",
  "&cong;",
  "&congdot;",
  "&Congruent;",
  "&Conint;",
  "&conint;",
  "&ContourIntegral;",
  "&Copf;",
  "&copf;",
  "&coprod;",
  "&Coproduct;",
  "&COPY",
  "&copy",
  "&COPY;",
  "&copy;",
  "&copysr;",
  "&CounterClockwiseContourIntegral;",
  "&crarr;",
  "&Cross;",
  "&cross;",
  "&Cscr;",
  "&cscr;",
  "&csub;",
  "&csube;",
  "&csup;",
  "&csupe;",
  "&ctdot;",
  "&cudarrl;",
  "&cudarrr;",
  "&cuepr;",
  "&cuesc;",
  "&cularr;",
  "&cularrp;",
  "&Cup;",
  "&cup;",
  "&cupbrcap;",
  "&CupCap;",
  "&cupcap;",
  "&cupcup;",
  "&cupdot;",
  "&cupor;",
  "&cups;",
  "&curarr;",
  "&curarrm;",
  "&curlyeqprec;",
  "&curlyeqsucc;",
  "&curlyvee;",
  "&curlywedge;",
  "&curren",
  "&curren;",
  "&curvearrowleft;",
  "&curvearrowright;",
  "&cuvee;",
  "&cuwed;",
  "&cwconint;",
  "&cwint;",
  "&cylcty;",
  "&Dagger;",
  "&dagger;",
  "&daleth;",
  "&Darr;",
  "&dArr;",
  "&darr;",
  "&dash;",
  "&Dashv;",
  "&dashv;",
  "&dbkarow;",
  "&dblac;",
  "&Dcaron;",
  "&dcaron;",
  "&Dcy;",
  "&dcy;",
  "&DD;",
  "&dd;",
  "&ddagger;",
  "&ddarr;",
  "&DDotrahd;",
  "&ddotseq;",
  "&deg",
  "&deg;",
  "&Del;",
  "&Delta;",
  "&delta;",
  "&demptyv;",
  "&dfisht;",
  "&Dfr;",
  "&dfr;",
  "&dHar;",
  "&dharl;",
  "&dharr;",
  "&DiacriticalAcute;",
  "&DiacriticalDot;",
  "&DiacriticalDoubleAcute;",
  "&DiacriticalGrave;",
  "&DiacriticalTilde;",
  "&diam;",
  "&Diamond;",
  "&diamond;",
  "&diamondsuit;",
  "&diams;",
  "&die;",
  "&DifferentialD;",
  "&digamma;",
  "&disin;",
  "&div;",
  "&divide",
  "&divide;",
  "&divideontimes;",
  "&divonx;",
  "&DJcy;",
  "&djcy;",
  "&dlcorn;",
  "&dlcrop;",
  "&dollar;",
  "&Dopf;",
  "&dopf;",
  "&Dot;",
  "&dot;",
  "&DotDot;",
  "&doteq;",
  "&doteqdot;",
  "&DotEqual;",
  "&dotminus;",
  "&dotplus;",
  "&dotsquare;",
  "&doublebarwedge;",
  "&DoubleContourIntegral;",
  "&DoubleDot;",
  "&DoubleDownArrow;",
  "&DoubleLeftArrow;",
  "&DoubleLeftRightArrow;",
  "&DoubleLeftTee;",
  "&DoubleLongLeftArrow;",
  "&DoubleLongLeftRightArrow;",
  "&DoubleLongRightArrow;",
  "&DoubleRightArrow;",
  "&DoubleRightTee;",
  "&DoubleUpArrow;",
  "&DoubleUpDownArrow;",
  "&DoubleVerticalBar;",
  "&DownArrow;",
  "&Downarrow;",
  "&downarrow;",
  "&DownArrowBar;",
  "&DownArrowUpArrow;",
  "&DownBreve;",
  "&downdownarrows;",
  "&downharpoonleft;",
  "&downharpoonright;",
  "&DownLeftRightVector;",
  "&DownLeftTeeVector;",
  "&DownLeftVector;",
  "&DownLeftVectorBar;",
  "&DownRightTeeVector;",
  "&DownRightVector;",
  "&DownRightVectorBar;",
  "&DownTee;",
  "&DownTeeArrow;",
  "&drbkarow;",
  "&drcorn;",
  "&drcrop;",
  "&Dscr;",
  "&dscr;",
  "&DScy;",
  "&dscy;",
  "&dsol;",
  "&Dstrok;",
  "&dstrok;",
  "&dtdot;",
  "&dtri;",
  "&dtrif;",
  "&duarr;",
  "&duhar;",
  "&dwangle;",
  "&DZcy;",
  "&dzcy;",
  "&dzigrarr;",
  "&Eacute",
  "&eacute",
  "&Eacute;",
  "&eacute;",
  "&easter;",
  "&Ecaron;",
  "&ecaron;",
  "&ecir;",
  "&Ecirc",
  "&ecirc",
  "&Ecirc;",
  "&ecirc;",
  "&ecolon;",
  "&Ecy;",
  "&ecy;",
  "&eDDot;",
  "&Edot;",
  "&eDot;",
  "&edot;",
  "&ee;",
  "&efDot;",
  "&Efr;",
  "&efr;",
  "&eg;",
  "&Egrave",
  "&egrave",
  "&Egrave;",
  "&egrave;",
  "&egs;",
  "&egsdot;",
  "&el;",
  "&Element;",
  "&elinters;",
  "&ell;",
  "&els;",
  "&elsdot;",
  "&Emacr;",
  "&emacr;",
  "&empty;",
  "&emptyset;",
  "&EmptySmallSquare;",
  "&emptyv;",
  "&EmptyVerySmallSquare;",
  "&emsp13;",
  "&emsp14;",
  "&emsp;",
  "&ENG;",
  "&eng;",
  "&ensp;",
  "&Eogon;",
  "&eogon;",
  "&Eopf;",
  "&eopf;",
  "&epar;",
  "&eparsl;",
  "&eplus;",
  "&epsi;",
  "&Epsilon;",
  "&epsilon;",
  "&epsiv;",
  "&eqcirc;",
  "&eqcolon;",
  "&eqsim;",
  "&eqslantgtr;",
  "&eqslantless;",
  "&Equal;",
  "&equals;",
  "&EqualTilde;",
  "&equest;",
  "&Equilibrium;",
  "&equiv;",
  "&equivDD;",
  "&eqvparsl;",
  "&erarr;",
  "&erDot;",
  "&Escr;",
  "&escr;",
  "&esdot;",
  "&Esim;",
  "&esim;",
  "&Eta;",
  "&eta;",
  "&ETH",
  "&eth",
  "&ETH;",
  "&eth;",
  "&Euml",
  "&euml",
  "&Euml;",
  "&euml;",
  "&euro;",
  "&excl;",
  "&exist;",
  "&Exists;",
  "&expectation;",
  "&ExponentialE;",
  "&exponentiale;",
  "&fallingdotseq;",
  "&Fcy;",
  "&fcy;",
  "&female;",
  "&ffilig;",
  "&fflig;",
  "&ffllig;",
  "&Ffr;",
  "&ffr;",
  "&filig;",
  "&FilledSmallSquare;",
  "&FilledVerySmallSquare;",
  "&fjlig;",
  "&flat;",
  "&fllig;",
  "&fltns;",
  "&fnof;",
  "&Fopf;",
  "&fopf;",
  "&ForAll;",
  "&forall;",
  "&fork;",
  "&forkv;",
  "&Fouriertrf;",
  "&fpartint;",
  "&frac12",
  "&frac12;",
  "&frac13;",
  "&frac14",
  "&frac14;",
  "&frac15;",
  "&frac16;",
  "&frac18;",
  "&frac23;",
  "&frac25;",
  "&frac34",
  "&frac34;",
  "&frac35;",
  "&frac38;",
  "&frac45;",
  "&frac56;",
  "&frac58;",
  "&frac78;",
  "&frasl;",
  "&frown;",
  "&Fscr;",
  "&fscr;",
  "&gacute;",
  "&Gamma;",
  "&gamma;",
  "&Gammad;",
  "&gammad;",
  "&gap;",
  "&Gbreve;",
  "&gbreve;",
  "&Gcedil;",
  "&Gcirc;",
  "&gcirc;",
  "&Gcy;",
  "&gcy;",
  "&Gdot;",
  "&gdot;",
  "&gE;",
  "&ge;",
  "&gEl;",
  "&gel;",
  "&geq;",
  "&geqq;",
  "&geqslant;",
  "&ges;",
  "&gescc;",
  "&gesdot;",
  "&gesdoto;",
  "&gesdotol;",
  "&gesl;",
  "&gesles;",
  "&Gfr;",
  "&gfr;",
  "&Gg;",
  "&gg;",
  "&ggg;",
  "&gimel;",
  "&GJcy;",
  "&gjcy;",
  "&gl;",
  "&gla;",
  "&glE;",
  "&glj;",
  "&gnap;",
  "&gnapprox;",
  "&gnE;",
  "&gne;",
  "&gneq;",
  "&gneqq;",
  "&gnsim;",
  "&Gopf;",
  "&gopf;",
  "&grave;",
  "&GreaterEqual;",
  "&GreaterEqualLess;",
  "&GreaterFullEqual;",
  "&GreaterGreater;",
  "&GreaterLess;",
  "&GreaterSlantEqual;",
  "&GreaterTilde;",
  "&Gscr;",
  "&gscr;",
  "&gsim;",
  "&gsime;",
  "&gsiml;",
  "&GT",
  "&gt",
  "&GT;",
  "&Gt;",
  "&gt;",
  "&gtcc;",
  "&gtcir;",
  "&gtdot;",
  "&gtlPar;",
  "&gtquest;",
  "&gtrapprox;",
  "&gtrarr;",
  "&gtrdot;",
  "&gtreqless;",
  "&gtreqqless;",
  "&gtrless;",
  "&gtrsim;",
  "&gvertneqq;",
  "&gvnE;",
  "&Hacek;",
  "&hairsp;",
  "&half;",
  "&hamilt;",
  "&HARDcy;",
  "&hardcy;",
  "&hArr;",
  "&harr;",
  "&harrcir;",
  "&harrw;",
  "&Hat;",
  "&hbar;",
  "&Hcirc;",
  "&hcirc;",
  "&hearts;",
  "&heartsuit;",
  "&hellip;",
  "&hercon;",
  "&Hfr;",
  "&hfr;",
  "&HilbertSpace;",
  "&hksearow;",
  "&hkswarow;",
  "&hoarr;",
  "&homtht;",
  "&hookleftarrow;",
  "&hookrightarrow;",
  "&Hopf;",
  "&hopf;",
  "&horbar;",
  "&HorizontalLine;",
  "&Hscr;",
  "&hscr;",
  "&hslash;",
  "&Hstrok;",
  "&hstrok;",
  "&HumpDownHump;",
  "&HumpEqual;",
  "&hybull;",
  "&hyphen;",
  "&Iacute",
  "&iacute",
  "&Iacute;",
  "&iacute;",
  "&ic;",
  "&Icirc",
  "&icirc",
  "&Icirc;",
  "&icirc;",
  "&Icy;",
  "&icy;",
  "&Idot;",
  "&IEcy;",
  "&iecy;",
  "&iexcl",
  "&iexcl;",
  "&iff;",
  "&Ifr;",
  "&ifr;",
  "&Igrave",
  "&igrave",
  "&Igrave;",
  "&igrave;",
  "&ii;",
  "&iiiint;",
  "&iiint;",
  "&iinfin;",
  "&iiota;",
  "&IJlig;",
  "&ijlig;",
  "&Im;",
  "&Imacr;",
  "&imacr;",
  "&image;",
  "&ImaginaryI;",
  "&imagline;",
  "&imagpart;",
  "&imath;",
  "&imof;",
  "&imped;",
  "&Implies;",
  "&in;",
  "&incare;",
  "&infin;",
  "&infintie;",
  "&inodot;",
  "&Int;",
  "&int;",
  "&intcal;",
  "&integers;",
  "&Integral;",
  "&intercal;",
  "&Intersection;",
  "&intlarhk;",
  "&intprod;",
  "&InvisibleComma;",
  "&InvisibleTimes;",
  "&IOcy;",
  "&iocy;",
  "&Iogon;",
  "&iogon;",
  "&Iopf;",
  "&iopf;",
  "&Iota;",
  "&iota;",
  "&iprod;",
  "&iquest",
  "&iquest;",
  "&Iscr;",
  "&iscr;",
  "&isin;",
  "&isindot;",
  "&isinE;",
  "&isins;",
  "&isinsv;",
  "&isinv;",
  "&it;",
  "&Itilde;",
  "&itilde;",
  "&Iukcy;",
  "&iukcy;",
  "&Iuml",
  "&iuml",
  "&Iuml;",
  "&iuml;",
  "&Jcirc;",
  "&jcirc;",
  "&Jcy;",
  "&jcy;",
  "&Jfr;",
  "&jfr;",
  "&jmath;",
  "&Jopf;",
  "&jopf;",
  "&Jscr;",
  "&jscr;",
  "&Jsercy;",
  "&jsercy;",
  "&Jukcy;",
  "&jukcy;",
  "&Kappa;",
  "&kappa;",
  "&kappav;",
  "&Kcedil;",
  "&kcedil;",
  "&Kcy;",
  "&kcy;",
  "&Kfr;",
  "&kfr;",
  "&kgreen;",
  "&KHcy;",
  "&khcy;",
  "&KJcy;",
  "&kjcy;",
  "&Kopf;",
  "&kopf;",
  "&Kscr;",
  "&kscr;",
  "&lAarr;",
  "&Lacute;",
  "&lacute;",
  "&laemptyv;",
  "&lagran;",
  "&Lambda;",
  "&lambda;",
  "&Lang;",
  "&lang;",
  "&langd;",
  "&langle;",
  "&lap;",
  "&Laplacetrf;",
  "&laquo",
  "&laquo;",
  "&Larr;",
  "&lArr;",
  "&larr;",
  "&larrb;",
  "&larrbfs;",
  "&larrfs;",
  "&larrhk;",
  "&larrlp;",
  "&larrpl;",
  "&larrsim;",
  "&larrtl;",
  "&lat;",
  "&lAtail;",
  "&latail;",
  "&late;",
  "&lates;",
  "&lBarr;",
  "&lbarr;",
  "&lbbrk;",
  "&lbrace;",
  "&lbrack;",
  "&lbrke;",
  "&lbrksld;",
  "&lbrkslu;",
  "&Lcaron;",
  "&lcaron;",
  "&Lcedil;",
  "&lcedil;",
  "&lceil;",
  "&lcub;",
  "&Lcy;",
  "&lcy;",
  "&ldca;",
  "&ldquo;",
  "&ldquor;",
  "&ldrdhar;",
  "&ldrushar;",
  "&ldsh;",
  "&lE;",
  "&le;",
  "&LeftAngleBracket;",
  "&LeftArrow;",
  "&Leftarrow;",
  "&leftarrow;",
  "&LeftArrowBar;",
  "&LeftArrowRightArrow;",
  "&leftarrowtail;",
  "&LeftCeiling;",
  "&LeftDoubleBracket;",
  "&LeftDownTeeVector;",
  "&LeftDownVector;",
  "&LeftDownVectorBar;",
  "&LeftFloor;",
  "&leftharpoondown;",
  "&leftharpoonup;",
  "&leftleftarrows;",
  "&LeftRightArrow;",
  "&Leftrightarrow;",
  "&leftrightarrow;",
  "&leftrightarrows;",
  "&leftrightharpoons;",
  "&leftrightsquigarrow;",
  "&LeftRightVector;",
  "&LeftTee;",
  "&LeftTeeArrow;",
  "&LeftTeeVector;",
  "&leftthreetimes;",
  "&LeftTriangle;",
  "&LeftTriangleBar;",
  "&LeftTriangleEqual;",
  "&LeftUpDownVector;",
  "&LeftUpTeeVector;",
  "&LeftUpVector;",
  "&LeftUpVectorBar;",
  "&LeftVector;",
  "&LeftVectorBar;",
  "&lEg;",
  "&leg;",
  "&leq;",
  "&leqq;",
  "&leqslant;",
  "&les;",
  "&lescc;",
  "&lesdot;",
  "&lesdoto;",
  "&lesdotor;",
  "&lesg;",
  "&lesges;",
  "&lessapprox;",
  "&lessdot;",
  "&lesseqgtr;",
  "&lesseqqgtr;",
  "&LessEqualGreater;",
  "&LessFullEqual;",
  "&LessGreater;",
  "&lessgtr;",
  "&LessLess;",
  "&lesssim;",
  "&LessSlantEqual;",
  "&LessTilde;",
  "&lfisht;",
  "&lfloor;",
  "&Lfr;",
  "&lfr;",
  "&lg;",
  "&lgE;",
  "&lHar;",
  "&lhard;",
  "&lharu;",
  "&lharul;",
  "&lhblk;",
  "&LJcy;",
  "&ljcy;",
  "&Ll;",
  "&ll;",
  "&llarr;",
  "&llcorner;",
  "&Lleftarrow;",
  "&llhard;",
  "&lltri;",
  "&Lmidot;",
  "&lmidot;",
  "&lmoust;",
  "&lmoustache;",
  "&lnap;",
  "&lnapprox;",
  "&lnE;",
  "&lne;",
  "&lneq;",
  "&lneqq;",
  "&lnsim;",
  "&loang;",
  "&loarr;",
  "&lobrk;",
  "&LongLeftArrow;",
  "&Longleftarrow;",
  "&longleftarrow;",
  "&LongLeftRightArrow;",
  "&Longleftrightarrow;",
  "&longleftrightarrow;",
  "&longmapsto;",
  "&LongRightArrow;",
  "&Longrightarrow;",
  "&longrightarrow;",
  "&looparrowleft;",
  "&looparrowright;",
  "&lopar;",
  "&Lopf;",
  "&lopf;",
  "&loplus;",
  "&lotimes;",
  "&lowast;",
  "&lowbar;",
  "&LowerLeftArrow;",
  "&LowerRightArrow;",
  "&loz;",
  "&lozenge;",
  "&lozf;",
  "&lpar;",
  "&lparlt;",
  "&lrarr;",
  "&lrcorner;",
  "&lrhar;",
  "&lrhard;",
  "&lrm;",
  "&lrtri;",
  "&lsaquo;",
  "&Lscr;",
  "&lscr;",
  "&Lsh;",
  "&lsh;",
  "&lsim;",
  "&lsime;",
  "&lsimg;",
  "&lsqb;",
  "&lsquo;",
  "&lsquor;",
  "&Lstrok;",
  "&lstrok;",
  "&LT",
  "&lt",
  "&LT;",
  "&Lt;",
  "&lt;",
  "&ltcc;",
  "&ltcir;",
  "&ltdot;",
  "&lthree;",
  "&ltimes;",
  "&ltlarr;",
  "&ltquest;",
  "&ltri;",
  "&ltrie;",
  "&ltrif;",
  "&ltrPar;",
  "&lurdshar;",
  "&luruhar;",
  "&lvertneqq;",
  "&lvnE;",
  "&macr",
  "&macr;",
  "&male;",
  "&malt;",
  "&maltese;",
  "&Map;",
  "&map;",
  "&mapsto;",
  "&mapstodown;",
  "&mapstoleft;",
  "&mapstoup;",
  "&marker;",
  "&mcomma;",
  "&Mcy;",
  "&mcy;",
  "&mdash;",
  "&mDDot;",
  "&measuredangle;",
  "&MediumSpace;",
  "&Mellintrf;",
  "&Mfr;",
  "&mfr;",
  "&mho;",
  "&micro",
  "&micro;",
  "&mid;",
  "&midast;",
  "&midcir;",
  "&middot",
  "&middot;",
  "&minus;",
  "&minusb;",
  "&minusd;",
  "&minusdu;",
  "&MinusPlus;",
  "&mlcp;",
  "&mldr;",
  "&mnplus;",
  "&models;",
  "&Mopf;",
  "&mopf;",
  "&mp;",
  "&Mscr;",
  "&mscr;",
  "&mstpos;",
  "&Mu;",
  "&mu;",
  "&multimap;",
  "&mumap;",
  "&nabla;",
  "&Nacute;",
  "&nacute;",
  "&nang;",
  "&nap;",
  "&napE;",
  "&napid;",
  "&napos;",
  "&napprox;",
  "&natur;",
  "&natural;",
  "&naturals;",
  "&nbsp",
  "&nbsp;",
  "&nbump;",
  "&nbumpe;",
  "&ncap;",
  "&Ncaron;",
  "&ncaron;",
  "&Ncedil;",
  "&ncedil;",
  "&ncong;",
  "&ncongdot;",
  "&ncup;",
  "&Ncy;",
  "&ncy;",
  "&ndash;",
  "&ne;",
  "&nearhk;",
  "&neArr;",
  "&nearr;",
  "&nearrow;",
  "&nedot;",
  "&NegativeMediumSpace;",
  "&NegativeThickSpace;",
  "&NegativeThinSpace;",
  "&NegativeVeryThinSpace;",
  "&nequiv;",
  "&nesear;",
  "&nesim;",
  "&NestedGreaterGreater;",
  "&NestedLessLess;",
  "&NewLine;",
  "&nexist;",
  "&nexists;",
  "&Nfr;",
  "&nfr;",
  "&ngE;",
  "&nge;",
  "&ngeq;",
  "&ngeqq;",
  "&ngeqslant;",
  "&nges;",
  "&nGg;",
  "&ngsim;",
  "&nGt;",
  "&ngt;",
  "&ngtr;",
  "&nGtv;",
  "&nhArr;",
  "&nharr;",
  "&nhpar;",
  "&ni;",
  "&nis;",
  "&nisd;",
  "&niv;",
  "&NJcy;",
  "&njcy;",
  "&nlArr;",
  "&nlarr;",
  "&nldr;",
  "&nlE;",
  "&nle;",
  "&nLeftarrow;",
  "&nleftarrow;",
  "&nLeftrightarrow;",
  "&nleftrightarrow;",
  "&nleq;",
  "&nleqq;",
  "&nleqslant;",
  "&nles;",
  "&nless;",
  "&nLl;",
  "&nlsim;",
  "&nLt;",
  "&nlt;",
  "&nltri;",
  "&nltrie;",
  "&nLtv;",
  "&nmid;",
  "&NoBreak;",
  "&NonBreakingSpace;",
  "&Nopf;",
  "&nopf;",
  "&not",
  "&Not;",
  "&not;",
  "&NotCongruent;",
  "&NotCupCap;",
  "&NotDoubleVerticalBar;",
  "&NotElement;",
  "&NotEqual;",
  "&NotEqualTilde;",
  "&NotExists;",
  "&NotGreater;",
  "&NotGreaterEqual;",
  "&NotGreaterFullEqual;",
  "&NotGreaterGreater;",
  "&NotGreaterLess;",
  "&NotGreaterSlantEqual;",
  "&NotGreaterTilde;",
  "&NotHumpDownHump;",
  "&NotHumpEqual;",
  "&notin;",
  "&notindot;",
  "&notinE;",
  "&notinva;",
  "&notinvb;",
  "&notinvc;",
  "&NotLeftTriangle;",
  "&NotLeftTriangleBar;",
  "&NotLeftTriangleEqual;",
  "&NotLess;",
  "&NotLessEqual;",
  "&NotLessGreater;",
  "&NotLessLess;",
  "&NotLessSlantEqual;",
  "&NotLessTilde;",
  "&NotNestedGreaterGreater;",
  "&NotNestedLessLess;",
  "&notni;",
  "&notniva;",
  "&notnivb;",
  "&notnivc;",
  "&NotPrecedes;",
  "&NotPrecedesEqual;",
  "&NotPrecedesSlantEqual;",
  "&NotReverseElement;",
  "&NotRightTriangle;",
  "&NotRightTriangleBar;",
  "&NotRightTriangleEqual;",
  "&NotSquareSubset;",
  "&NotSquareSubsetEqual;",
  "&NotSquareSuperset;",
  "&NotSquareSupersetEqual;",
  "&NotSubset;",
  "&NotSubsetEqual;",
  "&NotSucceeds;",
  "&NotSucceedsEqual;",
  "&NotSucceedsSlantEqual;",
  "&NotSucceedsTilde;",
  "&NotSuperset;",
  "&NotSupersetEqual;",
  "&NotTilde;",
  "&NotTildeEqual;",
  "&NotTildeFullEqual;",
  "&NotTildeTilde;",
  "&NotVerticalBar;",
  "&npar;",
  "&nparallel;",
  "&nparsl;",
  "&npart;",
  "&npolint;",
  "&npr;",
  "&nprcue;",
  "&npre;",
  "&nprec;",
  "&npreceq;",
  "&nrArr;",
  "&nrarr;",
  "&nrarrc;",
  "&nrarrw;",
  "&nRightarrow;",
  "&nrightarrow;",
  "&nrtri;",
  "&nrtrie;",
  "&nsc;",
  "&nsccue;",
  "&nsce;",
  "&Nscr;",
  "&nscr;",
  "&nshortmid;",
  "&nshortparallel;",
  "&nsim;",
  "&nsime;",
  "&nsimeq;",
  "&nsmid;",
  "&nspar;",
  "&nsqsube;",
  "&nsqsupe;",
  "&nsub;",
  "&nsubE;",
  "&nsube;",
  "&nsubset;",
  "&nsubseteq;",
  "&nsubseteqq;",
  "&nsucc;",
  "&nsucceq;",
  "&nsup;",
  "&nsupE;",
  "&nsupe;",
  "&nsupset;",
  "&nsupseteq;",
  "&nsupseteqq;",
  "&ntgl;",
  "&Ntilde",
  "&ntilde",
  "&Ntilde;",
  "&ntilde;",
  "&ntlg;",
  "&ntriangleleft;",
  "&ntrianglelefteq;",
  "&ntriangleright;",
  "&ntrianglerighteq;",
  "&Nu;",
  "&nu;",
  "&num;",
  "&numero;",
  "&numsp;",
  "&nvap;",
  "&nVDash;",
  "&nVdash;",
  "&nvDash;",
  "&nvdash;",
  "&nvge;",
  "&nvgt;",
  "&nvHarr;",
  "&nvinfin;",
  "&nvlArr;",
  "&nvle;",
  "&nvlt;",
  "&nvltrie;",
  "&nvrArr;",
  "&nvrtrie;",
  "&nvsim;",
  "&nwarhk;",
  "&nwArr;",
  "&nwarr;",
  "&nwarrow;",
  "&nwnear;",
  "&Oacute",
  "&oacute",
  "&Oacute;",
  "&oacute;",
  "&oast;",
  "&ocir;",
  "&Ocirc",
  "&ocirc",
  "&Ocirc;",
  "&ocirc;",
  "&Ocy;",
  "&ocy;",
  "&odash;",
  "&Odblac;",
  "&odblac;",
  "&odiv;",
  "&odot;",
  "&odsold;",
  "&OElig;",
  "&oelig;",
  "&ofcir;",
  "&Ofr;",
  "&ofr;",
  "&ogon;",
  "&Ograve",
  "&ograve",
  "&Ograve;",
  "&ograve;",
  "&ogt;",
  "&ohbar;",
  "&ohm;",
  "&oint;",
  "&olarr;",
  "&olcir;",
  "&olcross;",
  "&oline;",
  "&olt;",
  "&Omacr;",
  "&omacr;",
  "&Omega;",
  "&omega;",
  "&Omicron;",
  "&omicron;",
  "&omid;",
  "&ominus;",
  "&Oopf;",
  "&oopf;",
  "&opar;",
  "&OpenCurlyDoubleQuote;",
  "&OpenCurlyQuote;",
  "&operp;",
  "&oplus;",
  "&Or;",
  "&or;",
  "&orarr;",
  "&ord;",
  "&order;",
  "&orderof;",
  "&ordf",
  "&ordf;",
  "&ordm",
  "&ordm;",
  "&origof;",
  "&oror;",
  "&orslope;",
  "&orv;",
  "&oS;",
  "&Oscr;",
  "&oscr;",
  "&Oslash",
  "&oslash",
  "&Oslash;",
  "&oslash;",
  "&osol;",
  "&Otilde",
  "&otilde",
  "&Otilde;",
  "&otilde;",
  "&Otimes;",
  "&otimes;",
  "&otimesas;",
  "&Ouml",
  "&ouml",
  "&Ouml;",
  "&ouml;",
  "&ovbar;",
  "&OverBar;",
  "&OverBrace;",
  "&OverBracket;",
  "&OverParenthesis;",
  "&par;",
  "&para",
  "&para;",
  "&parallel;",
  "&parsim;",
  "&parsl;",
  "&part;",
  "&PartialD;",
  "&Pcy;",
  "&pcy;",
  "&percnt;",
  "&period;",
  "&permil;",
  "&perp;",
  "&pertenk;",
  "&Pfr;",
  "&pfr;",
  "&Phi;",
  "&phi;",
  "&phiv;",
  "&phmmat;",
  "&phone;",
  "&Pi;",
  "&pi;",
  "&pitchfork;",
  "&piv;",
  "&planck;",
  "&planckh;",
  "&plankv;",
  "&plus;",
  "&plusacir;",
  "&plusb;",
  "&pluscir;",
  "&plusdo;",
  "&plusdu;",
  "&pluse;",
  "&PlusMinus;",
  "&plusmn",
  "&plusmn;",
  "&plussim;",
  "&plustwo;",
  "&pm;",
  "&Poincareplane;",
  "&pointint;",
  "&Popf;",
  "&popf;",
  "&pound",
  "&pound;",
  "&Pr;",
  "&pr;",
  "&prap;",
  "&prcue;",
  "&prE;",
  "&pre;",
  "&prec;",
  "&precapprox;",
  "&preccurlyeq;",
  "&Precedes;",
  "&PrecedesEqual;",
  "&PrecedesSlantEqual;",
  "&PrecedesTilde;",
  "&preceq;",
  "&precnapprox;",
  "&precneqq;",
  "&precnsim;",
  "&precsim;",
  "&Prime;",
  "&prime;",
  "&primes;",
  "&prnap;",
  "&prnE;",
  "&prnsim;",
  "&prod;",
  "&Product;",
  "&profalar;",
  "&profline;",
  "&profsurf;",
  "&prop;",
  "&Proportion;",
  "&Proportional;",
  "&propto;",
  "&prsim;",
  "&prurel;",
  "&Pscr;",
  "&pscr;",
  "&Psi;",
  "&psi;",
  "&puncsp;",
  "&Qfr;",
  "&qfr;",
  "&qint;",
  "&Qopf;",
  "&qopf;",
  "&qprime;",
  "&Qscr;",
  "&qscr;",
  "&quaternions;",
  "&quatint;",
  "&quest;",
  "&questeq;",
  "&QUOT",
  "&quot",
  "&QUOT;",
  "&quot;",
  "&rAarr;",
  "&race;",
  "&Racute;",
  "&racute;",
  "&radic;",
  "&raemptyv;",
  "&Rang;",
  "&rang;",
  "&rangd;",
  "&range;",
  "&rangle;",
  "&raquo",
  "&raquo;",
  "&Rarr;",
  "&rArr;",
  "&rarr;",
  "&rarrap;",
  "&rarrb;",
  "&rarrbfs;",
  "&rarrc;",
  "&rarrfs;",
  "&rarrhk;",
  "&rarrlp;",
  "&rarrpl;",
  "&rarrsim;",
  "&Rarrtl;",
  "&rarrtl;",
  "&rarrw;",
  "&rAtail;",
  "&ratail;",
  "&ratio;",
  "&rationals;",
  "&RBarr;",
  "&rBarr;",
  "&rbarr;",
  "&rbbrk;",
  "&rbrace;",
  "&rbrack;",
  "&rbrke;",
  "&rbrksld;",
  "&rbrkslu;",
  "&Rcaron;",
  "&rcaron;",
  "&Rcedil;",
  "&rcedil;",
  "&rceil;",
  "&rcub;",
  "&Rcy;",
  "&rcy;",
  "&rdca;",
  "&rdldhar;",
  "&rdquo;",
  "&rdquor;",
  "&rdsh;",
  "&Re;",
  "&real;",
  "&realine;",
  "&realpart;",
  "&reals;",
  "&rect;",
  "&REG",
  "&reg",
  "&REG;",
  "&reg;",
  "&ReverseElement;",
  "&ReverseEquilibrium;",
  "&ReverseUpEquilibrium;",
  "&rfisht;",
  "&rfloor;",
  "&Rfr;",
  "&rfr;",
  "&rHar;",
  "&rhard;",
  "&rharu;",
  "&rharul;",
  "&Rho;",
  "&rho;",
  "&rhov;",
  "&RightAngleBracket;",
  "&RightArrow;",
  "&Rightarrow;",
  "&rightarrow;",
  "&RightArrowBar;",
  "&RightArrowLeftArrow;",
  "&rightarrowtail;",
  "&RightCeiling;",
  "&RightDoubleBracket;",
  "&RightDownTeeVector;",
  "&RightDownVector;",
  "&RightDownVectorBar;",
  "&RightFloor;",
  "&rightharpoondown;",
  "&rightharpoonup;",
  "&rightleftarrows;",
  "&rightleftharpoons;",
  "&rightrightarrows;",
  "&rightsquigarrow;",
  "&RightTee;",
  "&RightTeeArrow;",
  "&RightTeeVector;",
  "&rightthreetimes;",
  "&RightTriangle;",
  "&RightTriangleBar;",
  "&RightTriangleEqual;",
  "&RightUpDownVector;",
  "&RightUpTeeVector;",
  "&RightUpVector;",
  "&RightUpVectorBar;",
  "&RightVector;",
  "&RightVectorBar;",
  "&ring;",
  "&risingdotseq;",
  "&rlarr;",
  "&rlhar;",
  "&rlm;",
  "&rmoust;",
  "&rmoustache;",
  "&rnmid;",
  "&roang;",
  "&roarr;",
  "&robrk;",
  "&ropar;",
  "&Ropf;",
  "&ropf;",
  "&roplus;",
  "&rotimes;",
  "&RoundImplies;",
  "&rpar;",
  "&rpargt;",
  "&rppolint;",
  "&rrarr;",
  "&Rrightarrow;",
  "&rsaquo;",
  "&Rscr;",
  "&rscr;",
  "&Rsh;",
  "&rsh;",
  "&rsqb;",
  "&rsquo;",
  "&rsquor;",
  "&rthree;",
  "&rtimes;",
  "&rtri;",
  "&rtrie;",
  "&rtrif;",
  "&rtriltri;",
  "&RuleDelayed;",
  "&ruluhar;",
  "&rx;",
  "&Sacute;",
  "&sacute;",
  "&sbquo;",
  "&Sc;",
  "&sc;",
  "&scap;",
  "&Scaron;",
  "&scaron;",
  "&sccue;",
  "&scE;",
  "&sce;",
  "&Scedil;",
  "&scedil;",
  "&Scirc;",
  "&scirc;",
  "&scnap;",
  "&scnE;",
  "&scnsim;",
  "&scpolint;",
  "&scsim;",
  "&Scy;",
  "&scy;",
  "&sdot;",
  "&sdotb;",
  "&sdote;",
  "&searhk;",
  "&seArr;",
  "&searr;",
  "&searrow;",
  "&sect",
  "&sect;",
  "&semi;",
  "&seswar;",
  "&setminus;",
  "&setmn;",
  "&sext;",
  "&Sfr;",
  "&sfr;",
  "&sfrown;",
  "&sharp;",
  "&SHCHcy;",
  "&shchcy;",
  "&SHcy;",
  "&shcy;",
  "&ShortDownArrow;",
  "&ShortLeftArrow;",
  "&shortmid;",
  "&shortparallel;",
  "&ShortRightArrow;",
  "&ShortUpArrow;",
  "&shy",
  "&shy;",
  "&Sigma;",
  "&sigma;",
  "&sigmaf;",
  "&sigmav;",
  "&sim;",
  "&simdot;",
  "&sime;",
  "&simeq;",
  "&simg;",
  "&simgE;",
  "&siml;",
  "&simlE;",
  "&simne;",
  "&simplus;",
  "&simrarr;",
  "&slarr;",
  "&SmallCircle;",
  "&smallsetminus;",
  "&smashp;",
  "&smeparsl;",
  "&smid;",
  "&smile;",
  "&smt;",
  "&smte;",
  "&smtes;",
  "&SOFTcy;",
  "&softcy;",
  "&sol;",
  "&solb;",
  "&solbar;",
  "&Sopf;",
  "&sopf;",
  "&spades;",
  "&spadesuit;",
  "&spar;",
  "&sqcap;",
  "&sqcaps;",
  "&sqcup;",
  "&sqcups;",
  "&Sqrt;",
  "&sqsub;",
  "&sqsube;",
  "&sqsubset;",
  "&sqsubseteq;",
  "&sqsup;",
  "&sqsupe;",
  "&sqsupset;",
  "&sqsupseteq;",
  "&squ;",
  "&Square;",
  "&square;",
  "&SquareIntersection;",
  "&SquareSubset;",
  "&SquareSubsetEqual;",
  "&SquareSuperset;",
  "&SquareSupersetEqual;",
  "&SquareUnion;",
  "&squarf;",
  "&squf;",
  "&srarr;",
  "&Sscr;",
  "&sscr;",
  "&ssetmn;",
  "&ssmile;",
  "&sstarf;",
  "&Star;",
  "&star;",
  "&starf;",
  "&straightepsilon;",
  "&straightphi;",
  "&strns;",
  "&Sub;",
  "&sub;",
  "&subdot;",
  "&subE;",
  "&sube;",
  "&subedot;",
  "&submult;",
  "&subnE;",
  "&subne;",
  "&subplus;",
  "&subrarr;",
  "&Subset;",
  "&subset;",
  "&subseteq;",
  "&subseteqq;",
  "&SubsetEqual;",
  "&subsetneq;",
  "&subsetneqq;",
  "&subsim;",
  "&subsub;",
  "&subsup;",
  "&succ;",
  "&succapprox;",
  "&succcurlyeq;",
  "&Succeeds;",
  "&SucceedsEqual;",
  "&SucceedsSlantEqual;",
  "&SucceedsTilde;",
  "&succeq;",
  "&succnapprox;",
  "&succneqq;",
  "&succnsim;",
  "&succsim;",
  "&SuchThat;",
  "&Sum;",
  "&sum;",
  "&sung;",
  "&sup1",
  "&sup1;",
  "&sup2",
  "&sup2;",
  "&sup3",
  "&sup3;",
  "&Sup;",
  "&sup;",
  "&supdot;",
  "&supdsub;",
  "&supE;",
  "&supe;",
  "&supedot;",
  "&Superset;",
  "&SupersetEqual;",
  "&suphsol;",
  "&suphsub;",
  "&suplarr;",
  "&supmult;",
  "&supnE;",
  "&supne;",
  "&supplus;",
  "&Supset;",
  "&supset;",
  "&supseteq;",
  "&supseteqq;",
  "&supsetneq;",
  "&supsetneqq;",
  "&supsim;",
  "&supsub;",
  "&supsup;",
  "&swarhk;",
  "&swArr;",
  "&swarr;",
  "&swarrow;",
  "&swnwar;",
  "&szlig",
  "&szlig;",
  "&Tab;",
  "&target;",
  "&Tau;",
  "&tau;",
  "&tbrk;",
  "&Tcaron;",
  "&tcaron;",
  "&Tcedil;",
  "&tcedil;",
  "&Tcy;",
  "&tcy;",
  "&tdot;",
  "&telrec;",
  "&Tfr;",
  "&tfr;",
  "&there4;",
  "&Therefore;",
  "&therefore;",
  "&Theta;",
  "&theta;",
  "&thetasym;",
  "&thetav;",
  "&thickapprox;",
  "&thicksim;",
  "&ThickSpace;",
  "&thinsp;",
  "&ThinSpace;",
  "&thkap;",
  "&thksim;",
  "&THORN",
  "&thorn",
  "&THORN;",
  "&thorn;",
  "&Tilde;",
  "&tilde;",
  "&TildeEqual;",
  "&TildeFullEqual;",
  "&TildeTilde;",
  "&times",
  "&times;",
  "&timesb;",
  "&timesbar;",
  "&timesd;",
  "&tint;",
  "&toea;",
  "&top;",
  "&topbot;",
  "&topcir;",
  "&Topf;",
  "&topf;",
  "&topfork;",
  "&tosa;",
  "&tprime;",
  "&TRADE;",
  "&trade;",
  "&triangle;",
  "&triangledown;",
  "&triangleleft;",
  "&trianglelefteq;",
  "&triangleq;",
  "&triangleright;",
  "&trianglerighteq;",
  "&tridot;",
  "&trie;",
  "&triminus;",
  "&TripleDot;",
  "&triplus;",
  "&trisb;",
  "&tritime;",
  "&trpezium;",
  "&Tscr;",
  "&tscr;",
  "&TScy;",
  "&tscy;",
  "&TSHcy;",
  "&tshcy;",
  "&Tstrok;",
  "&tstrok;",
  "&twixt;",
  "&twoheadleftarrow;",
  "&twoheadrightarrow;",
  "&Uacute",
  "&uacute",
  "&Uacute;",
  "&uacute;",
  "&Uarr;",
  "&uArr;",
  "&uarr;",
  "&Uarrocir;",
  "&Ubrcy;",
  "&ubrcy;",
  "&Ubreve;",
  "&ubreve;",
  "&Ucirc",
  "&ucirc",
  "&Ucirc;",
  "&ucirc;",
  "&Ucy;",
  "&ucy;",
  "&udarr;",
  "&Udblac;",
  "&udblac;",
  "&udhar;",
  "&ufisht;",
  "&Ufr;",
  "&ufr;",
  "&Ugrave",
  "&ugrave",
  "&Ugrave;",
  "&ugrave;",
  "&uHar;",
  "&uharl;",
  "&uharr;",
  "&uhblk;",
  "&ulcorn;",
  "&ulcorner;",
  "&ulcrop;",
  "&ultri;",
  "&Umacr;",
  "&umacr;",
  "&uml",
  "&uml;",
  "&UnderBar;",
  "&UnderBrace;",
  "&UnderBracket;",
  "&UnderParenthesis;",
  "&Union;",
  "&UnionPlus;",
  "&Uogon;",
  "&uogon;",
  "&Uopf;",
  "&uopf;",
  "&UpArrow;",
  "&Uparrow;",
  "&uparrow;",
  "&UpArrowBar;",
  "&UpArrowDownArrow;",
  "&UpDownArrow;",
  "&Updownarrow;",
  "&updownarrow;",
  "&UpEquilibrium;",
  "&upharpoonleft;",
  "&upharpoonright;",
  "&uplus;",
  "&UpperLeftArrow;",
  "&UpperRightArrow;",
  "&Upsi;",
  "&upsi;",
  "&upsih;",
  "&Upsilon;",
  "&upsilon;",
  "&UpTee;",
  "&UpTeeArrow;",
  "&upuparrows;",
  "&urcorn;",
  "&urcorner;",
  "&urcrop;",
  "&Uring;",
  "&uring;",
  "&urtri;",
  "&Uscr;",
  "&uscr;",
  "&utdot;",
  "&Utilde;",
  "&utilde;",
  "&utri;",
  "&utrif;",
  "&uuarr;",
  "&Uuml",
  "&uuml",
  "&Uuml;",
  "&uuml;",
  "&uwangle;",
  "&vangrt;",
  "&varepsilon;",
  "&varkappa;",
  "&varnothing;",
  "&varphi;",
  "&varpi;",
  "&varpropto;",
  "&vArr;",
  "&varr;",
  "&varrho;",
  "&varsigma;",
  "&varsubsetneq;",
  "&varsubsetneqq;",
  "&varsupsetneq;",
  "&varsupsetneqq;",
  "&vartheta;",
  "&vartriangleleft;",
  "&vartriangleright;",
  "&Vbar;",
  "&vBar;",
  "&vBarv;",
  "&Vcy;",
  "&vcy;",
  "&VDash;",
  "&Vdash;",
  "&vDash;",
  "&vdash;",
  "&Vdashl;",
  "&Vee;",
  "&vee;",
  "&veebar;",
  "&veeeq;",
  "&vellip;",
  "&Verbar;",
  "&verbar;",
  "&Vert;",
  "&vert;",
  "&VerticalBar;",
  "&VerticalLine;",
  "&VerticalSeparator;",
  "&VerticalTilde;",
  "&VeryThinSpace;",
  "&Vfr;",
  "&vfr;",
  "&vltri;",
  "&vnsub;",
  "&vnsup;",
  "&Vopf;",
  "&vopf;",
  "&vprop;",
  "&vrtri;",
  "&Vscr;",
  "&vscr;",
  "&vsubnE;",
  "&vsubne;",
  "&vsupnE;",
  "&vsupne;",
  "&Vvdash;",
  "&vzigzag;",
  "&Wcirc;",
  "&wcirc;",
  "&wedbar;",
  "&Wedge;",
  "&wedge;",
  "&wedgeq;",
  "&weierp;",
  "&Wfr;",
  "&wfr;",
  "&Wopf;",
  "&wopf;",
  "&wp;",
  "&wr;",
  "&wreath;",
  "&Wscr;",
  "&wscr;",
  "&xcap;",
  "&xcirc;",
  "&xcup;",
  "&xdtri;",
  "&Xfr;",
  "&xfr;",
  "&xhArr;",
  "&xharr;",
  "&Xi;",
  "&xi;",
  "&xlArr;",
  "&xlarr;",
  "&xmap;",
  "&xnis;",
  "&xodot;",
  "&Xopf;",
  "&xopf;",
  "&xoplus;",
  "&xotime;",
  "&xrArr;",
  "&xrarr;",
  "&Xscr;",
  "&xscr;",
  "&xsqcup;",
  "&xuplus;",
  "&xutri;",
  "&xvee;",
  "&xwedge;",
  "&Yacute",
  "&yacute",
  "&Yacute;",
  "&yacute;",
  "&YAcy;",
  "&yacy;",
  "&Ycirc;",
  "&ycirc;",
  "&Ycy;",
  "&ycy;",
  "&yen",
  "&yen;",
  "&Yfr;",
  "&yfr;",
  "&YIcy;",
  "&yicy;",
  "&Yopf;",
  "&yopf;",
  "&Yscr;",
  "&yscr;",
  "&YUcy;",
  "&yucy;",
  "&yuml",
  "&Yuml;",
  "&yuml;",
  "&Zacute;",
  "&zacute;",
  "&Zcaron;",
  "&zcaron;",
  "&Zcy;",
  "&zcy;",
  "&Zdot;",
  "&zdot;",
  "&zeetrf;",
  "&ZeroWidthSpace;",
  "&Zeta;",
  "&zeta;",
  "&Zfr;",
  "&zfr;",
  "&ZHcy;",
  "&zhcy;",
  "&zigrarr;",
  "&Zopf;",
  "&zopf;",
  "&Zscr;",
  "&zscr;",
  "&zwj;",
  "&zwnj;"
];

// node_modules/@sidvind/better-ajv-errors/lib/esm/index.mjs
init_define_process();
var import_chalk = __toESM(require_source(), 1);
var import_code_frame = __toESM(require_lib3(), 1);
var import_chalk2 = __toESM(require_source(), 1);
var import_chalk3 = __toESM(require_source(), 1);
var import_chalk4 = __toESM(require_source(), 1);
var __create2 = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __getProtoOf2 = Object.getPrototypeOf;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __commonJS2 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps2 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames2(from))
      if (!__hasOwnProp2.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_leven = __commonJS2({
  "node_modules/leven/index.js"(exports, module) {
    "use strict";
    var array = [];
    var charCodeCache = [];
    var leven2 = (left, right) => {
      if (left === right) {
        return 0;
      }
      const swap = left;
      if (left.length > right.length) {
        left = right;
        right = swap;
      }
      let leftLength = left.length;
      let rightLength = right.length;
      while (leftLength > 0 && left.charCodeAt(~-leftLength) === right.charCodeAt(~-rightLength)) {
        leftLength--;
        rightLength--;
      }
      let start = 0;
      while (start < leftLength && left.charCodeAt(start) === right.charCodeAt(start)) {
        start++;
      }
      leftLength -= start;
      rightLength -= start;
      if (leftLength === 0) {
        return rightLength;
      }
      let bCharCode;
      let result;
      let temp;
      let temp2;
      let i = 0;
      let j = 0;
      while (i < leftLength) {
        charCodeCache[i] = left.charCodeAt(start + i);
        array[i] = ++i;
      }
      while (j < rightLength) {
        bCharCode = right.charCodeAt(start + j);
        temp = j++;
        result = j;
        for (i = 0; i < leftLength; i++) {
          temp2 = bCharCode === charCodeCache[i] ? temp : temp + 1;
          temp = array[i];
          result = array[i] = temp > result ? temp2 > result ? result + 1 : temp2 : temp2 > temp ? temp + 1 : temp2;
        }
      }
      return result;
    };
    module.exports = leven2;
    module.exports.default = leven2;
  }
});
var require_jsonpointer = __commonJS2({
  "node_modules/jsonpointer/jsonpointer.js"(exports) {
    var hasExcape = /~/;
    var escapeMatcher = /~[01]/g;
    function escapeReplacer(m) {
      switch (m) {
        case "~1":
          return "/";
        case "~0":
          return "~";
      }
      throw new Error("Invalid tilde escape: " + m);
    }
    function untilde(str) {
      if (!hasExcape.test(str))
        return str;
      return str.replace(escapeMatcher, escapeReplacer);
    }
    function setter(obj, pointer2, value) {
      var part;
      var hasNextPart;
      for (var p = 1, len = pointer2.length; p < len; ) {
        if (pointer2[p] === "constructor" || pointer2[p] === "prototype" || pointer2[p] === "__proto__")
          return obj;
        part = untilde(pointer2[p++]);
        hasNextPart = len > p;
        if (typeof obj[part] === "undefined") {
          if (Array.isArray(obj) && part === "-") {
            part = obj.length;
          }
          if (hasNextPart) {
            if (pointer2[p] !== "" && pointer2[p] < Infinity || pointer2[p] === "-")
              obj[part] = [];
            else
              obj[part] = {};
          }
        }
        if (!hasNextPart)
          break;
        obj = obj[part];
      }
      var oldValue = obj[part];
      if (value === void 0)
        delete obj[part];
      else
        obj[part] = value;
      return oldValue;
    }
    function compilePointer(pointer2) {
      if (typeof pointer2 === "string") {
        pointer2 = pointer2.split("/");
        if (pointer2[0] === "")
          return pointer2;
        throw new Error("Invalid JSON pointer.");
      } else if (Array.isArray(pointer2)) {
        for (const part of pointer2) {
          if (typeof part !== "string" && typeof part !== "number") {
            throw new Error("Invalid JSON pointer. Must be of type string or number.");
          }
        }
        return pointer2;
      }
      throw new Error("Invalid JSON pointer.");
    }
    function get(obj, pointer2) {
      if (typeof obj !== "object")
        throw new Error("Invalid input object.");
      pointer2 = compilePointer(pointer2);
      var len = pointer2.length;
      if (len === 1)
        return obj;
      for (var p = 1; p < len; ) {
        obj = obj[untilde(pointer2[p++])];
        if (len === p)
          return obj;
        if (typeof obj !== "object" || obj === null)
          return void 0;
      }
    }
    function set(obj, pointer2, value) {
      if (typeof obj !== "object")
        throw new Error("Invalid input object.");
      pointer2 = compilePointer(pointer2);
      if (pointer2.length === 0)
        throw new Error("Invalid JSON pointer for set.");
      return setter(obj, pointer2, value);
    }
    function compile(pointer2) {
      var compiled = compilePointer(pointer2);
      return {
        get: function(object) {
          return get(object, compiled);
        },
        set: function(object, value) {
          return set(object, compiled, value);
        }
      };
    }
    exports.get = get;
    exports.set = set;
    exports.compile = compile;
  }
});
var LBRACKET = "[";
var RBRACKET = "]";
var LBRACE = "{";
var RBRACE = "}";
var COLON = ":";
var COMMA = ",";
var TRUE = "true";
var FALSE = "false";
var NULL = "null";
var QUOTE$1 = '"';
var expectedKeywords = /* @__PURE__ */ new Map([
  ["t", TRUE],
  ["f", FALSE],
  ["n", NULL]
]);
var escapeToChar = /* @__PURE__ */ new Map([
  [QUOTE$1, QUOTE$1],
  ["\\", "\\"],
  ["/", "/"],
  ["b", "\b"],
  ["n", "\n"],
  ["f", "\f"],
  ["r", "\r"],
  ["t", "	"]
]);
var knownTokenTypes = /* @__PURE__ */ new Map([
  [LBRACKET, "LBracket"],
  [RBRACKET, "RBracket"],
  [LBRACE, "LBrace"],
  [RBRACE, "RBrace"],
  [COLON, "Colon"],
  [COMMA, "Comma"],
  [TRUE, "Boolean"],
  [FALSE, "Boolean"],
  [NULL, "Null"]
]);
var ErrorWithLocation = class extends Error {
  /**
   * Creates a new instance.
   * @param {string} message The error message to report. 
   * @param {Location} loc The location information for the error.
   */
  constructor(message, { line, column, offset }) {
    super(`${message} (${line}:${column})`);
    this.line = line;
    this.column = column;
    this.offset = offset;
  }
};
var UnexpectedChar = class extends ErrorWithLocation {
  /**
   * Creates a new instance.
   * @param {string} unexpected The character that was found.
   * @param {Location} loc The location information for the found character.
   */
  constructor(unexpected, loc) {
    super(`Unexpected character '${unexpected}' found.`, loc);
  }
};
var UnexpectedToken = class extends ErrorWithLocation {
  /**
   * Creates a new instance.
   * @param {Token} token The token that was found. 
   */
  constructor(token) {
    super(`Unexpected token ${token.type} found.`, token.loc.start);
  }
};
var UnexpectedEOF = class extends ErrorWithLocation {
  /**
   * Creates a new instance.
   * @param {Location} loc The location information for the found character.
   */
  constructor(loc) {
    super("Unexpected end of input found.", loc);
  }
};
var QUOTE = '"';
var SLASH = "/";
var STAR = "*";
var DEFAULT_OPTIONS$1 = {
  mode: "json",
  ranges: false
};
function isWhitespace(c) {
  return /[\s\n]/.test(c);
}
function isDigit(c) {
  return c >= "0" && c <= "9";
}
function isHexDigit(c) {
  return isDigit(c) || /[a-f]/i.test(c);
}
function isPositiveDigit(c) {
  return c >= "1" && c <= "9";
}
function isKeywordStart(c) {
  return /[tfn]/.test(c);
}
function isNumberStart(c) {
  return isDigit(c) || c === "." || c === "-";
}
function tokenize(text, options) {
  options = Object.freeze({
    ...DEFAULT_OPTIONS$1,
    ...options
  });
  let offset = -1;
  let line = 1;
  let column = 0;
  let newLine = false;
  const tokens = [];
  function createToken(tokenType, value, startLoc, endLoc) {
    const endOffset = startLoc.offset + value.length;
    let range = options.ranges ? {
      range: [startLoc.offset, endOffset]
    } : void 0;
    return {
      type: tokenType,
      loc: {
        start: startLoc,
        end: endLoc || {
          line: startLoc.line,
          column: startLoc.column + value.length,
          offset: endOffset
        }
      },
      ...range
    };
  }
  function next() {
    let c2 = text.charAt(++offset);
    if (newLine) {
      line++;
      column = 1;
      newLine = false;
    } else {
      column++;
    }
    if (c2 === "\r") {
      newLine = true;
      if (text.charAt(offset + 1) === "\n") {
        offset++;
      }
    } else if (c2 === "\n") {
      newLine = true;
    }
    return c2;
  }
  function locate() {
    return {
      line,
      column,
      offset
    };
  }
  function readKeyword(c2) {
    let value = expectedKeywords.get(c2);
    if (text.slice(offset, offset + value.length) === value) {
      offset += value.length - 1;
      column += value.length - 1;
      return { value, c: next() };
    }
    for (let j = 1; j < value.length; j++) {
      if (value[j] !== text.charAt(offset + j)) {
        unexpected(next());
      }
    }
  }
  function readString(c2) {
    let value = c2;
    c2 = next();
    while (c2 && c2 !== QUOTE) {
      if (c2 === "\\") {
        value += c2;
        c2 = next();
        if (escapeToChar.has(c2)) {
          value += c2;
        } else if (c2 === "u") {
          value += c2;
          for (let i = 0; i < 4; i++) {
            c2 = next();
            if (isHexDigit(c2)) {
              value += c2;
            } else {
              unexpected(c2);
            }
          }
        } else {
          unexpected(c2);
        }
      } else {
        value += c2;
      }
      c2 = next();
    }
    if (!c2) {
      unexpectedEOF();
    }
    value += c2;
    return { value, c: next() };
  }
  function readNumber(c2) {
    let value = "";
    if (c2 === "-") {
      value += c2;
      c2 = next();
      if (!isDigit(c2)) {
        unexpected(c2);
      }
    }
    if (c2 === "0") {
      value += c2;
      c2 = next();
      if (isDigit(c2)) {
        unexpected(c2);
      }
    } else {
      if (!isPositiveDigit(c2)) {
        unexpected(c2);
      }
      do {
        value += c2;
        c2 = next();
      } while (isDigit(c2));
    }
    if (c2 === ".") {
      do {
        value += c2;
        c2 = next();
      } while (isDigit(c2));
    }
    if (c2 === "e" || c2 === "E") {
      value += c2;
      c2 = next();
      if (c2 === "+" || c2 === "-") {
        value += c2;
        c2 = next();
      }
      if (!c2) {
        unexpectedEOF();
      }
      if (!isDigit(c2)) {
        unexpected(c2);
      }
      while (isDigit(c2)) {
        value += c2;
        c2 = next();
      }
    }
    return { value, c: c2 };
  }
  function readComment(c2) {
    let value = c2;
    c2 = next();
    if (c2 === "/") {
      do {
        value += c2;
        c2 = next();
      } while (c2 && c2 !== "\r" && c2 !== "\n");
      return { value, c: c2 };
    }
    if (c2 === STAR) {
      while (c2) {
        value += c2;
        c2 = next();
        if (c2 === STAR) {
          value += c2;
          c2 = next();
          if (c2 === SLASH) {
            value += c2;
            c2 = next();
            return { value, c: c2 };
          }
        }
      }
      unexpectedEOF();
    }
    unexpected(c2);
  }
  function unexpected(c2) {
    throw new UnexpectedChar(c2, locate());
  }
  function unexpectedEOF() {
    throw new UnexpectedEOF(locate());
  }
  let c = next();
  while (offset < text.length) {
    while (isWhitespace(c)) {
      c = next();
    }
    if (!c) {
      break;
    }
    const start = locate();
    if (knownTokenTypes.has(c)) {
      tokens.push(createToken(knownTokenTypes.get(c), c, start));
      c = next();
    } else if (isKeywordStart(c)) {
      const result = readKeyword(c);
      let value = result.value;
      c = result.c;
      tokens.push(createToken(knownTokenTypes.get(value), value, start));
    } else if (isNumberStart(c)) {
      const result = readNumber(c);
      let value = result.value;
      c = result.c;
      tokens.push(createToken("Number", value, start));
    } else if (c === QUOTE) {
      const result = readString(c);
      let value = result.value;
      c = result.c;
      tokens.push(createToken("String", value, start));
    } else if (c === SLASH && options.mode === "jsonc") {
      const result = readComment(c);
      let value = result.value;
      c = result.c;
      tokens.push(createToken(value.startsWith("//") ? "LineComment" : "BlockComment", value, start, locate()));
    } else {
      unexpected(c);
    }
  }
  return tokens;
}
var types = {
  /**
   * Creates a document node.
   * @param {ValueNode} body The body of the document.
   * @param {NodeParts} parts Additional properties for the node. 
   * @returns {DocumentNode} The document node.
   */
  document(body, parts = {}) {
    return {
      type: "Document",
      body,
      ...parts
    };
  },
  /**
   * Creates a string node.
   * @param {string} value The value for the string.
   * @param {NodeParts} parts Additional properties for the node. 
   * @returns {StringNode} The string node.
   */
  string(value, parts = {}) {
    return {
      type: "String",
      value,
      ...parts
    };
  },
  /**
   * Creates a number node.
   * @param {number} value The value for the number.
   * @param {NodeParts} parts Additional properties for the node. 
   * @returns {NumberNode} The number node.
   */
  number(value, parts = {}) {
    return {
      type: "Number",
      value,
      ...parts
    };
  },
  /**
   * Creates a boolean node.
   * @param {boolean} value The value for the boolean.
   * @param {NodeParts} parts Additional properties for the node. 
   * @returns {BooleanNode} The boolean node.
   */
  boolean(value, parts = {}) {
    return {
      type: "Boolean",
      value,
      ...parts
    };
  },
  /**
   * Creates a null node.
   * @param {NodeParts} parts Additional properties for the node. 
   * @returns {NullNode} The null node.
   */
  null(parts = {}) {
    return {
      type: "Null",
      ...parts
    };
  },
  /**
   * Creates an array node.
   * @param {Array<ElementNode>} elements The elements to add.
   * @param {NodeParts} parts Additional properties for the node. 
   * @returns {ArrayNode} The array node.
   */
  array(elements, parts = {}) {
    return {
      type: "Array",
      elements,
      ...parts
    };
  },
  /**
   * Creates an element node.
   * @param {ValueNode} value The value for the element.
   * @param {NodeParts} parts Additional properties for the node. 
   * @returns {ElementNode} The element node.
   */
  element(value, parts = {}) {
    return {
      type: "Element",
      value,
      ...parts
    };
  },
  /**
   * Creates an object node.
   * @param {Array<MemberNode>} members The members to add.
   * @param {NodeParts} parts Additional properties for the node. 
   * @returns {ObjectNode} The object node.
   */
  object(members, parts = {}) {
    return {
      type: "Object",
      members,
      ...parts
    };
  },
  /**
   * Creates a member node.
   * @param {StringNode} name The name for the member.
   * @param {ValueNode} value The value for the member.
   * @param {NodeParts} parts Additional properties for the node. 
   * @returns {MemberNode} The member node.
   */
  member(name, value, parts = {}) {
    return {
      type: "Member",
      name,
      value,
      ...parts
    };
  }
};
var DEFAULT_OPTIONS = {
  mode: "json",
  ranges: false,
  tokens: false
};
function getStringValue(value, token) {
  let result = "";
  let escapeIndex = value.indexOf("\\");
  let lastIndex = 0;
  while (escapeIndex >= 0) {
    result += value.slice(lastIndex, escapeIndex);
    const escapeChar = value.charAt(escapeIndex + 1);
    if (escapeToChar.has(escapeChar)) {
      result += escapeToChar.get(escapeChar);
      lastIndex = escapeIndex + 2;
    } else if (escapeChar === "u") {
      const hexCode = value.slice(escapeIndex + 2, escapeIndex + 6);
      if (hexCode.length < 4 || /[^0-9a-f]/i.test(hexCode)) {
        throw new ErrorWithLocation(
          `Invalid unicode escape \\u${hexCode}.`,
          {
            line: token.loc.start.line,
            column: token.loc.start.column + escapeIndex,
            offset: token.loc.start.offset + escapeIndex
          }
        );
      }
      result += String.fromCharCode(parseInt(hexCode, 16));
      lastIndex = escapeIndex + 6;
    } else {
      throw new ErrorWithLocation(
        `Invalid escape \\${escapeChar}.`,
        {
          line: token.loc.start.line,
          column: token.loc.start.column + escapeIndex,
          offset: token.loc.start.offset + escapeIndex
        }
      );
    }
    escapeIndex = value.indexOf("\\", lastIndex);
  }
  result += value.slice(lastIndex);
  return result;
}
function getLiteralValue(value, token) {
  switch (token.type) {
    case "Boolean":
      return value === "true";
    case "Number":
      return Number(value);
    case "String":
      return getStringValue(value.slice(1, -1), token);
    default:
      throw new TypeError(`Unknown token type "${token.type}.`);
  }
}
function parse(text, options) {
  options = Object.freeze({
    ...DEFAULT_OPTIONS,
    ...options
  });
  const tokens = tokenize(text, {
    mode: options.mode,
    ranges: options.ranges
  });
  let tokenIndex = 0;
  function nextNoComments() {
    return tokens[tokenIndex++];
  }
  function nextSkipComments() {
    const nextToken = tokens[tokenIndex++];
    if (nextToken && nextToken.type.endsWith("Comment")) {
      return nextSkipComments();
    }
    return nextToken;
  }
  const next = options.mode === "jsonc" ? nextSkipComments : nextNoComments;
  function assertTokenType(token, type2) {
    if (!token || token.type !== type2) {
      throw new UnexpectedToken(token);
    }
  }
  function createRange(start, end) {
    return options.ranges ? {
      range: [start.offset, end.offset]
    } : void 0;
  }
  function createLiteralNode(token) {
    const range = createRange(token.loc.start, token.loc.end);
    const value = getLiteralValue(
      text.slice(token.loc.start.offset, token.loc.end.offset),
      token
    );
    const loc = {
      start: {
        ...token.loc.start
      },
      end: {
        ...token.loc.end
      }
    };
    const parts = { loc, ...range };
    switch (token.type) {
      case "String":
        return types.string(
          /** @type {string} */
          value,
          parts
        );
      case "Number":
        return types.number(
          /** @type {number} */
          value,
          parts
        );
      case "Boolean":
        return types.boolean(
          /** @type {boolean} */
          value,
          parts
        );
      default:
        throw new TypeError(`Unknown token type ${token.type}.`);
    }
  }
  function createNullNode(token) {
    const range = createRange(token.loc.start, token.loc.end);
    return types.null({
      loc: {
        start: {
          ...token.loc.start
        },
        end: {
          ...token.loc.end
        }
      },
      ...range
    });
  }
  function parseProperty(token) {
    assertTokenType(token, "String");
    const name = createLiteralNode(token);
    token = next();
    assertTokenType(token, "Colon");
    const value = parseValue();
    const range = createRange(name.loc.start, value.loc.end);
    return types.member(
      /** @type {StringNode} */
      name,
      value,
      {
        loc: {
          start: {
            ...name.loc.start
          },
          end: {
            ...value.loc.end
          }
        },
        ...range
      }
    );
  }
  function parseObject(firstToken) {
    assertTokenType(firstToken, "LBrace");
    const members = [];
    let token = next();
    if (token && token.type !== "RBrace") {
      do {
        members.push(parseProperty(token));
        token = next();
        if (token.type === "Comma") {
          token = next();
        } else {
          break;
        }
      } while (token);
    }
    assertTokenType(token, "RBrace");
    const range = createRange(firstToken.loc.start, token.loc.end);
    return types.object(members, {
      loc: {
        start: {
          ...firstToken.loc.start
        },
        end: {
          ...token.loc.end
        }
      },
      ...range
    });
  }
  function parseArray(firstToken) {
    assertTokenType(firstToken, "LBracket");
    const elements = [];
    let token = next();
    if (token && token.type !== "RBracket") {
      do {
        const value = parseValue(token);
        elements.push(types.element(
          value,
          { loc: value.loc }
        ));
        token = next();
        if (token.type === "Comma") {
          token = next();
        } else {
          break;
        }
      } while (token);
    }
    assertTokenType(token, "RBracket");
    const range = createRange(firstToken.loc.start, token.loc.end);
    return types.array(elements, {
      loc: {
        start: {
          ...firstToken.loc.start
        },
        end: {
          ...token.loc.end
        }
      },
      ...range
    });
  }
  function parseValue(token) {
    token = token || next();
    switch (token.type) {
      case "String":
      case "Boolean":
      case "Number":
        return createLiteralNode(token);
      case "Null":
        return createNullNode(token);
      case "LBrace":
        return parseObject(token);
      case "LBracket":
        return parseArray(token);
      default:
        throw new UnexpectedToken(token);
    }
  }
  const docBody = parseValue();
  const unexpectedToken = next();
  if (unexpectedToken) {
    throw new UnexpectedToken(unexpectedToken);
  }
  const docParts = {
    loc: {
      start: {
        line: 1,
        column: 1,
        offset: 0
      },
      end: {
        ...docBody.loc.end
      }
    }
  };
  if (options.tokens) {
    docParts.tokens = tokens;
  }
  if (options.ranges) {
    docParts.range = [
      docParts.loc.start.offset,
      docParts.loc.end.offset
    ];
  }
  return types.document(docBody, docParts);
}
var eq = (x) => (y) => x === y;
var not = (fn) => (x) => !fn(x);
var getValues = (o) => Object.values(o);
var notUndefined = (x) => x !== void 0;
var isXError = (x) => (error) => error.keyword === x;
var isRequiredError = isXError("required");
var isAnyOfError = isXError("anyOf");
var isEnumError = isXError("enum");
var getErrors = (node) => node && node.errors ? node.errors.map(
  (e) => e.keyword === "errorMessage" ? { ...e.params.errors[0], message: e.message } : e
) : [];
var getChildren = (node) => node && getValues(node.children) || [];
var getSiblings = (parent) => (node) => getChildren(parent).filter(not(eq(node)));
var concatAll = (xs) => (ys) => ys.reduce((zs, z) => zs.concat(z), xs);
var getPointers = (dataPath) => {
  return dataPath.split("/").slice(1).map((pointer2) => pointer2.split("~1").join("/").split("~0").join("~"));
};
function getMetaFromPath(jsonAst, dataPath, includeIdentifierLocation) {
  const pointers = getPointers(dataPath);
  const lastPointerIndex = pointers.length - 1;
  return pointers.reduce((obj, pointer2, idx) => {
    switch (obj.type) {
      case "Object": {
        const filtered = obj.members.filter(
          (child) => child.name.value === pointer2
        );
        if (filtered.length !== 1) {
          throw new Error(`Couldn't find property ${pointer2} of ${dataPath}`);
        }
        const { name, value } = filtered[0];
        return includeIdentifierLocation && idx === lastPointerIndex ? name : value;
      }
      case "Array":
        return obj.elements[pointer2].value;
      default:
        console.log(obj);
    }
  }, jsonAst.body);
}
function getDecoratedDataPath(jsonAst, dataPath) {
  let decoratedPath = "";
  getPointers(dataPath).reduce((obj, pointer2) => {
    switch (obj.type) {
      case "Element":
        obj = obj.value;
      case "Object": {
        decoratedPath += `/${pointer2}`;
        const filtered = obj.members.filter(
          (child) => child.name.value === pointer2
        );
        if (filtered.length !== 1) {
          throw new Error(`Couldn't find property ${pointer2} of ${dataPath}`);
        }
        return filtered[0].value;
      }
      case "Array": {
        decoratedPath += `/${pointer2}${getTypeName(obj.elements[pointer2])}`;
        return obj.elements[pointer2];
      }
      default:
        console.log(obj);
    }
  }, jsonAst.body);
  return decoratedPath;
}
function getTypeName(obj) {
  if (!obj || !obj.elements) {
    return "";
  }
  const type2 = obj.elements.filter(
    (child) => child && child.name && child.name.value === "type"
  );
  if (!type2.length) {
    return "";
  }
  return type2[0].value && `:${type2[0].value.value}` || "";
}
var BaseValidationError = class {
  constructor(options = { isIdentifierLocation: false }, { data, schema: schema2, jsonAst, jsonRaw }) {
    this.options = options;
    this.data = data;
    this.schema = schema2;
    this.jsonAst = jsonAst;
    this.jsonRaw = jsonRaw;
  }
  getLocation(dataPath = this.instancePath) {
    const { isIdentifierLocation, isSkipEndLocation } = this.options;
    const { loc } = getMetaFromPath(
      this.jsonAst,
      dataPath,
      isIdentifierLocation
    );
    return {
      start: loc.start,
      end: isSkipEndLocation ? void 0 : loc.end
    };
  }
  getDecoratedPath(dataPath = this.instancePath) {
    const decoratedPath = getDecoratedDataPath(this.jsonAst, dataPath);
    return decoratedPath;
  }
  getCodeFrame(message, dataPath = this.instancePath) {
    return (0, import_code_frame.codeFrameColumns)(this.jsonRaw, this.getLocation(dataPath), {
      highlightCode: true,
      message
    });
  }
  /**
   * @return {string}
   */
  get instancePath() {
    return typeof this.options.instancePath !== "undefined" ? this.options.instancePath : this.options.dataPath;
  }
  print() {
    throw new Error(
      `Implement the 'print' method inside ${this.constructor.name}!`
    );
  }
  getError() {
    throw new Error(
      `Implement the 'getError' method inside ${this.constructor.name}!`
    );
  }
};
var RequiredValidationError = class extends BaseValidationError {
  getLocation(dataPath = this.instancePath) {
    const { start } = super.getLocation(dataPath);
    return { start };
  }
  print() {
    const { message, params } = this.options;
    const output = [import_chalk.default`{red {bold REQUIRED} ${message}}\n`];
    return output.concat(
      this.getCodeFrame(
        import_chalk.default`☹️  {magentaBright ${params.missingProperty}} is missing here!`
      )
    );
  }
  getError() {
    const { message } = this.options;
    return {
      ...this.getLocation(),
      error: `${this.getDecoratedPath()} ${message}`,
      path: this.instancePath
    };
  }
};
var AdditionalPropValidationError = class extends BaseValidationError {
  constructor(...args) {
    super(...args);
    this.options.isIdentifierLocation = true;
  }
  print() {
    const { message, params } = this.options;
    const output = [import_chalk2.default`{red {bold ADDTIONAL PROPERTY} ${message}}\n`];
    return output.concat(
      this.getCodeFrame(
        import_chalk2.default`😲  {magentaBright ${params.additionalProperty}} is not expected to be here!`,
        `${this.instancePath}/${params.additionalProperty}`
      )
    );
  }
  getError() {
    const { params } = this.options;
    return {
      ...this.getLocation(`${this.instancePath}/${params.additionalProperty}`),
      error: `${this.getDecoratedPath()} Property ${params.additionalProperty} is not expected to be here`,
      path: this.instancePath
    };
  }
};
var import_leven = __toESM2(require_leven());
var import_jsonpointer = __toESM2(require_jsonpointer());
var EnumValidationError = class extends BaseValidationError {
  print() {
    const {
      message,
      params: { allowedValues }
    } = this.options;
    const bestMatch = this.findBestMatch();
    const output = [
      import_chalk3.default`{red {bold ENUM} ${message}}`,
      import_chalk3.default`{red (${allowedValues.join(", ")})}\n`
    ];
    return output.concat(
      this.getCodeFrame(
        bestMatch !== null ? import_chalk3.default`👈🏽  Did you mean {magentaBright ${bestMatch}} here?` : import_chalk3.default`👈🏽  Unexpected value, should be equal to one of the allowed values`
      )
    );
  }
  getError() {
    const { message, params } = this.options;
    const bestMatch = this.findBestMatch();
    const allowedValues = params.allowedValues.join(", ");
    const output = {
      ...this.getLocation(),
      error: `${this.getDecoratedPath()} ${message}: ${allowedValues}`,
      path: this.instancePath
    };
    if (bestMatch !== null) {
      output.suggestion = `Did you mean ${bestMatch}?`;
    }
    return output;
  }
  findBestMatch() {
    const {
      params: { allowedValues }
    } = this.options;
    const currentValue = this.instancePath === "" ? this.data : import_jsonpointer.default.get(this.data, this.instancePath);
    if (!currentValue) {
      return null;
    }
    const bestMatch = allowedValues.map((value) => ({
      value,
      weight: (0, import_leven.default)(value, currentValue.toString())
    })).sort(
      (x, y) => x.weight > y.weight ? 1 : x.weight < y.weight ? -1 : 0
    )[0];
    return allowedValues.length === 1 || bestMatch.weight < bestMatch.value.length ? bestMatch.value : null;
  }
};
var DefaultValidationError = class extends BaseValidationError {
  print() {
    const { keyword, message } = this.options;
    const output = [import_chalk4.default`{red {bold ${keyword.toUpperCase()}} ${message}}\n`];
    return output.concat(
      this.getCodeFrame(import_chalk4.default`👈🏽  {magentaBright ${keyword}} ${message}`)
    );
  }
  getError() {
    const { keyword, message } = this.options;
    return {
      ...this.getLocation(),
      error: `${this.getDecoratedPath()}: ${keyword} ${message}`,
      path: this.instancePath
    };
  }
};
var JSON_POINTERS_REGEX = /\/[\w_-]+(\/\d+)?/g;
function makeTree(ajvErrors = []) {
  const root = { children: {} };
  ajvErrors.forEach((ajvError) => {
    const instancePath = typeof ajvError.instancePath !== "undefined" ? ajvError.instancePath : ajvError.dataPath;
    const paths = instancePath === "" ? [""] : instancePath.match(JSON_POINTERS_REGEX);
    paths && paths.reduce((obj, path, i) => {
      obj.children[path] = obj.children[path] || { children: {}, errors: [] };
      if (i === paths.length - 1) {
        obj.children[path].errors.push(ajvError);
      }
      return obj.children[path];
    }, root);
  });
  return root;
}
function filterRedundantErrors(root, parent, key) {
  getErrors(root).forEach((error) => {
    if (isRequiredError(error)) {
      root.errors = [error];
      root.children = {};
    }
  });
  if (getErrors(root).some(isAnyOfError)) {
    if (Object.keys(root.children).length > 0) {
      delete root.errors;
    }
  }
  if (root.errors && root.errors.length && getErrors(root).every(isEnumError)) {
    if (getSiblings(parent)(root).filter(notUndefined).some(getErrors)) {
      delete parent.children[key];
    }
  }
  Object.entries(root.children).forEach(
    ([key2, child]) => filterRedundantErrors(child, root, key2)
  );
}
function createErrorInstances(root, options) {
  const errors = getErrors(root);
  if (errors.length && errors.every(isEnumError)) {
    const uniqueValues = new Set(
      concatAll([])(errors.map((e) => e.params.allowedValues))
    );
    const allowedValues = [...uniqueValues];
    const error = errors[0];
    return [
      new EnumValidationError(
        {
          ...error,
          params: { allowedValues }
        },
        options
      )
    ];
  } else {
    return concatAll(
      errors.reduce((ret, error) => {
        switch (error.keyword) {
          case "additionalProperties":
            return ret.concat(
              new AdditionalPropValidationError(error, options)
            );
          case "enum":
            return ret.concat(new EnumValidationError(error, options));
          case "required":
            return ret.concat(new RequiredValidationError(error, options));
          default:
            return ret.concat(new DefaultValidationError(error, options));
        }
      }, [])
    )(getChildren(root).map((child) => createErrorInstances(child, options)));
  }
}
var helpers_default = (ajvErrors, options) => {
  const tree = makeTree(ajvErrors || []);
  filterRedundantErrors(tree);
  return createErrorInstances(tree, options);
};
var src_default = (schema2, data, errors, options = {}) => {
  const { format: format2 = "cli", indent = null, json = null } = options;
  const jsonRaw = json || JSON.stringify(data, null, indent);
  const jsonAst = parse(jsonRaw);
  const customErrorToText = (error) => error.print().join("\n");
  const customErrorToStructure = (error) => error.getError();
  const customErrors = helpers_default(errors, {
    data,
    schema: schema2,
    jsonAst,
    jsonRaw
  });
  if (format2 === "cli") {
    return customErrors.map(customErrorToText).join("\n\n");
  } else {
    return customErrors.map(customErrorToStructure);
  }
};

// node_modules/html-validate/dist/es/core.js
var import_fs = __toESM(require_fs(), 1);
var import_code_frame2 = __toESM(require_lib3(), 1);

// node_modules/kleur/index.mjs
init_define_process();
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof define_process_default !== "undefined") {
  ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = define_process_default.env || {});
  isTTY = define_process_default.stdout && define_process_default.stdout.isTTY;
}
var $ = {
  enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY),
  // modifiers
  reset: init(0, 0),
  bold: init(1, 22),
  dim: init(2, 22),
  italic: init(3, 23),
  underline: init(4, 24),
  inverse: init(7, 27),
  hidden: init(8, 28),
  strikethrough: init(9, 29),
  // colors
  black: init(30, 39),
  red: init(31, 39),
  green: init(32, 39),
  yellow: init(33, 39),
  blue: init(34, 39),
  magenta: init(35, 39),
  cyan: init(36, 39),
  white: init(37, 39),
  gray: init(90, 39),
  grey: init(90, 39),
  // background colors
  bgBlack: init(40, 49),
  bgRed: init(41, 49),
  bgGreen: init(42, 49),
  bgYellow: init(43, 49),
  bgBlue: init(44, 49),
  bgMagenta: init(45, 49),
  bgCyan: init(46, 49),
  bgWhite: init(47, 49)
};
function run(arr, str) {
  let i = 0, tmp, beg = "", end = "";
  for (; i < arr.length; i++) {
    tmp = arr[i];
    beg += tmp.open;
    end += tmp.close;
    if (!!~str.indexOf(tmp.close)) {
      str = str.replace(tmp.rgx, tmp.close + tmp.open);
    }
  }
  return beg + str + end;
}
function chain(has, keys) {
  let ctx = { has, keys };
  ctx.reset = $.reset.bind(ctx);
  ctx.bold = $.bold.bind(ctx);
  ctx.dim = $.dim.bind(ctx);
  ctx.italic = $.italic.bind(ctx);
  ctx.underline = $.underline.bind(ctx);
  ctx.inverse = $.inverse.bind(ctx);
  ctx.hidden = $.hidden.bind(ctx);
  ctx.strikethrough = $.strikethrough.bind(ctx);
  ctx.black = $.black.bind(ctx);
  ctx.red = $.red.bind(ctx);
  ctx.green = $.green.bind(ctx);
  ctx.yellow = $.yellow.bind(ctx);
  ctx.blue = $.blue.bind(ctx);
  ctx.magenta = $.magenta.bind(ctx);
  ctx.cyan = $.cyan.bind(ctx);
  ctx.white = $.white.bind(ctx);
  ctx.gray = $.gray.bind(ctx);
  ctx.grey = $.grey.bind(ctx);
  ctx.bgBlack = $.bgBlack.bind(ctx);
  ctx.bgRed = $.bgRed.bind(ctx);
  ctx.bgGreen = $.bgGreen.bind(ctx);
  ctx.bgYellow = $.bgYellow.bind(ctx);
  ctx.bgBlue = $.bgBlue.bind(ctx);
  ctx.bgMagenta = $.bgMagenta.bind(ctx);
  ctx.bgCyan = $.bgCyan.bind(ctx);
  ctx.bgWhite = $.bgWhite.bind(ctx);
  return ctx;
}
function init(open, close) {
  let blk = {
    open: `\x1B[${open}m`,
    close: `\x1B[${close}m`,
    rgx: new RegExp(`\\x1b\\[${close}m`, "g")
  };
  return function(txt) {
    if (this !== void 0 && this.has !== void 0) {
      !!~this.has.indexOf(open) || (this.has.push(open), this.keys.push(blk));
      return txt === void 0 ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
    }
    return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt + "") : txt + "";
  };
}

// node_modules/@html-validate/stylish/dist/esm/browser.js
init_define_process();
var __create3 = Object.create;
var __defProp3 = Object.defineProperty;
var __getOwnPropDesc3 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames3 = Object.getOwnPropertyNames;
var __getProtoOf3 = Object.getPrototypeOf;
var __hasOwnProp3 = Object.prototype.hasOwnProperty;
var __commonJS3 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames3(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps3 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames3(from))
      if (!__hasOwnProp3.call(to, key) && key !== except)
        __defProp3(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc3(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM3 = (mod, isNodeMode, target) => (target = mod != null ? __create3(__getProtoOf3(mod)) : {}, __copyProps3(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp3(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_text_table = __commonJS3({
  "node_modules/text-table/index.js"(exports, module) {
    module.exports = function(rows_, opts) {
      if (!opts)
        opts = {};
      var hsep = opts.hsep === void 0 ? "  " : opts.hsep;
      var align = opts.align || [];
      var stringLength = opts.stringLength || function(s) {
        return String(s).length;
      };
      var dotsizes = reduce(rows_, function(acc, row) {
        forEach(row, function(c, ix) {
          var n = dotindex(c);
          if (!acc[ix] || n > acc[ix])
            acc[ix] = n;
        });
        return acc;
      }, []);
      var rows = map(rows_, function(row) {
        return map(row, function(c_, ix) {
          var c = String(c_);
          if (align[ix] === ".") {
            var index = dotindex(c);
            var size = dotsizes[ix] + (/\./.test(c) ? 1 : 2) - (stringLength(c) - index);
            return c + Array(size).join(" ");
          } else
            return c;
        });
      });
      var sizes = reduce(rows, function(acc, row) {
        forEach(row, function(c, ix) {
          var n = stringLength(c);
          if (!acc[ix] || n > acc[ix])
            acc[ix] = n;
        });
        return acc;
      }, []);
      return map(rows, function(row) {
        return map(row, function(c, ix) {
          var n = sizes[ix] - stringLength(c) || 0;
          var s = Array(Math.max(n + 1, 1)).join(" ");
          if (align[ix] === "r" || align[ix] === ".") {
            return s + c;
          }
          if (align[ix] === "c") {
            return Array(Math.ceil(n / 2 + 1)).join(" ") + c + Array(Math.floor(n / 2 + 1)).join(" ");
          }
          return c + s;
        }).join(hsep).replace(/\s+$/, "");
      }).join("\n");
    };
    function dotindex(c) {
      var m = /\.[^.]*$/.exec(c);
      return m ? m.index + 1 : c.length;
    }
    function reduce(xs, f, init2) {
      if (xs.reduce)
        return xs.reduce(f, init2);
      var i = 0;
      var acc = arguments.length >= 3 ? init2 : xs[i++];
      for (; i < xs.length; i++) {
        f(acc, xs[i], i);
      }
      return acc;
    }
    function forEach(xs, f) {
      if (xs.forEach)
        return xs.forEach(f);
      for (var i = 0; i < xs.length; i++) {
        f.call(xs, xs[i], i);
      }
    }
    function map(xs, f) {
      if (xs.map)
        return xs.map(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        res.push(f.call(xs, xs[i], i));
      }
      return res;
    }
  }
});
var import_text_table = __toESM3(require_text_table());

// node_modules/html-validate/dist/es/core.js
var import_semver = __toESM(require_semver2(), 1);
var $schema$2 = "http://json-schema.org/draft-06/schema#";
var $id$2 = "http://json-schema.org/draft-06/schema#";
var title = "Core schema meta-schema";
var definitions$1 = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        "default": 0
      }
    ]
  },
  simpleTypes: {
    "enum": [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: true,
    "default": []
  }
};
var type$2 = [
  "object",
  "boolean"
];
var properties$2 = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  "default": {},
  examples: {
    type: "array",
    items: {}
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    "default": {}
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    "default": false
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    "default": {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    "default": {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    "default": {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  "const": {},
  "enum": {
    type: "array",
    minItems: 1,
    uniqueItems: true
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: true
      }
    ]
  },
  format: {
    type: "string"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
};
var ajvSchemaDraft = {
  $schema: $schema$2,
  $id: $id$2,
  title,
  definitions: definitions$1,
  type: type$2,
  properties: properties$2,
  "default": {}
};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var isMergeableObject = function isMergeableObject2(value) {
  return isNonNullObject(value) && !isSpecial(value);
};
function isNonNullObject(value) {
  return !!value && typeof value === "object";
}
function isSpecial(value) {
  var stringValue = Object.prototype.toString.call(value);
  return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
}
var canUseSymbol = typeof Symbol === "function" && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
function isReactElement(value) {
  return value.$$typeof === REACT_ELEMENT_TYPE;
}
function emptyTarget(val) {
  return Array.isArray(val) ? [] : {};
}
function cloneUnlessOtherwiseSpecified(value, options) {
  return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
}
function defaultArrayMerge(target, source, options) {
  return target.concat(source).map(function(element) {
    return cloneUnlessOtherwiseSpecified(element, options);
  });
}
function getMergeFunction(key, options) {
  if (!options.customMerge) {
    return deepmerge;
  }
  var customMerge = options.customMerge(key);
  return typeof customMerge === "function" ? customMerge : deepmerge;
}
function getEnumerableOwnPropertySymbols(target) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
    return Object.propertyIsEnumerable.call(target, symbol);
  }) : [];
}
function getKeys(target) {
  return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
}
function propertyIsOnObject(object, property) {
  try {
    return property in object;
  } catch (_) {
    return false;
  }
}
function propertyIsUnsafe(target, key) {
  return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
}
function mergeObject(target, source, options) {
  var destination = {};
  if (options.isMergeableObject(target)) {
    getKeys(target).forEach(function(key) {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  getKeys(source).forEach(function(key) {
    if (propertyIsUnsafe(target, key)) {
      return;
    }
    if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
      destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
    } else {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    }
  });
  return destination;
}
function deepmerge(target, source, options) {
  options = options || {};
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || isMergeableObject;
  options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
  var sourceIsArray = Array.isArray(source);
  var targetIsArray = Array.isArray(target);
  var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  } else if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  } else {
    return mergeObject(target, source, options);
  }
}
deepmerge.all = function deepmergeAll(array, options) {
  if (!Array.isArray(array)) {
    throw new Error("first argument should be an array");
  }
  return array.reduce(function(prev, next) {
    return deepmerge(prev, next, options);
  }, {});
};
var deepmerge_1 = deepmerge;
var cjs = deepmerge_1;
var deepmerge$1 = /* @__PURE__ */ getDefaultExportFromCjs(cjs);
function stringify(value) {
  if (typeof value === "string") {
    return String(value);
  } else {
    return JSON.stringify(value);
  }
}
var WrappedError = class extends Error {
  constructor(message) {
    super(stringify(message));
  }
};
function ensureError(value) {
  if (value instanceof Error) {
    return value;
  } else {
    return new WrappedError(value);
  }
}
var NestedError = class _NestedError extends Error {
  constructor(message, nested) {
    super(message);
    Error.captureStackTrace(this, _NestedError);
    this.name = _NestedError.name;
    if (nested == null ? void 0 : nested.stack) {
      this.stack ??= "";
      this.stack += `
Caused by: ${nested.stack}`;
    }
  }
};
var UserError = class _UserError extends NestedError {
  constructor(message, nested) {
    super(message, nested);
    Error.captureStackTrace(this, _UserError);
    this.name = _UserError.name;
  }
  /**
   * @public
   */
  /* istanbul ignore next: default implementation */
  prettyFormat() {
    return void 0;
  }
};
var InheritError = class _InheritError extends UserError {
  constructor({ tagName, inherit }) {
    const message = `Element <${tagName}> cannot inherit from <${inherit}>: no such element`;
    super(message);
    Error.captureStackTrace(this, _InheritError);
    this.name = _InheritError.name;
    this.tagName = tagName;
    this.inherit = inherit;
    this.filename = null;
  }
  prettyFormat() {
    const { message, tagName, inherit } = this;
    const source = this.filename ? ["", "This error occurred when loading element metadata from:", `"${this.filename}"`, ""] : [""];
    return [
      message,
      ...source,
      "This usually occurs when the elements are defined in the wrong order, try one of the following:",
      "",
      `  - Ensure the spelling of "${inherit}" is correct.`,
      `  - Ensure the file containing "${inherit}" is loaded before the file containing "${tagName}".`,
      `  - Move the definition of "${inherit}" above the definition for "${tagName}".`
    ].join("\n");
  }
};
function getSummary(schema2, obj, errors) {
  const output = src_default(schema2, obj, errors, {
    format: "js"
  });
  return output.length > 0 ? output[0].error : "unknown validation error";
}
var SchemaValidationError = class extends UserError {
  constructor(filename, message, obj, schema2, errors) {
    const summary = getSummary(schema2, obj, errors);
    super(`${message}: ${summary}`);
    this.filename = filename;
    this.obj = obj;
    this.schema = schema2;
    this.errors = errors;
  }
};
function cyrb53(str) {
  const a = 2654435761;
  const b = 1597334677;
  const c = 2246822507;
  const d = 3266489909;
  const e = 4294967296;
  const f = 2097151;
  const seed = 0;
  let h1 = 3735928559 ^ seed;
  let h2 = 1103547991 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, a);
    h2 = Math.imul(h2 ^ ch, b);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, c) ^ Math.imul(h2 ^ h2 >>> 13, d);
  h2 = Math.imul(h2 ^ h2 >>> 16, c) ^ Math.imul(h1 ^ h1 >>> 13, d);
  return e * (f & h2) + (h1 >>> 0);
}
var computeHash = cyrb53;
var $schema$1 = "http://json-schema.org/draft-06/schema#";
var $id$1 = "https://html-validate.org/schemas/elements.json";
var type$1 = "object";
var properties$1 = {
  $schema: {
    type: "string"
  }
};
var patternProperties = {
  "^[^$].*$": {
    type: "object",
    properties: {
      inherit: {
        title: "Inherit from another element",
        description: "Most properties from the parent element will be copied onto this one",
        type: "string"
      },
      embedded: {
        title: "Mark this element as belonging in the embedded content category",
        $ref: "#/definitions/contentCategory"
      },
      flow: {
        title: "Mark this element as belonging in the flow content category",
        $ref: "#/definitions/contentCategory"
      },
      heading: {
        title: "Mark this element as belonging in the heading content category",
        $ref: "#/definitions/contentCategory"
      },
      interactive: {
        title: "Mark this element as belonging in the interactive content category",
        $ref: "#/definitions/contentCategory"
      },
      metadata: {
        title: "Mark this element as belonging in the metadata content category",
        $ref: "#/definitions/contentCategory"
      },
      phrasing: {
        title: "Mark this element as belonging in the phrasing content category",
        $ref: "#/definitions/contentCategory"
      },
      sectioning: {
        title: "Mark this element as belonging in the sectioning content category",
        $ref: "#/definitions/contentCategory"
      },
      deprecated: {
        title: "Mark element as deprecated",
        description: "Deprecated elements should not be used. If a message is provided it will be included in the error",
        anyOf: [
          {
            type: "boolean"
          },
          {
            type: "string"
          },
          {
            $ref: "#/definitions/deprecatedElement"
          }
        ]
      },
      foreign: {
        title: "Mark element as foreign",
        description: "Foreign elements are elements which have a start and end tag but is otherwize not parsed",
        type: "boolean"
      },
      "void": {
        title: "Mark element as void",
        description: "Void elements are elements which cannot have content and thus must not use an end tag",
        type: "boolean"
      },
      transparent: {
        title: "Mark element as transparent",
        description: "Transparent elements follows the same content model as its parent, i.e. the content must be allowed in the parent.",
        anyOf: [
          {
            type: "boolean"
          },
          {
            type: "array",
            items: {
              type: "string"
            }
          }
        ]
      },
      implicitClosed: {
        title: "List of elements which implicitly closes this element",
        description: "Some elements are automatically closed when another start tag occurs",
        type: "array",
        items: {
          type: "string"
        }
      },
      implicitRole: {
        title: "Implicit ARIA role for this element",
        description: "Some elements have implicit ARIA roles.",
        deprecated: true,
        "function": true
      },
      aria: {
        title: "WAI-ARIA properties for this element",
        $ref: "#/definitions/Aria"
      },
      scriptSupporting: {
        title: "Mark element as script-supporting",
        description: "Script-supporting elements are elements which can be inserted where othersise not permitted to assist in templating",
        type: "boolean"
      },
      focusable: {
        title: "Mark this element as focusable",
        description: "This element may contain an associated label element.",
        anyOf: [
          {
            type: "boolean"
          },
          {
            "function": true
          }
        ]
      },
      form: {
        title: "Mark element as a submittable form element",
        type: "boolean"
      },
      formAssociated: {
        title: "Mark element as a form-associated element",
        $ref: "#/definitions/FormAssociated"
      },
      labelable: {
        title: "Mark this element as labelable",
        description: "This element may contain an associated label element.",
        anyOf: [
          {
            type: "boolean"
          },
          {
            $ref: "#/definitions/expression"
          }
        ]
      },
      deprecatedAttributes: {
        title: "List of deprecated attributes",
        type: "array",
        items: {
          type: "string"
        }
      },
      requiredAttributes: {
        title: "List of required attributes",
        type: "array",
        items: {
          type: "string"
        }
      },
      attributes: {
        title: "List of known attributes and allowed values",
        $ref: "#/definitions/PermittedAttribute"
      },
      permittedContent: {
        title: "List of elements or categories allowed as content in this element",
        $ref: "#/definitions/Permitted"
      },
      permittedDescendants: {
        title: "List of elements or categories allowed as descendants in this element",
        $ref: "#/definitions/Permitted"
      },
      permittedOrder: {
        title: "Required order of child elements",
        $ref: "#/definitions/PermittedOrder"
      },
      permittedParent: {
        title: "List of elements or categories allowed as parent to this element",
        $ref: "#/definitions/Permitted"
      },
      requiredAncestors: {
        title: "List of required ancestor elements",
        $ref: "#/definitions/RequiredAncestors"
      },
      requiredContent: {
        title: "List of required content elements",
        $ref: "#/definitions/RequiredContent"
      },
      textContent: {
        title: "Allow, disallow or require textual content",
        description: "This property controls whenever an element allows, disallows or requires text. Text from any descendant counts, not only direct children",
        "default": "default",
        type: "string",
        "enum": [
          "none",
          "default",
          "required",
          "accessible"
        ]
      }
    },
    additionalProperties: false
  }
};
var definitions = {
  Aria: {
    type: "object",
    additionalProperties: false,
    properties: {
      implicitRole: {
        title: "Implicit ARIA role for this element",
        description: "Some elements have implicit ARIA roles.",
        anyOf: [
          {
            type: "string"
          },
          {
            "function": true
          }
        ]
      },
      naming: {
        title: "Prohibit or allow this element to be named by aria-label or aria-labelledby",
        anyOf: [
          {
            type: "string",
            "enum": [
              "prohibited",
              "allowed"
            ]
          },
          {
            "function": true
          }
        ]
      }
    }
  },
  contentCategory: {
    anyOf: [
      {
        type: "boolean"
      },
      {
        $ref: "#/definitions/expression"
      },
      {
        "function": true
      }
    ]
  },
  expression: {
    type: "array",
    minItems: 2,
    maxItems: 2,
    items: [
      {
        type: "string",
        "enum": [
          "isDescendant",
          "hasAttribute",
          "matchAttribute"
        ]
      },
      {
        anyOf: [
          {
            type: "string"
          },
          {
            $ref: "#/definitions/operation"
          }
        ]
      }
    ]
  },
  operation: {
    type: "array",
    minItems: 3,
    maxItems: 3,
    items: [
      {
        type: "string"
      },
      {
        type: "string",
        "enum": [
          "!=",
          "="
        ]
      },
      {
        type: "string"
      }
    ]
  },
  deprecatedElement: {
    type: "object",
    additionalProperties: false,
    properties: {
      message: {
        type: "string",
        title: "A short text message shown next to the regular error message."
      },
      documentation: {
        type: "string",
        title: "An extended markdown formatted message shown with the contextual rule documentation."
      },
      source: {
        type: "string",
        title: "Element source, e.g. what standard or library deprecated this element.",
        "default": "html5"
      }
    }
  },
  FormAssociated: {
    type: "object",
    additionalProperties: false,
    properties: {
      disablable: {
        type: "boolean",
        title: "Disablable elements can be disabled using the disabled attribute."
      },
      listed: {
        type: "boolean",
        title: "Listed elements have a name attribute and is listed in the form and fieldset elements property."
      }
    }
  },
  Permitted: {
    type: "array",
    items: {
      anyOf: [
        {
          type: "string"
        },
        {
          type: "array",
          items: {
            anyOf: [
              {
                type: "string"
              },
              {
                $ref: "#/definitions/PermittedGroup"
              }
            ]
          }
        },
        {
          $ref: "#/definitions/PermittedGroup"
        }
      ]
    }
  },
  PermittedAttribute: {
    type: "object",
    patternProperties: {
      "^.*$": {
        anyOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              allowed: {
                "function": true,
                title: "Set to a function to evaluate if this attribute is allowed in this context"
              },
              boolean: {
                type: "boolean",
                title: "Set to true if this is a boolean attribute"
              },
              deprecated: {
                title: "Set to true or string if this attribute is deprecated",
                oneOf: [
                  {
                    type: "boolean"
                  },
                  {
                    type: "string"
                  }
                ]
              },
              list: {
                type: "boolean",
                title: "Set to true if this attribute is a list of space-separated tokens, each which must be valid by itself"
              },
              "enum": {
                type: "array",
                title: "Exhaustive list of values (string or regex) this attribute accepts",
                uniqueItems: true,
                items: {
                  anyOf: [
                    {
                      type: "string"
                    },
                    {
                      regexp: true
                    }
                  ]
                }
              },
              omit: {
                type: "boolean",
                title: "Set to true if this attribute can optionally omit its value"
              },
              required: {
                type: "boolean",
                title: "Set to true if this attribute is required"
              }
            }
          },
          {
            type: "array",
            uniqueItems: true,
            items: {
              type: "string"
            }
          },
          {
            type: "null"
          }
        ]
      }
    }
  },
  PermittedGroup: {
    type: "object",
    additionalProperties: false,
    properties: {
      exclude: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "string"
          }
        ]
      }
    }
  },
  PermittedOrder: {
    type: "array",
    items: {
      type: "string"
    }
  },
  RequiredAncestors: {
    type: "array",
    items: {
      type: "string"
    }
  },
  RequiredContent: {
    type: "array",
    items: {
      type: "string"
    }
  }
};
var schema = {
  $schema: $schema$1,
  $id: $id$1,
  type: type$1,
  properties: properties$1,
  patternProperties,
  definitions
};
var ajvRegexpValidate = function(data, dataCxt) {
  const valid = data instanceof RegExp;
  if (!valid) {
    ajvRegexpValidate.errors = [
      {
        instancePath: dataCxt == null ? void 0 : dataCxt.instancePath,
        schemaPath: void 0,
        keyword: "type",
        message: "should be a regular expression",
        params: {
          keyword: "type"
        }
      }
    ];
  }
  return valid;
};
var ajvRegexpKeyword = {
  keyword: "regexp",
  schema: false,
  errors: true,
  validate: ajvRegexpValidate
};
var ajvFunctionValidate = function(data, dataCxt) {
  const valid = typeof data === "function";
  if (!valid) {
    ajvFunctionValidate.errors = [
      {
        instancePath: (
          /* istanbul ignore next */
          dataCxt == null ? void 0 : dataCxt.instancePath
        ),
        schemaPath: void 0,
        keyword: "type",
        message: "should be a function",
        params: {
          keyword: "type"
        }
      }
    ];
  }
  return valid;
};
var ajvFunctionKeyword = {
  keyword: "function",
  schema: false,
  errors: true,
  validate: ajvFunctionValidate
};
var TextContent$1 = /* @__PURE__ */ ((TextContent2) => {
  TextContent2["NONE"] = "none";
  TextContent2["DEFAULT"] = "default";
  TextContent2["REQUIRED"] = "required";
  TextContent2["ACCESSIBLE"] = "accessible";
  return TextContent2;
})(TextContent$1 || {});
var MetaCopyableProperty = [
  "metadata",
  "flow",
  "sectioning",
  "heading",
  "phrasing",
  "embedded",
  "interactive",
  "transparent",
  "focusable",
  "form",
  "formAssociated",
  "labelable",
  "attributes",
  "aria",
  "permittedContent",
  "permittedDescendants",
  "permittedOrder",
  "permittedParent",
  "requiredAncestors",
  "requiredContent"
];
function setMetaProperty(dst, key, value) {
  dst[key] = value;
}
function isSet(value) {
  return typeof value !== "undefined";
}
function flag(value) {
  return value ? true : void 0;
}
function stripUndefined(src) {
  const entries = Object.entries(src).filter(([, value]) => isSet(value));
  return Object.fromEntries(entries);
}
function migrateSingleAttribute(src, key) {
  var _a2, _b;
  const result = {};
  result.deprecated = flag((_a2 = src.deprecatedAttributes) == null ? void 0 : _a2.includes(key));
  result.required = flag((_b = src.requiredAttributes) == null ? void 0 : _b.includes(key));
  result.omit = void 0;
  const attr = src.attributes ? src.attributes[key] : void 0;
  if (typeof attr === "undefined") {
    return stripUndefined(result);
  }
  if (attr === null) {
    result.delete = true;
    return stripUndefined(result);
  }
  if (Array.isArray(attr)) {
    if (attr.length === 0) {
      result.boolean = true;
    } else {
      result.enum = attr.filter((it) => it !== "");
      if (attr.includes("")) {
        result.omit = true;
      }
    }
    return stripUndefined(result);
  } else {
    return stripUndefined({ ...result, ...attr });
  }
}
function migrateAttributes(src) {
  const keys = [
    ...Object.keys(src.attributes ?? {}),
    ...src.requiredAttributes ?? [],
    ...src.deprecatedAttributes ?? []
  ].sort();
  const entries = keys.map((key) => {
    return [key, migrateSingleAttribute(src, key)];
  });
  return Object.fromEntries(entries);
}
function normalizeAriaImplicitRole(value) {
  if (!value) {
    return () => null;
  }
  if (typeof value === "string") {
    return () => value;
  }
  return value;
}
function normalizeAriaNaming(value) {
  if (!value) {
    return () => "allowed";
  }
  if (typeof value === "string") {
    return () => value;
  }
  return value;
}
function migrateElement(src) {
  var _a2, _b;
  const implicitRole = normalizeAriaImplicitRole(src.implicitRole ?? ((_a2 = src.aria) == null ? void 0 : _a2.implicitRole));
  const result = {
    ...src,
    ...{
      formAssociated: void 0
    },
    attributes: migrateAttributes(src),
    textContent: src.textContent,
    focusable: src.focusable ?? false,
    implicitRole,
    aria: {
      implicitRole,
      naming: normalizeAriaNaming((_b = src.aria) == null ? void 0 : _b.naming)
    }
  };
  delete result.deprecatedAttributes;
  delete result.requiredAttributes;
  if (!result.textContent) {
    delete result.textContent;
  }
  if (src.formAssociated) {
    result.formAssociated = {
      disablable: Boolean(src.formAssociated.disablable),
      listed: Boolean(src.formAssociated.listed)
    };
  } else {
    delete result.formAssociated;
  }
  return result;
}
function isDescendant(node, tagName) {
  let cur = node.parent;
  while (cur && !cur.isRootElement()) {
    if (cur.is(tagName)) {
      return true;
    }
    cur = cur.parent;
  }
  return false;
}
function hasAttribute(node, attr) {
  return node.hasAttribute(attr);
}
function matchAttribute(node, key, op, value) {
  const nodeValue = (node.getAttributeValue(key) ?? "").toLowerCase();
  switch (op) {
    case "!=":
      return nodeValue !== value;
    case "=":
      return nodeValue === value;
  }
}
var dynamicKeys = [
  "metadata",
  "flow",
  "sectioning",
  "heading",
  "phrasing",
  "embedded",
  "interactive",
  "labelable"
];
var functionTable = {
  isDescendant: isDescendantFacade,
  hasAttribute: hasAttributeFacade,
  matchAttribute: matchAttributeFacade
};
var schemaCache = /* @__PURE__ */ new Map();
function clone(src) {
  return JSON.parse(JSON.stringify(src));
}
function overwriteMerge$1(a, b) {
  return b;
}
var MetaTable = class {
  /**
   * @internal
   */
  constructor() {
    this.elements = {};
    this.schema = clone(schema);
  }
  /**
   * @internal
   */
  init() {
    this.resolveGlobal();
  }
  /**
   * Extend validation schema.
   *
   * @public
   */
  extendValidationSchema(patch) {
    if (patch.properties) {
      this.schema = deepmerge$1(this.schema, {
        patternProperties: {
          "^[^$].*$": {
            properties: patch.properties
          }
        }
      });
    }
    if (patch.definitions) {
      this.schema = deepmerge$1(this.schema, {
        definitions: patch.definitions
      });
    }
  }
  /**
   * Load metadata table from object.
   *
   * @public
   * @param obj - Object with metadata to load
   * @param filename - Optional filename used when presenting validation error
   */
  loadFromObject(obj, filename = null) {
    try {
      const validate = this.getSchemaValidator();
      if (!validate(obj)) {
        throw new SchemaValidationError(
          filename,
          `Element metadata is not valid`,
          obj,
          this.schema,
          /* istanbul ignore next: AJV sets .errors when validate returns false */
          validate.errors ?? []
        );
      }
      for (const [key, value] of Object.entries(obj)) {
        if (key === "$schema")
          continue;
        this.addEntry(key, migrateElement(value));
      }
    } catch (err) {
      if (err instanceof InheritError) {
        err.filename = filename;
        throw err;
      }
      if (err instanceof SchemaValidationError) {
        throw err;
      }
      if (!filename) {
        throw err;
      }
      throw new UserError(`Failed to load element metadata from "${filename}"`, ensureError(err));
    }
  }
  /**
   * Get [[MetaElement]] for the given tag. If no specific metadata is present
   * the global metadata is returned or null if no global is present.
   *
   * @public
   * @returns A shallow copy of metadata.
   */
  getMetaFor(tagName) {
    tagName = tagName.toLowerCase();
    if (this.elements[tagName]) {
      return { ...this.elements[tagName] };
    }
    if (this.elements["*"]) {
      return { ...this.elements["*"] };
    }
    return null;
  }
  /**
   * Find all tags which has enabled given property.
   *
   * @public
   */
  getTagsWithProperty(propName) {
    return Object.entries(this.elements).filter(([, entry]) => entry[propName]).map(([tagName]) => tagName);
  }
  /**
   * Find tag matching tagName or inheriting from it.
   *
   * @public
   */
  getTagsDerivedFrom(tagName) {
    return Object.entries(this.elements).filter(([key, entry]) => key === tagName || entry.inherit === tagName).map(([tagName2]) => tagName2);
  }
  addEntry(tagName, entry) {
    let parent = this.elements[tagName] || {};
    if (entry.inherit) {
      const name = entry.inherit;
      parent = this.elements[name];
      if (!parent) {
        throw new InheritError({
          tagName,
          inherit: name
        });
      }
    }
    const expanded = this.mergeElement(parent, { ...entry, tagName });
    expandRegex(expanded);
    this.elements[tagName] = expanded;
  }
  /**
   * Construct a new AJV schema validator.
   */
  getSchemaValidator() {
    const hash = computeHash(JSON.stringify(this.schema));
    const cached = schemaCache.get(hash);
    if (cached) {
      return cached;
    } else {
      const ajv2 = new import_ajv.default({ strict: true, strictTuples: true, strictTypes: true });
      ajv2.addMetaSchema(ajvSchemaDraft);
      ajv2.addKeyword(ajvFunctionKeyword);
      ajv2.addKeyword(ajvRegexpKeyword);
      ajv2.addKeyword({ keyword: "copyable" });
      const validate = ajv2.compile(this.schema);
      schemaCache.set(hash, validate);
      return validate;
    }
  }
  /**
   * @public
   */
  getJSONSchema() {
    return this.schema;
  }
  /**
   * Finds the global element definition and merges each known element with the
   * global, e.g. to assign global attributes.
   */
  resolveGlobal() {
    if (!this.elements["*"])
      return;
    const global = this.elements["*"];
    delete this.elements["*"];
    delete global.tagName;
    delete global.void;
    for (const [tagName, entry] of Object.entries(this.elements)) {
      this.elements[tagName] = this.mergeElement(global, entry);
    }
  }
  mergeElement(a, b) {
    const merged = deepmerge$1(a, b, { arrayMerge: overwriteMerge$1 });
    const filteredAttrs = Object.entries(
      merged.attributes
    ).filter(([, attr]) => {
      const val = !attr.delete;
      delete attr.delete;
      return val;
    });
    merged.attributes = Object.fromEntries(filteredAttrs);
    return merged;
  }
  /**
   * @internal
   */
  resolve(node) {
    if (node.meta) {
      expandProperties(node, node.meta);
    }
  }
};
function expandProperties(node, entry) {
  for (const key of dynamicKeys) {
    const property = entry[key];
    if (!property) {
      continue;
    }
    if (typeof property === "function") {
      setMetaProperty(entry, key, property(node._adapter));
    } else if (typeof property !== "boolean") {
      setMetaProperty(entry, key, evaluateProperty(node, property));
    }
  }
  if (typeof entry.focusable === "function") {
    setMetaProperty(entry, "focusable", entry.focusable(node._adapter));
  }
}
function expandRegexValue(value) {
  if (value instanceof RegExp) {
    return value;
  }
  const match = value.match(/^\/(.*(?=\/))\/(i?)$/);
  if (match) {
    const [, expr, flags] = match;
    if (expr.startsWith("^") || expr.endsWith("$")) {
      return new RegExp(expr, flags);
    } else {
      return new RegExp(`^${expr}$`, flags);
    }
  } else {
    return value;
  }
}
function expandRegex(entry) {
  for (const [name, values] of Object.entries(entry.attributes)) {
    if (values.enum) {
      entry.attributes[name].enum = values.enum.map(expandRegexValue);
    }
  }
}
function evaluateProperty(node, expr) {
  const [func, options] = parseExpression(expr);
  return func(node, options);
}
function parseExpression(expr) {
  if (typeof expr === "string") {
    return parseExpression([expr, {}]);
  } else {
    const [funcName, options] = expr;
    const func = functionTable[funcName];
    if (!func) {
      throw new Error(`Failed to find function "${funcName}" when evaluating property expression`);
    }
    return [func, options];
  }
}
function isDescendantFacade(node, tagName) {
  if (typeof tagName !== "string") {
    throw new Error(
      `Property expression "isDescendant" must take string argument when evaluating metadata for <${node.tagName}>`
    );
  }
  return isDescendant(node, tagName);
}
function hasAttributeFacade(node, attr) {
  if (typeof attr !== "string") {
    throw new Error(
      `Property expression "hasAttribute" must take string argument when evaluating metadata for <${node.tagName}>`
    );
  }
  return hasAttribute(node, attr);
}
function matchAttributeFacade(node, match) {
  if (!Array.isArray(match) || match.length !== 3) {
    throw new Error(
      `Property expression "matchAttribute" must take [key, op, value] array as argument when evaluating metadata for <${node.tagName}>`
    );
  }
  const [key, op, value] = match.map((x) => x.toLowerCase());
  switch (op) {
    case "!=":
    case "=":
      return matchAttribute(node, key, op, value);
    default:
      throw new Error(
        `Property expression "matchAttribute" has invalid operator "${op}" when evaluating metadata for <${node.tagName}>`
      );
  }
}
var DynamicValue = class {
  constructor(expr) {
    this.expr = expr;
  }
  toString() {
    return this.expr;
  }
};
var Attribute = class {
  /**
   * @param key - Attribute name.
   * @param value - Attribute value. Set to `null` for boolean attributes.
   * @param keyLocation - Source location of attribute name.
   * @param valueLocation - Source location of attribute value.
   * @param originalAttribute - If this attribute was dynamically added via a
   * transformation (e.g. vuejs `:id` generating the `id` attribute) this
   * parameter should be set to the attribute name of the source attribute (`:id`).
   */
  constructor(key, value, keyLocation, valueLocation, originalAttribute) {
    this.key = key;
    this.value = value;
    this.keyLocation = keyLocation;
    this.valueLocation = valueLocation;
    this.originalAttribute = originalAttribute;
    if (typeof this.value === "undefined") {
      this.value = null;
    }
  }
  /**
   * Flag set to true if the attribute value is static.
   */
  get isStatic() {
    return !this.isDynamic;
  }
  /**
   * Flag set to true if the attribute value is dynamic.
   */
  get isDynamic() {
    return this.value instanceof DynamicValue;
  }
  /**
   * Test attribute value.
   *
   * @param pattern - Pattern to match value against. Can be a RegExp, literal
   * string or an array of strings (returns true if any value matches the
   * array).
   * @param dynamicMatches - If true `DynamicValue` will always match, if false
   * it never matches.
   * @returns `true` if attribute value matches pattern.
   */
  valueMatches(pattern, dynamicMatches = true) {
    if (this.value === null) {
      return false;
    }
    if (this.value instanceof DynamicValue) {
      return dynamicMatches;
    }
    if (Array.isArray(pattern)) {
      return pattern.includes(this.value);
    }
    if (pattern instanceof RegExp) {
      return this.value.match(pattern) !== null;
    } else {
      return this.value === pattern;
    }
  }
};
function getCSSDeclarations(value) {
  return value.trim().split(";").filter(Boolean).map((it) => {
    const [property, value2] = it.split(":", 2);
    return [property.trim(), value2 ? value2.trim() : ""];
  });
}
function parseCssDeclaration(value) {
  if (!value || value instanceof DynamicValue) {
    return {};
  }
  const pairs = getCSSDeclarations(value);
  return Object.fromEntries(pairs);
}
function sliceSize(size, begin, end) {
  if (typeof size !== "number") {
    return size;
  }
  if (typeof end !== "number") {
    return size - begin;
  }
  if (end < 0) {
    end = size + end;
  }
  return Math.min(size, end - begin);
}
function sliceLocation(location, begin, end, wrap) {
  if (!location)
    return null;
  const size = sliceSize(location.size, begin, end);
  const sliced = {
    filename: location.filename,
    offset: location.offset + begin,
    line: location.line,
    column: location.column + begin,
    size
  };
  if (wrap) {
    let index = -1;
    const col = sliced.column;
    do {
      index = wrap.indexOf("\n", index + 1);
      if (index >= 0 && index < begin) {
        sliced.column = col - (index + 1);
        sliced.line++;
      } else {
        break;
      }
    } while (true);
  }
  return sliced;
}
var State = /* @__PURE__ */ ((State2) => {
  State2[State2["INITIAL"] = 1] = "INITIAL";
  State2[State2["DOCTYPE"] = 2] = "DOCTYPE";
  State2[State2["TEXT"] = 3] = "TEXT";
  State2[State2["TAG"] = 4] = "TAG";
  State2[State2["ATTR"] = 5] = "ATTR";
  State2[State2["CDATA"] = 6] = "CDATA";
  State2[State2["SCRIPT"] = 7] = "SCRIPT";
  State2[State2["STYLE"] = 8] = "STYLE";
  return State2;
})(State || {});
var ContentModel = /* @__PURE__ */ ((ContentModel2) => {
  ContentModel2[ContentModel2["TEXT"] = 1] = "TEXT";
  ContentModel2[ContentModel2["SCRIPT"] = 2] = "SCRIPT";
  ContentModel2[ContentModel2["STYLE"] = 3] = "STYLE";
  return ContentModel2;
})(ContentModel || {});
var Context = class {
  constructor(source) {
    this.state = State.INITIAL;
    this.string = source.data;
    this.filename = source.filename;
    this.offset = source.offset;
    this.line = source.line;
    this.column = source.column;
    this.contentModel = 1;
  }
  getTruncatedLine(n = 13) {
    return JSON.stringify(this.string.length > n ? `${this.string.slice(0, 10)}...` : this.string);
  }
  consume(n, state) {
    if (typeof n !== "number") {
      n = n[0].length;
    }
    let consumed = this.string.slice(0, n);
    let offset;
    while ((offset = consumed.indexOf("\n")) >= 0) {
      this.line++;
      this.column = 1;
      consumed = consumed.substr(offset + 1);
    }
    this.column += consumed.length;
    this.offset += n;
    this.string = this.string.substr(n);
    this.state = state;
  }
  getLocation(size) {
    return {
      filename: this.filename,
      offset: this.offset,
      line: this.line,
      column: this.column,
      size
    };
  }
};
function normalizeSource(source) {
  return {
    filename: "",
    offset: 0,
    line: 1,
    column: 1,
    ...source
  };
}
var NodeType = /* @__PURE__ */ ((NodeType2) => {
  NodeType2[NodeType2["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
  NodeType2[NodeType2["TEXT_NODE"] = 3] = "TEXT_NODE";
  NodeType2[NodeType2["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
  return NodeType2;
})(NodeType || {});
var DOCUMENT_NODE_NAME = "#document";
var TEXT_CONTENT = Symbol("textContent");
var counter = 0;
var DOMNode = class {
  /**
   * Create a new DOMNode.
   *
   * @param nodeType - What node type to create.
   * @param nodeName - What node name to use. For `HtmlElement` this corresponds
   * to the tagName but other node types have specific predefined values.
   * @param location - Source code location of this node.
   */
  constructor(nodeType, nodeName, location) {
    this.nodeType = nodeType;
    this.nodeName = nodeName ?? DOCUMENT_NODE_NAME;
    this.location = location;
    this.disabledRules = /* @__PURE__ */ new Set();
    this.blockedRules = /* @__PURE__ */ new Map();
    this.childNodes = [];
    this.unique = counter++;
    this.cache = null;
  }
  /**
   * Enable cache for this node.
   *
   * Should not be called before the node and all children are fully constructed.
   *
   * @internal
   */
  cacheEnable() {
    this.cache = /* @__PURE__ */ new Map();
  }
  cacheGet(key) {
    if (this.cache) {
      return this.cache.get(key);
    } else {
      return void 0;
    }
  }
  cacheSet(key, value) {
    if (this.cache) {
      this.cache.set(key, value);
    }
    return value;
  }
  cacheRemove(key) {
    if (this.cache) {
      return this.cache.delete(key);
    } else {
      return false;
    }
  }
  cacheExists(key) {
    return Boolean(this.cache && this.cache.has(key));
  }
  /**
   * Get the text (recursive) from all child nodes.
   */
  get textContent() {
    const cached = this.cacheGet(TEXT_CONTENT);
    if (cached) {
      return cached;
    }
    const text = this.childNodes.map((node) => node.textContent).join("");
    this.cacheSet(TEXT_CONTENT, text);
    return text;
  }
  append(node) {
    this.childNodes.push(node);
  }
  isRootElement() {
    return this.nodeType === NodeType.DOCUMENT_NODE;
  }
  /**
   * Tests if two nodes are the same (references the same object).
   *
   * @since v4.11.0
   */
  isSameNode(otherNode) {
    return this.unique === otherNode.unique;
  }
  /**
   * Returns a DOMNode representing the first direct child node or `null` if the
   * node has no children.
   */
  get firstChild() {
    return this.childNodes[0] || null;
  }
  /**
   * Returns a DOMNode representing the last direct child node or `null` if the
   * node has no children.
   */
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] || null;
  }
  /**
   * Block a rule for this node.
   *
   * @internal
   */
  blockRule(ruleId, blocker) {
    const current = this.blockedRules.get(ruleId);
    if (current) {
      current.push(blocker);
    } else {
      this.blockedRules.set(ruleId, [blocker]);
    }
  }
  /**
   * Blocks multiple rules.
   *
   * @internal
   */
  blockRules(rules, blocker) {
    for (const rule of rules) {
      this.blockRule(rule, blocker);
    }
  }
  /**
   * Disable a rule for this node.
   *
   * @internal
   */
  disableRule(ruleId) {
    this.disabledRules.add(ruleId);
  }
  /**
   * Disables multiple rules.
   *
   * @internal
   */
  disableRules(rules) {
    for (const rule of rules) {
      this.disableRule(rule);
    }
  }
  /**
   * Enable a previously disabled rule for this node.
   */
  enableRule(ruleId) {
    this.disabledRules.delete(ruleId);
  }
  /**
   * Enables multiple rules.
   */
  enableRules(rules) {
    for (const rule of rules) {
      this.enableRule(rule);
    }
  }
  /**
   * Test if a rule is enabled for this node.
   *
   * @internal
   */
  ruleEnabled(ruleId) {
    return !this.disabledRules.has(ruleId);
  }
  /**
   * Test if a rule is blocked for this node.
   *
   * @internal
   */
  ruleBlockers(ruleId) {
    return this.blockedRules.get(ruleId) ?? [];
  }
  generateSelector() {
    return null;
  }
};
function parse2(text, baseLocation) {
  const tokens = [];
  const locations = baseLocation ? [] : null;
  for (let begin = 0; begin < text.length; ) {
    let end = text.indexOf(" ", begin);
    if (end === -1) {
      end = text.length;
    }
    const size = end - begin;
    if (size === 0) {
      begin++;
      continue;
    }
    const token = text.substring(begin, end);
    tokens.push(token);
    if (locations && baseLocation) {
      const location = sliceLocation(baseLocation, begin, end);
      locations.push(location);
    }
    begin += size + 1;
  }
  return { tokens, locations };
}
var DOMTokenList = class extends Array {
  constructor(value, location) {
    var __super = (...args) => {
      super(...args);
    };
    if (value && typeof value === "string") {
      const normalized = value.replace(/[\t\r\n]/g, " ");
      const { tokens, locations } = parse2(normalized, location);
      __super(...tokens);
      this.locations = locations;
    } else {
      __super(0);
      this.locations = null;
    }
    if (value instanceof DynamicValue) {
      this.value = value.expr;
    } else {
      this.value = value ?? "";
    }
  }
  item(n) {
    return this[n];
  }
  location(n) {
    if (this.locations) {
      return this.locations[n];
    } else {
      throw new Error("Trying to access DOMTokenList location when base location isn't set");
    }
  }
  contains(token) {
    return this.includes(token);
  }
  *iterator() {
    for (let index = 0; index < this.length; index++) {
      const item = this.item(index);
      const location = this.location(index);
      yield { index, item, location };
    }
  }
};
var Combinator = /* @__PURE__ */ ((Combinator2) => {
  Combinator2[Combinator2["DESCENDANT"] = 1] = "DESCENDANT";
  Combinator2[Combinator2["CHILD"] = 2] = "CHILD";
  Combinator2[Combinator2["ADJACENT_SIBLING"] = 3] = "ADJACENT_SIBLING";
  Combinator2[Combinator2["GENERAL_SIBLING"] = 4] = "GENERAL_SIBLING";
  Combinator2[Combinator2["SCOPE"] = 5] = "SCOPE";
  return Combinator2;
})(Combinator || {});
function parseCombinator(combinator, pattern) {
  if (pattern === ":scope") {
    return 5;
  }
  switch (combinator) {
    case void 0:
    case null:
    case "":
      return 1;
    case ">":
      return 2;
    case "+":
      return 3;
    case "~":
      return 4;
    default:
      throw new Error(`Unknown combinator "${combinator}"`);
  }
}
function firstChild(node) {
  return node.previousSibling === null;
}
function lastChild(node) {
  return node.nextSibling === null;
}
var cache = {};
function getNthChild(node) {
  if (!node.parent) {
    return -1;
  }
  if (!cache[node.unique]) {
    const parent = node.parent;
    const index = parent.childElements.findIndex((cur) => {
      return cur.unique === node.unique;
    });
    cache[node.unique] = index + 1;
  }
  return cache[node.unique];
}
function nthChild(node, args) {
  if (!args) {
    throw new Error("Missing argument to nth-child");
  }
  const n = parseInt(args.trim(), 10);
  const cur = getNthChild(node);
  return cur === n;
}
function scope(node) {
  return node.isSameNode(this.scope);
}
var table = {
  "first-child": firstChild,
  "last-child": lastChild,
  "nth-child": nthChild,
  scope
};
function factory$1(name, context) {
  const fn = table[name];
  if (fn) {
    return fn.bind(context);
  } else {
    throw new Error(`Pseudo-class "${name}" is not implemented`);
  }
}
var escapedCodepoints = ["9", "a", "d"];
function* splitSelectorElements(selector2) {
  let begin = 0;
  let end = 0;
  function initialState(ch, p) {
    if (ch === "\\") {
      return 1;
    }
    if (ch === " ") {
      end = p;
      return 2;
    }
    return 0;
  }
  function escapedState(ch) {
    if (escapedCodepoints.includes(ch)) {
      return 1;
    }
    return 0;
  }
  function* whitespaceState(ch, p) {
    if (ch === " ") {
      return 2;
    }
    yield selector2.slice(begin, end);
    begin = p;
    end = p;
    return 0;
  }
  let state = 0;
  for (let p = 0; p < selector2.length; p++) {
    const ch = selector2[p];
    switch (state) {
      case 0:
        state = initialState(ch, p);
        break;
      case 1:
        state = escapedState(ch);
        break;
      case 2:
        state = yield* whitespaceState(ch, p);
        break;
    }
  }
  if (begin !== selector2.length) {
    yield selector2.slice(begin);
  }
}
function stripslashes(value) {
  return value.replace(/\\(.)/g, "$1");
}
function unescapeCodepoint(value) {
  const replacement2 = {
    "\\9 ": "	",
    "\\a ": "\n",
    "\\d ": "\r"
  };
  return value.replace(
    /(\\[\u0039\u0061\u0064] )/g,
    (_, codepoint) => replacement2[codepoint]
  );
}
function escapeSelectorComponent(text) {
  const codepoints = {
    "	": "\\9 ",
    "\n": "\\a ",
    "\r": "\\d "
  };
  return text.toString().replace(/([\t\n\r]|[^a-z0-9_-])/gi, (_, ch) => {
    if (codepoints[ch]) {
      return codepoints[ch];
    } else {
      return `\\${ch}`;
    }
  });
}
function generateIdSelector(id) {
  const escaped = escapeSelectorComponent(id);
  return escaped.match(/^\d/) ? `[id="${escaped}"]` : `#${escaped}`;
}
function isDelimiter(ch) {
  return /[.#[:]/.test(ch);
}
function isQuotationMark(ch) {
  return /['"]/.test(ch);
}
function isPseudoElement(ch, buffer) {
  return ch === ":" && buffer === ":";
}
function* splitPattern$1(pattern) {
  if (pattern === "") {
    return;
  }
  const end = pattern.length;
  let begin = 0;
  let cur = 1;
  let quoted = false;
  while (cur < end) {
    const ch = pattern[cur];
    const buffer = pattern.slice(begin, cur);
    if (ch === "\\") {
      cur += 2;
      continue;
    }
    if (quoted) {
      if (ch === quoted) {
        quoted = false;
      }
      cur += 1;
      continue;
    }
    if (isQuotationMark(ch)) {
      quoted = ch;
      cur += 1;
      continue;
    }
    if (isPseudoElement(ch, buffer)) {
      cur += 1;
      continue;
    }
    if (isDelimiter(ch)) {
      begin = cur;
      yield buffer;
    }
    cur += 1;
  }
  const tail = pattern.slice(begin, cur);
  yield tail;
}
var Matcher = class {
};
var ClassMatcher = class extends Matcher {
  constructor(classname) {
    super();
    this.classname = classname;
  }
  match(node) {
    return node.classList.contains(this.classname);
  }
};
var IdMatcher = class extends Matcher {
  constructor(id) {
    super();
    this.id = stripslashes(id);
  }
  match(node) {
    return node.id === this.id;
  }
};
var AttrMatcher = class extends Matcher {
  constructor(attr) {
    super();
    const [, key, op, value] = attr.match(/^(.+?)(?:([~^$*|]?=)"([^"]+?)")?$/);
    this.key = key;
    this.op = op;
    this.value = value;
  }
  match(node) {
    const attr = node.getAttribute(this.key, true) || [];
    return attr.some((cur) => {
      switch (this.op) {
        case void 0:
          return true;
        case "=":
          return cur.value === this.value;
        default:
          throw new Error(`Attribute selector operator ${this.op} is not implemented yet`);
      }
    });
  }
};
var PseudoClassMatcher = class extends Matcher {
  constructor(pseudoclass, context) {
    super();
    const match = pseudoclass.match(/^([^(]+)(?:\((.*)\))?$/);
    if (!match) {
      throw new Error(`Missing pseudo-class after colon in selector pattern "${context}"`);
    }
    const [, name, args] = match;
    this.name = name;
    this.args = args;
  }
  match(node, context) {
    const fn = factory$1(this.name, context);
    return fn(node, this.args);
  }
};
var Pattern = class {
  constructor(pattern) {
    const match = pattern.match(/^([~+\->]?)((?:[*]|[^.#[:]+)?)([^]*)$/);
    if (!match) {
      throw new Error(`Failed to create selector pattern from "${pattern}"`);
    }
    match.shift();
    this.selector = pattern;
    this.combinator = parseCombinator(match.shift(), pattern);
    this.tagName = match.shift() || "*";
    this.pattern = Array.from(splitPattern$1(match[0]), (it) => this.createMatcher(it));
  }
  match(node, context) {
    return node.is(this.tagName) && this.pattern.every((cur) => cur.match(node, context));
  }
  createMatcher(pattern) {
    switch (pattern[0]) {
      case ".":
        return new ClassMatcher(pattern.slice(1));
      case "#":
        return new IdMatcher(pattern.slice(1));
      case "[":
        return new AttrMatcher(pattern.slice(1, -1));
      case ":":
        return new PseudoClassMatcher(pattern.slice(1), this.selector);
      default:
        throw new Error(`Failed to create matcher for "${pattern}"`);
    }
  }
};
var Selector = class _Selector {
  constructor(selector2) {
    this.pattern = _Selector.parse(selector2);
  }
  /**
   * Match this selector against a HtmlElement.
   *
   * @param root - Element to match against.
   * @returns Iterator with matched elements.
   */
  *match(root) {
    const context = { scope: root };
    yield* this.matchInternal(root, 0, context);
  }
  *matchInternal(root, level, context) {
    if (level >= this.pattern.length) {
      yield root;
      return;
    }
    const pattern = this.pattern[level];
    const matches = _Selector.findCandidates(root, pattern);
    for (const node of matches) {
      if (!pattern.match(node, context)) {
        continue;
      }
      yield* this.matchInternal(node, level + 1, context);
    }
  }
  static parse(selector2) {
    selector2 = selector2.replace(/([+~>]) /g, "$1");
    return Array.from(splitSelectorElements(selector2), (element) => {
      return new Pattern(unescapeCodepoint(element));
    });
  }
  static findCandidates(root, pattern) {
    switch (pattern.combinator) {
      case Combinator.DESCENDANT:
        return root.getElementsByTagName(pattern.tagName);
      case Combinator.CHILD:
        return root.childElements.filter((node) => node.is(pattern.tagName));
      case Combinator.ADJACENT_SIBLING:
        return _Selector.findAdjacentSibling(root);
      case Combinator.GENERAL_SIBLING:
        return _Selector.findGeneralSibling(root);
      case Combinator.SCOPE:
        return [root];
    }
    return [];
  }
  static findAdjacentSibling(node) {
    let adjacent = false;
    return node.siblings.filter((cur) => {
      if (adjacent) {
        adjacent = false;
        return true;
      }
      if (cur === node) {
        adjacent = true;
      }
      return false;
    });
  }
  static findGeneralSibling(node) {
    let after = false;
    return node.siblings.filter((cur) => {
      if (after) {
        return true;
      }
      if (cur === node) {
        after = true;
      }
      return false;
    });
  }
};
var TEXT_NODE_NAME = "#text";
function isTextNode(node) {
  return Boolean(node && node.nodeType === NodeType.TEXT_NODE);
}
var TextNode = class extends DOMNode {
  /**
   * @param text - Text to add. When a `DynamicValue` is used the expression is
   * used as "text".
   * @param location - Source code location of this node.
   */
  constructor(text, location) {
    super(NodeType.TEXT_NODE, TEXT_NODE_NAME, location);
    this.text = text;
  }
  /**
   * Get the text from node.
   */
  get textContent() {
    return this.text.toString();
  }
  /**
   * Flag set to true if the attribute value is static.
   */
  get isStatic() {
    return !this.isDynamic;
  }
  /**
   * Flag set to true if the attribute value is dynamic.
   */
  get isDynamic() {
    return this.text instanceof DynamicValue;
  }
};
var ROLE = Symbol("role");
var TABINDEX = Symbol("tabindex");
var NodeClosed = /* @__PURE__ */ ((NodeClosed2) => {
  NodeClosed2[NodeClosed2["Open"] = 0] = "Open";
  NodeClosed2[NodeClosed2["EndTag"] = 1] = "EndTag";
  NodeClosed2[NodeClosed2["VoidOmitted"] = 2] = "VoidOmitted";
  NodeClosed2[NodeClosed2["VoidSelfClosed"] = 3] = "VoidSelfClosed";
  NodeClosed2[NodeClosed2["ImplicitClosed"] = 4] = "ImplicitClosed";
  return NodeClosed2;
})(NodeClosed || {});
function isElementNode(node) {
  return Boolean(node && node.nodeType === NodeType.ELEMENT_NODE);
}
function isInvalidTagName(tagName) {
  return Boolean(tagName === "" || tagName === "*");
}
function createAdapter(node) {
  return {
    closest(selectors2) {
      var _a2;
      return (_a2 = node.closest(selectors2)) == null ? void 0 : _a2._adapter;
    },
    getAttribute(name) {
      var _a2;
      return (_a2 = node.getAttribute(name)) == null ? void 0 : _a2.value;
    },
    hasAttribute(name) {
      return node.hasAttribute(name);
    }
  };
}
var HtmlElement = class _HtmlElement extends DOMNode {
  constructor(tagName, parent, closed, meta, location) {
    const nodeType = tagName ? NodeType.ELEMENT_NODE : NodeType.DOCUMENT_NODE;
    super(nodeType, tagName, location);
    if (isInvalidTagName(tagName)) {
      throw new Error(`The tag name provided ("${tagName}") is not a valid name`);
    }
    this.tagName = tagName ?? "#document";
    this.parent = parent ?? null;
    this.attr = {};
    this.metaElement = meta ?? null;
    this.closed = closed;
    this.voidElement = meta ? Boolean(meta.void) : false;
    this.depth = 0;
    this.annotation = null;
    this._adapter = createAdapter(this);
    if (parent) {
      parent.childNodes.push(this);
      let cur = parent;
      while (cur.parent) {
        this.depth++;
        cur = cur.parent;
      }
    }
  }
  /**
   * @internal
   */
  static rootNode(location) {
    const root = new _HtmlElement(void 0, null, 1, null, location);
    root.setAnnotation("#document");
    return root;
  }
  /**
   * @internal
   *
   * @param namespace - If given it is appended to the tagName.
   */
  static fromTokens(startToken, endToken, parent, metaTable, namespace = "") {
    const name = startToken.data[2];
    const tagName = namespace ? `${namespace}:${name}` : name;
    if (!name) {
      throw new Error("tagName cannot be empty");
    }
    const meta = metaTable ? metaTable.getMetaFor(tagName) : null;
    const open = startToken.data[1] !== "/";
    const closed = isClosed(endToken, meta);
    const location = sliceLocation(startToken.location, 1);
    return new _HtmlElement(tagName, open ? parent : null, closed, meta, location);
  }
  /**
   * Returns annotated name if set or defaults to `<tagName>`.
   *
   * E.g. `my-annotation` or `<div>`.
   */
  get annotatedName() {
    if (this.annotation) {
      return this.annotation;
    } else {
      return `<${this.tagName}>`;
    }
  }
  /**
   * Get list of IDs referenced by `aria-labelledby`.
   *
   * If the attribute is unset or empty this getter returns null.
   * If the attribute is dynamic the original {@link DynamicValue} is returned.
   *
   * @public
   */
  get ariaLabelledby() {
    const attr = this.getAttribute("aria-labelledby");
    if (!(attr == null ? void 0 : attr.value)) {
      return null;
    }
    if (attr.value instanceof DynamicValue) {
      return attr.value;
    }
    const list = new DOMTokenList(attr.value, attr.valueLocation);
    return list.length ? Array.from(list) : null;
  }
  /**
   * Similar to childNodes but only elements.
   */
  get childElements() {
    return this.childNodes.filter(isElementNode);
  }
  /**
   * Find the first ancestor matching a selector.
   *
   * Implementation of DOM specification of Element.closest(selectors).
   */
  closest(selectors2) {
    let node = this;
    while (node) {
      if (node.matches(selectors2)) {
        return node;
      }
      node = node.parent;
    }
    return null;
  }
  /**
   * Generate a DOM selector for this element. The returned selector will be
   * unique inside the current document.
   */
  generateSelector() {
    if (this.isRootElement()) {
      return null;
    }
    const parts = [];
    let root;
    for (root = this; root.parent; root = root.parent) {
    }
    for (let cur = this; cur.parent; cur = cur.parent) {
      if (cur.id) {
        const selector2 = generateIdSelector(cur.id);
        const matches = root.querySelectorAll(selector2);
        if (matches.length === 1) {
          parts.push(selector2);
          break;
        }
      }
      const parent = cur.parent;
      const child = parent.childElements;
      const index = child.findIndex((it) => it.unique === cur.unique);
      const numOfType = child.filter((it) => it.is(cur.tagName)).length;
      const solo = numOfType === 1;
      if (solo) {
        parts.push(cur.tagName.toLowerCase());
        continue;
      }
      parts.push(`${cur.tagName.toLowerCase()}:nth-child(${String(index + 1)})`);
    }
    return parts.reverse().join(" > ");
  }
  /**
   * Tests if this element has given tagname.
   *
   * If passing "*" this test will pass if any tagname is set.
   */
  is(tagName) {
    return tagName === "*" || this.tagName.toLowerCase() === tagName.toLowerCase();
  }
  /**
   * Load new element metadata onto this element.
   *
   * Do note that semantics such as `void` cannot be changed (as the element has
   * already been created). In addition the element will still "be" the same
   * element, i.e. even if loading meta for a `<p>` tag upon a `<div>` tag it
   * will still be a `<div>` as far as the rest of the validator is concerned.
   *
   * In fact only certain properties will be copied onto the element:
   *
   * - content categories (flow, phrasing, etc)
   * - required attributes
   * - attribute allowed values
   * - permitted/required elements
   *
   * Properties *not* loaded:
   *
   * - inherit
   * - deprecated
   * - foreign
   * - void
   * - implicitClosed
   * - scriptSupporting
   * - deprecatedAttributes
   *
   * Changes to element metadata will only be visible after `element:ready` (and
   * the subsequent `dom:ready` event).
   */
  loadMeta(meta) {
    if (!this.metaElement) {
      this.metaElement = {};
    }
    for (const key of MetaCopyableProperty) {
      const value = meta[key];
      if (typeof value !== "undefined") {
        setMetaProperty(this.metaElement, key, value);
      } else {
        delete this.metaElement[key];
      }
    }
  }
  /**
   * Match this element against given selectors. Returns true if any selector
   * matches.
   *
   * Implementation of DOM specification of Element.matches(selectors).
   */
  matches(selector2) {
    let root = this;
    while (root.parent) {
      root = root.parent;
    }
    for (const match of root.querySelectorAll(selector2)) {
      if (match.unique === this.unique) {
        return true;
      }
    }
    return false;
  }
  get meta() {
    return this.metaElement;
  }
  /**
   * Get current role for this element (explicit with `role` attribute or mapped
   * with implicit role).
   *
   * @since 8.9.1
   */
  get role() {
    const cached = this.cacheGet(ROLE);
    if (cached !== void 0) {
      return cached;
    }
    const role = this.getAttribute("role");
    if (role) {
      return this.cacheSet(ROLE, role.value);
    }
    if (this.metaElement) {
      const { aria } = this.metaElement;
      const implicitRole = aria.implicitRole(this._adapter);
      return this.cacheSet(ROLE, implicitRole);
    }
    return this.cacheSet(ROLE, null);
  }
  /**
   * Set annotation for this element.
   */
  setAnnotation(text) {
    this.annotation = text;
  }
  /**
   * Set attribute. Stores all attributes set even with the same name.
   *
   * @param key - Attribute name
   * @param value - Attribute value. Use `null` if no value is present.
   * @param keyLocation - Location of the attribute name.
   * @param valueLocation - Location of the attribute value (excluding quotation)
   * @param originalAttribute - If attribute is an alias for another attribute
   * (dynamic attributes) set this to the original attribute name.
   */
  setAttribute(key, value, keyLocation, valueLocation, originalAttribute) {
    key = key.toLowerCase();
    if (!this.attr[key]) {
      this.attr[key] = [];
    }
    this.attr[key].push(new Attribute(key, value, keyLocation, valueLocation, originalAttribute));
  }
  /**
   * Get parsed tabindex for this element.
   *
   * - If `tabindex` attribute is not present `null` is returned.
   * - If attribute value is omitted or the empty string `null` is returned.
   * - If attribute value cannot be parsed `null` is returned.
   * - If attribute value is dynamic `0` is returned.
   * - Otherwise the parsed value is returned.
   *
   * This property does *NOT* take into account if the element have a default
   * `tabindex` (such as `<input>` have). Instead use the `focusable` metadata
   * property to determine this.
   *
   * @public
   * @since 8.16.0
   */
  get tabIndex() {
    const cached = this.cacheGet(TABINDEX);
    if (cached !== void 0) {
      return cached;
    }
    const tabindex = this.getAttribute("tabindex");
    if (!tabindex) {
      return this.cacheSet(TABINDEX, null);
    }
    if (tabindex.value === null) {
      return this.cacheSet(TABINDEX, null);
    }
    if (tabindex.value instanceof DynamicValue) {
      return this.cacheSet(TABINDEX, 0);
    }
    const parsed = parseInt(tabindex.value, 10);
    if (isNaN(parsed)) {
      return this.cacheSet(TABINDEX, null);
    }
    return this.cacheSet(TABINDEX, parsed);
  }
  /**
   * Get a list of all attributes on this node.
   */
  get attributes() {
    return Object.values(this.attr).reduce((result, cur) => {
      return result.concat(cur);
    }, []);
  }
  hasAttribute(key) {
    key = key.toLowerCase();
    return key in this.attr;
  }
  getAttribute(key, all = false) {
    key = key.toLowerCase();
    if (key in this.attr) {
      const matches = this.attr[key];
      return all ? matches : matches[0];
    } else {
      return null;
    }
  }
  /**
   * Get attribute value.
   *
   * Returns the attribute value if present.
   *
   * - Missing attributes return `null`.
   * - Boolean attributes return `null`.
   * - `DynamicValue` returns attribute expression.
   *
   * @param key - Attribute name
   * @returns Attribute value or null.
   */
  getAttributeValue(key) {
    const attr = this.getAttribute(key);
    if (attr) {
      return attr.value !== null ? attr.value.toString() : null;
    } else {
      return null;
    }
  }
  /**
   * Add text as a child node to this element.
   *
   * @param text - Text to add.
   * @param location - Source code location of this text.
   */
  appendText(text, location) {
    this.childNodes.push(new TextNode(text, location));
  }
  /**
   * Return a list of all known classes on the element. Dynamic values are
   * ignored.
   */
  get classList() {
    if (!this.hasAttribute("class")) {
      return new DOMTokenList(null, null);
    }
    const classes = this.getAttribute("class", true).filter((attr) => attr.isStatic).map((attr) => attr.value).join(" ");
    return new DOMTokenList(classes, null);
  }
  /**
   * Get element ID if present.
   */
  get id() {
    return this.getAttributeValue("id");
  }
  get style() {
    const attr = this.getAttribute("style");
    return parseCssDeclaration(attr == null ? void 0 : attr.value);
  }
  /**
   * Returns the first child element or null if there are no child elements.
   */
  get firstElementChild() {
    const children = this.childElements;
    return children.length > 0 ? children[0] : null;
  }
  /**
   * Returns the last child element or null if there are no child elements.
   */
  get lastElementChild() {
    const children = this.childElements;
    return children.length > 0 ? children[children.length - 1] : null;
  }
  get siblings() {
    return this.parent ? this.parent.childElements : [this];
  }
  get previousSibling() {
    const i = this.siblings.findIndex((node) => node.unique === this.unique);
    return i >= 1 ? this.siblings[i - 1] : null;
  }
  get nextSibling() {
    const i = this.siblings.findIndex((node) => node.unique === this.unique);
    return i <= this.siblings.length - 2 ? this.siblings[i + 1] : null;
  }
  getElementsByTagName(tagName) {
    return this.childElements.reduce((matches, node) => {
      return matches.concat(node.is(tagName) ? [node] : [], node.getElementsByTagName(tagName));
    }, []);
  }
  querySelector(selector2) {
    const it = this.querySelectorImpl(selector2);
    const next = it.next();
    if (next.done) {
      return null;
    } else {
      return next.value;
    }
  }
  querySelectorAll(selector2) {
    const it = this.querySelectorImpl(selector2);
    const unique = new Set(it);
    return Array.from(unique.values());
  }
  *querySelectorImpl(selectorList) {
    if (!selectorList) {
      return;
    }
    for (const selector2 of selectorList.split(/,\s*/)) {
      const pattern = new Selector(selector2);
      yield* pattern.match(this);
    }
  }
  /**
   * Visit all nodes from this node and down. Depth first.
   *
   * @internal
   */
  visitDepthFirst(callback) {
    function visit(node) {
      node.childElements.forEach(visit);
      if (!node.isRootElement()) {
        callback(node);
      }
    }
    visit(this);
  }
  /**
   * Evaluates callbackk on all descendants, returning true if any are true.
   *
   * @internal
   */
  someChildren(callback) {
    return this.childElements.some(visit);
    function visit(node) {
      if (callback(node)) {
        return true;
      } else {
        return node.childElements.some(visit);
      }
    }
  }
  /**
   * Evaluates callbackk on all descendants, returning true if all are true.
   *
   * @internal
   */
  everyChildren(callback) {
    return this.childElements.every(visit);
    function visit(node) {
      if (!callback(node)) {
        return false;
      }
      return node.childElements.every(visit);
    }
  }
  /**
   * Visit all nodes from this node and down. Breadth first.
   *
   * The first node for which the callback evaluates to true is returned.
   *
   * @internal
   */
  find(callback) {
    function visit(node) {
      if (callback(node)) {
        return node;
      }
      for (const child of node.childElements) {
        const match = child.find(callback);
        if (match) {
          return match;
        }
      }
      return null;
    }
    return visit(this);
  }
};
function isClosed(endToken, meta) {
  let closed = 0;
  if (meta && meta.void) {
    closed = 2;
  }
  if (endToken.data[0] === "/>") {
    closed = 3;
  }
  return closed;
}
var DOMTree = class {
  constructor(location) {
    this.root = HtmlElement.rootNode(location);
    this.active = this.root;
    this.doctype = null;
  }
  pushActive(node) {
    this.active = node;
  }
  popActive() {
    if (this.active.isRootElement()) {
      return;
    }
    this.active = this.active.parent ?? this.root;
  }
  getActive() {
    return this.active;
  }
  /**
   * Resolve dynamic meta expressions.
   */
  resolveMeta(table2) {
    this.visitDepthFirst((node) => {
      table2.resolve(node);
    });
  }
  getElementsByTagName(tagName) {
    return this.root.getElementsByTagName(tagName);
  }
  visitDepthFirst(callback) {
    this.root.visitDepthFirst(callback);
  }
  find(callback) {
    return this.root.find(callback);
  }
  querySelector(selector2) {
    return this.root.querySelector(selector2);
  }
  querySelectorAll(selector2) {
    return this.root.querySelectorAll(selector2);
  }
};
var allowedKeys = ["exclude"];
var Validator = class _Validator {
  /**
   * Test if element is used in a proper context.
   *
   * @param node - Element to test.
   * @param rules - List of rules.
   * @returns `true` if element passes all tests.
   */
  static validatePermitted(node, rules) {
    if (!rules) {
      return true;
    }
    return rules.some((rule) => {
      return _Validator.validatePermittedRule(node, rule);
    });
  }
  /**
   * Test if an element is used the correct amount of times.
   *
   * For instance, a `<table>` element can only contain a single `<tbody>`
   * child. If multiple `<tbody>` exists this test will fail both nodes.
   * Note that this is called on the parent but will fail the children violating
   * the rule.
   *
   * @param children - Array of children to validate.
   * @param rules - List of rules of the parent element.
   * @returns `true` if the parent element of the children passes the test.
   */
  static validateOccurrences(children, rules, cb) {
    if (!rules) {
      return true;
    }
    let valid = true;
    for (const rule of rules) {
      if (typeof rule !== "string") {
        return false;
      }
      const [, category, quantifier] = rule.match(/^(@?.*?)([?*]?)$/);
      const limit = category && quantifier && parseQuantifier(quantifier);
      if (limit) {
        const siblings = children.filter(
          (cur) => _Validator.validatePermittedCategory(cur, rule, true)
        );
        if (siblings.length > limit) {
          for (const child of siblings.slice(limit)) {
            cb(child, category);
          }
          valid = false;
        }
      }
    }
    return valid;
  }
  /**
   * Validate elements order.
   *
   * Given a parent element with children and metadata containing permitted
   * order it will validate each children and ensure each one exists in the
   * specified order.
   *
   * For instance, for a `<table>` element the `<caption>` element must come
   * before a `<thead>` which must come before `<tbody>`.
   *
   * @param children - Array of children to validate.
   */
  static validateOrder(children, rules, cb) {
    if (!rules) {
      return true;
    }
    let i = 0;
    let prev = null;
    for (const node of children) {
      const old = i;
      while (rules[i] && !_Validator.validatePermittedCategory(node, rules[i], true)) {
        i++;
      }
      if (i >= rules.length) {
        const orderSpecified = rules.find(
          (cur) => _Validator.validatePermittedCategory(node, cur, true)
        );
        if (orderSpecified) {
          cb(node, prev);
          return false;
        }
        i = old;
      }
      prev = node;
    }
    return true;
  }
  /**
   * Validate element ancestors.
   *
   * Check if an element has the required set of elements. At least one of the
   * selectors must match.
   */
  static validateAncestors(node, rules) {
    if (!rules || rules.length === 0) {
      return true;
    }
    return rules.some((rule) => node.closest(rule));
  }
  /**
   * Validate element required content.
   *
   * Check if an element has the required set of elements. At least one of the
   * selectors must match.
   *
   * Returns `[]` when valid or a list of required but missing tagnames or
   * categories.
   */
  static validateRequiredContent(node, rules) {
    if (!rules || rules.length === 0) {
      return [];
    }
    return rules.filter((tagName) => {
      const haveMatchingChild = node.childElements.some(
        (child) => _Validator.validatePermittedCategory(child, tagName, false)
      );
      return !haveMatchingChild;
    });
  }
  /**
   * Test if an attribute has an allowed value and/or format.
   *
   * @param attr - Attribute to test.
   * @param rules - Element attribute metadta.
   * @returns `true` if attribute passes all tests.
   */
  static validateAttribute(attr, rules) {
    const rule = rules[attr.key];
    if (!rule) {
      return true;
    }
    const value = attr.value;
    if (value instanceof DynamicValue) {
      return true;
    }
    const empty = value === null || value === "";
    if (rule.boolean) {
      return empty || value === attr.key;
    }
    if (rule.omit && empty) {
      return true;
    }
    if (rule.list) {
      const tokens = new DOMTokenList(value, attr.valueLocation);
      return tokens.every((token) => {
        return this.validateAttributeValue(token, rule);
      });
    }
    return this.validateAttributeValue(value, rule);
  }
  static validateAttributeValue(value, rule) {
    if (!rule.enum) {
      return true;
    }
    if (value === null || value === void 0) {
      return false;
    }
    const caseInsensitiveValue = value.toLowerCase();
    return rule.enum.some((entry) => {
      if (entry instanceof RegExp) {
        return !!value.match(entry);
      } else {
        return caseInsensitiveValue === entry;
      }
    });
  }
  static validatePermittedRule(node, rule, isExclude = false) {
    if (typeof rule === "string") {
      return _Validator.validatePermittedCategory(node, rule, !isExclude);
    } else if (Array.isArray(rule)) {
      return rule.every((inner) => {
        return _Validator.validatePermittedRule(node, inner, isExclude);
      });
    } else {
      validateKeys(rule);
      if (rule.exclude) {
        if (Array.isArray(rule.exclude)) {
          return !rule.exclude.some((inner) => {
            return _Validator.validatePermittedRule(node, inner, true);
          });
        } else {
          return !_Validator.validatePermittedRule(node, rule.exclude, true);
        }
      } else {
        return true;
      }
    }
  }
  /**
   * Validate node against a content category.
   *
   * When matching parent nodes against permitted parents use the superset
   * parameter to also match for `@flow`. E.g. if a node expects a `@phrasing`
   * parent it should also allow `@flow` parent since `@phrasing` is a subset of
   * `@flow`.
   *
   * @param node - The node to test against
   * @param category - Name of category with `@` prefix or tag name.
   * @param defaultMatch - The default return value when node categories is not known.
   */
  /* eslint-disable-next-line complexity -- rule does not like switch */
  static validatePermittedCategory(node, category, defaultMatch) {
    const [, rawCategory] = category.match(/^(@?.*?)([?*]?)$/);
    if (!rawCategory.startsWith("@")) {
      return node.tagName === rawCategory;
    }
    if (!node.meta) {
      return defaultMatch;
    }
    switch (rawCategory) {
      case "@meta":
        return node.meta.metadata;
      case "@flow":
        return node.meta.flow;
      case "@sectioning":
        return node.meta.sectioning;
      case "@heading":
        return node.meta.heading;
      case "@phrasing":
        return node.meta.phrasing;
      case "@embedded":
        return node.meta.embedded;
      case "@interactive":
        return node.meta.interactive;
      case "@script":
        return Boolean(node.meta.scriptSupporting);
      case "@form":
        return Boolean(node.meta.form);
      default:
        throw new Error(`Invalid content category "${category}"`);
    }
  }
};
function validateKeys(rule) {
  for (const key of Object.keys(rule)) {
    if (!allowedKeys.includes(key)) {
      const str = JSON.stringify(rule);
      throw new Error(`Permitted rule "${str}" contains unknown property "${key}"`);
    }
  }
}
function parseQuantifier(quantifier) {
  switch (quantifier) {
    case "?":
      return 1;
    case "*":
      return null;
    default:
      throw new Error(`Invalid quantifier "${quantifier}" used`);
  }
}
var $schema = "http://json-schema.org/draft-06/schema#";
var $id = "https://html-validate.org/schemas/config.json";
var type = "object";
var additionalProperties = false;
var properties = {
  $schema: {
    type: "string"
  },
  root: {
    type: "boolean",
    title: "Mark as root configuration",
    description: "If this is set to true no further configurations will be searched.",
    "default": false
  },
  "extends": {
    type: "array",
    items: {
      type: "string"
    },
    title: "Configurations to extend",
    description: "Array of shareable or builtin configurations to extend."
  },
  elements: {
    type: "array",
    items: {
      anyOf: [
        {
          type: "string"
        },
        {
          type: "object"
        }
      ]
    },
    title: "Element metadata to load",
    description: "Array of modules, plugins or files to load element metadata from. Use <rootDir> to refer to the folder with the package.json file.",
    examples: [
      [
        "html-validate:recommended",
        "plugin:recommended",
        "module",
        "./local-file.json"
      ]
    ]
  },
  plugins: {
    type: "array",
    items: {
      anyOf: [
        {
          type: "string"
        },
        {
          type: "object"
        }
      ]
    },
    title: "Plugins to load",
    description: "Array of plugins load. Use <rootDir> to refer to the folder with the package.json file.",
    examples: [
      [
        "my-plugin",
        "./local-plugin"
      ]
    ]
  },
  transform: {
    type: "object",
    additionalProperties: {
      type: "string"
    },
    title: "File transformations to use.",
    description: "Object where key is regular expression to match filename and value is name of transformer.",
    examples: [
      {
        "^.*\\.foo$": "my-transformer",
        "^.*\\.bar$": "my-plugin",
        "^.*\\.baz$": "my-plugin:named"
      }
    ]
  },
  rules: {
    type: "object",
    patternProperties: {
      ".*": {
        anyOf: [
          {
            "enum": [
              0,
              1,
              2,
              "off",
              "warn",
              "error"
            ]
          },
          {
            type: "array",
            minItems: 1,
            maxItems: 1,
            items: [
              {
                "enum": [
                  0,
                  1,
                  2,
                  "off",
                  "warn",
                  "error"
                ]
              }
            ]
          },
          {
            type: "array",
            minItems: 2,
            maxItems: 2,
            items: [
              {
                "enum": [
                  0,
                  1,
                  2,
                  "off",
                  "warn",
                  "error"
                ]
              },
              {}
            ]
          }
        ]
      }
    },
    title: "Rule configuration.",
    description: "Enable/disable rules, set severity. Some rules have additional configuration like style or patterns to use.",
    examples: [
      {
        foo: "error",
        bar: "off",
        baz: [
          "error",
          {
            style: "camelcase"
          }
        ]
      }
    ]
  }
};
var configurationSchema = {
  $schema,
  $id,
  type,
  additionalProperties,
  properties
};
var TRANSFORMER_API = {
  VERSION: 1
};
var Severity = /* @__PURE__ */ ((Severity2) => {
  Severity2[Severity2["DISABLED"] = 0] = "DISABLED";
  Severity2[Severity2["WARN"] = 1] = "WARN";
  Severity2[Severity2["ERROR"] = 2] = "ERROR";
  return Severity2;
})(Severity || {});
function parseSeverity(value) {
  switch (value) {
    case 0:
    case "off":
      return 0;
    case 1:
    case "warn":
      return 1;
    case 2:
    case "error":
      return 2;
    default:
      throw new Error(`Invalid severity "${String(value)}"`);
  }
}
function escape(value) {
  return JSON.stringify(value);
}
function format(value, quote = false) {
  if (value === null) {
    return "null";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "string") {
    return quote ? escape(value) : value;
  }
  if (Array.isArray(value)) {
    const content = value.map((it) => format(it, true)).join(", ");
    return `[ ${content} ]`;
  }
  if (typeof value === "object") {
    const content = Object.entries(value).map(([key, nested]) => `${key}: ${format(nested, true)}`).join(", ");
    return `{ ${content} }`;
  }
  return String(value);
}
function interpolate(text, data) {
  return text.replace(/{{\s*([^\s{}]+)\s*}}/g, (match, key) => {
    return typeof data[key] !== "undefined" ? format(data[key]) : match;
  });
}
var cacheKey = Symbol("aria-naming");
var defaultValue = "allowed";
var prohibitedRoles = [
  "caption",
  "code",
  "deletion",
  "emphasis",
  "generic",
  "insertion",
  "paragraph",
  "presentation",
  "strong",
  "subscript",
  "superscript"
];
function byRole(role) {
  return prohibitedRoles.includes(role) ? "prohibited" : "allowed";
}
function byMeta(element, meta) {
  return meta.aria.naming(element._adapter);
}
function ariaNaming(element) {
  var _a2;
  const cached = element.cacheGet(cacheKey);
  if (cached) {
    return cached;
  }
  const role = (_a2 = element.getAttribute("role")) == null ? void 0 : _a2.value;
  if (role) {
    if (role instanceof DynamicValue) {
      return element.cacheSet(cacheKey, defaultValue);
    } else {
      return element.cacheSet(cacheKey, byRole(role));
    }
  }
  const meta = element.meta;
  if (!meta) {
    return element.cacheSet(cacheKey, defaultValue);
  }
  return element.cacheSet(cacheKey, byMeta(element, meta));
}
var patternCache = /* @__PURE__ */ new Map();
function compileStringPattern(pattern) {
  const regexp2 = pattern.replace(/[*]+/g, ".+");
  return new RegExp(`^${regexp2}$`);
}
function compileRegExpPattern(pattern) {
  return new RegExp(`^${pattern}$`);
}
function compilePattern(pattern) {
  const cached = patternCache.get(pattern);
  if (cached) {
    return cached;
  }
  const match = pattern.match(/^\/(.*)\/$/);
  const regexp2 = match ? compileRegExpPattern(match[1]) : compileStringPattern(pattern);
  patternCache.set(pattern, regexp2);
  return regexp2;
}
function keywordPatternMatcher(list, keyword) {
  for (const pattern of list) {
    const regexp2 = compilePattern(pattern);
    if (regexp2.test(keyword)) {
      return true;
    }
  }
  return false;
}
function isKeywordIgnored(options, keyword, matcher = (list, it) => list.includes(it)) {
  const { include, exclude } = options;
  if (include && !matcher(include, keyword)) {
    return true;
  }
  if (exclude && matcher(exclude, keyword)) {
    return true;
  }
  return false;
}
var ARIA_HIDDEN_CACHE = Symbol(isAriaHidden.name);
var HTML_HIDDEN_CACHE = Symbol(isHTMLHidden.name);
var INERT_CACHE = Symbol(isInert.name);
var ROLE_PRESENTATION_CACHE = Symbol(isPresentation.name);
var STYLE_HIDDEN_CACHE = Symbol(isStyleHidden.name);
function inAccessibilityTree(node) {
  if (isAriaHidden(node)) {
    return false;
  }
  if (isPresentation(node)) {
    return false;
  }
  if (isHTMLHidden(node)) {
    return false;
  }
  if (isInert(node)) {
    return false;
  }
  if (isStyleHidden(node)) {
    return false;
  }
  return true;
}
function isAriaHiddenImpl(node) {
  const getAriaHiddenAttr = (node2) => {
    const ariaHidden = node2.getAttribute("aria-hidden");
    return Boolean(ariaHidden && ariaHidden.value === "true");
  };
  return {
    byParent: node.parent ? isAriaHidden(node.parent) : false,
    bySelf: getAriaHiddenAttr(node)
  };
}
function isAriaHidden(node, details) {
  const cached = node.cacheGet(ARIA_HIDDEN_CACHE);
  if (cached) {
    return details ? cached : cached.byParent || cached.bySelf;
  }
  const result = node.cacheSet(ARIA_HIDDEN_CACHE, isAriaHiddenImpl(node));
  return details ? result : result.byParent || result.bySelf;
}
function isHTMLHiddenImpl(node) {
  const getHiddenAttr = (node2) => {
    const hidden = node2.getAttribute("hidden");
    return hidden !== null && hidden.isStatic;
  };
  return {
    byParent: node.parent ? isHTMLHidden(node.parent) : false,
    bySelf: getHiddenAttr(node)
  };
}
function isHTMLHidden(node, details) {
  const cached = node.cacheGet(HTML_HIDDEN_CACHE);
  if (cached) {
    return details ? cached : cached.byParent || cached.bySelf;
  }
  const result = node.cacheSet(HTML_HIDDEN_CACHE, isHTMLHiddenImpl(node));
  return details ? result : result.byParent || result.bySelf;
}
function isInertImpl(node) {
  const getInertAttr = (node2) => {
    const inert = node2.getAttribute("inert");
    return inert !== null && inert.isStatic;
  };
  return {
    byParent: node.parent ? isInert(node.parent) : false,
    bySelf: getInertAttr(node)
  };
}
function isInert(node, details) {
  const cached = node.cacheGet(INERT_CACHE);
  if (cached) {
    return details ? cached : cached.byParent || cached.bySelf;
  }
  const result = node.cacheSet(INERT_CACHE, isInertImpl(node));
  return details ? result : result.byParent || result.bySelf;
}
function isStyleHiddenImpl(node) {
  const getStyleAttr = (node2) => {
    const style = node2.getAttribute("style");
    const { display, visibility } = parseCssDeclaration(style == null ? void 0 : style.value);
    return display === "none" || visibility === "hidden";
  };
  const byParent = node.parent ? isStyleHidden(node.parent) : false;
  const bySelf = getStyleAttr(node);
  return byParent || bySelf;
}
function isStyleHidden(node) {
  const cached = node.cacheGet(STYLE_HIDDEN_CACHE);
  if (cached) {
    return cached;
  }
  return node.cacheSet(STYLE_HIDDEN_CACHE, isStyleHiddenImpl(node));
}
function isPresentation(node) {
  if (node.cacheExists(ROLE_PRESENTATION_CACHE)) {
    return Boolean(node.cacheGet(ROLE_PRESENTATION_CACHE));
  }
  const meta = node.meta;
  if (meta && meta.interactive) {
    return node.cacheSet(ROLE_PRESENTATION_CACHE, false);
  }
  const tabindex = node.getAttribute("tabindex");
  if (tabindex) {
    return node.cacheSet(ROLE_PRESENTATION_CACHE, false);
  }
  const role = node.getAttribute("role");
  if (role && (role.value === "presentation" || role.value === "none")) {
    return node.cacheSet(ROLE_PRESENTATION_CACHE, true);
  } else {
    return node.cacheSet(ROLE_PRESENTATION_CACHE, false);
  }
}
var cachePrefix = classifyNodeText.name;
var HTML_CACHE_KEY = Symbol(`${cachePrefix}|html`);
var A11Y_CACHE_KEY = Symbol(`${cachePrefix}|a11y`);
var IGNORE_HIDDEN_ROOT_HTML_CACHE_KEY = Symbol(`${cachePrefix}|html|ignore-hidden-root`);
var IGNORE_HIDDEN_ROOT_A11Y_CACHE_KEY = Symbol(`${cachePrefix}|a11y|ignore-hidden-root`);
var TextClassification = /* @__PURE__ */ ((TextClassification2) => {
  TextClassification2[TextClassification2["EMPTY_TEXT"] = 0] = "EMPTY_TEXT";
  TextClassification2[TextClassification2["DYNAMIC_TEXT"] = 1] = "DYNAMIC_TEXT";
  TextClassification2[TextClassification2["STATIC_TEXT"] = 2] = "STATIC_TEXT";
  return TextClassification2;
})(TextClassification || {});
function getCachekey(options) {
  const { accessible = false, ignoreHiddenRoot = false } = options;
  if (accessible && ignoreHiddenRoot) {
    return IGNORE_HIDDEN_ROOT_A11Y_CACHE_KEY;
  } else if (ignoreHiddenRoot) {
    return IGNORE_HIDDEN_ROOT_HTML_CACHE_KEY;
  } else if (accessible) {
    return A11Y_CACHE_KEY;
  } else {
    return HTML_CACHE_KEY;
  }
}
function isSpecialEmpty(node) {
  return node.is("select") || node.is("textarea");
}
function classifyNodeText(node, options = {}) {
  const { accessible = false, ignoreHiddenRoot = false } = options;
  const cacheKey2 = getCachekey(options);
  if (node.cacheExists(cacheKey2)) {
    return node.cacheGet(cacheKey2);
  }
  if (!ignoreHiddenRoot && isHTMLHidden(node)) {
    return node.cacheSet(
      cacheKey2,
      0
      /* EMPTY_TEXT */
    );
  }
  if (!ignoreHiddenRoot && accessible && isAriaHidden(node)) {
    return node.cacheSet(
      cacheKey2,
      0
      /* EMPTY_TEXT */
    );
  }
  if (isSpecialEmpty(node)) {
    return node.cacheSet(
      cacheKey2,
      0
      /* EMPTY_TEXT */
    );
  }
  const text = findTextNodes(node, {
    ...options,
    ignoreHiddenRoot: false
  });
  if (text.some((cur) => cur.isDynamic)) {
    return node.cacheSet(
      cacheKey2,
      1
      /* DYNAMIC_TEXT */
    );
  }
  if (text.some((cur) => cur.textContent.match(/\S/) !== null)) {
    return node.cacheSet(
      cacheKey2,
      2
      /* STATIC_TEXT */
    );
  }
  return node.cacheSet(
    cacheKey2,
    0
    /* EMPTY_TEXT */
  );
}
function findTextNodes(node, options) {
  const { accessible = false } = options;
  let text = [];
  for (const child of node.childNodes) {
    if (isTextNode(child)) {
      text.push(child);
    } else if (isElementNode(child)) {
      if (isHTMLHidden(child, true).bySelf) {
        continue;
      }
      if (accessible && isAriaHidden(child, true).bySelf) {
        continue;
      }
      text = text.concat(findTextNodes(child, options));
    }
  }
  return text;
}
function hasAltText(image) {
  const alt = image.getAttribute("alt");
  if (!alt) {
    return false;
  }
  if (alt.value === null) {
    return false;
  }
  return alt.isDynamic || alt.value.toString() !== "";
}
function hasAriaLabel(node) {
  const label = node.getAttribute("aria-label");
  if (!label) {
    return false;
  }
  if (label.value === null) {
    return false;
  }
  return label.isDynamic || label.value.toString() !== "";
}
function partition(values, predicate) {
  const initial = [[], []];
  return values.reduce((accumulator, value, index) => {
    const match = predicate(value, index, values);
    accumulator[match ? 0 : 1].push(value);
    return accumulator;
  }, initial);
}
var remapEvents = {
  "tag:open": "tag:start",
  "tag:close": "tag:end"
};
var ajv$1 = new import_ajv.default({ strict: true, strictTuples: true, strictTypes: true });
ajv$1.addMetaSchema(ajvSchemaDraft);
function getSchemaValidator(ruleId, properties2) {
  const $id2 = `rule/${ruleId}`;
  const cached = ajv$1.getSchema($id2);
  if (cached) {
    return cached;
  }
  const schema2 = {
    $id: $id2,
    type: "object",
    additionalProperties: false,
    properties: properties2
  };
  return ajv$1.compile(schema2);
}
function isErrorDescriptor(value) {
  return Boolean(value[0] && value[0].message);
}
function unpackErrorDescriptor(value) {
  if (isErrorDescriptor(value)) {
    return value[0];
  } else {
    const [node, message, location, context] = value;
    return { node, message, location, context };
  }
}
var Rule = class {
  constructor(options) {
    this.reporter = null;
    this.parser = null;
    this.meta = null;
    this.event = null;
    this.options = options;
    this.enabled = true;
    this.blockers = [];
    this.severity = Severity.DISABLED;
    this.name = "";
  }
  getSeverity() {
    return this.severity;
  }
  setServerity(severity) {
    this.severity = severity;
  }
  /**
   * Block this rule from generating errors. Pass in an id generated by
   * `createBlocker`. Can be unblocked by {@link Rule.unblock}.
   *
   * A blocked rule is similar to disabling it but it will still receive parser
   * events. A list of all blockers is passed to the `rule:error` event.
   *
   * @internal
   */
  block(id) {
    this.blockers.push(id);
  }
  /**
   * Unblock a rule previously blocked by {@link Rule.block}.
   *
   * @internal
   */
  unblock(id) {
    this.blockers = this.blockers.filter((it) => it !== id);
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  /**
   * Returns `true` if rule is deprecated.
   *
   * Overridden by subclasses.
   */
  get deprecated() {
    return false;
  }
  /**
   * Test if rule is enabled.
   *
   * To be considered enabled the enabled flag must be true and the severity at
   * least warning.
   *
   * @internal
   */
  isEnabled(node) {
    return this.enabled && this.severity >= Severity.WARN && (!node || node.ruleEnabled(this.name));
  }
  /**
   * Test if rule is enabled.
   *
   * To be considered enabled the enabled flag must be true and the severity at
   * least warning.
   *
   * @internal
   */
  isBlocked(node) {
    if (this.blockers.length > 0) {
      return true;
    }
    if (node && node.ruleBlockers(this.name).length > 0) {
      return true;
    }
    return false;
  }
  /**
   * Get a list of all blockers currently active this rule.
   *
   * @internal
   */
  getBlockers(node) {
    return [...this.blockers, ...node ? node.ruleBlockers(this.name) : []];
  }
  /**
   * Check if keyword is being ignored by the current rule configuration.
   *
   * This method requires the [[RuleOption]] type to include two properties:
   *
   * - include: string[] | null
   * - exclude: string[] | null
   *
   * This methods checks if the given keyword is included by "include" but not
   * excluded by "exclude". If any property is unset it is skipped by the
   * condition. Usually the user would use either one but not both but there is
   * no limitation to use both but the keyword must satisfy both conditions. If
   * either condition fails `true` is returned.
   *
   * For instance, given `{ include: ["foo"] }` the keyword `"foo"` would match
   * but not `"bar"`.
   *
   * Similarly, given `{ exclude: ["foo"] }` the keyword `"bar"` would match but
   * not `"foo"`.
   *
   * @param keyword - Keyword to match against `include` and `exclude` options.
   * @param matcher - Optional function to compare items with.
   * @returns `true` if keyword is not present in `include` or is present in
   * `exclude`.
   */
  isKeywordIgnored(keyword, matcher = (list, it) => list.includes(it)) {
    return isKeywordIgnored(this.options, keyword, matcher);
  }
  /**
   * Get [[MetaElement]] for the given tag. If no specific metadata is present
   * the global metadata is returned or null if no global is present.
   *
   * @public
   * @returns A shallow copy of metadata.
   */
  getMetaFor(tagName) {
    return this.meta.getMetaFor(tagName);
  }
  /**
   * Find all tags which has enabled given property.
   */
  getTagsWithProperty(propName) {
    return this.meta.getTagsWithProperty(propName);
  }
  /**
   * Find tag matching tagName or inheriting from it.
   */
  getTagsDerivedFrom(tagName) {
    return this.meta.getTagsDerivedFrom(tagName);
  }
  /**
   * JSON schema for rule options.
   *
   * Rules should override this to return an object with JSON schema to validate
   * rule options. If `null` or `undefined` is returned no validation is
   * performed.
   */
  static schema() {
    return null;
  }
  report(...args) {
    const { node, message, location, context } = unpackErrorDescriptor(args);
    const enabled = this.isEnabled(node);
    const blocked = this.isBlocked(node);
    const where = this.findLocation({ node, location, event: this.event });
    this.parser.trigger("rule:error", {
      location: where,
      ruleId: this.name,
      enabled,
      blockers: this.getBlockers(node)
    });
    if (enabled && !blocked) {
      const interpolated = interpolate(message, context ?? {});
      this.reporter.add(this, interpolated, this.severity, node, where, context);
    }
  }
  findLocation(src) {
    var _a2, _b;
    if (src.location) {
      return src.location;
    }
    if ((_a2 = src.event) == null ? void 0 : _a2.location) {
      return src.event.location;
    }
    if ((_b = src.node) == null ? void 0 : _b.location) {
      return src.node.location;
    }
    return {};
  }
  on(event, ...args) {
    const remap = remapEvents[event];
    if (remap) {
      event = remap;
    }
    const callback = args.pop();
    const filter = args.pop() ?? (() => true);
    return this.parser.on(event, (_event, data) => {
      if (this.isEnabled() && filter(data)) {
        this.event = data;
        callback(data);
      }
    });
  }
  /**
   * Called by [[Engine]] when initializing the rule.
   *
   * Do not override this, use the `setup` callback instead.
   *
   * @internal
   */
  init(parser, reporter, severity, meta) {
    this.parser = parser;
    this.reporter = reporter;
    this.severity = severity;
    this.meta = meta;
  }
  /**
   * Validate rule options against schema. Throws error if object does not validate.
   *
   * For rules without schema this function does nothing.
   *
   * @throws {@link SchemaValidationError}
   * Thrown when provided options does not validate against rule schema.
   *
   * @param cls - Rule class (constructor)
   * @param ruleId - Rule identifier
   * @param jsonPath - JSON path from which [[options]] can be found in [[config]]
   * @param options - User configured options to be validated
   * @param filename - Filename from which options originated
   * @param config - Configuration from which options originated
   *
   * @internal
   */
  static validateOptions(cls, ruleId, jsonPath, options, filename, config2) {
    if (!cls) {
      return;
    }
    const schema2 = cls.schema();
    if (!schema2) {
      return;
    }
    const isValid = getSchemaValidator(ruleId, schema2);
    if (!isValid(options)) {
      const errors = isValid.errors ?? [];
      const mapped = errors.map((error) => {
        error.instancePath = `${jsonPath}${error.instancePath}`;
        return error;
      });
      throw new SchemaValidationError(filename, `Rule configuration error`, config2, schema2, mapped);
    }
  }
  /**
   * Rule documentation callback.
   *
   * Called when requesting additional documentation for a rule. Some rules
   * provide additional context to provide context-aware suggestions.
   *
   * @public
   * @virtual
   * @param context - Error context given by a reported error.
   * @returns Rule documentation and url with additional details or `null` if no
   * additional documentation is available.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars -- technical debt, prototype should be moved to interface */
  documentation(context) {
    return null;
  }
};
var defaults$x = {
  allowExternal: true,
  allowRelative: true,
  allowAbsolute: true,
  allowBase: true
};
var mapping = {
  a: "href",
  img: "src",
  link: "href",
  script: "src"
};
var description = {
  [
    "external"
    /* EXTERNAL */
  ]: "External links are not allowed by current configuration.",
  [
    "relative-base"
    /* RELATIVE_BASE */
  ]: "Links relative to <base> are not allowed by current configuration.",
  [
    "relative-path"
    /* RELATIVE_PATH */
  ]: "Relative links are not allowed by current configuration.",
  [
    "absolute"
    /* ABSOLUTE */
  ]: "Absolute links are not allowed by current configuration.",
  [
    "anchor"
    /* ANCHOR */
  ]: null
};
function parseAllow(value) {
  if (typeof value === "boolean") {
    return value;
  }
  return {
    /* eslint-disable security/detect-non-literal-regexp -- expected to be regexp  */
    include: value.include ? value.include.map((it) => new RegExp(it)) : null,
    exclude: value.exclude ? value.exclude.map((it) => new RegExp(it)) : null
    /* eslint-enable security/detect-non-literal-regexp */
  };
}
function matchList(value, list) {
  if (list.include && !list.include.some((it) => it.test(value))) {
    return false;
  }
  if (list.exclude && list.exclude.some((it) => it.test(value))) {
    return false;
  }
  return true;
}
var AllowedLinks = class extends Rule {
  constructor(options) {
    super({ ...defaults$x, ...options });
    this.allowExternal = parseAllow(this.options.allowExternal);
    this.allowRelative = parseAllow(this.options.allowRelative);
    this.allowAbsolute = parseAllow(this.options.allowAbsolute);
  }
  static schema() {
    const booleanOrObject = {
      anyOf: [
        { type: "boolean" },
        {
          type: "object",
          properties: {
            include: {
              type: "array",
              items: { type: "string" }
            },
            exclude: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      ]
    };
    return {
      allowExternal: { ...booleanOrObject },
      allowRelative: { ...booleanOrObject },
      allowAbsolute: { ...booleanOrObject },
      allowBase: { type: "boolean" }
    };
  }
  documentation(context) {
    const message = description[context] ?? "This link type is not allowed by current configuration";
    return {
      description: message,
      url: "https://html-validate.org/rules/allowed-links.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      if (!event.value || !this.isRelevant(event)) {
        return;
      }
      const link = event.value.toString();
      const style = this.getStyle(link);
      switch (style) {
        case "anchor":
          break;
        case "absolute":
          this.handleAbsolute(link, event, style);
          break;
        case "external":
          this.handleExternal(link, event, style);
          break;
        case "relative-base":
          this.handleRelativeBase(link, event, style);
          break;
        case "relative-path":
          this.handleRelativePath(link, event, style);
          break;
      }
    });
  }
  isRelevant(event) {
    const { target, key, value } = event;
    if (value instanceof DynamicValue) {
      return false;
    }
    const attr = mapping[target.tagName];
    return Boolean(attr && attr === key);
  }
  getStyle(value) {
    if (value.match(/^([a-z]+:)?\/\//g)) {
      return "external";
    }
    switch (value[0]) {
      case "/":
        return "absolute";
      case ".":
        return "relative-path";
      case "#":
        return "anchor";
      default:
        return "relative-base";
    }
  }
  handleAbsolute(target, event, style) {
    const { allowAbsolute } = this;
    if (allowAbsolute === true) {
      return;
    } else if (allowAbsolute === false) {
      this.report(
        event.target,
        "Link destination must not be absolute url",
        event.valueLocation,
        style
      );
    } else if (!matchList(target, allowAbsolute)) {
      this.report(
        event.target,
        "Absolute link to this destination is not allowed by current configuration",
        event.valueLocation,
        style
      );
    }
  }
  handleExternal(target, event, style) {
    const { allowExternal } = this;
    if (allowExternal === true) {
      return;
    } else if (allowExternal === false) {
      this.report(
        event.target,
        "Link destination must not be external url",
        event.valueLocation,
        style
      );
    } else if (!matchList(target, allowExternal)) {
      this.report(
        event.target,
        "External link to this destination is not allowed by current configuration",
        event.valueLocation,
        style
      );
    }
  }
  handleRelativePath(target, event, style) {
    const { allowRelative } = this;
    if (allowRelative === true) {
      return false;
    } else if (allowRelative === false) {
      this.report(
        event.target,
        "Link destination must not be relative url",
        event.valueLocation,
        style
      );
      return true;
    } else if (!matchList(target, allowRelative)) {
      this.report(
        event.target,
        "Relative link to this destination is not allowed by current configuration",
        event.valueLocation,
        style
      );
      return true;
    }
    return false;
  }
  handleRelativeBase(target, event, style) {
    const { allowBase } = this.options;
    if (this.handleRelativePath(target, event, style)) {
      return;
    } else if (!allowBase) {
      this.report(
        event.target,
        "Relative links must be relative to current folder",
        event.valueLocation,
        style
      );
    }
  }
};
var defaults$w = {
  accessible: true
};
function findByTarget(target, siblings) {
  return siblings.filter((it) => it.getAttributeValue("href") === target);
}
function getAltText(node) {
  return node.getAttributeValue("alt");
}
function getDescription$1(context) {
  switch (context) {
    case "missing-alt":
      return [
        "The `alt` attribute must be set (and not empty) when the `href` attribute is present on an `<area>` element.",
        "",
        "The attribute is used to provide an alternative text description for the area of the image map.",
        "The text should describe the purpose of area and the resource referenced by the `href` attribute.",
        "",
        "Either add the `alt` attribute or remove the `href` attribute."
      ];
    case "missing-href":
      return [
        "The `alt` attribute must not be set when the `href` attribute is missing on an `<area>` element.",
        "",
        "Either add the `href` attribute or remove the `alt` attribute."
      ];
  }
}
var AreaAlt = class extends Rule {
  constructor(options) {
    super({ ...defaults$w, ...options });
  }
  static schema() {
    return {
      accessible: {
        type: "boolean"
      }
    };
  }
  documentation(context) {
    return {
      description: getDescription$1(context).join("\n"),
      url: "https://html-validate.org/rules/area-alt.html"
    };
  }
  setup() {
    this.on("element:ready", this.isRelevant, (event) => {
      const { target } = event;
      const siblings = target.querySelectorAll("area");
      for (const child of siblings) {
        this.validateArea(child, siblings);
      }
    });
  }
  validateArea(area, siblings) {
    const { accessible } = this.options;
    const href = area.getAttribute("href");
    const alt = area.getAttribute("alt");
    if (href) {
      if (alt && alt.isDynamic) {
        return;
      }
      const target = area.getAttributeValue("href");
      const altTexts = accessible ? [getAltText(area)] : findByTarget(target, siblings).map(getAltText);
      if (!altTexts.some(Boolean)) {
        this.report({
          node: area,
          message: `"alt" attribute must be set and non-empty when the "href" attribute is present`,
          location: alt ? alt.keyLocation : href.keyLocation,
          context: "missing-alt"
          /* MISSING_ALT */
        });
      }
    } else if (alt) {
      this.report({
        node: area,
        message: `"alt" attribute cannot be used unless the "href" attribute is present`,
        location: alt.keyLocation,
        context: "missing-href"
        /* MISSING_HREF */
      });
    }
  }
  isRelevant(event) {
    const { target } = event;
    return target.is("map");
  }
};
var AriaHiddenBody = class extends Rule {
  documentation() {
    return {
      description: "`aria-hidden` must not be used on the `<body>` element as it makes the page inaccessible to assistive technology such as screenreaders",
      url: "https://html-validate.org/rules/aria-hidden-body.html"
    };
  }
  setup() {
    this.on("tag:ready", this.isRelevant, (event) => {
      const { target } = event;
      const attr = target.getAttribute("aria-hidden");
      if (!attr || !attr.valueMatches("true", true)) {
        return;
      }
      this.report(target, "aria-hidden must not be used on <body>", attr.keyLocation);
    });
  }
  isRelevant(event) {
    return event.target.is("body");
  }
};
var defaults$v = {
  allowAnyNamable: false
};
var whitelisted = [
  "main",
  "nav",
  "table",
  "td",
  "th",
  "aside",
  "header",
  "footer",
  "section",
  "article",
  "form",
  "img",
  "area",
  "fieldset",
  "summary",
  "figure"
];
function isValidUsage(target, meta) {
  const explicit = meta.attributes["aria-label"];
  if (explicit) {
    return true;
  }
  if (whitelisted.includes(target.tagName)) {
    return true;
  }
  if (target.hasAttribute("role")) {
    return true;
  }
  if (target.hasAttribute("tabindex")) {
    return true;
  }
  if (Boolean(meta.interactive) || Boolean(meta.labelable)) {
    return true;
  }
  return false;
}
var AriaLabelMisuse = class extends Rule {
  constructor(options) {
    super({ ...defaults$v, ...options });
  }
  documentation() {
    const valid = [
      "Interactive elements",
      "Labelable elements",
      "Landmark elements",
      "Elements with roles inheriting from widget",
      "`<area>`",
      "`<form>` and `<fieldset>`",
      "`<iframe>`",
      "`<img>` and `<figure>`",
      "`<summary>`",
      "`<table>`, `<td>` and `<th>`"
    ];
    const lines = valid.map((it) => `- ${it}
`).join("");
    return {
      description: `\`aria-label\` can only be used on:

${lines}`,
      url: "https://html-validate.org/rules/aria-label-misuse.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      for (const target of document2.querySelectorAll("[aria-label]")) {
        this.validateElement(target);
      }
    });
  }
  validateElement(target) {
    const attr = target.getAttribute("aria-label");
    if (!attr.value || attr.valueMatches("", false)) {
      return;
    }
    const meta = target.meta;
    if (!meta) {
      return;
    }
    if (isValidUsage(target, meta)) {
      return;
    }
    if (this.options.allowAnyNamable && ariaNaming(target) === "allowed") {
      return;
    }
    this.report(target, `"aria-label" cannot be used on this element`, attr.keyLocation);
  }
};
var ConfigError = class _ConfigError extends UserError {
  constructor(message, nested) {
    super(message, nested);
    Error.captureStackTrace(this, _ConfigError);
    this.name = _ConfigError.name;
  }
};
var CaseStyle = class {
  /**
   * @param style - Name of a valid case style.
   */
  constructor(style, ruleId) {
    if (!Array.isArray(style)) {
      style = [style];
    }
    if (style.length === 0) {
      throw new ConfigError(`Missing style for ${ruleId} rule`);
    }
    this.styles = this.parseStyle(style, ruleId);
  }
  /**
   * Test if a text matches this case style.
   */
  match(text) {
    return this.styles.some((style) => text.match(style.pattern));
  }
  get name() {
    const names = this.styles.map((style) => style.name);
    switch (this.styles.length) {
      case 1:
        return names[0];
      case 2:
        return names.join(" or ");
      default: {
        const last = names.slice(-1);
        const rest = names.slice(0, -1);
        return `${rest.join(", ")} or ${last[0]}`;
      }
    }
  }
  parseStyle(style, ruleId) {
    return style.map((cur) => {
      switch (cur.toLowerCase()) {
        case "lowercase":
          return { pattern: /^[a-z]*$/, name: "lowercase" };
        case "uppercase":
          return { pattern: /^[A-Z]*$/, name: "uppercase" };
        case "pascalcase":
          return { pattern: /^[A-Z][A-Za-z]*$/, name: "PascalCase" };
        case "camelcase":
          return { pattern: /^[a-z][A-Za-z]*$/, name: "camelCase" };
        default:
          throw new ConfigError(`Invalid style "${cur}" for ${ruleId} rule`);
      }
    });
  }
};
var defaults$u = {
  style: "lowercase",
  ignoreForeign: true
};
var AttrCase = class extends Rule {
  constructor(options) {
    super({ ...defaults$u, ...options });
    this.style = new CaseStyle(this.options.style, "attr-case");
  }
  static schema() {
    const styleEnum = ["lowercase", "uppercase", "pascalcase", "camelcase"];
    return {
      ignoreForeign: {
        type: "boolean"
      },
      style: {
        anyOf: [
          {
            enum: styleEnum,
            type: "string"
          },
          {
            items: {
              enum: styleEnum,
              type: "string"
            },
            type: "array"
          }
        ]
      }
    };
  }
  documentation() {
    const { style } = this.options;
    return {
      description: Array.isArray(style) ? [`Attribute name must be in one of:`, "", ...style.map((it) => `- ${it}`)].join("\n") : `Attribute name must be in ${style}.`,
      url: "https://html-validate.org/rules/attr-case.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      if (this.isIgnored(event.target)) {
        return;
      }
      if (event.originalAttribute) {
        return;
      }
      const letters = event.key.replace(/[^a-z]+/gi, "");
      if (this.style.match(letters)) {
        return;
      }
      this.report({
        node: event.target,
        message: `Attribute "${event.key}" should be ${this.style.name}`,
        location: event.keyLocation
      });
    });
  }
  isIgnored(node) {
    if (this.options.ignoreForeign) {
      return Boolean(node.meta && node.meta.foreign);
    } else {
      return false;
    }
  }
};
var TokenType = /* @__PURE__ */ ((TokenType2) => {
  TokenType2[TokenType2["UNICODE_BOM"] = 1] = "UNICODE_BOM";
  TokenType2[TokenType2["WHITESPACE"] = 2] = "WHITESPACE";
  TokenType2[TokenType2["DOCTYPE_OPEN"] = 3] = "DOCTYPE_OPEN";
  TokenType2[TokenType2["DOCTYPE_VALUE"] = 4] = "DOCTYPE_VALUE";
  TokenType2[TokenType2["DOCTYPE_CLOSE"] = 5] = "DOCTYPE_CLOSE";
  TokenType2[TokenType2["TAG_OPEN"] = 6] = "TAG_OPEN";
  TokenType2[TokenType2["TAG_CLOSE"] = 7] = "TAG_CLOSE";
  TokenType2[TokenType2["ATTR_NAME"] = 8] = "ATTR_NAME";
  TokenType2[TokenType2["ATTR_VALUE"] = 9] = "ATTR_VALUE";
  TokenType2[TokenType2["TEXT"] = 10] = "TEXT";
  TokenType2[TokenType2["TEMPLATING"] = 11] = "TEMPLATING";
  TokenType2[TokenType2["SCRIPT"] = 12] = "SCRIPT";
  TokenType2[TokenType2["STYLE"] = 13] = "STYLE";
  TokenType2[TokenType2["COMMENT"] = 14] = "COMMENT";
  TokenType2[TokenType2["CONDITIONAL"] = 15] = "CONDITIONAL";
  TokenType2[TokenType2["DIRECTIVE"] = 16] = "DIRECTIVE";
  TokenType2[TokenType2["EOF"] = 17] = "EOF";
  return TokenType2;
})(TokenType || {});
var MATCH_UNICODE_BOM = /^\uFEFF/;
var MATCH_WHITESPACE = /^(?:\r\n|\r|\n|[ \t]+(?:\r\n|\r|\n)?)/;
var MATCH_DOCTYPE_OPEN = /^<!(DOCTYPE)\s/i;
var MATCH_DOCTYPE_VALUE = /^[^>]+/;
var MATCH_DOCTYPE_CLOSE = /^>/;
var MATCH_XML_TAG = /^<\?xml.*?\?>\s+/;
var MATCH_TAG_OPEN = /^<(\/?)([a-zA-Z0-9\-:]+)/;
var MATCH_TAG_CLOSE = /^\/?>/;
var MATCH_TEXT = /^[^]*?(?=(?:[ \t]*(?:\r\n|\r|\n)|<[^ ]|$))/;
var MATCH_TEMPLATING = /^(?:<%.*?%>|<\?.*?\?>|<\$.*?\$>)/s;
var MATCH_TAG_LOOKAHEAD = /^[^]*?(?=<|$)/;
var MATCH_ATTR_START = /^([^\t\r\n\f \/><"'=]+)/;
var MATCH_ATTR_SINGLE = /^(\s*=\s*)'([^']*?)(')/;
var MATCH_ATTR_DOUBLE = /^(\s*=\s*)"([^"]*?)(")/;
var MATCH_ATTR_UNQUOTED = /^(\s*=\s*)([^\t\r\n\f "'<>][^\t\r\n\f <>]*)/;
var MATCH_CDATA_BEGIN = /^<!\[CDATA\[/;
var MATCH_CDATA_END = /^[^]*?]]>/;
var MATCH_SCRIPT_DATA = /^[^]*?(?=<\/script)/;
var MATCH_SCRIPT_END = /^<(\/)(script)/;
var MATCH_STYLE_DATA = /^[^]*?(?=<\/style)/;
var MATCH_STYLE_END = /^<(\/)(style)/;
var MATCH_DIRECTIVE = /^(<!--\s*\[html-validate-)([a-z0-9-]+)(\s*)(.*?)(]?\s*-->)/;
var MATCH_COMMENT = /^<!--([^]*?)-->/;
var MATCH_CONDITIONAL = /^<!\[([^\]]*?)\]>/;
var InvalidTokenError = class extends Error {
  constructor(location, message) {
    super(message);
    this.location = location;
  }
};
var Lexer = class {
  /* eslint-disable-next-line complexity -- there isn't really a good way to refactor this while keeping readability */
  *tokenize(source) {
    const context = new Context(source);
    let previousState = context.state;
    let previousLength = context.string.length;
    while (context.string.length > 0) {
      switch (context.state) {
        case State.INITIAL:
          yield* this.tokenizeInitial(context);
          break;
        case State.DOCTYPE:
          yield* this.tokenizeDoctype(context);
          break;
        case State.TAG:
          yield* this.tokenizeTag(context);
          break;
        case State.ATTR:
          yield* this.tokenizeAttr(context);
          break;
        case State.TEXT:
          yield* this.tokenizeText(context);
          break;
        case State.CDATA:
          yield* this.tokenizeCDATA(context);
          break;
        case State.SCRIPT:
          yield* this.tokenizeScript(context);
          break;
        case State.STYLE:
          yield* this.tokenizeStyle(context);
          break;
        default:
          this.unhandled(context);
      }
      if (context.state === previousState && context.string.length === previousLength) {
        this.errorStuck(context);
      }
      previousState = context.state;
      previousLength = context.string.length;
    }
    yield this.token(context, TokenType.EOF, []);
  }
  token(context, type2, data) {
    const size = data.length > 0 ? data[0].length : 0;
    const location = context.getLocation(size);
    return {
      type: type2,
      location,
      data: Array.from(data)
    };
  }
  /* istanbul ignore next: used to provide a better error when an unhandled state happens */
  unhandled(context) {
    const truncated = JSON.stringify(
      context.string.length > 13 ? `${context.string.slice(0, 15)}...` : context.string
    );
    const state = State[context.state];
    const message = `failed to tokenize ${truncated}, unhandled state ${state}.`;
    throw new InvalidTokenError(context.getLocation(1), message);
  }
  /* istanbul ignore next: used to provide a better error when lexer is detected to be stuck, no known way to reproduce */
  errorStuck(context) {
    const state = State[context.state];
    const message = `failed to tokenize ${context.getTruncatedLine()}, state ${state} failed to consume data or change state.`;
    throw new InvalidTokenError(context.getLocation(1), message);
  }
  evalNextState(nextState, token) {
    if (typeof nextState === "function") {
      return nextState(token);
    } else {
      return nextState;
    }
  }
  *match(context, tests, error) {
    const n = tests.length;
    for (let i = 0; i < n; i++) {
      const [regex, nextState, tokenType] = tests[i];
      const match = regex ? context.string.match(regex) : [""];
      if (match) {
        let token = null;
        if (tokenType !== false) {
          token = this.token(context, tokenType, match);
          yield token;
        }
        const state = this.evalNextState(nextState, token);
        context.consume(match, state);
        this.enter(context, state, match);
        return;
      }
    }
    const message = `failed to tokenize ${context.getTruncatedLine()}, ${error}.`;
    throw new InvalidTokenError(context.getLocation(1), message);
  }
  /**
   * Called when entering a new state.
   */
  enter(context, state, data) {
    if (state === State.TAG && data && data[0].startsWith("<")) {
      if (data[0] === "<script") {
        context.contentModel = ContentModel.SCRIPT;
      } else if (data[0] === "<style") {
        context.contentModel = ContentModel.STYLE;
      } else {
        context.contentModel = ContentModel.TEXT;
      }
    }
  }
  *tokenizeInitial(context) {
    yield* this.match(
      context,
      [
        [MATCH_UNICODE_BOM, State.INITIAL, TokenType.UNICODE_BOM],
        [MATCH_XML_TAG, State.INITIAL, false],
        [MATCH_DOCTYPE_OPEN, State.DOCTYPE, TokenType.DOCTYPE_OPEN],
        [MATCH_WHITESPACE, State.INITIAL, TokenType.WHITESPACE],
        [MATCH_DIRECTIVE, State.INITIAL, TokenType.DIRECTIVE],
        [MATCH_CONDITIONAL, State.INITIAL, TokenType.CONDITIONAL],
        [MATCH_COMMENT, State.INITIAL, TokenType.COMMENT],
        [false, State.TEXT, false]
      ],
      "expected doctype"
    );
  }
  *tokenizeDoctype(context) {
    yield* this.match(
      context,
      [
        [MATCH_WHITESPACE, State.DOCTYPE, TokenType.WHITESPACE],
        [MATCH_DOCTYPE_VALUE, State.DOCTYPE, TokenType.DOCTYPE_VALUE],
        [MATCH_DOCTYPE_CLOSE, State.TEXT, TokenType.DOCTYPE_CLOSE]
      ],
      "expected doctype name"
    );
  }
  *tokenizeTag(context) {
    function nextState(token) {
      const tagCloseToken = token;
      switch (context.contentModel) {
        case ContentModel.TEXT:
          return State.TEXT;
        case ContentModel.SCRIPT:
          if (tagCloseToken && !tagCloseToken.data[0].startsWith("/")) {
            return State.SCRIPT;
          } else {
            return State.TEXT;
          }
        case ContentModel.STYLE:
          if (tagCloseToken && !tagCloseToken.data[0].startsWith("/")) {
            return State.STYLE;
          } else {
            return State.TEXT;
          }
      }
    }
    yield* this.match(
      context,
      [
        [MATCH_TAG_CLOSE, nextState, TokenType.TAG_CLOSE],
        [MATCH_ATTR_START, State.ATTR, TokenType.ATTR_NAME],
        [MATCH_WHITESPACE, State.TAG, TokenType.WHITESPACE]
      ],
      'expected attribute, ">" or "/>"'
    );
  }
  *tokenizeAttr(context) {
    yield* this.match(
      context,
      [
        [MATCH_ATTR_SINGLE, State.TAG, TokenType.ATTR_VALUE],
        [MATCH_ATTR_DOUBLE, State.TAG, TokenType.ATTR_VALUE],
        [MATCH_ATTR_UNQUOTED, State.TAG, TokenType.ATTR_VALUE],
        [false, State.TAG, false]
      ],
      'expected attribute, ">" or "/>"'
    );
  }
  *tokenizeText(context) {
    yield* this.match(
      context,
      [
        [MATCH_WHITESPACE, State.TEXT, TokenType.WHITESPACE],
        [MATCH_CDATA_BEGIN, State.CDATA, false],
        [MATCH_DIRECTIVE, State.TEXT, TokenType.DIRECTIVE],
        [MATCH_CONDITIONAL, State.TEXT, TokenType.CONDITIONAL],
        [MATCH_COMMENT, State.TEXT, TokenType.COMMENT],
        [MATCH_TEMPLATING, State.TEXT, TokenType.TEMPLATING],
        [MATCH_TAG_OPEN, State.TAG, TokenType.TAG_OPEN],
        [MATCH_TEXT, State.TEXT, TokenType.TEXT],
        [MATCH_TAG_LOOKAHEAD, State.TEXT, TokenType.TEXT]
      ],
      'expected text or "<"'
    );
  }
  *tokenizeCDATA(context) {
    yield* this.match(context, [[MATCH_CDATA_END, State.TEXT, false]], "expected ]]>");
  }
  *tokenizeScript(context) {
    yield* this.match(
      context,
      [
        [MATCH_SCRIPT_END, State.TAG, TokenType.TAG_OPEN],
        [MATCH_SCRIPT_DATA, State.SCRIPT, TokenType.SCRIPT]
      ],
      "expected <\/script>"
    );
  }
  *tokenizeStyle(context) {
    yield* this.match(
      context,
      [
        [MATCH_STYLE_END, State.TAG, TokenType.TAG_OPEN],
        [MATCH_STYLE_DATA, State.STYLE, TokenType.STYLE]
      ],
      "expected </style>"
    );
  }
};
var whitespace = /(\s+)/;
var AttrDelimiter = class extends Rule {
  documentation() {
    return {
      description: `Attribute value must not be separated by whitespace.`,
      url: "https://html-validate.org/rules/attr-delimiter.html"
    };
  }
  setup() {
    this.on("token", (event) => {
      const { token } = event;
      if (token.type !== TokenType.ATTR_VALUE) {
        return;
      }
      const delimiter = token.data[1];
      const match = whitespace.exec(delimiter);
      if (match) {
        const location = sliceLocation(event.location, 0, delimiter.length);
        this.report(null, "Attribute value must not be delimited by whitespace", location);
      }
    });
  }
};
var DEFAULT_PATTERN = "[a-z0-9-:]+";
var defaults$t = {
  pattern: DEFAULT_PATTERN,
  ignoreForeign: true
};
function generateRegexp(pattern) {
  if (Array.isArray(pattern)) {
    return new RegExp(`^(${pattern.join("|")})$`, "i");
  } else {
    return new RegExp(`^${pattern}$`, "i");
  }
}
function generateMessage(name, pattern) {
  if (Array.isArray(pattern)) {
    const patterns = pattern.map((it) => `/${it}/`).join(", ");
    return `Attribute "${name}" should match one of [${patterns}]`;
  } else {
    return `Attribute "${name}" should match /${pattern}/`;
  }
}
function generateDescription(name, pattern) {
  if (Array.isArray(pattern)) {
    return [
      `Attribute "${name}" should match one of the configured regular expressions:`,
      "",
      ...pattern.map((it) => `- \`/${it}/\``)
    ].join("\n");
  } else {
    return `Attribute "${name}" should match the regular expression \`/${pattern}/\``;
  }
}
var AttrPattern = class extends Rule {
  constructor(options) {
    super({ ...defaults$t, ...options });
    this.pattern = generateRegexp(this.options.pattern);
  }
  static schema() {
    return {
      pattern: {
        oneOf: [{ type: "array", items: { type: "string" }, minItems: 1 }, { type: "string" }]
      },
      ignoreForeign: {
        type: "boolean"
      }
    };
  }
  documentation(context) {
    return {
      description: generateDescription(context.attr, context.pattern),
      url: "https://html-validate.org/rules/attr-pattern.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      if (this.isIgnored(event.target)) {
        return;
      }
      if (event.originalAttribute) {
        return;
      }
      if (this.pattern.test(event.key)) {
        return;
      }
      const message = generateMessage(event.key, this.options.pattern);
      const context = {
        attr: event.key,
        pattern: this.options.pattern
      };
      this.report(event.target, message, event.keyLocation, context);
    });
  }
  isIgnored(node) {
    if (this.options.ignoreForeign) {
      return Boolean(node.meta && node.meta.foreign);
    } else {
      return false;
    }
  }
};
var defaults$s = {
  style: "auto",
  unquoted: false
};
function describeError(context) {
  switch (context.error) {
    case "style":
      return `Attribute \`${context.attr}\` must use \`${context.expected}\` instead of \`${context.actual}\`.`;
    case "unquoted":
      return `Attribute \`${context.attr}\` must not be unquoted.`;
  }
}
function describeStyle(style, unquoted) {
  const description2 = [];
  switch (style) {
    case "auto":
      description2.push(
        "- quoted with double quotes `\"` unless the value contains double quotes in which case single quotes `'` should be used instead"
      );
      break;
    case "any":
      description2.push("- quoted with single quotes `'`");
      description2.push('- quoted with double quotes `"`');
      break;
    case "'":
    case '"': {
      const name = style === "'" ? "single" : "double";
      description2.push(`- quoted with ${name} quotes \`${style}\``);
      break;
    }
  }
  if (unquoted) {
    description2.push("- unquoted (if applicable)");
  }
  return `${description2.join(" or\n")}
`;
}
var AttrQuotes = class extends Rule {
  constructor(options) {
    super({ ...defaults$s, ...options });
    this.style = parseStyle$3(this.options.style);
  }
  static schema() {
    return {
      style: {
        enum: ["auto", "double", "single", "any"],
        type: "string"
      },
      unquoted: {
        type: "boolean"
      }
    };
  }
  documentation(context) {
    const { style } = this;
    const { unquoted } = this.options;
    const description2 = [
      describeError(context),
      "",
      "Under the current configuration attributes must be:",
      "",
      describeStyle(style, unquoted)
    ];
    return {
      description: description2.join("\n"),
      url: "https://html-validate.org/rules/attr-quotes.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      if (event.value === null) {
        return;
      }
      if (!event.quote) {
        if (!this.options.unquoted) {
          const message = `Attribute "${event.key}" using unquoted value`;
          const context = {
            error: "unquoted",
            attr: event.key
          };
          this.report(event.target, message, null, context);
        }
        return;
      }
      if (this.style === "any") {
        return;
      }
      const expected = this.resolveQuotemark(event.value.toString(), this.style);
      if (event.quote !== expected) {
        const message = `Attribute "${event.key}" used ${event.quote} instead of expected ${expected}`;
        const context = {
          error: "style",
          attr: event.key,
          actual: event.quote,
          expected
        };
        this.report(event.target, message, null, context);
      }
    });
  }
  resolveQuotemark(value, style) {
    if (style === "auto") {
      return value.includes('"') ? "'" : '"';
    } else {
      return style;
    }
  }
};
function parseStyle$3(style) {
  switch (style.toLowerCase()) {
    case "auto":
      return "auto";
    case "double":
      return '"';
    case "single":
      return "'";
    case "any":
      return "any";
    default:
      throw new ConfigError(`Invalid style "${style}" for "attr-quotes" rule`);
  }
}
var AttrSpacing = class extends Rule {
  documentation() {
    return {
      description: `No space between attributes. At least one whitespace character (commonly space) must be used to separate attributes.`,
      url: "https://html-validate.org/rules/attr-spacing.html"
    };
  }
  setup() {
    let previousToken;
    this.on("token", (event) => {
      if (event.type === TokenType.ATTR_NAME && previousToken !== TokenType.WHITESPACE) {
        this.report(null, "No space between attributes", event.location);
      }
      previousToken = event.type;
    });
  }
};
function pick(attr) {
  const result = {};
  if (typeof attr.enum !== "undefined") {
    result.enum = attr.enum;
  }
  if (typeof attr.boolean !== "undefined") {
    result.boolean = attr.boolean;
  }
  return result;
}
var AttributeAllowedValues = class extends Rule {
  documentation(context) {
    const docs = {
      description: "Attribute has invalid value.",
      url: "https://html-validate.org/rules/attribute-allowed-values.html"
    };
    if (!context) {
      return docs;
    }
    const { allowed, attribute, element, value } = context;
    if (allowed.enum) {
      const allowedList = allowed.enum.map((value2) => {
        if (typeof value2 === "string") {
          return `- \`"${value2}"\``;
        } else {
          return `- \`${value2.toString()}\``;
        }
      });
      docs.description = [
        `The \`<${element}>\` element does not allow the attribute \`${attribute}\` to have the value \`"${value}"\`.`,
        "",
        "It must match one of the following:",
        "",
        ...allowedList
      ].join("\n");
    } else if (allowed.boolean) {
      docs.description = `The \`<${context.element}>\` attribute \`${context.attribute}\` must be a boolean attribute, e.g. \`<${context.element} ${context.attribute}>\``;
    }
    return docs;
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      doc.visitDepthFirst((node) => {
        const meta = node.meta;
        if (!(meta == null ? void 0 : meta.attributes))
          return;
        for (const attr of node.attributes) {
          if (Validator.validateAttribute(attr, meta.attributes)) {
            continue;
          }
          const value = attr.value ? attr.value.toString() : "";
          const context = {
            element: node.tagName,
            attribute: attr.key,
            value,
            allowed: pick(meta.attributes[attr.key])
          };
          const message = this.getMessage(attr);
          const location = this.getLocation(attr);
          this.report(node, message, location, context);
        }
      });
    });
  }
  getMessage(attr) {
    const { key, value } = attr;
    if (value !== null) {
      return `Attribute "${key}" has invalid value "${value.toString()}"`;
    } else {
      return `Attribute "${key}" is missing value`;
    }
  }
  getLocation(attr) {
    if (attr.value !== null) {
      return attr.valueLocation;
    } else {
      return attr.keyLocation;
    }
  }
};
var defaults$r = {
  style: "omit"
};
var AttributeBooleanStyle = class extends Rule {
  constructor(options) {
    super({ ...defaults$r, ...options });
    this.hasInvalidStyle = parseStyle$2(this.options.style);
  }
  static schema() {
    return {
      style: {
        enum: ["empty", "name", "omit"],
        type: "string"
      }
    };
  }
  documentation() {
    return {
      description: "Require a specific style when writing boolean attributes.",
      url: "https://html-validate.org/rules/attribute-boolean-style.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      doc.visitDepthFirst((node) => {
        const meta = node.meta;
        if (!(meta == null ? void 0 : meta.attributes))
          return;
        for (const attr of node.attributes) {
          if (!this.isBoolean(attr, meta.attributes))
            continue;
          if (attr.originalAttribute) {
            continue;
          }
          if (this.hasInvalidStyle(attr)) {
            this.report(node, reportMessage$1(attr, this.options.style), attr.keyLocation);
          }
        }
      });
    });
  }
  isBoolean(attr, rules) {
    const meta = rules[attr.key];
    return Boolean(meta == null ? void 0 : meta.boolean);
  }
};
function parseStyle$2(style) {
  switch (style.toLowerCase()) {
    case "omit":
      return (attr) => attr.value !== null;
    case "empty":
      return (attr) => attr.value !== "";
    case "name":
      return (attr) => attr.value !== attr.key;
    default:
      throw new Error(`Invalid style "${style}" for "attribute-boolean-style" rule`);
  }
}
function reportMessage$1(attr, style) {
  const key = attr.key;
  switch (style.toLowerCase()) {
    case "omit":
      return `Attribute "${key}" should omit value`;
    case "empty":
      return `Attribute "${key}" value should be empty string`;
    case "name":
      return `Attribute "${key}" should be set to ${key}="${key}"`;
  }
  return "";
}
var defaults$q = {
  style: "omit"
};
var AttributeEmptyStyle = class extends Rule {
  constructor(options) {
    super({ ...defaults$q, ...options });
    this.hasInvalidStyle = parseStyle$1(this.options.style);
  }
  static schema() {
    return {
      style: {
        enum: ["empty", "omit"],
        type: "string"
      }
    };
  }
  documentation() {
    return {
      description: "Require a specific style for attributes with empty values.",
      url: "https://html-validate.org/rules/attribute-empty-style.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      doc.visitDepthFirst((node) => {
        const meta = node.meta;
        if (!(meta == null ? void 0 : meta.attributes))
          return;
        for (const attr of node.attributes) {
          if (!allowsEmpty(attr, meta.attributes)) {
            continue;
          }
          if (!isEmptyValue(attr)) {
            continue;
          }
          if (!this.hasInvalidStyle(attr)) {
            continue;
          }
          this.report(node, reportMessage(attr, this.options.style), attr.keyLocation);
        }
      });
    });
  }
};
function allowsEmpty(attr, rules) {
  const meta = rules[attr.key];
  return Boolean(meta == null ? void 0 : meta.omit);
}
function isEmptyValue(attr) {
  if (attr.isDynamic) {
    return false;
  }
  return attr.value === null || attr.value === "";
}
function parseStyle$1(style) {
  switch (style.toLowerCase()) {
    case "omit":
      return (attr) => attr.value !== null;
    case "empty":
      return (attr) => attr.value !== "";
    default:
      throw new Error(`Invalid style "${style}" for "attribute-empty-style" rule`);
  }
}
function reportMessage(attr, style) {
  const key = attr.key;
  switch (style.toLowerCase()) {
    case "omit":
      return `Attribute "${key}" should omit value`;
    case "empty":
      return `Attribute "${key}" value should be empty string`;
  }
  return "";
}
function ruleDescription(context) {
  const { tagName, attr, details } = context;
  return `The \`${attr}\` attribute cannot be used on \`${tagName}\` in this context: ${details}`;
}
var AttributeMisuse = class extends Rule {
  documentation(context) {
    return {
      description: ruleDescription(context),
      url: "https://html-validate.org/rules/attribute-misuse.html"
    };
  }
  setup() {
    this.on("element:ready", (event) => {
      const { target } = event;
      const { meta } = target;
      if (!meta) {
        return;
      }
      for (const attr of target.attributes) {
        const key = attr.key.toLowerCase();
        this.validateAttr(target, attr, meta.attributes[key]);
      }
    });
  }
  validateAttr(node, attr, meta) {
    if (!(meta == null ? void 0 : meta.allowed)) {
      return;
    }
    const details = meta.allowed(node._adapter, attr.value);
    if (details) {
      this.report({
        node,
        message: `"{{ attr }}" attribute cannot be used on {{ tagName }} in this context: {{ details }}`,
        location: attr.keyLocation,
        context: {
          tagName: node.annotatedName,
          attr: attr.key,
          details
        }
      });
    }
  }
};
function parsePattern(pattern) {
  switch (pattern) {
    case "kebabcase":
      return { regexp: /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, description: pattern };
    case "camelcase":
      return { regexp: /^[a-z][a-zA-Z0-9]*$/, description: pattern };
    case "snakecase":
    case "underscore":
      return { regexp: /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/, description: pattern };
    case "bem": {
      const block = "[a-z][a-z0-9]*(?:-[a-z0-9]+)*";
      const element = "(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?";
      const modifier = "(?:--[a-z0-9]+(?:-[a-z0-9]+)*){0,2}";
      return {
        regexp: new RegExp(`^${block}${element}${modifier}$`),
        description: pattern
      };
    }
    default: {
      const regexp2 = new RegExp(pattern);
      return { regexp: regexp2, description: regexp2.toString() };
    }
  }
}
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
var BasePatternRule = class extends Rule {
  /**
   * @param attr - Attribute holding the value.
   * @param options - Rule options with defaults expanded.
   */
  constructor(attr, options) {
    super(options);
    const { pattern } = this.options;
    this.attr = attr;
    this.patterns = toArray$1(pattern).map((it) => parsePattern(it));
  }
  static schema() {
    return {
      pattern: {
        oneOf: [{ type: "array", items: { type: "string" }, minItems: 1 }, { type: "string" }]
      }
    };
  }
  description(context) {
    const { attr, patterns } = this;
    const { value } = context;
    const lead = patterns.length === 1 ? `The \`${attr}\` attribute value \`"${value}"\` does not match the configured pattern.` : `The \`${attr}\` attribute value \`"${value}"\` does not match either of the configured patterns.`;
    return [
      lead,
      "For consistency within the codebase the `${attr}` is required to match one or more of the following patterns:",
      "",
      ...patterns.map((it) => `- \`${it.description}\``)
    ].join("\n");
  }
  validateValue(node, value, location) {
    const { attr, patterns } = this;
    const matches = patterns.some((it) => it.regexp.test(value));
    if (matches) {
      return;
    }
    const allowed = naturalJoin(patterns.map((it) => `"${it.description}"`));
    const message = patterns.length === 1 ? `${attr} "${value}" does not match the configured pattern ${allowed}` : `${attr} "${value}" does not match either of the configured patterns: ${allowed}`;
    this.report({
      node,
      message,
      location,
      context: {
        value
      }
    });
  }
};
var defaults$p = {
  pattern: "kebabcase"
};
var ClassPattern = class extends BasePatternRule {
  constructor(options) {
    super("class", { ...defaults$p, ...options });
  }
  static schema() {
    return BasePatternRule.schema();
  }
  documentation(context) {
    return {
      description: this.description(context),
      url: "https://html-validate.org/rules/class-pattern.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      const { target, key, value, valueLocation } = event;
      if (key.toLowerCase() !== "class") {
        return;
      }
      const classes = new DOMTokenList(value, valueLocation);
      for (const { item, location } of classes.iterator()) {
        this.validateValue(target, item, location);
      }
    });
  }
};
var CloseAttr = class extends Rule {
  documentation() {
    return {
      description: "HTML disallows end tags to have attributes.",
      url: "https://html-validate.org/rules/close-attr.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      if (!event.target) {
        return;
      }
      if (event.previous === event.target) {
        return;
      }
      const node = event.target;
      if (Object.keys(node.attributes).length > 0) {
        const first = node.attributes[0];
        this.report(null, "Close tags cannot have attributes", first.keyLocation);
      }
    });
  }
};
var CloseOrder = class extends Rule {
  documentation() {
    return {
      description: "HTML requires elements to be closed in the same order as they were opened.",
      url: "https://html-validate.org/rules/close-order.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const current = event.target;
      const active = event.previous;
      if (!current) {
        this.report(
          null,
          `Missing close-tag, expected '</${active.tagName}>' but document ended before it was found.`,
          event.location
        );
        return;
      }
      if (current.voidElement) {
        return;
      }
      if (active.closed === NodeClosed.ImplicitClosed) {
        return;
      }
      if (active.isRootElement()) {
        const location = {
          filename: current.location.filename,
          line: current.location.line,
          column: current.location.column,
          offset: current.location.offset,
          size: current.tagName.length + 1
        };
        this.report(null, "Unexpected close-tag, expected opening tag.", location);
        return;
      }
      if (current.tagName !== active.tagName) {
        this.report(
          null,
          `Mismatched close-tag, expected '</${active.tagName}>' but found '</${current.tagName}>'.`,
          current.location
        );
      }
    });
  }
};
var defaults$o = {
  include: null,
  exclude: null
};
var Deprecated = class extends Rule {
  constructor(options) {
    super({ ...defaults$o, ...options });
  }
  static schema() {
    return {
      exclude: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      },
      include: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      }
    };
  }
  documentation(context) {
    const text = [];
    if (context.source) {
      const source = prettySource(context.source);
      const message = `The \`<$tagname>\` element is deprecated ${source} and should not be used in new code.`;
      text.push(message);
    } else {
      const message = `The \`<$tagname>\` element is deprecated and should not be used in new code.`;
      text.push(message);
    }
    if (context.documentation) {
      text.push(context.documentation);
    }
    const doc = {
      description: text.map((cur) => cur.replace(/\$tagname/g, context.tagName)).join("\n\n"),
      url: "https://html-validate.org/rules/deprecated.html"
    };
    return doc;
  }
  setup() {
    this.on("tag:start", (event) => {
      const node = event.target;
      if (node.meta === null) {
        return;
      }
      const deprecated = node.meta.deprecated;
      if (!deprecated) {
        return;
      }
      if (this.isKeywordIgnored(node.tagName)) {
        return;
      }
      const location = sliceLocation(event.location, 1);
      if (typeof deprecated === "string") {
        this.reportString(deprecated, node, location);
      } else if (typeof deprecated === "boolean") {
        this.reportBoolean(node, location);
      } else {
        this.reportObject(deprecated, node, location);
      }
    });
  }
  reportString(deprecated, node, location) {
    const context = { tagName: node.tagName };
    const message = `<${node.tagName}> is deprecated: ${deprecated}`;
    this.report(node, message, location, context);
  }
  reportBoolean(node, location) {
    const context = { tagName: node.tagName };
    const message = `<${node.tagName}> is deprecated`;
    this.report(node, message, location, context);
  }
  reportObject(deprecated, node, location) {
    const context = { ...deprecated, tagName: node.tagName };
    const notice = deprecated.message ? `: ${deprecated.message}` : "";
    const message = `<${node.tagName}> is deprecated${notice}`;
    this.report(node, message, location, context);
  }
};
function prettySource(source) {
  const match = source.match(/html(\d)(\d)?/);
  if (match) {
    const [, ...parts] = match;
    const version2 = parts.filter(Boolean).join(".");
    return `in HTML ${version2}`;
  }
  switch (source) {
    case "whatwg":
      return "in HTML Living Standard";
    case "non-standard":
      return "and non-standard";
    default:
      return `by ${source}`;
  }
}
var DeprecatedRule = class extends Rule {
  documentation(context) {
    const preamble = context ? `The rule "${context}"` : "This rule";
    return {
      description: `${preamble} is deprecated and should not be used any longer, consult documentation for further information.`,
      url: "https://html-validate.org/rules/deprecated-rule.html"
    };
  }
  setup() {
    this.on("config:ready", (event) => {
      for (const rule of this.getDeprecatedRules(event)) {
        if (rule.getSeverity() > Severity.DISABLED) {
          this.report(null, `Usage of deprecated rule "${rule.name}"`, null, rule.name);
        }
      }
    });
  }
  getDeprecatedRules(event) {
    const rules = Object.values(event.rules);
    return rules.filter((rule) => rule.deprecated);
  }
};
var NoStyleTag$1 = class NoStyleTag extends Rule {
  documentation() {
    return {
      description: [
        'HTML5 documents should use the "html" doctype (short `form`, not legacy string):',
        "",
        "```html",
        "<!DOCTYPE html>",
        "```"
      ].join("\n"),
      url: "https://html-validate.org/rules/doctype-html.html"
    };
  }
  setup() {
    this.on("doctype", (event) => {
      const doctype = event.value.toLowerCase();
      if (doctype !== "html") {
        this.report(null, 'doctype should be "html"', event.valueLocation);
      }
    });
  }
};
var defaults$n = {
  style: "uppercase"
};
var DoctypeStyle = class extends Rule {
  constructor(options) {
    super({ ...defaults$n, ...options });
  }
  static schema() {
    return {
      style: {
        enum: ["lowercase", "uppercase"],
        type: "string"
      }
    };
  }
  documentation(context) {
    return {
      description: `While DOCTYPE is case-insensitive in the standard the current configuration requires it to be ${context.style}`,
      url: "https://html-validate.org/rules/doctype-style.html"
    };
  }
  setup() {
    this.on("doctype", (event) => {
      if (this.options.style === "uppercase" && event.tag !== "DOCTYPE") {
        this.report(null, "DOCTYPE should be uppercase", event.location, this.options);
      }
      if (this.options.style === "lowercase" && event.tag !== "doctype") {
        this.report(null, "DOCTYPE should be lowercase", event.location, this.options);
      }
    });
  }
};
var defaults$m = {
  style: "lowercase"
};
var ElementCase = class extends Rule {
  constructor(options) {
    super({ ...defaults$m, ...options });
    this.style = new CaseStyle(this.options.style, "element-case");
  }
  static schema() {
    const styleEnum = ["lowercase", "uppercase", "pascalcase", "camelcase"];
    return {
      style: {
        anyOf: [
          {
            enum: styleEnum,
            type: "string"
          },
          {
            items: {
              enum: styleEnum,
              type: "string"
            },
            type: "array"
          }
        ]
      }
    };
  }
  documentation() {
    const { style } = this.options;
    return {
      description: Array.isArray(style) ? [`Element tagname must be in one of:`, "", ...style.map((it) => `- ${it}`)].join("\n") : `Element tagname must be in ${style}.`,
      url: "https://html-validate.org/rules/element-case.html"
    };
  }
  setup() {
    this.on("tag:start", (event) => {
      const { target, location } = event;
      this.validateCase(target, location);
    });
    this.on("tag:end", (event) => {
      const { target, previous } = event;
      this.validateMatchingCase(previous, target);
    });
  }
  validateCase(target, targetLocation) {
    const letters = target.tagName.replace(/[^a-z]+/gi, "");
    if (!this.style.match(letters)) {
      const location = sliceLocation(targetLocation, 1);
      this.report(target, `Element "${target.tagName}" should be ${this.style.name}`, location);
    }
  }
  validateMatchingCase(start, end) {
    if (!start || !end || !start.tagName || !end.tagName) {
      return;
    }
    if (start.tagName.toLowerCase() !== end.tagName.toLowerCase()) {
      return;
    }
    if (start.tagName !== end.tagName) {
      this.report(start, "Start and end tag must not differ in casing", end.location);
    }
  }
};
var defaults$l = {
  pattern: "^[a-z][a-z0-9\\-._]*-[a-z0-9\\-._]*$",
  whitelist: [],
  blacklist: []
};
var ElementName = class extends Rule {
  constructor(options) {
    super({ ...defaults$l, ...options });
    this.pattern = new RegExp(this.options.pattern);
  }
  static schema() {
    return {
      blacklist: {
        items: {
          type: "string"
        },
        type: "array"
      },
      pattern: {
        type: "string"
      },
      whitelist: {
        items: {
          type: "string"
        },
        type: "array"
      }
    };
  }
  documentation(context) {
    return {
      description: this.documentationMessages(context).join("\n"),
      url: "https://html-validate.org/rules/element-name.html"
    };
  }
  documentationMessages(context) {
    if (context.blacklist.includes(context.tagName)) {
      return [
        `<${context.tagName}> is blacklisted by the project configuration.`,
        "",
        "The following names are blacklisted:",
        ...context.blacklist.map((cur) => `- ${cur}`)
      ];
    }
    if (context.pattern !== defaults$l.pattern) {
      return [
        `<${context.tagName}> is not a valid element name. This project is configured to only allow names matching the following regular expression:`,
        "",
        `- \`${context.pattern}\``
      ];
    }
    return [
      `<${context.tagName}> is not a valid element name. If this is a custom element HTML requires the name to follow these rules:`,
      "",
      "- The name must begin with `a-z`",
      "- The name must include a hyphen `-`",
      "- It may include alphanumerical characters `a-z0-9` or hyphens `-`, dots `.` or underscores `_`."
    ];
  }
  setup() {
    const xmlns2 = /^(.+):.+$/;
    this.on("tag:start", (event) => {
      const target = event.target;
      const tagName = target.tagName;
      const location = sliceLocation(event.location, 1);
      const context = {
        tagName,
        pattern: this.options.pattern,
        blacklist: this.options.blacklist
      };
      if (this.options.blacklist.includes(tagName)) {
        this.report(target, `<${tagName}> element is blacklisted`, location, context);
      }
      if (target.meta) {
        return;
      }
      if (tagName.match(xmlns2)) {
        return;
      }
      if (this.options.whitelist.includes(tagName)) {
        return;
      }
      if (!tagName.match(this.pattern)) {
        this.report(target, `<${tagName}> is not a valid element name`, location, context);
      }
    });
  }
};
function getTransparentChildren(node, transparent) {
  if (typeof transparent === "boolean") {
    return node.childElements;
  } else {
    return node.childElements.filter((it) => {
      return transparent.some((category) => {
        return Validator.validatePermittedCategory(it, category, false);
      });
    });
  }
}
function getRuleDescription$2(context) {
  switch (context.kind) {
    case "content":
      return [
        `The \`${context.child}\` element is not permitted as content under the parent \`${context.parent}\` element.`
      ];
    case "descendant":
      return [
        `The \`${context.child}\` element is not permitted as a descendant of the \`${context.ancestor}\` element.`
      ];
  }
}
var ElementPermittedContent = class extends Rule {
  documentation(context) {
    return {
      description: getRuleDescription$2(context).join("\n"),
      url: "https://html-validate.org/rules/element-permitted-content.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      doc.visitDepthFirst((node) => {
        const parent = node.parent;
        if (!parent) {
          return;
        }
        [
          () => this.validatePermittedContent(node, parent),
          () => this.validatePermittedDescendant(node, parent)
        ].some((fn) => fn());
      });
    });
  }
  validatePermittedContent(cur, parent) {
    if (!parent.meta) {
      return false;
    }
    const rules = parent.meta.permittedContent ?? null;
    return this.validatePermittedContentImpl(cur, parent, rules);
  }
  validatePermittedContentImpl(cur, parent, rules) {
    if (!Validator.validatePermitted(cur, rules)) {
      const child = `<${cur.tagName}>`;
      const message = `${child} element is not permitted as content under ${parent.annotatedName}`;
      const context = {
        kind: "content",
        parent: parent.annotatedName,
        child
      };
      this.report(cur, message, null, context);
      return true;
    }
    if (cur.meta && cur.meta.transparent) {
      const children = getTransparentChildren(cur, cur.meta.transparent);
      return children.map((child) => {
        return this.validatePermittedContentImpl(child, parent, rules);
      }).some(Boolean);
    }
    return false;
  }
  validatePermittedDescendant(node, parent) {
    for (let cur = parent; cur && !cur.isRootElement(); cur = /* istanbul ignore next */
    (cur == null ? void 0 : cur.parent) ?? null) {
      const meta = cur.meta;
      if (!meta) {
        continue;
      }
      const rules = meta.permittedDescendants;
      if (!rules) {
        continue;
      }
      if (Validator.validatePermitted(node, rules)) {
        continue;
      }
      const child = `<${node.tagName}>`;
      const ancestor = cur.annotatedName;
      const message = `${child} element is not permitted as a descendant of ${ancestor}`;
      const context = {
        kind: "descendant",
        ancestor,
        child
      };
      this.report(node, message, null, context);
      return true;
    }
    return false;
  }
};
var ElementPermittedOccurrences = class extends Rule {
  documentation() {
    return {
      description: "Some elements may only be used a fixed amount of times in given context.",
      url: "https://html-validate.org/rules/element-permitted-occurrences.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      doc.visitDepthFirst((node) => {
        if (!node.meta) {
          return;
        }
        const rules = node.meta.permittedContent;
        if (!rules) {
          return;
        }
        Validator.validateOccurrences(
          node.childElements,
          rules,
          (child, category) => {
            this.report(
              child,
              `Element <${category}> can only appear once under ${node.annotatedName}`
            );
          }
        );
      });
    });
  }
};
var ElementPermittedOrder = class extends Rule {
  documentation() {
    return {
      description: "Some elements has a specific order the children must use.",
      url: "https://html-validate.org/rules/element-permitted-order.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      doc.visitDepthFirst((node) => {
        if (!node.meta) {
          return;
        }
        const rules = node.meta.permittedOrder;
        if (!rules) {
          return;
        }
        Validator.validateOrder(
          node.childElements,
          rules,
          (child, prev) => {
            this.report(
              child,
              `Element <${child.tagName}> must be used before <${prev.tagName}> in this context`
            );
          }
        );
      });
    });
  }
};
function isCategoryOrTag(value) {
  return typeof value === "string";
}
function isCategory$1(value) {
  return value.startsWith("@");
}
function formatCategoryOrTag(value) {
  return isCategory$1(value) ? value.slice(1) : `<${value}>`;
}
function isFormattable(rules) {
  return rules.length > 0 && rules.every(isCategoryOrTag);
}
function getRuleDescription$1(context) {
  const { child, parent, rules } = context;
  const preamble = `The \`${child}\` element cannot have a \`${parent}\` element as parent.`;
  if (isFormattable(rules)) {
    const allowed = rules.filter(isCategoryOrTag).map((it) => {
      if (isCategory$1(it)) {
        return `- any ${it.slice(1)} element`;
      } else {
        return `- \`<${it}>\``;
      }
    });
    return [preamble, "", "Allowed parents one of:", "", ...allowed];
  } else {
    return [preamble];
  }
}
function formatMessage$1(node, parent, rules) {
  const nodeName = node.annotatedName;
  const parentName = parent.annotatedName;
  if (!isFormattable(rules)) {
    return `${nodeName} element cannot have ${parentName} element as parent`;
  }
  const allowed = naturalJoin(rules.filter(isCategoryOrTag).map(formatCategoryOrTag));
  return `${nodeName} element requires a ${allowed} element as parent`;
}
var ElementPermittedParent = class extends Rule {
  documentation(context) {
    return {
      description: getRuleDescription$1(context).join("\n"),
      url: "https://html-validate.org/rules/element-permitted-parent.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      doc.visitDepthFirst((node) => {
        var _a2;
        const parent = node.parent;
        if (!parent) {
          return;
        }
        if (parent.isRootElement()) {
          return;
        }
        if (parent.tagName === node.tagName) {
          return;
        }
        const rules = (_a2 = node.meta) == null ? void 0 : _a2.permittedParent;
        if (!rules) {
          return false;
        }
        if (Validator.validatePermitted(parent, rules)) {
          return;
        }
        const message = formatMessage$1(node, parent, rules);
        const context = {
          parent: parent.annotatedName,
          child: node.annotatedName,
          rules
        };
        this.report(node, message, null, context);
      });
    });
  }
};
function isTagnameOnly(value) {
  return Boolean(value.match(/^[a-zA-Z0-9-]+$/));
}
function getRuleDescription(context) {
  const escaped = context.ancestor.map((it) => `\`${it}\``);
  return [`The \`${context.child}\` element requires a ${naturalJoin(escaped)} ancestor.`];
}
var ElementRequiredAncestor = class extends Rule {
  documentation(context) {
    return {
      description: getRuleDescription(context).join("\n"),
      url: "https://html-validate.org/rules/element-required-ancestor.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      doc.visitDepthFirst((node) => {
        const parent = node.parent;
        if (!parent) {
          return;
        }
        this.validateRequiredAncestors(node);
      });
    });
  }
  validateRequiredAncestors(node) {
    if (!node.meta) {
      return;
    }
    const rules = node.meta.requiredAncestors;
    if (!rules) {
      return;
    }
    if (Validator.validateAncestors(node, rules)) {
      return;
    }
    const ancestor = rules.map((it) => isTagnameOnly(it) ? `<${it}>` : `"${it}"`);
    const child = `<${node.tagName}>`;
    const message = `<${node.tagName}> element requires a ${naturalJoin(ancestor)} ancestor`;
    const context = {
      ancestor,
      child
    };
    this.report(node, message, null, context);
  }
};
var ElementRequiredAttributes = class extends Rule {
  documentation(context) {
    const docs = {
      description: "Element is missing a required attribute",
      url: "https://html-validate.org/rules/element-required-attributes.html"
    };
    if (context) {
      docs.description = `The <${context.element}> element is required to have a "${context.attribute}" attribute.`;
    }
    return docs;
  }
  setup() {
    this.on("tag:end", (event) => {
      const node = event.previous;
      const meta = node.meta;
      if (!(meta == null ? void 0 : meta.attributes)) {
        return;
      }
      for (const [key, attr] of Object.entries(meta.attributes)) {
        if (!attr.required) {
          continue;
        }
        if (node.hasAttribute(key))
          continue;
        const context = {
          element: node.tagName,
          attribute: key
        };
        this.report(
          node,
          `${node.annotatedName} is missing required "${key}" attribute`,
          node.location,
          context
        );
      }
    });
  }
};
function isCategory(value) {
  return value.startsWith("@");
}
var ElementRequiredContent = class extends Rule {
  documentation(context) {
    const { element, missing } = context;
    return {
      description: `The \`${element}\` element requires a \`${missing}\` to be present as content.`,
      url: "https://html-validate.org/rules/element-required-content.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      doc.visitDepthFirst((node) => {
        if (!node.meta) {
          return;
        }
        const rules = node.meta.requiredContent;
        if (!rules) {
          return;
        }
        for (const missing of Validator.validateRequiredContent(node, rules)) {
          const context = {
            element: node.annotatedName,
            missing: `<${missing}>`
          };
          const tag = isCategory(missing) ? `${missing.slice(1)} element` : `<${missing}>`;
          const message = `${node.annotatedName} element must have ${tag} as content`;
          this.report(node, message, null, context);
        }
      });
    });
  }
};
var selector = ["h1", "h2", "h3", "h4", "h5", "h6"].join(",");
function hasImgAltText$1(node) {
  if (node.is("img")) {
    return hasAltText(node);
  } else if (node.is("svg")) {
    return node.textContent.trim() !== "";
  }
  return false;
}
var EmptyHeading = class extends Rule {
  documentation() {
    return {
      description: `Assistive technology such as screen readers require textual content in headings. Whitespace only is considered empty.`,
      url: "https://html-validate.org/rules/empty-heading.html"
    };
  }
  setup() {
    this.on("dom:ready", ({ document: document2 }) => {
      const headings = document2.querySelectorAll(selector);
      for (const heading of headings) {
        this.validateHeading(heading);
      }
    });
  }
  validateHeading(heading) {
    const images = heading.querySelectorAll("img, svg");
    for (const child of images) {
      if (hasImgAltText$1(child)) {
        return;
      }
    }
    switch (classifyNodeText(heading, { ignoreHiddenRoot: true })) {
      case TextClassification.DYNAMIC_TEXT:
      case TextClassification.STATIC_TEXT:
        break;
      case TextClassification.EMPTY_TEXT:
        this.report(heading, `<${heading.tagName}> cannot be empty, must have text content`);
        break;
    }
  }
};
var EmptyTitle = class extends Rule {
  documentation() {
    return {
      description: [
        "The `<title>` element cannot be empty, it must have textual content.",
        "",
        "It is used to describe the document and is shown in the browser tab and titlebar.",
        "WCAG and SEO requires a descriptive title and preferably unique within the site.",
        "",
        "Whitespace is ignored."
      ].join("\n"),
      url: "https://html-validate.org/rules/empty-title.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const node = event.previous;
      if (node.tagName !== "title")
        return;
      switch (classifyNodeText(node)) {
        case TextClassification.DYNAMIC_TEXT:
        case TextClassification.STATIC_TEXT:
          break;
        case TextClassification.EMPTY_TEXT:
          {
            const message = `<${node.tagName}> cannot be empty, must have text content`;
            this.report(node, message, node.location);
          }
          break;
      }
    });
  }
};
var defaults$k = {
  allowArrayBrackets: true,
  shared: ["radio", "button", "reset", "submit"]
};
var UNIQUE_CACHE_KEY = Symbol("form-elements-unique");
var SHARED_CACHE_KEY = Symbol("form-elements-shared");
function haveName(name) {
  return typeof name === "string" && name !== "";
}
function allowSharedName(node, shared) {
  const type2 = node.getAttribute("type");
  return Boolean(type2 && type2.valueMatches(shared, false));
}
function getDocumentation(context) {
  const trailer = "Each form control must have a unique name.";
  const { name } = context;
  switch (context.kind) {
    case "duplicate":
      return [`Duplicate form control name "${name}"`, trailer].join("\n");
    case "mix":
      return [
        `Form control name cannot mix regular name "{{ name }}" with array brackets "{{ name }}[]"`,
        trailer
      ].join("\n");
  }
}
var FormDupName = class extends Rule {
  constructor(options) {
    super({ ...defaults$k, ...options });
  }
  static schema() {
    return {
      allowArrayBrackets: {
        type: "boolean"
      },
      shared: {
        type: "array",
        items: {
          enum: ["radio", "checkbox", "submit", "button", "reset"]
        }
      }
    };
  }
  documentation(context) {
    return {
      description: getDocumentation(context),
      url: "https://html-validate.org/rules/form-dup-name.html"
    };
  }
  setup() {
    const selector2 = this.getSelector();
    const { shared } = this.options;
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const controls = document2.querySelectorAll(selector2);
      const [sharedControls, uniqueControls] = partition(controls, (it) => {
        return allowSharedName(it, shared);
      });
      for (const control of uniqueControls) {
        const attr = control.getAttribute("name");
        const name = attr == null ? void 0 : attr.value;
        if (!attr || !haveName(name)) {
          continue;
        }
        const group = control.closest("form, template") ?? document2.root;
        this.validateUniqueName(control, group, attr, name);
      }
      for (const control of sharedControls) {
        const attr = control.getAttribute("name");
        const name = attr == null ? void 0 : attr.value;
        if (!attr || !haveName(name)) {
          continue;
        }
        const group = control.closest("form, template") ?? document2.root;
        this.validateSharedName(control, group, attr, name);
      }
    });
  }
  validateUniqueName(control, group, attr, name) {
    const elements = this.getUniqueElements(group);
    const { allowArrayBrackets } = this.options;
    if (allowArrayBrackets) {
      const isarray = name.endsWith("[]");
      const basename = isarray ? name.slice(0, -2) : name;
      const details = elements.get(basename);
      if (details && details.array !== isarray) {
        const context = {
          name: basename,
          kind: "mix"
        };
        this.report({
          node: control,
          location: attr.valueLocation,
          message: 'Cannot mix "{{ name }}[]" and "{{ name }}"',
          context
        });
        return;
      }
      if (!details && isarray) {
        elements.set(basename, {
          array: true
        });
      }
      if (isarray) {
        return;
      }
    }
    if (elements.has(name)) {
      const context = {
        name,
        kind: "duplicate"
      };
      this.report({
        node: control,
        location: attr.valueLocation,
        message: 'Duplicate form control name "{{ name }}"',
        context
      });
    } else {
      elements.set(name, {
        array: false
      });
    }
  }
  validateSharedName(control, group, attr, name) {
    const uniqueElements = this.getUniqueElements(group);
    const sharedElements = this.getSharedElements(group);
    const type2 = control.getAttributeValue("type") ?? "";
    if (uniqueElements.has(name) || sharedElements.has(name) && sharedElements.get(name) !== type2) {
      const context = {
        name,
        kind: "duplicate"
      };
      this.report({
        node: control,
        location: attr.valueLocation,
        message: 'Duplicate form control name "{{ name }}"',
        context
      });
    }
    sharedElements.set(name, type2);
  }
  getSelector() {
    const tags = this.getTagsWithProperty("formAssociated").filter((it) => {
      return this.isListedElement(it);
    });
    return tags.join(", ");
  }
  isListedElement(tagName) {
    const meta = this.getMetaFor(tagName);
    if (!(meta == null ? void 0 : meta.formAssociated)) {
      return false;
    }
    return meta.formAssociated.listed;
  }
  getUniqueElements(group) {
    const existing = group.cacheGet(UNIQUE_CACHE_KEY);
    if (existing) {
      return existing;
    } else {
      const elements = /* @__PURE__ */ new Map();
      group.cacheSet(UNIQUE_CACHE_KEY, elements);
      return elements;
    }
  }
  getSharedElements(group) {
    const existing = group.cacheGet(SHARED_CACHE_KEY);
    if (existing) {
      return existing;
    } else {
      const elements = /* @__PURE__ */ new Map();
      group.cacheSet(SHARED_CACHE_KEY, elements);
      return elements;
    }
  }
};
var defaults$j = {
  allowMultipleH1: false,
  minInitialRank: "h1",
  sectioningRoots: ["dialog", '[role="dialog"]', '[role="alertdialog"]']
};
function isRelevant$6(event) {
  const node = event.target;
  return Boolean(node.meta && node.meta.heading);
}
function extractLevel(node) {
  const match = node.tagName.match(/^[hH](\d)$/);
  if (match) {
    return parseInt(match[1], 10);
  } else {
    return null;
  }
}
function parseMaxInitial(value) {
  if (value === false || value === "any") {
    return 6;
  }
  const match = value.match(/^h(\d)$/);
  if (!match) {
    return 1;
  }
  return parseInt(match[1], 10);
}
var HeadingLevel = class extends Rule {
  constructor(options) {
    super({ ...defaults$j, ...options });
    this.stack = [];
    this.minInitialRank = parseMaxInitial(this.options.minInitialRank);
    this.sectionRoots = this.options.sectioningRoots.map((it) => new Pattern(it));
    this.stack.push({
      node: null,
      current: 0,
      h1Count: 0
    });
  }
  static schema() {
    return {
      allowMultipleH1: {
        type: "boolean"
      },
      minInitialRank: {
        enum: ["h1", "h2", "h3", "h4", "h5", "h6", "any", false]
      },
      sectioningRoots: {
        items: {
          type: "string"
        },
        type: "array"
      }
    };
  }
  documentation() {
    const text = [];
    const modality = this.minInitialRank > 1 ? "should" : "must";
    text.push(`Headings ${modality} start at <h1> and can only increase one level at a time.`);
    text.push("The headings should form a table of contents and make sense on its own.");
    if (!this.options.allowMultipleH1) {
      text.push("");
      text.push(
        "Under the current configuration only a single <h1> can be present at a time in the document."
      );
    }
    return {
      description: text.join("\n"),
      url: "https://html-validate.org/rules/heading-level.html"
    };
  }
  setup() {
    this.on("tag:start", isRelevant$6, (event) => {
      this.onTagStart(event);
    });
    this.on("tag:ready", (event) => {
      this.onTagReady(event);
    });
    this.on("tag:close", (event) => {
      this.onTagClose(event);
    });
  }
  onTagStart(event) {
    const level = extractLevel(event.target);
    if (!level)
      return;
    const root = this.getCurrentRoot();
    if (!this.options.allowMultipleH1 && level === 1) {
      if (root.h1Count >= 1) {
        const location = sliceLocation(event.location, 1);
        this.report(event.target, `Multiple <h1> are not allowed`, location);
        return;
      }
      root.h1Count++;
    }
    if (level <= root.current) {
      root.current = level;
      return;
    }
    this.checkLevelIncrementation(root, event, level);
    root.current = level;
  }
  /**
   * Validate heading level was only incremented by one.
   */
  checkLevelIncrementation(root, event, level) {
    const expected = root.current + 1;
    if (level === expected) {
      return;
    }
    const isInitial = this.stack.length === 1 && expected === 1;
    if (isInitial && level <= this.minInitialRank) {
      return;
    }
    const location = sliceLocation(event.location, 1);
    if (root.current > 0) {
      const expectedTag = `<h${String(expected)}>`;
      const actualTag = `<h${String(level)}>`;
      const msg = `Heading level can only increase by one, expected ${expectedTag} but got ${actualTag}`;
      this.report(event.target, msg, location);
    } else {
      this.checkInitialLevel(event, location, level, expected);
    }
  }
  checkInitialLevel(event, location, level, expected) {
    const expectedTag = `<h${String(expected)}>`;
    const actualTag = `<h${String(level)}>`;
    if (this.stack.length === 1) {
      const msg = this.minInitialRank > 1 ? `Initial heading level must be <h${String(this.minInitialRank)}> or higher rank but got ${actualTag}` : `Initial heading level must be ${expectedTag} but got ${actualTag}`;
      this.report(event.target, msg, location);
    } else {
      const prevRoot = this.getPrevRoot();
      const prevRootExpected = prevRoot.current + 1;
      if (level > prevRootExpected) {
        if (expected === prevRootExpected) {
          const msg = `Initial heading level for sectioning root must be ${expectedTag} but got ${actualTag}`;
          this.report(event.target, msg, location);
        } else {
          const msg = `Initial heading level for sectioning root must be between ${expectedTag} and <h${String(prevRootExpected)}> but got ${actualTag}`;
          this.report(event.target, msg, location);
        }
      }
    }
  }
  /**
   * Check if the current element is a sectioning root and push a new root entry
   * on the stack if it is.
   */
  onTagReady(event) {
    const { target } = event;
    if (this.isSectioningRoot(target)) {
      this.stack.push({
        node: target.unique,
        current: 0,
        h1Count: 0
      });
    }
  }
  /**
   * Check if the current element being closed is the element which opened the
   * current sectioning root, in which case the entry is popped from the stack.
   */
  onTagClose(event) {
    const { previous: target } = event;
    const root = this.getCurrentRoot();
    if (target.unique !== root.node) {
      return;
    }
    this.stack.pop();
  }
  getPrevRoot() {
    return this.stack[this.stack.length - 2];
  }
  getCurrentRoot() {
    return this.stack[this.stack.length - 1];
  }
  isSectioningRoot(node) {
    const context = {
      scope: node
    };
    return this.sectionRoots.some((it) => it.match(node, context));
  }
};
var FOCUSABLE_CACHE = Symbol(isFocusable.name);
function isDisabled(element, meta) {
  var _a2;
  if (!((_a2 = meta.formAssociated) == null ? void 0 : _a2.disablable)) {
    return false;
  }
  const disabled = element.matches("[disabled]");
  if (disabled) {
    return true;
  }
  const fieldset = element.closest("fieldset[disabled]");
  if (fieldset) {
    return true;
  }
  return false;
}
function isFocusableImpl(element) {
  if (isHTMLHidden(element) || isInert(element) || isStyleHidden(element)) {
    return false;
  }
  const { tabIndex, meta } = element;
  if (tabIndex !== null) {
    return tabIndex >= 0;
  }
  if (!meta) {
    return false;
  }
  if (isDisabled(element, meta)) {
    return false;
  }
  return Boolean(meta == null ? void 0 : meta.focusable);
}
function isFocusable(element) {
  const cached = element.cacheGet(FOCUSABLE_CACHE);
  if (cached) {
    return cached;
  }
  return element.cacheSet(FOCUSABLE_CACHE, isFocusableImpl(element));
}
var HiddenFocusable = class extends Rule {
  documentation(context) {
    const byParent = context === "parent" ? " In this case it is being hidden by an ancestor with `aria-hidden.`" : "";
    return {
      description: [
        `\`aria-hidden\` cannot be used on focusable elements.${byParent}`,
        "",
        "When focusable elements are hidden with `aria-hidden` they are still reachable using conventional means such as a mouse or keyboard but won't be exposed to assistive technology (AT).",
        "This is often confusing for users of AT such as screenreaders.",
        "",
        "To fix this either:",
        "  - Remove `aria-hidden`.",
        "  - Remove the element from the DOM instead.",
        '  - Use `tabindex="-1"` to remove the element from tab order.',
        "  - Use `hidden`, `inert` or similar means to hide or disable the element."
      ].join("\n"),
      url: "https://html-validate.org/rules/hidden-focusable.html"
    };
  }
  setup() {
    const focusable = this.getTagsWithProperty("focusable");
    const selector2 = ["[tabindex]", ...focusable].join(",");
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      for (const element of document2.querySelectorAll(selector2)) {
        if (isFocusable(element) && isAriaHidden(element)) {
          this.reportElement(element);
        }
      }
    });
  }
  reportElement(element) {
    const attribute = element.getAttribute("aria-hidden");
    const message = attribute ? `aria-hidden cannot be used on focusable elements` : `aria-hidden cannot be used on focusable elements (hidden by ancestor element)`;
    const location = attribute ? attribute.keyLocation : element.location;
    const context = attribute ? "self" : "parent";
    this.report({
      node: element,
      message,
      location,
      context
    });
  }
};
var defaults$i = {
  pattern: "kebabcase"
};
var IdPattern = class extends BasePatternRule {
  constructor(options) {
    super("id", { ...defaults$i, ...options });
  }
  static schema() {
    return BasePatternRule.schema();
  }
  documentation(context) {
    return {
      description: this.description(context),
      url: "https://html-validate.org/rules/id-pattern.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      const { target, key, value, valueLocation } = event;
      if (key.toLowerCase() !== "id") {
        return;
      }
      if (value instanceof DynamicValue) {
        return;
      }
      if (value === null) {
        return;
      }
      this.validateValue(target, value, valueLocation);
    });
  }
};
var restricted = /* @__PURE__ */ new Map([
  ["accept", ["file"]],
  ["alt", ["image"]],
  ["capture", ["file"]],
  ["checked", ["checkbox", "radio"]],
  ["dirname", ["text", "search"]],
  ["height", ["image"]],
  [
    "list",
    [
      "text",
      "search",
      "url",
      "tel",
      "email",
      "date",
      "month",
      "week",
      "time",
      "datetime-local",
      "number",
      "range",
      "color"
    ]
  ],
  ["max", ["date", "month", "week", "time", "datetime-local", "number", "range"]],
  ["maxlength", ["text", "search", "url", "tel", "email", "password"]],
  ["min", ["date", "month", "week", "time", "datetime-local", "number", "range"]],
  ["minlength", ["text", "search", "url", "tel", "email", "password"]],
  ["multiple", ["email", "file"]],
  ["pattern", ["text", "search", "url", "tel", "email", "password"]],
  ["placeholder", ["text", "search", "url", "tel", "email", "password", "number"]],
  [
    "readonly",
    [
      "text",
      "search",
      "url",
      "tel",
      "email",
      "password",
      "date",
      "month",
      "week",
      "time",
      "datetime-local",
      "number"
    ]
  ],
  [
    "required",
    [
      "text",
      "search",
      "url",
      "tel",
      "email",
      "password",
      "date",
      "month",
      "week",
      "time",
      "datetime-local",
      "number",
      "checkbox",
      "radio",
      "file"
    ]
  ],
  ["size", ["text", "search", "url", "tel", "email", "password"]],
  ["src", ["image"]],
  ["step", ["date", "month", "week", "time", "datetime-local", "number", "range"]],
  ["width", ["image"]]
]);
function isInput(event) {
  const { target } = event;
  return target.is("input");
}
var InputAttributes = class extends Rule {
  documentation(context) {
    var _a2;
    const { attribute, type: type2 } = context;
    const summary = `Attribute \`${attribute}\` is not allowed on \`<input type="${type2}">\`
`;
    const details = `\`${attribute}\` can only be used when \`type\` is:`;
    const list = ((_a2 = restricted.get(attribute)) == null ? void 0 : _a2.map((it) => `- \`${it}\``)) ?? [];
    return {
      description: [summary, details, ...list].join("\n"),
      url: "https://html-validate.org/rules/input-attributes.html"
    };
  }
  setup() {
    this.on("tag:ready", isInput, (event) => {
      const { target } = event;
      const type2 = target.getAttribute("type");
      if (!type2 || type2.isDynamic || !type2.value) {
        return;
      }
      const typeValue = type2.value.toString();
      for (const attr of target.attributes) {
        const validTypes = restricted.get(attr.key);
        if (!validTypes) {
          continue;
        }
        if (validTypes.includes(typeValue)) {
          continue;
        }
        const context = {
          attribute: attr.key,
          type: typeValue
        };
        const message = `Attribute "${attr.key}" is not allowed on <input type="${typeValue}">`;
        this.report(target, message, attr.keyLocation, context);
      }
    });
  }
};
var HAS_ACCESSIBLE_TEXT_CACHE = Symbol(hasAccessibleName.name);
function isHidden(node, context) {
  const { reference } = context;
  if (reference && reference.isSameNode(node)) {
    return false;
  } else {
    return !inAccessibilityTree(node);
  }
}
function hasImgAltText(node, context) {
  if (node.is("img")) {
    return hasAltText(node);
  } else if (node.is("svg")) {
    return node.textContent.trim() !== "";
  } else {
    for (const img of node.querySelectorAll("img, svg")) {
      const hasName = hasAccessibleNameImpl(img, context);
      if (hasName) {
        return true;
      }
    }
    return false;
  }
}
function hasLabel(node) {
  const value = node.getAttributeValue("aria-label") ?? "";
  return Boolean(value.trim());
}
function isLabelledby(node, context) {
  const { document: document2, reference } = context;
  if (reference) {
    return false;
  }
  const ariaLabelledby = node.ariaLabelledby;
  if (ariaLabelledby instanceof DynamicValue) {
    return true;
  }
  if (ariaLabelledby === null) {
    return false;
  }
  return ariaLabelledby.some((id) => {
    const selector2 = generateIdSelector(id);
    return document2.querySelectorAll(selector2).some((child) => {
      return hasAccessibleNameImpl(child, {
        document: document2,
        reference: child
      });
    });
  });
}
function hasAccessibleNameImpl(current, context) {
  const { reference } = context;
  if (isHidden(current, context)) {
    return false;
  }
  const ignoreHiddenRoot = Boolean(reference && reference.isSameNode(current));
  const text = classifyNodeText(current, { accessible: true, ignoreHiddenRoot });
  if (text !== TextClassification.EMPTY_TEXT) {
    return true;
  }
  if (hasImgAltText(current, context)) {
    return true;
  }
  if (hasLabel(current)) {
    return true;
  }
  if (isLabelledby(current, context)) {
    return true;
  }
  return false;
}
function hasAccessibleName(document2, current) {
  if (current.cacheExists(HAS_ACCESSIBLE_TEXT_CACHE)) {
    return Boolean(current.cacheGet(HAS_ACCESSIBLE_TEXT_CACHE));
  }
  const result = hasAccessibleNameImpl(current, {
    document: document2,
    reference: null
  });
  return current.cacheSet(HAS_ACCESSIBLE_TEXT_CACHE, result);
}
function isIgnored(node) {
  var _a2;
  if (node.is("input")) {
    const type2 = (_a2 = node.getAttributeValue("type")) == null ? void 0 : _a2.toLowerCase();
    const ignored = ["hidden", "submit", "reset", "button"];
    return Boolean(type2 && ignored.includes(type2));
  }
  return false;
}
var InputMissingLabel = class extends Rule {
  documentation() {
    return {
      description: [
        "Each form element must have an a label or accessible name.",
        'Typically this is implemented using a `<label for="..">` element describing the purpose of the form element.',
        "",
        "This can be resolved in one of the following ways:",
        "",
        '  - Use an associated `<label for="..">` element.',
        "  - Use a nested `<label>` as parent element.",
        "  - Use `aria-label` or `aria-labelledby` attributes."
      ].join("\n"),
      url: "https://html-validate.org/rules/input-missing-label.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const root = event.document;
      for (const elem of root.querySelectorAll("input, textarea, select")) {
        this.validateInput(root, elem);
      }
    });
  }
  validateInput(root, elem) {
    if (!inAccessibilityTree(elem)) {
      return;
    }
    if (isIgnored(elem)) {
      return;
    }
    if (hasAccessibleName(root, elem)) {
      return;
    }
    let label = [];
    if ((label = findLabelById(root, elem.id)).length > 0) {
      this.validateLabel(root, elem, label);
      return;
    }
    if ((label = findLabelByParent(elem)).length > 0) {
      this.validateLabel(root, elem, label);
      return;
    }
    if (elem.hasAttribute("aria-label")) {
      this.report(elem, `<${elem.tagName}> element has aria-label but label has no text`);
    } else if (elem.hasAttribute("aria-labelledby")) {
      this.report(
        elem,
        `<${elem.tagName}> element has aria-labelledby but referenced element has no text`
      );
    } else {
      this.report(elem, `<${elem.tagName}> element does not have a <label>`);
    }
  }
  /**
   * Reports error if none of the labels are accessible.
   */
  validateLabel(root, elem, labels) {
    const visible = labels.filter(inAccessibilityTree);
    if (visible.length === 0) {
      this.report(elem, `<${elem.tagName}> element has <label> but <label> element is hidden`);
      return;
    }
    if (!labels.some((label) => hasAccessibleName(root, label))) {
      this.report(elem, `<${elem.tagName}> element has <label> but <label> has no text`);
    }
  }
};
function findLabelById(root, id) {
  if (!id)
    return [];
  return root.querySelectorAll(`label[for="${id}"]`);
}
function findLabelByParent(el) {
  let cur = el.parent;
  while (cur) {
    if (cur.is("label")) {
      return [cur];
    }
    cur = cur.parent;
  }
  return [];
}
var defaults$h = {
  maxlength: 70
};
var LongTitle = class extends Rule {
  constructor(options) {
    super({ ...defaults$h, ...options });
    this.maxlength = this.options.maxlength;
  }
  static schema() {
    return {
      maxlength: {
        type: "number"
      }
    };
  }
  documentation() {
    return {
      description: `Search engines truncates titles with long text, possibly down-ranking the page in the process.`,
      url: "https://html-validate.org/rules/long-title.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const node = event.previous;
      if (node.tagName !== "title")
        return;
      const text = node.textContent;
      if (text.length > this.maxlength) {
        this.report(node, `title text cannot be longer than ${String(this.maxlength)} characters`);
      }
    });
  }
};
var defaults$g = {
  allowLongDelay: false
};
var MetaRefresh = class extends Rule {
  constructor(options) {
    super({ ...defaults$g, ...options });
  }
  documentation() {
    return {
      description: `Meta refresh directive must use the \`0;url=...\` format. Non-zero values for time interval is disallowed as people with assistive technology might be unable to read and understand the page content before automatically reloading. For the same reason skipping the url is disallowed as it would put the browser in an infinite loop reloading the same page over and over again.`,
      url: "https://html-validate.org/rules/meta-refresh.html"
    };
  }
  setup() {
    this.on("element:ready", ({ target }) => {
      if (!target.is("meta")) {
        return;
      }
      const httpEquiv = target.getAttributeValue("http-equiv");
      if (httpEquiv !== "refresh") {
        return;
      }
      const content = target.getAttribute("content");
      if (!(content == null ? void 0 : content.value) || content.isDynamic) {
        return;
      }
      const location = content.valueLocation;
      const value = parseContent(content.value.toString());
      if (!value) {
        this.report(target, "Malformed meta refresh directive", location);
        return;
      }
      const { delay, url } = value;
      this.validateDelay(target, location, delay, url);
    });
  }
  validateDelay(target, location, delay, url) {
    const { allowLongDelay } = this.options;
    if (allowLongDelay && delay > 72e3) {
      return;
    }
    if (!url && delay === 0) {
      this.report(target, "Don't use instant meta refresh to reload the page", location);
      return;
    }
    if (delay !== 0) {
      const message = allowLongDelay ? "Meta refresh must be instant (0 second delay) or greater than 20 hours (72000 second delay)" : "Meta refresh must be instant (0 second delay)";
      this.report(target, message, location);
    }
  }
};
function parseContent(text) {
  const match = text.match(/^(\d+)(?:\s*;\s*url=(.*))?/i);
  if (match) {
    return {
      delay: parseInt(match[1], 10),
      url: match[2]
    };
  } else {
    return null;
  }
}
function getName(attr) {
  const name = attr.value;
  if (!name || name instanceof DynamicValue) {
    return null;
  }
  return name;
}
var MapDupName = class extends Rule {
  documentation() {
    return {
      description: "`<map>` must have a unique name, it cannot be the same name as another `<map>` element",
      url: "https://html-validate.org/rules/map-dup-name.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const maps = document2.querySelectorAll("map[name]");
      const names = /* @__PURE__ */ new Set();
      for (const map of maps) {
        const attr = map.getAttribute("name");
        if (!attr) {
          continue;
        }
        const name = getName(attr);
        if (!name) {
          continue;
        }
        if (names.has(name)) {
          this.report({
            node: map,
            message: `<map> name must be unique`,
            location: attr.keyLocation
          });
        }
        names.add(name);
      }
    });
  }
};
function isRelevant$5(event) {
  return event.target.is("map");
}
function hasStaticValue(attr) {
  return Boolean(attr && !(attr.value instanceof DynamicValue));
}
var MapIdName = class extends Rule {
  documentation() {
    return {
      description: "When the `id` attribute is present on a `<map>` element it must be equal to the `name` attribute.",
      url: "https://html-validate.org/rules/map-id-name.html"
    };
  }
  setup() {
    this.on("tag:ready", isRelevant$5, (event) => {
      const { target } = event;
      const id = target.getAttribute("id");
      const name = target.getAttribute("name");
      if (!hasStaticValue(id) || !hasStaticValue(name)) {
        return;
      }
      if (id.value === name.value) {
        return;
      }
      this.report({
        node: event.target,
        message: `"id" and "name" attribute must be the same on <map> elements`,
        location: id.valueLocation ?? name.valueLocation
      });
    });
  }
};
var MissingDoctype = class extends Rule {
  documentation() {
    return {
      description: "Requires that the document contains a doctype.",
      url: "https://html-validate.org/rules/missing-doctype.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const dom = event.document;
      if (!dom.doctype) {
        this.report(dom.root, "Document is missing doctype");
      }
    });
  }
};
var MultipleLabeledControls = class extends Rule {
  constructor() {
    super(...arguments);
    this.labelable = "";
  }
  documentation() {
    return {
      description: `A \`<label>\` element can only be associated with one control at a time.`,
      url: "https://html-validate.org/rules/multiple-labeled-controls.html"
    };
  }
  setup() {
    this.labelable = this.getTagsWithProperty("labelable").join(",");
    this.on("element:ready", (event) => {
      const { target } = event;
      if (target.tagName !== "label") {
        return;
      }
      const numControls = this.getNumLabledControls(target);
      if (numControls <= 1) {
        return;
      }
      this.report(target, "<label> is associated with multiple controls", target.location);
    });
  }
  getNumLabledControls(src) {
    const controls = src.querySelectorAll(this.labelable).map((node) => node.id);
    const attr = src.getAttribute("for");
    if (!attr || attr.isDynamic || !attr.value) {
      return controls.length;
    }
    const redundant = controls.includes(attr.value.toString());
    if (redundant) {
      return controls.length;
    }
    return controls.length + 1;
  }
};
var defaults$f = {
  pattern: "camelcase"
};
var NamePattern = class extends BasePatternRule {
  constructor(options) {
    super("name", { ...defaults$f, ...options });
  }
  static schema() {
    return BasePatternRule.schema();
  }
  documentation(context) {
    return {
      description: this.description(context),
      url: "https://html-validate.org/rules/name-pattern.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      var _a2;
      const { target, key, value, valueLocation } = event;
      const { meta } = target;
      if (!((_a2 = meta == null ? void 0 : meta.formAssociated) == null ? void 0 : _a2.listed)) {
        return;
      }
      if (key.toLowerCase() !== "name") {
        return;
      }
      if (value instanceof DynamicValue) {
        return;
      }
      if (value === null) {
        return;
      }
      const name = value.endsWith("[]") ? value.slice(0, -2) : value;
      this.validateValue(target, name, valueLocation);
    });
  }
};
var abstractRoles = [
  "command",
  "composite",
  "input",
  "landmark",
  "range",
  "roletype",
  "section",
  "sectionhead",
  "select",
  "structure",
  "widget",
  "window"
];
function isRelevant$4(event) {
  return event.key === "role";
}
var NoAbstractRole = class extends Rule {
  documentation(context) {
    return {
      description: [
        `Role \`"${context.role}"\` is abstract and must not be used.`,
        "",
        "WAI-ARIA defines a list of [abstract roles](https://www.w3.org/TR/wai-aria-1.2/#abstract_roles) which cannot be used by authors:",
        "",
        ...abstractRoles.map((it) => `- \`"${it}"\``),
        "",
        `Use one of the defined subclass roles for \`"${context.role}"\` instead.`
      ].join("\n"),
      url: "https://html-validate.org/rules/no-abstract-role.html"
    };
  }
  setup() {
    this.on("attr", isRelevant$4, (event) => {
      const roles2 = event.value;
      if (!roles2 || roles2 instanceof DynamicValue) {
        return;
      }
      const tokens = new DOMTokenList(roles2, event.valueLocation);
      for (const { item: role, location } of tokens.iterator()) {
        if (!abstractRoles.includes(role)) {
          continue;
        }
        this.report({
          node: event.target,
          message: `Role "{{ role }}" is abstract and must not be used`,
          location,
          context: {
            role
          }
        });
      }
    });
  }
};
var defaults$e = {
  include: null,
  exclude: null
};
var NoAutoplay = class extends Rule {
  constructor(options) {
    super({ ...defaults$e, ...options });
  }
  documentation(context) {
    return {
      description: [
        `The autoplay attribute is not allowed on <${context.tagName}>.`,
        "Autoplaying content can be disruptive for users and has accessibilty concerns.",
        "Prefer to let the user control playback."
      ].join("\n"),
      url: "https://html-validate.org/rules/no-autoplay.html"
    };
  }
  static schema() {
    return {
      exclude: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      },
      include: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      }
    };
  }
  setup() {
    this.on("attr", (event) => {
      if (event.key.toLowerCase() !== "autoplay") {
        return;
      }
      if (event.value && event.value instanceof DynamicValue) {
        return;
      }
      const tagName = event.target.tagName;
      if (this.isKeywordIgnored(tagName)) {
        return;
      }
      const context = { tagName };
      const location = event.location;
      this.report(
        event.target,
        `The autoplay attribute is not allowed on <${tagName}>`,
        location,
        context
      );
    });
  }
};
var NoConditionalComment = class extends Rule {
  documentation() {
    return {
      description: "Microsoft Internet Explorer previously supported using special HTML comments (conditional comments) for targeting specific versions of IE but since IE 10 it is deprecated and not supported in standards mode.",
      url: "https://html-validate.org/rules/no-conditional-comment.html"
    };
  }
  setup() {
    this.on("conditional", (event) => {
      this.report(event.parent, "Use of conditional comments are deprecated", event.location);
    });
  }
};
var NoDeprecatedAttr = class extends Rule {
  documentation() {
    return {
      description: "HTML5 deprecated many old attributes.",
      url: "https://html-validate.org/rules/no-deprecated-attr.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      const node = event.target;
      const meta = node.meta;
      const attr = event.key.toLowerCase();
      if (meta === null) {
        return;
      }
      const metaAttribute = meta.attributes[attr];
      if (!metaAttribute) {
        return;
      }
      const deprecated = metaAttribute.deprecated;
      if (deprecated) {
        this.report(
          node,
          `Attribute "${event.key}" is deprecated on <${node.tagName}> element`,
          event.keyLocation
        );
      }
    });
  }
};
var NoDupAttr = class extends Rule {
  documentation() {
    return {
      description: "HTML disallows two or more attributes with the same (case-insensitive) name.",
      url: "https://html-validate.org/rules/no-dup-attr.html"
    };
  }
  setup() {
    let attr = {};
    this.on("tag:start", () => {
      attr = {};
    });
    this.on("attr", (event) => {
      if (event.originalAttribute) {
        return;
      }
      const name = event.key.toLowerCase();
      if (name in attr) {
        this.report(event.target, `Attribute "${name}" duplicated`, event.keyLocation);
      }
      attr[event.key] = true;
    });
  }
};
var NoDupClass = class extends Rule {
  documentation() {
    return {
      description: "Prevents unnecessary duplication of class names.",
      url: "https://html-validate.org/rules/no-dup-class.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      if (event.key.toLowerCase() !== "class") {
        return;
      }
      const classes = new DOMTokenList(event.value, event.valueLocation);
      const unique = /* @__PURE__ */ new Set();
      classes.forEach((cur, index) => {
        if (unique.has(cur)) {
          const location = classes.location(index);
          this.report(event.target, `Class "${cur}" duplicated`, location);
        }
        unique.add(cur);
      });
    });
  }
};
var CACHE_KEY = Symbol("no-dup-id");
var NoDupID = class extends Rule {
  documentation() {
    return {
      description: "The ID of an element must be unique.",
      url: "https://html-validate.org/rules/no-dup-id.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const elements = document2.querySelectorAll("[id]");
      const relevant = elements.filter(isRelevant$3);
      for (const el of relevant) {
        const attr = el.getAttribute("id");
        if (!(attr == null ? void 0 : attr.value)) {
          continue;
        }
        const id = attr.value.toString();
        const existing = getExisting(el, document2.root);
        if (existing.has(id)) {
          this.report(el, `Duplicate ID "${id}"`, attr.valueLocation);
        }
        existing.add(id);
      }
    });
  }
};
function getExisting(element, root) {
  const group = element.closest("template") ?? root;
  const existing = group.cacheGet(CACHE_KEY);
  if (existing) {
    return existing;
  } else {
    const existing2 = /* @__PURE__ */ new Set();
    return group.cacheSet(CACHE_KEY, existing2);
  }
}
function isRelevant$3(element) {
  const attr = element.getAttribute("id");
  if (!attr) {
    return false;
  }
  if (!attr.value) {
    return false;
  }
  if (attr.isDynamic) {
    return false;
  }
  return true;
}
function isRelevant$2(event) {
  return event.target.is("button");
}
var NoImplicitButtonType = class extends Rule {
  documentation() {
    return {
      description: [
        "`<button>` is missing recommended `type` attribute",
        "",
        "When the `type` attribute is omitted it defaults to `submit`.",
        "Submit buttons are triggered when a keyboard user presses <kbd>Enter</kbd>.",
        "",
        "As this may or may not be inteded this rule enforces that the `type` attribute be explicitly set to one of the valid types:",
        "",
        "- `button` - a generic button.",
        "- `submit` - a submit button.",
        "- `reset`- a button to reset form fields."
      ].join("\n"),
      url: "https://html-validate.org/rules/no-implicit-button-type.html"
    };
  }
  setup() {
    this.on("element:ready", isRelevant$2, (event) => {
      const { target } = event;
      const attr = target.getAttribute("type");
      if (!attr) {
        this.report({
          node: event.target,
          message: `<button> is missing recommended "type" attribute`
        });
      }
    });
  }
};
function isRelevant$1(event) {
  return event.target.is("input");
}
var NoImplicitInputType = class extends Rule {
  documentation() {
    return {
      description: ["`<input>` is missing recommended `type` attribute"].join("\n"),
      url: "https://html-validate.org/rules/no-implicit-input-type.html"
    };
  }
  setup() {
    this.on("element:ready", isRelevant$1, (event) => {
      const { target } = event;
      const attr = target.getAttribute("type");
      if (!attr) {
        this.report({
          node: event.target,
          message: `<input> is missing recommended "type" attribute`
        });
      }
    });
  }
};
var NoImplicitClose = class extends Rule {
  documentation() {
    return {
      description: `Some elements in HTML has optional end tags. When an optional tag is omitted a browser must handle it as if the end tag was present.

Omitted end tags can be ambigious for humans to read and many editors have trouble formatting the markup.`,
      url: "https://html-validate.org/rules/no-implicit-close.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const closed = event.previous;
      const by = event.target;
      if (!by) {
        return;
      }
      if (closed.closed !== NodeClosed.ImplicitClosed) {
        return;
      }
      const closedByParent = closed.parent && closed.parent.tagName === by.tagName;
      const sameTag = closed.tagName === by.tagName;
      if (closedByParent) {
        this.report(
          closed,
          `Element <${closed.tagName}> is implicitly closed by parent </${by.tagName}>`,
          closed.location
        );
      } else if (sameTag) {
        this.report(
          closed,
          `Element <${closed.tagName}> is implicitly closed by sibling`,
          closed.location
        );
      } else {
        this.report(
          closed,
          `Element <${closed.tagName}> is implicitly closed by adjacent <${by.tagName}>`,
          closed.location
        );
      }
    });
  }
};
var defaults$d = {
  include: null,
  exclude: null,
  allowedProperties: ["display"]
};
var NoInlineStyle = class extends Rule {
  constructor(options) {
    super({ ...defaults$d, ...options });
  }
  static schema() {
    return {
      exclude: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      },
      include: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      },
      allowedProperties: {
        items: {
          type: "string"
        },
        type: "array"
      }
    };
  }
  documentation() {
    const text = [
      "Inline style is not allowed.\n",
      "Inline style is a sign of unstructured CSS. Use class or ID with a separate stylesheet.\n"
    ];
    if (this.options.allowedProperties.length > 0) {
      text.push("Under the current configuration the following CSS properties are allowed:\n");
      text.push(this.options.allowedProperties.map((it) => `- \`${it}\``).join("\n"));
    }
    return {
      description: text.join("\n"),
      url: "https://html-validate.org/rules/no-inline-style.html"
    };
  }
  setup() {
    this.on(
      "attr",
      (event) => this.isRelevant(event),
      (event) => {
        const { value } = event;
        if (this.allPropertiesAllowed(value)) {
          return;
        }
        this.report(event.target, "Inline style is not allowed");
      }
    );
  }
  isRelevant(event) {
    if (event.key !== "style") {
      return false;
    }
    const { include, exclude } = this.options;
    const key = event.originalAttribute ?? event.key;
    if (include && !include.includes(key)) {
      return false;
    }
    if (exclude && exclude.includes(key)) {
      return false;
    }
    return true;
  }
  allPropertiesAllowed(value) {
    const allowProperties = this.options.allowedProperties;
    if (allowProperties.length === 0) {
      return false;
    }
    const declarations = Object.keys(parseCssDeclaration(value));
    return declarations.length > 0 && declarations.every((it) => {
      return allowProperties.includes(it);
    });
  }
};
var ARIA = [
  { property: "aria-activedescendant", isList: false },
  { property: "aria-controls", isList: true },
  { property: "aria-describedby", isList: true },
  { property: "aria-details", isList: false },
  { property: "aria-errormessage", isList: false },
  { property: "aria-flowto", isList: true },
  { property: "aria-labelledby", isList: true },
  { property: "aria-owns", isList: true }
];
function idMissing(document2, id) {
  const nodes = document2.querySelectorAll(`[id="${id}"]`);
  return nodes.length === 0;
}
var NoMissingReferences = class extends Rule {
  documentation(context) {
    return {
      description: `The element ID "${context.value}" referenced by the ${context.key} attribute must point to an existing element.`,
      url: "https://html-validate.org/rules/no-missing-references.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const document2 = event.document;
      for (const node of document2.querySelectorAll("label[for]")) {
        const attr = node.getAttribute("for");
        this.validateReference(document2, node, attr, false);
      }
      for (const node of document2.querySelectorAll("input[list]")) {
        const attr = node.getAttribute("list");
        this.validateReference(document2, node, attr, false);
      }
      for (const { property, isList } of ARIA) {
        for (const node of document2.querySelectorAll(`[${property}]`)) {
          const attr = node.getAttribute(property);
          this.validateReference(document2, node, attr, isList);
        }
      }
    });
  }
  validateReference(document2, node, attr, isList) {
    if (!attr) {
      return;
    }
    const value = attr.value;
    if (value instanceof DynamicValue || value === null || value === "") {
      return;
    }
    if (isList) {
      this.validateList(document2, node, attr, value);
    } else {
      this.validateSingle(document2, node, attr, value);
    }
  }
  validateSingle(document2, node, attr, id) {
    if (idMissing(document2, id)) {
      const context = { key: attr.key, value: id };
      this.report(node, `Element references missing id "${id}"`, attr.valueLocation, context);
    }
  }
  validateList(document2, node, attr, values) {
    const parsed = new DOMTokenList(values, attr.valueLocation);
    for (const entry of parsed.iterator()) {
      const id = entry.item;
      if (idMissing(document2, id)) {
        const context = { key: attr.key, value: id };
        this.report(node, `Element references missing id "${id}"`, entry.location, context);
      }
    }
  }
};
var NoMultipleMain = class extends Rule {
  documentation() {
    return {
      description: [
        "Only a single visible `<main>` element can be present at in a document at a time.",
        "",
        "Multiple `<main>` can be present in the DOM as long the others are hidden using the HTML5 `hidden` attribute."
      ].join("\n"),
      url: "https://html-validate.org/rules/no-multiple-main.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const main = document2.querySelectorAll("main").filter((cur) => !cur.hasAttribute("hidden"));
      main.shift();
      for (const elem of main) {
        this.report(elem, "Multiple <main> elements present in document");
      }
    });
  }
};
var defaults$c = {
  relaxed: false
};
var textRegexp = /([<>]|&(?![a-zA-Z0-9#]+;))/g;
var unquotedAttrRegexp = /([<>"'=`]|&(?![a-zA-Z0-9#]+;))/g;
var matchTemplate = /^(<%.*?%>|<\?.*?\?>|<\$.*?\$>)$/s;
var replacementTable = {
  '"': "&quot;",
  "&": "&amp;",
  "'": "&apos;",
  "<": "&lt;",
  "=": "&equals;",
  ">": "&gt;",
  "`": "&grave;"
};
var NoRawCharacters = class extends Rule {
  constructor(options) {
    super({ ...defaults$c, ...options });
    this.relaxed = this.options.relaxed;
  }
  static schema() {
    return {
      relaxed: {
        type: "boolean"
      }
    };
  }
  documentation() {
    return {
      description: `Some characters such as \`<\`, \`>\` and \`&\` hold special meaning in HTML and must be escaped using a character reference (html entity).`,
      url: "https://html-validate.org/rules/no-raw-characters.html"
    };
  }
  setup() {
    this.on("element:ready", (event) => {
      const node = event.target;
      for (const child of node.childNodes) {
        if (child.nodeType !== NodeType.TEXT_NODE) {
          continue;
        }
        if (child.textContent.match(matchTemplate)) {
          continue;
        }
        this.findRawChars(node, child.textContent, child.location, textRegexp);
      }
    });
    this.on("attr", (event) => {
      if (!event.value) {
        return;
      }
      if (event.quote) {
        return;
      }
      this.findRawChars(
        event.target,
        event.value.toString(),
        event.valueLocation,
        // eslint-disable-line @typescript-eslint/no-non-null-assertion -- technical debt, valueLocation is always set if a value is provided
        unquotedAttrRegexp
      );
    });
  }
  /**
   * Find raw special characters and report as errors.
   *
   * @param text - The full text to find unescaped raw characters in.
   * @param location - Location of text.
   * @param regexp - Regexp pattern to match using.
   */
  findRawChars(node, text, location, regexp2) {
    let match;
    do {
      match = regexp2.exec(text);
      if (match) {
        const char = match[0];
        if (this.relaxed && char === "&") {
          continue;
        }
        const replacement2 = replacementTable[char];
        const charLocation = sliceLocation(location, match.index, match.index + 1);
        this.report(node, `Raw "${char}" must be encoded as "${replacement2}"`, charLocation);
      }
    } while (match);
  }
};
var selectors$1 = ["input[aria-label]", "textarea[aria-label]", "select[aria-label]"];
var NoRedundantAriaLabel = class extends Rule {
  documentation() {
    return {
      description: "`aria-label` is redundant when an associated `<label>` element containing the same text exists.",
      url: "https://html-validate.org/rules/no-redundant-aria-label.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const elements = document2.querySelectorAll(selectors$1.join(","));
      for (const element of elements) {
        const ariaLabel = element.getAttribute("aria-label");
        const id = element.id;
        if (!id) {
          continue;
        }
        const label = document2.querySelector(`label[for="${id}"]`);
        if (!ariaLabel || !label || label.textContent.trim() !== ariaLabel.value) {
          continue;
        }
        const message = "aria-label is redundant when label containing same text exists";
        this.report({
          message,
          node: element,
          location: ariaLabel.keyLocation
        });
      }
    });
  }
};
var NoRedundantFor = class extends Rule {
  documentation() {
    return {
      description: `When the \`<label>\` element wraps the labelable control the \`for\` attribute is redundant and better left out.`,
      url: "https://html-validate.org/rules/no-redundant-for.html"
    };
  }
  setup() {
    this.on("element:ready", (event) => {
      const { target } = event;
      if (target.tagName !== "label") {
        return;
      }
      const attr = target.getAttribute("for");
      if (!attr || attr.isDynamic) {
        return;
      }
      const id = attr.value;
      if (!id) {
        return;
      }
      const escaped = escapeSelectorComponent(id);
      const control = target.querySelector(`[id="${escaped}"]`);
      if (!control) {
        return;
      }
      this.report(target, 'Redundant "for" attribute', attr.keyLocation);
    });
  }
};
var NoRedundantRole = class extends Rule {
  documentation(context) {
    const { role, tagName } = context;
    return {
      description: `Using the \`${role}\` role is redundant as it is already implied by the \`<${tagName}>\` element.`,
      url: "https://html-validate.org/rules/no-redundant-role.html"
    };
  }
  setup() {
    this.on("tag:ready", (event) => {
      const { target } = event;
      const role = target.getAttribute("role");
      if (!(role == null ? void 0 : role.value) || role.value instanceof DynamicValue) {
        return;
      }
      const { meta } = target;
      if (!meta) {
        return;
      }
      const implicitRole = meta.aria.implicitRole(target._adapter);
      if (!implicitRole) {
        return;
      }
      if (role.value !== implicitRole) {
        return;
      }
      const context = {
        tagName: target.tagName,
        role: role.value
      };
      this.report(
        event.target,
        `Redundant role "${role.value}" on <${target.tagName}>`,
        role.valueLocation,
        context
      );
    });
  }
};
var xmlns = /^(.+):.+$/;
var defaults$b = {
  ignoreForeign: true,
  ignoreXML: true
};
var NoSelfClosing = class extends Rule {
  constructor(options) {
    super({ ...defaults$b, ...options });
  }
  static schema() {
    return {
      ignoreForeign: {
        type: "boolean"
      },
      ignoreXML: {
        type: "boolean"
      }
    };
  }
  documentation(tagName) {
    tagName = tagName || "element";
    return {
      description: `Self-closing elements are disallowed. Use regular end tag <${tagName}></${tagName}> instead of self-closing <${tagName}/>.`,
      url: "https://html-validate.org/rules/no-self-closing.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const active = event.previous;
      if (!isRelevant(active, this.options)) {
        return;
      }
      this.validateElement(active);
    });
  }
  validateElement(node) {
    if (node.closed !== NodeClosed.VoidSelfClosed) {
      return;
    }
    this.report(node, `<${node.tagName}> must not be self-closed`, null, node.tagName);
  }
};
function isRelevant(node, options) {
  if (node.tagName.match(xmlns)) {
    return !options.ignoreXML;
  }
  if (!node.meta) {
    return true;
  }
  if (node.meta.void) {
    return false;
  }
  if (node.meta.foreign) {
    return !options.ignoreForeign;
  }
  return true;
}
var NoStyleTag2 = class extends Rule {
  documentation() {
    return {
      description: "Prefer to use external stylesheets with the `<link>` tag instead of inlining the styling.",
      url: "https://html-validate.org/rules/no-style-tag.html"
    };
  }
  setup() {
    this.on("tag:start", (event) => {
      const node = event.target;
      if (node.tagName === "style") {
        this.report(node, "Use external stylesheet with <link> instead of <style> tag");
      }
    });
  }
};
var NoTrailingWhitespace = class extends Rule {
  documentation() {
    return {
      description: "Lines with trailing whitespace cause unnessecary diff when using version control and usually serve no special purpose in HTML.",
      url: "https://html-validate.org/rules/no-trailing-whitespace.html"
    };
  }
  setup() {
    this.on("whitespace", (event) => {
      if (event.text.match(/^[ \t]+\r?\n$/)) {
        this.report(null, "Trailing whitespace", event.location);
      }
    });
  }
};
var defaults$a = {
  include: null,
  exclude: null
};
var NoUnknownElements = class extends Rule {
  constructor(options) {
    super({ ...defaults$a, ...options });
  }
  static schema() {
    return {
      exclude: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      },
      include: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      }
    };
  }
  documentation(context) {
    const element = context ? ` <${context}>` : "";
    return {
      description: `An unknown element${element} was used. If this is a Custom Element you need to supply element metadata for it.`,
      url: "https://html-validate.org/rules/no-unknown-elements.html"
    };
  }
  setup() {
    this.on("tag:start", (event) => {
      const node = event.target;
      if (node.meta) {
        return;
      }
      if (this.isKeywordIgnored(node.tagName, keywordPatternMatcher)) {
        return;
      }
      this.report(node, `Unknown element <${node.tagName}>`, null, node.tagName);
    });
  }
};
var NoUnusedDisable = class extends Rule {
  documentation(context) {
    return {
      description: `\`${context.ruleId}\` rule is disabled but no error was reported.`,
      url: "https://html-validate.org/rules/no-unused-disable.html"
    };
  }
  setup() {
  }
  reportUnused(unused, options, location) {
    const tokens = new DOMTokenList(options.replace(/,/g, " "), location);
    for (const ruleId of unused) {
      const index = tokens.indexOf(ruleId);
      const tokenLocation = index >= 0 ? tokens.location(index) : location;
      this.report({
        node: null,
        message: '"{{ ruleId }}" rule is disabled but no error was reported',
        location: tokenLocation,
        context: {
          ruleId
        }
      });
    }
  }
};
var NoUtf8Bom = class extends Rule {
  documentation() {
    return {
      description: `This file is saved with the UTF-8 byte order mark (BOM) present. It is neither required or recommended to use.

Instead the document should be served with the \`Content-Type: application/javascript; charset=utf-8\` header.`,
      url: "https://html-validate.org/rules/no-utf8-bom.html"
    };
  }
  setup() {
    const unregister = this.on("token", (event) => {
      if (event.type === TokenType.UNICODE_BOM) {
        this.report(null, "File should be saved without UTF-8 BOM", event.location);
      }
      this.setEnabled(false);
      unregister();
    });
  }
};
var types2 = ["button", "submit", "reset", "image"];
var replacement = {
  button: '<button type="button">',
  submit: '<button type="submit">',
  reset: '<button type="reset">',
  image: '<button type="button">'
};
var defaults$9 = {
  include: null,
  exclude: null
};
var PreferButton = class extends Rule {
  constructor(options) {
    super({ ...defaults$9, ...options });
  }
  static schema() {
    return {
      exclude: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      },
      include: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      }
    };
  }
  documentation(context) {
    const src = `<input type="${context.type}">`;
    const dst = replacement[context.type] || `<button>`;
    return {
      description: `Prefer to use \`${dst}\` instead of \`"${src}\`.`,
      url: "https://html-validate.org/rules/prefer-button.html"
    };
  }
  setup() {
    this.on("attr", (event) => {
      const node = event.target;
      if (node.tagName.toLowerCase() !== "input") {
        return;
      }
      if (event.key.toLowerCase() !== "type") {
        return;
      }
      if (!event.value || event.value instanceof DynamicValue) {
        return;
      }
      const type2 = event.value.toLowerCase();
      if (this.isKeywordIgnored(type2)) {
        return;
      }
      if (!types2.includes(type2)) {
        return;
      }
      const context = { type: type2 };
      const message = `Prefer to use <button> instead of <input type="${type2}"> when adding buttons`;
      this.report(node, message, event.valueLocation, context);
    });
  }
};
var defaults$8 = {
  mapping: {
    article: "article",
    banner: "header",
    button: "button",
    cell: "td",
    checkbox: "input",
    complementary: "aside",
    contentinfo: "footer",
    figure: "figure",
    form: "form",
    heading: "hN",
    input: "input",
    link: "a",
    list: "ul",
    listbox: "select",
    listitem: "li",
    main: "main",
    navigation: "nav",
    progressbar: "progress",
    radio: "input",
    region: "section",
    table: "table",
    textbox: "textarea"
  },
  include: null,
  exclude: null
};
var PreferNativeElement = class extends Rule {
  constructor(options) {
    super({ ...defaults$8, ...options });
  }
  static schema() {
    return {
      exclude: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      },
      include: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      },
      mapping: {
        type: "object"
      }
    };
  }
  documentation(context) {
    return {
      description: `Instead of using the WAI-ARIA role "${context.role}" prefer to use the native <${context.replacement}> element.`,
      url: "https://html-validate.org/rules/prefer-native-element.html"
    };
  }
  setup() {
    const { mapping: mapping2 } = this.options;
    this.on("attr", (event) => {
      if (event.key.toLowerCase() !== "role") {
        return;
      }
      if (!event.value || event.value instanceof DynamicValue) {
        return;
      }
      const role = event.value.toLowerCase();
      if (this.isIgnored(role)) {
        return;
      }
      const replacement2 = mapping2[role];
      if (event.target.is(replacement2)) {
        return;
      }
      const context = { role, replacement: replacement2 };
      const location = this.getLocation(event);
      this.report(
        event.target,
        `Prefer to use the native <${replacement2}> element`,
        location,
        context
      );
    });
  }
  isIgnored(role) {
    const { mapping: mapping2 } = this.options;
    const replacement2 = mapping2[role];
    if (!replacement2) {
      return true;
    }
    return this.isKeywordIgnored(role);
  }
  getLocation(event) {
    const begin = event.location;
    const end = event.valueLocation;
    const quote = event.quote ? 1 : 0;
    const size = end.offset + end.size - begin.offset + quote;
    return {
      filename: begin.filename,
      line: begin.line,
      column: begin.column,
      offset: begin.offset,
      size
    };
  }
};
var PreferTbody = class extends Rule {
  documentation() {
    return {
      description: `While \`<tbody>\` is optional is relays semantic information about its contents. Where applicable it should also be combined with \`<thead>\` and \`<tfoot>\`.`,
      url: "https://html-validate.org/rules/prefer-tbody.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const doc = event.document;
      for (const table2 of doc.querySelectorAll("table")) {
        if (table2.querySelector("> tbody")) {
          continue;
        }
        const tr = table2.querySelectorAll("> tr");
        if (tr.length >= 1) {
          this.report(tr[0], "Prefer to wrap <tr> elements in <tbody>");
        }
      }
    });
  }
};
var defaults$7 = {
  tags: ["script", "style"]
};
var RequireCSPNonce = class extends Rule {
  constructor(options) {
    super({ ...defaults$7, ...options });
  }
  static schema() {
    return {
      tags: {
        type: "array",
        items: {
          enum: ["script", "style"],
          type: "string"
        }
      }
    };
  }
  documentation() {
    return {
      description: [
        "Required Content-Security-Policy (CSP) nonce is missing or empty.",
        "",
        "This is set by the `nonce` attribute and must match the `Content-Security-Policy` header.",
        "For instance, if the header contains `script-src 'nonce-r4nd0m'` the `nonce` attribute must be set to `nonce=\"r4nd0m\">`",
        "",
        "The nonce should be unique per each request and set to a cryptography secure random token.",
        "It is used to prevent cross site scripting (XSS) by preventing malicious actors from injecting scripts onto the page."
      ].join("\n"),
      url: "https://html-validate.org/rules/require-csp-nonce.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      var _a2;
      const { tags } = this.options;
      const node = event.previous;
      if (!tags.includes(node.tagName)) {
        return;
      }
      const nonce = (_a2 = node.getAttribute("nonce")) == null ? void 0 : _a2.value;
      if (nonce && nonce !== "") {
        return;
      }
      if (node.is("script") && node.hasAttribute("src")) {
        return;
      }
      const message = `required CSP nonce is missing`;
      this.report(node, message, node.location);
    });
  }
};
var defaults$6 = {
  target: "all",
  include: null,
  exclude: null
};
var crossorigin = new RegExp("^(\\w+://|//)");
var supportSri = {
  link: "href",
  script: "src"
};
var RequireSri = class extends Rule {
  constructor(options) {
    super({ ...defaults$6, ...options });
    this.target = this.options.target;
  }
  static schema() {
    return {
      target: {
        enum: ["all", "crossorigin"],
        type: "string"
      },
      include: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      },
      exclude: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "null"
          }
        ]
      }
    };
  }
  documentation() {
    return {
      description: `Subresource Integrity (SRI) \`integrity\` attribute is required to prevent tampering or manipulation from Content Delivery Networks (CDN), rouge proxies,  malicious entities, etc.`,
      url: "https://html-validate.org/rules/require-sri.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const node = event.previous;
      if (!(this.supportSri(node) && this.needSri(node))) {
        return;
      }
      if (node.hasAttribute("integrity")) {
        return;
      }
      this.report(
        node,
        `SRI "integrity" attribute is required on <${node.tagName}> element`,
        node.location
      );
    });
  }
  supportSri(node) {
    return Object.keys(supportSri).includes(node.tagName);
  }
  needSri(node) {
    const attr = this.elementSourceAttr(node);
    if (!attr) {
      return false;
    }
    if (attr.value === null || attr.value === "" || attr.isDynamic) {
      return false;
    }
    const url = attr.value.toString();
    if (this.target === "all" || crossorigin.test(url)) {
      return !this.isIgnored(url);
    }
    return false;
  }
  elementSourceAttr(node) {
    const key = supportSri[node.tagName];
    return node.getAttribute(key);
  }
  isIgnored(url) {
    return this.isKeywordIgnored(url, (list, it) => {
      return list.some((pattern) => it.includes(pattern));
    });
  }
};
var ScriptElement = class extends Rule {
  documentation() {
    return {
      description: "The end tag for `<script>` is a hard requirement and must never be omitted even when using the `src` attribute.",
      url: "https://html-validate.org/rules/script-element.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const node = event.target;
      if (!node || node.tagName !== "script") {
        return;
      }
      if (node.closed !== NodeClosed.EndTag) {
        this.report(node, `End tag for <${node.tagName}> must not be omitted`);
      }
    });
  }
};
var javascript = [
  "",
  "application/ecmascript",
  "application/javascript",
  "text/ecmascript",
  "text/javascript"
];
var ScriptType = class extends Rule {
  documentation() {
    return {
      description: "While valid the HTML5 standard encourages authors to omit the type element for JavaScript resources.",
      url: "https://html-validate.org/rules/script-type.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const node = event.previous;
      if (node.tagName !== "script") {
        return;
      }
      const attr = node.getAttribute("type");
      if (!attr || attr.isDynamic) {
        return;
      }
      const value = attr.value ? attr.value.toString() : "";
      if (!this.isJavascript(value)) {
        return;
      }
      this.report(
        node,
        '"type" attribute is unnecessary for javascript resources',
        attr.keyLocation
      );
    });
  }
  isJavascript(mime) {
    const type2 = mime.replace(/;.*/, "");
    return javascript.includes(type2);
  }
};
var SvgFocusable = class extends Rule {
  documentation() {
    return {
      description: `Inline SVG elements in IE are focusable by default which may cause issues with tab-ordering. The \`focusable\` attribute should explicitly be set to avoid unintended behaviour.`,
      url: "https://html-validate.org/rules/svg-focusable.html"
    };
  }
  setup() {
    this.on("element:ready", (event) => {
      if (event.target.is("svg")) {
        this.validate(event.target);
      }
    });
  }
  validate(svg) {
    if (svg.hasAttribute("focusable")) {
      return;
    }
    this.report(svg, `<${svg.tagName}> is missing required "focusable" attribute`);
  }
};
var defaults$5 = {
  characters: [
    { pattern: " ", replacement: "&nbsp;", description: "non-breaking space" },
    { pattern: "-", replacement: "&#8209;", description: "non-breaking hyphen" }
  ],
  ignoreClasses: [],
  ignoreStyle: true
};
function constructRegex(characters) {
  const disallowed = characters.map((it) => {
    return it.pattern;
  }).join("|");
  const pattern = `(${disallowed})`;
  return new RegExp(pattern, "g");
}
function getText(node) {
  const match = node.textContent.match(/^(\s*)(.*)$/);
  const [, leading, text] = match;
  return [leading.length, text.trimEnd()];
}
function matchAll(text, regexp2) {
  const copy = new RegExp(regexp2);
  const matches = [];
  let match;
  while (match = copy.exec(text)) {
    matches.push(match);
  }
  return matches;
}
var TelNonBreaking = class extends Rule {
  constructor(options) {
    super({ ...defaults$5, ...options });
    this.regex = constructRegex(this.options.characters);
  }
  static schema() {
    return {
      characters: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            pattern: {
              type: "string"
            },
            replacement: {
              type: "string"
            },
            description: {
              type: "string"
            }
          }
        }
      },
      ignoreClasses: {
        type: "array",
        items: {
          type: "string"
        }
      },
      ignoreStyle: {
        type: "boolean"
      }
    };
  }
  documentation(context) {
    const { characters } = this.options;
    const replacements = characters.map((it) => {
      return `  - \`${it.pattern}\` - replace with \`${it.replacement}\` (${it.description}).`;
    });
    return {
      description: [
        `The \`${context.pattern}\` character should be replaced with \`${context.replacement}\` character (${context.description}) when used in a telephone number.`,
        "",
        "Unless non-breaking characters is used there could be a line break inserted at that character.",
        "Line breaks make is harder to read and understand the telephone number.",
        "",
        "The following characters should be avoided:",
        "",
        ...replacements
      ].join("\n"),
      url: "https://html-validate.org/rules/tel-non-breaking.html"
    };
  }
  setup() {
    this.on("element:ready", this.isRelevant, (event) => {
      const { target } = event;
      if (this.isIgnored(target)) {
        return;
      }
      this.walk(target, target);
    });
  }
  isRelevant(event) {
    const { target } = event;
    if (!target.is("a")) {
      return false;
    }
    const attr = target.getAttribute("href");
    if (!attr || !attr.valueMatches(/^tel:/, false)) {
      return false;
    }
    return true;
  }
  isIgnoredClass(node) {
    const { ignoreClasses } = this.options;
    const { classList } = node;
    return ignoreClasses.some((it) => classList.contains(it));
  }
  isIgnoredStyle(node) {
    const { ignoreStyle } = this.options;
    const { style } = node;
    if (!ignoreStyle) {
      return false;
    }
    if (style["white-space"] === "nowrap" || style["white-space"] === "pre") {
      return true;
    }
    return false;
  }
  isIgnored(node) {
    return this.isIgnoredClass(node) || this.isIgnoredStyle(node);
  }
  walk(anchor, node) {
    for (const child of node.childNodes) {
      if (isTextNode(child)) {
        this.detectDisallowed(anchor, child);
      } else if (isElementNode(child)) {
        this.walk(anchor, child);
      }
    }
  }
  detectDisallowed(anchor, node) {
    const [offset, text] = getText(node);
    const matches = matchAll(text, this.regex);
    for (const match of matches) {
      const detected = match[0];
      const entry = this.options.characters.find((it) => it.pattern === detected);
      if (!entry) {
        throw new Error(`Failed to find entry for "${detected}" when searching text "${text}"`);
      }
      const message = `"${detected}" should be replaced with "${entry.replacement}" (${entry.description}) in telephone number`;
      const begin = offset + match.index;
      const end = begin + detected.length;
      const location = sliceLocation(node.location, begin, end);
      const context = entry;
      this.report(anchor, message, location, context);
    }
  }
};
function hasNonEmptyAttribute(node, key) {
  const attr = node.getAttribute(key);
  return Boolean(attr && attr.valueMatches(/.+/, true));
}
function hasDefaultText(node) {
  if (!node.is("input")) {
    return false;
  }
  if (node.hasAttribute("value")) {
    return false;
  }
  const type2 = node.getAttribute("type");
  return Boolean(type2 && type2.valueMatches(/submit|reset/, false));
}
function isNonEmptyText(node) {
  if (isTextNode(node)) {
    return node.isDynamic || node.textContent.trim() !== "";
  } else {
    return false;
  }
}
function haveAccessibleText(node) {
  if (!inAccessibilityTree(node)) {
    return false;
  }
  const haveText = node.childNodes.some((child) => isNonEmptyText(child));
  if (haveText) {
    return true;
  }
  if (hasNonEmptyAttribute(node, "aria-label")) {
    return true;
  }
  if (hasNonEmptyAttribute(node, "aria-labelledby")) {
    return true;
  }
  if (node.is("img") && hasNonEmptyAttribute(node, "alt")) {
    return true;
  }
  if (hasDefaultText(node)) {
    return true;
  }
  return node.childElements.some((child) => {
    return haveAccessibleText(child);
  });
}
var TextContent = class _TextContent extends Rule {
  documentation(context) {
    const doc = {
      description: `The textual content for this element is not valid.`,
      url: "https://html-validate.org/rules/text-content.html"
    };
    switch (context.textContent) {
      case TextContent$1.NONE:
        doc.description = `The \`<${context.tagName}>\` element must not have textual content.`;
        break;
      case TextContent$1.REQUIRED:
        doc.description = `The \`<${context.tagName}>\` element must have textual content.`;
        break;
      case TextContent$1.ACCESSIBLE:
        doc.description = `The \`<${context.tagName}>\` element must have accessible text.`;
        break;
    }
    return doc;
  }
  static filter(event) {
    const { target } = event;
    if (!target.meta) {
      return false;
    }
    const { textContent } = target.meta;
    if (!textContent || textContent === TextContent$1.DEFAULT) {
      return false;
    }
    return true;
  }
  setup() {
    this.on("element:ready", _TextContent.filter, (event) => {
      const target = event.target;
      const { textContent } = target.meta;
      switch (textContent) {
        case TextContent$1.NONE:
          this.validateNone(target);
          break;
        case TextContent$1.REQUIRED:
          this.validateRequired(target);
          break;
        case TextContent$1.ACCESSIBLE:
          this.validateAccessible(target);
          break;
      }
    });
  }
  /**
   * Validate element has empty text (inter-element whitespace is not considered text)
   */
  validateNone(node) {
    if (classifyNodeText(node) === TextClassification.EMPTY_TEXT) {
      return;
    }
    this.reportError(node, node.meta, `${node.annotatedName} must not have text content`);
  }
  /**
   * Validate element has any text (inter-element whitespace is not considered text)
   */
  validateRequired(node) {
    if (classifyNodeText(node) !== TextClassification.EMPTY_TEXT) {
      return;
    }
    this.reportError(node, node.meta, `${node.annotatedName} must have text content`);
  }
  /**
   * Validate element has accessible text (either regular text or text only
   * exposed in accessibility tree via aria-label or similar)
   */
  validateAccessible(node) {
    if (!inAccessibilityTree(node)) {
      return;
    }
    if (haveAccessibleText(node)) {
      return;
    }
    this.reportError(node, node.meta, `${node.annotatedName} must have accessible text`);
  }
  reportError(node, meta, message) {
    this.report(node, message, null, {
      tagName: node.tagName,
      textContent: meta.textContent
    });
  }
};
var roles = ["complementary", "contentinfo", "form", "banner", "main", "navigation", "region"];
var selectors = [
  "aside",
  "footer",
  "form",
  "header",
  "main",
  "nav",
  "section",
  ...roles.map((it) => `[role="${it}"]`)
  /* <search> does not (yet?) require a unique name */
];
function getTextFromReference(document2, id) {
  if (!id || id instanceof DynamicValue) {
    return id;
  }
  const selector2 = `#${id}`;
  const ref = document2.querySelector(selector2);
  if (ref) {
    return ref.textContent;
  } else {
    return selector2;
  }
}
function groupBy(values, callback) {
  const result = {};
  for (const value of values) {
    const key = callback(value);
    if (key in result) {
      result[key].push(value);
    } else {
      result[key] = [value];
    }
  }
  return result;
}
function getTextEntryFromElement(document2, node) {
  const ariaLabel = node.getAttribute("aria-label");
  if (ariaLabel) {
    return {
      node,
      text: ariaLabel.value,
      location: ariaLabel.keyLocation
    };
  }
  const ariaLabelledby = node.getAttribute("aria-labelledby");
  if (ariaLabelledby) {
    const text = getTextFromReference(document2, ariaLabelledby.value);
    return {
      node,
      text,
      location: ariaLabelledby.keyLocation
    };
  }
  return {
    node,
    text: null,
    location: node.location
  };
}
function isExcluded(entry) {
  const { node, text } = entry;
  if (text === null) {
    return !(node.is("form") || node.is("section"));
  }
  return true;
}
var UniqueLandmark = class extends Rule {
  documentation() {
    return {
      description: [
        "When the same type of landmark is present more than once in the same document each must be uniquely identifiable with a non-empty and unique name.",
        "For instance, if the document has two `<nav>` elements each of them need an accessible name to be distinguished from each other.",
        "",
        "The following elements / roles are considered landmarks:",
        "",
        '  - `aside` or `[role="complementary"]`',
        '  - `footer` or `[role="contentinfo"]`',
        '  - `form` or `[role="form"]`',
        '  - `header` or `[role="banner"]`',
        '  - `main` or `[role="main"]`',
        '  - `nav` or `[role="navigation"]`',
        '  - `section` or `[role="region"]`',
        "",
        "To fix this either:",
        "",
        "  - Add `aria-label`.",
        "  - Add `aria-labelledby`.",
        "  - Remove one of the landmarks."
      ].join("\n"),
      url: "https://html-validate.org/rules/unique-landmark.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const elements = document2.querySelectorAll(selectors.join(",")).filter((it) => typeof it.role === "string" && roles.includes(it.role));
      const grouped = groupBy(elements, (it) => it.role);
      for (const nodes of Object.values(grouped)) {
        if (nodes.length <= 1) {
          continue;
        }
        const entries = nodes.map((it) => getTextEntryFromElement(document2, it));
        const filteredEntries = entries.filter(isExcluded);
        for (const entry of filteredEntries) {
          if (entry.text instanceof DynamicValue) {
            continue;
          }
          const dup = entries.filter((it) => it.text === entry.text).length > 1;
          if (!entry.text || dup) {
            const message = `Landmarks must have a non-empty and unique accessible name (aria-label or aria-labelledby)`;
            const location = entry.location;
            this.report({
              node: entry.node,
              message,
              location
            });
          }
        }
      }
    });
  }
};
var defaults$4 = {
  ignoreCase: false,
  requireSemicolon: true
};
var regexp$1 = /&(?:[a-z0-9]+|#x?[0-9a-f]+)(;|[^a-z0-9]|$)/gi;
var lowercaseEntities = entities.map((it) => it.toLowerCase());
function isNumerical(entity) {
  return entity.startsWith("&#");
}
function getLocation(location, entity, match) {
  const index = match.index ?? 0;
  return sliceLocation(location, index, index + entity.length);
}
function getDescription(context, options) {
  const url = "https://html.spec.whatwg.org/multipage/named-characters.html";
  let message;
  if (context.terminated) {
    message = `Unrecognized character reference \`${context.entity}\`.`;
  } else {
    message = `Character reference \`${context.entity}\` must be terminated by a semicolon.`;
  }
  return [
    message,
    `HTML5 defines a set of [valid character references](${url}) but this is not a valid one.`,
    "",
    "Ensure that:",
    "",
    "1. The character is one of the listed names.",
    ...options.ignoreCase ? [] : ["1. The case is correct (names are case sensitive)."],
    ...options.requireSemicolon ? ["1. The name is terminated with a `;`."] : []
  ].join("\n");
}
var UnknownCharReference = class extends Rule {
  constructor(options) {
    super({ ...defaults$4, ...options });
  }
  static schema() {
    return {
      ignoreCase: {
        type: "boolean"
      },
      requireSemicolon: {
        type: "boolean"
      }
    };
  }
  documentation(context) {
    return {
      description: getDescription(context, this.options),
      url: "https://html-validate.org/rules/unrecognized-char-ref.html"
    };
  }
  setup() {
    this.on("element:ready", (event) => {
      const node = event.target;
      for (const child of node.childNodes) {
        if (child.nodeType !== NodeType.TEXT_NODE) {
          continue;
        }
        this.findCharacterReferences(node, child.textContent, child.location, {
          isAttribute: false
        });
      }
    });
    this.on("attr", (event) => {
      if (!event.value) {
        return;
      }
      this.findCharacterReferences(event.target, event.value.toString(), event.valueLocation, {
        isAttribute: true
      });
    });
  }
  get entities() {
    if (this.options.ignoreCase) {
      return lowercaseEntities;
    } else {
      return entities;
    }
  }
  findCharacterReferences(node, text, location, { isAttribute }) {
    const isQuerystring = isAttribute && text.includes("?");
    for (const match of this.getMatches(text)) {
      this.validateCharacterReference(node, location, match, { isQuerystring });
    }
  }
  validateCharacterReference(node, location, foobar, { isQuerystring }) {
    const { requireSemicolon } = this.options;
    const { match, entity, raw, terminated } = foobar;
    if (isNumerical(entity)) {
      return;
    }
    if (isQuerystring && !terminated) {
      return;
    }
    const found = this.entities.includes(entity);
    if (found && (terminated || !requireSemicolon)) {
      return;
    }
    if (found && !terminated) {
      const entityLocation2 = getLocation(location, entity, match);
      const message2 = `Character reference "{{ entity }}" must be terminated by a semicolon`;
      const context2 = {
        entity: raw,
        terminated: false
      };
      this.report(node, message2, entityLocation2, context2);
      return;
    }
    const entityLocation = getLocation(location, entity, match);
    const message = `Unrecognized character reference "{{ entity }}"`;
    const context = {
      entity: raw,
      terminated: true
    };
    this.report(node, message, entityLocation, context);
  }
  *getMatches(text) {
    let match;
    do {
      match = regexp$1.exec(text);
      if (match) {
        const terminator = match[1];
        const terminated = terminator === ";";
        const needSlice = terminator !== ";" && terminator.length > 0;
        const entity = needSlice ? match[0].slice(0, -1) : match[0];
        if (this.options.ignoreCase) {
          yield { match, entity: entity.toLowerCase(), raw: entity, terminated };
        } else {
          yield { match, entity, raw: entity, terminated };
        }
      }
    } while (match);
  }
};
var expectedOrder = ["section", "hint", "contact", "field1", "field2", "webauthn"];
var fieldNames1 = [
  "name",
  "honorific-prefix",
  "given-name",
  "additional-name",
  "family-name",
  "honorific-suffix",
  "nickname",
  "username",
  "new-password",
  "current-password",
  "one-time-code",
  "organization-title",
  "organization",
  "street-address",
  "address-line1",
  "address-line2",
  "address-line3",
  "address-level4",
  "address-level3",
  "address-level2",
  "address-level1",
  "country",
  "country-name",
  "postal-code",
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name",
  "cc-number",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc",
  "cc-type",
  "transaction-currency",
  "transaction-amount",
  "language",
  "bday",
  "bday-day",
  "bday-month",
  "bday-year",
  "sex",
  "url",
  "photo"
];
var fieldNames2 = [
  "tel",
  "tel-country-code",
  "tel-national",
  "tel-area-code",
  "tel-local",
  "tel-local-prefix",
  "tel-local-suffix",
  "tel-extension",
  "email",
  "impp"
];
var fieldNameGroup = {
  name: "text",
  "honorific-prefix": "text",
  "given-name": "text",
  "additional-name": "text",
  "family-name": "text",
  "honorific-suffix": "text",
  nickname: "text",
  username: "username",
  "new-password": "password",
  "current-password": "password",
  "one-time-code": "password",
  "organization-title": "text",
  organization: "text",
  "street-address": "multiline",
  "address-line1": "text",
  "address-line2": "text",
  "address-line3": "text",
  "address-level4": "text",
  "address-level3": "text",
  "address-level2": "text",
  "address-level1": "text",
  country: "text",
  "country-name": "text",
  "postal-code": "text",
  "cc-name": "text",
  "cc-given-name": "text",
  "cc-additional-name": "text",
  "cc-family-name": "text",
  "cc-number": "text",
  "cc-exp": "month",
  "cc-exp-month": "numeric",
  "cc-exp-year": "numeric",
  "cc-csc": "text",
  "cc-type": "text",
  "transaction-currency": "text",
  "transaction-amount": "numeric",
  language: "text",
  bday: "date",
  "bday-day": "numeric",
  "bday-month": "numeric",
  "bday-year": "numeric",
  sex: "text",
  url: "url",
  photo: "url",
  tel: "tel",
  "tel-country-code": "text",
  "tel-national": "text",
  "tel-area-code": "text",
  "tel-local": "text",
  "tel-local-prefix": "text",
  "tel-local-suffix": "text",
  "tel-extension": "text",
  email: "username",
  impp: "url"
};
var disallowedInputTypes = ["checkbox", "radio", "file", "submit", "image", "reset", "button"];
function matchSection(token) {
  return token.startsWith("section-");
}
function matchHint(token) {
  return token === "shipping" || token === "billing";
}
function matchFieldNames1(token) {
  return fieldNames1.includes(token);
}
function matchContact(token) {
  const haystack = ["home", "work", "mobile", "fax", "pager"];
  return haystack.includes(token);
}
function matchFieldNames2(token) {
  return fieldNames2.includes(token);
}
function matchWebauthn(token) {
  return token === "webauthn";
}
function matchToken(token) {
  if (matchSection(token)) {
    return "section";
  }
  if (matchHint(token)) {
    return "hint";
  }
  if (matchFieldNames1(token)) {
    return "field1";
  }
  if (matchFieldNames2(token)) {
    return "field2";
  }
  if (matchContact(token)) {
    return "contact";
  }
  if (matchWebauthn(token)) {
    return "webauthn";
  }
  return null;
}
function getControlGroups(type2) {
  const allGroups = [
    "text",
    "multiline",
    "password",
    "url",
    "username",
    "tel",
    "numeric",
    "month",
    "date"
  ];
  const mapping2 = {
    hidden: allGroups,
    text: allGroups.filter((it) => it !== "multiline"),
    search: allGroups.filter((it) => it !== "multiline"),
    password: ["password"],
    url: ["url"],
    email: ["username"],
    tel: ["tel"],
    number: ["numeric"],
    month: ["month"],
    date: ["date"]
  };
  const groups = mapping2[type2];
  if (groups) {
    return groups;
  }
  return [];
}
function isDisallowedType(node, type2) {
  if (!node.is("input")) {
    return false;
  }
  return disallowedInputTypes.includes(type2);
}
function getTerminalMessage(context) {
  switch (context.msg) {
    case 0:
      return "autocomplete attribute cannot be used on {{ what }}";
    case 1:
      return '"{{ value }}" cannot be used on {{ what }}';
    case 2:
      return '"{{ second }}" must appear before "{{ first }}"';
    case 3:
      return '"{{ token }}" is not a valid autocomplete token or field name';
    case 4:
      return '"{{ second }}" cannot be combined with "{{ first }}"';
    case 5:
      return "autocomplete attribute is missing field name";
  }
}
function getMarkdownMessage(context) {
  switch (context.msg) {
    case 0:
      return [
        `\`autocomplete\` attribute cannot be used on \`${context.what}\``,
        "",
        "The following input types cannot use the `autocomplete` attribute:",
        "",
        ...disallowedInputTypes.map((it) => `- \`${it}\``)
      ].join("\n");
    case 1: {
      const message = `\`"${context.value}"\` cannot be used on \`${context.what}\``;
      if (context.type === "form") {
        return [
          message,
          "",
          'The `<form>` element can only use the values `"on"` and `"off"`.'
        ].join("\n");
      }
      if (context.type === "hidden") {
        return [
          message,
          "",
          '`<input type="hidden">` cannot use the values `"on"` and `"off"`.'
        ].join("\n");
      }
      const controlGroups = getControlGroups(context.type);
      const currentGroup = fieldNameGroup[context.value];
      return [
        message,
        "",
        `\`${context.what}\` allows autocomplete fields from the following group${controlGroups.length > 1 ? "s" : ""}:`,
        "",
        ...controlGroups.map((it) => `- ${it}`),
        "",
        `The field \`"${context.value}"\` belongs to the group /${currentGroup}/ which cannot be used with this input type.`
      ].join("\n");
    }
    case 2:
      return [
        `\`"${context.second}"\` must appear before \`"${context.first}"\``,
        "",
        "The autocomplete tokens must appear in the following order:",
        "",
        "- Optional section name (`section-` prefix).",
        "- Optional `shipping` or `billing` token.",
        "- Optional `home`, `work`, `mobile`, `fax` or `pager` token (for fields supporting it).",
        "- Field name",
        "- Optional `webauthn` token."
      ].join("\n");
    case 3:
      return `\`"${context.token}"\` is not a valid autocomplete token or field name`;
    case 4:
      return `\`"${context.second}"\` cannot be combined with \`"${context.first}"\``;
    case 5:
      return "Autocomplete attribute is missing field name";
  }
}
var ValidAutocomplete = class extends Rule {
  documentation(context) {
    return {
      description: getMarkdownMessage(context),
      url: "https://html-validate.org/rules/valid-autocomplete.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const elements = document2.querySelectorAll("[autocomplete]");
      for (const element of elements) {
        const autocomplete = element.getAttribute("autocomplete");
        if (autocomplete.value === null || autocomplete.value instanceof DynamicValue) {
          continue;
        }
        const location = autocomplete.valueLocation;
        const value = autocomplete.value.toLowerCase();
        const tokens = new DOMTokenList(value, location);
        if (tokens.length === 0) {
          continue;
        }
        this.validate(element, value, tokens, autocomplete.keyLocation, location);
      }
    });
  }
  validate(node, value, tokens, keyLocation, valueLocation) {
    switch (node.tagName) {
      case "form":
        this.validateFormAutocomplete(node, value, valueLocation);
        break;
      case "input":
      case "textarea":
      case "select":
        this.validateControlAutocomplete(node, tokens, keyLocation);
        break;
    }
  }
  validateControlAutocomplete(node, tokens, keyLocation) {
    const type2 = node.getAttributeValue("type") ?? "text";
    const mantle = type2 !== "hidden" ? "expectation" : "anchor";
    if (isDisallowedType(node, type2)) {
      const context = {
        msg: 0,
        what: `<input type="${type2}">`
      };
      this.report({
        node,
        message: getTerminalMessage(context),
        location: keyLocation,
        context
      });
      return;
    }
    if (tokens.includes("on") || tokens.includes("off")) {
      this.validateOnOff(node, mantle, tokens);
      return;
    }
    this.validateTokens(node, tokens, keyLocation);
  }
  validateFormAutocomplete(node, value, location) {
    const trimmed = value.trim();
    if (["on", "off"].includes(trimmed)) {
      return;
    }
    const context = {
      msg: 1,
      type: "form",
      value: trimmed,
      what: "<form>"
    };
    this.report({
      node,
      message: getTerminalMessage(context),
      location,
      context
    });
  }
  validateOnOff(node, mantle, tokens) {
    const index = tokens.findIndex((it) => it === "on" || it === "off");
    const value = tokens.item(index);
    const location = tokens.location(index);
    if (tokens.length > 1) {
      const context = {
        msg: 4,
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- it must be present of it wouldn't be found */
        first: tokens.item(index > 0 ? 0 : 1),
        second: value
      };
      this.report({
        node,
        message: getTerminalMessage(context),
        location,
        context
      });
    }
    switch (mantle) {
      case "expectation":
        return;
      case "anchor": {
        const context = {
          msg: 1,
          type: "hidden",
          value,
          what: `<input type="hidden">`
        };
        this.report({
          node,
          message: getTerminalMessage(context),
          location: tokens.location(0),
          context
        });
      }
    }
  }
  validateTokens(node, tokens, keyLocation) {
    const order = [];
    for (const { item, location } of tokens.iterator()) {
      const tokenType = matchToken(item);
      if (tokenType) {
        order.push(tokenType);
      } else {
        const context = {
          msg: 3,
          token: item
        };
        this.report({
          node,
          message: getTerminalMessage(context),
          location,
          context
        });
        return;
      }
    }
    const fieldTokens = order.map((it) => it === "field1" || it === "field2");
    this.validateFieldPresence(node, tokens, fieldTokens, keyLocation);
    this.validateContact(node, tokens, order);
    this.validateOrder(node, tokens, order);
    this.validateControlGroup(node, tokens, fieldTokens);
  }
  /**
   * Ensure that exactly one field name is present from the two field lists.
   */
  validateFieldPresence(node, tokens, fieldTokens, keyLocation) {
    const numFields = fieldTokens.filter(Boolean).length;
    if (numFields === 0) {
      const context = {
        msg: 5
        /* MissingField */
      };
      this.report({
        node,
        message: getTerminalMessage(context),
        location: keyLocation,
        context
      });
    } else if (numFields > 1) {
      const a = fieldTokens.indexOf(true);
      const b = fieldTokens.lastIndexOf(true);
      const context = {
        msg: 4,
        /* eslint-disable @typescript-eslint/no-non-null-assertion -- it must be present of it wouldn't be found */
        first: tokens.item(a),
        second: tokens.item(b)
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      };
      this.report({
        node,
        message: getTerminalMessage(context),
        location: tokens.location(b),
        context
      });
    }
  }
  /**
   * Ensure contact token is only used with field names from the second list.
   */
  validateContact(node, tokens, order) {
    if (order.includes("contact") && order.includes("field1")) {
      const a = order.indexOf("field1");
      const b = order.indexOf("contact");
      const context = {
        msg: 4,
        /* eslint-disable @typescript-eslint/no-non-null-assertion -- it must be present of it wouldn't be found */
        first: tokens.item(a),
        second: tokens.item(b)
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      };
      this.report({
        node,
        message: getTerminalMessage(context),
        location: tokens.location(b),
        context
      });
    }
  }
  validateOrder(node, tokens, order) {
    const indicies = order.map((it) => expectedOrder.indexOf(it));
    for (let i = 0; i < indicies.length - 1; i++) {
      if (indicies[0] > indicies[i + 1]) {
        const context = {
          msg: 2,
          /* eslint-disable @typescript-eslint/no-non-null-assertion -- it must be present of it wouldn't be found */
          first: tokens.item(i),
          second: tokens.item(i + 1)
          /* eslint-enable @typescript-eslint/no-non-null-assertion */
        };
        this.report({
          node,
          message: getTerminalMessage(context),
          location: tokens.location(i + 1),
          context
        });
      }
    }
  }
  validateControlGroup(node, tokens, fieldTokens) {
    const numFields = fieldTokens.filter(Boolean).length;
    if (numFields === 0) {
      return;
    }
    if (!node.is("input")) {
      return;
    }
    const attr = node.getAttribute("type");
    const type2 = (attr == null ? void 0 : attr.value) ?? "text";
    if (type2 instanceof DynamicValue) {
      return;
    }
    const controlGroups = getControlGroups(type2);
    const fieldIndex = fieldTokens.indexOf(true);
    const fieldToken = tokens.item(fieldIndex);
    const fieldGroup = fieldNameGroup[fieldToken];
    if (!controlGroups.includes(fieldGroup)) {
      const context = {
        msg: 1,
        type: type2,
        value: fieldToken,
        what: `<input type="${type2}">`
      };
      this.report({
        node,
        message: getTerminalMessage(context),
        location: tokens.location(fieldIndex),
        context
      });
    }
  }
};
var defaults$3 = {
  relaxed: false
};
var ValidID = class extends Rule {
  constructor(options) {
    super({ ...defaults$3, ...options });
  }
  static schema() {
    return {
      relaxed: {
        type: "boolean"
      }
    };
  }
  documentation(context) {
    const { relaxed } = this.options;
    const message = this.messages[context].replace("id", "ID").replace(/^(.)/, (m) => m.toUpperCase());
    const relaxedDescription = relaxed ? [] : [
      "  - ID must begin with a letter",
      "  - ID must only contain alphanumerical characters, `-` and `_`"
    ];
    return {
      description: [
        `${message}.`,
        "",
        "Under the current configuration the following rules are applied:",
        "",
        "  - ID must not be empty",
        "  - ID must not contain any whitespace characters",
        ...relaxedDescription
      ].join("\n"),
      url: "https://html-validate.org/rules/valid-id.html"
    };
  }
  setup() {
    this.on("attr", this.isRelevant, (event) => {
      const { value } = event;
      if (value === null || value instanceof DynamicValue) {
        return;
      }
      if (value === "") {
        const context = 1;
        this.report(event.target, this.messages[context], event.location, context);
        return;
      }
      if (value.match(/\s/)) {
        const context = 2;
        this.report(event.target, this.messages[context], event.valueLocation, context);
        return;
      }
      const { relaxed } = this.options;
      if (relaxed) {
        return;
      }
      if (value.match(/^[^a-zA-Z]/)) {
        const context = 3;
        this.report(event.target, this.messages[context], event.valueLocation, context);
        return;
      }
      if (value.match(/[^a-zA-Z0-9-_]/)) {
        const context = 4;
        this.report(event.target, this.messages[context], event.valueLocation, context);
      }
    });
  }
  get messages() {
    return {
      [
        1
        /* EMPTY */
      ]: "element id must not be empty",
      [
        2
        /* WHITESPACE */
      ]: "element id must not contain whitespace",
      [
        3
        /* LEADING_CHARACTER */
      ]: "element id must begin with a letter",
      [
        4
        /* DISALLOWED_CHARACTER */
      ]: "element id must only contain alphanumerical, dash and underscore characters"
    };
  }
  isRelevant(event) {
    return event.key === "id";
  }
};
var VoidContent = class extends Rule {
  documentation(tagName) {
    const doc = {
      description: "HTML void elements cannot have any content and must not have content or end tag.",
      url: "https://html-validate.org/rules/void-content.html"
    };
    if (tagName) {
      doc.description = `<${tagName}> is a void element and must not have content or end tag.`;
    }
    return doc;
  }
  setup() {
    this.on("tag:end", (event) => {
      const node = event.target;
      if (!node) {
        return;
      }
      if (!node.voidElement) {
        return;
      }
      if (node.closed === NodeClosed.EndTag) {
        this.report(
          null,
          `End tag for <${node.tagName}> must be omitted`,
          node.location,
          node.tagName
        );
      }
    });
  }
};
var defaults$2 = {
  style: "omit"
};
var VoidStyle = class extends Rule {
  constructor(options) {
    super({ ...defaults$2, ...options });
    this.style = parseStyle(this.options.style);
  }
  static schema() {
    return {
      style: {
        enum: ["omit", "selfclose", "selfclosing"],
        type: "string"
      }
    };
  }
  documentation(context) {
    const [desc, end] = styleDescription(context.style);
    return {
      description: `The current configuration requires void elements to ${desc}, use <${context.tagName}${end}> instead.`,
      url: "https://html-validate.org/rules/void-style.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const active = event.previous;
      if (active.meta) {
        this.validateActive(active);
      }
    });
  }
  validateActive(node) {
    if (!node.voidElement) {
      return;
    }
    if (this.shouldBeOmitted(node)) {
      this.reportError(
        node,
        `Expected omitted end tag <${node.tagName}> instead of self-closing element <${node.tagName}/>`
      );
    }
    if (this.shouldBeSelfClosed(node)) {
      this.reportError(
        node,
        `Expected self-closing element <${node.tagName}/> instead of omitted end-tag <${node.tagName}>`
      );
    }
  }
  reportError(node, message) {
    const context = {
      style: this.style,
      tagName: node.tagName
    };
    super.report(node, message, null, context);
  }
  shouldBeOmitted(node) {
    return this.style === 1 && node.closed === NodeClosed.VoidSelfClosed;
  }
  shouldBeSelfClosed(node) {
    return this.style === 2 && node.closed === NodeClosed.VoidOmitted;
  }
};
function parseStyle(name) {
  switch (name) {
    case "omit":
      return 1;
    case "selfclose":
    case "selfclosing":
      return 2;
    default:
      throw new Error(`Invalid style "${name}" for "void-style" rule`);
  }
}
function styleDescription(style) {
  switch (style) {
    case 1:
      return ["omit end tag", ""];
    case 2:
      return ["be self-closed", "/"];
    default:
      throw new Error(`Unknown style`);
  }
}
var H30 = class extends Rule {
  documentation() {
    return {
      description: "WCAG 2.1 requires each `<a>` anchor link to have a text describing the purpose of the link using either plain text or an `<img>` with the `alt` attribute set.",
      url: "https://html-validate.org/rules/wcag/h30.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const links = event.document.getElementsByTagName("a");
      for (const link of links) {
        if (!inAccessibilityTree(link)) {
          continue;
        }
        const textClassification = classifyNodeText(link, { ignoreHiddenRoot: true });
        if (textClassification !== TextClassification.EMPTY_TEXT) {
          continue;
        }
        const images = link.querySelectorAll("img");
        if (images.some((image) => hasAltText(image))) {
          continue;
        }
        const labels = link.querySelectorAll("[aria-label]");
        if (hasAriaLabel(link) || labels.some((cur) => hasAriaLabel(cur))) {
          continue;
        }
        this.report(link, "Anchor link must have a text describing its purpose");
      }
    });
  }
};
var H32 = class extends Rule {
  documentation() {
    return {
      description: "WCAG 2.1 requires each `<form>` element to have at least one submit button.",
      url: "https://html-validate.org/rules/wcag/h32.html"
    };
  }
  setup() {
    const formTags = this.getTagsWithProperty("form");
    const formSelector = formTags.join(",");
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const forms = document2.querySelectorAll(formSelector);
      for (const form of forms) {
        if (hasNestedSubmit(form)) {
          continue;
        }
        if (hasAssociatedSubmit(document2, form)) {
          continue;
        }
        this.report(form, `<${form.tagName}> element must have a submit button`);
      }
    });
  }
};
function isSubmit(node) {
  const type2 = node.getAttribute("type");
  return Boolean(!type2 || type2.valueMatches(/submit|image/));
}
function isAssociated(id, node) {
  const form = node.getAttribute("form");
  return Boolean(form && form.valueMatches(id, true));
}
function hasNestedSubmit(form) {
  const matches = form.querySelectorAll("button,input").filter(isSubmit).filter((node) => !node.hasAttribute("form"));
  return matches.length > 0;
}
function hasAssociatedSubmit(document2, form) {
  const { id } = form;
  if (!id) {
    return false;
  }
  const matches = document2.querySelectorAll("button[form],input[form]").filter(isSubmit).filter((node) => isAssociated(id, node));
  return matches.length > 0;
}
var H36 = class extends Rule {
  documentation() {
    return {
      description: 'WCAG 2.1 requires all images used as submit buttons to have a textual description using the alt attribute. The alt text cannot be empty (`alt=""`).',
      url: "https://html-validate.org/rules/wcag/h36.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const node = event.previous;
      if (node.tagName !== "input")
        return;
      if (node.getAttributeValue("type") !== "image") {
        return;
      }
      if (!hasAltText(node)) {
        this.report(node, "image used as submit button must have alt text");
      }
    });
  }
};
var defaults$1 = {
  allowEmpty: true,
  alias: []
};
function needsAlt(node) {
  if (node.is("img")) {
    return true;
  }
  if (node.is("input") && node.getAttributeValue("type") === "image") {
    return true;
  }
  return false;
}
function getTag(node) {
  return node.is("input") ? `<input type="${/* istanbul ignore next */
  node.getAttributeValue("type") ?? ""}">` : `<${node.tagName}>`;
}
var H37 = class extends Rule {
  constructor(options) {
    super({ ...defaults$1, ...options });
    if (!Array.isArray(this.options.alias)) {
      this.options.alias = [this.options.alias];
    }
  }
  static schema() {
    return {
      alias: {
        anyOf: [
          {
            items: {
              type: "string"
            },
            type: "array"
          },
          {
            type: "string"
          }
        ]
      },
      allowEmpty: {
        type: "boolean"
      }
    };
  }
  documentation() {
    return {
      description: "Both HTML5 and WCAG 2.0 requires images to have a alternative text for each image.",
      url: "https://html-validate.org/rules/wcag/h37.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const nodes = document2.querySelectorAll("img, input");
      for (const node of nodes) {
        this.validateNode(node);
      }
    });
  }
  validateNode(node) {
    if (!needsAlt(node)) {
      return;
    }
    if (!inAccessibilityTree(node)) {
      return;
    }
    if (Boolean(node.getAttributeValue("alt")) || Boolean(node.hasAttribute("alt") && this.options.allowEmpty)) {
      return;
    }
    for (const attr of this.options.alias) {
      if (node.getAttribute(attr)) {
        return;
      }
    }
    if (node.hasAttribute("alt")) {
      const attr = node.getAttribute("alt");
      this.report(node, `${getTag(node)} cannot have empty "alt" attribute`, attr == null ? void 0 : attr.keyLocation);
    } else {
      this.report(node, `${getTag(node)} is missing required "alt" attribute`, node.location);
    }
  }
};
var _a;
var { enum: validScopes } = (_a = html5.th.attributes) == null ? void 0 : _a.scope;
var joinedScopes = naturalJoin(validScopes);
var H63 = class extends Rule {
  documentation() {
    return {
      description: "H63: Using the scope attribute to associate header cells and data cells in data tables",
      url: "https://html-validate.org/rules/wcag/h63.html"
    };
  }
  setup() {
    this.on("tag:ready", (event) => {
      const node = event.target;
      if (node.tagName !== "th") {
        return;
      }
      const scope2 = node.getAttribute("scope");
      const value = scope2 == null ? void 0 : scope2.value;
      if (value instanceof DynamicValue) {
        return;
      }
      if (value && validScopes.includes(value)) {
        return;
      }
      const message = `<th> element must have a valid scope attribute: ${joinedScopes}`;
      const location = (scope2 == null ? void 0 : scope2.valueLocation) ?? (scope2 == null ? void 0 : scope2.keyLocation) ?? node.location;
      this.report(node, message, location);
    });
  }
};
var H67 = class extends Rule {
  documentation() {
    return {
      description: "A decorative image cannot have a title attribute. Either remove `title` or add a descriptive `alt` text.",
      url: "https://html-validate.org/rules/wcag/h67.html"
    };
  }
  setup() {
    this.on("tag:end", (event) => {
      const node = event.target;
      if (!node || node.tagName !== "img") {
        return;
      }
      const title2 = node.getAttribute("title");
      if (!title2 || title2.value === "") {
        return;
      }
      const alt = node.getAttributeValue("alt");
      if (alt && alt !== "") {
        return;
      }
      this.report(node, "<img> with empty alt text cannot have title attribute", title2.keyLocation);
    });
  }
};
var H71 = class extends Rule {
  documentation() {
    return {
      description: "H71: Providing a description for groups of form controls using fieldset and legend elements",
      url: "https://html-validate.org/rules/wcag/h71.html"
    };
  }
  setup() {
    this.on("dom:ready", (event) => {
      const { document: document2 } = event;
      const fieldsets = document2.querySelectorAll(this.selector);
      for (const fieldset of fieldsets) {
        this.validate(fieldset);
      }
    });
  }
  validate(fieldset) {
    const legend = fieldset.querySelectorAll("> legend");
    if (legend.length === 0) {
      this.reportNode(fieldset);
    }
  }
  reportNode(node) {
    super.report(node, `${node.annotatedName} must have a <legend> as the first child`);
  }
  get selector() {
    return this.getTagsDerivedFrom("fieldset").join(",");
  }
};
var bundledRules$1 = {
  "wcag/h30": H30,
  "wcag/h32": H32,
  "wcag/h36": H36,
  "wcag/h37": H37,
  "wcag/h63": H63,
  "wcag/h67": H67,
  "wcag/h71": H71
};
var WCAG = bundledRules$1;
var bundledRules = {
  "allowed-links": AllowedLinks,
  "area-alt": AreaAlt,
  "aria-hidden-body": AriaHiddenBody,
  "aria-label-misuse": AriaLabelMisuse,
  "attr-case": AttrCase,
  "attr-delimiter": AttrDelimiter,
  "attr-pattern": AttrPattern,
  "attr-quotes": AttrQuotes,
  "attr-spacing": AttrSpacing,
  "attribute-allowed-values": AttributeAllowedValues,
  "attribute-boolean-style": AttributeBooleanStyle,
  "attribute-empty-style": AttributeEmptyStyle,
  "attribute-misuse": AttributeMisuse,
  "class-pattern": ClassPattern,
  "close-attr": CloseAttr,
  "close-order": CloseOrder,
  deprecated: Deprecated,
  "deprecated-rule": DeprecatedRule,
  "doctype-html": NoStyleTag$1,
  "doctype-style": DoctypeStyle,
  "element-case": ElementCase,
  "element-name": ElementName,
  "element-permitted-content": ElementPermittedContent,
  "element-permitted-occurrences": ElementPermittedOccurrences,
  "element-permitted-order": ElementPermittedOrder,
  "element-permitted-parent": ElementPermittedParent,
  "element-required-ancestor": ElementRequiredAncestor,
  "element-required-attributes": ElementRequiredAttributes,
  "element-required-content": ElementRequiredContent,
  "empty-heading": EmptyHeading,
  "empty-title": EmptyTitle,
  "form-dup-name": FormDupName,
  "heading-level": HeadingLevel,
  "hidden-focusable": HiddenFocusable,
  "id-pattern": IdPattern,
  "input-attributes": InputAttributes,
  "input-missing-label": InputMissingLabel,
  "long-title": LongTitle,
  "map-dup-name": MapDupName,
  "map-id-name": MapIdName,
  "meta-refresh": MetaRefresh,
  "missing-doctype": MissingDoctype,
  "multiple-labeled-controls": MultipleLabeledControls,
  "name-pattern": NamePattern,
  "no-abstract-role": NoAbstractRole,
  "no-autoplay": NoAutoplay,
  "no-conditional-comment": NoConditionalComment,
  "no-deprecated-attr": NoDeprecatedAttr,
  "no-dup-attr": NoDupAttr,
  "no-dup-class": NoDupClass,
  "no-dup-id": NoDupID,
  "no-implicit-button-type": NoImplicitButtonType,
  "no-implicit-input-type": NoImplicitInputType,
  "no-implicit-close": NoImplicitClose,
  "no-inline-style": NoInlineStyle,
  "no-missing-references": NoMissingReferences,
  "no-multiple-main": NoMultipleMain,
  "no-raw-characters": NoRawCharacters,
  "no-redundant-aria-label": NoRedundantAriaLabel,
  "no-redundant-for": NoRedundantFor,
  "no-redundant-role": NoRedundantRole,
  "no-self-closing": NoSelfClosing,
  "no-style-tag": NoStyleTag2,
  "no-trailing-whitespace": NoTrailingWhitespace,
  "no-unknown-elements": NoUnknownElements,
  "no-unused-disable": NoUnusedDisable,
  "no-utf8-bom": NoUtf8Bom,
  "prefer-button": PreferButton,
  "prefer-native-element": PreferNativeElement,
  "prefer-tbody": PreferTbody,
  "require-csp-nonce": RequireCSPNonce,
  "require-sri": RequireSri,
  "script-element": ScriptElement,
  "script-type": ScriptType,
  "svg-focusable": SvgFocusable,
  "tel-non-breaking": TelNonBreaking,
  "text-content": TextContent,
  "unique-landmark": UniqueLandmark,
  "unrecognized-char-ref": UnknownCharReference,
  "valid-autocomplete": ValidAutocomplete,
  "valid-id": ValidID,
  "void-content": VoidContent,
  "void-style": VoidStyle,
  ...WCAG
};
var defaultConfig = {};
var config$4 = {
  rules: {
    "area-alt": ["error", { accessible: true }],
    "aria-hidden-body": "error",
    "aria-label-misuse": ["error", { allowAnyNamable: false }],
    "deprecated-rule": "warn",
    "empty-heading": "error",
    "empty-title": "error",
    "hidden-focusable": "error",
    "meta-refresh": "error",
    "multiple-labeled-controls": "error",
    "no-abstract-role": "error",
    "no-autoplay": ["error", { include: ["audio", "video"] }],
    "no-dup-id": "error",
    "no-implicit-button-type": "error",
    "no-redundant-aria-label": "error",
    "no-redundant-for": "error",
    "no-redundant-role": "error",
    "prefer-native-element": "error",
    "svg-focusable": "off",
    "text-content": "error",
    "unique-landmark": "error",
    "valid-autocomplete": "error",
    "wcag/h30": "error",
    "wcag/h32": "error",
    "wcag/h36": "error",
    "wcag/h37": "error",
    "wcag/h63": "error",
    "wcag/h67": "error",
    "wcag/h71": "error"
  }
};
var a11y = config$4;
var config$3 = {
  rules: {
    "input-missing-label": "error",
    "heading-level": "error",
    "missing-doctype": "error",
    "no-missing-references": "error",
    "require-sri": "error"
  }
};
var document = config$3;
var config$2 = {
  rules: {
    "attr-quotes": "off",
    "doctype-style": "off",
    "void-style": "off"
  }
};
var prettier = config$2;
var config$1 = {
  rules: {
    "area-alt": ["error", { accessible: true }],
    "aria-hidden-body": "error",
    "aria-label-misuse": ["error", { allowAnyNamable: false }],
    "attr-case": "error",
    "attr-delimiter": "error",
    "attr-quotes": "error",
    "attr-spacing": "error",
    "attribute-allowed-values": "error",
    "attribute-boolean-style": "error",
    "attribute-empty-style": "error",
    "attribute-misuse": "error",
    "close-attr": "error",
    "close-order": "error",
    deprecated: "error",
    "deprecated-rule": "warn",
    "doctype-html": "error",
    "doctype-style": "error",
    "element-case": "error",
    "element-name": "error",
    "element-permitted-content": "error",
    "element-permitted-occurrences": "error",
    "element-permitted-order": "error",
    "element-permitted-parent": "error",
    "element-required-ancestor": "error",
    "element-required-attributes": "error",
    "element-required-content": "error",
    "empty-heading": "error",
    "empty-title": "error",
    "form-dup-name": "error",
    "hidden-focusable": "error",
    "input-attributes": "error",
    "long-title": "error",
    "map-dup-name": "error",
    "map-id-name": "error",
    "meta-refresh": "error",
    "multiple-labeled-controls": "error",
    "no-abstract-role": "error",
    "no-autoplay": ["error", { include: ["audio", "video"] }],
    "no-conditional-comment": "error",
    "no-deprecated-attr": "error",
    "no-dup-attr": "error",
    "no-dup-class": "error",
    "no-dup-id": "error",
    "no-implicit-button-type": "error",
    "no-implicit-input-type": "error",
    "no-implicit-close": "error",
    "no-inline-style": "error",
    "no-multiple-main": "error",
    "no-raw-characters": "error",
    "no-redundant-aria-label": "error",
    "no-redundant-for": "error",
    "no-redundant-role": "error",
    "no-self-closing": "error",
    "no-trailing-whitespace": "error",
    "no-utf8-bom": "error",
    "no-unused-disable": "error",
    "prefer-button": "error",
    "prefer-native-element": "error",
    "prefer-tbody": "error",
    "script-element": "error",
    "script-type": "error",
    "svg-focusable": "off",
    "tel-non-breaking": "error",
    "text-content": "error",
    "unique-landmark": "error",
    "unrecognized-char-ref": "error",
    "valid-autocomplete": "error",
    "valid-id": ["error", { relaxed: false }],
    void: "off",
    "void-content": "error",
    "void-style": "error",
    "wcag/h30": "error",
    "wcag/h32": "error",
    "wcag/h36": "error",
    "wcag/h37": "error",
    "wcag/h63": "error",
    "wcag/h67": "error",
    "wcag/h71": "error"
  }
};
var recommended = config$1;
var config = {
  rules: {
    "area-alt": ["error", { accessible: false }],
    "aria-label-misuse": ["error", { allowAnyNamable: true }],
    "attr-spacing": "error",
    "attribute-allowed-values": "error",
    "attribute-misuse": "error",
    "close-attr": "error",
    "close-order": "error",
    deprecated: "error",
    "deprecated-rule": "warn",
    "doctype-html": "error",
    "element-name": "error",
    "element-permitted-content": "error",
    "element-permitted-occurrences": "error",
    "element-permitted-order": "error",
    "element-permitted-parent": "error",
    "element-required-ancestor": "error",
    "element-required-attributes": "error",
    "element-required-content": "error",
    "map-dup-name": "error",
    "map-id-name": "error",
    "multiple-labeled-controls": "error",
    "no-abstract-role": "error",
    "no-deprecated-attr": "error",
    "no-dup-attr": "error",
    "no-dup-id": "error",
    "no-multiple-main": "error",
    "no-raw-characters": ["error", { relaxed: true }],
    "no-unused-disable": "error",
    "script-element": "error",
    "unrecognized-char-ref": "error",
    "valid-autocomplete": "error",
    "valid-id": ["error", { relaxed: true }],
    "void-content": "error"
  }
};
var standard = config;
var presets = {
  "html-validate:a11y": a11y,
  "html-validate:document": document,
  "html-validate:prettier": prettier,
  "html-validate:recommended": recommended,
  "html-validate:standard": standard,
  /* @deprecated aliases */
  "htmlvalidate:recommended": recommended,
  "htmlvalidate:document": document,
  "html-validate:a17y": a11y
};
var Presets = presets;
var ResolvedConfig = class {
  /**
   * @internal
   */
  constructor({ metaTable, plugins, rules, transformers }, original) {
    this.metaTable = metaTable;
    this.plugins = plugins;
    this.rules = rules;
    this.transformers = transformers;
    this.original = original;
  }
  /**
   * Returns the (merged) configuration data used to create this resolved
   * configuration.
   */
  getConfigData() {
    return this.original;
  }
  getMetaTable() {
    return this.metaTable;
  }
  getPlugins() {
    return this.plugins;
  }
  getRules() {
    return this.rules;
  }
  /**
   * Transform a source.
   *
   * When transforming zero or more new sources will be generated.
   *
   * @param source - Current source to transform.
   * @param filename - If set it is the filename used to match
   * transformer. Default is to use filename from source.
   * @returns A list of transformed sources ready for validation.
   */
  transformSource(source, filename) {
    const transformer = this.findTransformer(filename ?? source.filename);
    const context = {
      hasChain: (filename2) => {
        return !!this.findTransformer(filename2);
      },
      chain: (source2, filename2) => {
        return this.transformSource(source2, filename2);
      }
    };
    if (transformer) {
      try {
        return Array.from(transformer.fn.call(context, source), (cur) => {
          cur.transformedBy ??= [];
          cur.transformedBy.push(transformer.name);
          return cur;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new NestedError(
          `When transforming "${source.filename}": ${message}`,
          ensureError(err)
        );
      }
    } else {
      return [source];
    }
  }
  /**
   * Wrapper around [[transformSource]] which reads a file before passing it
   * as-is to transformSource.
   *
   * @param filename - Filename to transform (according to configured
   * transformations)
   * @returns A list of transformed sources ready for validation.
   */
  transformFilename(filename) {
    const stdin = 0;
    const src = filename !== "/dev/stdin" ? filename : stdin;
    const data = import_fs.default.readFileSync(src, { encoding: "utf8" });
    const source = {
      data,
      filename,
      line: 1,
      column: 1,
      offset: 0,
      originalData: data
    };
    return this.transformSource(source);
  }
  /**
   * Returns true if a transformer matches given filename.
   */
  canTransform(filename) {
    const entry = this.findTransformer(filename);
    return !!entry;
  }
  findTransformer(filename) {
    const match = this.transformers.find((entry) => entry.pattern.test(filename));
    return match ?? null;
  }
};
function haveResolver(key, value) {
  return key in value;
}
function haveConfigResolver(value) {
  return haveResolver("resolveConfig", value);
}
function haveElementsResolver(value) {
  return haveResolver("resolveElements", value);
}
function havePluginResolver(value) {
  return haveResolver("resolvePlugin", value);
}
function haveTransformerResolver(value) {
  return haveResolver("resolveTransformer", value);
}
function resolveConfig(resolvers, id, options) {
  for (const resolver of resolvers.filter(haveConfigResolver)) {
    const config2 = resolver.resolveConfig(id, options);
    if (config2) {
      return config2;
    }
  }
  throw new UserError(`Failed to load configuration from "${id}"`);
}
function resolveElements(resolvers, id, options) {
  for (const resolver of resolvers.filter(haveElementsResolver)) {
    const elements = resolver.resolveElements(id, options);
    if (elements) {
      return elements;
    }
  }
  throw new UserError(`Failed to load elements from "${id}"`);
}
function resolvePlugin(resolvers, id, options) {
  for (const resolver of resolvers.filter(havePluginResolver)) {
    const plugin = resolver.resolvePlugin(id, options);
    if (plugin) {
      return plugin;
    }
  }
  throw new UserError(`Failed to load plugin from "${id}"`);
}
function resolveTransformer(resolvers, id, options) {
  for (const resolver of resolvers.filter(haveTransformerResolver)) {
    const transformer = resolver.resolveTransformer(id, options);
    if (transformer) {
      return transformer;
    }
  }
  throw new UserError(`Failed to load transformer from "${id}"`);
}
function staticResolver(map = {}) {
  const { elements = {}, configs = {}, plugins = {}, transformers = {} } = map;
  return {
    name: "static-qresolver",
    addElements(id, value) {
      elements[id] = value;
    },
    addConfig(id, value) {
      configs[id] = value;
    },
    addPlugin(id, value) {
      plugins[id] = value;
    },
    addTransformer(id, value) {
      transformers[id] = value;
    },
    resolveElements(id) {
      return elements[id] ?? null;
    },
    resolveConfig(id) {
      return configs[id] ?? null;
    },
    resolvePlugin(id) {
      return plugins[id] ?? null;
    },
    resolveTransformer(id) {
      return transformers[id] ?? null;
    }
  };
}
var ajv = new import_ajv.default({ strict: true, strictTuples: true, strictTypes: true });
ajv.addMetaSchema(ajvSchemaDraft);
var validator = ajv.compile(configurationSchema);
function overwriteMerge(a, b) {
  return b;
}
function mergeInternal(base, rhs) {
  const dst = deepmerge$1(base, { ...rhs, rules: {} });
  if (rhs.rules) {
    dst.rules = deepmerge$1(dst.rules, rhs.rules, { arrayMerge: overwriteMerge });
  }
  const root = Boolean(base.root) || Boolean(rhs.root);
  if (root) {
    dst.root = root;
  }
  return dst;
}
function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}
var Config = class _Config {
  /**
   * @internal
   */
  constructor(resolvers, options) {
    this.transformers = [];
    const initial = {
      extends: [],
      plugins: [],
      rules: {},
      transform: {}
    };
    this.config = mergeInternal(initial, options);
    this.configurations = /* @__PURE__ */ new Map();
    this.initialized = false;
    this.resolvers = toArray(resolvers);
    this.metaTable = null;
    this.plugins = [];
  }
  /**
   * Create a new blank configuration. See also `Config.defaultConfig()`.
   */
  static empty() {
    return _Config.create([], {
      extends: [],
      rules: {},
      plugins: [],
      transform: {}
    });
  }
  /**
   * Create configuration from object.
   */
  static fromObject(resolvers, options, filename = null) {
    _Config.validate(options, filename);
    return _Config.create(resolvers, options);
  }
  /**
   * Read configuration from filename.
   *
   * Note: this reads configuration data from a file. If you intent to load
   * configuration for a file to validate use `ConfigLoader.fromTarget()`.
   *
   * @internal
   * @param filename - The file to read from
   */
  static fromFile(resolvers, filename) {
    const configData = resolveConfig(toArray(resolvers), filename, { cache: false });
    return _Config.fromObject(resolvers, configData, filename);
  }
  /**
   * Validate configuration data.
   *
   * Throws SchemaValidationError if invalid.
   *
   * @internal
   */
  static validate(configData, filename = null) {
    const valid = validator(configData);
    if (!valid) {
      throw new SchemaValidationError(
        filename,
        `Invalid configuration`,
        configData,
        configurationSchema,
        /* istanbul ignore next: will be set when a validation error has occurred */
        validator.errors ?? []
      );
    }
    if (configData.rules) {
      const normalizedRules = _Config.getRulesObject(configData.rules);
      for (const [ruleId, [, ruleOptions]] of normalizedRules.entries()) {
        const cls = bundledRules[ruleId];
        const path = `/rules/${ruleId}/1`;
        Rule.validateOptions(cls, ruleId, path, ruleOptions, filename, configData);
      }
    }
  }
  /**
   * Load a default configuration object.
   */
  static defaultConfig() {
    return _Config.create([], defaultConfig);
  }
  /**
   * @internal
   */
  static create(resolvers, options) {
    const instance = new _Config(resolvers, options);
    instance.plugins = instance.loadPlugins(instance.config.plugins ?? []);
    instance.configurations = instance.loadConfigurations(instance.plugins);
    instance.extendMeta(instance.plugins);
    instance.config = instance.extendConfig(instance.config.extends ?? []);
    instance.config.extends = [];
    if (options.rules) {
      instance.config = mergeInternal(instance.config, { rules: options.rules });
    }
    return instance;
  }
  /**
   * Initialize plugins, transforms etc.
   *
   * Must be called before trying to use config. Can safely be called multiple
   * times.
   *
   * @public
   */
  init() {
    if (this.initialized) {
      return;
    }
    this.transformers = this.precompileTransformers(this.config.transform ?? {});
    this.initialized = true;
  }
  /**
   * Returns true if this configuration is marked as "root".
   */
  isRootFound() {
    return Boolean(this.config.root);
  }
  /**
   * Returns a new configuration as a merge of the two. Entries from the passed
   * object takes priority over this object.
   *
   * @public
   * @param rhs - Configuration to merge with this one.
   */
  merge(resolvers, rhs) {
    return _Config.create(resolvers, mergeInternal(this.config, rhs.config));
  }
  extendConfig(entries) {
    if (entries.length === 0) {
      return this.config;
    }
    let base = {};
    for (const entry of entries) {
      let extended;
      if (this.configurations.has(entry)) {
        extended = this.configurations.get(entry);
      } else {
        extended = _Config.fromFile(this.resolvers, entry).config;
      }
      base = mergeInternal(base, extended);
    }
    return mergeInternal(base, this.config);
  }
  /**
   * Get element metadata.
   *
   * @internal
   */
  getMetaTable() {
    if (this.metaTable) {
      return this.metaTable;
    }
    const metaTable = new MetaTable();
    const source = this.config.elements ?? ["html5"];
    for (const plugin of this.getPlugins()) {
      if (plugin.elementSchema) {
        metaTable.extendValidationSchema(plugin.elementSchema);
      }
    }
    for (const entry of source) {
      if (typeof entry !== "string") {
        metaTable.loadFromObject(entry);
        continue;
      }
      const bundled = bundledElements[entry];
      if (bundled) {
        metaTable.loadFromObject(bundled);
        continue;
      }
      try {
        const data = resolveElements(this.resolvers, entry, { cache: false });
        metaTable.loadFromObject(data, entry);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new ConfigError(
          `Failed to load elements from "${entry}": ${message}`,
          ensureError(err)
        );
      }
    }
    metaTable.init();
    return this.metaTable = metaTable;
  }
  /**
   * Get a copy of internal configuration data.
   *
   * @internal primary purpose is unittests
   */
  /* istanbul ignore next: used for testing only */
  get() {
    return { ...this.config };
  }
  /**
   * Get all configured rules, their severity and options.
   *
   * @internal
   */
  getRules() {
    return _Config.getRulesObject(this.config.rules ?? {});
  }
  static getRulesObject(src) {
    const rules = /* @__PURE__ */ new Map();
    for (const [ruleId, data] of Object.entries(src)) {
      let options = data;
      if (!Array.isArray(options)) {
        options = [options, {}];
      } else if (options.length === 1) {
        options = [options[0], {}];
      }
      const severity = parseSeverity(options[0]);
      rules.set(ruleId, [severity, options[1]]);
    }
    return rules;
  }
  /**
   * Get all configured plugins.
   *
   * @internal
   */
  getPlugins() {
    return this.plugins;
  }
  loadPlugins(plugins) {
    return plugins.map((moduleName, index) => {
      if (typeof moduleName !== "string") {
        const plugin = moduleName;
        plugin.name = plugin.name || `:unnamedPlugin@${String(index + 1)}`;
        plugin.originalName = `:unnamedPlugin@${String(index + 1)}`;
        return plugin;
      }
      try {
        const plugin = resolvePlugin(this.resolvers, moduleName, { cache: true });
        plugin.name = plugin.name || moduleName;
        plugin.originalName = moduleName;
        return plugin;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new ConfigError(
          `Failed to load plugin "${moduleName}": ${message}`,
          ensureError(err)
        );
      }
    });
  }
  loadConfigurations(plugins) {
    const configs = /* @__PURE__ */ new Map();
    for (const [name, config2] of Object.entries(Presets)) {
      _Config.validate(config2, name);
      configs.set(name, config2);
    }
    for (const plugin of plugins) {
      for (const [name, config2] of Object.entries(plugin.configs ?? {})) {
        if (!config2)
          continue;
        _Config.validate(config2, name);
        configs.set(`${plugin.name}:${name}`, config2);
        if (plugin.name !== plugin.originalName) {
          configs.set(`${plugin.originalName}:${name}`, config2);
        }
      }
    }
    return configs;
  }
  extendMeta(plugins) {
    for (const plugin of plugins) {
      if (!plugin.elementSchema) {
        continue;
      }
      const { properties: properties2 } = plugin.elementSchema;
      if (!properties2) {
        continue;
      }
      for (const [raw, schema2] of Object.entries(properties2)) {
        const key = raw;
        if (schema2.copyable && !MetaCopyableProperty.includes(key)) {
          MetaCopyableProperty.push(key);
        }
      }
    }
  }
  /**
   * Resolve all configuration and return a [[ResolvedConfig]] instance.
   *
   * A resolved configuration will merge all extended configs and load all
   * plugins and transformers, and normalize the rest of the configuration.
   *
   * @public
   */
  resolve() {
    return new ResolvedConfig(this.resolveData(), this.get());
  }
  /**
   * Same as [[resolve]] but returns the raw configuration data instead of
   * [[ResolvedConfig]] instance. Mainly used for testing.
   *
   * @internal
   */
  resolveData() {
    return {
      metaTable: this.getMetaTable(),
      plugins: this.getPlugins(),
      rules: this.getRules(),
      transformers: this.transformers
    };
  }
  precompileTransformers(transform) {
    return Object.entries(transform).map(([pattern, name]) => {
      try {
        const fn = this.getTransformFunction(name);
        const version2 = fn.api ?? 0;
        if (version2 !== TRANSFORMER_API.VERSION) {
          throw new ConfigError(
            `Transformer uses API version ${String(version2)} but only version ${String(TRANSFORMER_API.VERSION)} is supported`
          );
        }
        return {
          // eslint-disable-next-line security/detect-non-literal-regexp -- expected to be a regexp
          pattern: new RegExp(pattern),
          name,
          fn
        };
      } catch (err) {
        if (err instanceof ConfigError) {
          throw new ConfigError(`Failed to load transformer "${name}": ${err.message}`, err);
        } else {
          throw new ConfigError(`Failed to load transformer "${name}"`, ensureError(err));
        }
      }
    });
  }
  /**
   * Get transformation function requested by configuration.
   *
   * Searches:
   *
   * - Named transformers from plugins.
   * - Unnamed transformer from plugin.
   * - Standalone modules (local or node_modules)
   *
   * @param name - Key from configuration
   */
  getTransformFunction(name) {
    const match = name.match(/(.*):(.*)/);
    if (match) {
      const [, pluginName, key] = match;
      return this.getNamedTransformerFromPlugin(name, pluginName, key);
    }
    const plugin = this.plugins.find((cur) => cur.name === name);
    if (plugin) {
      return this.getUnnamedTransformerFromPlugin(name, plugin);
    }
    return this.getTransformerFromModule(name);
  }
  /**
   * @param name - Original name from configuration
   * @param pluginName - Name of plugin
   * @param key - Name of transform (from plugin)
   */
  getNamedTransformerFromPlugin(name, pluginName, key) {
    const plugin = this.plugins.find((cur) => cur.name === pluginName);
    if (!plugin) {
      throw new ConfigError(`No plugin named "${pluginName}" has been loaded`);
    }
    if (!plugin.transformer) {
      throw new ConfigError(`Plugin does not expose any transformer`);
    }
    if (typeof plugin.transformer === "function") {
      throw new ConfigError(
        `Transformer "${name}" refers to named transformer but plugin exposes only unnamed, use "${pluginName}" instead.`
      );
    }
    const transformer = plugin.transformer[key];
    if (!transformer) {
      throw new ConfigError(`Plugin "${pluginName}" does not expose a transformer named "${key}".`);
    }
    return transformer;
  }
  /**
   * @param name - Original name from configuration
   * @param plugin - Plugin instance
   */
  getUnnamedTransformerFromPlugin(name, plugin) {
    if (!plugin.transformer) {
      throw new ConfigError(`Plugin does not expose any transformer`);
    }
    if (typeof plugin.transformer !== "function") {
      if (plugin.transformer.default) {
        return plugin.transformer.default;
      }
      throw new ConfigError(
        `Transformer "${name}" refers to unnamed transformer but plugin exposes only named.`
      );
    }
    return plugin.transformer;
  }
  getTransformerFromModule(name) {
    return resolveTransformer(this.resolvers, name, { cache: true });
  }
};
var ConfigLoader = class {
  constructor(resolvers, config2) {
    const defaults2 = Config.empty();
    this.resolvers = resolvers;
    this.globalConfig = defaults2.merge(
      this.resolvers,
      config2 ? this.loadFromObject(config2) : this.defaultConfig()
    );
  }
  /**
   * @internal For testing only
   */
  _getGlobalConfig() {
    return this.globalConfig.get();
  }
  empty() {
    return Config.empty();
  }
  loadFromObject(options, filename) {
    return Config.fromObject(this.resolvers, options, filename);
  }
  loadFromFile(filename) {
    return Config.fromFile(this.resolvers, filename);
  }
};
function defineConfig(config2) {
  return config2;
}
var EventHandler = class {
  constructor() {
    this.listeners = {};
  }
  /**
   * Add an event listener.
   *
   * @param event - Event names (comma separated) or '*' for any event.
   * @param callback - Called any time even triggers.
   * @returns Unregistration function.
   */
  on(event, callback) {
    const { listeners } = this;
    const names = event.split(",").map((it) => it.trim());
    for (const name of names) {
      const list = listeners[name] ?? [];
      listeners[name] = list;
      list.push(callback);
    }
    return () => {
      for (const name of names) {
        const list = listeners[name];
        this.listeners[name] = list.filter((fn) => fn !== callback);
      }
    };
  }
  /**
   * Add a onetime event listener. The listener will automatically be removed
   * after being triggered once.
   *
   * @param event - Event names (comma separated) or '*' for any event.
   * @param callback - Called any time even triggers.
   * @returns Unregistration function.
   */
  once(event, callback) {
    const deregister = this.on(event, (event2, data) => {
      callback(event2, data);
      deregister();
    });
    return deregister;
  }
  /**
   * Trigger event causing all listeners to be called.
   *
   * @param event - Event name.
   * @param data - Event data.
   */
  trigger(event, data) {
    for (const listener of this.getCallbacks(event)) {
      listener.call(null, event, data);
    }
  }
  getCallbacks(event) {
    const { listeners } = this;
    const callbacks = listeners[event] ?? [];
    const global = listeners["*"] ?? [];
    return [...callbacks, ...global];
  }
};
var regexp = /<!(?:--)?\[(.*?)\](?:--)?>/g;
function* parseConditionalComment(comment, commentLocation) {
  let match;
  while ((match = regexp.exec(comment)) !== null) {
    const expression = match[1];
    const begin = match.index;
    const end = begin + match[0].length;
    const location = sliceLocation(commentLocation, begin, end, comment);
    yield {
      expression,
      location
    };
  }
}
var ParserError = class extends Error {
  constructor(location, message) {
    super(message);
    this.location = location;
  }
};
function isAttrValueToken(token) {
  return Boolean(token && token.type === TokenType.ATTR_VALUE);
}
function svgShouldRetainTag(foreignTagName, tagName) {
  return foreignTagName === "svg" && ["title", "desc"].includes(tagName);
}
function isValidDirective(action) {
  const validActions = ["enable", "disable", "disable-block", "disable-next"];
  return validActions.includes(action);
}
var Parser = class {
  /**
   * Create a new parser instance.
   *
   * @public
   * @param config - Configuration
   */
  constructor(config2) {
    this.currentNamespace = "";
    this.event = new EventHandler();
    this.dom = null;
    this.metaTable = config2.getMetaTable();
  }
  /**
   * Parse HTML markup.
   *
   * @public
   * @param source - HTML markup.
   * @returns DOM tree representing the HTML markup.
   */
  parseHtml(source) {
    if (typeof source === "string") {
      source = {
        data: source,
        filename: "inline",
        line: 1,
        column: 1,
        offset: 0
      };
    }
    this.trigger("parse:begin", {
      location: null
    });
    this.dom = new DOMTree({
      filename: source.filename,
      offset: source.offset,
      line: source.line,
      column: source.column,
      size: 0
    });
    this.trigger("dom:load", {
      source,
      location: null
    });
    const lexer = new Lexer();
    const tokenStream = lexer.tokenize(source);
    let it = this.next(tokenStream);
    while (!it.done) {
      const token = it.value;
      this.consume(source, token, tokenStream);
      it = this.next(tokenStream);
    }
    this.dom.resolveMeta(this.metaTable);
    this.dom.root.cacheEnable();
    this.trigger("dom:ready", {
      document: this.dom,
      source,
      /* disable location for this event so rules can use implicit node location
       * instead */
      location: null
    });
    this.trigger("parse:end", {
      location: null
    });
    return this.dom.root;
  }
  /**
   * Detect optional end tag.
   *
   * Some tags have optional end tags (e.g. <ul><li>foo<li>bar</ul> is
   * valid). The parser handles this by checking if the element on top of the
   * stack when is allowed to omit.
   */
  closeOptional(token) {
    var _a2;
    const active = this.dom.getActive();
    if (!((_a2 = active.meta) == null ? void 0 : _a2.implicitClosed)) {
      return false;
    }
    const tagName = token.data[2];
    const open = !token.data[1];
    const meta = active.meta.implicitClosed;
    if (open) {
      return meta.includes(tagName);
    } else {
      if (active.is(tagName)) {
        return false;
      }
      return Boolean(active.parent && active.parent.is(tagName) && meta.includes(active.tagName));
    }
  }
  /**
   * @internal
   */
  /* eslint-disable-next-line complexity -- there isn't really a good other way to structure this method (that is still readable) */
  consume(source, token, tokenStream) {
    switch (token.type) {
      case TokenType.UNICODE_BOM:
        break;
      case TokenType.TAG_OPEN:
        this.consumeTag(source, token, tokenStream);
        break;
      case TokenType.WHITESPACE:
        this.trigger("whitespace", {
          text: token.data[0],
          location: token.location
        });
        this.appendText(token.data[0], token.location);
        break;
      case TokenType.DIRECTIVE:
        this.consumeDirective(token);
        break;
      case TokenType.CONDITIONAL:
        this.consumeConditional(token);
        break;
      case TokenType.COMMENT:
        this.consumeComment(token);
        break;
      case TokenType.DOCTYPE_OPEN:
        this.consumeDoctype(token, tokenStream);
        break;
      case TokenType.TEXT:
      case TokenType.TEMPLATING:
        this.appendText(token.data[0], token.location);
        break;
      case TokenType.EOF:
        this.closeTree(source, token.location);
        break;
    }
  }
  /**
   * @internal
   */
  /* eslint-disable-next-line complexity, sonarjs/cognitive-complexity -- technical debt, chould be refactored a bit */
  consumeTag(source, startToken, tokenStream) {
    const tokens = Array.from(
      this.consumeUntil(tokenStream, TokenType.TAG_CLOSE, startToken.location)
    );
    const endToken = tokens.slice(-1)[0];
    const closeOptional = this.closeOptional(startToken);
    const parent = closeOptional ? this.dom.getActive().parent : this.dom.getActive();
    const node = HtmlElement.fromTokens(
      startToken,
      endToken,
      parent,
      this.metaTable,
      this.currentNamespace
    );
    const isStartTag = !startToken.data[1];
    const isClosing = !isStartTag || node.closed !== NodeClosed.Open;
    const isForeign = node.meta && node.meta.foreign;
    if (closeOptional) {
      const active = this.dom.getActive();
      active.closed = NodeClosed.ImplicitClosed;
      this.closeElement(source, node, active, startToken.location);
      this.dom.popActive();
    }
    if (isStartTag) {
      this.dom.pushActive(node);
      this.trigger("tag:start", {
        target: node,
        location: startToken.location
      });
    }
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      switch (token.type) {
        case TokenType.WHITESPACE:
          break;
        case TokenType.ATTR_NAME:
          this.consumeAttribute(source, node, token, tokens[i + 1]);
          break;
      }
    }
    if (isStartTag) {
      this.trigger("tag:ready", {
        target: node,
        location: endToken.location
      });
    }
    if (isClosing) {
      const active = this.dom.getActive();
      if (!isStartTag) {
        node.closed = NodeClosed.EndTag;
      }
      this.closeElement(source, node, active, endToken.location);
      const voidClosed = !isStartTag && node.voidElement;
      if (!voidClosed) {
        this.dom.popActive();
      }
    } else if (isForeign) {
      this.discardForeignBody(source, node.tagName, tokenStream, startToken.location);
    }
  }
  /**
   * @internal
   */
  closeElement(source, node, active, location) {
    this.processElement(active, source);
    const event = {
      target: node,
      previous: active,
      location
    };
    this.trigger("tag:end", event);
    if (active && !active.isRootElement()) {
      this.trigger("element:ready", {
        target: active,
        location: active.location
      });
    }
  }
  processElement(node, source) {
    var _a2;
    node.cacheEnable();
    if ((_a2 = source.hooks) == null ? void 0 : _a2.processElement) {
      const processElement = source.hooks.processElement;
      const metaTable = this.metaTable;
      const context = {
        getMetaFor(tagName) {
          return metaTable.getMetaFor(tagName);
        }
      };
      processElement.call(context, node);
    }
  }
  /**
   * Discard tokens until the end tag for the foreign element is found.
   *
   * @internal
   */
  discardForeignBody(source, foreignTagName, tokenStream, errorLocation) {
    let nested = 1;
    let startToken;
    let endToken;
    do {
      const tokens = Array.from(this.consumeUntil(tokenStream, TokenType.TAG_OPEN, errorLocation));
      const [last] = tokens.slice(-1);
      const [, tagClosed, tagName] = last.data;
      if (!tagClosed && svgShouldRetainTag(foreignTagName, tagName)) {
        const oldNamespace = this.currentNamespace;
        this.currentNamespace = "svg";
        this.consumeTag(source, last, tokenStream);
        this.consumeUntilMatchingTag(source, tokenStream, tagName);
        this.currentNamespace = oldNamespace;
        continue;
      }
      if (tagName !== foreignTagName) {
        continue;
      }
      const endTokens = Array.from(
        this.consumeUntil(tokenStream, TokenType.TAG_CLOSE, last.location)
      );
      endToken = endTokens.slice(-1)[0];
      const selfClosed = endToken.data[0] === "/>";
      if (tagClosed) {
        startToken = last;
        nested--;
      } else if (!selfClosed) {
        nested++;
      }
    } while (nested > 0);
    if (!startToken || !endToken) {
      return;
    }
    const active = this.dom.getActive();
    const node = HtmlElement.fromTokens(startToken, endToken, active, this.metaTable);
    this.closeElement(source, node, active, endToken.location);
    this.dom.popActive();
  }
  /**
   * @internal
   */
  consumeAttribute(source, node, token, next) {
    var _a2;
    const { meta } = node;
    const keyLocation = this.getAttributeKeyLocation(token);
    const valueLocation = this.getAttributeValueLocation(next);
    const location = this.getAttributeLocation(token, next);
    const haveValue = isAttrValueToken(next);
    const attrData = {
      key: token.data[1],
      value: null,
      quote: null
    };
    if (haveValue) {
      const [, , value, quote] = next.data;
      attrData.value = value;
      attrData.quote = quote ?? null;
    }
    let processAttribute = (attr) => [attr];
    if ((_a2 = source.hooks) == null ? void 0 : _a2.processAttribute) {
      processAttribute = source.hooks.processAttribute;
    }
    let iterator;
    const legacy = processAttribute.call({}, attrData);
    if (typeof legacy[Symbol.iterator] !== "function") {
      iterator = [attrData];
    } else {
      iterator = legacy;
    }
    for (const attr of iterator) {
      const event = {
        target: node,
        key: attr.key,
        value: attr.value,
        quote: attr.quote,
        originalAttribute: attr.originalAttribute,
        location,
        keyLocation,
        valueLocation,
        meta: (meta == null ? void 0 : meta.attributes[attr.key]) ?? null
      };
      this.trigger("attr", event);
      node.setAttribute(attr.key, attr.value, keyLocation, valueLocation, attr.originalAttribute);
    }
  }
  /**
   * Takes attribute key token an returns location.
   */
  getAttributeKeyLocation(token) {
    return token.location;
  }
  /**
   * Take attribute value token and return a new location referring to only the
   * value.
   *
   * foo="bar"    foo='bar'    foo=bar    foo      foo=""
   *      ^^^          ^^^         ^^^    (null)   (null)
   */
  getAttributeValueLocation(token) {
    if (!token || token.type !== TokenType.ATTR_VALUE || token.data[2] === "") {
      return null;
    }
    const quote = token.data[3];
    if (quote) {
      return sliceLocation(token.location, 2, -1);
    } else {
      return sliceLocation(token.location, 1);
    }
  }
  /**
   * Take attribute key and value token an returns a new location referring to
   * an aggregate location covering key, quotes if present and value.
   */
  getAttributeLocation(key, value) {
    const begin = key.location;
    const end = value && value.type === TokenType.ATTR_VALUE ? value.location : void 0;
    return {
      filename: begin.filename,
      line: begin.line,
      column: begin.column,
      size: begin.size + ((end == null ? void 0 : end.size) ?? 0),
      offset: begin.offset
    };
  }
  /**
   * @internal
   */
  consumeDirective(token) {
    const [text, preamble, action, separator1, directive, postamble] = token.data;
    if (!postamble.startsWith("]")) {
      throw new ParserError(token.location, `Missing end bracket "]" on directive "${text}"`);
    }
    const match = directive.match(/^(.*?)(?:(\s*(?:--|:)\s*)(.*))?$/);
    if (!match) {
      throw new Error(`Failed to parse directive "${text}"`);
    }
    if (!isValidDirective(action)) {
      throw new ParserError(token.location, `Unknown directive "${action}"`);
    }
    const [, data, separator2, comment] = match;
    const prefix = "html-validate-";
    const actionOffset = preamble.length;
    const optionsOffset = actionOffset + action.length + separator1.length;
    const commentOffset = optionsOffset + data.length + (separator2 || "").length;
    const location = sliceLocation(
      token.location,
      preamble.length - prefix.length - 1,
      -postamble.length + 1
    );
    const actionLocation = sliceLocation(
      token.location,
      actionOffset,
      actionOffset + action.length
    );
    const optionsLocation = data ? sliceLocation(token.location, optionsOffset, optionsOffset + data.length) : void 0;
    const commentLocation = comment ? sliceLocation(token.location, commentOffset, commentOffset + comment.length) : void 0;
    this.trigger("directive", {
      action,
      data,
      comment: comment || "",
      location,
      actionLocation,
      optionsLocation,
      commentLocation
    });
  }
  /**
   * Consumes conditional comment in tag form.
   *
   * See also the related [[consumeCommend]] method.
   *
   * @internal
   */
  consumeConditional(token) {
    const element = this.dom.getActive();
    this.trigger("conditional", {
      condition: token.data[1],
      location: token.location,
      parent: element
    });
  }
  /**
   * Consumes comment token.
   *
   * Tries to find IE conditional comments and emits conditional token if
   * found. See also the related [[consumeConditional]] method.
   *
   * @internal
   */
  consumeComment(token) {
    const comment = token.data[0];
    const element = this.dom.getActive();
    for (const conditional of parseConditionalComment(comment, token.location)) {
      this.trigger("conditional", {
        condition: conditional.expression,
        location: conditional.location,
        parent: element
      });
    }
  }
  /**
   * Consumes doctype tokens. Emits doctype event.
   *
   * @internal
   */
  consumeDoctype(startToken, tokenStream) {
    const tokens = Array.from(
      this.consumeUntil(tokenStream, TokenType.DOCTYPE_CLOSE, startToken.location)
    );
    const doctype = tokens[0];
    const value = doctype.data[0];
    this.dom.doctype = value;
    this.trigger("doctype", {
      tag: startToken.data[1],
      value,
      valueLocation: tokens[0].location,
      location: startToken.location
    });
  }
  /**
   * Return a list of tokens found until the expected token was found.
   *
   * @internal
   * @param errorLocation - What location to use if an error occurs
   */
  *consumeUntil(tokenStream, search, errorLocation) {
    let it = this.next(tokenStream);
    while (!it.done) {
      const token = it.value;
      yield token;
      if (token.type === search)
        return;
      it = this.next(tokenStream);
    }
    throw new ParserError(
      errorLocation,
      `stream ended before ${TokenType[search]} token was found`
    );
  }
  /**
   * Consumes tokens until a matching close-tag is found. Tags are appended to
   * the document.
   *
   * @internal
   */
  consumeUntilMatchingTag(source, tokenStream, searchTag) {
    let numOpen = 1;
    let it = this.next(tokenStream);
    while (!it.done) {
      const token = it.value;
      this.consume(source, token, tokenStream);
      if (token.type === TokenType.TAG_OPEN) {
        const [, close, tagName] = token.data;
        if (tagName === searchTag) {
          if (close) {
            numOpen--;
          } else {
            numOpen++;
          }
          if (numOpen === 0) {
            return;
          }
        }
      }
      it = this.next(tokenStream);
    }
  }
  next(tokenStream) {
    const it = tokenStream.next();
    if (!it.done) {
      const token = it.value;
      this.trigger("token", {
        location: token.location,
        type: token.type,
        data: Array.from(token.data),
        token
      });
    }
    return it;
  }
  on(event, listener) {
    return this.event.on(event, listener);
  }
  once(event, listener) {
    return this.event.once(event, listener);
  }
  /**
   * Defer execution. Will call function sometime later.
   *
   * @internal
   * @param cb - Callback to execute later.
   */
  defer(cb) {
    this.event.once("*", cb);
  }
  trigger(event, data) {
    if (typeof data.location === "undefined") {
      throw new Error("Triggered event must contain location");
    }
    this.event.trigger(event, data);
  }
  /**
   * @internal
   */
  getEventHandler() {
    return this.event;
  }
  /**
   * Appends a text node to the current element on the stack.
   */
  appendText(text, location) {
    this.dom.getActive().appendText(text, location);
  }
  /**
   * Trigger close events for any still open elements.
   */
  closeTree(source, location) {
    let active;
    while ((active = this.dom.getActive()) && !active.isRootElement()) {
      this.closeElement(source, null, active, location);
      this.dom.popActive();
    }
  }
};
function isThenable(value) {
  return value && typeof value === "object" && "then" in value && typeof value.then === "function";
}
var ruleIds = new Set(Object.keys(bundledRules));
function ruleExists(ruleId) {
  return ruleIds.has(ruleId);
}
function freeze(src) {
  return {
    ...src,
    selector: src.selector()
  };
}
function isThenableArray(value) {
  if (value.length === 0) {
    return false;
  }
  return isThenable(value[0]);
}
var Reporter = class {
  constructor() {
    this.result = {};
  }
  static merge(reports) {
    if (isThenable(reports)) {
      return reports.then((reports2) => this.merge(reports2));
    }
    if (isThenableArray(reports)) {
      return Promise.all(reports).then((reports2) => this.merge(reports2));
    }
    const valid = reports.every((report) => report.valid);
    const merged = {};
    reports.forEach((report) => {
      report.results.forEach((result) => {
        const key = result.filePath;
        if (key in merged) {
          merged[key].messages = [...merged[key].messages, ...result.messages];
        } else {
          merged[key] = { ...result };
        }
      });
    });
    const results = Object.values(merged).map((result) => {
      result.errorCount = countErrors(result.messages);
      result.warningCount = countWarnings(result.messages);
      return result;
    });
    return {
      valid,
      results,
      errorCount: sumErrors(results),
      warningCount: sumWarnings(results)
    };
  }
  add(rule, message, severity, node, location, context) {
    var _a2;
    if (!(location.filename in this.result)) {
      this.result[location.filename] = [];
    }
    const ruleUrl = (_a2 = rule.documentation(context)) == null ? void 0 : _a2.url;
    const entry = {
      ruleId: rule.name,
      severity,
      message,
      offset: location.offset,
      line: location.line,
      column: location.column,
      size: location.size || 0,
      selector() {
        return node ? node.generateSelector() : null;
      }
    };
    if (ruleUrl) {
      entry.ruleUrl = ruleUrl;
    }
    if (context) {
      entry.context = context;
    }
    this.result[location.filename].push(entry);
  }
  addManual(filename, message) {
    if (!(filename in this.result)) {
      this.result[filename] = [];
    }
    this.result[filename].push(message);
  }
  save(sources) {
    const report = {
      valid: this.isValid(),
      results: Object.keys(this.result).map((filePath) => {
        const messages = Array.from(this.result[filePath], freeze).sort(messageSort);
        const source = (sources ?? []).find((source2) => filePath === source2.filename);
        return {
          filePath,
          messages,
          errorCount: countErrors(messages),
          warningCount: countWarnings(messages),
          source: source ? source.originalData ?? source.data : null
        };
      }),
      errorCount: 0,
      warningCount: 0
    };
    report.errorCount = sumErrors(report.results);
    report.warningCount = sumWarnings(report.results);
    return report;
  }
  isValid() {
    const numErrors = Object.values(this.result).reduce((sum, messages) => {
      return sum + countErrors(messages);
    }, 0);
    return numErrors === 0;
  }
};
function countErrors(messages) {
  return messages.filter((m) => m.severity === Number(Severity.ERROR)).length;
}
function countWarnings(messages) {
  return messages.filter((m) => m.severity === Number(Severity.WARN)).length;
}
function sumErrors(results) {
  return results.reduce((sum, result) => {
    return sum + result.errorCount;
  }, 0);
}
function sumWarnings(results) {
  return results.reduce((sum, result) => {
    return sum + result.warningCount;
  }, 0);
}
function messageSort(a, b) {
  if (a.line < b.line) {
    return -1;
  }
  if (a.line > b.line) {
    return 1;
  }
  if (a.column < b.column) {
    return -1;
  }
  if (a.column > b.column) {
    return 1;
  }
  return 0;
}
var blockerCounter = 1;
function createBlocker() {
  const id = blockerCounter++;
  return id;
}
var Engine = class {
  constructor(config2, ParserClass) {
    this.report = new Reporter();
    this.config = config2;
    this.ParserClass = ParserClass;
    const result = this.initPlugins(this.config);
    this.availableRules = {
      ...bundledRules,
      ...result.availableRules
    };
  }
  /**
   * Lint sources and return report
   *
   * @param sources - Sources to lint.
   * @returns Report output.
   */
  lint(sources) {
    for (const source of sources) {
      const parser = this.instantiateParser();
      const { rules } = this.setupPlugins(source, this.config, parser);
      const noUnusedDisable = rules["no-unused-disable"];
      const directiveContext = {
        rules,
        reportUnused(rules2, unused, options, location2) {
          if (noUnusedDisable && !rules2.has(noUnusedDisable.name)) {
            noUnusedDisable.reportUnused(unused, options, location2);
          }
        }
      };
      const location = {
        filename: source.filename,
        line: 1,
        column: 1,
        offset: 0,
        size: 1
      };
      const configEvent = {
        location,
        config: this.config,
        rules
      };
      parser.trigger("config:ready", configEvent);
      const { hooks: _, ...sourceData } = source;
      const sourceEvent = {
        location,
        source: sourceData
      };
      parser.trigger("source:ready", sourceEvent);
      parser.on("directive", (_2, event) => {
        this.processDirective(event, parser, directiveContext);
      });
      try {
        parser.parseHtml(source);
      } catch (e) {
        if (e instanceof InvalidTokenError || e instanceof ParserError) {
          this.reportError("parser-error", e.message, e.location);
        } else {
          throw e;
        }
      }
    }
    return this.report.save(sources);
  }
  /**
   * Returns a list of all events generated while parsing the source.
   *
   * For verbosity, token events are ignored (use [[dumpTokens]] to inspect
   * token stream).
   */
  dumpEvents(source) {
    const parser = this.instantiateParser();
    const lines = [];
    parser.on("*", (event, data) => {
      if (event === "token") {
        return;
      }
      lines.push({ event, data });
    });
    source.forEach((src) => parser.parseHtml(src));
    return lines;
  }
  dumpTokens(source) {
    const lexer = new Lexer();
    const lines = [];
    for (const src of source) {
      for (const token of lexer.tokenize(src)) {
        const data = token.data[0] ?? "";
        const filename = token.location.filename;
        const line = String(token.location.line);
        const column = String(token.location.column);
        lines.push({
          token: TokenType[token.type],
          data,
          location: `${filename}:${line}:${column}`
        });
      }
    }
    return lines;
  }
  dumpTree(source) {
    const parser = this.instantiateParser();
    const document2 = parser.parseHtml(source[0]);
    const lines = [];
    function decoration(node) {
      let output = "";
      if (node.id) {
        output += `#${node.id}`;
      }
      if (node.hasAttribute("class")) {
        output += `.${node.classList.join(".")}`;
      }
      return output;
    }
    function writeNode(node, level, sibling) {
      if (node.parent) {
        const indent = "  ".repeat(level - 1);
        const l = node.childElements.length > 0 ? "\u252C" : "\u2500";
        const b = sibling < node.parent.childElements.length - 1 ? "\u251C" : "\u2514";
        lines.push(`${indent}${b}\u2500${l} ${node.tagName}${decoration(node)}`);
      } else {
        lines.push("(root)");
      }
      node.childElements.forEach((child, index) => {
        writeNode(child, level + 1, index);
      });
    }
    writeNode(document2, 0, 0);
    return lines;
  }
  /**
   * Get rule documentation.
   */
  getRuleDocumentation({
    ruleId,
    context
  }) {
    const rules = this.config.getRules();
    const ruleData = rules.get(ruleId);
    if (ruleData) {
      const [, options] = ruleData;
      const rule = this.instantiateRule(ruleId, options);
      return rule.documentation(context);
    } else {
      return null;
    }
  }
  /**
   * Create a new parser instance with the current configuration.
   *
   * @internal
   */
  instantiateParser() {
    return new this.ParserClass(this.config);
  }
  processDirective(event, parser, context) {
    const rules = event.data.split(",").map((name) => name.trim()).map((name) => context.rules[name]).filter((rule) => rule);
    const location = event.optionsLocation ?? event.location;
    switch (event.action) {
      case "enable":
        this.processEnableDirective(rules, parser);
        break;
      case "disable":
        this.processDisableDirective(rules, parser);
        break;
      case "disable-block":
        this.processDisableBlockDirective(context, rules, parser, event.data, location);
        break;
      case "disable-next":
        this.processDisableNextDirective(context, rules, parser, event.data, location);
        break;
    }
  }
  processEnableDirective(rules, parser) {
    for (const rule of rules) {
      rule.setEnabled(true);
      if (rule.getSeverity() === Severity.DISABLED) {
        rule.setServerity(Severity.ERROR);
      }
    }
    parser.on("tag:start", (event, data) => {
      data.target.enableRules(rules.map((rule) => rule.name));
    });
  }
  processDisableDirective(rules, parser) {
    for (const rule of rules) {
      rule.setEnabled(false);
    }
    parser.on("tag:start", (event, data) => {
      data.target.disableRules(rules.map((rule) => rule.name));
    });
  }
  processDisableBlockDirective(context, rules, parser, options, location) {
    const ruleIds2 = new Set(rules.map((it) => it.name));
    const unused = new Set(ruleIds2);
    const blocker = createBlocker();
    let directiveBlock = null;
    for (const rule of rules) {
      rule.block(blocker);
    }
    const unregisterOpen = parser.on("tag:start", (event, data) => {
      var _a2;
      if (directiveBlock === null) {
        directiveBlock = ((_a2 = data.target.parent) == null ? void 0 : _a2.unique) ?? null;
      }
      data.target.blockRules(ruleIds2, blocker);
    });
    const unregisterClose = parser.on("tag:end", (event, data) => {
      const lastNode = directiveBlock === null;
      const parentClosed = directiveBlock === data.previous.unique;
      if (lastNode || parentClosed) {
        unregisterClose();
        unregisterOpen();
        for (const rule of rules) {
          rule.unblock(blocker);
        }
      }
    });
    parser.on("rule:error", (event, data) => {
      if (data.blockers.includes(blocker)) {
        unused.delete(data.ruleId);
      }
    });
    parser.on("parse:end", () => {
      context.reportUnused(ruleIds2, unused, options, location);
    });
  }
  processDisableNextDirective(context, rules, parser, options, location) {
    const ruleIds2 = new Set(rules.map((it) => it.name));
    const unused = new Set(ruleIds2);
    const blocker = createBlocker();
    for (const rule of rules) {
      rule.block(blocker);
    }
    const unregister = parser.on("tag:start", (event, data) => {
      data.target.blockRules(ruleIds2, blocker);
    });
    parser.on("rule:error", (event, data) => {
      if (data.blockers.includes(blocker)) {
        unused.delete(data.ruleId);
      }
    });
    parser.on("parse:end", () => {
      context.reportUnused(ruleIds2, unused, options, location);
    });
    parser.once("tag:ready, tag:end, attr", () => {
      unregister();
      parser.defer(() => {
        for (const rule of rules) {
          rule.unblock(blocker);
        }
      });
    });
  }
  /*
   * Initialize all plugins. This should only be done once for all sessions.
   */
  initPlugins(config2) {
    for (const plugin of config2.getPlugins()) {
      if (plugin.init) {
        plugin.init();
      }
    }
    return {
      availableRules: this.initRules(config2)
    };
  }
  /**
   * Initializes all rules from plugins and returns an object with a mapping
   * between rule name and its constructor.
   */
  initRules(config2) {
    const availableRules = {};
    for (const plugin of config2.getPlugins()) {
      for (const [name, rule] of Object.entries(plugin.rules ?? {})) {
        if (!rule)
          continue;
        availableRules[name] = rule;
      }
    }
    return availableRules;
  }
  /**
   * Setup all plugins for this session.
   */
  setupPlugins(source, config2, parser) {
    const eventHandler = parser.getEventHandler();
    for (const plugin of config2.getPlugins()) {
      if (plugin.setup) {
        plugin.setup(source, eventHandler);
      }
    }
    return {
      rules: this.setupRules(config2, parser)
    };
  }
  /**
   * Load and setup all rules for current configuration.
   */
  setupRules(config2, parser) {
    const rules = {};
    for (const [ruleId, [severity, options]] of config2.getRules().entries()) {
      rules[ruleId] = this.loadRule(ruleId, config2, severity, options, parser, this.report);
    }
    return rules;
  }
  /**
   * Load and setup a rule using current config.
   */
  loadRule(ruleId, config2, severity, options, parser, report) {
    const meta = config2.getMetaTable();
    const rule = this.instantiateRule(ruleId, options);
    rule.name = ruleId;
    rule.init(parser, report, severity, meta);
    if (rule.setup) {
      rule.setup();
    }
    return rule;
  }
  instantiateRule(name, options) {
    if (this.availableRules[name]) {
      const RuleConstructor = this.availableRules[name];
      return new RuleConstructor(options);
    } else {
      return this.missingRule(name);
    }
  }
  missingRule(name) {
    return new class MissingRule extends Rule {
      setup() {
        this.on("dom:load", () => {
          this.report(null, `Definition for rule '${name}' was not found`);
        });
      }
    }();
  }
  reportError(ruleId, message, location) {
    this.report.addManual(location.filename, {
      ruleId,
      severity: Severity.ERROR,
      message,
      offset: location.offset,
      line: location.line,
      column: location.column,
      size: location.size,
      selector: () => null
    });
  }
};
var defaultResolvers = [];
function hasResolver(value) {
  return Array.isArray(value[0]);
}
var StaticConfigLoader = class extends ConfigLoader {
  constructor(...args) {
    if (hasResolver(args)) {
      const [resolvers, config2] = args;
      super(resolvers, config2);
    } else {
      const [config2] = args;
      super(defaultResolvers, config2);
    }
  }
  getConfigFor(_handle, configOverride) {
    const override = this.loadFromObject(configOverride ?? {});
    if (override.isRootFound()) {
      override.init();
      return override.resolve();
    }
    const merged = this.globalConfig.merge(this.resolvers, override);
    merged.init();
    return merged.resolve();
  }
  flushCache() {
  }
  defaultConfig() {
    return this.loadFromObject({
      extends: ["html-validate:recommended"],
      elements: ["html5"]
    });
  }
};
function isSourceHooks(value) {
  if (!value || typeof value === "string") {
    return false;
  }
  return Boolean(value.processAttribute || value.processElement);
}
function isConfigData(value) {
  if (!value || typeof value === "string") {
    return false;
  }
  return !(value.processAttribute || value.processElement);
}
var HtmlValidate = class {
  constructor(arg) {
    const [loader, config2] = arg instanceof ConfigLoader ? [arg, void 0] : [void 0, arg];
    this.configLoader = loader ?? new StaticConfigLoader(config2);
  }
  /* eslint-enable @typescript-eslint/unified-signatures */
  validateString(str, arg1, arg2, arg3) {
    const filename = typeof arg1 === "string" ? arg1 : "inline";
    const options = isConfigData(arg1) ? arg1 : isConfigData(arg2) ? arg2 : void 0;
    const hooks = isSourceHooks(arg1) ? arg1 : isSourceHooks(arg2) ? arg2 : arg3;
    const source = {
      data: str,
      filename,
      line: 1,
      column: 1,
      offset: 0,
      hooks
    };
    return this.validateSource(source, options);
  }
  /* eslint-enable @typescript-eslint/unified-signatures */
  validateStringSync(str, arg1, arg2, arg3) {
    const filename = typeof arg1 === "string" ? arg1 : "inline";
    const options = isConfigData(arg1) ? arg1 : isConfigData(arg2) ? arg2 : void 0;
    const hooks = isSourceHooks(arg1) ? arg1 : isSourceHooks(arg2) ? arg2 : arg3;
    const source = {
      data: str,
      filename,
      line: 1,
      column: 1,
      offset: 0,
      hooks
    };
    return this.validateSourceSync(source, options);
  }
  /**
   * Parse and validate HTML from [[Source]].
   *
   * @public
   * @param input - Source to parse.
   * @returns Report output.
   */
  async validateSource(input, configOverride) {
    const source = normalizeSource(input);
    const config2 = await this.getConfigFor(source.filename, configOverride);
    const transformedSource = config2.transformSource(source);
    const engine = new Engine(config2, Parser);
    return engine.lint(transformedSource);
  }
  /**
   * Parse and validate HTML from [[Source]].
   *
   * @public
   * @param input - Source to parse.
   * @returns Report output.
   */
  validateSourceSync(input, configOverride) {
    const source = normalizeSource(input);
    const config2 = this.getConfigForSync(source.filename, configOverride);
    const transformedSource = config2.transformSource(source);
    const engine = new Engine(config2, Parser);
    return engine.lint(transformedSource);
  }
  /**
   * Parse and validate HTML from file.
   *
   * @public
   * @param filename - Filename to read and parse.
   * @returns Report output.
   */
  async validateFile(filename) {
    const config2 = await this.getConfigFor(filename);
    const source = config2.transformFilename(filename);
    const engine = new Engine(config2, Parser);
    return Promise.resolve(engine.lint(source));
  }
  /**
   * Parse and validate HTML from file.
   *
   * @public
   * @param filename - Filename to read and parse.
   * @returns Report output.
   */
  validateFileSync(filename) {
    const config2 = this.getConfigForSync(filename);
    const source = config2.transformFilename(filename);
    const engine = new Engine(config2, Parser);
    return engine.lint(source);
  }
  /**
   * Parse and validate HTML from multiple files. Result is merged together to a
   * single report.
   *
   * @param filenames - Filenames to read and parse.
   * @returns Report output.
   */
  async validateMultipleFiles(filenames) {
    const report = Reporter.merge(filenames.map((filename) => this.validateFileSync(filename)));
    return Promise.resolve(report);
  }
  /**
   * Parse and validate HTML from multiple files. Result is merged together to a
   * single report.
   *
   * @param filenames - Filenames to read and parse.
   * @returns Report output.
   */
  validateMultipleFilesSync(filenames) {
    return Reporter.merge(filenames.map((filename) => this.validateFileSync(filename)));
  }
  /**
   * Returns true if the given filename can be validated.
   *
   * A file is considered to be validatable if the extension is `.html` or if a
   * transformer matches the filename.
   *
   * This is mostly useful for tooling to determine whenever to validate the
   * file or not. CLI tools will run on all the given files anyway.
   */
  async canValidate(filename) {
    if (filename.toLowerCase().endsWith(".html")) {
      return true;
    }
    const config2 = await this.getConfigFor(filename);
    return config2.canTransform(filename);
  }
  /**
   * Returns true if the given filename can be validated.
   *
   * A file is considered to be validatable if the extension is `.html` or if a
   * transformer matches the filename.
   *
   * This is mostly useful for tooling to determine whenever to validate the
   * file or not. CLI tools will run on all the given files anyway.
   */
  canValidateSync(filename) {
    if (filename.toLowerCase().endsWith(".html")) {
      return true;
    }
    const config2 = this.getConfigForSync(filename);
    return config2.canTransform(filename);
  }
  /**
   * Tokenize filename and output all tokens.
   *
   * Using CLI this is enabled with `--dump-tokens`. Mostly useful for
   * debugging.
   *
   * @internal
   * @param filename - Filename to tokenize.
   */
  dumpTokens(filename) {
    const config2 = this.getConfigForSync(filename);
    const source = config2.transformFilename(filename);
    const engine = new Engine(config2, Parser);
    return engine.dumpTokens(source);
  }
  /**
   * Parse filename and output all events.
   *
   * Using CLI this is enabled with `--dump-events`. Mostly useful for
   * debugging.
   *
   * @internal
   * @param filename - Filename to dump events from.
   */
  dumpEvents(filename) {
    const config2 = this.getConfigForSync(filename);
    const source = config2.transformFilename(filename);
    const engine = new Engine(config2, Parser);
    return engine.dumpEvents(source);
  }
  /**
   * Parse filename and output DOM tree.
   *
   * Using CLI this is enabled with `--dump-tree`. Mostly useful for
   * debugging.
   *
   * @internal
   * @param filename - Filename to dump DOM tree from.
   */
  dumpTree(filename) {
    const config2 = this.getConfigForSync(filename);
    const source = config2.transformFilename(filename);
    const engine = new Engine(config2, Parser);
    return engine.dumpTree(source);
  }
  /**
   * Transform filename and output source data.
   *
   * Using CLI this is enabled with `--dump-source`. Mostly useful for
   * debugging.
   *
   * @internal
   * @param filename - Filename to dump source from.
   */
  dumpSource(filename) {
    const config2 = this.getConfigForSync(filename);
    const sources = config2.transformFilename(filename);
    return sources.reduce((result, source) => {
      const line = String(source.line);
      const column = String(source.column);
      const offset = String(source.offset);
      result.push(`Source ${source.filename}@${line}:${column} (offset: ${offset})`);
      if (source.transformedBy) {
        result.push("Transformed by:");
        result = result.concat(source.transformedBy.reverse().map((name) => ` - ${name}`));
      }
      if (source.hooks && Object.keys(source.hooks).length > 0) {
        result.push("Hooks");
        for (const [key, present] of Object.entries(source.hooks)) {
          if (present) {
            result.push(` - ${key}`);
          }
        }
      }
      result.push("---");
      result = result.concat(source.data.split("\n"));
      result.push("---");
      return result;
    }, []);
  }
  /**
   * Get effective configuration schema.
   */
  getConfigurationSchema() {
    return configurationSchema;
  }
  /**
   * Get effective metadata element schema.
   *
   * If a filename is given the configured plugins can extend the
   * schema. Filename must not be an existing file or a filetype normally
   * handled by html-validate but the path will be used when resolving
   * configuration. As a rule-of-thumb, set it to the elements json file.
   */
  async getElementsSchema(filename) {
    const config2 = await this.getConfigFor(filename ?? "inline");
    const metaTable = config2.getMetaTable();
    return metaTable.getJSONSchema();
  }
  /**
   * Get effective metadata element schema.
   *
   * If a filename is given the configured plugins can extend the
   * schema. Filename must not be an existing file or a filetype normally
   * handled by html-validate but the path will be used when resolving
   * configuration. As a rule-of-thumb, set it to the elements json file.
   */
  getElementsSchemaSync(filename) {
    const config2 = this.getConfigForSync(filename ?? "inline");
    const metaTable = config2.getMetaTable();
    return metaTable.getJSONSchema();
  }
  async getContextualDocumentation(message, filenameOrConfig = "inline") {
    const config2 = typeof filenameOrConfig === "string" ? await this.getConfigFor(filenameOrConfig) : await filenameOrConfig;
    const engine = new Engine(config2, Parser);
    return engine.getRuleDocumentation(message);
  }
  getContextualDocumentationSync(message, filenameOrConfig = "inline") {
    const config2 = typeof filenameOrConfig === "string" ? this.getConfigForSync(filenameOrConfig) : filenameOrConfig;
    const engine = new Engine(config2, Parser);
    return engine.getRuleDocumentation(message);
  }
  /**
   * Get contextual documentation for the given rule.
   *
   * Typical usage:
   *
   * ```js
   * const report = await htmlvalidate.validateFile("my-file.html");
   * for (const result of report.results){
   *   const config = await htmlvalidate.getConfigFor(result.filePath);
   *   for (const message of result.messages){
   *     const documentation = await htmlvalidate.getRuleDocumentation(message.ruleId, config, message.context);
   *     // do something with documentation
   *   }
   * }
   * ```
   *
   * @public
   * @deprecated Deprecated since 8.0.0, use [[getContextualDocumentation]] instead.
   * @param ruleId - Rule to get documentation for.
   * @param config - If set it provides more accurate description by using the
   * correct configuration for the file.
   * @param context - If set to `Message.context` some rules can provide
   * contextual details and suggestions.
   */
  async getRuleDocumentation(ruleId, config2 = null, context = null) {
    const c = config2 ?? this.getConfigFor("inline");
    const engine = new Engine(await c, Parser);
    return engine.getRuleDocumentation({ ruleId, context });
  }
  /**
   * Get contextual documentation for the given rule.
   *
   * Typical usage:
   *
   * ```js
   * const report = htmlvalidate.validateFileSync("my-file.html");
   * for (const result of report.results){
   *   const config = htmlvalidate.getConfigForSync(result.filePath);
   *   for (const message of result.messages){
   *     const documentation = htmlvalidate.getRuleDocumentationSync(message.ruleId, config, message.context);
   *     // do something with documentation
   *   }
   * }
   * ```
   *
   * @public
   * @deprecated Deprecated since 8.0.0, use [[getContextualDocumentationSync]] instead.
   * @param ruleId - Rule to get documentation for.
   * @param config - If set it provides more accurate description by using the
   * correct configuration for the file.
   * @param context - If set to `Message.context` some rules can provide
   * contextual details and suggestions.
   */
  getRuleDocumentationSync(ruleId, config2 = null, context = null) {
    const c = config2 ?? this.getConfigForSync("inline");
    const engine = new Engine(c, Parser);
    return engine.getRuleDocumentation({ ruleId, context });
  }
  /**
   * Create a parser configured for given filename.
   *
   * @internal
   * @param source - Source to use.
   */
  async getParserFor(source) {
    const config2 = await this.getConfigFor(source.filename);
    return new Parser(config2);
  }
  /**
   * Get configuration for given filename.
   *
   * See [[FileSystemConfigLoader]] for details.
   *
   * @public
   * @param filename - Filename to get configuration for.
   * @param configOverride - Configuration to apply last.
   */
  getConfigFor(filename, configOverride) {
    const config2 = this.configLoader.getConfigFor(filename, configOverride);
    return Promise.resolve(config2);
  }
  /**
   * Get configuration for given filename.
   *
   * See [[FileSystemConfigLoader]] for details.
   *
   * @public
   * @param filename - Filename to get configuration for.
   * @param configOverride - Configuration to apply last.
   */
  getConfigForSync(filename, configOverride) {
    return this.configLoader.getConfigFor(filename, configOverride);
  }
  /**
   * Flush configuration cache. Clears full cache unless a filename is given.
   *
   * See [[FileSystemConfigLoader]] for details.
   *
   * @public
   * @param filename - If set, only flush cache for given filename.
   */
  flushConfigCache(filename) {
    this.configLoader.flushCache(filename);
  }
};
var version = "8.18.1";
function definePlugin(plugin) {
  return plugin;
}
function makeArray(subject) {
  return Array.isArray(subject) ? subject : [subject];
}
var EMPTY = "";
var SPACE = " ";
var ESCAPE = "\\";
var REGEX_TEST_BLANK_LINE = /^\s+$/;
var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
var REGEX_SPLITALL_CRLF = /\r?\n/g;
var REGEX_TEST_INVALID_PATH = /^\.*\/|^\.+$/;
var SLASH2 = "/";
var TMP_KEY_IGNORE = "node-ignore";
if (typeof Symbol !== "undefined") {
  TMP_KEY_IGNORE = Symbol.for("node-ignore");
}
var KEY_IGNORE = TMP_KEY_IGNORE;
var define2 = (object, key, value) => Object.defineProperty(object, key, { value });
var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
var RETURN_FALSE = () => false;
var sanitizeRange = (range) => range.replace(
  REGEX_REGEXP_RANGE,
  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY
);
var cleanRangeBackSlash = (slashes) => {
  const { length } = slashes;
  return slashes.slice(0, length - length % 2);
};
var REPLACERS = [
  [
    // remove BOM
    // TODO:
    // Other similar zero-width characters?
    /^\uFEFF/,
    () => EMPTY
  ],
  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a \ ) -> (a  )
    /\\?\s+$/,
    (match) => match.indexOf("\\") === 0 ? SPACE : EMPTY
  ],
  // replace (\ ) with ' '
  [
    /\\\s/g,
    () => SPACE
  ],
  // Escape metacharacters
  // which is written down by users but means special for regular expressions.
  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [
    /[\\$.|*+(){^]/g,
    (match) => `\\${match}`
  ],
  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => "[^/]"
  ],
  // leading slash
  [
    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => "^"
  ],
  // replace special metacharacter slash after the leading slash
  [
    /\//g,
    () => "\\/"
  ],
  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*\\\*\\\*\\\//,
    // '**/foo' <-> 'foo'
    () => "^(?:.*\\/)?"
  ],
  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer() {
      return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
    }
  ],
  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,
    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer
    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
  ],
  // normal intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'
    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule,
    //    coz trailing single wildcard will be handed by [trailing wildcard]
    /(^|[^\\]+)(\\\*)+(?=.+)/g,
    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1, p2) => {
      const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
      return p1 + unescaped;
    }
  ],
  [
    // unescape, revert step 3 except for back slash
    // For example, if a user escape a '\\*',
    // after step 3, the result will be '\\\\\\*'
    /\\\\\\(?=[$.|*+(){^])/g,
    () => ESCAPE
  ],
  [
    // '\\\\' -> '\\'
    /\\\\/g,
    () => ESCAPE
  ],
  [
    // > The range notation, e.g. [a-zA-Z],
    // > can be used to match one of the characters in a range.
    // `\` is escaped by step 3
    /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
    (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"
  ],
  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*])$/,
    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38
    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.
    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
  ],
  // trailing wildcard
  [
    /(\^|\\\/)?\\\*$/,
    (_, p1) => {
      const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
      return `${prefix}(?=$|\\/$)`;
    }
  ]
];
var regexCache = /* @__PURE__ */ Object.create(null);
var makeRegex = (pattern, ignoreCase) => {
  let source = regexCache[pattern];
  if (!source) {
    source = REPLACERS.reduce(
      (prev, current) => prev.replace(current[0], current[1].bind(pattern)),
      pattern
    );
    regexCache[pattern] = source;
  }
  return ignoreCase ? new RegExp(source, "i") : new RegExp(source);
};
var isString = (subject) => typeof subject === "string";
var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF);
var IgnoreRule = class {
  constructor(origin, pattern, negative, regex) {
    this.origin = origin;
    this.pattern = pattern;
    this.negative = negative;
    this.regex = regex;
  }
};
var createRule = (pattern, ignoreCase) => {
  const origin = pattern;
  let negative = false;
  if (pattern.indexOf("!") === 0) {
    negative = true;
    pattern = pattern.substr(1);
  }
  pattern = pattern.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
  const regex = makeRegex(pattern, ignoreCase);
  return new IgnoreRule(
    origin,
    pattern,
    negative,
    regex
  );
};
var throwError = (message, Ctor) => {
  throw new Ctor(message);
};
var checkPath = (path, originalPath, doThrow) => {
  if (!isString(path)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    );
  }
  if (!path) {
    return doThrow(`path must not be empty`, TypeError);
  }
  if (checkPath.isNotRelative(path)) {
    const r = "`path.relative()`d";
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    );
  }
  return true;
};
var isNotRelative = (path) => REGEX_TEST_INVALID_PATH.test(path);
checkPath.isNotRelative = isNotRelative;
checkPath.convert = (p) => p;
var Ignore = class {
  constructor({
    ignorecase = true,
    ignoreCase = ignorecase,
    allowRelativePaths = false
  } = {}) {
    define2(this, KEY_IGNORE, true);
    this._rules = [];
    this._ignoreCase = ignoreCase;
    this._allowRelativePaths = allowRelativePaths;
    this._initCache();
  }
  _initCache() {
    this._ignoreCache = /* @__PURE__ */ Object.create(null);
    this._testCache = /* @__PURE__ */ Object.create(null);
  }
  _addPattern(pattern) {
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules);
      this._added = true;
      return;
    }
    if (checkPattern(pattern)) {
      const rule = createRule(pattern, this._ignoreCase);
      this._added = true;
      this._rules.push(rule);
    }
  }
  // @param {Array<string> | string | Ignore} pattern
  add(pattern) {
    this._added = false;
    makeArray(
      isString(pattern) ? splitPattern(pattern) : pattern
    ).forEach(this._addPattern, this);
    if (this._added) {
      this._initCache();
    }
    return this;
  }
  // legacy
  addPattern(pattern) {
    return this.add(pattern);
  }
  //          |           ignored : unignored
  // negative |   0:0   |   0:1   |   1:0   |   1:1
  // -------- | ------- | ------- | ------- | --------
  //     0    |  TEST   |  TEST   |  SKIP   |    X
  //     1    |  TESTIF |  SKIP   |  TEST   |    X
  // - SKIP: always skip
  // - TEST: always test
  // - TESTIF: only test if checkUnignored
  // - X: that never happen
  // @param {boolean} whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.
  // @returns {TestResult} true if a file is ignored
  _testOne(path, checkUnignored) {
    let ignored = false;
    let unignored = false;
    this._rules.forEach((rule) => {
      const { negative } = rule;
      if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
        return;
      }
      const matched = rule.regex.test(path);
      if (matched) {
        ignored = !negative;
        unignored = negative;
      }
    });
    return {
      ignored,
      unignored
    };
  }
  // @returns {TestResult}
  _test(originalPath, cache2, checkUnignored, slices) {
    const path = originalPath && checkPath.convert(originalPath);
    checkPath(
      path,
      originalPath,
      this._allowRelativePaths ? RETURN_FALSE : throwError
    );
    return this._t(path, cache2, checkUnignored, slices);
  }
  _t(path, cache2, checkUnignored, slices) {
    if (path in cache2) {
      return cache2[path];
    }
    if (!slices) {
      slices = path.split(SLASH2);
    }
    slices.pop();
    if (!slices.length) {
      return cache2[path] = this._testOne(path, checkUnignored);
    }
    const parent = this._t(
      slices.join(SLASH2) + SLASH2,
      cache2,
      checkUnignored,
      slices
    );
    return cache2[path] = parent.ignored ? parent : this._testOne(path, checkUnignored);
  }
  ignores(path) {
    return this._test(path, this._ignoreCache, false).ignored;
  }
  createFilter() {
    return (path) => !this.ignores(path);
  }
  filter(paths) {
    return makeArray(paths).filter(this.createFilter());
  }
  // @returns {TestResult}
  test(path) {
    return this._test(path, this._testCache, true);
  }
};
var factory = (options) => new Ignore(options);
var isPathValid = (path) => checkPath(path && checkPath.convert(path), path, RETURN_FALSE);
factory.isPathValid = isPathValid;
factory.default = factory;
if (
  // Detect `process` so that it can run in browsers.
  typeof define_process_default !== "undefined" && (define_process_default.env && define_process_default.env.IGNORE_TEST_WIN32 || define_process_default.platform === "win32")
) {
  const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
  checkPath.convert = makePosix;
  const REGIX_IS_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
  checkPath.isNotRelative = (path) => REGIX_IS_WINDOWS_PATH_ABSOLUTE.test(path) || isNotRelative(path);
}
function compatibilityCheckImpl(name, declared, options) {
  const { silent, version: current, logger } = options;
  const valid = import_semver.default.satisfies(current, declared);
  if (valid || silent) {
    return valid;
  }
  const text = [
    "-----------------------------------------------------------------------------------------------------",
    `${name} requires html-validate version "${declared}" but current installed version is ${current}`,
    "This is not a supported configuration. Please install a supported version before reporting bugs.",
    "-----------------------------------------------------------------------------------------------------"
  ].join("\n");
  logger(text);
  return false;
}

// node_modules/html-validate/dist/es/core-browser.js
var defaults = {
  silent: false,
  version,
  logger(text) {
    console.error(text);
  }
};
function compatibilityCheck(name, declared, options) {
  return compatibilityCheckImpl(name, declared, {
    ...defaults,
    ...options
  });
}

// node_modules/html-validate/dist/es/browser.js
var import_ajv2 = __toESM(require_ajv(), 1);
var import_fs2 = __toESM(require_fs(), 1);
var import_code_frame3 = __toESM(require_lib3(), 1);
var import_semver2 = __toESM(require_semver2(), 1);
export {
  Attribute,
  Config,
  ConfigError,
  ConfigLoader,
  DOMNode,
  DOMTokenList,
  DOMTree,
  DynamicValue,
  EventHandler,
  HtmlElement,
  HtmlValidate,
  MetaCopyableProperty,
  MetaTable,
  NestedError,
  NodeClosed,
  NodeType,
  Parser,
  Reporter,
  ResolvedConfig,
  Rule,
  SchemaValidationError,
  Severity,
  StaticConfigLoader,
  TextClassification,
  TextContent$1 as TextContent,
  TextNode,
  UserError,
  Validator,
  WrappedError,
  ariaNaming,
  classifyNodeText,
  compatibilityCheck,
  Presets as configPresets,
  defineConfig,
  defineMetadata,
  definePlugin,
  keywordPatternMatcher,
  metadataHelper,
  ruleExists,
  sliceLocation,
  staticResolver,
  version
};
/*! Bundled license information:

uri-js/dist/es5/uri.all.js:
  (** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js *)
*/
