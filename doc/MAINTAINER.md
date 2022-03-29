## Workflow releasing a new version

1. Update: pull latest master with `git pull`
2. Cut release: Run `npm run cut-release -- --bump {version-type}`. Example:

  ```shell
  # with minor
  npm run cut-release -- --bump minor
  ```
3. Commit: `git add .` and then `git commit chore(release): prepare release vXXX`
4. Tag: `git tag`
5. Push to remote repo: `git push`
6. Publish: Run `npm publish` to release the new version
