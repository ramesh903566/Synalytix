import os
import re

DIRS = [
    '/Users/bunny/Development/Synalytix/frontend/src/features',
    '/Users/bunny/Development/Synalytix/frontend/src/components'
]

mapping = [
    # Backgrounds
    (r'bg-zinc-950', 'bg-bg-canvas'),
    (r'bg-zinc-900/[0-9]+', 'bg-bg-elevated'),
    (r'bg-zinc-900', 'bg-bg-elevated'),
    (r'bg-zinc-800/[0-9]+', 'bg-bg-sunken'),
    (r'bg-zinc-800', 'bg-bg-sunken'),
    (r'bg-zinc-700', 'bg-bg-sunken hover:bg-border'),
    (r'bg-zinc-500/[0-9]+', 'bg-bg-canvas'),
    
    (r'bg-\[\#11161D\]', 'bg-bg-elevated'),
    (r'bg-\[\#1A222C\]', 'bg-bg-sunken'),
    (r'bg-\[\#2A3441\]', 'bg-bg-sunken hover:bg-border'),
    (r'bg-\[\#0B0F14\]/[0-9]+', 'bg-bg-canvas'),
    (r'bg-\[\#0B0F14\]', 'bg-bg-canvas'),
    
    # Borders
    (r'border-zinc-800/[0-9]+', 'border-border-light'),
    (r'border-zinc-800', 'border-border'),
    (r'border-zinc-700', 'border-border-strong'),
    (r'border-\[rgba\(255,255,255,0\.06\)\]', 'border-border-light'),
    (r'border-white/20', 'border-border-strong'),
    
    # Texts
    (r'text-zinc-600', 'text-text-muted'),
    (r'text-zinc-500', 'text-text-muted'),
    (r'text-zinc-400', 'text-text-secondary'),
    (r'text-zinc-300', 'text-text-secondary'),
    (r'text-zinc-200', 'text-text-primary'),
    (r'text-zinc-100', 'text-text-primary'),
    (r'text-white', 'text-text-primary'),
    
    # Focus rings
    (r'focus-visible:ring-offset-zinc-900', 'focus-visible:ring-offset-bg-canvas'),
    (r'focus:ring-offset-zinc-900', 'focus:ring-offset-bg-canvas'),
]

for d in DIRS:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                new_content = content
                for pattern, repl in mapping:
                    new_content = re.sub(pattern, repl, new_content)
                    
                if new_content != content:
                    with open(path, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {path}")
