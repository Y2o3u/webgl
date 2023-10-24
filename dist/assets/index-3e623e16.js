(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function i(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(o){if(o.ep)return;o.ep=!0;const n=i(o);fetch(o.href,n)}})();const m=`
    attribute vec4 a_position;
    void main(){
        gl_Position = a_position;
        gl_PointSize = 10.0;
    }
`,T=`
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
    }
`,l=document.getElementById("canvas"),e=l.getContext("webgl");let A=c(e,e.VERTEX_SHADER,m),R=c(e,e.FRAGMENT_SHADER,T);f(e,A,R);function S(r,a){let i=c(e,e.VERTEX_SHADER,r),t=c(e,e.FRAGMENT_SHADER,a);return f(e,i,t)}function c(r,a,i){let t=r.createShader(a);return r.shaderSource(t,i),r.compileShader(t),r.getShaderParameter(t,r.COMPILE_STATUS)?t:(console.error(r.getShaderInfoLog(t)),r.deleteShader(t),null)}function f(r,a,i){let t=r.createProgram();return r.attachShader(t,a),r.attachShader(t,i),r.linkProgram(t),r.getProgramParameter(t,r.LINK_STATUS)?t:(console.error(r.getProgramInfoLog(t)),r.deleteProgram(t),null)}function p(r=0,a=0,i=0,t=1){e.clearColor(r,a,i,t),e.clear(e.COLOR_BUFFER_BIT)}function P(r){let a=r.createTexture();return r.bindTexture(r.TEXTURE_2D,a),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),a}const x=`
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main(){
        gl_Position = a_position;
        v_texCoord = a_texCoord;
    }
`,h=`
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main(){
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`,d=S(x,h);e.useProgram(d);const v=new Float32Array([-1,1,-1,-1,1,-1,1,-1,1,1,-1,1]),F=new Float32Array([0,1,0,0,1,0,1,0,1,1,0,1]);let L=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,L);e.bufferData(e.ARRAY_BUFFER,v,e.STATIC_DRAW);let C=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,C);e.bufferData(e.ARRAY_BUFFER,F,e.STATIC_DRAW);let E=e.getAttribLocation(d,"a_position"),_=e.getAttribLocation(d,"a_texCoord");e.vertexAttribPointer(E,2,e.FLOAT,!1,Float32Array.BYTES_PER_ELEMENT*2,0);e.enableVertexAttribArray(E);e.vertexAttribPointer(_,2,e.FLOAT,!1,Float32Array.BYTES_PER_ELEMENT*2,0);e.enableVertexAttribArray(_);P(e);const u=new Image;u.src="../assets/head.png";u.onload=function(){p(),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,u),e.drawArrays(e.TRIANGLES,0,6)};
