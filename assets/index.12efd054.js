var F=Object.defineProperty;var h=Object.getOwnPropertySymbols;var b=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var w=(e,t,i)=>t in e?F(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,j=(e,t)=>{for(var i in t||(t={}))b.call(t,i)&&w(e,i,t[i]);if(h)for(var i of h(t))z.call(t,i)&&w(e,i,t[i]);return e};import{_ as A,d as I,u as T,G as S,r as u,x as $,y as B,w as D,o,j as a,g as s,E as m,i as E,F as N,l as P,m as _,H as U,t as y,P as V}from"./index.e665cea8.js";const q={class:"juejin"},G={key:0,class:"logo"},H={key:1,class:"loading"},J={key:2,class:"error"},M={key:3,class:"list"},O={class:"title"},R=["href"],K={class:"like"},Q=I({__name:"index",props:{componentSetting:{type:Object,required:!0}},setup(e){const t=e,i=T(),x=S(()=>i.isLock),k="https://sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/logo.a7995ad.svg",g=u([]),r=u(!1),d=u(!1),f=async()=>{try{r.value=!0,d.value=!1;const c=await fetch(`${V}/api/juejinList?limit=${t.componentSetting.limit||10}`),{list:v}=await c.json();g.value=v.map(n=>({id:n.article_id,title:n.title,like:n.digg_count,view:n.view_count}))}catch(c){d.value=!0,console.error(c)}finally{r.value=!1}};let l;function p(){f(),l&&window.clearInterval(l),l=window.setInterval(()=>{f()},t.componentSetting.duration*60*1e3)}$(()=>p()),B(()=>window.clearInterval(l)),D(()=>[t.componentSetting.duration,t.componentSetting.limit],()=>p());const L=S(()=>U(t.componentSetting.position)),C=()=>{t.componentSetting.clickActionType===1?p():t.componentSetting.clickActionType===2&&window.open("https://juejin.cn/")};return(c,v)=>(o(),a("div",{class:"wrapper",style:m(j({fontSize:e.componentSetting.textFontSize+"px",color:e.componentSetting.textColor,textShadow:e.componentSetting.textShadow,padding:e.componentSetting.padding+"px",fontFamily:e.componentSetting.fontFamily},_(L)))},[s("div",q,[e.componentSetting.showTitle!==!1?(o(),a("div",G,[s("img",{src:k,style:m({filter:`drop-shadow(${e.componentSetting.iconShadow})`,cursor:e.componentSetting.clickActionType?"pointer":"default"}),alt:"Juejin",onClick:C},null,4)])):E("",!0),r.value?(o(),a("div",H,"Loading...")):d.value?(o(),a("div",J,"Something error!")):(o(),a("div",M,[(o(!0),a(N,null,P(g.value,n=>(o(),a("div",{class:"list-item",key:n.id},[s("div",O,[s("a",{href:`https://juejin.cn/post/${n.id}`,target:"_blank",style:m(_(x)?"":"pointer-events: none")},y(n.title),13,R)]),s("div",K,"\u{1F44D}"+y(n.like),1)]))),128))]))])],4))}});var Y=A(Q,[["__scopeId","data-v-189f5c74"]]);export{Y as default};