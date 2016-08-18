/*!
 * blobbr
 *
 * Stefano Peloso - https://github.com/stefanoio/togglr
 *
 * Free to use under terms of WTFPL version 2 license
 */

window.blobbr = window.blobbr || (function() {
	"use strict";

	var
		_blobs = {},
		_URIs = {},

		deleteBlob = function() {
			if(this.originalURL in _URIs) {
				URL.revokeObjectURL(_URIs[this.originalURL]);
			}
			delete _blobs[this.originalURL];
			delete _URIs[this.originalURL];
		},

		getContentAsArrayBuffer = function(callback) {
			var
				fr = new FileReader();
			fr.addEventListener("load", function() {
				callback(this.result);
			});
			fr.readAsArrayBuffer(_blobs[this.originalURL]);
		},

		getContentAsUTF8 = function(callbackUTF8) {
			this.getContentAsArrayBuffer(function(data) {
				callbackUTF8(String.fromCharCode.apply(null, new Uint8Array(data)));
			});
		},

		getContentAsUTF16 = function(callbackUTF16) {
			this.getContentAsArrayBuffer(function(data) {
				callbackUTF16(String.fromCharCode.apply(null, new Uint8Array(data)));
			});
		},

		getBlobAsURI = function() {
			if(!(this.originalURL in _URIs)) {
				_URIs[this.originalURL] = URL.createObjectURL(_blobs[this.originalURL]);
			}
			return _URIs[this.originalURL];
		},

		getBlob = function(id) {
			if(id in _blobs) {
				var
					ret = {
						originalURL: id,
						delete: deleteBlob,
						type: _blobs[id].type,
						size: _blobs[id].size,
						getContentAsArrayBuffer: getContentAsArrayBuffer,
						getContentAsUTF8: getContentAsUTF8,
						getContentAsUTF16: getContentAsUTF16
					};
				Object.defineProperty(ret, "asURI", {
					get: getBlobAsURI
				});
				return ret;
			} else {
				return false;
			}
		},

		getAllBlobs = function() {
			var
				ret = {},
				id;
			for(id in _blobs) {
				if(_blobs.hasOwnProperty(id)) {
					ret[id] = getBlob(id);
				}
			}
			return ret;
		},

		xhr_load = function() {
			_blobs[this.blobbr_url] = this.response;
			if(typeof this.blobbr_progress_callback === "function") {
				this.blobbr_progress_callback(this.response.size, this.response.size, this.blobbr_url);
			}
			if(typeof this.blobbr_done_callback === "function") {
				this.blobbr_done_callback.call(getBlob(this.blobbr_url), this.status);
			}
		},

		xhr_error = function() {
			if(typeof this.blobbr_done_callback === "function") {
				this.blobbr_done_callback.call(this, this.status);
			}
		},

		xhr_progress = function(e) {
			if(typeof this.blobbr_progress_callback === "function") {
				this.blobbr_progress_callback(e.loaded, e.totalSize, this.blobbr_url);
			}
		},

		load = function(url, done_callback, progress_callback) {
			var
				xhr = new XMLHttpRequest();
			if(url in _blobs) {
				deleteBlob.call({originalURL: url});
			}
			xhr.blobbr_url = url;
			xhr.blobbr_done_callback = done_callback;
			xhr.blobbr_progress_callback = progress_callback;
			xhr.addEventListener("load", xhr_load);
			xhr.addEventListener("abort", xhr_error);
			xhr.addEventListener("error", xhr_error);
			xhr.addEventListener("progress", xhr_progress);
			xhr.open("GET", url);
			xhr.responseType = "blob";
			xhr.send();
		},

		init = function() {
			if("URL" in window) {
				var
					ret = {
						load: load,
						get: getBlob
					};
				Object.defineProperty(ret, "blobs", {
					get: getAllBlobs
				});
				return ret;
			} else {
				console.error("blobbr: unsupported browser");
				return false;
			}
		};

	return init();

})();
