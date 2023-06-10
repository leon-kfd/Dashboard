import{_ as R,d as z,S as r,u as L,r as $,a as M,w as P,b as p,o as s,c,e as i,f as e,t as d,g as n,h as _,i as F,j as b,T as Z,F as W,k as X,l as A,m as j,n as B,p as N,M as q,B as x,q as G,s as H,v as K}from"./index.446d5233.js";import{d as Q}from"./direction.8b21c0ae.js";const D=k=>(H("data-v-713a90a4"),k=k(),K(),k),Y={class:"main-config"},tt={class:"base-config-wrapper"},at={class:"config-title"},ot={class:"form-wrapper scrollbar1"},et={key:0,class:"action-component-setting"},lt={class:"title"},nt={class:"flex-center-y"},it={class:"form-row-control"},ut=D(()=>e("div",{class:"label"},"Width",-1)),st={class:"content"},rt=D(()=>e("span",{class:"unit"},"PX",-1)),ct={class:"form-row-control"},dt=D(()=>e("div",{class:"label"},"Height",-1)),mt={class:"content"},ft=D(()=>e("span",{class:"unit"},"PX",-1)),pt={class:"form-row-control"},Ct={class:"label"},_t={class:"content"},Dt={class:"form-row-control"},kt={class:"label"},Vt={class:"content"},bt={class:"form-row-control"},gt={class:"label"},vt={class:"content"},yt=D(()=>e("span",{class:"font-control"},"px",-1)),ht={key:0,class:"component-config-wrapper"},Ft={class:"config-title"},St={class:"form-wrapper scrollbar1"},Et={class:"footer",style:{"text-align":"right",padding:"12px"}},wt=z({__name:"ActionConfig",setup(k,{expose:U}){const S={actionType:0,actionClickType:1,actionClickValue:{url:"",material:"Empty",w:375,h:400,background:"rgba(255, 255, 255, 0.95)",backgroundFilter:"brightness(0.8)",direction:0,boxShadow:"0 0 4px #89909c",borderRadius:4,componentSetting:JSON.parse(JSON.stringify(r.Empty.formData))}},g=L(),V=$(!1),E=$(),t=M({formData:JSON.parse(JSON.stringify(S)),actionClickFormConf:{}});let m,v=!1;const J=a=>{m=a,a.actionSetting&&a.actionSetting.actionType?t.formData=JSON.parse(JSON.stringify(a.actionSetting)):t.formData=JSON.parse(JSON.stringify(S));const o=t.formData.actionClickValue.material;t.actionClickFormConf=B(typeof r[o].formConf=="function"?r[o].formConf(t.formData.actionClickValue.componentSetting):r[o].formConf),V.value=!0,setTimeout(()=>{v=!0})},C=()=>{V.value=!1,v=!1};P(()=>t.formData.actionClickValue.material,()=>{var a,o;if(v){if(((o=(a=m==null?void 0:m.actionSetting)==null?void 0:a.actionClickValue)==null?void 0:o.material)===t.formData.actionClickValue.material)return;const u=t.formData.actionClickValue.material;t.formData.actionClickValue.componentSetting=JSON.parse(JSON.stringify(r[u].formData)),t.actionClickFormConf=B(typeof r[u].formConf=="function"?r[u].formConf(t.formData.actionClickValue.componentSetting):r[u].formConf)}});const O=()=>{if(t.formData.actionType){if(t.formData.actionClickType===1)E.value.validate(a=>{if(a){const o={...m,actionSetting:N(t.formData)};g.editComponent(o),C()}else return!1});else if(t.formData.actionClickType===2)if(/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(t.formData.actionClickValue.url)){/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(t.formData.actionClickValue.url)||(t.formData.actionClickValue.url="https://"+t.formData.actionClickValue.url);const a={...m,actionSetting:N(t.formData)};g.editComponent(a),C()}else alert("\u8DF3\u8F6C\u76EE\u6807URL\u4E0D\u5408\u6CD5")}else{const a={...m,actionSetting:null};g.editComponent(a),C()}};return U({open:J,close:C}),(a,o)=>{const u=p("el-option"),y=p("el-select"),f=p("el-form-item"),w=p("el-input"),T=p("el-form"),h=p("el-input-number"),I=p("easy-dialog");return s(),c(I,{modelValue:V.value,"onUpdate:modelValue":o[11]||(o[11]=l=>V.value=l),title:a.$t("\u7EC4\u4EF6\u4EA4\u4E92\u914D\u7F6E"),width:"min(800px, 98vw)",height:"min(600px, 90vh)"},{footer:i(()=>[e("div",Et,[e("button",{type:"button",class:"btn",onClick:C},d(a.$t("\u53D6\u6D88")),1),e("button",{type:"button",class:"btn btn-primary",onClick:O},d(a.$t("\u786E\u8BA4")),1)])]),default:i(()=>[e("div",Y,[e("div",tt,[e("div",at,d(a.$t("\u57FA\u7840\u914D\u7F6E")),1),e("div",ot,[n(T,{"label-width":"100px"},{default:i(()=>[n(f,{label:a.$t("\u4EA4\u4E92\u884C\u4E3A")},{default:i(()=>[n(y,{modelValue:t.formData.actionType,"onUpdate:modelValue":o[0]||(o[0]=l=>t.formData.actionType=l)},{default:i(()=>[n(u,{label:a.$t("\u65E0"),value:0},null,8,["label"]),n(u,{label:a.$t("\u9F20\u6807\u70B9\u51FB"),value:1},null,8,["label"])]),_:1},8,["modelValue"])]),_:1},8,["label"]),t.formData.actionType===1?(s(),c(f,{key:0,label:a.$t("\u9F20\u6807\u70B9\u51FB")},{default:i(()=>[n(y,{modelValue:t.formData.actionClickType,"onUpdate:modelValue":o[1]||(o[1]=l=>t.formData.actionClickType=l)},{default:i(()=>[n(u,{label:a.$t("\u663E\u793A\u65B0\u7EC4\u4EF6(Toggle)"),value:1},null,8,["label"]),n(u,{label:a.$t("\u8DF3\u8F6C\u94FE\u63A5"),value:2},null,8,["label"]),n(u,{label:a.$t("\u8FD0\u884CJavascript\u811A\u672C"),value:3,disabled:""},null,8,["label"])]),_:1},8,["modelValue"])]),_:1},8,["label"])):_("",!0),t.formData.actionType===1&&t.formData.actionClickType===2?(s(),c(f,{key:1},{default:i(()=>[n(w,{modelValue:t.formData.actionClickValue.url,"onUpdate:modelValue":o[2]||(o[2]=l=>t.formData.actionClickValue.url=l),placeholder:a.$t("\u8BF7\u8F93\u5165\u4E00\u4E2A\u53EF\u7528\u7684\u8DF3\u8F6C\u94FE\u63A5")},null,8,["modelValue","placeholder"])]),_:1})):_("",!0)]),_:1}),t.formData.actionType===1&&t.formData.actionClickType===1?(s(),F("div",et,[e("div",lt,d(a.$t("Toggle\u7EC4\u4EF6\u914D\u7F6E")),1),n(T,{ref:"componentSettingForm",class:"setting-form1","label-position":"top"},{default:i(()=>[n(f,{label:a.$t("\u7269\u6599\u7EC4\u4EF6")},{default:i(()=>[e("div",nt,[(s(),c(b(q),{modelValue:t.formData.actionClickValue.material,"onUpdate:modelValue":o[3]||(o[3]=l=>t.formData.actionClickValue.material=l)},null,8,["modelValue"])),n(Z,{content:a.$t("actionMaterialTips")},null,8,["content"])])]),_:1},8,["label"]),n(f,{label:a.$t("\u5C3A\u5BF8")},{default:i(()=>[e("div",it,[ut,e("div",st,[n(h,{modelValue:t.formData.actionClickValue.w,"onUpdate:modelValue":o[4]||(o[4]=l=>t.formData.actionClickValue.w=l),"controls-position":"right",min:40,max:1920,style:{width:"100px"}},null,8,["modelValue"]),rt])]),e("div",ct,[dt,e("div",mt,[n(h,{modelValue:t.formData.actionClickValue.h,"onUpdate:modelValue":o[5]||(o[5]=l=>t.formData.actionClickValue.h=l),"controls-position":"right",min:40,max:1920,style:{width:"100px"}},null,8,["modelValue"]),ft])])]),_:1},8,["label"]),n(f,{label:a.$t("Popover\u914D\u7F6E")},{default:i(()=>[e("div",pt,[e("div",Ct,d(a.$t("\u65B9\u5411")),1),e("div",_t,[n(y,{modelValue:t.formData.actionClickValue.direction,"onUpdate:modelValue":o[6]||(o[6]=l=>t.formData.actionClickValue.direction=l)},{default:i(()=>[(s(!0),F(W,null,X(A(Q),l=>(s(),c(u,{label:l.label,value:l.value,key:l.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),e("div",Dt,[e("div",kt,d(a.$t("\u9634\u5F71")),1),e("div",Vt,[n(w,{style:{width:"100%"},modelValue:t.formData.actionClickValue.boxShadow,"onUpdate:modelValue":o[7]||(o[7]=l=>t.formData.actionClickValue.boxShadow=l),clearable:"",placeholder:a.$t("shadowPlaceholder")},null,8,["modelValue","placeholder"])])]),e("div",bt,[e("div",gt,d(a.$t("\u5706\u89D2")),1),e("div",vt,[n(h,{modelValue:t.formData.actionClickValue.borderRadius,"onUpdate:modelValue":o[8]||(o[8]=l=>t.formData.actionClickValue.borderRadius=l),"controls-position":"right",min:0,max:100,style:{width:"100px"}},null,8,["modelValue"]),yt])])]),_:1},8,["label"]),n(f,{label:a.$t("\u80CC\u666F")},{default:i(()=>[(s(),c(b(x),{background:t.formData.actionClickValue.background,"onUpdate:background":o[9]||(o[9]=l=>t.formData.actionClickValue.background=l),w:t.formData.actionClickValue.w,h:t.formData.actionClickValue.h,positionMode:2},null,40,["background","w","h"])),t.formData.actionClickValue.background.includes("url")?(s(),c(b(G),{key:0,filter:t.formData.actionClickValue.backgroundFilter,"onUpdate:filter":o[10]||(o[10]=l=>t.formData.actionClickValue.backgroundFilter=l)},null,40,["filter"])):_("",!0)]),_:1},8,["label"])]),_:1},512)])):_("",!0)])]),t.formData.actionType===1&&t.formData.actionClickType===1?(s(),F("div",ht,[e("div",Ft,d(a.$t("\u7EC4\u4EF6\u914D\u7F6E")),1),e("div",St,[(s(),c(b(A(j)),{formData:t.formData.actionClickValue.componentSetting,formConf:t.actionClickFormConf,ref_key:"componentDetailForm",ref:E,"label-width":"120px"},null,8,["formData","formConf"]))])])):_("",!0)])]),_:1},8,["modelValue","title"])}}});var At=R(wt,[["__scopeId","data-v-713a90a4"]]);export{At as default};
