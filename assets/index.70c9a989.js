import{_ as x,d as b,u as C,G as _,r as h,x as I,y as L,w as A,H as F,o,i as n,f as s,C as l,h as d,F as T,k as z,t as w,s as B,v as E,R as $}from"./index.8a015512.js";const j=e=>(B("data-v-4f50463a"),e=e(),E(),e),D={class:"weibo"},N=j(()=>s("div",{class:"logo-text"},"\u5FAE\u535A\u70ED\u641C",-1)),R={key:1,class:"loading"},U={key:2,class:"error"},V={key:3,class:"list"},q={class:"num",style:{width:"24px",height:"24px"}},G=["src"],H={class:"title"},M=["href"],O={key:0,class:"count"},P={class:"icon",style:{width:"24px",height:"24px"}},W=["src"],J="https://h5.sinaimg.cn/m/weibo-lite/img/pwalogo.417d1674.svg",K=b({__name:"index",props:{componentSetting:{type:Object,required:!0}},setup(e){const i=e,y=C(),S=_(()=>y.isLock),g=h([]),r=h(!1),u=h(!1),m=async()=>{try{r.value=!0,u.value=!1;const a=await fetch(`${$}/api/weiboList?limit=${i.componentSetting.limit||10}`),{list:v}=await a.json();g.value=v.map(t=>({num:t.pic,id:t.desc,title:t.desc,icon:t.icon,link:t.scheme,count:~~(t.desc_extr/1e4)}))}catch(a){u.value=!0,console.error(a)}finally{r.value=!1}};let c;function p(){m(),c&&window.clearInterval(c),c=window.setInterval(()=>{m()},i.componentSetting.duration*60*1e3)}I(()=>p()),L(()=>window.clearInterval(c)),A(()=>[i.componentSetting.duration,i.componentSetting.limit],()=>p());const f=_(()=>F(i.componentSetting.position)),k=()=>{i.componentSetting.clickActionType===1?p():i.componentSetting.clickActionType===2&&window.open("https://weibo.com/")};return(a,v)=>(o(),n("div",{class:"wrapper material-weibolist",style:l({fontSize:e.componentSetting.textFontSize+"px",color:e.componentSetting.textColor,textShadow:e.componentSetting.textShadow,padding:e.componentSetting.padding+"px",fontFamily:e.componentSetting.fontFamily,...f.value})},[s("div",D,[e.componentSetting.showTitle!==!1?(o(),n("div",{key:0,class:"logo",style:l({cursor:e.componentSetting.clickActionType?"pointer":"default"}),onClick:k},[s("img",{src:J,alt:"Weibo",style:l({filter:`drop-shadow(${e.componentSetting.iconShadow})`})},null,4),N],4)):d("",!0),r.value?(o(),n("div",R,"Loading...")):u.value?(o(),n("div",U,"Something error!")):(o(),n("div",V,[(o(!0),n(T,null,z(g.value,t=>(o(),n("div",{class:"list-item",key:t.id},[s("div",q,[t.num?(o(),n("img",{key:0,src:t.num,style:{width:"100%",height:"100%"}},null,8,G)):d("",!0)]),s("div",H,[s("a",{href:t.link,target:"_blank",style:l(S.value?"":"pointer-events: none")},w(t.title),13,M)]),t.count?(o(),n("div",O,w(t.count)+"w",1)):d("",!0),s("div",P,[t.icon?(o(),n("img",{key:0,src:t.icon,style:{width:"100%",height:"100%"}},null,8,W)):d("",!0)])]))),128))]))])],4))}});var X=x(K,[["__scopeId","data-v-4f50463a"]]);export{X as default};