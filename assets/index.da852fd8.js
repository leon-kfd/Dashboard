import{_ as j,d as C,u as L,G as f,r as u,x as F,y as A,w as I,H as T,o,h as i,e as s,C as p,g as $,F as b,j as z,k as S,t as _,R as B}from"./index.85cc7789.js";const D={class:"juejin"},N={key:0,class:"logo"},R={key:1,class:"loading"},U={key:2,class:"error"},V={key:3,class:"list"},q={class:"title"},E=["href"],G={class:"like"},H=C({__name:"index",props:{componentSetting:{type:Object,required:!0}},setup(t){const n=t,h=L(),y=f(()=>h.isLock),w="https://sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/logo.a7995ad.svg",g=u([]),l=u(!1),r=u(!1),m=async()=>{try{l.value=!0,r.value=!1;const c=await fetch(`${B}/api/juejinList?limit=${n.componentSetting.limit||10}`),{list:v}=await c.json();g.value=v.map(e=>({id:e.article_id,title:e.title,like:e.digg_count,view:e.view_count}))}catch(c){r.value=!0,console.error(c)}finally{l.value=!1}};let a;function d(){m(),a&&window.clearInterval(a),a=window.setInterval(()=>{m()},n.componentSetting.duration*60*1e3)}F(()=>d()),A(()=>window.clearInterval(a)),I(()=>[n.componentSetting.duration,n.componentSetting.limit],()=>d());const k=f(()=>T(n.componentSetting.position)),x=()=>{n.componentSetting.clickActionType===1?d():n.componentSetting.clickActionType===2&&window.open("https://juejin.cn/")};return(c,v)=>(o(),i("div",{class:"wrapper",style:p({fontSize:t.componentSetting.textFontSize+"px",color:t.componentSetting.textColor,textShadow:t.componentSetting.textShadow,padding:t.componentSetting.padding+"px",fontFamily:t.componentSetting.fontFamily,...S(k)})},[s("div",D,[t.componentSetting.showTitle!==!1?(o(),i("div",N,[s("img",{src:w,style:p({filter:`drop-shadow(${t.componentSetting.iconShadow})`,cursor:t.componentSetting.clickActionType?"pointer":"default"}),alt:"Juejin",onClick:x},null,4)])):$("",!0),l.value?(o(),i("div",R,"Loading...")):r.value?(o(),i("div",U,"Something error!")):(o(),i("div",V,[(o(!0),i(b,null,z(g.value,e=>(o(),i("div",{class:"list-item",key:e.id},[s("div",q,[s("a",{href:`https://juejin.cn/post/${e.id}`,target:"_blank",style:p(S(y)?"":"pointer-events: none")},_(e.title),13,E)]),s("div",G,"\u{1F44D}"+_(e.like),1)]))),128))]))])],4))}});var M=j(H,[["__scopeId","data-v-189f5c74"]]);export{M as default};