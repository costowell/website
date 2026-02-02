---
layout: project
title: RAID Fun
subtitle: What the fuck is a Galois Field
github: https://github.com/costowell/raid-fun
---

One of my co-workers was explaining how RAID 5 computes its parity drive - just XOR ($\oplus$) all the drives together.
In equation form, this is $D_1 \oplus D_2 \oplus D_3 \oplus ... \oplus D_n = P$. With some simple algebra, you can reorder the equation so that $D_i = ...$ which means if $D_i$ died, as long as you have every other drive (including the parity drive!) you can recalculate what its data was.
This is how RAID 5 lets us lose a single drive before we permanently lose data, otherwise known as the fault tolerance.
RAID 6 promises two drives of fault tolerance by making use of two parity drives - this is where it gets interesting.
We need this additional parity drive because you can't solve the equation if you're missing two variables.
It's like trying to solve $x + y = 1$. There are infinitely many solutions.
Moreover, we can't compute this new parity drive the same way because we'd have two parity drives with the exact same problem.
So how does RAID 6 do it? [Galois fields](https://en.wikipedia.org/wiki/Finite_field).
I found this [wonderful paper](https://www.kernel.org/pub/linux/kernel/people/hpa/raid6.pdf) by the person who implemented this in the Linux kernel and decided that I'd get my hands dirty, learn the math, and implement a simulation myself.
