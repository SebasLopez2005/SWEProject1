"""Transform the verified Free Exercise DB snapshot into offline metadata."""
import hashlib
import json
import pathlib
import sys

source = pathlib.Path(sys.argv[1]).read_bytes()
assert hashlib.sha256(source).hexdigest() == '5bb747e3fc658f095a60dcbf6d53c96627acdcc6ffb6fffde86f7e26995d40bf'
catalog = []
for entry in json.loads(source):
    category = entry['category']
    name = entry['name'].lower()
    timed = category in ('stretching', 'cardio') or 'plank' in name and all(x not in name for x in ('row', 'push', 'jack', 'leg lift'))
    unweighted = entry['equipment'] in ('body only', None)
    catalog.append(dict(
        id='catalog:' + entry['id'], name=entry['name'], category=category,
        equipment=entry['equipment'] or 'unknown',
        kind='time' if timed else 'reps' if unweighted else 'load',
        primary=entry['primaryMuscles'], secondary=entry['secondaryMuscles'],
        instructions=entry['instructions'],
    ))
pathlib.Path('data/catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, separators=(',', ':')) + '\n')
