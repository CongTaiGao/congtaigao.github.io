---
title: Reading File Signatures
published: 2026-11-22
description: Recognize common file formats from their first few bytes.
category: Forensics
tags: [File Formats, Python]
lang: en
---

A filename extension tells you how a file was named. A signature is a pattern at a known offset in the file itself. For a file with an unexpected extension, the signature is a useful first clue.

## Read the opening bytes

This example reads the first eight bytes of a local PNG.

```python
from pathlib import Path

with Path("sample.png").open("rb") as image:
    header = image.read(8)
print(header.hex(" "))
```

A PNG begins with `89 50 4e 47 0d 0a 1a 0a`. JPEG files start with `ff d8`, while ZIP files commonly begin with `50 4b 03 04`. Several ZIP-based document formats share that opening pattern.

## Confirm the format

Verify the file with a parser that understands the candidate format. A PNG reader can check whether the expected chunks occur in a valid order. Record the file hash, the offset examined, the bytes observed, and the parser result so another reader can repeat the check.
