# FireAlerts

## Sync

#### Data structure

The per-user data structure stored in the twilio sync items has 
the following form:

```ecmascript 6
{
  name : 'string'
  authorized : 'string'
  muted : boolean
  group_muted : boolean
}
```

A sync item is keyed by the user's phone number which must include the
country code. Ie. `+15204401234`.

#### Values

Label | Description
------|-------------
name | The user's name. Set during the `add` operation. `name` is not guaranteed to be unique.
authorized | Either `self` or `admin`. `self` is a normal user.
muted | `false` by default. `true` indicates the user's messages to the group will be silently droped.
group_muted | `true` indicates the user has paused recieving messages from the group. Default is `false`.

