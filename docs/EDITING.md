# Editing the website (for officers)

You don't need to know any code. You edit forms in **Pages CMS**; when you click **Save**, the site rebuilds and your change is live in a few minutes.

**Start every task here:** go to <https://app.pagescms.org> → **Sign in with GitHub** → choose **synapseatgt/website**.

> No GitHub account, or can't see the repository? Ask the website lead to add you to the `editors` team (see [ACCOUNTS.md](ACCOUNTS.md)).

> _Screenshots: add one per task below after launch (save them in `docs/images/`)._

---

## 1. Add or edit a project

1. **Projects** → **Add entry** (or click an existing project).
2. Fill in **Title**, **Summary** (max 160 characters), **Category** and **Status**.
   - **Planned** = not started. **Recruiting** = looking for members. **Active** = running. **Completed** = finished (moves to the archive; needs an **End date** and at least one **Output**).
3. Optional: upload a **Cover image** and write its **description (alt text)**.
4. Tick **Feature on home page** to show it in the home page's "What members are building" row (up to three).
5. **Save**. Live in a few minutes.

## 2. Upload an image

- In any image field: click the field → **Upload** → choose the file → write a short description in the **alt text** field below it.
- Or go to **Media → Images** and drag files in.
- Phone photos are fine (keep them under ~10 MB). The site resizes and compresses them automatically.
- **Alt text** describes the image for people who can't see it: "Three members soldering an EEG board at a workbench", not "photo".

## 3. Publish a newsletter

1. **Publications** → **Add entry** → **Type: Newsletter**.
2. Title, date, summary, cover image (+ alt text).
3. Write or paste the body. Headings, lists, links and images all work.
4. Optional: attach the **PDF version** (under ~10 MB).
5. Untick **Draft** → **Save**. (New publications start as drafts so nothing goes live by accident.)

## 4. Add an event

1. **Events** → **Add entry**.
2. Title, **Starts** (date and time, Atlanta time), **Ends**, location, category, short description, registration link if any.
3. Optional **Long description**: if you write one, the event gets its own page.
4. **Save**. It shows under "Upcoming" and moves to "Past" automatically after it ends.

## 5. Update executive board profiles

- **Officers** → click a person to edit, or **Add entry** for a new officer.
- Set **Term** (e.g. `2027–28`) and **Display order** (1 = shown first).
- When someone leaves the board, untick **Current officer**. They move to "Past boards" on the About page. Don't delete them.

## 6. Change a membership or registration link

- **Site settings** → **Join / interest form link** → paste the new link → **Save**. Every "interest form" link on the site updates.
- Other contact forms are in **Site settings → Contact forms**.
- Turn the recruiting banner on or off with **Recruiting now**.

## 7. Recover from an accidental edit

- **Easiest:** open the entry again and fix it.
- **Restore an older version:** on GitHub, open the repository → find the file (e.g. `src/content/events/2026-11-20-general-body-meeting.md`) → **History** → open the older version → copy the text back via Pages CMS.
- **Deleted something, or a bigger mess?** Message the website lead. Every save is in GitHub's history, so nothing is ever truly lost.

---

## Good habits

- Keep summaries short; they appear on cards.
- Never describe a planned project as finished. Use the right **Status**.
- Only put a person's photo or details on the site if they agreed.
- If your change doesn't appear after 10 minutes, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).
