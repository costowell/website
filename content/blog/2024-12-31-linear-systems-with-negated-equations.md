---
id: linear-systems-with-negated-equations
title: 'Linear Systems with Negated Equations'
summary: 'Using matrices and set theory to prove consistency of equations with inequalities.'
published: 2024-12-31T00:00:00-05:00
revised: 2024-12-31T00:00:00-05:00
layout: blog
---

Recently, I did what few CS majors ever do at RIT and checked out two books from the library:
_<a href="https://archive.org/details/settheoryabstrac0000blyt" target="_blank">Set theory and abstract algebra</a>_ by Thomas Scott Blyth
and
_<a href="https://link.springer.com/book/9780387908922" target="_blank">Topology</a>_ by Klaus Jänich.
I had wanted, and still want to, understand the mathematics of topology,
but after reading the first chapter, I realized that I needed to brush up on my set theory before I continued.
So, I went through the first chapter in _Set theory and abstract algebra_, and
wondered if I could write a simple theorem prover to do these exercises for me.
I had read about SMT solvers in a paper a friend recommended,
but my experience with automated proof ended there. Needless to say, I did not expect to make any breakthroughs,
but I was still optimistic I could come up with something vaguely interesting.

However, this article isn't about the theorem proving, its about the interesting problem of equation consistency.

## Framing the Problem

I wrote a tiny programming language to express boolean equations like

- `A & B` means "A and B"
- `(A | !B) -> C` means "if A or not B then C"

