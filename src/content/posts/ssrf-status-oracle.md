---
title: "The Logic Inside: SSRF and a Status Oracle"
published: 2026-11-13
description: "An alternate IPv4 representation bypassed a hostname filter and exposed an internal status oracle."
category: Web
tags: [Web Security, SSRF, Input Validation]
lang: en
---

## Summary

The URL preview service blocked familiar loopback names, but did not normalize alternate IPv4 representations before applying its hostname policy. The HTTP client interpreted the integer form of loopback as `127.0.0.1` and reached an internal service. The preview API returned upstream status codes, which acted as an oracle for that service.

![SSRF status oracle flow showing address normalization bypass and observable upstream status.](/assets/writeups/ssrf-status-oracle.svg)

## Finding the oracle

The preview endpoint accepted a URL and performed a HEAD-style fetch. It hid the upstream response body but returned the upstream status. The challenge described a local service on port `9001` with an endpoint that returned different statuses depending on whether a supplied guess matched the beginning of a team-specific value.

Ordinary loopback forms such as `127.0.0.1` and `localhost` were rejected. However, the unsigned integer representation of `127.0.0.1` is `2130706433`.

## Bypassing the hostname check

Sending the preview service to `http://2130706433:9001/` produced an upstream success response. This showed that the policy checked the text form of the hostname while the HTTP client later canonicalized it to loopback.

The same route could reach the internal check endpoint. A correct prefix produced HTTP 200, an incorrect prefix produced HTTP 404, and an empty guess produced HTTP 400. Trying hexadecimal characters one position at a time allowed the challenge value to be reconstructed from status codes alone.

The recovered value is not included here.

## Root cause and remediation

The service validated a hostname string without resolving and normalizing the final destination. It also exposed internal response status as an oracle. Resolve hostnames before connecting, reject loopback, private, link-local, and otherwise disallowed address ranges after resolution, re-check redirects, and avoid returning detailed upstream responses to callers.
