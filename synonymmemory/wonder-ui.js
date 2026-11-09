/* Parent owns the saved progress; the approved animation page only displays it. */
(function(){
 'use strict';
 const section=document.getElementById('syn-clearing'),frame=document.getElementById('syn-wonder-frame');let close=()=>{};
 addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow||e.data?.type!=='syn-wonder-height')return;const height=e.data.height;if(Number.isFinite(height)&&height>0&&height<15000)frame.style.height=height+'px';});
 document.getElementById('syn-wonder-close').onclick=()=>{section.hidden=true;frame.contentWindow.location.replace('about:blank');close();};
 window.SynonymWonder={open(state,{fresh=false,ownerName='',onClose=()=>{}}={}){close=onClose;section.hidden=false;document.getElementById('syn-wonder-owner').textContent='Lichtung von '+ownerName;frame.style.height='850px';frame.contentWindow.location.replace('wonder-clearing.html?count='+state.count+(fresh?'&new=1':''));document.getElementById('syn-wonder-close').focus({preventScroll:true});scrollTo(0,0);},stop(){section.hidden=true;frame.contentWindow.location.replace('about:blank');}};
})();
