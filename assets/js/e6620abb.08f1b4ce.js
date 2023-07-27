"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[5235],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>m});var n=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},s=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=p(r),d=i,m=u["".concat(l,".").concat(d)]||u[d]||f[d]||a;return r?n.createElement(m,o(o({ref:t},s),{},{components:r})):n.createElement(m,o({ref:t},s))}));function m(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c[u]="string"==typeof e?e:i,o[1]=c;for(var p=2;p<a;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2235:(e,t,r)=>{(0,r(1876).e)()},1876:(e,t,r)=>{r.d(t,{Z:()=>i,e:()=>a});var n=r(6818);function i(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return t}function a(){globalThis.limu=n,globalThis.produce=n.produce,globalThis.createDraft=n.createDraft,globalThis.finishDraft=n.finishDraft}},3734:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>f,frontMatter:()=>a,metadata:()=>c,toc:()=>p});var n=r(7462),i=(r(7294),r(3905));r(2235);const a={sidebar_position:4},o="original",c={unversionedId:"api/basic/original",id:"api/basic/original",title:"original",description:"\u83b7\u5f97\u8349\u7a3f\u5bf9\u8c61\u6307\u5b9a\u8282\u70b9\u7684\u539f\u59cb\u6570\u636e",source:"@site/docs/api/basic/original.md",sourceDirName:"api/basic",slug:"/api/basic/original",permalink:"/limu/docs/api/basic/original",draft:!1,editUrl:"https://github.com/tnfe/limu/doc/docs/api/basic/original.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"api",previous:{title:"immut",permalink:"/limu/docs/api/basic/immut"},next:{title:"current",permalink:"/limu/docs/api/basic/current"}},l={},p=[],s={toc:p},u="wrapper";function f(e){let{components:t,...r}=e;return(0,i.kt)(u,(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"original"},"original"),(0,i.kt)("p",null,"\u83b7\u5f97\u8349\u7a3f\u5bf9\u8c61\u6307\u5b9a\u8282\u70b9\u7684\u539f\u59cb\u6570\u636e"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { createDraft, original } from 'limu';\n\nconst base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };\nconst draft = createDraft(base);\nconst oriList = original(draft.c);\n// \u6216\nconst oriList = original(draft).c;\n")),(0,i.kt)("p",null,"\u5728\u904d\u5386\u5927\u6570\u7ec4\u4e14\u53ea\u4fee\u6539\u90e8\u5206\u5b50\u5143\u7d20\u7684\u6570\u636e\u573a\u666f\u65f6\uff0c\u7528",(0,i.kt)("inlineCode",{parentName:"p"},"original"),"\u53ef\u63d0\u9ad8\u904d\u5386\u901f\u5ea6"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"// faster\noriginal(draft.c).forEach((item, idx) => {\n  if (item.id === 'xxx') {\n    draft.c[idx].name = 'newName';\n  }\n});\n\n// slow\ndraft.c.forEach((item, idx) => {\n  if (item.id === 'xxx') {\n    draft.c[idx].name = 'newName';\n  }\n});\n")),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"\u56e0\u4e3a",(0,i.kt)("inlineCode",{parentName:"p"},"forEach"),"\u4f1a\u89e6\u53d1\u5c06\u6240\u6709\u5b50\u5143\u7d20\u751f\u6210\u4ee3\u7406\u5bf9\u8c61\u7684\u64cd\u4f5c\uff0c\u6240\u4ee5\u4f7f\u7528",(0,i.kt)("inlineCode",{parentName:"p"},"original"),"\u5305\u88f9\u540e\u4f1a\u66f4\u5feb")))}f.isMDXComponent=!0}}]);