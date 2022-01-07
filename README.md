# GraphQL Experiments

## Friction Points

- No way to make an optional, non-nullable argument. Doesn't square neatly with Prisma. [[Issue]](https://github.com/graphql-nexus/nexus/issues/819)
- Sharing fields via composition [should (and does) work fine,](https://github.com/graphql-nexus/nexus/issues/907#issuecomment-846308782) but we get odd type errors with the generics. I've made [helper function kludge](src/graphql/common.ts#L8) to work around it. Should submit an issue.
- No easy way to share field definitions between input types if nullability needs to change, which is very common with create and update inputs. Could make a helper for this; [someone else has here.](https://github.com/graphql-nexus/nexus/issues/907#issuecomment-846402744)

## Further Investigation

- Input validation plugins exist, but are low-activity
  - https://github.com/prisma-korea/nexus-validation-plugin
  - https://github.com/filipstefansson/nexus-validate
