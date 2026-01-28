#!/usr/bin/env python3
"""Script to remove old modal code from Bookings.jsx"""

file_path = r"d:\temp\HBS\frontend\src\pages\Bookings.jsx"

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Keep lines 0-510 and lines 647 onwards (0-indexed, so 511-647 in 1-indexed)
new_lines = lines[:510] + lines[647:]

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Removed lines 511-647 from {file_path}")
print(f"Old line count: {len(lines)}")
print(f"New line count: {len(new_lines)}")
print(f"Lines removed: {len(lines) - len(new_lines)}")
