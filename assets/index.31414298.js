import{_ as F,d as w,r as u,w as T,y as v,G as C,H as x,x as D,o as r,i as d,f as h,t as m,C as S,h as f,W as E}from"./index.8a015512.js";const _=w({name:"Clock",props:{componentSetting:{type:Object,required:!0}},setup(t){function o(){let e="",n=t.componentSetting.formatter==="\u81EA\u5B9A\u4E49"?t.componentSetting.custom:t.componentSetting.formatter;try{if(t.componentSetting.chineseWeekDay&&n.includes("dddd")){const c=["\u661F\u671F\u65E5","\u661F\u671F\u4E00","\u661F\u671F\u4E8C","\u661F\u671F\u4E09","\u661F\u671F\u56DB","\u661F\u671F\u4E94","\u661F\u671F\u516D"];n=n.replace("dddd",()=>{try{return c[new Date().getDay()]}catch{return"dddd"}})}e=E().format(n)}catch(c){e="Dayjs\u683C\u5F0F\u5316\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u683C\u5F0F\u5316\u6587\u672C",console.error(c)}return e}const a=u(o());let i;function s(){var e;a.value=o(),i=window.setInterval(()=>{a.value=o()},((e=t.componentSetting)==null?void 0:e.duration)*1e3||5e3)}s(),T(()=>[t.componentSetting.duration,t.componentSetting.formatter,t.componentSetting.custom,t.componentSetting.chineseWeekDay,t.componentSetting.showTTS1,t.componentSetting.showTTS2],()=>{window.clearInterval(i),s(),y()}),v(()=>{window.clearInterval(i)});const l=C(()=>x(t.componentSetting.position)),p=u(""),g=u(""),y=async()=>{try{if(t.componentSetting.showTTS1){const e=await fetch("https://timor.tech/api/holiday/tts/tomorrow"),{tts:n}=await e.json();p.value=n}if(t.componentSetting.showTTS2){const e=await fetch("https://timor.tech/api/holiday/tts/next"),{tts:n}=await e.json();g.value=n}}catch{}};return D(()=>{y()}),{day:a,positionCSS:l,ttsText1:p,ttsText2:g}}}),k={class:"text-wrapper"},z={class:"day"};function j(t,o,a,i,s,l){return r(),d("div",{class:"wrapper material-day",style:S({fontSize:t.componentSetting.textFontSize+"px",color:t.componentSetting.textColor,textShadow:t.componentSetting.textShadow,padding:t.componentSetting.padding+"px",fontFamily:t.componentSetting.fontFamily,...t.positionCSS})},[h("div",k,[h("div",z,m(t.day),1),t.componentSetting.showTTS1&&t.ttsText1?(r(),d("div",{key:0,class:"tts",style:S({fontSize:t.componentSetting.ttsFontSize+"px"})},m(t.ttsText1),5)):f("",!0),t.componentSetting.showTTS2&&t.ttsText2?(r(),d("div",{key:1,class:"tts",style:S({fontSize:t.componentSetting.ttsFontSize+"px"})},m(t.ttsText2),5)):f("",!0)])],4)}var I=F(_,[["render",j],["__scopeId","data-v-25c47cac"]]);export{I as default};