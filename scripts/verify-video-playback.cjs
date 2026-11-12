/* Sicherung gegen verfrühte Abschaltung und erneute Android-Videobuttons. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const clips=[
 'assets/animations/01_Der_hoefliche_Papierkorb.mp4',
 'assets/animations/02_Der_huepfende_Deckel.mp4',
 'assets/animations/03_Der_kleine_Zaubertrick.mp4',
 'assets/animations/04_Der_freche_Papierkorb.mp4',
 'assets/animations/Fuehlmemory_Wuerstchen_Jubelanimation.mp4',
 'assets/animations/Memory_Jubel_Zwei_Woerter_Eine_Bedeutung.mp4',
 'assets/animations/Wuerstchen_Jubel_Birne_Gluehbirne.mp4',
 'assets/intro/fuehlmemory.mp4','assets/intro/wortmemory.mp4',
 'assets/intro/synonymmemory.mp4','assets/intro/verrueckt-gesucht.mp4'
];
let bytes=0;
for(const file of clips){
 const data=fs.readFileSync(path.join(root,file));bytes+=data.length;
 assert(data.length>1000&&data.length<2_000_000,file+' Videodatei fehlerhaft');
 assert.equal(data.toString('ascii',4,8),'ftyp',file+' kein MP4');
 const ftypLength=data.readUInt32BE(0);
 assert.equal(data.toString('ascii',ftypLength+4,ftypLength+8),'moov',file+' Metadaten nicht am Anfang');
}
const eig=read('app.js'),intro=read('intro-animations.js'),word=read('wortmemory/app.js'),syn=read('synonymmemory/app.js');
assert(eig.includes('queueReward();openSuccessReading(c)'), 'Eigenschaften-Clip nicht vorgeladen');
assert(eig.includes('video.onplaying='), 'Eigenschaften: Wiedergabestart nicht kontrolliert');
assert(!eig.includes('setTimeout(done,6500)'), 'Alte 6,5-Sekunden-Abschaltung');
assert(intro.includes('function warm(link)')&&intro.includes('video.onplaying='),'Intros nicht vorbereitet');
assert(word.includes('wordJubelPreload.load()')&&word.includes('video.onplaying='),'Wortmemory-Jubel nicht vorbereitet');
assert(syn.includes('jubelVideo.load()')&&syn.includes('video.onplaying='),'Synonymmemory-Jubel nicht vorbereitet');
const version=require('../package.json').version,gradle=read('android/app/build.gradle');
assert(gradle.includes('versionName "'+version+'"'),'Android-Version ungleich Paketversion');
console.log('Video-Test: '+clips.length+' MP4, '+(bytes/1e6).toFixed(2)+' MB, Faststart-Metadaten, Preload und Android-Version geprüft.');
