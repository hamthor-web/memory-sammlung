/* Compatibility URLs remain tiny aliases; game logic and styles have one source. */
const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..');
function prepareRuntime(){
 const report=JSON.parse(fs.readFileSync(path.join(root,'production-assets.json'),'utf8'));
 const shared=path.join(root,'collection-session.js');let source=fs.readFileSync(shared,'utf8');
 source=source.replace(/\/\* BEGIN_ASSET_ALIASES \*\/[\s\S]*?\/\* END_ASSET_ALIASES \*\//,'/* BEGIN_ASSET_ALIASES */'+JSON.stringify(report.aliases)+'/* END_ASSET_ALIASES */');fs.writeFileSync(shared,source);
 for(const name of fs.readdirSync(path.join(root,'verrueckt-gesucht'))){
  if(/^app-release-.*\.js$/.test(name))fs.writeFileSync(path.join(root,'verrueckt-gesucht',name),'/* Compatibility entry for saved older pages. Maintained logic: app.js. */\n(function(){const src=new URL(\'app.js\',document.currentScript.src).href;if(document.readyState===\'loading\')document.write(\'<script src="\'+src+\'"><\\/script>\');else{const script=document.createElement(\'script\');script.src=src;document.head.append(script);}})();\n');
  if(/^style-release-.*\.css$/.test(name))fs.writeFileSync(path.join(root,'verrueckt-gesucht',name),'/* Compatibility for cached pages. Maintained styles: style.css. */\n@import url("style.css");\n');
 }
 return report.aliases;
}
module.exports=prepareRuntime;if(require.main===module)prepareRuntime();
