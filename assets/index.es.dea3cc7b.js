import{j as pe,z as g,x as y,D as G,W as ve,F as ge,G as ye,H as we,J as be,K as Le,L as ke,O as Ee,h as Se,A as _e,o as Ie,P as Me,C as Ne,d as K,Q as Te,R as $e,U as Oe}from"./index.337aae41.js";import"./index.824ed447.js";import"./color.556e4bcb.js";function re(e){return typeof e=="object"&&e!=null&&e.nodeType===1}function ae(e,t){return(!t||e!=="hidden")&&e!=="visible"&&e!=="clip"}function J(e,t){if(e.clientHeight<e.scrollHeight||e.clientWidth<e.scrollWidth){var r=getComputedStyle(e,null);return ae(r.overflowY,t)||ae(r.overflowX,t)||function(o){var n=function(a){if(!a.ownerDocument||!a.ownerDocument.defaultView)return null;try{return a.ownerDocument.defaultView.frameElement}catch{return null}}(o);return!!n&&(n.clientHeight<o.scrollHeight||n.clientWidth<o.scrollWidth)}(e)}return!1}function Y(e,t,r,o,n,a,i,s){return a<e&&i>t||a>e&&i<t?0:a<=e&&s<=r||i>=t&&s>=r?a-e-o:i>t&&s<r||a<e&&s>r?i-t+n:0}var ie=function(e,t){var r=window,o=t.scrollMode,n=t.block,a=t.inline,i=t.boundary,s=t.skipOverflowHiddenElements,c=typeof i=="function"?i:function(he){return he!==i};if(!re(e))throw new TypeError("Invalid target");for(var l,m,u=document.scrollingElement||document.documentElement,f=[],h=e;re(h)&&c(h);){if((h=(m=(l=h).parentElement)==null?l.getRootNode().host||null:m)===u){f.push(h);break}h!=null&&h===document.body&&J(h)&&!J(document.documentElement)||h!=null&&J(h,s)&&f.push(h)}for(var S=r.visualViewport?r.visualViewport.width:innerWidth,_=r.visualViewport?r.visualViewport.height:innerHeight,I=window.scrollX||pageXOffset,M=window.scrollY||pageYOffset,k=e.getBoundingClientRect(),N=k.height,T=k.width,$=k.top,z=k.right,F=k.bottom,O=k.left,p=n==="start"||n==="nearest"?$:n==="end"?F:$+N/2,v=a==="center"?O+T/2:a==="end"?z:O,Q=[],Z=0;Z<f.length;Z++){var d=f[Z],E=d.getBoundingClientRect(),H=E.height,C=E.width,W=E.top,x=E.right,R=E.bottom,P=E.left;if(o==="if-needed"&&$>=0&&O>=0&&F<=_&&z<=S&&$>=W&&F<=R&&O>=P&&z<=x)return Q;var A=getComputedStyle(d),D=parseInt(A.borderLeftWidth,10),j=parseInt(A.borderTopWidth,10),V=parseInt(A.borderRightWidth,10),U=parseInt(A.borderBottomWidth,10),b=0,L=0,q="offsetWidth"in d?d.offsetWidth-d.clientWidth-D-V:0,X="offsetHeight"in d?d.offsetHeight-d.clientHeight-j-U:0,ee="offsetWidth"in d?d.offsetWidth===0?0:C/d.offsetWidth:0,te="offsetHeight"in d?d.offsetHeight===0?0:H/d.offsetHeight:0;if(u===d)b=n==="start"?p:n==="end"?p-_:n==="nearest"?Y(M,M+_,_,j,U,M+p,M+p+N,N):p-_/2,L=a==="start"?v:a==="center"?v-S/2:a==="end"?v-S:Y(I,I+S,S,D,V,I+v,I+v+T,T),b=Math.max(0,b+M),L=Math.max(0,L+I);else{b=n==="start"?p-W-j:n==="end"?p-R+U+X:n==="nearest"?Y(W,R,H,j,U+X,p,p+N,N):p-(W+H/2)+X/2,L=a==="start"?v-P-D:a==="center"?v-(P+C/2)+q/2:a==="end"?v-x+V+q:Y(P,x,C,D,V+q,v,v+T,T);var ne=d.scrollLeft,oe=d.scrollTop;p+=oe-(b=Math.max(0,Math.min(oe+b/te,d.scrollHeight-H/te+X))),v+=ne-(L=Math.max(0,Math.min(ne+L/ee,d.scrollWidth-C/ee+q)))}Q.push({el:d,top:b,left:L})}return Q};function de(e){return e===Object(e)&&Object.keys(e).length!==0}function He(e,t){t===void 0&&(t="auto");var r="scrollBehavior"in document.body.style;e.forEach(function(o){var n=o.el,a=o.top,i=o.left;n.scroll&&r?n.scroll({top:a,left:i,behavior:t}):(n.scrollTop=a,n.scrollLeft=i)})}function Ce(e){return e===!1?{block:"end",inline:"nearest"}:de(e)?e:{block:"start",inline:"nearest"}}function se(e,t){var r=e.isConnected||e.ownerDocument.documentElement.contains(e);if(de(t)&&typeof t.behavior=="function")return t.behavior(r?ie(e,t):[]);if(!!r){var o=Ce(t);return He(ie(e,o),o.behavior)}}var B,ue=function(){return B||(B="performance"in window?performance.now.bind(performance):Date.now),B()};function me(e){var t=ue(),r=Math.min((t-e.startTime)/e.duration,1),o=e.ease(r),n=e.startX+(e.x-e.startX)*o,a=e.startY+(e.y-e.startY)*o;e.method(n,a),n!==e.x||a!==e.y?requestAnimationFrame(function(){return me(e)}):e.cb()}function We(e,t,r,o,n,a){o===void 0&&(o=600),n===void 0&&(n=function(u){return 1+--u*u*u*u*u});var i,s,c,l;i=e,s=e.scrollLeft,c=e.scrollTop,l=function(u,f){e.scrollLeft=Math.ceil(u),e.scrollTop=Math.ceil(f)},me({scrollable:i,method:l,startTime:ue(),startX:s,startY:c,x:t,y:r,duration:o,ease:n,cb:a})}var Pe=function(t){return t&&!t.behavior||t.behavior==="smooth"};function Ae(e,t){var r=t||{};return Pe(r)?se(e,{block:r.block,inline:r.inline,scrollMode:r.scrollMode,boundary:r.boundary,behavior:function(n){return Promise.all(n.reduce(function(a,i){var s=i.el,c=i.left,l=i.top,m=s.scrollLeft,u=s.scrollTop;return m===c&&u===l?a:[].concat(a,[new Promise(function(f){return We(s,c,l,r.duration,r.ease,function(){return f({el:s,left:[m,c],top:[u,l]})})})])},[]))}}):Promise.resolve(se(e,t))}var De=Ae,fe=De,le=Object.getOwnPropertySymbols,je=Object.prototype.hasOwnProperty,Ve=Object.prototype.propertyIsEnumerable,Ue=(e,t)=>{var r={};for(var o in e)je.call(e,o)&&t.indexOf(o)<0&&(r[o]=e[o]);if(e!=null&&le)for(var o of le(e))t.indexOf(o)<0&&Ve.call(e,o)&&(r[o]=e[o]);return r};const qe=({font:e,palette:t})=>K`
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
            `,Xe=e=>{var t,r,o;const{mixin:n,size:a,palette:i}=e;return K`
        width: 20.5rem;
        max-height: 20.5rem;
        overflow-y: auto;
        ${(t=n.border)==null?void 0:t.call(n)};
        border-radius: ${a.radius};
        position: absolute;
        background: ${i("surface")};

        ${(r=n.shadow)==null?void 0:r.call(n)};

        &.hide {
            display: none;
        }

        ${(o=n.scrollbar)==null?void 0:o.call(n)};

        ${qe(e)}
    `},Ye=e=>{const t=document.createElement("div");t.setAttribute("role","listbox"),t.setAttribute("tabindex","-1");const r=e.getStyle(Xe);return r&&t.classList.add(r),t.classList.add("slash-dropdown","hide"),t},w=(e,t,r,o)=>{var n;const a=(n=o==null?void 0:o.textClassName)!=null?n:"text",i=document.createElement("div");i.setAttribute("role","option"),i.classList.add("slash-dropdown-item");const s=e.slots.icon(r),c=document.createElement("span");return c.textContent=t,c.className=a,i.appendChild(s),i.appendChild(c),i},Ke=(e,t)=>{const{selection:r}=e,{$from:o}=r,n=e.tr.deleteRange(o.start(),o.pos);return t==null||t(n),!1},ze=e=>(t,r,o)=>(o&&(Ke(t,r),e()),!0),ce=(e,t="/")=>{const{nodes:r}=e.get(pe),o=[{id:"h1",dom:w(e.get(g),"Large Heading","h1"),command:()=>e.get(y).call(G,1),keyword:["h1","large heading"],typeName:"heading"},{id:"h2",dom:w(e.get(g),"Medium Heading","h2"),command:()=>e.get(y).call(G,2),keyword:["h2","medium heading"],typeName:"heading"},{id:"h3",dom:w(e.get(g),"Small Heading","h3"),command:()=>e.get(y).call(G,3),keyword:["h3","small heading"],typeName:"heading"},{id:"bulletList",dom:w(e.get(g),"Bullet List","bulletList"),command:()=>e.get(y).call(ve),keyword:["bullet list","ul"],typeName:"bullet_list"},{id:"orderedList",dom:w(e.get(g),"Ordered List","orderedList"),command:()=>e.get(y).call(ge),keyword:["ordered list","ol"],typeName:"ordered_list"},{id:"taskList",dom:w(e.get(g),"Task List","taskList"),command:()=>e.get(y).call(ye),keyword:["task list","task"],typeName:"task_list_item"},{id:"image",dom:w(e.get(g),"Image","image"),command:()=>e.get(y).call(we),keyword:["image"],typeName:"image"},{id:"blockquote",dom:w(e.get(g),"Quote","quote"),command:()=>e.get(y).call(be),keyword:["quote","blockquote"],typeName:"blockquote"},{id:"table",dom:w(e.get(g),"Table","table"),command:()=>e.get(y).call(Le),keyword:["table"],typeName:"table"},{id:"code",dom:w(e.get(g),"Code Fence","code"),command:()=>e.get(y).call(ke),keyword:["code"],typeName:"fence"},{id:"divider",dom:w(e.get(g),"Divide Line","divider"),command:()=>e.get(y).call(Ee),keyword:["divider","hr"],typeName:"hr"}],n=t.slice(1).toLocaleLowerCase();return o.filter(a=>!!r[a.typeName]&&a.keyword.some(i=>i.includes(n))).map(a=>{var i=a,s=Ue(i,["keyword","typeName"]);return s})},Fe=e=>({content:t,isTopLevel:r})=>r?t?t.startsWith("/")?t==="/"?{placeholder:"Type to filter...",actions:ce(e)}:{actions:ce(e,t)}:null:{placeholder:"Type / to use the slash commands..."}:null,Qe=({font:e,palette:t})=>K`
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
`,Ze=()=>K`
    &::before {
        left: 0.5rem;
    }
`,xe=(e,t)=>{const r=t.getStyle(Qe),o=t.getStyle(Ze);return{handleKeyDown:(n,a)=>!(e.isEmpty()||!(a instanceof KeyboardEvent)||!["ArrowUp","ArrowDown","Enter"].includes(a.key)),decorations:n=>{const a=Ne(({type:l})=>l.name==="paragraph")(n.selection);if(!a||a.node.childCount>1||n.selection.$from.parentOffset!==a.node.textContent.length){e.clear();return}const{placeholder:i,actions:s}=e.update({parentNode:n.selection.$from.node(n.selection.$from.depth-1),isTopLevel:n.selection.$from.depth===1,content:a.node.textContent,state:n});if(!i)return null;const c=(l,m)=>{const u=a.pos;return Te.create(n.doc,[$e.node(u,u+a.node.nodeSize,{class:m.filter(f=>f).join(" "),"data-text":l})])};return s.length?c(i,[r,o,"empty-node","is-slash"]):c(i,[r,"empty-node"])}}},Re=e=>({id:e.id,$:e.dom,command:ze(e.command)}),Ge=()=>({placeholder:null,actions:[]}),Je=e=>{const t=Ge();return{get:()=>t,clear:()=>{t.placeholder=null,t.actions=[]},update:r=>{var o,n;const a=e(r);return t.placeholder=(o=a==null?void 0:a.placeholder)!=null?o:null,t.actions=((n=a==null?void 0:a.actions)!=null?n:[]).map(Re),t},isEmpty:()=>t.actions.length===0}},Be=(e,t,r)=>{const{actions:o}=e.get();return o.length?(t.childNodes.forEach(n=>{n.removeEventListener("mouseenter",r.mouseEnter),n.removeEventListener("mouseleave",r.mouseLeave)}),t.textContent="",o.forEach(({$:n})=>{n.classList.remove("active"),n.addEventListener("mouseenter",r.mouseEnter),n.addEventListener("mouseleave",r.mouseLeave),t.appendChild(n)}),t.classList.remove("hide"),o[0].$.classList.add("active"),requestAnimationFrame(()=>{fe(o[0].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})}),!0):(t.classList.add("hide"),!1)},et=()=>{let e=!1;return{isLock:()=>e,lock:()=>{e=!0},unlock:()=>{e=!1}}},tt=e=>()=>{e.unlock()},nt=(e,t)=>r=>{if(t.isLock())return;const{actions:o}=e.get(),n=o.findIndex(i=>i.$.classList.contains("active"));n>=0&&o[n].$.classList.remove("active");const{target:a}=r;a instanceof HTMLElement&&a.classList.add("active")},ot=()=>e=>{const{target:t}=e;t instanceof HTMLElement&&t.classList.remove("active")},rt=(e,t,r)=>o=>{const{target:n}=o;if(!(n instanceof HTMLElement)||!t)return;const a=()=>{o.stopPropagation(),o.preventDefault()},{actions:i}=e.get(),s=Object.values(i).find(({$:c})=>c.contains(n));if(!s){if(e.isEmpty())return;e.clear(),r.classList.add("hide"),a();return}a(),s.command(t.state,t.dispatch,t)},at=(e,t,r,o)=>n=>{if(!(n instanceof KeyboardEvent))return;o.isLock()||o.lock();const{key:a}=n;if(e.isEmpty()||!["ArrowDown","ArrowUp","Enter","Escape"].includes(a))return;const{actions:i}=e.get();let s=i.findIndex(({$:l})=>l.classList.contains("active"));s<0&&(s=0);const c=l=>{i[s].$.classList.remove("active"),i[l].$.classList.add("active"),fe(i[l].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})};if(a==="ArrowDown"){const l=s===i.length-1?0:s+1;c(l);return}if(a==="ArrowUp"){const l=s===0?i.length-1:s-1;c(l);return}if(a==="Escape"){if(e.isEmpty())return;e.clear(),r.classList.add("hide");return}i[s].command(t.state,t.dispatch,t),i[s].$.classList.remove("active")},it=(e,t)=>{Oe(e,t,(r,o,n)=>{let a=r.left-n.left,i=r.bottom-n.top+14;return a<0&&(a=0),window.innerHeight-r.bottom<o.height&&(i=r.top-n.top-o.height-14),[i,a]})},st=(e,t,r)=>{const o=t.dom.parentNode;if(!o)return{};const n=Ye(r),a=et();o.appendChild(n);const i=tt(a),s=rt(e,t,n),c=at(e,t,n,a),l=nt(e,a),m=ot();return o.addEventListener("mousemove",i),o.addEventListener("mousedown",s),o.addEventListener("keydown",c),{update:u=>{!Be(e,n,{mouseEnter:l,mouseLeave:m})||it(u,n)},destroy:()=>{o.removeEventListener("mousemove",i),o.removeEventListener("mousedown",s),o.removeEventListener("keydown",c),n.remove()}}},lt="MILKDOWN_PLUGIN_SLASH",ct=(e,t)=>{const r=Je(t);return new Ie({key:new Me(lt),props:xe(r,e),view:o=>st(r,o,e)})},dt=Se((e,t)=>{var r;const o=(r=t==null?void 0:t.config)!=null?r:Fe;return{prosePlugins:(n,a)=>{const i=o(a);return[ct(e,i)]}}}),ht=_e.create([dt()]);export{w as createDropdownItem,ce as defaultActions,Fe as defaultConfig,ht as slash,dt as slashPlugin};
