# blobbr
## Dynamic asset handling, the easy way.

Blobbr is a small (<2KB) interface to handle asset loading and runtime storing. It will load any kind of file from the network and store it for later access.
It works on any modern browser (IE10+) and has no dependency from any other libraries.

Blobbr come as a global `blobbr` object with two methods:

`blobbr.load(url, done_callback, progress_callback)` which will load a resource, calling an optional `progress_callback(loaded, total_size, url)` callback during progress and an optional `done_callback(status)` when done. That status is a HTTP status as an integer. If the loading succeeds, the context of the callback will be the blobbr item (see below).

`blobbr.get(url)` will retrieve a previously loaded blobbr item (see below) from memory.

A read-only property that enumerates the loaded blobs is also available: 

`blobbr.blobs` which is an object composed by key-value pairs for each blob, with the url as key and the blobbr item as value (see below).

The blobber item represent a loaded blob and has several properties and methods:

`obj.originalURL` the URL of the asset

`obj.delete()` a method that will dispose of the loaded data

`obj.type` blob mime type as string

`obj.size` size of the data in bytes

`obj.getContentAsArrayBuffer(callback: function(data) {})` the blob data in arrayBuffer format

`obj.getContentAsUTF8(callback: function(data) {})` the blob data interpreted as UTF-8 data

`obj.getContentAsUTF16(callback: function(data) {})` the blob data interpreted as UTF-16 data

`obj.asURI` a blob runtime URI


`load`ing an url that’s already been loaded will caused the previous data to be discarded and a new load to perform from scratch (than it’s up to the server and browser cache settings to decide if an actual new transfer has to take place).

`get`ing a non loaded url will result in a `false` result.

Here are some examples: https://stefano.io/blobbr/examples/ (no fancy stuff, just some demo of what you can do with blobbr)

To build a minified version inside the dist folder you can use:
```
npm install && npm run build
```
