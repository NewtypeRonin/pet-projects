"""
Bunshou — comment-first skeleton for a Japanese sentence builder

This file intentionally contains only comments, TODOs, and simple hints
to guide your implementation step-by-step. When you're ready, you can
replace the comments with real code or ask me to help implement specific
parts interactively.

Suggested workflow for you (high level):

- 1) Start with a minimal `SentenceBuilder` that stores three strings:
    - `subject`, `order` (object), and `verb`.

- 2) Add an `assemble()` method that concatenates parts in SOV order.
    - Keep it trivial at first: just join `subject + particle`, `order + particle`, `verb`.

- 3) Particle selection (next step):
    - Add a small helper to choose particles (`は` vs `が`, `を` vs `に`, etc.)
    - For now, you can hard-code rules or use a tiny lookup table.

- 4) Verb conjugation (later):
    - Implement polite/plain forms and basic tense (present/past, negation).
    - Start with a mapping of some common verbs to their stems, then apply simple rules.

- 5) CLI + examples:
    - Add an `argparse` CLI that accepts `subject`, `order`, `verb` and optional flags
      for particles and conjugation.
    - Provide example commands in the README and test them interactively.

- 6) Tests & iterating:
    - Add a small unit test that asserts `assemble()` produces expected strings.

Hints and implementation notes:

- Keep things explicit and small while learning. Avoid metaprogramming.
- Use plain classes and functions first; later you can refactor to `@dataclass`.
- Write one test per grammar feature (particles, polite form, tense) so you can
  implement them incrementally.

Example minimal API you might implement:

class SentenceBuilder:
    def __init__(self, subject, order, verb):
        # store raw inputs
        pass

    def assemble(self, subject_particle=None, object_particle=None, conjugated_verb=None):
        # return a string like "私 は リンゴ を 食べる"
        pass

# When you're ready to run code, add a small `if __name__ == '__main__'` block
# that parses `sys.argv` or uses `argparse` and prints the assembled sentence.

Remember: tell me which small piece you want to implement first (e.g., the
basic assembler, particle selection, or verb conjugation) and we'll code it
together step-by-step.
"""
