function g(e,n){let f=!1;e[0]==="#"&&(e=e.slice(1),f=!0);const i=parseInt(e,16);let s=(i>>16)+n;s>255?s=255:s<0&&(s=0);let t=(i>>8&255)+n;t>255?t=255:t<0&&(t=0);let r=(i&255)+n;return r>255?r=255:r<0&&(r=0),(f?"#":"")+(r|t<<8|s<<16).toString(16)}function o(e){e[0]==="#"&&(e=e.slice(1));const n=parseInt(e,16),f=n>>16,i=n&255,s=n>>8&255;return .3*f+.6*i+.1*s}export{o as g,g as l};
