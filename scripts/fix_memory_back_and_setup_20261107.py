#!/usr/bin/env python3
"""Fix the shared launch menu and browser/Android back navigation additively.
Do not re-import games or touch game logic, images, videos or historic files.
"""
from pathlib import Path
import re
import subprocess

root = Path(__file__).resolve().parents[1]
def patch(name, transform):
    path = root / name
    old = path.read_bytes()
    new = transform(old)
    assert new != old, f"Expected change missing: {name}"
    path.write_bytes(new)
    print(f"UPDATED {name}: {len(old)} -> {len(new)} bytes")

def insert_asset(name, prefix):
    def transform(raw):
        assert b'collection-navigation.js' not in raw, f"already injected: {name}"
        assert b'</head>' in raw and b'</body>' in raw
        raw = raw.replace(b'</head>', (f'<link rel="stylesheet" href="{prefix}collection-navigation.css"></head>').encode(), 1)
        at = raw.rfind(b'</body>')
        raw = raw[:at] + (f'<script src="{prefix}collection-navigation.js"></script>').encode() + raw[at:]
        return raw
    patch(name, transform)

# The original game menu: all difficulty/reward/size choices above the start.
def update_vg(raw):
    gallery = b'<button type="button" class="quiet gallery-launch" id="openGallery">Meine Bilder noch einmal ansehen</button>'
    assert raw.count(gallery) == 1, 'Gallery control changed'
    raw = raw.replace(gallery, b'', 1)
    anchor = b'</details></div></section>\n<section id="play"'
    assert raw.count(anchor) == 1, 'Expected game selection endpoint not found'
    new_gallery = b'<button type="button" class="quiet gallery-launch" id="openGallery">Meine Fortschrittsbilder noch einmal ansehen</button>'
    raw = raw.replace(anchor, b'</details>' + new_gallery + b'</div></section>\n<section id="play"', 1)
    assert raw.index(b'id="size"') < raw.index(b'id="start"') < raw.index(b'id="openGallery"')
    assert b'collection-navigation.js' not in raw
    raw = raw.replace(b'</head>', b'<link rel="stylesheet" href="../collection-navigation.css"></head>', 1)
    at = raw.rfind(b'</body>')
    return raw[:at] + b'<script src="../collection-navigation.js"></script>' + raw[at:]
patch('verrueckt-gesucht/index.html', update_vg)

# Both root memory games get the back guard without altering gameplay.
insert_asset('eigenschaften.html', '')
insert_asset('synonymmemory/index.html', '../')
# The actual two-player build is a large (>1 MB) HTML file. Edit it at
# checkout using byte replacement rather than lossy API or reserialization.
insert_asset('wortmemory/test-zweispieler-2026-11-06.html', '../')
# Alternative historical wordmemory entry also gets a safe return route.
insert_asset('wortmemory/index.html', '../')

def menu_css(raw):
    marker = b'/* Gleich hohe Startschilder und korrigierte Originalgrafik ab 07.11.2026 */'
    assert marker not in raw
    return raw + b'''
/* Gleich hohe Startschilder und korrigierte Originalgrafik ab 07.11.2026 */
/* Hauptbuttons behalten dieselbe Bedienflaeche in jeder Kachel. */
.games .game > a.play {
  justify-self:stretch;
  align-self:end;
  width:100%;
  box-sizing:border-box;
}
.games .game > a.play.banner-button {
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  height:auto!important;
  min-height:clamp(86px,10vw,108px)!important;
  margin:0 auto!important;
  line-height:1.13!important;
}
.games .game-verrueckt > a.play-verrueckt {
  height:clamp(86px,10vw,108px)!important;
  min-height:clamp(86px,10vw,108px)!important;
  padding:10px 8px 10px 16%!important;
  /* Das Quell-SVG enthaelt viel transparenten Raum ober- und unterhalb.
     Hoeher zeichnen, damit der Button genauso gross wie die anderen ist. */
  background-image:url("verrueckt-gesucht/assets/buttons/los-gehts-v1.svg")!important;
  background-size:100% 165%!important;
  background-position:center!important;
  background-repeat:no-repeat!important;
  font-size:clamp(23px,3.2vw,36px)!important;
  color:#23452c!important;
  overflow:visible!important;
}
.games .game-verrueckt .verrueckt-button-label {
  color:#23452c!important;
  font-size:inherit!important;
  font-weight:900!important;
  text-shadow:0 1px 2px #fff9;
}
@media(max-width:620px) {
 .games .game > a.play.banner-button {
    min-height:clamp(80px,21vw,104px)!important;
    font-size:clamp(21px,5.1vw,27px)!important;
 }
 .games .game-verrueckt > a.play-verrueckt {
    height:clamp(80px,21vw,104px)!important;
    min-height:clamp(80px,21vw,104px)!important;
    font-size:clamp(21px,5vw,27px)!important;
 }
}
'''
patch('menu.css', menu_css)

def serviceworker(raw):
    assert b"const VERSION='v51'" in raw, "Cache version changed"
    assert b"'collection-navigation.js'" not in raw
    raw = raw.replace(b"const VERSION='v51'", b"const VERSION='v52'", 1)
    needle = b"files.push('verrueckt-gesucht/index.html'"
    assert needle in raw
    return raw.replace(needle, b"files.push('collection-navigation.js','collection-navigation.css');\n" + needle, 1)
patch('sw.js', serviceworker)

# Verify all four real menu targets and the original media are still available.
index = (root / 'index.html').read_text()
assert index.count('<article class="game') == 4
assert 'href="verrueckt-gesucht/index.html"' in index
assert (root / 'assets/intro/verrueckt-gesucht.mp4').is_file()
assert (root / 'verrueckt-gesucht/assets/buttons/los-gehts-v1.svg').is_file()
assert (root / 'collection-navigation.js').is_file()
assert (root / 'collection-navigation.css').is_file()
g = (root / 'verrueckt-gesucht/index.html').read_text()
assert g.count('id="openGallery"') == 1
assert g.index('id="rewardChoice"') < g.index('id="size"') < g.index('id="start"') < g.index('id="openGallery"')
for name in ('eigenschaften.html', 'synonymmemory/index.html', 'wortmemory/test-zweispieler-2026-11-06.html', 'verrueckt-gesucht/index.html'):
    html = (root/name).read_text()
    assert html.count('collection-navigation.js') == 1, name
    assert html.count('collection-navigation.css') == 1, name
for command in (
    ['node','--check','collection-navigation.js'],
    ['node','verify.cjs'],
    ['node','verify-pwa.cjs'],
    ['node','verrueckt-gesucht/test_engine.cjs'],
):
    subprocess.run(command, cwd=root, check=True)
print("PASS: four starts, original game logic, image/video assets, back navigation, order and offline cache.")
