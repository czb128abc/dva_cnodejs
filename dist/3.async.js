webpackJsonp([3],{BUcb:function(t,e,r){r("Jd1N"),t.exports=self.fetch.bind(self)},Jd1N:function(t,e,r){"use strict";function n(t){return t&&DataView.prototype.isPrototypeOf(t)}function o(t){if("string"!==typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function s(t){return"string"!==typeof t&&(t=String(t)),t}function i(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return _.iterable&&(e[Symbol.iterator]=function(){return e}),e}function a(t){this.map={},t instanceof a?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function u(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function c(t){return new Promise(function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}})}function f(t){var e=new FileReader(),r=c(e);return e.readAsArrayBuffer(t),r}function h(t){var e=new FileReader(),r=c(e);return e.readAsText(t),r}function d(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}function l(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function p(){return this.bodyUsed=!1,this._initBody=function(t){this._bodyInit=t,t?"string"===typeof t?this._bodyText=t:_.blob&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:_.formData&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:_.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():_.arrayBuffer&&_.blob&&n(t)?(this._bodyArrayBuffer=l(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):_.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(t)||x(t))?this._bodyArrayBuffer=l(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"===typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):_.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},_.blob&&(this.blob=function(){var t=u(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?u(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(f)}),this.text=function(){var t=u(this);if(t)return t;if(this._bodyBlob)return h(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(d(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},_.formData&&(this.formData=function(){return this.text().then(m)}),this.json=function(){return this.text().then(JSON.parse)},this}function y(t){var e=t.toUpperCase();return A.indexOf(e)>-1?e:t}function b(t,e){e=e||{};var r=e.body;if(t instanceof b){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new a(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,r||null==t._bodyInit||(r=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new a(e.headers)),this.method=y(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&r)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(r)}function m(t){var e=new FormData();return t.trim().split("&").forEach(function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}}),e}function v(t){var e=new a();return t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();e.append(n,o)}}),e}function w(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new a(e.headers),this.url=e.url||"",this._initBody(t)}function g(t,e){return new Promise(function(r,n){function o(){i.abort()}var s=new b(t,e);if(s.signal&&s.signal.aborted)return n(new B("Aborted","AbortError"));var i=new XMLHttpRequest();i.onload=function(){var t={status:i.status,statusText:i.statusText,headers:v(i.getAllResponseHeaders()||"")};t.url="responseURL"in i?i.responseURL:t.headers.get("X-Request-URL");var e="response"in i?i.response:i.responseText;r(new w(e,t))},i.onerror=function(){n(new TypeError("Network request failed"))},i.ontimeout=function(){n(new TypeError("Network request failed"))},i.onabort=function(){n(new B("Aborted","AbortError"))},i.open(s.method,s.url,!0),"include"===s.credentials?i.withCredentials=!0:"omit"===s.credentials&&(i.withCredentials=!1),"responseType"in i&&_.blob&&(i.responseType="blob"),s.headers.forEach(function(t,e){i.setRequestHeader(e,t)}),s.signal&&(s.signal.addEventListener("abort",o),i.onreadystatechange=function(){4===i.readyState&&s.signal.removeEventListener("abort",o)}),i.send(void 0===s._bodyInit?null:s._bodyInit)})}Object.defineProperty(e,"__esModule",{value:!0}),e.Headers=a,e.Request=b,e.Response=w,r.d(e,"DOMException",function(){return B}),e.fetch=g;var _={searchParams:"URLSearchParams"in self,iterable:"Symbol"in self&&"iterator"in Symbol,blob:"FileReader"in self&&"Blob"in self&&function(){try{return new Blob(),!0}catch(t){return!1}}(),formData:"FormData"in self,arrayBuffer:"ArrayBuffer"in self};if(_.arrayBuffer)var E=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],x=ArrayBuffer.isView||function(t){return t&&E.indexOf(Object.prototype.toString.call(t))>-1};a.prototype.append=function(t,e){t=o(t),e=s(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},a.prototype.delete=function(t){delete this.map[o(t)]},a.prototype.get=function(t){return t=o(t),this.has(t)?this.map[t]:null},a.prototype.has=function(t){return this.map.hasOwnProperty(o(t))},a.prototype.set=function(t,e){this.map[o(t)]=s(e)},a.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},a.prototype.keys=function(){var t=[];return this.forEach(function(e,r){t.push(r)}),i(t)},a.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),i(t)},a.prototype.entries=function(){var t=[];return this.forEach(function(e,r){t.push([r,e])}),i(t)},_.iterable&&(a.prototype[Symbol.iterator]=a.prototype.entries);var A=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];b.prototype.clone=function(){return new b(this,{body:this._bodyInit})},p.call(b.prototype),p.call(w.prototype),w.prototype.clone=function(){return new w(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new a(this.headers),url:this.url})},w.error=function(){var t=new w(null,{status:0,statusText:""});return t.type="error",t};var T=[301,302,303,307,308];w.redirect=function(t,e){if(-1===T.indexOf(e))throw new RangeError("Invalid status code");return new w(null,{status:e,headers:{location:t}})};var B=self.DOMException;try{new B()}catch(t){B=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack},B.prototype=Object.create(Error.prototype),B.prototype.constructor=B}g.polyfill=!0,self.fetch||(self.fetch=g,self.Headers=a,self.Request=b,self.Response=w)},UJzV:function(t,e,r){t.exports=r("BUcb")},bb5D:function(t,e,r){"use strict";function n(t){var e=t.page,r=void 0===e?1:e,n=t.tab,o=void 0===n?"share":n,s=t.limit,i=void 0===s?10:s;return Object(f.a)("".concat(h,"/api/v1/topics?tab=").concat(o,"&page=").concat(r,"&limit=").concat(i),{method:"GET"})}Object.defineProperty(e,"__esModule",{value:!0});var o=r("UVnk"),s=r.n(o),i=r("rHlg"),a=r.n(i),u=r("5EXE"),c=r.n(u),f=r("vLgD"),h="https://cnodejs.org",d={namespace:"cnodejs",state:{topicMap:{ask:{list:[]},share:{list:[]},job:{list:[]},good:{list:[]}}},reducers:{setTopic:function(t,e){var r=e.payload,n=r.tab,o=r.list,s={topicMap:c()({},n,{list:o})};return a()({},t,s)}},effects:{queryTopicsByType:s.a.mark(function t(e,r){var o,i;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,r.call(n,e.payload);case 2:return o=t.sent,i=o.data,t.next=6,r.put({type:"setTopic",payload:{tab:e.payload.tab,list:i.data}});case 6:case"end":return t.stop()}},t,this)})}};e.default=d},vLgD:function(t,e,r){"use strict";function n(t){if(t.status>=200&&t.status<300)return t;var e=new Error(t.statusText);throw e.response=t,e}function o(t,e){return s.apply(this,arguments)}function s(){return s=c()(a.a.mark(function t(e,r){var o,s,i;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,h()(e,r);case 2:return o=t.sent,n(o),t.next=6,o.json();case 6:return s=t.sent,i={data:s,headers:{}},o.headers.get("x-total-count")&&(i.headers["x-total-count"]=o.headers.get("x-total-count")),t.abrupt("return",i);case 10:case"end":return t.stop()}},t,this)})),s.apply(this,arguments)}var i=r("UVnk"),a=r.n(i),u=r("2mSJ"),c=r.n(u),f=r("UJzV"),h=r.n(f);e.a=o}});