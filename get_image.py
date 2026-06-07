import urllib.request
import re

req = urllib.request.Request('https://en.wikipedia.org/wiki/J._Robert_Oppenheimer', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
if m:
    print(m.group(1))
else:
    print('None')
