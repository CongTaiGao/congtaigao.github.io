---
title: A First Look at Windows Executables
published: 2026-11-22
description: Read PE headers, sections, and imports before opening a debugger.
category: Reverse Engineering
tags: [Windows, PE]
lang: en
---

Start with a small program you compiled yourself. Open the executable in a PE viewer and look at its machine field, entry point, and preferred image base.

## Read sections and imports together

The section table shows how file contents map into memory. The `.text` section usually contains executable code and `.rdata` often contains read-only data. The section flags show how each region is marked.

The import table lists libraries and functions linked into the program. Use a function name to find its callers, then inspect their arguments before drawing conclusions about behavior.

## Compare two builds

Add one source change, such as a call that prints a string. Recompile with the same settings and compare headers, imports, and strings. Keeping the build settings fixed helps you trace differences back to the source change.
