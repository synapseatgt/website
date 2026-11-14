# Handoff

## Removing graduating officers (April, before finals)

1. Add incoming officers to the right GitHub teams; make the incoming president and website lead **org owners**.
2. Confirm incoming owners can sign in with 2FA and see Settings.
3. Remove outgoing officers from teams and owner roles (keep them as outside collaborators for a month only if mid-task).
4. Rotate passwords on shared accounts; move recovery phone/email to incoming officers.
5. Review Pages CMS email collaborators and Google Form editors.
6. Update [ACCOUNTS.md](ACCOUNTS.md) and date it.

**Never let a graduating student be the last owner of anything.**

## Annual handoff checklist

- [ ] Two incoming org owners added, 2FA confirmed
- [ ] Outgoing officers removed from GitHub teams, CMS collaborators, form editors, registrar, password vault
- [ ] Domain expiry checked (≥ 12 months away), auto-renew on
- [ ] Each form submitted once; notification email received
- [ ] Officer profiles updated; old officers unticked as "Current officer"
- [ ] Stale content reviewed: "Active"/"Recruiting" projects confirmed; finished ones set to Completed
- [ ] Dependabot PRs merged; site builds cleanly
- [ ] ACCOUNTS.md updated and dated
- [ ] New editors pass the test below
- [ ] Handoff meeting held (30 minutes, recorded)

## New-officer test (20 minutes, no help)

Give the incoming officer only [EDITING.md](EDITING.md). Pass = all four live and correct.

1. Change the time and location of the next event.
2. Replace your own officer photo and update your position.
3. Publish a one-paragraph test newsletter with a cover image, then set it back to Draft.
4. The website lead deliberately breaks something (e.g. changes the Join link to a wrong URL); find and fix it, then show where the previous version is in GitHub history.

## Monthly 10-minute check (website lead)

Open the site on a phone; click every Join/form link; confirm the last deployment succeeded; skim upcoming events and project statuses for staleness.

## When a new technical lead takes over

- **Before the old lead leaves:** make the new lead an org owner; pair on one real change (e.g. adding a field to Events) from branch to deploy.
- **Week 1:** read README, DEVELOPMENT, DEPLOYMENT; run the site locally; merge a trivial change.
- **Week 2:** walk through ACCOUNTS.md; confirm personal access to each account; rotate shared credentials; update recovery contacts.
- **Week 3:** merge pending Dependabot PRs; run Lighthouse (mobile) on Home, Projects and an event page and note regressions.
- **Then:** remove the old lead from owner roles. Update this file with anything that was unclear.

## Launch checklist

- [ ] Institute Communications approval (in writing) for the logo lockup, the name and the domain
- [ ] All `[Sample]` entries replaced or deleted; no `[bracketed]` placeholders or `REPLACE` links left (`grep -rn "REPLACE\|\[Sample\]" src/content`)
- [ ] Real contact email and Instagram link in Site settings
- [ ] No planned project described as completed
- [ ] Every officer pictured agreed to their photo and details appearing
- [ ] Two org owners, 2FA enforced
- [ ] Forms tested end to end
- [ ] Testing targets met: Lighthouse Accessibility ≥ 95 and Performance ≥ 90 (mobile); zero broken links; reduced-motion checked
- [ ] New-officer test passed by two people
