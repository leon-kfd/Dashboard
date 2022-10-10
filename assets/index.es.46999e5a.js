import{j as ue,y as v,w as g,C as Z,W as me,D as fe,F as he,G as pe,H as ve,J as ge,K as ye,L as we,h as be,A as Le,o as Ee,P as ke,B as Se,d as U,O as Ce,Q as _e,R as Me}from"./index.22d9ac92.js";import"./index.42fd9344.js";import"./color.556e4bcb.js";function ee(e){return typeof e=="object"&&e!=null&&e.nodeType===1}function te(e,t){return(!t||e!=="hidden")&&e!=="visible"&&e!=="clip"}function F(e,t){if(e.clientHeight<e.scrollHeight||e.clientWidth<e.scrollWidth){var r=getComputedStyle(e,null);return te(r.overflowY,t)||te(r.overflowX,t)||function(o){var n=function(a){if(!a.ownerDocument||!a.ownerDocument.defaultView)return null;try{return a.ownerDocument.defaultView.frameElement}catch{return null}}(o);return!!n&&(n.clientHeight<o.scrollHeight||n.clientWidth<o.scrollWidth)}(e)}return!1}function V(e,t,r,o,n,a,i,s){return a<e&&i>t||a>e&&i<t?0:a<=e&&s<=r||i>=t&&s>=r?a-e-o:i>t&&s<r||a<e&&s>r?i-t+n:0}function ne(e,t){var r=window,o=t.scrollMode,n=t.block,a=t.inline,i=t.boundary,s=t.skipOverflowHiddenElements,d=typeof i=="function"?i:function(de){return de!==i};if(!ee(e))throw new TypeError("Invalid target");for(var c=document.scrollingElement||document.documentElement,m=[],l=e;ee(l)&&d(l);){if((l=l.parentElement)===c){m.push(l);break}l!=null&&l===document.body&&F(l)&&!F(document.documentElement)||l!=null&&F(l,s)&&m.push(l)}for(var f=r.visualViewport?r.visualViewport.width:innerWidth,k=r.visualViewport?r.visualViewport.height:innerHeight,S=window.scrollX||pageXOffset,C=window.scrollY||pageYOffset,L=e.getBoundingClientRect(),_=L.height,M=L.width,N=L.top,X=L.right,Y=L.bottom,$=L.left,h=n==="start"||n==="nearest"?N:n==="end"?Y:N+_/2,p=a==="center"?$+M/2:a==="end"?X:$,q=[],B=0;B<m.length;B++){var u=m[B],E=u.getBoundingClientRect(),K=E.height,R=E.width,T=E.top,z=E.right,Q=E.bottom,O=E.left;if(o==="if-needed"&&N>=0&&$>=0&&Y<=k&&X<=f&&N>=T&&Y<=Q&&$>=O&&X<=z)return q;var P=getComputedStyle(u),D=parseInt(P.borderLeftWidth,10),H=parseInt(P.borderTopWidth,10),I=parseInt(P.borderRightWidth,10),A=parseInt(P.borderBottomWidth,10),w=0,b=0,W="offsetWidth"in u?u.offsetWidth-u.clientWidth-D-I:0,j="offsetHeight"in u?u.offsetHeight-u.clientHeight-H-A:0;if(c===u)w=n==="start"?h:n==="end"?h-k:n==="nearest"?V(C,C+k,k,H,A,C+h,C+h+_,_):h-k/2,b=a==="start"?p:a==="center"?p-f/2:a==="end"?p-f:V(S,S+f,f,D,I,S+p,S+p+M,M),w=Math.max(0,w+C),b=Math.max(0,b+S);else{w=n==="start"?h-T-H:n==="end"?h-Q+A+j:n==="nearest"?V(T,Q,K,H,A+j,h,h+_,_):h-(T+K/2)+j/2,b=a==="start"?p-O-D:a==="center"?p-(O+R/2)+W/2:a==="end"?p-z+I+W:V(O,z,R,D,I+W,p,p+M,M);var G=u.scrollLeft,x=u.scrollTop;h+=x-(w=Math.max(0,Math.min(x+w,u.scrollHeight-K+j))),p+=G-(b=Math.max(0,Math.min(G+b,u.scrollWidth-R+W)))}q.push({el:u,top:w,left:b})}return q}function ie(e){return e===Object(e)&&Object.keys(e).length!==0}function Ne(e,t){t===void 0&&(t="auto");var r="scrollBehavior"in document.body.style;e.forEach(function(o){var n=o.el,a=o.top,i=o.left;n.scroll&&r?n.scroll({top:a,left:i,behavior:t}):(n.scrollTop=a,n.scrollLeft=i)})}function $e(e){return e===!1?{block:"end",inline:"nearest"}:ie(e)?e:{block:"start",inline:"nearest"}}function oe(e,t){var r=e.isConnected||e.ownerDocument.documentElement.contains(e);if(ie(t)&&typeof t.behavior=="function")return t.behavior(r?ne(e,t):[]);if(!!r){var o=$e(t);return Ne(ne(e,o),o.behavior)}}var J,se=function(){return J||(J="performance"in window?performance.now.bind(performance):Date.now),J()};function le(e){var t=se(),r=Math.min((t-e.startTime)/e.duration,1),o=e.ease(r),n=e.startX+(e.x-e.startX)*o,a=e.startY+(e.y-e.startY)*o;e.method(n,a),n!==e.x||a!==e.y?requestAnimationFrame(function(){return le(e)}):e.cb()}function Te(e,t,r,o,n,a){o===void 0&&(o=600),n===void 0&&(n=function(l){return 1+--l*l*l*l*l});var i,s,d,c;i=e,s=e.scrollLeft,d=e.scrollTop,c=function(l,f){e.scrollLeft=Math.ceil(l),e.scrollTop=Math.ceil(f)},le({scrollable:i,method:c,startTime:se(),startX:s,startY:d,x:t,y:r,duration:o,ease:n,cb:a})}var Oe=function(t){return t&&!t.behavior||t.behavior==="smooth"};function Pe(e,t){var r=t||{};return Oe(r)?oe(e,{block:r.block,inline:r.inline,scrollMode:r.scrollMode,boundary:r.boundary,behavior:function(n){return Promise.all(n.reduce(function(a,i){var s=i.el,d=i.left,c=i.top,m=s.scrollLeft,l=s.scrollTop;return m===d&&l===c?a:[].concat(a,[new Promise(function(f){return Te(s,d,c,r.duration,r.ease,function(){return f({el:s,left:[m,d],top:[l,c]})})})])},[]))}}):Promise.resolve(oe(e,t))}var De=Pe,ce=De,re=Object.getOwnPropertySymbols,He=Object.prototype.hasOwnProperty,Ie=Object.prototype.propertyIsEnumerable,Ae=(e,t)=>{var r={};for(var o in e)He.call(e,o)&&t.indexOf(o)<0&&(r[o]=e[o]);if(e!=null&&re)for(var o of re(e))t.indexOf(o)<0&&Ie.call(e,o)&&(r[o]=e[o]);return r};const We=({font:e,palette:t})=>U`
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
            `,je=e=>{var t,r,o;const{mixin:n,size:a,palette:i}=e;return U`
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

        ${We(e)}
    `},Ve=e=>{const t=document.createElement("div");t.setAttribute("role","listbox"),t.setAttribute("tabindex","-1");const r=e.getStyle(je);return r&&t.classList.add(r),t.classList.add("slash-dropdown","hide"),t},y=(e,t,r,o)=>{var n;const a=(n=o==null?void 0:o.textClassName)!=null?n:"text",i=document.createElement("div");i.setAttribute("role","option"),i.classList.add("slash-dropdown-item");const s=e.slots.icon(r),d=document.createElement("span");return d.textContent=t,d.className=a,i.appendChild(s),i.appendChild(d),i},Ue=(e,t)=>{const{selection:r}=e,{$from:o}=r,n=e.tr.deleteRange(o.start(),o.pos);return t==null||t(n),!1},Xe=e=>(t,r,o)=>(o&&(Ue(t,r),e()),!0),ae=(e,t="/")=>{const{nodes:r}=e.get(ue),o=[{id:"h1",dom:y(e.get(v),"Large Heading","h1"),command:()=>e.get(g).call(Z,1),keyword:["h1","large heading"],typeName:"heading"},{id:"h2",dom:y(e.get(v),"Medium Heading","h2"),command:()=>e.get(g).call(Z,2),keyword:["h2","medium heading"],typeName:"heading"},{id:"h3",dom:y(e.get(v),"Small Heading","h3"),command:()=>e.get(g).call(Z,3),keyword:["h3","small heading"],typeName:"heading"},{id:"bulletList",dom:y(e.get(v),"Bullet List","bulletList"),command:()=>e.get(g).call(me),keyword:["bullet list","ul"],typeName:"bullet_list"},{id:"orderedList",dom:y(e.get(v),"Ordered List","orderedList"),command:()=>e.get(g).call(fe),keyword:["ordered list","ol"],typeName:"ordered_list"},{id:"taskList",dom:y(e.get(v),"Task List","taskList"),command:()=>e.get(g).call(he),keyword:["task list","task"],typeName:"task_list_item"},{id:"image",dom:y(e.get(v),"Image","image"),command:()=>e.get(g).call(pe),keyword:["image"],typeName:"image"},{id:"blockquote",dom:y(e.get(v),"Quote","quote"),command:()=>e.get(g).call(ve),keyword:["quote","blockquote"],typeName:"blockquote"},{id:"table",dom:y(e.get(v),"Table","table"),command:()=>e.get(g).call(ge),keyword:["table"],typeName:"table"},{id:"code",dom:y(e.get(v),"Code Fence","code"),command:()=>e.get(g).call(ye),keyword:["code"],typeName:"fence"},{id:"divider",dom:y(e.get(v),"Divide Line","divider"),command:()=>e.get(g).call(we),keyword:["divider","hr"],typeName:"hr"}],n=t.slice(1).toLocaleLowerCase();return o.filter(a=>!!r[a.typeName]&&a.keyword.some(i=>i.includes(n))).map(a=>{var i=a,s=Ae(i,["keyword","typeName"]);return s})},Ye=e=>({content:t,isTopLevel:r})=>r?t?t.startsWith("/")?t==="/"?{placeholder:"Type to filter...",actions:ae(e)}:{actions:ae(e,t)}:null:{placeholder:"Type / to use the slash commands..."}:null,qe=({font:e,palette:t})=>U`
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
`,Be=()=>U`
    &::before {
        left: 0.5rem;
    }
`,Ke=(e,t)=>{const r=t.getStyle(qe),o=t.getStyle(Be);return{handleKeyDown:(n,a)=>!(e.isEmpty()||!(a instanceof KeyboardEvent)||!["ArrowUp","ArrowDown","Enter"].includes(a.key)),decorations:n=>{const a=Se(({type:c})=>c.name==="paragraph")(n.selection);if(!a||a.node.childCount>1||n.selection.$from.parentOffset!==a.node.textContent.length){e.clear();return}const{placeholder:i,actions:s}=e.update({parentNode:n.selection.$from.node(n.selection.$from.depth-1),isTopLevel:n.selection.$from.depth===1,content:a.node.textContent,state:n});if(!i)return null;const d=(c,m)=>{const l=a.pos;return Ce.create(n.doc,[_e.node(l,l+a.node.nodeSize,{class:m.filter(f=>f).join(" "),"data-text":c})])};return s.length?d(i,[r,o,"empty-node","is-slash"]):d(i,[r,"empty-node"])}}},Re=e=>({id:e.id,$:e.dom,command:Xe(e.command)}),ze=()=>({placeholder:null,actions:[]}),Qe=e=>{const t=ze();return{get:()=>t,clear:()=>{t.placeholder=null,t.actions=[]},update:r=>{var o,n;const a=e(r);return t.placeholder=(o=a==null?void 0:a.placeholder)!=null?o:null,t.actions=((n=a==null?void 0:a.actions)!=null?n:[]).map(Re),t},isEmpty:()=>t.actions.length===0}},Ze=(e,t,r)=>{const{actions:o}=e.get();return o.length?(t.childNodes.forEach(n=>{n.removeEventListener("mouseenter",r.mouseEnter),n.removeEventListener("mouseleave",r.mouseLeave)}),t.textContent="",o.forEach(({$:n})=>{n.classList.remove("active"),n.addEventListener("mouseenter",r.mouseEnter),n.addEventListener("mouseleave",r.mouseLeave),t.appendChild(n)}),t.classList.remove("hide"),o[0].$.classList.add("active"),requestAnimationFrame(()=>{ce(o[0].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})}),!0):(t.classList.add("hide"),!1)},Fe=()=>{let e=!1;return{isLock:()=>e,lock:()=>{e=!0},unlock:()=>{e=!1}}},Je=e=>()=>{e.unlock()},Ge=(e,t)=>r=>{if(t.isLock())return;const{actions:o}=e.get(),n=o.findIndex(i=>i.$.classList.contains("active"));n>=0&&o[n].$.classList.remove("active");const{target:a}=r;a instanceof HTMLElement&&a.classList.add("active")},xe=()=>e=>{const{target:t}=e;t instanceof HTMLElement&&t.classList.remove("active")},et=(e,t,r)=>o=>{const{target:n}=o;if(!(n instanceof HTMLElement)||!t)return;const a=()=>{o.stopPropagation(),o.preventDefault()},{actions:i}=e.get(),s=Object.values(i).find(({$:d})=>d.contains(n));if(!s){if(e.isEmpty())return;e.clear(),r.classList.add("hide"),a();return}a(),s.command(t.state,t.dispatch,t)},tt=(e,t,r,o)=>n=>{if(!(n instanceof KeyboardEvent))return;o.isLock()||o.lock();const{key:a}=n;if(e.isEmpty()||!["ArrowDown","ArrowUp","Enter","Escape"].includes(a))return;const{actions:i}=e.get();let s=i.findIndex(({$:c})=>c.classList.contains("active"));s<0&&(s=0);const d=c=>{i[s].$.classList.remove("active"),i[c].$.classList.add("active"),ce(i[c].$,{scrollMode:"if-needed",block:"nearest",inline:"nearest"})};if(a==="ArrowDown"){const c=s===i.length-1?0:s+1;d(c);return}if(a==="ArrowUp"){const c=s===0?i.length-1:s-1;d(c);return}if(a==="Escape"){if(e.isEmpty())return;e.clear(),r.classList.add("hide");return}i[s].command(t.state,t.dispatch,t),i[s].$.classList.remove("active")},nt=(e,t)=>{Me(e,t,(r,o,n)=>{let a=r.left-n.left,i=r.bottom-n.top+14;return a<0&&(a=0),window.innerHeight-r.bottom<o.height&&(i=r.top-n.top-o.height-14),[i,a]})},ot=(e,t,r)=>{const o=t.dom.parentNode;if(!o)return{};const n=Ve(r),a=Fe();o.appendChild(n);const i=Je(a),s=et(e,t,n),d=tt(e,t,n,a),c=Ge(e,a),m=xe();return o.addEventListener("mousemove",i),o.addEventListener("mousedown",s),o.addEventListener("keydown",d),{update:l=>{!Ze(e,n,{mouseEnter:c,mouseLeave:m})||nt(l,n)},destroy:()=>{o.removeEventListener("mousemove",i),o.removeEventListener("mousedown",s),o.removeEventListener("keydown",d),n.remove()}}},rt="MILKDOWN_PLUGIN_SLASH",at=(e,t)=>{const r=Qe(t);return new Ee({key:new ke(rt),props:Ke(r,e),view:o=>ot(r,o,e)})},it=be((e,t)=>{var r;const o=(r=t==null?void 0:t.config)!=null?r:Ye;return{prosePlugins:(n,a)=>{const i=o(a);return[at(e,i)]}}}),dt=Le.create([it()]);export{y as createDropdownItem,ae as defaultActions,Ye as defaultConfig,dt as slash,it as slashPlugin};
