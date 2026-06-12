+++
title = "ON KEEPING A SERVER HONEST"
date = 2026-06-09

[extra]
volume = "VOL. I"
dispatch = "DISPATCH 06"
read_min = 11
summary = "Notes from a long night with a stubborn box, three cups of coffee, and a healthier respect for systemd timers than I had at sundown."
+++

There is a particular kind of quiet that only arrives at 2 a.m., when the
deploy has gone sideways and the only honest thing left in the room is the
server. It does not lie. It does exactly what you told it to, which is the
whole problem.

## The box does not negotiate

I had spent the evening convinced the fault was mine — a typo, a stray
environment variable, a forgotten reload. It was none of those. It was a
timer that fired thirty seconds too early, every time, with the patience of
a thing that has nowhere else to be.

> A server kept honest is a server you can sleep next to.

The fix was four lines. The lesson was longer: log the boring things, and
keep the boring things boring. A machine that surprises you is a machine
that has been allowed to.

## What I changed

- Pinned the timer to a real clock, not an uptime-relative drift.
- Wrote down the assumption I had been carrying in my head.
- Went to bed.

Come morning the graphs were flat, which is the highest praise a graph can
offer.
