"use strict";(self.webpackChunkhel_doc=self.webpackChunkhel_doc||[]).push([[7597],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>k});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),m=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},c=function(e){var t=m(e.components);return r.createElement(l.Provider,{value:t},e.children)},s="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),s=m(n),u=a,k=s["".concat(l,".").concat(u)]||s[u]||d[u]||i;return n?r.createElement(k,p(p({ref:t},c),{},{components:n})):r.createElement(k,p({ref:t},c))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,p=new Array(i);p[0]=u;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o[s]="string"==typeof e?e:a,p[1]=o;for(var m=2;m<i;m++)p[m]=n[m];return r.createElement.apply(null,p)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},7926:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>p,default:()=>d,frontMatter:()=>i,metadata:()=>o,toc:()=>m});var r=n(7462),a=(n(7294),n(3905));const i={sidebar_position:0},p="why limu",o={unversionedId:"api/index",id:"api/index",title:"why limu",description:"\ud83d\ude04 \u7565\u4ee5\u4e0b\u9605\u8bfb\uff0c\u8df3\u8f6c\u81f3 \ud83d\udc49\ud83c\udffc  \u5e38\u7528 api",source:"@site/docs/api/index.md",sourceDirName:"api",slug:"/api/",permalink:"/limu/docs/api/",draft:!1,editUrl:"https://github.com/tnfe/limu/blob/main/doc/docs/api/index.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_position:0},sidebar:"api",next:{title:"basic",permalink:"/limu/docs/api/basic/"}},l={},m=[{value:"\u66f4\u5feb",id:"\u66f4\u5feb",level:3},{value:"\u4f18\u5316\u590d\u5236\u7b56\u7565",id:"\u4f18\u5316\u590d\u5236\u7b56\u7565",level:3},{value:"\u6027\u80fd\u6d4b\u8bd5",id:"\u6027\u80fd\u6d4b\u8bd5",level:3}],c={toc:m},s="wrapper";function d(e){let{components:t,...i}=e;return(0,a.kt)(s,(0,r.Z)({},c,i,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"why-limu"},"why limu"),(0,a.kt)("admonition",{type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"\ud83d\ude04 \u7565\u4ee5\u4e0b\u9605\u8bfb\uff0c\u8df3\u8f6c\u81f3 \ud83d\udc49\ud83c\udffc ",(0,a.kt)("strong",{parentName:"p"}," ",(0,a.kt)("a",{parentName:"strong",href:"/docs/api/basic"},"\u5e38\u7528 api")," "))),(0,a.kt)("h3",{id:"\u66f4\u5feb"},"\u66f4\u5feb"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"limu"),"\u8ba9\u4f60\u50cf\u64cd\u4f5c\u539f\u751f js \u5bf9\u8c61\u4e00\u6837\u64cd\u4f5c\u4e0d\u53ef\u53d8\u5bf9\u8c61\uff0c\u63d0\u4f9b\u4e00\u4e2a\u56de\u8c03\u51fd\u6570\u8ba9\u7528\u6237\u4efb\u610f\u4fee\u6539\u6570\u636e\u7684\u526f\u672c\uff0c\u5e76\u4ee5\u7ed3\u6784\u5171\u4eab\u7684\u65b9\u5f0f\uff0c\u8ba9\u5f15\u7528\u53d8\u52a8\u53ea\u53d1\u751f\u5728\u4ea7\u751f\u6570\u636e\u53d8\u5316\u7684\u8282\u70b9\u7684\u9014\u7ecf\u8def\u5f84\u4e0a\u3002"),(0,a.kt)("h3",{id:"\u4f18\u5316\u590d\u5236\u7b56\u7565"},"\u4f18\u5316\u590d\u5236\u7b56\u7565"),(0,a.kt)("p",null,"\u533a\u522b\u4e8e",(0,a.kt)("inlineCode",{parentName:"p"},"immer"),"\u7684\u5199\u65f6\u590d\u5236\u673a\u5236\uff0c",(0,a.kt)("inlineCode",{parentName:"p"},"limu"),"\u91c7\u7528",(0,a.kt)("strong",{parentName:"p"},"\u8bfb\u65f6\u6d45\u514b\u9686\u5199\u65f6\u6807\u8bb0\u4fee\u6539"),"\u673a\u5236\uff0c\u5177\u4f53\u64cd\u4f5c\u6d41\u7a0b\u6211\u4eec\u5c06\u4ee5\u4e0b\u56fe\u4e3a\u4f8b\u6765\u8bb2\u89e3\uff0c\u4f7f\u7528",(0,a.kt)("inlineCode",{parentName:"p"},"produce"),"\u63a5\u53e3\u751f\u6210\u8349\u7a3f\u6570\u636e\u540e\uff0c\uff0c",(0,a.kt)("inlineCode",{parentName:"p"},"limu"),"\u53ea\u4f1a\u7528\u6237\u8bfb\u53d6\u8349\u7a3f\u6570\u636e\u5c42\u7684\u8def\u5f84\u4e0a\u5b8c\u6210\u76f8\u5173\u8282\u70b9\u7684\u6d45\u514b\u9686"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"shallow copy on read",src:n(2674).Z,width:"1439",height:"502"})),(0,a.kt)("p",null,"\u4fee\u6539\u4e86\u76ee\u6807\u8282\u70b9\u4e0b\u7684\u503c\u7684\u65f6\u5019\uff0c\u5219\u4f1a\u56de\u6eaf\u8be5\u8282\u70b9\u5230\u8ddf\u8282\u70b9\u7684\u6240\u6709\u9014\u5f84\u8282\u70b9\u5e76\u6807\u8bb0\u8fd9\u4e9b\u8282\u70b9\u4e3a\u5df2\u4fee\u6539 ",(0,a.kt)("img",{alt:"shallow copy on read",src:n(3118).Z,width:"1474",height:"522"})),(0,a.kt)("p",null,"\u6700\u540e\u7ed3\u675f\u8349\u7a3f\u751f\u6210",(0,a.kt)("inlineCode",{parentName:"p"},"final"),"\u5bf9\u8c61\u65f6\uff0c",(0,a.kt)("inlineCode",{parentName:"p"},"limu"),"\u53ea\u9700\u8981\u4ece\u6839\u8282\u70b9\u628a\u6240\u6709\u6807\u8bb0\u4fee\u6539\u7684\u8282\u70b9\u7684\u526f\u672c\u66ff\u6362\u5230\u5bf9\u5e94\u4f4d\u7f6e\u5373\u53ef\uff0c\u6ca1\u6709\u6807\u8bb0\u4fee\u6539\u7684\u8282\u70b9\u5219\u4e0d\u4f7f\u7528\u526f\u672c\uff08\u6ce8\uff1a\u751f\u6210\u526f\u672c\u4e0d\u4ee3\u8868\u5df2\u88ab\u4fee\u6539\uff09"),(0,a.kt)("p",null,"\u8fd9\u6837\u7684\u673a\u5236\u5728\u5bf9\u8c61\u7684\u539f\u59cb\u5c42\u7ea7\u5173\u7cfb\u8f83\u4e3a\u590d\u6742\u4e14\u4fee\u6539\u8def\u5f84\u4e0d\u5e7f\u7684\u573a\u666f\u4e0b\uff0c\u4e14\u4e0d\u9700\u8981\u51bb\u7ed3\u539f\u59cb\u5bf9\u8c61\u65f6\uff0c\u6027\u80fd\u8868\u73b0\u5f02\u5e38\u4f18\u5f02\uff0c\u53ef\u8fbe\u5230\u6bd4 immer \u5feb 5 \u500d\u6216\u66f4\u591a\uff0c\u53ea\u6709\u5728\u4fee\u6539\u6570\u636e\u9010\u6e10\u904d\u53ca\u6574\u4e2a\u5bf9\u8c61\u6240\u6709\u8282\u70b9\u65f6\uff0c",(0,a.kt)("inlineCode",{parentName:"p"},"limu"),"\u7684\u6027\u80fd\u624d\u4f1a\u5448\u7ebf\u6027\u4e0b\u8f7d\u8d8b\u52bf\uff0c\u9010\u6b65\u63a5\u8fd1",(0,a.kt)("inlineCode",{parentName:"p"},"immer"),"\uff0c\u4f46\u4e5f\u8981\u6bd4",(0,a.kt)("inlineCode",{parentName:"p"},"immer"),"\u5feb\u5f88\u591a\u3002"),(0,a.kt)("h3",{id:"\u6027\u80fd\u6d4b\u8bd5"},"\u6027\u80fd\u6d4b\u8bd5"),(0,a.kt)("p",null,"\u4e3a\u4e86\u9a8c\u8bc1\u4e0a\u8ff0\u7ed3\u8bba\uff0c\u7528\u6237\u53ef\u6309\u7167\u4ee5\u4e0b\u6d41\u7a0b\u83b7\u5f97\u9488\u5bf9",(0,a.kt)("inlineCode",{parentName:"p"},"limu"),"\u4e0e",(0,a.kt)("inlineCode",{parentName:"p"},"immer"),"\u6027\u80fd\u6d4b\u8bd5\u5bf9\u6bd4\u6570\u636e"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/tnfe/limu\ncd limu\nnpm i\ncd benchmark\nnpm i\nnode opBigData.js // \u89e6\u53d1\u6d4b\u8bd5\u6267\u884c\uff0c\u63a7\u5236\u53f0\u56de\u663e\u7ed3\u679c\n# or\nnode caseReadWrite.js\n")),(0,a.kt)("p",null,"\u6211\u4eec\u51c6\u5907\u4e24\u4e2a\u7528\u4f8b\uff0c\u4e00\u4e2a\u6539\u7f16\u81ea immer \u5b98\u65b9\u7684\u6027\u80fd\u6d4b\u8bd5",(0,a.kt)("a",{parentName:"p",href:"https://github.com/immerjs/immer/blob/main/__performance_tests__/add-data.mjs"},"\u6848\u4f8b")),(0,a.kt)("p",null,"\u6267\u884c ",(0,a.kt)("inlineCode",{parentName:"p"},"node opBigData.js")," \u5f97\u5230\u5982\u4e0b\u7ed3\u679c ",(0,a.kt)("img",{parentName:"p",src:"https://user-images.githubusercontent.com/7334950/257369962-c0577e96-cb2c-48cb-8f65-c11979bfd506.png",alt:null})),(0,a.kt)("p",null,"\u4e00\u4e2a\u662f\u6211\u4eec\u81ea\u5df1\u51c6\u5907\u7684\u6df1\u5c42\u6b21 json \u8bfb\u5199\u6848\u4f8b\uff0c\u7ed3\u679c\u5982\u4e0b"),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://user-images.githubusercontent.com/7334950/257380995-1bfc3652-1730-4ecd-ba1b-adaddd3db98d.png",alt:"test 2"})),(0,a.kt)("admonition",{type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"\u53ef\u901a\u8fc7\u6ce8\u5165",(0,a.kt)("inlineCode",{parentName:"p"},"ST"),"\u503c\u8c03\u6574\u4e0d\u540c\u7684\u6d4b\u8bd5\u7b56\u7565\uff0c\u4f8b\u5982 ",(0,a.kt)("inlineCode",{parentName:"p"},"ST=1 node caseReadWrite.js"),"\uff0c\u4e0d\u6ce8\u5165\u65f6\u9ed8\u8ba4\u4e3a ",(0,a.kt)("inlineCode",{parentName:"p"},"1")),(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},"ST=1\uff0c\u5173\u95ed\u51bb\u7ed3\uff0c\u4e0d\u64cd\u4f5c\u6570\u7ec4"),(0,a.kt)("li",{parentName:"ul"},"ST=2\uff0c\u5173\u95ed\u51bb\u7ed3\uff0c\u64cd\u4f5c\u6570\u7ec4"),(0,a.kt)("li",{parentName:"ul"},"ST=3\uff0c\u5f00\u542f\u51bb\u7ed3\uff0c\u4e0d\u64cd\u4f5c\u6570\u7ec4"),(0,a.kt)("li",{parentName:"ul"},"ST=4\uff0c\u5f00\u542f\u51bb\u7ed3\uff0c\u64cd\u4f5c\u6570\u7ec4"))))}d.isMDXComponent=!0},2674:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/limu-1-975e7155cab9a307e9c0fd13425ace04.png"},3118:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/limu-2-767b866877a4df4de296e4e2ae87ed60.png"}}]);