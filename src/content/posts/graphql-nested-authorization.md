---
title: "Shape of Query: GraphQL Authorization Bypass"
published: 2026-11-13
description: "Nested GraphQL resolvers exposed a restricted account and a private field through a team relationship."
category: Web
tags: [Web Security, GraphQL, Authorization]
image: "/assets/writeups/poctf/the-shape-of-a-query.png"
lang: en
---
## Challenge Brief

![The poCTF 2026 website and CTF visual theme.](/assets/writeups/poctf/poctf-2026-theme.png)

![The original challenge brief for The Shape of a Query.](/assets/writeups/poctf/the-shape-of-a-query.png)


## Summary

The direct `user(id)` resolver restricted callers to their own account, but the `me → team → members` relationship returned other team members. The nested `privateNotes` field did not enforce its own authorization check, so the relationship exposed data that the direct lookup was meant to protect.

![GraphQL authorization flow comparing protected direct access with an unchecked nested field.](/assets/writeups/graphql-authorization.svg)

## Discovering the schema

The signed-in page linked to a GraphQL endpoint and had introspection enabled. Exploring the schema revealed:

![GraphQL schema view showing the team and member relationship.](/assets/writeups/screenshots/graphql-team-schema.png)

- `Query.user(id: ID!)` was documented as self-only.
- `User` included a sensitive `privateNotes` field.
- `Team.members` returned user objects for the caller's team.

The important question was whether authorization applied only to the root resolver or also to objects and fields reached through nested selections.

```graphql
{ __type(name: "User") { fields { name } } }
```

## Testing nested access

The following query returned the current user's team members, including an administrator account:

```graphql
{
  me {
    team {
      members { id username role }
    }
  }
}
```

Adding `privateNotes` to that nested selection returned the restricted field:

```graphql
{
  me {
    team {
      members {
        id
        username
        role
        privateNotes
      }
    }
  }
}
```

The challenge data confirmed the exposure. Account identifiers and private values are omitted here.

## Root cause and remediation

The self-only rule existed on one lookup path but was not applied consistently to nested relationships or sensitive fields. Access control should be enforced at each resolver boundary, including fields reached through nested queries. Sensitive data should not be returned merely because a parent object was reachable.