Each of these variables is a boolean value and my program would find the values which made the whole statement true.
This is commonly known as a [SAT Solver](https://en.wikipedia.org/wiki/SAT_solver).

The next thing I wanted to do was replace these boolean variables with _equations_.
This adds an interesting problem because there can be a boolean solution which contradicts itself.

For example, if we had the expression `A & B`, the only solution is when `A` and `B` are both true.
However, if we changed the expression to be `(x = 1) & (x = 2)`, both `x = 1` and `x = 2` has to be true to satisfy the boolean expression,
but they obviously can't be true at the same time.
Since the only possible solution gives a contradiction, there are no possible solutions for the expression and is therefore _unsatisfiable_.

So what if we have 10, 1000, or 1058515 equations? How do we prove they're all consistent?
Thankfully, I had just about wrapped up a semester of Linear Algebra so the first thought that came to my mind was **put it in a matrix!**
For those unfamiliar, a matrix can represent a **system of equations**.
By manipulating the rows, we can find what values each variable can have that satisfies all the equations.
Usually when manipulating the rows, we want it to be in Reduced Row Echelon Form.
This is putting the system in its most simple form so that redundant equations get removed and we can see simpler relationships between the variables.

But one critical constraint makes this much more interesting: negated equations.
Negated equations are equations that say something _is not equal_ to something.
If our expression was `!A & B` then the only solution is when `A` is false and `B` is true.
By using the same equations our expression will be `(x != 1) & (x = 2)`.
Of course, this expression is trivially true.
The problem is that we can't put negated equations in a matrix, so for more complicated expressions and equations, how do we ensure that there are no contradictions?

We need to develop process that takes these negated equations into account.

## Attempt 1: The first of many

I initially started with the following process.

1. Put all positive (normal) equations in a matrix
2. Solve for the Reduced Row Echelon Form (RREF)
   - If there is a contradiction, system is inconsistent
3. Build equivalence classes from the RREF matrix
4. Generate all equivalent variants of a negated equation until it's left-hand side (LHS) equals it's right-hand side (RHS)
   - If one is found, system is inconsistent because LHS should never equal RHS in a negated equation
   - If one isn't found, system is consistent

### Example

Lets use this to prove the following system is inconsistent.

$a = b$, $b = c$, $a \ne c$

**Step 1 & 2: Turn Into Matrix and Solve RREF**

The columns before the bar corespond to variables and the column following the bar is what the variables sum to.

So, since our system of positive equations can be rephrased to look like this

$a - b = 0$, $b - c = 0$

Then all we do is take the coefficients of these variables and plug them into the matrix.

$$
\begin{aligned}

& 1a + -1b + 0c = 0 \\
& 0a + 1b + -1c = 0 \\
\\

\underrightarrow{\text{ Matrix }}
&
\begin{bmatrix}
1 & -1 &  0 & \bigm| & 0\\
0 &  1 & -1 & \bigm| & 0\\
\end{bmatrix}
\\
\\

\underrightarrow{\text{ RREF }}
&
\begin{bmatrix}
1 & 0 & -1 & \bigm| & 0\\
0 & 1 & -1 & \bigm| & 0\\
\end{bmatrix}
\\
\\

\end{aligned}
$$

**Step 3: Build equivalence classes**

The first row in our RREF matrix says $a - c = 0$ which means $a = c$.
Since there are no equivalence classes that contain $a$ or $c$ yet, we create a new one.

$C_1 = \{ a, c \}$

The second row in our RREF matrix says $b - c = 0$ which means $b = c$.
Since $c$ already exists in an equivalence class, $b$ is added to it.

$C_1 = \{ a, c, b \}$

**Step 4: Try to make a negated equation contradict**

Suppose $a \ne c$ is true.
According to our equivalence classes, a valid equivalent expression is $c \ne c$ because $a = c$.
This is an obvious contradiction, therefore proving that the system is inconsistent! Hooray!

### So what's wrong?

This seems like a good way of going about it, but equivalence classes sometimes don't make important connections and are also just plain inefficient when checking if an equation is equivalent to another.

### Counterexample

Lets show where this method falls short. The following system is inconsistent, but our current process says it is consistent.

$a + c = 1$, $b + c = 1$, $a \ne b$

**Step 1 & 2: Turn Into Matrix and Solve RREF**

$$
\begin{bmatrix}
  1 & 0 & 1 & \bigm| & 1\\
  0 & 1 & 1 & \bigm| & 1\\
\end{bmatrix}
$$

(The matrix is already in RREF)

**Step 3: Build equivalence classes**

The matrix never changed so the rows will represent the exact same equations.
Since there are no preexisting equivalence classes, we create a new one.

$C_1 = \{ a + c, 1 \}$

Since $1$ already exists in an equivalence class, $b + c$ Is added to it like so.

$C_1 = \{ a + c, 1, b + c \}$

**Step 4: Try to make a negated equation contradict**

In our negated equation, $a \ne b$, neither $a$ nor $b$ exist in an equivalence class.
Therefore, according to this method, a is not equal to b.

### But what about...

**No!** I realize that we could have gotten $a = 1 - c$ and $b = 1 - c$ which would have our equivalence classes line up.

**However**, equation comparison and equivalence class generation seem like a lot of guess work that is computationally expensive.
Also, equivalence classes seemed to substitute the function of a matrix, so I decided to pivot towards using matrices more.

## Attempt 2: Close, but no cigar

My approach the second time around was to use the matrix to do a proof by contradiction.

1. Put all positive equations in a matrix
2. Solve for the Reduced Row Echelon Form (RREF)
   - If there is a contradiction, system is inconsistent
3. Add the inverse of a negated equation to the system
4. Solve for the RREF
   - If there is a contradiction...
     - The inverse of the negated equation (i.e. $a = b$) is inconsistent, which means the negated equation (i.e. $a \ne b$) is consistent
     - Compare the next negated equation to the positive system
     - If all negated equations are consistent, then the whole system is consistent
   - If there isn't a contradiction...
     - The inverse of the negated equation is consistent, which means the negated equation is inconsistent
     - Since one equation is inconsistent, the whole system is inconsistent

### Example

Let's take a quick look at how this would work.
Here is the same system from before that broke the previous method:

$a + c = 1$, $b + c = 1$, $a \ne b$

**Step 1 & 2: Turn Into Matrix and Solve RREF**

$$
\begin{bmatrix}
1 & 0 & 1 & \bigm| & 1\\
0 & 1 & 1 & \bigm| & 1\\
\end{bmatrix}
$$

(The matrix is already in RREF)

**Step 3 & 4: Add inverse of a negated equation to the system**

Our only negated equation is $a \ne b$ and its inverse is $a = b$, making our matrix and it's RREF look like this.

$$
\begin{equation}
\begin{bmatrix}
1 &  0 & 1 & \bigm| & 1\\
0 &  1 & 1 & \bigm| & 1\\
1 & -1 & 0 & \bigm| & 0\\
\end{bmatrix}

\underrightarrow{\text{ RREF }}

\begin{bmatrix}
1 & 0 & 1 & \bigm| & 1\\
0 & 1 & 1 & \bigm| & 1\\
0 & 0 & 0 & \bigm| & 0\\
\end{bmatrix}
\end{equation}
$$

Clearly, the inverse of our negated equation is consistent which means the system is inconsistent because the negated equation is inconsistent!
This is exactly what we expect! Sadly, as the title of this section indicates, we're not quite there (but we're getting pretty close!).

