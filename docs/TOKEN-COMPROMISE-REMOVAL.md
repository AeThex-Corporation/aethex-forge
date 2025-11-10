Token Compromise - Immediate Remediation

If a Discord bot token was accidentally committed to the repository, follow these steps immediately.

1. Revoke the compromised token

- Go to Discord Developer Portal -> Applications -> Your App -> Bot
- Click Reset Token (Regenerate Token). Copy the new token and keep it secret.

2. Do NOT push the new token to the repository

- Store the new token in your deployment environment (Vercel, Railway, Netlify) as a secret environment variable.
- Locally, use code/discord-bot/.env only if absolutely necessary, and ensure it's listed in .gitignore.

3. Remove the leaked token from git history

- The safest way is to use git-filter-repo or BFG. Example with git-filter-repo (recommended):

  # Install git-filter-repo if not present

  pip install git-filter-repo

  # Make a backup of your repo first!

  git clone --mirror https://github.com/your-org/your-repo.git repo-mirror.git
  cd repo-mirror.git

  # Remove the file path that contained the token (example: code/discord-bot/.env)

  git filter-repo --invert-paths --path code/discord-bot/.env

  # Push the cleaned mirror back (force push!)

  git push --force --all
  git push --force --tags

- Alternative: Use BFG Repo-Cleaner (https://rtyley.github.io/bfg-repo-cleaner/)

4. Rotate any other credentials that were in the same commit

- If other secrets were exposed in the same commit, rotate them as well.

5. Confirm removal

- Check GitHub/Bitbucket/GitLab web UI to ensure the file no longer exists in history.
- Use `git log --all --grep="<sensitive snippet>"` to search for occurrences.

6. Update .gitignore

- Ensure code/discord-bot/.env is listed in code/.gitignore (already added by the team).

7. Re-deploy with secrets stored in environment variables

- Add DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID to your deployment platform secrets.
- Remove any local .env files from the working tree if present.

8. Register commands

- After deploying the new token, register the slash commands again, either via the admin HTTP endpoint or locally:

  # Using local script

  cd code/discord-bot
  npm ci
  npm run register-commands

  # Or via admin endpoint

  curl -X POST "https://<your-app>/api/discord/admin-register-commands" -H "Authorization: Bearer <DISCORD_ADMIN_REGISTER_TOKEN>"

9. Monitor

- Check Discord developer portal and bot logs for suspicious activity.
- Verify that your bot is functioning and commands are registered.

If you want, I can prepare the exact git-filter-repo commands tailored to your repo and a step-by-step checklist for the operations team. Let me know if you want me to prepare that checklist now.
