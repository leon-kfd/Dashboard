import{_ as X,d as Y,r as i,z as b,A as D,w as N,e as V,o as g,f as j,i as z,g as G,k as E,B as H,j as I,C as M,D as U,E as W,G as q}from"./index.7c50bf55.js";import{g as O}from"./direction.52659f5b.js";const F=Y({__name:"ActionPopover",props:{popoverCustomClass:{type:String},closeOnClickOutside:{type:Boolean,default:!0},zIndex:{type:Number,default:2001}},emits:["opened","closed","startClose"],setup(d,{expose:P,emit:v}){const B=d,n=i(!1),s=i(!1),p=i(""),_=i();b(()=>{document.addEventListener("click",C)}),D(()=>{document.removeEventListener("click",C)});const C=e=>{!B.closeOnClickOutside||n.value&&!_.value.contains(e.target)&&(n.value=!1)},t=i({width:200,height:200,top:0,left:0});let f=null;const m=()=>{f&&clearTimeout(f),f=setTimeout(()=>{const e=(window.innerHeight-t.value.height)/2,o=(window.innerWidth-t.value.width)/2;t.value.top=e,t.value.left=o},200)},x=async(e,o)=>{setTimeout(()=>{if(!e.actionSetting)return;const{actionSetting:a}=e,{actionType:w,actionClickType:l,actionClickValue:r}=a;if(w===1&&l===1){const{w:c,h:u,direction:k}=r,[y,T,A,$]=O(o,{width:c||200,height:u||200},k);t.value={width:c||200,height:u||200,left:y,top:T},p.value=`${A-y}px ${$-T}px`,n.value=!0,s.value=k===0,s.value&&window.addEventListener("resize",m,!0)}})},h=()=>{s.value&&window.removeEventListener("resize",m,!0),v("startClose"),n.value=!1,s.value=!1},L=(e,o)=>{n.value?h():x(e,o)},S=({w:e,h:o,direction:a},w)=>{setTimeout(()=>{const[l,r,c,u]=O(w,{width:e||200,height:o||200},a);t.value={width:e||200,height:o||200,left:l,top:r},p.value=`${c-l}px ${u-r}px`,n.value=!0,s.value=a===0,s.value&&window.addEventListener("resize",m,!0)})};return N(()=>n.value,e=>{setTimeout(e?()=>v("opened"):()=>v("closed"),400)}),P({open:x,close:h,toggle:L,defaultOpen:S}),(e,o)=>{const a=V("Icon");return g(),j(q,{to:"body"},[z(W,{name:"zoomIn"},{default:G(()=>[n.value?(g(),E("div",{key:0,ref_key:"actionPopover",ref:_,class:M(["action-popover",d.popoverCustomClass]),style:U({width:t.value.width+"px",height:t.value.height+"px",top:t.value.top+"px",left:t.value.left+"px",transformOrigin:p.value,zIndex:d.zIndex})},[H(e.$slots,"default",{},void 0,!0),s.value?(g(),E("div",{key:0,class:"close",onClick:h},[z(a,{name:"close"})])):I("",!0)],6)):I("",!0)]),_:3})])}}});var Q=X(F,[["__scopeId","data-v-81cefdee"]]);export{Q as default};
