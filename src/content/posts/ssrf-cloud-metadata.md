---
title: "The Interior Route: SSRF to Cloud Metadata"
published: 2026-11-13
description: "A URL preview endpoint reached the cloud metadata service and exposed the challenge's answer in its response."
category: Web
tags: [Web Security, SSRF, Cloud Security]
lang: en
---

## Summary

The URL preview service could make requests to the AWS Instance Metadata Service (IMDS) at `169.254.169.254` and returned the response body. That allowed an attacker to enumerate the instance role and read its credentials response. The challenge placed its answer in that response; credential values are not reproduced here.

## Distinguishing a real fetch from demo output

Many public, private, and loopback URLs returned the same generic “demo mode” page. That response was not evidence that the service had fetched the requested destination.

Requests to the link-local metadata address behaved differently: ordinary metadata paths returned upstream errors rather than the demo page. This was the clue to enumerate the metadata service's standard IAM security-credentials path.

## Enumerating the role

The preview endpoint returned HTTP 200 and a role name for:

```text
http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

Appending the returned role name to the path returned a JSON credentials document. The challenge answer appeared in one of its fields. The role name, credential values, and answer are omitted.

## Root cause and remediation

The application allowed user-controlled URLs to reach a link-local metadata endpoint and returned the full response body. Apply destination allowlists after DNS resolution, block link-local and private address ranges at both the application and network layers, and use IMDSv2 with tightly scoped instance roles. Return only the minimum data needed by the preview feature.
