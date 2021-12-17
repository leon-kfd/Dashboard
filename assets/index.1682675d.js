import{u as e,t,c as n,x as o,W as r,y as i,z as a,A as l,B as s,C as d,D as c,E as u,e as m,F as h,G as f,H as p,w as v,P as g,J as b,K as w}from"./index.421afe8e.js";import"./index.5db14293.js";import"./color.556e4bcb.js";const y=t=>{var n,o,r;const{mixin:i,size:a,palette:l}=t;return e`
        width: 20.5rem;
        max-height: 20.5rem;
        overflow-y: auto;
        ${null===(n=i.border)||void 0===n?void 0:n.call(i)};
        border-radius: ${a.radius};
        position: absolute;
        background: ${l("surface")};

        ${null===(o=i.shadow)||void 0===o?void 0:o.call(i)};

        &.hide {
            display: none;
        }

        ${null===(r=i.scrollbar)||void 0===r?void 0:r.call(i)};

        ${(({font:t,palette:n})=>e`
        .slash-dropdown-item {
            display: flex;
            gap: 2rem;
            height: 3rem;
            padding: 0 1rem;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;
            line-height: 2;
            font-family: ${t.typography};
            font-size: 0.875rem;

            transition: all 0.2s ease-in-out;

            &,
            .icon {
                color: ${n("neutral",.87)};
                transition: all 0.2s ease-in-out;
            }

            &.hide {
                display: none;
            }

            &.active {
                background: ${n("secondary",.12)};
                &,
                .icon {
                    color: ${n("primary")};
                }
            }
            `)(t)}
    `},L=(e,t,n,o)=>{var r;const i=null!==(r=null==o?void 0:o.textClassName)&&void 0!==r?r:"text",a=document.createElement("div");a.setAttribute("role","option"),a.classList.add("slash-dropdown-item");const l=e.slots.icon(n),s=document.createElement("span");return s.textContent=t,s.className=i,a.appendChild(l),a.appendChild(s),a},k=e=>t=>Boolean(t.nodes[e]),E=e=>[{id:"h1",dom:L(e.get(t),"Large Heading","h1"),command:()=>e.get(n).call(o,1),keyword:["h1","large heading"],enable:k("heading")},{id:"h2",dom:L(e.get(t),"Medium Heading","h2"),command:()=>e.get(n).call(o,2),keyword:["h2","medium heading"],enable:k("heading")},{id:"h3",dom:L(e.get(t),"Small Heading","h3"),command:()=>e.get(n).call(o,3),keyword:["h3","small heading"],enable:k("heading")},{id:"bulletList",dom:L(e.get(t),"Bullet List","bulletList"),command:()=>e.get(n).call(r),keyword:["bullet list","ul"],enable:k("bullet_list")},{id:"orderedList",dom:L(e.get(t),"Ordered List","orderedList"),command:()=>e.get(n).call(i),keyword:["ordered list","ol"],enable:k("ordered_list")},{id:"taskList",dom:L(e.get(t),"Task List","taskList"),command:()=>e.get(n).call(a),keyword:["task list","task"],enable:k("task_list_item")},{id:"image",dom:L(e.get(t),"Image","image"),command:()=>e.get(n).call(l),keyword:["image"],enable:k("image")},{id:"blockquote",dom:L(e.get(t),"Quote","quote"),command:()=>e.get(n).call(s),keyword:["quote","blockquote"],enable:k("blockquote")},{id:"table",dom:L(e.get(t),"Table","table"),command:()=>e.get(n).call(d),keyword:["table"],enable:k("table")},{id:"code",dom:L(e.get(t),"Code Fence","code"),command:()=>e.get(n).call(c),keyword:["code"],enable:k("fence")},{id:"divider",dom:L(e.get(t),"Divide Line","divider"),command:()=>e.get(n).call(u),keyword:["divider","hr"],enable:k("hr")}],x=e=>{const t=E(e);return({content:e,isTopLevel:n})=>n?e?e.startsWith("/")?"/"===e?{placeholder:"Type to filter...",actions:t}:{actions:t.filter((({keyword:t})=>t.some((t=>t.includes(e.slice(1).toLocaleLowerCase())))))}:null:{placeholder:"Type / to use the slash commands..."}:null},$=({font:t,palette:n})=>e`
    position: relative;
    &::before {
        position: absolute;
        cursor: text;
        font-family: ${t.typography};
        font-size: 0.875rem;
        color: ${n("neutral",.6)};
        content: attr(data-text);
        height: 100%;
        display: flex;
        align-items: center;
    }
`,H=()=>e`
    &::before {
        left: 0.5rem;
    }
`,M=(e,t)=>{const n=t.getStyle($),o=t.getStyle(H);return{handleKeyDown:(t,n)=>!e.isEmpty()&&(n instanceof KeyboardEvent&&!!["ArrowUp","ArrowDown","Enter"].includes(n.key)),decorations:t=>{const r=m((({type:e})=>"paragraph"===e.name))(t.selection);if(!r||r.node.childCount>1||t.selection.$from.parentOffset<r.node.textContent.length)return void e.clear();const{placeholder:i,actions:a}=e.update({parentNode:t.selection.$from.node(t.selection.$from.depth-1),isTopLevel:1===t.selection.$from.depth,content:r.node.textContent,state:t});if(!i)return null;const l=(e,n)=>{const o=r.pos;return h.create(t.doc,[f.node(o,o+r.node.nodeSize,{class:n.filter((e=>e)).join(" "),"data-text":e})])};return a.length?l(i,[n,o,"empty-node","is-slash"]):l(i,[n,"empty-node"])}}},T=e=>{return{id:e.id,keyword:e.keyword,$:e.dom,command:(t=e.command,(e,n,o)=>(o&&(((e,t)=>{const{selection:n}=e,{$from:o}=n,r=e.tr.deleteRange(o.start(),o.pos);null==t||t(r)})(e,n),t()),!0)),enable:e.enable};var t};function C(e){return"object"==typeof e&&null!=e&&1===e.nodeType}function W(e,t){return(!t||"hidden"!==e)&&"visible"!==e&&"clip"!==e}function A(e,t){if(e.clientHeight<e.scrollHeight||e.clientWidth<e.scrollWidth){var n=getComputedStyle(e,null);return W(n.overflowY,t)||W(n.overflowX,t)||!!(r=function(e){if(!e.ownerDocument||!e.ownerDocument.defaultView)return null;try{return e.ownerDocument.defaultView.frameElement}catch(t){return null}}(o=e))&&(r.clientHeight<o.scrollHeight||r.clientWidth<o.scrollWidth)}var o,r;return!1}function D(e,t,n,o,r,i,a,l){return i<e&&a>t||i>e&&a<t?0:i<=e&&l<=n||a>=t&&l>=n?i-e-o:a>t&&l<n||i<e&&l>n?a-t+r:0}function I(e,t){var n=window,o=t.scrollMode,r=t.block,i=t.inline,a=t.boundary,l=t.skipOverflowHiddenElements,s="function"==typeof a?a:function(e){return e!==a};if(!C(e))throw new TypeError("Invalid target");for(var d=document.scrollingElement||document.documentElement,c=[],u=e;C(u)&&s(u);){if((u=u.parentElement)===d){c.push(u);break}null!=u&&u===document.body&&A(u)&&!A(document.documentElement)||null!=u&&A(u,l)&&c.push(u)}for(var m=n.visualViewport?n.visualViewport.width:innerWidth,h=n.visualViewport?n.visualViewport.height:innerHeight,f=window.scrollX||pageXOffset,p=window.scrollY||pageYOffset,v=e.getBoundingClientRect(),g=v.height,b=v.width,w=v.top,y=v.right,L=v.bottom,k=v.left,E="start"===r||"nearest"===r?w:"end"===r?L:w+g/2,x="center"===i?k+b/2:"end"===i?y:k,$=[],H=0;H<c.length;H++){var M=c[H],T=M.getBoundingClientRect(),W=T.height,I=T.width,j=T.top,O=T.right,S=T.bottom,q=T.left;if("if-needed"===o&&w>=0&&k>=0&&L<=h&&y<=m&&w>=j&&L<=S&&k>=q&&y<=O)return $;var B=getComputedStyle(M),N=parseInt(B.borderLeftWidth,10),P=parseInt(B.borderTopWidth,10),V=parseInt(B.borderRightWidth,10),X=parseInt(B.borderBottomWidth,10),Y=0,_=0,z="offsetWidth"in M?M.offsetWidth-M.clientWidth-N-V:0,K="offsetHeight"in M?M.offsetHeight-M.clientHeight-P-X:0;if(d===M)Y="start"===r?E:"end"===r?E-h:"nearest"===r?D(p,p+h,h,P,X,p+E,p+E+g,g):E-h/2,_="start"===i?x:"center"===i?x-m/2:"end"===i?x-m:D(f,f+m,m,N,V,f+x,f+x+b,b),Y=Math.max(0,Y+p),_=Math.max(0,_+f);else{Y="start"===r?E-j-P:"end"===r?E-S+X+K:"nearest"===r?D(j,S,W,P,X+K,E,E+g,g):E-(j+W/2)+K/2,_="start"===i?x-q-N:"center"===i?x-(q+I/2)+z/2:"end"===i?x-O+V+z:D(q,O,I,N,V+z,x,x+b,b);var F=M.scrollLeft,R=M.scrollTop;E+=R-(Y=Math.max(0,Math.min(R+Y,M.scrollHeight-W+K))),x+=F-(_=Math.max(0,Math.min(F+_,M.scrollWidth-I+z)))}$.push({el:M,top:Y,left:_})}return $}function j(e){return e===Object(e)&&0!==Object.keys(e).length}function O(e,t){var n=!e.ownerDocument.documentElement.contains(e);if(j(t)&&"function"==typeof t.behavior)return t.behavior(n?[]:I(e,t));if(!n){var o=function(e){return!1===e?{block:"end",inline:"nearest"}:j(e)?e:{block:"start",inline:"nearest"}}(t);return function(e,t){void 0===t&&(t="auto");var n="scrollBehavior"in document.body.style;e.forEach((function(e){var o=e.el,r=e.top,i=e.left;o.scroll&&n?o.scroll({top:r,left:i,behavior:t}):(o.scrollTop=r,o.scrollLeft=i)}))}(I(e,o),o.behavior)}}var S,q=function(){return S||(S="performance"in window?performance.now.bind(performance):Date.now),S()};function B(e){var t=q(),n=Math.min((t-e.startTime)/e.duration,1),o=e.ease(n),r=e.startX+(e.x-e.startX)*o,i=e.startY+(e.y-e.startY)*o;e.method(r,i),r!==e.x||i!==e.y?requestAnimationFrame((function(){return B(e)})):e.cb()}function N(e,t,n,o,r,i){var a,l,s;void 0===o&&(o=600),void 0===r&&(r=function(e){return 1+--e*e*e*e*e}),a=e,l=e.scrollLeft,s=e.scrollTop,B({scrollable:a,method:function(t,n){e.scrollLeft=Math.ceil(t),e.scrollTop=Math.ceil(n)},startTime:q(),startX:l,startY:s,x:t,y:n,duration:o,ease:r,cb:i})}var P=function(e,t){var n=t||{};return function(e){return e&&!e.behavior||"smooth"===e.behavior}(n)?O(e,{block:n.block,inline:n.inline,scrollMode:n.scrollMode,boundary:n.boundary,behavior:function(e){return Promise.all(e.reduce((function(e,t){var o=t.el,r=t.left,i=t.top,a=o.scrollLeft,l=o.scrollTop;return a===r&&l===i?e:[].concat(e,[new Promise((function(e){return N(o,r,i,n.duration,n.ease,(function(){return e({el:o,left:[a,r],top:[l,i]})}))}))])}),[]))}}):Promise.resolve(O(e,t))};const V=(e,t,n)=>{const o=t.dom.parentNode;if(!o)return{};const r=(e=>{const t=document.createElement("div");t.setAttribute("role","listbox"),t.setAttribute("tabindex","-1");const n=e.getStyle(y);return n&&t.classList.add(n),t.classList.add("slash-dropdown","hide"),t})(n),i=(()=>{let e=!1;return{isLock:()=>e,lock:()=>{e=!0},unlock:()=>{e=!1}}})();o.appendChild(r);const a=(e=>()=>{e.unlock()})(i),l=((e,t,n)=>o=>{const{target:r}=o;if(!(r instanceof HTMLElement))return;if(!t)return;const i=()=>{o.stopPropagation(),o.preventDefault()},{actions:a}=e.get(),l=Object.values(a).find((({$:e})=>e.contains(r)));if(!l){if(e.isEmpty())return;return e.clear(),n.classList.add("hide"),void i()}i(),l.command(t.state,t.dispatch,t)})(e,t,r),s=((e,t,n,o)=>r=>{if(!(r instanceof KeyboardEvent))return;o.isLock()||o.lock();const{key:i}=r;if(e.isEmpty())return;if(!["ArrowDown","ArrowUp","Enter","Escape"].includes(i))return;const{actions:a}=e.get();let l=a.findIndex((({$:e})=>e.classList.contains("active")));l<0&&(l=0);const s=e=>{a[l].$.classList.remove("active"),a[e].$.classList.add("active"),P(a[e].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})};if("ArrowDown"!==i)if("ArrowUp"!==i){if("Escape"===i){if(e.isEmpty())return;return e.clear(),void n.classList.add("hide")}a[l].command(t.state,t.dispatch,t),a[l].$.classList.remove("active")}else s(0===l?a.length-1:l-1);else s(l===a.length-1?0:l+1)})(e,t,r,i),d=((e,t)=>n=>{if(t.isLock())return;const{actions:o}=e.get(),r=o.findIndex((e=>e.$.classList.contains("active")));r>=0&&o[r].$.classList.remove("active");const{target:i}=n;i instanceof HTMLElement&&i.classList.add("active")})(e,i),c=e=>{const{target:t}=e;t instanceof HTMLElement&&t.classList.remove("active")};return o.addEventListener("mousemove",a),o.addEventListener("mousedown",l),o.addEventListener("keydown",s),{update:t=>{((e,t,n)=>{const{actions:o}=e.get();return o.length?(t.childNodes.forEach((e=>{e.removeEventListener("mouseenter",n.mouseEnter),e.removeEventListener("mouseleave",n.mouseLeave)})),t.textContent="",o.forEach((({$:e})=>{e.classList.remove("active"),e.addEventListener("mouseenter",n.mouseEnter),e.addEventListener("mouseleave",n.mouseLeave),t.appendChild(e)})),t.classList.remove("hide"),o[0].$.classList.add("active"),requestAnimationFrame((()=>{P(o[0].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})})),!0):(t.classList.add("hide"),!1)})(e,r,{mouseEnter:d,mouseLeave:c})&&((e,t)=>{p(e,t,((e,t,n)=>{let o=e.left-n.left,r=e.bottom-n.top+14;return o<0&&(o=0),window.innerHeight-e.bottom<t.height&&(r=e.top-n.top-t.height-14),[r,o]}))})(t,r)},destroy:()=>{o.removeEventListener("mousemove",a),o.removeEventListener("mousedown",l),o.removeEventListener("keydown",s),r.remove()}}},X=(e,t)=>{const n=(e=>{const t={placeholder:null,actions:[]};return{get:()=>t,clear:()=>{t.placeholder=null,t.actions=[]},update:n=>{var o,r;const i=e(n);return t.placeholder=null!==(o=null==i?void 0:i.placeholder)&&void 0!==o?o:null,t.actions=(null!==(r=null==i?void 0:i.actions)&&void 0!==r?r:[]).map(T),t},isEmpty:()=>0===t.actions.length}})(t);return new v({key:new g("MILKDOWN_PLUGIN_SLASH"),props:M(n,e),view:t=>V(n,t,e)})},Y=b(((e,t)=>{var n;const o=null!==(n=null==t?void 0:t.config)&&void 0!==n?n:x;return{prosePlugins:(t,n)=>{const r=o(n);return[X(e,r)]}}})),_=w.create([Y()]);export{L as createDropdownItem,E as defaultActions,x as defaultConfig,k as nodeExists,_ as slash,Y as slashPlugin};
