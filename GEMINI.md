# Project Rules & Customizations

## Grill Me (Project Test — Antigravity Edition)
This workspace includes the customized **grill-me-project-test** skill located at:
- `.agent/skills/grill-me-project-test/SKILL.md`
- `.agents/skills/grill-me-project-test/SKILL.md`

### Trigger Conditions
When the user mentions "grill me", "grill-me Project test", "savol-javob qil", "meni savolga tut", "rejani sinovdan o'tkaz", asks to stress-test a plan/design, or starts a brainstorm/discovery session:
1. **Activate the skill**: Strictly follow the Antigravity-adapted **grill-me-project-test** workflow.
2. **Setup before Q1**: 
   - Determine today's date from system metadata.
   - Immediately create `brainstorms/{YYYY-MM-DD}-{topic-slug}.md` using `write_to_file` with title, date, goal, and an empty "Open flags" section.
   - Notify the user with a single line containing a clickable link `[capture-file](file:///path/to/capture-file.md)`, then ask Question 1.
3. **Non-negotiable disk checkpoint rule**: 
   - After **every single user answer**, immediately append/update the capture file on disk using `write_to_file` or `replace_file_content` *before* asking the next question.
   - Never batch writes.
4. **Interview style (Antigravity native)**: 
   - Ask one question at a time, always providing your recommended answer so the user can easily confirm, modify, or redirect.
   - Use Antigravity UI interactive questions (`ask_question`) when presenting structured multi-choice options.
   - Render Mermaid diagrams (`flowchart TD`, `sequenceDiagram`) directly in the capture file for architecture, flows, or decision trees.
