import{m as e,t,b as n,o,W as r,q as i,r as a,I as s,u as l,v as d,w as c,x as u,e as m,D as h,y as f,z as p,n as v,P as g,A as b,B as y}from"./index.32467b08.js";import"./index.a6998fa3.js";import"./color.556e4bcb.js";const w=t=>{var n,o,r;const{mixin:i,size:a,palette:s}=t;return e`
        width: 20.5rem;
        max-height: 20.5rem;
        overflow-y: auto;
        ${null===(n=i.border)||void 0===n?void 0:n.call(i)};
        border-radius: ${a.radius};
        position: absolute;
        background: ${s("surface")};

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
    `},L=(e,t,n,o)=>{var r;const i=null!==(r=null==o?void 0:o.textClassName)&&void 0!==r?r:"text",a=document.createElement("div");a.setAttribute("role","option"),a.classList.add("slash-dropdown-item");const s=e.slots.icon(n),l=document.createElement("span");return l.textContent=t,l.className=i,a.appendChild(s),a.appendChild(l),a},k=e=>t=>Boolean(t.nodes[e]),E=({ctx:e})=>[{id:"h1",dom:L(e.get(t),"Large Heading","h1"),command:()=>e.get(n).call(o,1),keyword:["h1","large heading"],enable:k("heading")},{id:"h2",dom:L(e.get(t),"Medium Heading","h2"),command:()=>e.get(n).call(o,2),keyword:["h2","medium heading"],enable:k("heading")},{id:"h3",dom:L(e.get(t),"Small Heading","h3"),command:()=>e.get(n).call(o,3),keyword:["h3","small heading"],enable:k("heading")},{id:"bulletList",dom:L(e.get(t),"Bullet List","bulletList"),command:()=>e.get(n).call(r),keyword:["bullet list","ul"],enable:k("bullet_list")},{id:"orderedList",dom:L(e.get(t),"Ordered List","orderedList"),command:()=>e.get(n).call(i),keyword:["ordered list","ol"],enable:k("ordered_list")},{id:"taskList",dom:L(e.get(t),"Task List","taskList"),command:()=>e.get(n).call(a),keyword:["task list","task"],enable:k("task_list_item")},{id:"image",dom:L(e.get(t),"Image","image"),command:()=>e.get(n).call(s),keyword:["image"],enable:k("image")},{id:"blockquote",dom:L(e.get(t),"Quote","quote"),command:()=>e.get(n).call(l),keyword:["quote","blockquote"],enable:k("blockquote")},{id:"table",dom:L(e.get(t),"Table","table"),command:()=>e.get(n).call(d),keyword:["table"],enable:k("table")},{id:"code",dom:L(e.get(t),"Code Fence","code"),command:()=>e.get(n).call(c),keyword:["code"],enable:k("fence")},{id:"divider",dom:L(e.get(t),"Divide Line","divider"),command:()=>e.get(n).call(u),keyword:["divider","hr"],enable:k("hr")}],S=e=>{return{id:e.id,keyword:e.keyword,$:e.dom,command:(t=e.command,(e,n,o)=>(o&&(((e,t)=>{const{selection:n}=e,{$from:o}=n,r=e.tr.deleteRange(o.start(),o.pos);null==t||t(r)})(e,n),t()),!0)),enable:e.enable};var t};var $,x;(x=$||($={})).Empty="empty",x.Slash="slash";const A=()=>{const e={cursorStatus:$.Empty,filter:"",activeActions:[]};return{clearStatus:()=>{return(t=e).cursorStatus=$.Empty,void(t.filter="");var t},setSlash:(t="")=>((e,t="")=>{e.cursorStatus=$.Slash,e.filter=t})(e,t),setActions:t=>{e.activeActions=t},get:()=>e,isEmpty:()=>e.cursorStatus===$.Empty,isSlash:()=>e.cursorStatus===$.Slash}},M=({font:t,palette:n})=>e`
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
`,T=(e,t,n,o)=>{const r=t.getStyle(M),i=t.getStyle(H);return{handleKeyDown:(t,n)=>{const{cursorStatus:o,activeActions:r}=e.get();return o===$.Slash&&0!==r.length&&(n instanceof KeyboardEvent&&!!["ArrowUp","ArrowDown","Enter"].includes(n.key))},decorations:t=>{const a=m((({type:e})=>"paragraph"===e.name))(t.selection);if(!a||!o(a,t))return void e.clearStatus();const s=0===a.node.content.size,l="/"===a.node.textContent&&t.selection.$from.parentOffset>0,d=a.node.textContent.startsWith("/")&&t.selection.$from.parentOffset>1,c=(e,n)=>{const o=a.pos;return h.create(t.doc,[f.node(o,o+a.node.nodeSize,{class:n.filter((e=>e)).join(" "),"data-text":e})])};if(s){e.clearStatus();return c(n[$.Empty],[r,"empty-node"])}if(l){e.setSlash();return c(n[$.Slash],[r,i,"empty-node","is-slash"])}return d?(e.setSlash(a.node.textContent.slice(1)),null):(e.clearStatus(),null)}}};function C(e){return"object"==typeof e&&null!=e&&1===e.nodeType}function W(e,t){return(!t||"hidden"!==e)&&"visible"!==e&&"clip"!==e}function D(e,t){if(e.clientHeight<e.scrollHeight||e.clientWidth<e.scrollWidth){var n=getComputedStyle(e,null);return W(n.overflowY,t)||W(n.overflowX,t)||!!(r=function(e){if(!e.ownerDocument||!e.ownerDocument.defaultView)return null;try{return e.ownerDocument.defaultView.frameElement}catch(t){return null}}(o=e))&&(r.clientHeight<o.scrollHeight||r.clientWidth<o.scrollWidth)}var o,r;return!1}function I(e,t,n,o,r,i,a,s){return i<e&&a>t||i>e&&a<t?0:i<=e&&s<=n||a>=t&&s>=n?i-e-o:a>t&&s<n||i<e&&s>n?a-t+r:0}function O(e,t){var n=window,o=t.scrollMode,r=t.block,i=t.inline,a=t.boundary,s=t.skipOverflowHiddenElements,l="function"==typeof a?a:function(e){return e!==a};if(!C(e))throw new TypeError("Invalid target");for(var d=document.scrollingElement||document.documentElement,c=[],u=e;C(u)&&l(u);){if((u=u.parentElement)===d){c.push(u);break}null!=u&&u===document.body&&D(u)&&!D(document.documentElement)||null!=u&&D(u,s)&&c.push(u)}for(var m=n.visualViewport?n.visualViewport.width:innerWidth,h=n.visualViewport?n.visualViewport.height:innerHeight,f=window.scrollX||pageXOffset,p=window.scrollY||pageYOffset,v=e.getBoundingClientRect(),g=v.height,b=v.width,y=v.top,w=v.right,L=v.bottom,k=v.left,E="start"===r||"nearest"===r?y:"end"===r?L:y+g/2,S="center"===i?k+b/2:"end"===i?w:k,$=[],x=0;x<c.length;x++){var A=c[x],M=A.getBoundingClientRect(),H=M.height,T=M.width,W=M.top,O=M.right,j=M.bottom,q=M.left;if("if-needed"===o&&y>=0&&k>=0&&L<=h&&w<=m&&y>=W&&L<=j&&k>=q&&w<=O)return $;var B=getComputedStyle(A),z=parseInt(B.borderLeftWidth,10),P=parseInt(B.borderTopWidth,10),V=parseInt(B.borderRightWidth,10),X=parseInt(B.borderBottomWidth,10),Y=0,_=0,N="offsetWidth"in A?A.offsetWidth-A.clientWidth-z-V:0,K="offsetHeight"in A?A.offsetHeight-A.clientHeight-P-X:0;if(d===A)Y="start"===r?E:"end"===r?E-h:"nearest"===r?I(p,p+h,h,P,X,p+E,p+E+g,g):E-h/2,_="start"===i?S:"center"===i?S-m/2:"end"===i?S-m:I(f,f+m,m,z,V,f+S,f+S+b,b),Y=Math.max(0,Y+p),_=Math.max(0,_+f);else{Y="start"===r?E-W-P:"end"===r?E-j+X+K:"nearest"===r?I(W,j,H,P,X+K,E,E+g,g):E-(W+H/2)+K/2,_="start"===i?S-q-z:"center"===i?S-(q+T/2)+N/2:"end"===i?S-O+V+N:I(q,O,T,z,V+N,S,S+b,b);var R=A.scrollLeft,U=A.scrollTop;E+=U-(Y=Math.max(0,Math.min(U+Y,A.scrollHeight-H+K))),S+=R-(_=Math.max(0,Math.min(R+_,A.scrollWidth-T+N)))}$.push({el:A,top:Y,left:_})}return $}function j(e){return e===Object(e)&&0!==Object.keys(e).length}function q(e,t){var n=!e.ownerDocument.documentElement.contains(e);if(j(t)&&"function"==typeof t.behavior)return t.behavior(n?[]:O(e,t));if(!n){var o=function(e){return!1===e?{block:"end",inline:"nearest"}:j(e)?e:{block:"start",inline:"nearest"}}(t);return function(e,t){void 0===t&&(t="auto");var n="scrollBehavior"in document.body.style;e.forEach((function(e){var o=e.el,r=e.top,i=e.left;o.scroll&&n?o.scroll({top:r,left:i,behavior:t}):(o.scrollTop=r,o.scrollLeft=i)}))}(O(e,o),o.behavior)}}var B,z=function(){return B||(B="performance"in window?performance.now.bind(performance):Date.now),B()};function P(e){var t=z(),n=Math.min((t-e.startTime)/e.duration,1),o=e.ease(n),r=e.startX+(e.x-e.startX)*o,i=e.startY+(e.y-e.startY)*o;e.method(r,i),r!==e.x||i!==e.y?requestAnimationFrame((function(){return P(e)})):e.cb()}function V(e,t,n,o,r,i){var a,s,l;void 0===o&&(o=600),void 0===r&&(r=function(e){return 1+--e*e*e*e*e}),a=e,s=e.scrollLeft,l=e.scrollTop,P({scrollable:a,method:function(t,n){e.scrollLeft=Math.ceil(t),e.scrollTop=Math.ceil(n)},startTime:z(),startX:s,startY:l,x:t,y:n,duration:o,ease:r,cb:i})}var X=function(e,t){var n=t||{};return function(e){return e&&!e.behavior||"smooth"===e.behavior}(n)?q(e,{block:n.block,inline:n.inline,scrollMode:n.scrollMode,boundary:n.boundary,behavior:function(e){return Promise.all(e.reduce((function(e,t){var o=t.el,r=t.left,i=t.top,a=o.scrollLeft,s=o.scrollTop;return a===r&&s===i?e:[].concat(e,[new Promise((function(e){return V(o,r,i,n.duration,n.ease,(function(){return e({el:o,left:[a,r],top:[s,i]})}))}))])}),[]))}}):Promise.resolve(q(e,t))};const Y=(e,t,n,o)=>{const r=n.dom.parentNode;if(!r)return{};const i=(e=>{const t=document.createElement("div");t.setAttribute("role","listbox"),t.setAttribute("tabindex","-1");const n=e.getStyle(w);return n&&t.classList.add(n),t.classList.add("slash-dropdown","hide"),t})(o),a=(()=>{let e=!1;return{isLock:()=>e,lock:()=>{e=!0},unlock:()=>{e=!1}}})();r.appendChild(i);const s=(e=>()=>{e.unlock()})(a),l=((e,t,n,o)=>r=>{const{target:i}=r;if(!(i instanceof HTMLElement))return;if(!n)return;const a=()=>{r.stopPropagation(),r.preventDefault()},s=Object.values(t).find((({$:e})=>e.contains(i)));if(!s){if(e.isEmpty())return;return e.clearStatus(),o.classList.add("hide"),void a()}a(),s.command(n.state,n.dispatch,n)})(e,t,n,i),d=((e,t,n,o)=>r=>{if(!(r instanceof KeyboardEvent))return;o.isLock()||o.lock();const{key:i}=r;if(!e.isSlash())return;if(!["ArrowDown","ArrowUp","Enter","Escape"].includes(i))return;const{activeActions:a}=e.get();let s=a.findIndex((({$:e})=>e.classList.contains("active")));s<0&&(s=0);const l=e=>{a[s].$.classList.remove("active"),a[e].$.classList.add("active"),X(a[e].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})};if("ArrowDown"!==i)if("ArrowUp"!==i){if("Escape"===i){if(e.isEmpty())return;return e.clearStatus(),void n.classList.add("hide")}a[s].command(t.state,t.dispatch,t),a[s].$.classList.remove("active")}else l(0===s?a.length-1:s-1);else l(s===a.length-1?0:s+1)})(e,n,i,a),c=((e,t)=>n=>{if(t.isLock())return;const o=e.get().activeActions.findIndex((e=>e.$.classList.contains("active")));o>=0&&e.get().activeActions[o].$.classList.remove("active");const{target:r}=n;r instanceof HTMLElement&&r.classList.add("active")})(e,a),u=e=>{const{target:t}=e;t instanceof HTMLElement&&t.classList.remove("active")};return t.filter((e=>e.enable(n.state.schema))).forEach((({$:e})=>{e.addEventListener("mouseenter",c),e.addEventListener("mouseleave",u),i.appendChild(e)})),r.addEventListener("mousemove",s),r.addEventListener("mousedown",l),r.addEventListener("keydown",d),{update:n=>{((e,t,n)=>{const{filter:o}=e.get();if(!e.isSlash())return t.classList.add("hide"),!1;const r=n.filter((e=>(e.$.classList.remove("active"),!!e.keyword.some((e=>e.includes(o.toLocaleLowerCase())))||(e.$.classList.add("hide"),!1)))).map((e=>(e.$.classList.remove("hide"),e)));return e.setActions(r),0===r.length?(t.classList.add("hide"),!1):(t.classList.remove("hide"),r[0].$.classList.add("active"),requestAnimationFrame((()=>{X(r[0].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})})),!0)})(e,i,t)&&((e,t)=>{p(e,t,((e,t,n)=>{let o=e.left-n.left,r=e.bottom-n.top+14;return o<0&&(o=0),window.innerHeight-e.bottom<t.height&&(r=e.top-n.top-t.height-14),[r,o]}))})(n,i)},destroy:()=>{r.removeEventListener("mousemove",s),r.removeEventListener("mousedown",l),r.removeEventListener("keydown",d),i.remove()}}},_=b(((e,t)=>{var n,o,r;const i=null!==(n=null==e?void 0:e.config)&&void 0!==n?n:E,a=Object.assign({[$.Empty]:"Type / to use the slash commands...",[$.Slash]:"Type to filter..."},null!==(o=null==e?void 0:e.placeholder)&&void 0!==o?o:{});return{id:"slash",plugin:((e,t,n,o)=>{const r=A(),i=t.map(S);return new v({key:new g("MILKDOWN_PLUGIN_SLASH"),props:T(r,e,n,o),view:t=>Y(r,i,t,e)})})(t,i(t),a,null!==(r=null==e?void 0:e.shouldDisplay)&&void 0!==r?r:(e,t)=>{const n=1===t.selection.$from.depth;return e.node.childCount<=1&&n})}})),N=y.create([_()]);export{$ as CursorStatus,E as config,L as createDropdownItem,k as nodeExists,N as slash,_ as slashPlugin};
