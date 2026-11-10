"""Transfer a locally signed test APK through the repository API, without transferring keys."""
import hashlib,json,os,pathlib,re,urllib.request,zipfile
manifest=json.loads(os.environ['PREPARED_APK'])
assert isinstance(manifest,dict) and isinstance(manifest['parts'],list) and 1<=len(manifest['parts'])<=64
assert isinstance(manifest['bytes'],int) and 0<manifest['bytes']<=200*1024*1024
assert re.fullmatch('[a-f0-9]{64}',manifest['sha256'])
name=os.environ.get('ANDROID_APK_NAME','Memory-Lesen-0.1.0-test.apk')
assert re.fullmatch(r'(?:memoriesammlung|Memory-(?:Sammlung|Lesen))-[0-9]+\.[0-9]+\.[0-9]+-test\.apk',name)
target=pathlib.Path(name)
with target.open('wb') as out:
 for part in manifest['parts']:
  assert re.fullmatch('[a-f0-9]{40}',part['sha']) and re.fullmatch('[a-f0-9]{64}',part['sha256'])
  request=urllib.request.Request('https://api.github.com/repos/'+os.environ['GITHUB_REPOSITORY']+'/git/blobs/'+part['sha'],headers={'Authorization':'Bearer '+os.environ['GH_TOKEN'],'Accept':'application/vnd.github.raw'})
  with urllib.request.urlopen(request,timeout=60) as response:data=response.read(8*1024*1024+1)
  assert len(data)<=8*1024*1024 and hashlib.sha256(data).hexdigest()==part['sha256']
  out.write(data)
assert target.stat().st_size==manifest['bytes'] and hashlib.sha256(target.read_bytes()).hexdigest()==manifest['sha256']
# The independently built Android artifact must contain exactly the same local game files/config.
with zipfile.ZipFile(target) as signed,zipfile.ZipFile('test-apk/outputs/apk/debug/app-debug.apk') as built:
 names=[n for n in built.namelist() if n.startswith('assets/public/') and not n.endswith('/')]
 assert names and all(signed.read(n)==built.read(n) for n in names)
 assert signed.read('assets/capacitor.config.json')==built.read('assets/capacitor.config.json')
print('Verified prepared test APK and matching production assets.')
