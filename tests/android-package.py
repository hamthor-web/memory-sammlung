"""Compare every production file with the offline assets in APK and AAB."""
import json
import pathlib
import zipfile

root = pathlib.Path(__file__).resolve().parents[1]
config = json.loads((root / 'capacitor.config.json').read_text())
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
