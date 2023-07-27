"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[5280],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>b});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},f="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),f=l(r),d=a,b=f["".concat(s,".").concat(d)]||f[d]||u[d]||i;return r?n.createElement(b,o(o({ref:t},p),{},{components:r})):n.createElement(b,o({ref:t},p))}));function b(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[f]="string"==typeof e?e:a,o[1]=c;for(var l=2;l<i;l++)o[l]=r[l];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2235:(e,t,r)=>{(0,r(1876).e)()},1876:(e,t,r)=>{r.d(t,{Z:()=>a,e:()=>i});var n=r(6818);function a(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return t}function i(){globalThis.limu=n,globalThis.produce=n.produce,globalThis.createDraft=n.createDraft,globalThis.finishDraft=n.finishDraft}},4527:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>c,toc:()=>l});var n=r(7462),a=(r(7294),r(3905));r(2235);const i={sidebar_position:8},o="isDraft",c={unversionedId:"api/basic/is-draft",id:"api/basic/is-draft",title:"isDraft",description:"\u5224\u65ad\u4e00\u4e2a\u5bf9\u8c61\u662f\u5426\u662f\u8349\u7a3f\u5bf9\u8c61",source:"@site/docs/api/basic/is-draft.md",sourceDirName:"api/basic",slug:"/api/basic/is-draft",permalink:"/limu/en/docs/api/basic/is-draft",draft:!1,editUrl:"https://github.com/tnfe/limu/doc/docs/api/basic/is-draft.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"api",previous:{title:"deepFreeze",permalink:"/limu/en/docs/api/basic/deep-freeze"},next:{title:"setAutoFreeze",permalink:"/limu/en/docs/api/basic/set-auto-freeze"}},s={},l=[],p={toc:l},f="wrapper";function u(e){let{components:t,...r}=e;return(0,a.kt)(f,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"isdraft"},"isDraft"),(0,a.kt)("p",null,"\u5224\u65ad\u4e00\u4e2a\u5bf9\u8c61\u662f\u5426\u662f\u8349\u7a3f\u5bf9\u8c61"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { createDraft, isDraft } from 'limu';\n\nconst base = { a: 1, b: 2, c: [1, 2, 3], d: { d1: 1, d2: 2 } };\nisDraft(base); // false\n\nconst draft = createDraft(base);\nisDraft(draft); // true\n")))}u.isMDXComponent=!0}}]);