### Counterexample

The culprit lies in the logic determining if a negated equation is consistent.
Suppose we want to check the consistency of a negated equation for variables which have _nothing_ to do with the system?
For example:

$a = 1$, $c \ne 3$

$c = 3$ is obviously consistent with $a = 1$. By the logic above, $c \ne 3$ is inconsistent. But nothing is said about $c$ by $a = 1$, so $c \ne 3$ is totally plausible!
This principle happens to extend to any negated equation which talks about more variables than is in the system of positive equations.
More specifically, the variables in a negated equation **must be a subset** of the variables in the system to potentially contradict, otherwise it's always consistent.

That was pretty general and probably hard to follow so here's an example.
Given the equation $a = b$, the negated equation $c \ne a + b$ is consistent with $a = b$ because $c$ could be anything.
If $a = 10$ then all it would be saying is $c \ne 10 + 10$ which doesn't contradict anything.
Additionally, the inverse, $c = 10 + 10$, is also consistent with $a = b$.

Clearly, both an equation and its inverse can be consistent with the same system. My first solution to this was to discard these negated equations that are always consistent, but then another counterexample came to mind (lucky me)!

$a = b$, $b \ne 1$

We can't completely discard $b \ne 1$ by the rule stated above, however we run into the same problem as before.
$b = 1$ is consistent with $a = b$, so by the logic we established above, $b \ne 1$ is inconsistent. But $b$ could totally not equal 1!

We're inching closer, but this solution is also wrong.

## Attempt 3: Third Time's the Charm

After having iterated on this idea for awhile, I began noticing _how_ the matrix changed when checking the consistency of a negated equation with the above method.

I started to see some kind of correlation between the resulting matrix's rank (# of non-zero rows), but I wasn't satisfied with just a naive observation.
To prove my observation, I decided to go with the very thing that started this journey: set theory!

### Equation Sets and a Set Theory Refresher

I first started with the idea that equations can be modeled as a **set of points** which I'll be referring to as **equation sets**.
For example, $x = y$ could be described by a set of points that look like $(1,1)$, $(-17,-17)$, $(5919, 5919)$, etc., in the form $(x, y)$.

With this idea, we can say the **intersection of two equation sets** is the solution to the system of the two corresponding equations.
For example, consider the following equations where $A$ and $B$ are equation sets.

$A\colon x = y$, $B\colon y = 1$

$B$ has points like $(1, 1)$, $(-12, 1)$, $(24, 1)$. So long as the second element is $1$, its in $B$.

$A \cap B$ (read as "A intersect B"), is a set just containing the point $(1, 1)$ since that is the only point both sets have in common.
This $(1, 1)$ represents the solution to the system of these equations.

If the intersection of two equation sets is nothing, then there is no solution! Keep this in mind for later.

So, how do we describe a negated equation? To get a **negated equation set**, you take the **complement of an equation set**.
For the uninitiated, the complement of a set is **everything not in the set**.
If everything in an equation set is a valid solution to the equation, then everything not in the set is an invalid solution.
By switching a statement from equals to not equals, you're basically saying "all valid solutions are now invalid and all invalid solutions are now valid".
Combining these two ideas, we get the following.

