---
title: "No Structure Required: NoSQL Injection"
published: 2026-11-13
description: "JSON operators bypassed a document-store login and an unrestricted collection selector exposed challenge data."
category: Web
tags: [Web Security, NoSQL, Authentication]
lang: en
---

## Summary

The login handler passed JSON values directly into a document-store query. Supplying `$ne` objects instead of strings bypassed authentication. After login, a collection selector on the browse page allowed a regular account to read a collection containing the challenge record.

## Clues

The prompt said no credentials had been issued. A development note on the login page stated that the handler accepted JSON and passed the submitted fields into a query. The page also identified the backend as a schema-less document store. Together, these clues suggested testing query operators rather than ordinary username and password strings.

## Authentication bypass

Submitting the following JSON to the login route created an application session:

```json
{
  "username": {"$ne": null},
  "password": {"$ne": null}
}
```

The handler treated the objects as query operators. It returned a successful login instead of comparing the supplied values as literal strings.

## Reading the challenge record

The dashboard exposed a `col` parameter on the browse route. The default view showed notes, while changing the collection name returned data from other collections. A regular account could read the challenge record from the `secrets` collection without becoming an administrator.

The exposed account details, unrelated records, and challenge answer are omitted from this write-up.

## Root cause and remediation

The login endpoint accepted untrusted JSON objects as query expressions, and the browse endpoint let users select collections without an authorization check. Validate input types and construct database queries from fixed server-side fields. Restrict every collection to the caller's authorized data, regardless of whether access comes through a direct route or a selector parameter.
