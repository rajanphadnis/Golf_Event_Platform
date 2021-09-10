---
sidebar_position: 1
---

# Site Overview

## General Information

This is the site's hierarchy:

```
/
|
+ my-events
|   |
|   + edit (charity only)
|   |
|   + new-event (charity only)
|
+ event
|   |
|   + register
|   |
|   + refund
|
+ account
|
+ account-management
|
+ landing
|
+ onboarding
|
+ sign-in
|
+ sign-out
|
+ ethics.html
|
+ purchaseAgreement.html
|
+ terms.html
```

## Site Security

As a general rule, this site does not directly write to (or update) the database. However, there is one exception :

- Page view counter (site will increment event's [sharded counter](https://firebase.google.com/docs/firestore/solutions/counters))

The page view counter is is the only "opening" in the database's main site security, and only allows writes to shards within the page's subcollection - and only when the writes are incrementing the value of the "visits" field by one.

The rest of the database entries and creation takes place on the backend via Firebase Cloud Functions ([see backend documentation](/docs/backend/services-overview#firebase-cloud-functions)).

