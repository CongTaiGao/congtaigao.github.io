---
title: "Between the Lines: HTTP Request Smuggling"
published: 2026-11-13
description: "A CL.TE parser mismatch let a request pass the proxy ACL and reach a restricted backend route."
category: Web
tags: [Web Security, HTTP, Request Smuggling]
image: "/assets/writeups/poctf/between-the-lines.png"
lang: en
---
## Challenge Brief

![The poCTF 2026 website and CTF visual theme.](/assets/writeups/poctf/poctf-2026-theme.png)

![The original challenge brief for Between the Lines.](/assets/writeups/poctf/between-the-lines.png)


## Summary

The reverse proxy and backend disagreed about how to find the end of an HTTP/1.1 request. The proxy used `Content-Length`, while the backend used `Transfer-Encoding: chunked`. This CL.TE mismatch let a request to an allowed route carry a second, smuggled request to an internal route.

![HTTP request smuggling flow showing a proxy and backend parsing different message boundaries.](/assets/writeups/request-smuggling.svg)

## Confirming the parser mismatch

The public service exposed `/echo`, which returned the submitted body. A direct request to `/internal/flag` was blocked by the proxy, including when the request carried the challenge's team header.

Next, a single connection sent a `POST /echo` with both `Content-Length` and `Transfer-Encoding: chunked`. The body began with the zero-length chunk terminator and then contained a second `GET /` request. The connection returned two responses: one for `/echo` and one for the second request. This confirmed that the backend parsed bytes the proxy still considered part of the outer request body.

## Reaching the internal route

Replacing the smuggled `GET /` with `GET /internal/flag` reached the backend route. The required team header had to be included in the smuggled request itself; adding it only to the outer request did not authenticate the internal request. The challenge response confirmed the route was reached. Its token and answer are omitted.

When constructing the request, `Content-Length` must equal the byte length of the entire body, including the chunk terminator and the embedded request. Recalculate it whenever the embedded request changes.

![Raw response showing the smuggled request reaching the internal route.](/assets/writeups/screenshots/request-smuggling-result.png)

## Root cause and remediation

The proxy authorized the outer request path, while the backend interpreted additional request bytes as a new request. Ensure every HTTP hop uses consistent message framing, reject requests containing conflicting `Content-Length` and `Transfer-Encoding` headers, and close connections after ambiguous framing errors.
