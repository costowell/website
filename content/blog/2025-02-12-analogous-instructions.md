---
id: analogous-instructions
title: 'Analogous Instructions in x86'
date: 2025-02-12
summary: 'How two different opcodes can encode the same instruction in x86.'
layout: blog
---

<script>
	import BitField from '$lib/components/BitField.svelte';
</script>

I'm currently writing a compiler from scratch in a language I affectionately call `dumlang`.
Its not meant to do much, hence the name, but one of the reasons I decided to make it is to do all the codegen myself _including all instruction encoding_.
A neat thing I stumbled into while figuring all of this out is that you can sometimes write the same instructions in a couple different ways.

## The `mov` Instruction

Lets take an instruction that copies the value in the register `ecx` to the register `eax`.

```asm
mov eax, ecx ;; Essentially eax = ecx
```

If we pretend that we're the assembler and our job is to output some bytes which will tell the CPU "copy ecx to eax", how would we do it?

First, we start with the opcode — the thing that denotes what operation we're performing.

It turns out x86 has [a lot of different opcodes that mean `mov`](https://www.felixcloutier.com/x86/mov).
These vary from the size of the operands (16bit, 32bit, etc...), if we're copying from a register to a location in memory, or even if we're copying a constant into a register.
In our case, we're trying to copy data from one register to another, and it turns out there are two opcodes which let us do this.

| Opcode | Instruction        |
| ------ | ------------------ |
| `0x89` | `mov r/m32, reg32` |
| `0x8B` | `mov reg32, r/m32` |

The first opcode has operands `r/m32` and `reg32`, and the second has `reg32` and `r/m32`. `reg32` means a 32-bit register, and `r/m32` means a 32-bit register _or_ a 32-bit memory location.

By this point, I'm sure you can see the trick: both can take two registers, so both can copy from one register to another.
But why stop there? Lets encode our own!

## Instruction Structure

To keep things simple, I'm going to spare you, dear reader, the clusterfuck that x86 instructions are, and keep to just two important bytes for today.

<BitField totalBits={16} fields={[
	{ bits: [15, 8], name: "opcode" },
	{ bits: [7, 6], name: "mod", description: "addressing mode" },
	{ bits: [5, 3], name: "reg", description: "register" },
	{ bits: [2, 0], name: "r/m", description: "register or memory" },
]} />

The second byte is called the ModR/M byte, and its what will hold our parameters. So lets go through it piece by piece.

- **`mod`** holds the addressing mode. Since we're not touching memory today, this field will be set to `11` in binary to indicate the `r/m` is a register.
- **`reg`** holds a register number.
- **`r/m`** holds either a register number or more addressing mode information. Again, since we're not touching memory, this field will just hold a register number.

Here's what the register numbers are for the 8 registers we can put in this byte.

| Register | Number |
| -------- | ------ |
| `eax`    | `000`  |
| `ecx`    | `001`  |
| `edx`    | `010`  |
| `ebx`    | `011`  |
| `esp`    | `100`  |
| `ebp`    | `101`  |
| `esi`    | `110`  |
| `edi`    | `111`  |

## Okay Lets Make One

As a reminder, we're trying to encode the following instruction.

```asm
mov eax, ecx
```

Once we choose an opcode for our `mov` instruction, we have to be careful about which operands go where.
Lets start with `0x89` which is specified as follows.

```asm
mov r/m32, reg32
```

To encode our instruction correctly, `eax` must go in the `r/m` field and `ecx` must go in the `reg` field. Therefore, our full instruction looks like this.

<BitField totalBits={16} fields={[
	{ bits: [15, 8], name: "0x89", description: "opcode" },
	{ bits: [7, 6], values: [1, 1], description: "mod (register)" },
	{ bits: [5, 3], values: [0, 0, 1], description: "reg (ecx)" },
	{ bits: [2, 0], values: [0, 0, 0], description: "r/m (eax)" },
]} />

When encoded into hexadecimal we get `89 C8` which is our final instruction!
Don't believe me? [Check it out in a disassembler!](https://gchq.github.io/CyberChef/#recipe=Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=ODkgQzg&oeol=CRLF) That's pretty cool!

## Twins!

Lets try it with the other `mov` opcode, `0x8B`. This time `eax` goes in the `reg` field, and `ecx` goes in the `r/m` field.

<BitField totalBits={16} fields={[
	{ bits: [15, 8], name: "0x8B", description: "opcode" },
	{ bits: [7, 6], values: [1, 1], description: "mod (register)" },
	{ bits: [5, 3], values: [0, 0, 0], description: "reg (eax)" },
	{ bits: [2, 0], values: [0, 0, 1], description: "r/m (ecx)" },
]} />

Once again, if we encode this in hexadecimal we get `8B C1`.
And again, here's [the disassembled version](https://gchq.github.io/CyberChef/#recipe=Disassemble_x86('64','Full%20x86%20architecture',16,0,true,true)&input=OEIgQzE&oeol=CRLF).
How cool!

## Conclusion

There is really no functional difference between either of these instructions even in terms of performance.
I was curious what the GNU and NASM assemblers would default to when given this instruction and both choose `mov r/m32, reg32`.
One [stackoverflow post](https://stackoverflow.com/questions/19467610/why-does-nasm-use-0x89-when-it-assembles-a-mov-instruction-between-registers) suggests that it could be a way to identify the assembler used to build a particular program.

As homework, try to encode the same [ADD instruction](https://www.felixcloutier.com/x86/add) in two different ways.
I recommend looking at the `ADD r/m32, r32` and `ADD r32, r/m32` instructions.
You can verify your solutions by putting them in [this disassembler](https://defuse.ca/online-x86-assembler.htm).

Good luck and thanks for reading!

### Resources

- [x86 Instruction Encoding Info and Images](https://www.c-jump.com/CIS77/CPU/x86/lecture.html)
- [OSDev Wiki's Page on x86-64 Instruction Encoding](https://wiki.osdev.org/X86-64_Instruction_Encoding)
