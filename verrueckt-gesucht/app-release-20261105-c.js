/* Compatibility entry for saved older pages. Maintained logic: app.js. */
(function(){const src=new URL('app.js',document.currentScript.src).href;if(document.readyState==='loading')document.write('<script src="'+src+'"><\/script>');else{const script=document.createElement('script');script.src=src;document.head.append(script);}})();
