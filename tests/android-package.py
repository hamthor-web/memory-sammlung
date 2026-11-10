"""Compare every production file with the offline assets in APK and AAB."""
import json
import os
import pathlib
import subprocess
import zipfile

root = pathlib.Path(__file__).resolve().parents[1]
config = json.loads((root / 'capacitor.config.json').read_text())
# This ID belongs to the separate, already published Lesen/entdecken app.
assert config['appId'] != 'de.heikeamthor.lesespiele', 'Do not reuse the published reading app package'
packages = [
    ('android/app/build/outputs/apk/debug/app-debug.apk', 'assets/'),
    ('android/app/build/outputs/bundle/release/app-release.aab', 'base/assets/'),
]
# GitHub Pages uses this empty hosting marker; Android's asset packager excludes
# dotfiles. It is not part of the game/offline inventory.
files = [p for p in (root / 'dist').rglob('*') if p.is_file() and p.name != '.nojekyll']
assert files
for name, prefix in packages:
    with zipfile.ZipFile(root / name) as package:
        for file in files:
            relative = file.relative_to(root / 'dist').as_posix()
            assert package.read(prefix + 'public/' + relative) == file.read_bytes(), relative
        embedded = json.loads(package.read(prefix + 'capacitor.config.json'))
        for key in ['appId', 'appName', 'webDir']:
            assert embedded[key] == config[key], key
    print(f'PASS {name}: {len(files)} production files byte-identical, native app identity preserved')

# Check the installed application's identity, not just its embedded web config.
aapt = pathlib.Path(os.environ['ANDROID_HOME']) / 'build-tools/35.0.0/aapt'
badging = subprocess.check_output([str(aapt), 'dump', 'badging', str(root / packages[0][0])], text=True)
version = json.loads((root / 'package.json').read_text())['version']
assert f"name='{config['appId']}.test'" in badging
assert f"versionName='{version}-test'" in badging
assert f"application-label:'{config['appName']} – Test'" in badging
print('PASS compiled APK package, launcher name and version match the independent app identity')
