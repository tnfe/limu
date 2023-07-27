"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[1838],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),s=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),u=s(r),d=a,m=u["".concat(p,".").concat(d)]||u[d]||f[d]||o;return r?n.createElement(m,i(i({ref:t},l),{},{components:r})):n.createElement(m,i({ref:t},l))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c[u]="string"==typeof e?e:a,i[1]=c;for(var s=2;s<o;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2235:(e,t,r)=>{(0,r(1876).e)()},1876:(e,t,r)=>{r.d(t,{Z:()=>a,e:()=>o});var n=r(6818);function a(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return t}function o(){globalThis.limu=n,globalThis.produce=n.produce,globalThis.createDraft=n.createDraft,globalThis.finishDraft=n.finishDraft}},5737:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>f,frontMatter:()=>o,metadata:()=>c,toc:()=>s});var n=r(7462),a=(r(7294),r(3905));r(2235);const o={sidebar_position:5},i="current",c={unversionedId:"api/basic/current",id:"api/basic/current",title:"current",description:"\u83b7\u5f97\u8349\u7a3f\u5bf9\u8c61\u6307\u5b9a\u8282\u70b9\u7684\u6570\u636e\u526f\u672c\uff0c\u4fee\u590d\u526f\u672c\u4e0d\u4f1a\u5f71\u54cd\u8349\u7a3f\u6570\u636e\uff0c\u4e5f\u4e0d\u4f1a\u5f71\u54cd\u539f\u59cb\u6570\u636e",source:"@site/docs/api/basic/current.md",sourceDirName:"api/basic",slug:"/api/basic/current",permalink:"/limu/en/docs/api/basic/current",draft:!1,editUrl:"https://github.com/tnfe/limu/doc/docs/api/basic/current.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"api",previous:{title:"original",permalink:"/limu/en/docs/api/basic/original"},next:{title:"deepCopy",permalink:"/limu/en/docs/api/basic/deep-copy"}},p={},s=[],l={toc:s},u="wrapper";function f(e){let{components:t,...r}=e;return(0,a.kt)(u,(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"current"},"current"),(0,a.kt)("p",null,"\u83b7\u5f97\u8349\u7a3f\u5bf9\u8c61\u6307\u5b9a\u8282\u70b9\u7684\u6570\u636e\u526f\u672c\uff0c\u4fee\u590d\u526f\u672c\u4e0d\u4f1a\u5f71\u54cd\u8349\u7a3f\u6570\u636e\uff0c\u4e5f\u4e0d\u4f1a\u5f71\u54cd\u539f\u59cb\u6570\u636e"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createDraft, current } from 'limu';\n\nconst base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };\nconst draft = createDraft(base);\nconst listCopy = current(draft.c);\n\nlistCopy.push(4); // \u5f97\u5230\u4e00\u4efd\u72ec\u7acb\u7684\u526f\u672c\n")),(0,a.kt)("admonition",{type:"caution"},(0,a.kt)("p",{parentName:"admonition"},"\u6ce8\u610f\u6b64\u51fd\u6570\u9488\u5bf9\u8349\u7a3f\u5bf9\u8c61\u6709\u6548\uff0c\u5982\u5bf9\u666e\u901a\u5bf9\u8c61\u4f7f\u7528\uff0c\u5219\u4fee\u6539\u4e5f\u4f1a\u5f71\u54cd\u666e\u901a\u5bf9\u8c61")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };\nconst listCopy = current(base.c);\nlistCopy.push(4); // \u4fee\u6539\u4f1a\u5f71\u54cd base.c\n")))}f.isMDXComponent=!0}}]);