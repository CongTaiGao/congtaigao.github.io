---
title: "The Poisoned Well: Web Cache Poisoning"
published: 2026-11-08
description: "A cache key that ignored a request header let an attacker poison canonical metadata for later visitors."
category: Web
tags: [Web Security, Cache Poisoning, HTTP]
lang: en
---

## Summary

The reverse proxy cached responses by request path and session cookie, but omitted `X-Forwarded-Host` from its cache key. The application still used that header when creating the page's canonical URL. A request could therefore place attacker-controlled canonical metadata in a shared cache entry.

![Cache poisoning flow: an unkeyed header changes shared cached metadata.](/assets/writeups/cache-poisoning.svg)

## Investigation

The landing page described a recently changed cache configuration and advised readers to follow canonical metadata when opening reply threads. The application also exposed a cache reset route and a verifier route, which made it possible to compare a cold cache with the result after a request.

After signing in with a current challenge session, the verifier showed the expected cold-cache state. A normal request to the home page returned a canonical URL for the challenge host. This established a baseline before testing how forwarded host information affected the response.

![Challenge home page showing the cache and canonical URL clues.](/assets/writeups/screenshots/cache-context.png)

## Reproduction

Use a fresh challenge session and reset the cache before each attempt. Keep the session cookie in a local environment variable; never paste its value into a public write-up.

```sh
BASE='https://poisoned-well.pointeroverflowctf.com'

curl -sS -H "Cookie: session=$SESSION_COOKIE" "$BASE/reset"
curl -i -H "Cookie: session=$SESSION_COOKIE" \
  -H 'X-Forwarded-Host: attacker.example' "$BASE/"
curl -i -H "Cookie: session=$SESSION_COOKIE" "$BASE/"
curl -sS -H "Cookie: session=$SESSION_COOKIE" "$BASE/verify"
```

The first home-page response used `attacker.example` in its canonical URL. A second request without the forwarded-host header received the same cached canonical value. The verifier then confirmed that the cache stored the altered host.

## Root cause

The cache and application disagreed about which request fields affected the response. The proxy treated two requests as equivalent because their path and session cookie matched; the application did not, because it also read `X-Forwarded-Host`.

Cache keys should include every trusted input that can change a response. Applications should also accept forwarded-host headers only from a trusted proxy and should validate the resulting host against an allowlist.
