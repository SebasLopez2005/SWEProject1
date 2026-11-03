#!/usr/bin/env python3
"""Check archive integrity, story coverage, diagram mirrors and current doc links.

Mermaid syntax/render checks are separate: npm run diagrams:render.
"""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DESIGN = ROOT / 'docs/part2/design'


def guide_text(index):
    text = '''# Fitness & Workout Log - Mermaid design guide

**Draft v1, November 2, 2026.** Selected scope: Claude gym final, all 31 FW stories.
Proposed stack: Expo / React Native, local SQLite and Supabase. Intended iOS
distribution: TestFlight. This is design, not generated implementation evidence.

Review [scope](SCOPE.md), [contracts](CONTRACTS.md) and
[story coverage](TRACEABILITY.md) alongside these diagrams.

## Reading order

Start with context and architecture, then navigation/data, the five class-model
sheets and the story sequences. The two supporting sequences explain account
bootstrap and conflict resolution. Class sheets form one modular class model;
repeated names mean the same logical type. Every diagram has a description and
justification below. There are 42 Mermaid sources: 4 top-level, 5 class sheets,
31 story sequences and 2 supporting sequences.

The `.mmd` sources are authoritative. Run `python3 scripts/check_design.py --sync`
after editing them to update the mirrored Mermaid blocks below, then render.
GitHub can preview these blocks. Local SVG output is generated under `rendered/`
and ignored by Git; retain source/PR history as assignment evidence.

## Review before generation

- Confirm that all 31 stories match the selected Claude final.
- Review conflict handling, Monday weeks, offline account access and archive rules.
- Review screen flow and large-text behavior with both teammates.
- Confirm Apple Developer access and the instructor's acceptance of TestFlight.
- Merge the initial diagram PR before invoking either coding model.

No generation has run and no PR/deployment link has been fabricated. See the
[report](../REPORT.md) and [experiment protocol](../experiments/README.md).

## Diagram contents

'''
    for path, (title, _, _) in index.items():
        text += f'- [{title}](diagrams/{path})\n'
    for path, (title, description, why) in index.items():
        source = (DESIGN / 'diagrams' / path).read_text().strip()
        text += (f'\n## {title}\n\n{description}\n\n'
                 f'**Design value:** {why}\n\n'
                 f'[Edit Mermaid source](diagrams/{path})\n\n'
                 f'```mermaid\n{source}\n```\n')
    return text


def main():
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sync', action='store_true', help='Update guide from sources')
    args = parser.parse_args()
    errors = []
    index = json.loads((DESIGN / 'diagram-index.json').read_text())
    expected_guide = guide_text(index)
    guide = DESIGN / 'README.md'
    if args.sync:
        guide.write_text(expected_guide)
    if not guide.exists() or guide.read_text() != expected_guide:
        errors.append('Diagram guide is stale; run scripts/check_design.py --sync')

    manifest = json.loads((ROOT / 'docs/part1/ARCHIVE_MANIFEST.json').read_text())
    for item in manifest:
        path = ROOT / item['current']
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != item['sha256']:
            errors.append(f'Archived file missing or changed: {path}')

    stories = json.loads((DESIGN / 'stories.json').read_text())
    ids = [s['id'] for s in stories]
    expected_ids = [f'FW-{i:02d}' for i in range(1, 32)]
    if ids != expected_ids or sum(s['points'] for s in stories) != 101:
        errors.append('Selected Claude story IDs/initial point total disagree')
    actual = {str(p.relative_to(DESIGN / 'diagrams')) for p in (DESIGN / 'diagrams').rglob('*.mmd')}
    if actual != set(index):
        errors.append(f'Diagram index mismatch: {actual ^ set(index)}')
    if len(actual) != 42:
        errors.append(f'Expected 42 diagrams, found {len(actual)}')
    class_text = '\n'.join(p.read_text() for p in (DESIGN / 'diagrams/classes').glob('*.mmd'))
    known_classes = set(re.findall(r'^\s*class\s+(\w+)', class_text, re.M))
    coverage = (DESIGN / 'TRACEABILITY.md').read_text()
    for story in stories:
        source = (DESIGN / story['sequence']).read_text()
        if f"title {story['id']}:" not in source or story['id'] not in coverage:
            errors.append(f"Missing sequence/coverage: {story['id']}")
        for alias in re.findall(r'^\s*participant\s+\w+\s+as\s+(.+)$', source, re.M):
            for name in alias.split(' / '):
                if name not in known_classes:
                    errors.append(f"{story['id']} participant absent from class model: {name}")

    # Historical fenced prompt text is deliberately excluded from link checking.
    current_docs = [ROOT / 'README.md', ROOT / 'apps/README.md']
    current_docs += list((ROOT / 'docs/part2').rglob('*.md'))
    for doc in current_docs:
        text = re.sub(r'```.*?```', '', doc.read_text(), flags=re.S)
        for link in re.findall(r'\]\(([^)]+)\)', text):
            if '://' in link or link.startswith('#'):
                continue
            if not (doc.parent / link.split('#')[0]).exists():
                errors.append(f'Broken current link in {doc.relative_to(ROOT)}: {link}')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(manifest)} archived files unchanged; 31 stories / 101 points; '
          f'{len(actual)} indexed diagrams; participants, mirrors and current links agree.')
    print('This checks design structure, not Mermaid syntax or app behavior. Render diagrams separately.')


if __name__ == '__main__':
    main()
