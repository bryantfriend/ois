Original prompt: Rebrand Oxford from oxford.kg; replace World Languages with Russian and Kyrgyz; create at least 10 games each for grade 7 and 8 English and Math, inspired by GP_Games; make teacher lesson editing simple.

Scope: 40 prepared lessons using 10 distinct playable formats, with grade-specific content. Local teacher copies and portable JSON lesson files. No accounts or student records.
Brand source: https://oxford.kg/wp-content/uploads/2024/09/logo.png; red and indigo from official logo.
Inspiration: inspected public bryantfriend/GP_Games repository and local sorting, paraphrase relay, and team board implementations.

Implemented: school logo/colors; 40 packs with 240 items; 10 interactive formats; Russian/Kyrgyz taxonomy; shared teacher editor, paste append/replace, local saved copies and JSON import/export; game progress canvas and state hooks.
First QA pass: all 40 lessons completed. Additional QA was interrupted by an ambiguous test locator for answer 12 versus −12; fixed the locator. Refined fractional distractor formatting, unsaved-draft protection during play, and direct access to saved lessons. Full rerun in progress.
Preview: existing port 4173 belongs to a different project; Oxford now uses 4174.

Final verification: full QA completed all 40 prepared lessons (240 questions/pairs/sequences), with expected scoring and no page errors. Focused QA passed paste replacement/cancellation, custom spoken answers, saved-copy persistence, invalid imports, question validation, unsaved work protection, restart, fullscreen transitions, keyboard control, and responsive overflow checks. WebMCP registration and valid/invalid input were checked in a simulated supported document.modelContext; native in-app WebMCP was not re-tested in this revision.
Visual QA: reviewed desktop library/editor/tug/matching and mobile library/sequence screenshots. Fixed mobile canvas aspect ratio and progress text size, and retained keyboard focus through activity redraws. Game skill client ran successfully against quiz and tug previews; screenshots and text states inspected.
Remaining: curriculum review and larger banks, authored Russian/Kyrgyz content, and future shared storage. Updated files are local only; existing private deployment was not republished because this turn requested edits, not deployment. GitHub creation remains unperformed from the previous approval block.
