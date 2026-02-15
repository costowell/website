---
id: analogous-instructions
title: 'Analogous Instructions in x86'
date: 2025-02-12
summary: 'How two different opcodes can encode the same instruction in x86.'
layout: blog
---

I'm currently writing a compiler from scratch in a language I affectionately call `dumlang`.
Its not meant to do much, hence the name, but I want to use this project as a way to understand a few key things better.

1. _Code Generation_ - generating the necessary instructions for the CPU to execute a program written in this language
2. _Instruction Encoding_ - specifically x86's instruction encoding
3. _Object Generation_ - generating objects that a linker can use to build an executable

An assembler abstracts away instruction encoding and object generation conveniently, so I can't depend on any assembler.

In a [separate project](https://github.com/costowell/elf-fun), I learned how to generate an object file and, in the process, got to learn how to work with the [ELF File Format](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format).
From what I've seen, its semi-common to build a [JIT compiler](https://en.wikipedia.org/wiki/Just-in-time_compilation) because there is no need to write the instructions to a file.
When doing JIT compilation, you write the instructions to a piece of memory and then execute that piece of memory.

In my humble opinion, outputing a file is going to be a lot easier to debug because I can easily inspect and go step-by-step through the generated program like I would any other program.
Aside from debugging, its just more satisfying to have generated an executable.
As an analogy, what's cooler: a robot that does the stuff you tell it or a robot that builds other robots to do what you tell it?

But I digress! This article is a brief update on what I've been working on _and_ a cool fact I found out while learning about x86 instruction encoding.

Lets take an instruction that copies the value in the register `ecx` to the register `eax`.

```asm
mov eax, ecx
```

If we pretend that we're the assembler and our job is to output some bytes which will tell the CPU "copy eax to ebx", how would we do it?

## Basic Instruction Encoding

First, we start with the _opcode_. The most important part of any instruction is the _opcode_, since it dictates what kind of operation the instruction is going to do.
However, x86 has [a lot of different ways to encode the MOV instruction](https://www.felixcloutier.com/x86/mov).
These vary from the size of the operands (16bit, 32bit, etc...), if we're copying from a register to a location in memory, or even if we're copying a constant into a register.
In our case, we're trying to copy data from one register to another.
However, there are two opcodes which let us do this. What's the point in having two?
Lets take a look at how they are specified

| Opcode | Instruction      |
| ------ | ---------------- |
| `0x89` | `MOV r/m32, r32` |
| `0x8B` | `MOV r32, r/m32` |

As you can see, there are two opcodes which specify the `MOV` operation.
The first opcode has operands `r/m32` and `r32`, and the second has `r32` and `r/m32`.
What do these mean?

`r32` means a 32-bit register.

`r/m32` means a 32-bit register _OR_ a 32-bit memory location.

By this point, I'm sure you can see the trick: both can take two registers, so both can `MOV` from one register to another.
So how do we specify our operands?

This is where the MOD-REG-R/M byte comes in. Just by the name, we can tell there's a lot of separate pieces of data encoded here.
Let's take a look at the format of this byte.

![MOD-REG-R/M byte format](/images/blog/mod_reg_r_m_byte.png)
[Source](https://www.c-jump.com/CIS77/CPU/x86/lecture.html)

The `REG` field stands for **reg**ister, so it contains the bits that specify the register we're talking about.
Since this is an 3-bit field, there are 8 (2³) registers you can specify. Here's what they all map to.

| Number (decimal) | Number (binary) | Register |
| ---------------- | --------------- | -------- |
| 0                | 000             | eax      |
| 1                | 001             | ecx      |
| 2                | 010             | edx      |
| 3                | 011             | ebx      |
| 4                | 100             | esp      |
| 5                | 101             | ebp      |
| 6                | 110             | esi      |
| 7                | 111             | edi      |

The `R/M` field, you might have guessed, stands for **R**egister/**M**emory and stores either a register or memory address.

Finally, the `MOD` field stands for **mod**e and stores the addressing mode.
In combination with the R/M field, we can address memory in a variety of ways.
For the purposes of this article, all you have to know is that setting both bits in this field to 1s indicates that the `R/M` field references a register.

## Putting it all together!

As a reminder, we're trying to encode the following instruction, where `ecx`'s value gets copied into `eax`:

```asm
mov eax, ecx
```

We'll choose the following `MOV` instruction

`0x89 MOV r/m32, r32`

Since we know the opcode is `0x89`, we need to figure out what the MOD-REG-R/M byte is.

You won't be surprised to learn that the `r/m32` and `r32` field corresponds to the `R/M` and `REG` field respectively.
As we discussed earlier, the `MOD` field has two 1s when we're talking about a register in the `R/M`.
And finally, using the table above, we know that `eax` and `ecx` are numbers 000 and 001 in binary.
Okay, lets take a look!

| MOD₇ | MOD₆ | REG₅ | REG₄ | REG₃ | R/M₂ | R/M₁ | R/M₀ |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 1    | 1    | 0    | 0    | 1    | 0    | 0    | 0    |

This byte is `0b11001000` in binary which is `0xC8` in hexadecimal, so our full instruction is `89 C8`!
Don't believe me? [Check it out in a disassembler!](https://shell-storm.org/online/Online-Assembler-and-Disassembler/?opcodes=89+C8&arch=x86-64&endianness=little&baddr=0x00000000&dis_with_addr=True&dis_with_raw=True&dis_with_ins=True#disassembly) That's pretty cool!

## One more time!!!

Alright, lets speedrun this. This time our opcode is `0x8B` and its defined like so:

`MOV r32, r/m32`

For MOD-REG-R/M byte, the `MOD` field won't change, but our `REG` and `R/M` have to be flipped so that we're performing `r32 <- r/m32`.
So, here's what that looks like.

| MOD₇ | MOD₆ | REG₅ | REG₄ | REG₃ | R/M₂ | R/M₁ | R/M₀ |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 1    | 1    | 0    | 0    | 0    | 0    | 0    | 1    |

This byte is `0b11000001` in binary which is `0xC1` in hexadecimal, so our full instruction is `8B C1`!
Again, here's [the disassembled version](https://shell-storm.org/online/Online-Assembler-and-Disassembler/?opcodes=8B+C1&arch=x86-64&endianness=little&baddr=0x00000000&dis_with_addr=True&dis_with_raw=True&dis_with_ins=True#disassembly).

## Conclusion

There is really no functional difference between either of these instructions even in terms of performance.
I was curious what the GNU and NASM assemblers would default to when given this instruction and both choose `MOV r/m32, r32`.
One [stackoverflow post](https://stackoverflow.com/questions/19467610/why-does-nasm-use-0x89-when-it-assembles-a-mov-instruction-between-registers) suggests that it could be a way to identify the assembler used to build a particular program.

As homework, try to encode the same [ADD instruction](https://www.felixcloutier.com/x86/add) in two different ways.
I recommend looking at the `ADD r/m32, r32` and `ADD r32, r/m32` instructions.
You can verify your solutions by putting them in [this disassembler](https://shell-storm.org/online/Online-Assembler-and-Disassembler/).

Good luck and thanks for reading!

## Resources

- [x86 Instruction Encoding Info and Images](https://www.c-jump.com/CIS77/CPU/x86/lecture.html)
- [Disassembler](https://shell-storm.org/online/Online-Assembler-and-Disassembler/)
