(function(e){function t(t){for(var a,i,s=t[0],c=t[1],l=t[2],u=0,f=[];u<s.length;u++)i=s[u],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&f.push(r[i][0]),r[i]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(e[a]=c[a]);m&&m(t);while(f.length)f.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],a=!0,i=1;i<n.length;i++){var c=n[i];0!==r[c]&&(a=!1)}a&&(o.splice(t--,1),e=s(s.s=n[0]))}return e}var a={},r={app:0},o=[];function i(e){return s.p+"js/"+({about:"about"}[e]||e)+"."+{about:"77f7e79d"}[e]+".js"}function s(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var a=new Promise((function(t,a){n=r[e]=[t,a]}));t.push(n[2]=a);var o,c=document.createElement("script");c.charset="utf-8",c.timeout=120,s.nc&&c.setAttribute("nonce",s.nc),c.src=i(e);var l=new Error;o=function(t){c.onerror=c.onload=null,clearTimeout(u);var n=r[e];if(0!==n){if(n){var a=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;l.message="Loading chunk "+e+" failed.\n("+a+": "+o+")",l.name="ChunkLoadError",l.type=a,l.request=o,n[1](l)}r[e]=void 0}};var u=setTimeout((function(){o({type:"timeout",target:c})}),12e4);c.onerror=c.onload=o,document.head.appendChild(c)}return Promise.all(t)},s.m=e,s.c=a,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(n,a,function(t){return e[t]}.bind(null,a));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/",s.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var m=l;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"034f":function(e,t,n){"use strict";n("85ec")},"5dd5":function(e,t,n){e.exports=n.p+"img/com-ng.793a7be9.png"},6356:function(e,t,n){},"6fcb":function(e,t,n){e.exports=n.p+"img/vio-ok.5769aa56.png"},"82ac":function(e,t,n){e.exports=n.p+"img/sex-ng.163d307d.png"},"85ec":function(e,t,n){},"91f6":function(e,t,n){e.exports=n.p+"img/com-ok.23d22946.png"},ac86:function(e,t,n){"use strict";n("6356")},c7a0:function(e,t,n){e.exports=n.p+"img/sex-ok.cc9d8cf5.png"},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("2b0e"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},o=[],i=(n("034f"),n("2877")),s={},c=Object(i["a"])(s,r,o,!1,null,null,null),l=c.exports,u=(n("d3b7"),n("8c4f")),m=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"home"},[n("TestVRM")],1)},f=[],v=n("d4ec"),d=n("262e"),p=n("2caf"),g=n("9ab4"),h=n("60a3"),b=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("p",[e._v("ローカル環境で処理しているため、VRMファイルをサーバーにアップロードしていません。")]),a("div",{staticClass:"top layer-size"},[a("div",{staticClass:"layer2 layer-size layer white",class:{outline:e.isDragOver},on:{dragover:function(t){return t.preventDefault(),e.onDrag("over")},dragleave:function(t){return t.preventDefault(),e.onDrag("leave")},drop:function(t){return t.preventDefault(),e.onDrop(t)}}},[a("div",[e._v("VRMをドラッグ&ドロップ")]),a("p",[a("input",{attrs:{type:"file",accept:".vrm"},on:{change:e.onFileChange}})])]),a("canvas",{staticClass:"layer1 layer-size layer",attrs:{id:"canvas",width:"600",height:"400"}})]),null!==e.meta?a("div",["Allow"===e.meta.commercialUssageName?a("img",{staticClass:"license-img",attrs:{src:n("91f6")}}):a("img",{staticClass:"license-img",attrs:{src:n("5dd5")}}),"Allow"===e.meta.sexualUssageName?a("img",{staticClass:"license-img",attrs:{src:n("c7a0")}}):a("img",{staticClass:"license-img",attrs:{src:n("82ac")}}),"Allow"===e.meta.violentUssageName?a("img",{staticClass:"license-img",attrs:{src:n("6fcb")}}):a("img",{staticClass:"license-img",attrs:{src:n("d889")}})]):e._e(),null!==e.meta?a("div",{staticClass:"undot-list centering-list my-list"},[a("ul",[a("li",[e._v("Title : "+e._s(e.meta.title))]),a("li",[e._v("Version : "+e._s(e.meta.version))]),a("li",[e._v("Author : "+e._s(e.meta.author))]),a("li",[e._v("AllowUser : "+e._s(e.meta.allowedUserName))]),a("li",[e._v("CommercialUssage : "+e._s(e.meta.commercialUssageName))]),a("li",[e._v("SexualUssage : "+e._s(e.meta.sexualUssageName))]),a("li",[e._v("ViolentUssage : "+e._s(e.meta.violentUssageName))]),a("li",[e._v("LicenseName : "+e._s(e.meta.licenseName))]),a("li",[e._v("OtherLicense : "),a("a",{attrs:{href:e.meta.otherLicenseUrl,target:"_blank"}},[e._v(" "+e._s(e.meta.otherLicenseUrl)+" ")])]),a("li",[e._v("OtherPermission : "),a("a",{attrs:{href:e.meta.otherPermissionUrl,target:"_blank"}},[e._v(" "+e._s(e.meta.otherPermissionUrl)+" ")])]),a("li",[e._v("ContactInformation : "),a("a",{attrs:{href:e.meta.contactInformation,target:"_blank"}},[e._v(" "+e._s(e.meta.contactInformation)+" ")])]),a("li",[e._v("Reference : "+e._s(e.meta.reference))])])]):e._e()])},_=[],O=(n("3ca3"),n("ddb0"),n("2b3d"),n("bee2")),y=n("5a89"),j=n("34ad"),w=n("f7e7"),x=function(e){Object(d["a"])(n,e);var t=Object(p["a"])(n);function n(){var e;return Object(v["a"])(this,n),e=t.apply(this,arguments),e.scene=new y["Scene"],e.renderer=null,e.camera=new y["PerspectiveCamera"](75,1.5,.1,1e3),e.light=new y["DirectionalLight"](16777215),e.isDragOver=!1,e.meta=null,e.vrmObject=null,e}return Object(O["a"])(n,[{key:"onDrag",value:function(e){this.isDragOver="over"===e}},{key:"onDrop",value:function(e){var t=this;if(null!==e.dataTransfer&&null!==e.dataTransfer.files){this.isDragOver=!1;var n=e.dataTransfer.files[0],a=window.URL.createObjectURL(n),r=new j["a"];r.load(a,(function(e){w["VRM"].from(e).then((function(e){null!==t.vrmObject&&t.scene.remove(t.vrmObject),t.scene.add(e.scene),t.meta=e.meta,t.vrmObject=e.scene,console.log(e)}))}),(function(e){return console.log("Loading model...",e.loaded/e.total*100,"%")}),(function(e){return console.error(e)}))}}},{key:"mounted",value:function(){var e=document.getElementById("canvas");null!==e&&(this.renderer=new y["WebGLRenderer"]({antialias:!0,canvas:e}),this.camera.position.set(0,1,-1.5),this.camera.rotation.set(0,Math.PI,0),this.light.position.set(0,0,10),this.scene.add(this.light),this.animate())}},{key:"animate",value:function(){requestAnimationFrame(this.animate),this.renderer.render(this.scene,this.camera)}},{key:"onFileChange",value:function(e){var t=this;if(null!==e.target.files){var n=e.target.files[0],a=window.URL.createObjectURL(n),r=new j["a"];r.load(a,(function(e){w["VRM"].from(e).then((function(e){null!==t.vrmObject&&t.scene.remove(t.vrmObject),t.scene.add(e.scene),t.meta=e.meta,t.vrmObject=e.scene,console.log(e)}))}),(function(e){return console.log("Loading model...",e.loaded/e.total*100,"%")}),(function(e){return console.error(e)}))}}}]),n}(h["c"]);Object(g["a"])([Object(h["b"])()],x.prototype,"meta",void 0),x=Object(g["a"])([h["a"]],x);var U=x,C=U,k=(n("ac86"),Object(i["a"])(C,b,_,!1,null,null,null)),L=k.exports,P=function(e){Object(d["a"])(n,e);var t=Object(p["a"])(n);function n(){return Object(v["a"])(this,n),t.apply(this,arguments)}return n}(h["c"]);P=Object(g["a"])([Object(h["a"])({components:{TestVRM:L}})],P);var D=P,R=D,M=Object(i["a"])(R,m,f,!1,null,null,null),T=M.exports;a["a"].use(u["a"]);var N=[{path:"/",name:"Home",component:T},{path:"/about",name:"About",component:function(){return n.e("about").then(n.bind(null,"f820"))}}],A=new u["a"]({mode:"history",base:"/",routes:N}),S=A,V=n("2f62");a["a"].use(V["a"]);var E=new V["a"].Store({state:{},mutations:{},actions:{},modules:{}});a["a"].config.productionTip=!1,new a["a"]({router:S,store:E,render:function(e){return e(l)}}).$mount("#app")},d889:function(e,t,n){e.exports=n.p+"img/vio-ng.3c387b56.png"}});
//# sourceMappingURL=app.cbd5903d.js.map