var z=Object.defineProperty;var v=Object.getOwnPropertySymbols;var A=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable;var y=(t,e,i)=>e in t?z(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,_=(t,e)=>{for(var i in e||(e={}))A.call(e,i)&&y(t,i,e[i]);if(v)for(var i of v(e))F.call(e,i)&&y(t,i,e[i]);return t};import{_ as E,d as T,u as j,G as x,r as u,x as B,y as $,w as q,o as n,j as s,g as a,E as r,i as d,F as D,l as N,m as S,p as P,q as U,H as V,t as b,P as G}from"./index.e665cea8.js";const H=t=>(P("data-v-1c9fb5f7"),t=t(),U(),t),M={class:"weibo"},O=H(()=>a("div",{class:"logo-text"},"\u5FAE\u535A\u70ED\u641C",-1)),R={key:1,class:"loading"},W={key:2,class:"error"},J={key:3,class:"list"},K={class:"num",style:{width:"24px",height:"24px"}},Q=["src"],X={class:"title"},Y=["href"],Z={key:0,class:"count"},tt={class:"icon",style:{width:"24px",height:"24px"}},et=["src"],ot=T({__name:"index",props:{componentSetting:{type:Object,required:!0}},setup(t){const e=t,i=j(),k=x(()=>i.isLock),C="https://h5.sinaimg.cn/m/weibo-lite/img/pwalogo.417d1674.svg",w=u([]),p=u(!1),f=u(!1),g=async()=>{try{p.value=!0,f.value=!1;const l=await fetch(`${G}/api/weiboList?limit=${e.componentSetting.limit||10}`),{list:m}=await l.json();w.value=m.map(o=>({num:o.pic,id:o.desc,title:o.desc,icon:o.icon,link:o.scheme,count:~~(o.desc_extr/1e4)}))}catch(l){f.value=!0,console.error(l)}finally{p.value=!1}};let c;function h(){g(),c&&window.clearInterval(c),c=window.setInterval(()=>{g()},e.componentSetting.duration*60*1e3)}B(()=>h()),$(()=>window.clearInterval(c)),q(()=>[e.componentSetting.duration,e.componentSetting.limit],()=>h());const I=x(()=>V(e.componentSetting.position)),L=()=>{e.componentSetting.clickActionType===1?h():e.componentSetting.clickActionType===2&&window.open("https://weibo.com/")};return(l,m)=>(n(),s("div",{class:"wrapper",style:r(_({fontSize:t.componentSetting.textFontSize+"px",color:t.componentSetting.textColor,textShadow:t.componentSetting.textShadow,padding:t.componentSetting.padding+"px",fontFamily:t.componentSetting.fontFamily},S(I)))},[a("div",M,[t.componentSetting.showTitle!==!1?(n(),s("div",{key:0,class:"logo",style:r({cursor:t.componentSetting.clickActionType?"pointer":"default"}),onClick:L},[a("img",{src:C,alt:"Weibo",style:r({filter:`drop-shadow(${t.componentSetting.iconShadow})`})},null,4),O],4)):d("",!0),p.value?(n(),s("div",R,"Loading...")):f.value?(n(),s("div",W,"Something error!")):(n(),s("div",J,[(n(!0),s(D,null,N(w.value,o=>(n(),s("div",{class:"list-item",key:o.id},[a("div",K,[o.num?(n(),s("img",{key:0,src:o.num,style:{width:"100%",height:"100%"}},null,8,Q)):d("",!0)]),a("div",X,[a("a",{href:o.link,target:"_blank",style:r(S(k)?"":"pointer-events: none")},b(o.title),13,Y)]),o.count?(n(),s("div",Z,b(o.count)+"w",1)):d("",!0),a("div",tt,[o.icon?(n(),s("img",{key:0,src:o.icon,style:{width:"100%",height:"100%"}},null,8,et)):d("",!0)])]))),128))]))])],4))}});var st=E(ot,[["__scopeId","data-v-1c9fb5f7"]]);export{st as default};