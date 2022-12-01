import{_ as I,d as A,G as z,H as B,r as g,I as $,w as f,J as v,L as E,y as N,o as x,h as L,e as n,C as p,t as m}from"./index.2be7b799.js";var U="/Dashboard/assets/clear-day.1750460c.svg",j="/Dashboard/assets/cloudy.166af3f1.svg",P="/Dashboard/assets/drizzle.52d1ab01.svg",R="/Dashboard/assets/fog.f25816bc.svg",k="/Dashboard/assets/hurricane.bf691091.svg",M="/Dashboard/assets/mist.a73979af.svg",D="/Dashboard/assets/not-available.370934e3.svg",T="/Dashboard/assets/overcast-day.65e5e477.svg",W="/Dashboard/assets/overcast.404c05a4.svg",q="/Dashboard/assets/rain.5cfdb502.svg",G="/Dashboard/assets/sleet.4e1d5513.svg",H="/Dashboard/assets/snow.3716e1b7.svg",J="/Dashboard/assets/thermometer-colder.27e44f79.svg",O="/Dashboard/assets/thermometer-warmer.a2cb4247.svg",V="/Dashboard/assets/thunderstorms-rain.a29ad635.svg",K="/Dashboard/assets/wind.2fc5eaed.svg",Q="/Dashboard/assets/clear-day.49d8c731.svg",X="/Dashboard/assets/cloudy.748e25f6.svg",Y="/Dashboard/assets/drizzle.a4dba4de.svg",Z="/Dashboard/assets/fog.3b9c20d0.svg",ee="/Dashboard/assets/hurricane.f598fa4b.svg",se="/Dashboard/assets/mist.6bc8e890.svg",ae="/Dashboard/assets/not-available.71622bd8.svg",te="/Dashboard/assets/overcast-day.8a30a844.svg",oe="/Dashboard/assets/overcast.49e2e20c.svg",re="/Dashboard/assets/rain.b26b9aff.svg",ie="/Dashboard/assets/sleet.ff126866.svg",ne="/Dashboard/assets/snow.050f823c.svg",ce="/Dashboard/assets/thermometer-colder.761f5be2.svg",ue="/Dashboard/assets/thermometer-warmer.dfa3e251.svg",ge="/Dashboard/assets/thunderstorms-rain.5c8d2cef.svg",de="/Dashboard/assets/wind.e44ecfa2.svg";function y(e){return e.includes("\u98CE")?["\u9F99\u5377\u98CE","\u72C2\u7206\u98CE","\u98D3\u98CE","\u70ED\u5E26\u98CE\u66B4"].includes(e)?"\u9F99\u5377\u98CE":"\u98CE":e.includes("\u973E")||e.includes("\u96FE")?["\u91CD","\u5927","\u6D53","\u6C99","\u5C18"].some(o=>e.includes(o))?"\u5927\u96FE":"\u5C0F\u96FE":e.includes("\u96E8")?e.includes("\u96F7")?"\u96F7\u9635\u96E8":e.includes("\u96EA")?"\u96E8\u5939\u96EA":e.includes("\u5927")||e.includes("\u66B4")?"\u5927\u96E8":"\u5C0F\u96E8":e.includes("\u96EA")?"\u96EA":e}const _e={\u6674:"clear-day",\u5C11\u4E91:"cloudy",\u6674\u95F4\u591A\u4E91:"overcast-day",\u591A\u4E91:"overcast",\u9634:"overcast",\u5E73\u9759:"overcast",\u98CE:"wind",\u9F99\u5377\u98CE:"hurricane",\u5927\u96FE:"fog",\u5C0F\u96FE:"mist",\u96F7\u9635\u96E8:"thunderstorms-rain",\u5927\u96E8:"rain",\u5C0F\u96E8:"drizzle",\u96E8\u5939\u96EA:"sleet",\u96EA:"snow",\u70ED:"thermometer-warmer",\u51B7:"thermometer-colder",\u672A\u77E5:"not-available"};function le(e){return new URL({"../../assets/imgs/weather-animation-icon/clear-day.svg":Q,"../../assets/imgs/weather-animation-icon/cloudy.svg":X,"../../assets/imgs/weather-animation-icon/drizzle.svg":Y,"../../assets/imgs/weather-animation-icon/fog.svg":Z,"../../assets/imgs/weather-animation-icon/hurricane.svg":ee,"../../assets/imgs/weather-animation-icon/mist.svg":se,"../../assets/imgs/weather-animation-icon/not-available.svg":ae,"../../assets/imgs/weather-animation-icon/overcast-day.svg":te,"../../assets/imgs/weather-animation-icon/overcast.svg":oe,"../../assets/imgs/weather-animation-icon/rain.svg":re,"../../assets/imgs/weather-animation-icon/sleet.svg":ie,"../../assets/imgs/weather-animation-icon/snow.svg":ne,"../../assets/imgs/weather-animation-icon/thermometer-colder.svg":ce,"../../assets/imgs/weather-animation-icon/thermometer-warmer.svg":ue,"../../assets/imgs/weather-animation-icon/thunderstorms-rain.svg":ge,"../../assets/imgs/weather-animation-icon/wind.svg":de}[`../../assets/imgs/weather-animation-icon/${e}.svg`],self.location).href}function ve(e){return new URL({"../../assets/imgs/weather-static-icon/clear-day.svg":U,"../../assets/imgs/weather-static-icon/cloudy.svg":j,"../../assets/imgs/weather-static-icon/drizzle.svg":P,"../../assets/imgs/weather-static-icon/fog.svg":R,"../../assets/imgs/weather-static-icon/hurricane.svg":k,"../../assets/imgs/weather-static-icon/mist.svg":M,"../../assets/imgs/weather-static-icon/not-available.svg":D,"../../assets/imgs/weather-static-icon/overcast-day.svg":T,"../../assets/imgs/weather-static-icon/overcast.svg":W,"../../assets/imgs/weather-static-icon/rain.svg":q,"../../assets/imgs/weather-static-icon/sleet.svg":G,"../../assets/imgs/weather-static-icon/snow.svg":H,"../../assets/imgs/weather-static-icon/thermometer-colder.svg":J,"../../assets/imgs/weather-static-icon/thermometer-warmer.svg":O,"../../assets/imgs/weather-static-icon/thunderstorms-rain.svg":V,"../../assets/imgs/weather-static-icon/wind.svg":K}[`../../assets/imgs/weather-static-icon/${e}.svg`],self.location).href}function me(e,o=!0){const r=y(e)||"\u672A\u77E5",s=_e[r]||"not-available";return o===!1?ve(s):le(s)}const he=A({name:"Weather",props:{componentSetting:{type:Object,required:!0}},setup(e){const o=z(()=>B(e.componentSetting.position)),r=g(""),s=g(""),{t:c}=$(),_=g(D),h=g("24"),w=g("\u672A\u77E5"),b=async()=>{try{const t=await fetch(`${v}/tapi/amap/v3/weather/weatherInfo?extensions=base&city=${s.value}`),{status:u,lives:a}=await t.json();if(u==="1"){const{weather:d,temperature:l}=a[0];_.value=me(d,e.componentSetting.animationIcon),w.value=y(d),h.value=l}else throw new Error("API error")}catch{E({title:c("\u63D0\u793A"),type:"error",message:c("\u83B7\u53D6\u5929\u6C14\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E!")})}};f(()=>[e.componentSetting.weatherMode,e.componentSetting.cityName,e.componentSetting.animationIcon],async()=>{try{if(e.componentSetting.weatherMode===1){const t=await fetch(`${v}/tapi/ipInfo`),{code:u,data:a}=await t.json();if(u===0&&a)r.value=a.city.replace(/[市城区]/g,""),s.value=a.city_id;else throw new Error("API error")}else{if(!e.componentSetting.cityName)return;const t=await fetch(`${v}/tapi/amap/v3/config/district?keywords=${e.componentSetting.cityName}&subdistrict=0`),{status:u,districts:a}=await t.json();if(u==="1"&&a.length>0){const d=a.find(S=>S.level==="city"),{adcode:l,name:F}=d;r.value=F.replace(/[市城区]/g,""),s.value=l}else throw new Error("API error")}}catch{E({title:c("\u63D0\u793A"),type:"error",message:c("\u65E0\u6CD5\u8BC6\u522B\u51FA\u57CE\u5E02\uFF0C\u8BF7\u91CD\u65B0\u914D\u7F6E")})}b()},{immediate:!0});let i;const C=()=>{const t=(e.componentSetting.duration||15)*60*1e3;i&&(window.clearInterval(i),i=null),i=window.setInterval(b,t)};return f(()=>e.componentSetting.duration,()=>C(),{immediate:!0}),N(()=>i&&window.clearInterval(i)),{positionCSS:o,cityName:r,adcode:s,weatherIcon:_,weatherText:w,temperature:h}}}),we={class:"weather-box"},be={class:"weather-icon-wrapper"},fe=["src"],Ee={class:"weather-text-wrapper"},pe={class:"temperature"},De={class:"city"};function ye(e,o,r,s,c,_){return x(),L("div",{class:"wrapper",style:p({fontSize:e.componentSetting.baseFontSize+"px",color:e.componentSetting.textColor,textShadow:e.componentSetting.textShadow,padding:e.componentSetting.padding+"px",fontFamily:e.componentSetting.fontFamily,...e.positionCSS})},[n("div",we,[n("div",be,[n("img",{src:e.weatherIcon,style:p({filter:`drop-shadow(${e.componentSetting.iconShadow})`}),alt:"weather icon"},null,12,fe)]),n("div",Ee,[n("div",pe,m(e.temperature)+"\xB0",1),n("div",De,m(e.cityName)+" | "+m(e.weatherText),1)])])],4)}var Fe=I(he,[["render",ye],["__scopeId","data-v-11bcc358"]]);export{Fe as default};
