import{_ as f,d as S,r as p,u as v,J as g,w as r,z as y,A as w,H as h,I as k,o as C,k as A,h as I,t as x,D as m,K as $,L as j,N as D}from"./index.af0aa0c6.js";const T=S({name:"Verse",props:{componentSetting:{type:Object,required:!0}},setup(e){const t=p(""),i=p(),l=v(),{t:s}=g();async function a(){try{if(e.componentSetting.source===2){const o=await fetch(`${$}/api/sentence`),{sentence:c}=await o.json();t.value=c}else{const o=await fetch("https://v1.jinrishici.com/all.json"),{content:c}=await o.json();t.value=c}}catch{}}let n;const u=()=>{const o=(e.componentSetting.duration||5)*60*1e3;n&&(window.clearInterval(n),n=null),n=window.setInterval(a,o)};r(()=>e.componentSetting.duration,()=>u(),{immediate:!0}),r(()=>e.componentSetting.source,()=>a()),y(()=>a()),w(()=>n&&window.clearInterval(n));const d=h(()=>k(e.componentSetting.position));return r(()=>t.value,()=>{i.value&&i.value.animate&&i.value.animate({opacity:[0,1]},400)}),{verse:t,positionCSS:d,verseElement:i,handleClickAction:()=>{e.componentSetting.clickActionType===1?(a(),u()):e.componentSetting.clickActionType===2?window.open(`https://hanyu.baidu.com/s?wd=${encodeURIComponent(t.value)}`):e.componentSetting.clickActionType===3&&j(t.value)&&D({title:s("\u63D0\u793A"),type:"success",message:s("\u590D\u5236\u6210\u529F")})},contextmenu:o=>{l.isLock&&o.stopPropagation()}}}});function z(e,t,i,l,s,a){return C(),A("div",{class:"wrapper material-verse",ref:"verseElement",style:m({fontSize:e.componentSetting.textFontSize+"px",color:e.componentSetting.textColor,textShadow:e.componentSetting.textShadow,padding:e.componentSetting.padding+"px",fontFamily:e.componentSetting.fontFamily,...e.positionCSS})},[I("span",{style:m(e.componentSetting.clickActionType?"cursor: pointer":""),onClick:t[0]||(t[0]=(...n)=>e.handleClickAction&&e.handleClickAction(...n)),onContextmenu:t[1]||(t[1]=(...n)=>e.contextmenu&&e.contextmenu(...n))},x(e.verse),37)],4)}var B=f(T,[["render",z],["__scopeId","data-v-c56ca62a"]]);export{B as default};
