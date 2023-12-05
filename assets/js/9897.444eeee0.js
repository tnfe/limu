"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[9897],{6818:(e,t,r)=>{r.r(t),r.d(t,{VER:()=>_e,createDraft:()=>me,current:()=>ze,deepCopy:()=>Oe,deepFreeze:()=>we,finishDraft:()=>ve,getAutoFreeze:()=>Se,immut:()=>Pe,isDiff:()=>de,isDraft:()=>pe,limuUtils:()=>he,original:()=>ke,produce:()=>Me,setAutoFreeze:()=>xe,shallowCompare:()=>ye});const n=Symbol("M"),o=Symbol("V"),a=Symbol("IMMUT_BASE"),s="Map",c="Set",i="Array",u={Map:s,Set:c,Array:i},l="[object Object]",f="[object Map]",p="[object Set]",d="[object Array]",y="[object Function]",h={[f]:s,[p]:c,[d]:i,[l]:"Object"},_=["push","pop","shift","splice","unshift","reverse","copyWithin","delete","fill"],m=["set","clear","delete"],v=["add","clear","delete"],b=["splice","sort","unshift","shift"],g={[s]:["clear","delete","entries","forEach","get","has","keys","set","values"],[c]:["add","clear","delete","entries","forEach","has","keys","values"],[i]:["concat","copyWithin","entries","every","fill","filter","find","findIndex","flat","flatMap","forEach","includes","indexOf","join","keys","lastIndexOf","map","pop","push","reduce","reduceRight","reverse","shift","unshift","slice","some","sort","splice","values","valueOf"]},M={[s]:["clear","set","delete"],[c]:["clear","add","delete"],[i]:["pop","push","shift","unshift","splice","sort","copyWithin"]},w={[s]:["forEach","get"],[c]:["forEach"],[i]:["forEach","map"]},O={value:0,usablePrefix:1},P={autoFreeze:!1,fastModeRange:"array"},x=Object.prototype.toString,S=!!Reflect,k=Object.prototype.hasOwnProperty;function z(e){return x.call(e)}function j(...e){return e}function E(e){return z(e)===l}function C(e){return z(e)===f}function A(e){return z(e)===p}function D(e){return z(e)===y}function F(e){const t=z(e);return![l,d,f,p,y].includes(t)}function V(e){return"AsyncFunction"===e.constructor.name||"function"==typeof e.then}function N(e){return"undefined"!=typeof Promise&&e instanceof Promise}function T(e){var t=typeof e;return"number"===t||"string"===t&&/^[0-9]*$/.test(e)}function R(e){return"symbol"==typeof e}const B={[d]:Array.prototype,[f]:Map.prototype,[p]:Set.prototype,[y]:Function.prototype};const I=new Map;function W(e){e.rootMeta.modified=!0;const t=e=>{e&&!e.modified&&(e.modified=!0,t(e.parentMeta))};t(e)}function K(e,t,r){if(r.apiCtx.debug){const{fast:o}=r;o?e[n]=t:(!function(e){const t=z(e),r=B[t]||Object.prototype,n=Object.create(null);Object.setPrototypeOf(n,r),Object.setPrototypeOf(e,n)}(e),e.__proto__[n]=t)}return e}function U(e,t,r){const{ver:n,parentMeta:o=null,immutBase:a,compareVer:s,apiCtx:c,hasOnOperate:i}=r,u=(l=z(t),h[l]);var l;let f=[],p=0,d=null;o&&(d=o.copy,p=function(e,t){const r=G(e,t);return r?r.level+1:1}(d,c),f=function(e,t,r){const n=[t],o=L(e,r);if(o&&o.level>0){const{keyPath:e}=o;return[...e,t]}return n}(d,e,c));const y={rootMeta:null,parentMeta:o,parent:d,selfType:u,self:t,copy:null,key:e,keyPath:f,level:p,proxyVal:null,proxyItems:null,modified:!1,scopes:[],isImmutBase:a,isDel:!1,isFast:!1,isArrOrderChanged:!1,newNodeStats:{},newNodeMap:new Map,newNodes:[],ver:n,compareVer:s,revoke:j,hasOnOperate:i,execOnOperate:j};return y.rootMeta=0===p?y:o.rootMeta,y}function $(e){const t=q(e);return!!t&&!t.isImmutBase}function L(e,t){return t.metaMap.get(e)}function G(e,t){let r=t||X(e);return(null==r?void 0:r.metaMap.get(e))||null}function J(e){return e&&e[o]||""}function X(e){const t=J(e);return I.get(t)||null}function q(e){const t=X(e);return t&&t.metaMap.get(e)||null}function H(e,t){const r=q(e),n=q(t);if(!r&&!n)return!Object.is(e,t);const{self:o,modified:a,compareVer:s,ver:c,level:i}=r||{self:e,modified:!1,compareVer:!1,ver:"0",level:0},{self:u,modified:l,compareVer:f,ver:p,level:d}=n||{self:t,modified:!1,compareVer:!1,ver:"0",level:0};return o!==u||(!(!s&&!f||0!==i&&0!==d||c===p)||(a||l))}function Q(e){const t=e=>{if(F(e))return e;let r=e;if(Array.isArray(e)&&(r=e.slice(),r.forEach(((e,n)=>{r[n]=t(e)}))),A(e)){const n=Array.from(e);n.forEach(((e,r)=>{n[r]=t(e)})),r=new Set(n)}return C(e)&&(r=new Map(e),r.forEach(((e,n)=>{r.set(n,t(e))}))),E(e)&&(r={},Object.keys(e).forEach((n=>{r[n]=t(e[n])}))),r};return t(e)}function Y(e,t,r){const{apiCtx:n,immutBase:o}=r;if(o)return{copy:e,fast:!1};const{copy:a,fast:s}=function(e,t){const{parentType:r,fastModeRange:n}=t;if(Array.isArray(e))return{copy:e.slice(),fast:!1};const o="array"===n&&r===i||"all"===n;let a=e;return e&&E(e)&&(a=Object.assign({},e)),C(e)&&(a=new Map(e)),A(e)&&(a=new Set(e)),{copy:a,fast:o}}(e,r);return K(a,t,{apiCtx:n,fast:s}),{copy:a,fast:s}}function Z(e,t){const{debug:r}=t,o=new Map;t.newNodeMap.forEach((e=>{const{node:r,parent:n,key:a}=e,s=o.get(r);if(s)return void(n[a]=s);const c=e;!function(e,t,r,n){const o=(e,t,r)=>{F(e)||(n(e,t,r),Array.isArray(e)&&e.forEach(((t,r)=>{o(t,e,r)})),C(e)&&e.forEach(((t,r)=>{o(t,e,r)})),E(e)&&Object.keys(e).forEach((t=>{o(e[t],e,t)})))};o(e,t,r)}(r,n,a,((e,r,n)=>{const o=G(e,t);if(o){const{modified:e,copy:t,self:a}=o,s=e?t:a;r[n]=s}})),c.target=n[a],o.set(r,c.target)})),e.scopes.forEach((e=>{const{modified:t,copy:o,parentMeta:a,key:u,self:l,revoke:f,proxyVal:p,isDel:d,isFast:y}=e;if(!o)return f();if(r&&(y?delete o[n]:delete o.__proto__[n]),!a)return f();const h=t?o:l,_=a.copy,m=a.selfType;return m===s?(_.set(u,h),f()):m===c?(_.delete(p),_.add(h),f()):m===i?(function(e,t,r){const{copy:n,isArrOrderChanged:o}=e,{targetNode:a,key:s}=r;if(o){const e=n.findIndex((e=>e===t.copy));e>=0&&(n[e]=a)}else n[s]=a}(a,e,{targetNode:h,key:u}),f()):!0!==d?(_[u]=h,f()):void 0})),e.scopes.length=0}function ee(e){e.rootMeta.scopes.push(e)}function te(e,t,r){const{traps:n,parentType:o,fastModeRange:a,immutBase:s,apiCtx:c}=r,i=U(e,t,r),{copy:u,fast:l}=Y(t,i,{immutBase:s,parentType:o,fastModeRange:a,apiCtx:c});if(i.copy=u,i.isFast=l,s){const e=new Proxy(u,n);i.proxyVal=e,i.revoke=j}else{const e=Proxy.revocable(u,n);i.proxyVal=e.proxy,i.revoke=e.revoke}return c.metaMap.set(u,i),c.metaMap.set(i.proxyVal,i),i}function re(e,t){const{key:r,parentMeta:n,parent:o,parentType:a,fastModeRange:u,readOnly:l,apiCtx:f}=t;let p=e;if(l&&n&&!D(e)){const{copy:e,self:t}=n,o=t[r];if(p!==o){const t=f.metaMap.get(p);t&&(f.metaMap.delete(p),f.metaMap.delete(t.proxyVal)),e[r]=o,p=o}}const d=(e,r)=>{const l=r||"";if(F(e)||!e)return e;if(!n)throw new Error("[[ createMeta ]]: meta should not be null");if(!D(e)){if(n.newNodeStats[l])return e;let r=L(e,f);return r||(r=te(l,e,t),ee(r),o[l]=r.copy),r.proxyVal}if(!function(e,t){return e===i||(w[e]||[]).includes(t)}(a,l))return e;if(n.proxyItems)return e;let p=[];if(a===c){const e=new Set;o.forEach((t=>e.add(d(t)))),oe(e,n,{dataType:c,apiCtx:f}),p=K(e,n,{fast:u,apiCtx:f}),n.copy=p}else if(a===s){const e=new Map;o.forEach(((t,r)=>e.set(r,d(t,r)))),oe(e,n,{dataType:s,apiCtx:f}),p=K(e,n,{fast:u,apiCtx:f}),n.copy=p}else a===i&&"sort"!==l&&(n.copy=n.copy||o.slice(),p=n.proxyVal);return n.proxyItems=p,e};return d(p,r)}function ne(e,t){if(!E(e))return e;const r=L(e,t);return r?r.copy:e}function oe(e,t,r){const{dataType:n,apiCtx:o}=r,a=e.delete.bind(e),i=e.clear.bind(e);if(e.delete=function(...e){return W(t),a(...e)},e.clear=function(...e){return W(t),i(...e)},n===c){const r=e.add.bind(e);e.add=function(...e){return W(t),r(...e)}}if(n===s){const r=e.set.bind(e),n=e.get.bind(e);e.set=function(...e){if(W(t),t.hasOnOperate){const r=e[1];t.rootMeta.execOnOperate("set",e[0],{mayProxyVal:r,value:r,parentMeta:t})}return r(...e)},e.get=function(...e){const r=n(...e);if(t.hasOnOperate){const n=G(r,o),a=n?n.copy||n.self:r;t.rootMeta.execOnOperate("get",e[0],{mayProxyVal:r,value:a,parentMeta:t,isChanged:!1})}return r}}}function ae(e,t){const r=e.keyPath.slice();r.push(t);return r.join("|")}function se(e,t){const{op:r,key:n,value:o,calledBy:a,parentType:u,parentMeta:l,apiCtx:f}=t,p=ne(o,f);if(!l)return void(e[n]=p);const{self:d,copy:y}=l;!function(e){const{calledBy:t,parentMeta:r,op:n,parentType:o}=e;(["deleteProperty","set"].includes(t)||"get"===t&&(o===c&&v.includes(n)||o===i&&_.includes(n)||o===s&&m.includes(n)))&&W(r)}({calledBy:a,parentMeta:l,op:r,key:n,parentType:u});const h=g[u]||[];if(D(o)&&h.includes(r))return"slice"===r?d.slice:(b.includes(r)&&(l.isArrOrderChanged=!0),y?u===c||u===s?y[r].bind(y):y[r]:d[r].bind(d));if(!y)return p;const M=y[n],w=()=>{const e=G(M,f);e&&(e.isDel=!0)};if("deleteProperty"===a){const e=G(o,f);e?e.isDel=!0:w();return F(y[n])||f.newNodeMap.delete(ae(l,n)),void delete y[n]}F(p)||(l.newNodeStats[n]=!0,f.newNodeMap.set(ae(l,n),{parent:y,node:p,key:n,target:null})),y[n]=p,w(),(()=>{const e=G(o,f);e&&e.isDel&&(e.isDel=!1,e.key=n,e.keyPath=l.keyPath.concat([n]),e.level=l.level+1,e.parent=l.copy,e.parentMeta=l)})()}function ce(e){if(F(e))return e;if(Array.isArray(e)&&e.length>0)return e.forEach(ce),Object.freeze(e);if(A(e)){const t=e;t.add=()=>t,t.delete=()=>!1,t.clear=j;for(const e of t.values())Object.freeze(e);return Object.freeze(e)}if(C(e)){const t=e;t.set=()=>t,t.delete=()=>!1,t.clear=j;for(const e of t.values())Object.freeze(e);return Object.freeze(e)}return Object.getOwnPropertyNames(e).forEach((t=>{ce(e[t])})),Object.freeze(e)}const ie={};["length","constructor","asymmetricMatch","nodeType","size"].forEach((e=>ie[e]=1));const ue={[i]:1,[c]:1,[s]:1},le=new Map;function fe(e){var t,r,n,s,c;const l=e||{},f=l.onOperate,p=!!f,d=l.customKeys||[],y=l.customGet,h=l.fastModeRange||P.fastModeRange,_=null!==(t=l[a])&&void 0!==t&&t,m=null!==(r=l.readOnly)&&void 0!==r&&r,v=l.disableWarn,b=null!==(n=l.compareVer)&&void 0!==n&&n,w=null!==(s=l.debug)&&void 0!==s&&s,x=null!==(c=l.autoFreeze)&&void 0!==c?c:P.autoFreeze,z=function(){O.value>=Number.MAX_SAFE_INTEGER?(O.value=1,O.usablePrefix+=1):O.value+=1;const{value:e,usablePrefix:t}=O;return`${t}_${e}`}(),j={metaMap:new Map,newNodeMap:new Map,debug:w,metaVer:z};I.set(z,j);const C=()=>(v||console.warn("can not mutate state at readOnly mode!"),!0),A=(e,t,r)=>{const{mayProxyVal:n,parentMeta:o,value:a}=r;if(!f)return n;const s=o||{},{selfType:c="",keyPath:i=[],copy:u,self:l,modified:p}=s||{};let d=!1,y=!1;if(void 0!==r.isChanged)d=r.isChanged;else{if((g[c]||[]).includes(t)){y=!0;d=(M[c]||[]).includes(t)}else if("get"!==e){d=!o||(p?u:l)[t]!==a}}const h=f({parentType:c,op:e,isBuiltInFnKey:y,isChanged:d,key:t,keyPath:i,fullKeyPath:i.concat(t),value:a,proxyValue:n});return void 0!==h?h:n},V=(()=>{let e=!0;const t={get:(e,r)=>{if(o===r)return z;const n=e[r];if("__proto__"===r||"toJSON"===r&&!function(e,t){return S?Reflect.has(e,t):k.call(e,t)}(e,r))return n;if(R(r))return y&&d.includes(r)?y(r):D(n)?n.bind(e):n;let a=n;const s=L(e,j),c=null==s?void 0:s.selfType;return ue[c]&&ie[r]?s.copy[r]:(a=re(n,{key:r,parentMeta:s,parentType:c,ver:z,traps:t,parent:e,fastModeRange:h,immutBase:_,readOnly:m,apiCtx:j,hasOnOperate:p}),c===i&&T(r)?A("get",r,{parentMeta:s,mayProxyVal:a,value:n}):u[c]?(a=se(e,{op:r,key:r,value:n,metaVer:z,calledBy:"get",parentType:c,parentMeta:s,apiCtx:j}),A("get",r,{parentMeta:s,mayProxyVal:a,value:n})):A("get",r,{parentMeta:s,mayProxyVal:a,value:n}))},set:(t,r,n)=>{let o=n;const a=L(t,j);if($(n))if(c=z,E(s=n)&&J(s)!==c)e=!1;else if(o=ne(n,j),o===t[r])return!0;var s,c;if(m)return A("set",r,{parentMeta:a,isChanged:!1,value:o}),C();if(a&&a.selfType===i){if(a.copy&&a.__callSet&&T(r))return A("set",r,{parentMeta:a,value:o}),a.copy[r]=o,!0;a.__callSet=!0}return A("set",r,{parentMeta:a,value:o}),se(t,{parentMeta:a,key:r,value:o,metaVer:z,calledBy:"set",apiCtx:j}),!0},deleteProperty:(e,t)=>{const r=L(e,j),n=e[t];return m?(A("del",t,{parentMeta:r,isChanged:!1,value:n}),C()):(A("del",t,{parentMeta:r,isChanged:!0,value:n}),se(e,{parentMeta:r,op:"del",key:t,value:"",metaVer:z,calledBy:"deleteProperty",apiCtx:j}),!0)},apply:function(e,t,r){return e.apply(t,r)}};return{createDraft:e=>{if(F(e))throw new Error("base state can not be primitive");let r=e;const n=L(e,j);if(n){if(_&&n.isImmutBase)return n.proxyVal;r=n.self}const o=te("",r,{ver:z,traps:t,immutBase:_,readOnly:m,compareVer:b,apiCtx:j,hasOnOperate:p});return ee(o),o.execOnOperate=A,le.set(o.proxyVal,V.finishDraft),o.proxyVal},finishDraft:t=>{const r=L(t,j);if(!r)throw new Error("rootMeta should not be null!");if(0!==r.level)throw new Error("can not finish sub draft node!");if(r.isImmutBase)return t;let n=function(e,t){const{self:r,copy:n,modified:o}=e;let a=r;return n&&o&&(a=e.copy),Z(e,t),a}(r,j);return x&&e&&(n=ce(n)),I.delete(z),n}}})();return V}const pe=$,de=H,ye=function(e,t,r=!0){const n=r?H:Object.is;return!((e,t)=>{for(let r in e)if(!(r in t))return!0;for(let r in t)if(n(e[r],t[r]))return!0;return!1})(e,t)},he={noop:j,isObject:E,isMap:C,isSet:A,isFn:D,isPrimitive:F,isPromiseFn:V,isPromiseResult:N,isSymbol:R,canBeNum:T,isDraft:$,isDiff:H,shallowCompare:ye,getDraftMeta:G},_e="3.11.0";function me(e,t){return fe(t).createDraft(e)}function ve(e){const t=le.get(e);if(!t)throw new Error("Not a Limu root draft or draft has been finished!");return le.delete(e),t(e)}function be(e){if(!D(e))throw new Error("produce callback is not a function")}function ge(e,t,r){be(t);const n=me(e,r),o=t(n);return function(e,t){if(V(e)||N(t))throw new Error("produce callback can not be a promise function or result")}(t,o),ve(n)}const Me=function(e,t,r){if(!t||!D(t)){const r=e,n=t;return be(e),e=>ge(e,r,n)}return ge(e,t,r)},we=ce;function Oe(e){return Q(e)}function Pe(e,t){return fe(Object.assign(Object.assign({},t||{}),{readOnly:!0,[a]:!0})).createDraft(e)}function xe(e){P.autoFreeze=e}function Se(){return P.autoFreeze}const ke=function(e){const t=G(e);return t?t.self:e},ze=function(e){const t=G(e);return t?Q(t.copy||t.self):e}},3513:(e,t,r)=>{r.r(t),r.d(t,{Immer:()=>L,applyPatches:()=>re,castDraft:()=>ae,castImmutable:()=>se,createDraft:()=>ne,current:()=>J,enableMapSet:()=>H,enablePatches:()=>q,finishDraft:()=>oe,freeze:()=>w,immerable:()=>o,isDraft:()=>i,isDraftable:()=>u,nothing:()=>n,original:()=>p,produce:()=>Y,produceWithPatches:()=>Z,setAutoFreeze:()=>ee,setUseStrictShallowCopy:()=>te});var n=Symbol.for("immer-nothing"),o=Symbol.for("immer-draftable"),a=Symbol.for("immer-state");function s(e,...t){throw new Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`)}var c=Object.getPrototypeOf;function i(e){return!!e&&!!e[a]}function u(e){return!!e&&(f(e)||Array.isArray(e)||!!e[o]||!!e.constructor?.[o]||v(e)||b(e))}var l=Object.prototype.constructor.toString();function f(e){if(!e||"object"!=typeof e)return!1;const t=c(e);if(null===t)return!0;const r=Object.hasOwnProperty.call(t,"constructor")&&t.constructor;return r===Object||"function"==typeof r&&Function.toString.call(r)===l}function p(e){return i(e)||s(15),e[a].base_}function d(e,t){0===y(e)?Object.entries(e).forEach((([r,n])=>{t(r,n,e)})):e.forEach(((r,n)=>t(n,r,e)))}function y(e){const t=e[a];return t?t.type_:Array.isArray(e)?1:v(e)?2:b(e)?3:0}function h(e,t){return 2===y(e)?e.has(t):Object.prototype.hasOwnProperty.call(e,t)}function _(e,t){return 2===y(e)?e.get(t):e[t]}function m(e,t,r){const n=y(e);2===n?e.set(t,r):3===n?e.add(r):e[t]=r}function v(e){return e instanceof Map}function b(e){return e instanceof Set}function g(e){return e.copy_||e.base_}function M(e,t){if(v(e))return new Map(e);if(b(e))return new Set(e);if(Array.isArray(e))return Array.prototype.slice.call(e);if(!t&&f(e)){if(!c(e)){const t=Object.create(null);return Object.assign(t,e)}return{...e}}const r=Object.getOwnPropertyDescriptors(e);delete r[a];let n=Reflect.ownKeys(r);for(let o=0;o<n.length;o++){const t=n[o],a=r[t];!1===a.writable&&(a.writable=!0,a.configurable=!0),(a.get||a.set)&&(r[t]={configurable:!0,writable:!0,enumerable:a.enumerable,value:e[t]})}return Object.create(c(e),r)}function w(e,t=!1){return P(e)||i(e)||!u(e)||(y(e)>1&&(e.set=e.add=e.clear=e.delete=O),Object.freeze(e),t&&d(e,((e,t)=>w(t,!0)))),e}function O(){s(2)}function P(e){return Object.isFrozen(e)}var x,S={};function k(e){const t=S[e];return t||s(0),t}function z(e,t){S[e]||(S[e]=t)}function j(){return x}function E(e,t){t&&(k("Patches"),e.patches_=[],e.inversePatches_=[],e.patchListener_=t)}function C(e){A(e),e.drafts_.forEach(F),e.drafts_=null}function A(e){e===x&&(x=e.parent_)}function D(e){return x={drafts_:[],parent_:x,immer_:e,canAutoFreeze_:!0,unfinalizedDrafts_:0}}function F(e){const t=e[a];0===t.type_||1===t.type_?t.revoke_():t.revoked_=!0}function V(e,t){t.unfinalizedDrafts_=t.drafts_.length;const r=t.drafts_[0];return void 0!==e&&e!==r?(r[a].modified_&&(C(t),s(4)),u(e)&&(e=N(t,e),t.parent_||R(t,e)),t.patches_&&k("Patches").generateReplacementPatches_(r[a].base_,e,t.patches_,t.inversePatches_)):e=N(t,r,[]),C(t),t.patches_&&t.patchListener_(t.patches_,t.inversePatches_),e!==n?e:void 0}function N(e,t,r){if(P(t))return t;const n=t[a];if(!n)return d(t,((o,a)=>T(e,n,t,o,a,r))),t;if(n.scope_!==e)return t;if(!n.modified_)return R(e,n.base_,!0),n.base_;if(!n.finalized_){n.finalized_=!0,n.scope_.unfinalizedDrafts_--;const t=n.copy_;let o=t,a=!1;3===n.type_&&(o=new Set(t),t.clear(),a=!0),d(o,((o,s)=>T(e,n,t,o,s,r,a))),R(e,t,!1),r&&e.patches_&&k("Patches").generatePatches_(n,r,e.patches_,e.inversePatches_)}return n.copy_}function T(e,t,r,n,o,a,s){if(i(o)){const s=N(e,o,a&&t&&3!==t.type_&&!h(t.assigned_,n)?a.concat(n):void 0);if(m(r,n,s),!i(s))return;e.canAutoFreeze_=!1}else s&&r.add(o);if(u(o)&&!P(o)){if(!e.immer_.autoFreeze_&&e.unfinalizedDrafts_<1)return;N(e,o),t&&t.scope_.parent_||R(e,o)}}function R(e,t,r=!1){!e.parent_&&e.immer_.autoFreeze_&&e.canAutoFreeze_&&w(t,r)}var B={get(e,t){if(t===a)return e;const r=g(e);if(!h(r,t))return function(e,t,r){const n=K(t,r);return n?"value"in n?n.value:n.get?.call(e.draft_):void 0}(e,r,t);const n=r[t];return e.finalized_||!u(n)?n:n===W(e.base_,t)?($(e),e.copy_[t]=G(n,e)):n},has:(e,t)=>t in g(e),ownKeys:e=>Reflect.ownKeys(g(e)),set(e,t,r){const n=K(g(e),t);if(n?.set)return n.set.call(e.draft_,r),!0;if(!e.modified_){const n=W(g(e),t),c=n?.[a];if(c&&c.base_===r)return e.copy_[t]=r,e.assigned_[t]=!1,!0;if(((o=r)===(s=n)?0!==o||1/o==1/s:o!=o&&s!=s)&&(void 0!==r||h(e.base_,t)))return!0;$(e),U(e)}var o,s;return e.copy_[t]===r&&(void 0!==r||t in e.copy_)||Number.isNaN(r)&&Number.isNaN(e.copy_[t])||(e.copy_[t]=r,e.assigned_[t]=!0),!0},deleteProperty:(e,t)=>(void 0!==W(e.base_,t)||t in e.base_?(e.assigned_[t]=!1,$(e),U(e)):delete e.assigned_[t],e.copy_&&delete e.copy_[t],!0),getOwnPropertyDescriptor(e,t){const r=g(e),n=Reflect.getOwnPropertyDescriptor(r,t);return n?{writable:!0,configurable:1!==e.type_||"length"!==t,enumerable:n.enumerable,value:r[t]}:n},defineProperty(){s(11)},getPrototypeOf:e=>c(e.base_),setPrototypeOf(){s(12)}},I={};function W(e,t){const r=e[a];return(r?g(r):e)[t]}function K(e,t){if(!(t in e))return;let r=c(e);for(;r;){const e=Object.getOwnPropertyDescriptor(r,t);if(e)return e;r=c(r)}}function U(e){e.modified_||(e.modified_=!0,e.parent_&&U(e.parent_))}function $(e){e.copy_||(e.copy_=M(e.base_,e.scope_.immer_.useStrictShallowCopy_))}d(B,((e,t)=>{I[e]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)}})),I.deleteProperty=function(e,t){return I.set.call(this,e,t,void 0)},I.set=function(e,t,r){return B.set.call(this,e[0],t,r,e[0])};var L=class{constructor(e){this.autoFreeze_=!0,this.useStrictShallowCopy_=!1,this.produce=(e,t,r)=>{if("function"==typeof e&&"function"!=typeof t){const r=t;t=e;const n=this;return function(e=r,...o){return n.produce(e,(e=>t.call(this,e,...o)))}}let o;if("function"!=typeof t&&s(6),void 0!==r&&"function"!=typeof r&&s(7),u(e)){const n=D(this),a=G(e,void 0);let s=!0;try{o=t(a),s=!1}finally{s?C(n):A(n)}return E(n,r),V(o,n)}if(!e||"object"!=typeof e){if(o=t(e),void 0===o&&(o=e),o===n&&(o=void 0),this.autoFreeze_&&w(o,!0),r){const t=[],n=[];k("Patches").generateReplacementPatches_(e,o,t,n),r(t,n)}return o}s(1)},this.produceWithPatches=(e,t)=>{if("function"==typeof e)return(t,...r)=>this.produceWithPatches(t,(t=>e(t,...r)));let r,n;return[this.produce(e,t,((e,t)=>{r=e,n=t})),r,n]},"boolean"==typeof e?.autoFreeze&&this.setAutoFreeze(e.autoFreeze),"boolean"==typeof e?.useStrictShallowCopy&&this.setUseStrictShallowCopy(e.useStrictShallowCopy)}createDraft(e){u(e)||s(8),i(e)&&(e=J(e));const t=D(this),r=G(e,void 0);return r[a].isManual_=!0,A(t),r}finishDraft(e,t){const r=e&&e[a];r&&r.isManual_||s(9);const{scope_:n}=r;return E(n,t),V(void 0,n)}setAutoFreeze(e){this.autoFreeze_=e}setUseStrictShallowCopy(e){this.useStrictShallowCopy_=e}applyPatches(e,t){let r;for(r=t.length-1;r>=0;r--){const n=t[r];if(0===n.path.length&&"replace"===n.op){e=n.value;break}}r>-1&&(t=t.slice(r+1));const n=k("Patches").applyPatches_;return i(e)?n(e,t):this.produce(e,(e=>n(e,t)))}};function G(e,t){const r=v(e)?k("MapSet").proxyMap_(e,t):b(e)?k("MapSet").proxySet_(e,t):function(e,t){const r=Array.isArray(e),n={type_:r?1:0,scope_:t?t.scope_:j(),modified_:!1,finalized_:!1,assigned_:{},parent_:t,base_:e,draft_:null,copy_:null,revoke_:null,isManual_:!1};let o=n,a=B;r&&(o=[n],a=I);const{revoke:s,proxy:c}=Proxy.revocable(o,a);return n.draft_=c,n.revoke_=s,c}(e,t);return(t?t.scope_:j()).drafts_.push(r),r}function J(e){return i(e)||s(10),X(e)}function X(e){if(!u(e)||P(e))return e;const t=e[a];let r;if(t){if(!t.modified_)return t.base_;t.finalized_=!0,r=M(e,t.scope_.immer_.useStrictShallowCopy_)}else r=M(e,!0);return d(r,((e,t)=>{m(r,e,X(t))})),t&&(t.finalized_=!1),r}function q(){const e="replace",t="add",r="remove";function a(e){if(!u(e))return e;if(Array.isArray(e))return e.map(a);if(v(e))return new Map(Array.from(e.entries()).map((([e,t])=>[e,a(t)])));if(b(e))return new Set(Array.from(e).map(a));const t=Object.create(c(e));for(const r in e)t[r]=a(e[r]);return h(e,o)&&(t[o]=e[o]),t}function l(e){return i(e)?a(e):e}z("Patches",{applyPatches_:function(n,o){return o.forEach((o=>{const{path:c,op:i}=o;let u=n;for(let e=0;e<c.length-1;e++){const t=y(u);let r=c[e];"string"!=typeof r&&"number"!=typeof r&&(r=""+r),0!==t&&1!==t||"__proto__"!==r&&"constructor"!==r||s(19),"function"==typeof u&&"prototype"===r&&s(19),u=_(u,r),"object"!=typeof u&&s(18,c.join("/"))}const l=y(u),f=a(o.value),p=c[c.length-1];switch(i){case e:switch(l){case 2:return u.set(p,f);case 3:s(16);default:return u[p]=f}case t:switch(l){case 1:return"-"===p?u.push(f):u.splice(p,0,f);case 2:return u.set(p,f);case 3:return u.add(f);default:return u[p]=f}case r:switch(l){case 1:return u.splice(p,1);case 2:return u.delete(p);case 3:return u.delete(o.value);default:return delete u[p]}default:s(17)}})),n},generatePatches_:function(n,o,a,s){switch(n.type_){case 0:case 2:return function(n,o,a,s){const{base_:c,copy_:i}=n;d(n.assigned_,((n,u)=>{const f=_(c,n),p=_(i,n),d=u?h(c,n)?e:t:r;if(f===p&&d===e)return;const y=o.concat(n);a.push(d===r?{op:d,path:y}:{op:d,path:y,value:p}),s.push(d===t?{op:r,path:y}:d===r?{op:t,path:y,value:l(f)}:{op:e,path:y,value:l(f)})}))}(n,o,a,s);case 1:return function(n,o,a,s){let{base_:c,assigned_:i}=n,u=n.copy_;u.length<c.length&&([c,u]=[u,c],[a,s]=[s,a]);for(let t=0;t<c.length;t++)if(i[t]&&u[t]!==c[t]){const r=o.concat([t]);a.push({op:e,path:r,value:l(u[t])}),s.push({op:e,path:r,value:l(c[t])})}for(let e=c.length;e<u.length;e++){const r=o.concat([e]);a.push({op:t,path:r,value:l(u[e])})}for(let e=u.length-1;c.length<=e;--e){const t=o.concat([e]);s.push({op:r,path:t})}}(n,o,a,s);case 3:return function(e,n,o,a){let{base_:s,copy_:c}=e,i=0;s.forEach((e=>{if(!c.has(e)){const s=n.concat([i]);o.push({op:r,path:s,value:e}),a.unshift({op:t,path:s,value:e})}i++})),i=0,c.forEach((e=>{if(!s.has(e)){const s=n.concat([i]);o.push({op:t,path:s,value:e}),a.unshift({op:r,path:s,value:e})}i++}))}(n,o,a,s)}},generateReplacementPatches_:function(t,r,o,a){o.push({op:e,path:[],value:r===n?void 0:r}),a.push({op:e,path:[],value:t})}})}function H(){class e extends Map{constructor(e,t){super(),this[a]={type_:2,parent_:t,scope_:t?t.scope_:j(),modified_:!1,finalized_:!1,copy_:void 0,assigned_:void 0,base_:e,draft_:this,isManual_:!1,revoked_:!1}}get size(){return g(this[a]).size}has(e){return g(this[a]).has(e)}set(e,r){const n=this[a];return o(n),g(n).has(e)&&g(n).get(e)===r||(t(n),U(n),n.assigned_.set(e,!0),n.copy_.set(e,r),n.assigned_.set(e,!0)),this}delete(e){if(!this.has(e))return!1;const r=this[a];return o(r),t(r),U(r),r.base_.has(e)?r.assigned_.set(e,!1):r.assigned_.delete(e),r.copy_.delete(e),!0}clear(){const e=this[a];o(e),g(e).size&&(t(e),U(e),e.assigned_=new Map,d(e.base_,(t=>{e.assigned_.set(t,!1)})),e.copy_.clear())}forEach(e,t){g(this[a]).forEach(((r,n,o)=>{e.call(t,this.get(n),n,this)}))}get(e){const r=this[a];o(r);const n=g(r).get(e);if(r.finalized_||!u(n))return n;if(n!==r.base_.get(e))return n;const s=G(n,r);return t(r),r.copy_.set(e,s),s}keys(){return g(this[a]).keys()}values(){const e=this.keys();return{[Symbol.iterator]:()=>this.values(),next:()=>{const t=e.next();if(t.done)return t;return{done:!1,value:this.get(t.value)}}}}entries(){const e=this.keys();return{[Symbol.iterator]:()=>this.entries(),next:()=>{const t=e.next();if(t.done)return t;const r=this.get(t.value);return{done:!1,value:[t.value,r]}}}}[Symbol.iterator](){return this.entries()}}function t(e){e.copy_||(e.assigned_=new Map,e.copy_=new Map(e.base_))}class r extends Set{constructor(e,t){super(),this[a]={type_:3,parent_:t,scope_:t?t.scope_:j(),modified_:!1,finalized_:!1,copy_:void 0,base_:e,draft_:this,drafts_:new Map,revoked_:!1,isManual_:!1}}get size(){return g(this[a]).size}has(e){const t=this[a];return o(t),t.copy_?!!t.copy_.has(e)||!(!t.drafts_.has(e)||!t.copy_.has(t.drafts_.get(e))):t.base_.has(e)}add(e){const t=this[a];return o(t),this.has(e)||(n(t),U(t),t.copy_.add(e)),this}delete(e){if(!this.has(e))return!1;const t=this[a];return o(t),n(t),U(t),t.copy_.delete(e)||!!t.drafts_.has(e)&&t.copy_.delete(t.drafts_.get(e))}clear(){const e=this[a];o(e),g(e).size&&(n(e),U(e),e.copy_.clear())}values(){const e=this[a];return o(e),n(e),e.copy_.values()}entries(){const e=this[a];return o(e),n(e),e.copy_.entries()}keys(){return this.values()}[Symbol.iterator](){return this.values()}forEach(e,t){const r=this.values();let n=r.next();for(;!n.done;)e.call(t,n.value,n.value,this),n=r.next()}}function n(e){e.copy_||(e.copy_=new Set,e.base_.forEach((t=>{if(u(t)){const r=G(t,e);e.drafts_.set(t,r),e.copy_.add(r)}else e.copy_.add(t)})))}function o(e){e.revoked_&&s(3,JSON.stringify(g(e)))}z("MapSet",{proxyMap_:function(t,r){return new e(t,r)},proxySet_:function(e,t){return new r(e,t)}})}var Q=new L,Y=Q.produce,Z=Q.produceWithPatches.bind(Q),ee=Q.setAutoFreeze.bind(Q),te=Q.setUseStrictShallowCopy.bind(Q),re=Q.applyPatches.bind(Q),ne=Q.createDraft.bind(Q),oe=Q.finishDraft.bind(Q);function ae(e){return e}function se(e){return e}}}]);