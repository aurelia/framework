## Workflow releasing a new version

1. Update: pull latest master with `git pull`
2. Cut release: Run `npm run cut-release`. Example:

  ```shell
  # automatic detection based on commit
  npm run cut-release
  # manual version control
  npm run cut-release -- -- --release-as minor
  ```
3. Commit: `git add .` and then `git commit chore(release): prepare release vXXX` where `XXX` is the new version
4. Tag: `git tag -a XXX -m 'prepare release XXX'` where `XXX` is the version
5. Push to remote repo: `git push --follow-tags`
6. Publish: Run `npm publish` to release the new version
