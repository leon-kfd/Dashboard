import{_ as b,d as X,r as i,x as Y,y as D,w as N,o as h,c as V,f as T,b as H,h as I,z as M,g as O,A as U,C as W,D as j,E as q,p as F}from"./index.a2e9d0fa.js";import{g as P}from"./direction.8b21c0ae.js";const G=X({__name:"ActionPopover",props:{popoverCustomClass:{type:String},closeOnClickOutside:{type:Boolean,default:!0},zIndex:{type:Number,default:2001}},emits:["opend","closed"],setup(v,{expose:E,emit:g}){const S=v,n=i(!1),a=i(!1),d=i(""),w=i();Y(()=>{document.addEventListener("click",_)}),D(()=>{document.removeEventListener("click",_)});const _=e=>{!S.closeOnClickOutside||n.value&&!w.value.contains(e.target)&&(n.value=!1)},t=i({width:200,height:200,top:0,left:0});let p=null;const x=()=>{p&&clearTimeout(p),p=setTimeout(()=>{const e=(window.innerHeight-t.value.height)/2,o=(window.innerWidth-t.value.width)/2;t.value.top=e,t.value.left=o},200)},y=async(e,o)=>{setTimeout(()=>{if(!e.actionSetting)return;const{actionSetting:s}=e,{actionType:m,actionClickType:l,actionClickValue:r}=s;if(m===1&&l===1){const{w:c,h:u,direction:C}=r,[k,z,L,$]=P(o,{width:c||200,height:u||200},C);t.value={width:c||200,height:u||200,left:k,top:z},d.value=`${L-k}px ${$-z}px`,n.value=!0,a.value=C===0,a.value&&window.addEventListener("resize",x,!0)}})},f=()=>{a.value&&window.removeEventListener("resize",x,!0),n.value=!1,a.value=!1},A=(e,o)=>{n.value?f():y(e,o)},B=({w:e,h:o,direction:s},m)=>{setTimeout(()=>{const[l,r,c,u]=P(m,{width:e||200,height:o||200},s);t.value={width:e||200,height:o||200,left:l,top:r},d.value=`${c-l}px ${u-r}px`,n.value=!0,a.value=s===0})};return N(()=>n.value,e=>{g(e?"opend":"closed")}),E({open:y,close:f,toggle:A,defaultOpen:B}),(e,o)=>{const s=F("Icon");return h(),V(q,{to:"body"},[T(j,{name:"zoomIn"},{default:H(()=>[n.value?(h(),I("div",{key:0,ref_key:"actionPopover",ref:w,class:U(["action-popover",v.popoverCustomClass]),style:W({width:t.value.width+"px",height:t.value.height+"px",top:t.value.top+"px",left:t.value.left+"px",transformOrigin:d.value,zIndex:v.zIndex})},[M(e.$slots,"default",{},void 0,!0),a.value?(h(),I("div",{key:0,class:"close",onClick:f},[T(s,{name:"close"})])):O("",!0)],6)):O("",!0)]),_:3})])}}});var Q=b(G,[["__scopeId","data-v-362fa65f"]]);export{Q as default};
