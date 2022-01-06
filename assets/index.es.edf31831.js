import{i as e,q as t,j as n,B as o,W as r,C as i,D as a,F as l,G as s,H as d,J as c,K as u,b as m,y as p,P as f,r as h,A as v,L as g,O as y,d as b,Q as w}from"./index.0c4b778e.js";import"./index.f6dcb164.js";import"./color.556e4bcb.js";function L(e){return"object"==typeof e&&null!=e&&1===e.nodeType}function k(e,t){return(!t||"hidden"!==e)&&"visible"!==e&&"clip"!==e}function E(e,t){if(e.clientHeight<e.scrollHeight||e.clientWidth<e.scrollWidth){var n=getComputedStyle(e,null);return k(n.overflowY,t)||k(n.overflowX,t)||!!(r=function(e){if(!e.ownerDocument||!e.ownerDocument.defaultView)return null;try{return e.ownerDocument.defaultView.frameElement}catch(t){return null}}(o=e))&&(r.clientHeight<o.scrollHeight||r.clientWidth<o.scrollWidth)}var o,r;return!1}function x(e,t,n,o,r,i,a,l){return i<e&&a>t||i>e&&a<t?0:i<=e&&l<=n||a>=t&&l>=n?i-e-o:a>t&&l<n||i<e&&l>n?a-t+r:0}function $(e,t){var n=window,o=t.scrollMode,r=t.block,i=t.inline,a=t.boundary,l=t.skipOverflowHiddenElements,s="function"==typeof a?a:function(e){return e!==a};if(!L(e))throw new TypeError("Invalid target");for(var d=document.scrollingElement||document.documentElement,c=[],u=e;L(u)&&s(u);){if((u=u.parentElement)===d){c.push(u);break}null!=u&&u===document.body&&E(u)&&!E(document.documentElement)||null!=u&&E(u,l)&&c.push(u)}for(var m=n.visualViewport?n.visualViewport.width:innerWidth,p=n.visualViewport?n.visualViewport.height:innerHeight,f=window.scrollX||pageXOffset,h=window.scrollY||pageYOffset,v=e.getBoundingClientRect(),g=v.height,y=v.width,b=v.top,w=v.right,k=v.bottom,$=v.left,N="start"===r||"nearest"===r?b:"end"===r?k:b+g/2,H="center"===i?$+y/2:"end"===i?w:$,M=[],T=0;T<c.length;T++){var C=c[T],O=C.getBoundingClientRect(),W=O.height,j=O.width,A=O.top,D=O.right,I=O.bottom,S=O.left;if("if-needed"===o&&b>=0&&$>=0&&k<=p&&w<=m&&b>=A&&k<=I&&$>=S&&w<=D)return M;var P=getComputedStyle(C),q=parseInt(P.borderLeftWidth,10),B=parseInt(P.borderTopWidth,10),V=parseInt(P.borderRightWidth,10),X=parseInt(P.borderBottomWidth,10),Y=0,_=0,K="offsetWidth"in C?C.offsetWidth-C.clientWidth-q-V:0,z="offsetHeight"in C?C.offsetHeight-C.clientHeight-B-X:0;if(d===C)Y="start"===r?N:"end"===r?N-p:"nearest"===r?x(h,h+p,p,B,X,h+N,h+N+g,g):N-p/2,_="start"===i?H:"center"===i?H-m/2:"end"===i?H-m:x(f,f+m,m,q,V,f+H,f+H+y,y),Y=Math.max(0,Y+h),_=Math.max(0,_+f);else{Y="start"===r?N-A-B:"end"===r?N-I+X+z:"nearest"===r?x(A,I,W,B,X+z,N,N+g,g):N-(A+W/2)+z/2,_="start"===i?H-S-q:"center"===i?H-(S+j/2)+K/2:"end"===i?H-D+V+K:x(S,D,j,q,V+K,H,H+y,y);var F=C.scrollLeft,R=C.scrollTop;N+=R-(Y=Math.max(0,Math.min(R+Y,C.scrollHeight-W+z))),H+=F-(_=Math.max(0,Math.min(F+_,C.scrollWidth-j+K)))}M.push({el:C,top:Y,left:_})}return M}function N(e){return e===Object(e)&&0!==Object.keys(e).length}function H(e,t){var n=!e.ownerDocument.documentElement.contains(e);if(N(t)&&"function"==typeof t.behavior)return t.behavior(n?[]:$(e,t));if(!n){var o=function(e){return!1===e?{block:"end",inline:"nearest"}:N(e)?e:{block:"start",inline:"nearest"}}(t);return function(e,t){void 0===t&&(t="auto");var n="scrollBehavior"in document.body.style;e.forEach((function(e){var o=e.el,r=e.top,i=e.left;o.scroll&&n?o.scroll({top:r,left:i,behavior:t}):(o.scrollTop=r,o.scrollLeft=i)}))}($(e,o),o.behavior)}}var M,T=function(){return M||(M="performance"in window?performance.now.bind(performance):Date.now),M()};function C(e){var t=T(),n=Math.min((t-e.startTime)/e.duration,1),o=e.ease(n),r=e.startX+(e.x-e.startX)*o,i=e.startY+(e.y-e.startY)*o;e.method(r,i),r!==e.x||i!==e.y?requestAnimationFrame((function(){return C(e)})):e.cb()}function O(e,t,n,o,r,i){var a,l,s;void 0===o&&(o=600),void 0===r&&(r=function(e){return 1+--e*e*e*e*e}),a=e,l=e.scrollLeft,s=e.scrollTop,C({scrollable:a,method:function(t,n){e.scrollLeft=Math.ceil(t),e.scrollTop=Math.ceil(n)},startTime:T(),startX:l,startY:s,x:t,y:n,duration:o,ease:r,cb:i})}var W=function(e,t){var n=t||{};return function(e){return e&&!e.behavior||"smooth"===e.behavior}(n)?H(e,{block:n.block,inline:n.inline,scrollMode:n.scrollMode,boundary:n.boundary,behavior:function(e){return Promise.all(e.reduce((function(e,t){var o=t.el,r=t.left,i=t.top,a=o.scrollLeft,l=o.scrollTop;return a===r&&l===i?e:[].concat(e,[new Promise((function(e){return O(o,r,i,n.duration,n.ease,(function(){return e({el:o,left:[a,r],top:[l,i]})}))}))])}),[]))}}):Promise.resolve(H(e,t))},j=Object.getOwnPropertySymbols,A=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;const I=e=>{var t,n,o;const{mixin:r,size:i,palette:a}=e;return b`
        width: 20.5rem;
        max-height: 20.5rem;
        overflow-y: auto;
        ${null==(t=r.border)?void 0:t.call(r)};
        border-radius: ${i.radius};
        position: absolute;
        background: ${a("surface")};

        ${null==(n=r.shadow)?void 0:n.call(r)};

        &.hide {
            display: none;
        }

        ${null==(o=r.scrollbar)?void 0:o.call(r)};

        ${(({font:e,palette:t})=>b`
        .slash-dropdown-item {
            display: flex;
            gap: 2rem;
            height: 3rem;
            padding: 0 1rem;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;
            line-height: 2;
            font-family: ${e.typography};
            font-size: 0.875rem;

            transition: all 0.2s ease-in-out;

            &,
            .icon {
                color: ${t("neutral",.87)};
                transition: all 0.2s ease-in-out;
            }

            &.hide {
                display: none;
            }

            &.active {
                background: ${t("secondary",.12)};
                &,
                .icon {
                    color: ${t("primary")};
                }
            }
            `)(e)}
    `},S=(e,t,n,o)=>{var r;const i=null!=(r=null==o?void 0:o.textClassName)?r:"text",a=document.createElement("div");a.setAttribute("role","option"),a.classList.add("slash-dropdown-item");const l=e.slots.icon(n),s=document.createElement("span");return s.textContent=t,s.className=i,a.appendChild(l),a.appendChild(s),a},P=(m,p="/")=>{const{nodes:f}=m.get(e),h=[{id:"h1",dom:S(m.get(t),"Large Heading","h1"),command:()=>m.get(n).call(o,1),keyword:["h1","large heading"],typeName:"heading"},{id:"h2",dom:S(m.get(t),"Medium Heading","h2"),command:()=>m.get(n).call(o,2),keyword:["h2","medium heading"],typeName:"heading"},{id:"h3",dom:S(m.get(t),"Small Heading","h3"),command:()=>m.get(n).call(o,3),keyword:["h3","small heading"],typeName:"heading"},{id:"bulletList",dom:S(m.get(t),"Bullet List","bulletList"),command:()=>m.get(n).call(r),keyword:["bullet list","ul"],typeName:"bullet_list"},{id:"orderedList",dom:S(m.get(t),"Ordered List","orderedList"),command:()=>m.get(n).call(i),keyword:["ordered list","ol"],typeName:"ordered_list"},{id:"taskList",dom:S(m.get(t),"Task List","taskList"),command:()=>m.get(n).call(a),keyword:["task list","task"],typeName:"task_list_item"},{id:"image",dom:S(m.get(t),"Image","image"),command:()=>m.get(n).call(l),keyword:["image"],typeName:"image"},{id:"blockquote",dom:S(m.get(t),"Quote","quote"),command:()=>m.get(n).call(s),keyword:["quote","blockquote"],typeName:"blockquote"},{id:"table",dom:S(m.get(t),"Table","table"),command:()=>m.get(n).call(d),keyword:["table"],typeName:"table"},{id:"code",dom:S(m.get(t),"Code Fence","code"),command:()=>m.get(n).call(c),keyword:["code"],typeName:"fence"},{id:"divider",dom:S(m.get(t),"Divide Line","divider"),command:()=>m.get(n).call(u),keyword:["divider","hr"],typeName:"hr"}],v=p.slice(1).toLocaleLowerCase();return h.filter((e=>!!f[e.typeName]&&e.keyword.some((e=>e.includes(v))))).map((e=>((e,t)=>{var n={};for(var o in e)A.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&j)for(var o of j(e))t.indexOf(o)<0&&D.call(e,o)&&(n[o]=e[o]);return n})(e,["keyword","typeName"])))},q=e=>({content:t,isTopLevel:n})=>n?t?t.startsWith("/")?"/"===t?{placeholder:"Type to filter...",actions:P(e)}:{actions:P(e,t)}:null:{placeholder:"Type / to use the slash commands..."}:null,B=({font:e,palette:t})=>b`
    position: relative;
    &::before {
        position: absolute;
        cursor: text;
        font-family: ${e.typography};
        font-size: 0.875rem;
        color: ${t("neutral",.6)};
        content: attr(data-text);
        height: 100%;
        display: flex;
        align-items: center;
    }
`,V=()=>b`
    &::before {
        left: 0.5rem;
    }
`,X=(e,t)=>{const n=t.getStyle(B),o=t.getStyle(V);return{handleKeyDown:(t,n)=>!e.isEmpty()&&(n instanceof KeyboardEvent&&!!["ArrowUp","ArrowDown","Enter"].includes(n.key)),decorations:t=>{const r=h((({type:e})=>"paragraph"===e.name))(t.selection);if(!r||r.node.childCount>1||t.selection.$from.parentOffset!==r.node.textContent.length)return void e.clear();const{placeholder:i,actions:a}=e.update({parentNode:t.selection.$from.node(t.selection.$from.depth-1),isTopLevel:1===t.selection.$from.depth,content:r.node.textContent,state:t});if(!i)return null;const l=(e,n)=>{const o=r.pos;return g.create(t.doc,[y.node(o,o+r.node.nodeSize,{class:n.filter((e=>e)).join(" "),"data-text":e})])};return a.length?l(i,[n,o,"empty-node","is-slash"]):l(i,[n,"empty-node"])}}},Y=e=>{return{id:e.id,$:e.dom,command:(t=e.command,(e,n,o)=>(o&&(((e,t)=>{const{selection:n}=e,{$from:o}=n,r=e.tr.deleteRange(o.start(),o.pos);null==t||t(r)})(e,n),t()),!0))};var t},_=(e,t,n)=>{const o=t.dom.parentNode;if(!o)return{};const r=(e=>{const t=document.createElement("div");t.setAttribute("role","listbox"),t.setAttribute("tabindex","-1");const n=e.getStyle(I);return n&&t.classList.add(n),t.classList.add("slash-dropdown","hide"),t})(n),i=(()=>{let e=!1;return{isLock:()=>e,lock:()=>{e=!0},unlock:()=>{e=!1}}})();o.appendChild(r);const a=(e=>()=>{e.unlock()})(i),l=((e,t,n)=>o=>{const{target:r}=o;if(!(r instanceof HTMLElement))return;if(!t)return;const i=()=>{o.stopPropagation(),o.preventDefault()},{actions:a}=e.get(),l=Object.values(a).find((({$:e})=>e.contains(r)));if(!l){if(e.isEmpty())return;return e.clear(),n.classList.add("hide"),void i()}i(),l.command(t.state,t.dispatch,t)})(e,t,r),s=((e,t,n,o)=>r=>{if(!(r instanceof KeyboardEvent))return;o.isLock()||o.lock();const{key:i}=r;if(e.isEmpty())return;if(!["ArrowDown","ArrowUp","Enter","Escape"].includes(i))return;const{actions:a}=e.get();let l=a.findIndex((({$:e})=>e.classList.contains("active")));l<0&&(l=0);const s=e=>{a[l].$.classList.remove("active"),a[e].$.classList.add("active"),W(a[e].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})};if("ArrowDown"!==i)if("ArrowUp"!==i){if("Escape"===i){if(e.isEmpty())return;return e.clear(),void n.classList.add("hide")}a[l].command(t.state,t.dispatch,t),a[l].$.classList.remove("active")}else s(0===l?a.length-1:l-1);else s(l===a.length-1?0:l+1)})(e,t,r,i),d=((e,t)=>n=>{if(t.isLock())return;const{actions:o}=e.get(),r=o.findIndex((e=>e.$.classList.contains("active")));r>=0&&o[r].$.classList.remove("active");const{target:i}=n;i instanceof HTMLElement&&i.classList.add("active")})(e,i),c=e=>{const{target:t}=e;t instanceof HTMLElement&&t.classList.remove("active")};return o.addEventListener("mousemove",a),o.addEventListener("mousedown",l),o.addEventListener("keydown",s),{update:t=>{((e,t,n)=>{const{actions:o}=e.get();return o.length?(t.childNodes.forEach((e=>{e.removeEventListener("mouseenter",n.mouseEnter),e.removeEventListener("mouseleave",n.mouseLeave)})),t.textContent="",o.forEach((({$:e})=>{e.classList.remove("active"),e.addEventListener("mouseenter",n.mouseEnter),e.addEventListener("mouseleave",n.mouseLeave),t.appendChild(e)})),t.classList.remove("hide"),o[0].$.classList.add("active"),requestAnimationFrame((()=>{W(o[0].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})})),!0):(t.classList.add("hide"),!1)})(e,r,{mouseEnter:d,mouseLeave:c})&&((e,t)=>{w(e,t,((e,t,n)=>{let o=e.left-n.left,r=e.bottom-n.top+14;return o<0&&(o=0),window.innerHeight-e.bottom<t.height&&(r=e.top-n.top-t.height-14),[r,o]}))})(t,r)},destroy:()=>{o.removeEventListener("mousemove",a),o.removeEventListener("mousedown",l),o.removeEventListener("keydown",s),r.remove()}}},K=(e,t)=>{const n=(e=>{const t={placeholder:null,actions:[]};return{get:()=>t,clear:()=>{t.placeholder=null,t.actions=[]},update:n=>{var o,r;const i=e(n);return t.placeholder=null!=(o=null==i?void 0:i.placeholder)?o:null,t.actions=(null!=(r=null==i?void 0:i.actions)?r:[]).map(Y),t},isEmpty:()=>0===t.actions.length}})(t);return new p({key:new f("MILKDOWN_PLUGIN_SLASH"),props:X(n,e),view:t=>_(n,t,e)})},z=m(((e,t)=>{var n;const o=null!=(n=null==t?void 0:t.config)?n:q;return{prosePlugins:(t,n)=>{const r=o(n);return[K(e,r)]}}})),F=v.create([z()]);export{S as createDropdownItem,P as defaultActions,q as defaultConfig,F as slash,z as slashPlugin};
