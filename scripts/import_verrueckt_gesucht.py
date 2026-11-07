#!/usr/bin/env python3
"""One-time additive import; keeps all source bytes and existing games unchanged."""
from pathlib import Path
import hashlib
import re
import shutil
import subprocess
import sys

source, target = map(Path, sys.argv[1:3])
source = source.resolve()
target = target.resolve()
destination = target / "verrueckt-gesucht"
assert (source / "index.html").is_file(), "Source checkout unavailable"
assert (target / "synonymmemory/index.html").is_file(), "Unexpected target checkout"
assert not destination.exists(), "Import directory already exists: abort, do not overwrite"
source_files = sorted(p for p in source.rglob("*") if p.is_file() and ".git" not in p.relative_to(source).parts)
assert len(source_files) == 349, f"Unexpected source count: {len(source_files)}"
for original in source_files:
    relative = original.relative_to(source)
    new = destination / relative
    new.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(original, new)
    assert hashlib.sha256(original.read_bytes()).digest() == hashlib.sha256(new.read_bytes()).digest(), str(relative)
index = target / "index.html"
html = index.read_text(encoding="utf-8")
assert "1 Sache, 2 Bezeichnungen" in html
assert "verrueckt-gesucht/index.html" not in html
card = """ <article class="game game-paper game-verrueckt">
   <img src="verrueckt-gesucht/assets/knurpsel/stufe-08.png" alt="Knurpsel mit Propeller, Schirmflügeln und Schwimmflossen">
   <h2>Verrückt gesucht!</h2>
   <p>Lies die Frage und entdecke die verrückten Unterschiede auf den Bildern.</p>
   <a class="play" href="verrueckt-gesucht/index.html">Spiel starten</a>
 </article>
"""
assert "</section><footer>" in html
html = html.replace("</section><footer>",card+"</section><footer>",1)
index.write_text(html,encoding="utf-8")
css_path = target / "menu.css"
css = css_path.read_text(encoding="utf-8")
css += """
/* Vier Spielkacheln: zwei gleichwertige Spalten, auch im Querformat. */
.games {grid-template-columns:repeat(2,minmax(0,1fr))}
@media(min-width:1051px) and (orientation:landscape) {
 .games {grid-template-columns:repeat(2,minmax(0,1fr))}
}
.game-verrueckt {border-color:#b49a51}
.game-verrueckt > img {object-fit:contain}
@media(max-width:620px) {
 .games {grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 .games .game {padding:10px;gap:7px;border-radius:16px}
 .games .game img {height:clamp(105px,21vw,160px)}
 .games .game h2 {font-size:clamp(18px,4.2vw,23px);overflow-wrap:anywhere}
 .games .game p {font-size:clamp(16px,3.7vw,19px);line-height:1.35;overflow-wrap:anywhere}
 .games .game .play {font-size:clamp(16px,3.7vw,20px);padding:12px 6px;overflow-wrap:anywhere;min-height:50px}
}
"""
css_path.write_text(css, encoding="utf-8")
sw_path=target/"sw.js"
sw=sw_path.read_text(encoding="utf-8")
assert "const VERSION='v47'" in sw
sw=sw.replace("const VERSION='v47'","const VERSION='v48'",1)
sw=sw.replace("// Beide undekorierten Originalbilder", "files.push('verrueckt-gesucht/index.html','verrueckt-gesucht/assets/knurpsel/stufe-08.png');\n// Beide undekorierten Originalbilder",1)
sw_path.write_text(sw,encoding="utf-8")
assert (target/"assets/intro/synonymmemory.mp4").is_file()
assert 'verrueckt-gesucht/index.html' in html
assert 'grid-template-columns:repeat(2,minmax(0,1fr))' in css
for test in ("verify.cjs","verify-pwa.cjs"):
    subprocess.run(["node",test],cwd=target,check=True)
for test in ("test_engine.cjs",):
    if (destination/test).is_file():
        subprocess.run(["node",test],cwd=destination,check=True)
print("Legacy browser-mock tests of the source remain for separate browser verification.")
print(f"OK: copied {len(source_files)} source files byte-for-byte; 4 cards, 2 columns, cache v48.")
