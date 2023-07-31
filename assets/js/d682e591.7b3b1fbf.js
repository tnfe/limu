"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[113],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},l=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),m=p(r),d=a,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||i;return r?n.createElement(f,o(o({ref:t},l),{},{components:r})):n.createElement(f,o({ref:t},l))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[m]="string"==typeof e?e:a,o[1]=c;for(var p=2;p<i;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2235:(e,t,r)=>{(0,r(1876).e)()},1876:(e,t,r)=>{r.d(t,{Z:()=>i,e:()=>o});var n=r(6818),a=r(3513);function i(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return t}function o(){globalThis.immer=a,globalThis.limu=n,globalThis.produce=n.produce,globalThis.createDraft=n.createDraft,globalThis.finishDraft=n.finishDraft}},6397:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>c,toc:()=>p});var n=r(7462),a=(r(7294),r(3905));r(2235);const i={sidebar_position:3},o="immut",c={unversionedId:"api/basic/immut",id:"api/basic/immut",title:"immut",description:"\u751f\u6210\u4e00\u4e2a\u4e0d\u53ef\u4fee\u6539\u7684\u5bf9\u8c61im\uff0c\u4f46\u539f\u59cb\u5bf9\u8c61\u7684\u4fee\u6539\u5c06\u540c\u6b65\u4f1a\u5f71\u54cd\u5230im",source:"@site/docs/api/basic/immut.md",sourceDirName:"api/basic",slug:"/api/basic/immut",permalink:"/limu/docs/api/basic/immut",draft:!1,editUrl:"https://github.com/tnfe/limu/blob/main/doc/docs/api/basic/immut.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"api",previous:{title:"createDraft/finishDraft",permalink:"/limu/docs/api/basic/create-draft"},next:{title:"original",permalink:"/limu/docs/api/basic/original"}},s={},p=[],l={toc:p},m="wrapper";function u(e){let{components:t,...r}=e;return(0,a.kt)(m,(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"immut"},"immut"),(0,a.kt)("p",null,"\u751f\u6210\u4e00\u4e2a\u4e0d\u53ef\u4fee\u6539\u7684\u5bf9\u8c61",(0,a.kt)("inlineCode",{parentName:"p"},"im"),"\uff0c\u4f46\u539f\u59cb\u5bf9\u8c61\u7684\u4fee\u6539\u5c06\u540c\u6b65\u4f1a\u5f71\u54cd\u5230",(0,a.kt)("inlineCode",{parentName:"p"},"im")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { immut } from 'limu';\n\nconst base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };\nconst im = immut(base);\n\nim.a = 100; // \u4fee\u6539\u65e0\u6548\nbase.a = 100; // \u4fee\u6539\u4f1a\u5f71\u54cd im\n")),(0,a.kt)("p",null,"\u5408\u5e76\u540e\u53ef\u4ee5\u8bfb\u5230\u6700\u65b0\u503c"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };\nconst im = immut(base);\nconst draft = createDraft(base);\ndraft.d.d1 = 100;\n\nconsole.log(im.d.d1); // 1\uff0c\u4fdd\u6301\u4e0d\u53d8\nconst next = finishDraft(draft);\nObject.assign(base, next);\nconsole.log(im.d.d1); // 100\uff0cim\u548cbase\u59cb\u7ec8\u4fdd\u6301\u6570\u636e\u540c\u6b65\n")),(0,a.kt)("admonition",{type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"immut \u91c7\u7528\u4e86\u8bfb\u65f6\u6d45\u4ee3\u7406\u7684\u673a\u5236\uff0c\u76f8\u6bd4",(0,a.kt)("a",{parentName:"p",href:"/docs/api/basic/deep-freeze"},"deepFreeze"),"\u4f1a\u62e5\u6709\u66f4\u597d\u6027\u80fd\uff0c\u9002\u7528\u4e8e\u4e0d\u66b4\u9732\u539f\u59cb\u5bf9\u8c61\u51fa\u53bb\uff0c\u53ea\u66b4\u9732\u751f\u6210\u7684\u4e0d\u53ef\u53d8\u5bf9\u8c61\u51fa\u53bb\u7684\u573a\u666f\uff08 \u5229\u7528",(0,a.kt)("a",{parentName:"p",href:"/docs/api/basic/produce"},"onOperate"),"\u6536\u96c6\u8bfb\u4f9d\u8d56 \uff09")))}u.isMDXComponent=!0}}]);