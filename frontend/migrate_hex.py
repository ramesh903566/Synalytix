import os
import re

FILES = [
    '/Users/bunny/Development/Synalytix/frontend/src/pages/AppDetails.tsx',
    '/Users/bunny/Development/Synalytix/frontend/src/pages/analytics/ContentAnalytics.tsx'
]

mapping = [
    (r'text-\[\#1A1A1A\]', 'text-text-primary'),
    (r'bg-\[\#1A1A1A\]', 'bg-text-primary'),
    
    (r'text-\[\#666\]', 'text-text-muted'),
    (r'text-\[\#999\]', 'text-text-secondary'),
    
    (r'border-\[\#EFEFEF\]', 'border-border'),
    (r'border-\[\#F5F5F5\]', 'border-border-light'),
    
    (r'bg-\[\#F5F5F5\]', 'bg-bg-sunken'),
    
    (r'bg-white', 'bg-bg-elevated'),
    
    (r'fill=\"#1A1A1A\"', 'fill=\"var(--color-text-primary)\"'),
    (r'fill=\'#999\'', 'fill=\"var(--color-text-muted)\"'),
    (r'border:\'1px solid #EFEFEF\'', 'border:\"1px solid var(--color-border)\"'),
]

for path in FILES:
    if os.path.exists(path):
        with open(path, 'r') as f:
            content = f.read()
        
        new_content = content
        for pattern, repl in mapping:
            new_content = re.sub(pattern, repl, new_content)
            
        if new_content != content:
            with open(path, 'w') as f:
                f.write(new_content)
            print(f"Updated {path}")
        else:
            print(f"No changes in {path}")
    else:
        print(f"File not found: {path}")