If $A$ and $B$ are equations sets described by $x = y$ and $x \ne y$ respectively, then $A = B^\complement$ and $A^\complement = B$.

### The Revelation

What we want to know is: what does $A \cap B$ equal if $B$ is a negated equation?
We need to create an equation which relates $A \cap B$ to $A \cap B^\complement$ since we can only solve systems of normal/positive equations in a matrix.

I started with the following equation.
If it doesn't make much sense, don't worry, just understand that it is universally true.

$A - (A \cap B^\complement) = A \cap B$

On its own, this equation isn't very interesting, but when $A \cap B$ is nothing (aka A and B contradict)...

$A - (A \cap B^\complement) = \emptyset$

$A = A \cap B^\complement$

we get this glorious, beautiful equation, revealing the final building block for our proof.

_It is at this point that I must pause and encourage you, the reader, to understand the significance before I give it away._
_However, if you're just here for a good time, then by all means, read on._

#### What does it mean?

This proves that if we add the inverse of a negated equation to the system and the system remains _unchanged_ ($A = A \cap B^\complement$)
then the negated equation is **inconsistent with the system** ($A \cap B = \emptyset$).

### Lets show that counterexample who's boss!

$P\colon a = b$, $Q\colon a \ne 1$

To prove these are inconsistent, we must prove that the system doesn't change when adding $a = 1$ to the system.

$$
\begin{aligned}
&
\begin{bmatrix}
1 & -1 & \bigm| & 0 \\
\end{bmatrix}
\\\\

\underrightarrow{\text{ Add } a = 1 \ }
&
\begin{bmatrix}
1 & -1 & \bigm| & 0 \\
1 &  0 & \bigm| & 1 \\
\end{bmatrix}
\\\\

\underrightarrow{\text{ RREF }}
&
\begin{bmatrix}
1 &  0 & \bigm| & 1 \\
0 &  1 & \bigm| & 1 \\
\end{bmatrix}
\end{aligned}
$$

The starting and ending matrix are certainly different, so $P \ne P \cap Q^\complement$ which means $P \cap Q$ **cannot be** empty.
This means that a solution to the system still exists which means the equations are consistent!

### What about multiple negated equations?

It's actually pretty easy to show this, we just need to
<a href="https://c.tenor.com/mgdCIbwyj1MAAAAC/benson-regular-show.gif" target="_blank">break it down a bit</a>.

If $B$ and $C$ are negated equations and $A$ is a regular equation then we want to find if $A \cap B \cap C$ is empty or not to prove it's consistency.

Luckily, there's a simple equivalence.

$$
\begin{aligned}
A \cap B \cap C & = A \cap (B \cap C) & [\ \text{wrap parenthesis}\ ] \\
                & = (A \cap B) \cap (A \cap C) & [\ \text{distribute} \cap \ ] &&
\end{aligned}
$$

We can see that if $A \cap B$ or $A \cap C$ are empty then $A \cap B \cap C$ has to be empty too because the intersection of anything with an empty set is the empty set.

### To bring it all together!

The final process is as follows.

1. Put all positive equations in a matrix
2. Solve for the Reduced Row Echelon Form (RREF)
   - If there is a contradiction, system is inconsistent
3. Add the inverse of a negated equation to the system
4. Solve for the RREF
   - If the system remains unchanged...
     - The negated equation **must** be inconsistent with the system
     - One equation is inconsistent with the system, therefore the whole system is inconsistent!
   - If the system changes...
     - The negated equation might remove _some possible_ solutions to the system, but did not remove all of them, therefore its consistent!
     - Repeat steps 3 and 4 until all negated equations are verified as consistent

## Conclusion

And there you have it!
I cannot express how much fun this was to solve! This whole thing started because of a book on set theory and ended with a satisfying solution thanks to sets!
I couldn't be happier.

I have already implemented the solution in a
<a href="https://github.com/costowell/theorem-prover/blob/66ff939b56c3af85015bf1f98305f401dc8bdd15/src/bin/eqncmp.rs" target="_blank">standalone program</a>,
but intend to integrate it all into my theorem prover soon.

Thank you for reading, I hope you enjoyed and maybe learned something!
