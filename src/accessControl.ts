import { newModel, MemoryAdapter } from "casbin.js";

export const model = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);


export const adapter = new MemoryAdapter(`
p, admin, home, (list)|(create)
p, admin, home/*, (show)|(edit)|(delete)
p, user, home/*, (show)|(edit)|(delete)

p, admin, drinker, list

p, admin, my-review, list

p, admin, all-review, (list)|(create)
p, admin, all-review/*, (edit)|(show)|(delete)

p, admin, favorite-places, list

p, admin, all-places, (list)|(create)
p, admin, all-places/*, (edit)|(show)|(delete)

p, admin, all-review, (list)|(create)
p, admin, all-review/*, (edit)|(show)|(delete)


p, admin, all-users, (list)|(create)
p, admin, all-users/*, (edit)|(show)|(delete)

p, admin, all-news, (list)|(create)
p, admin, all-news/*, (edit)|(show)|(delete)

p, admin, top_institutions, (list)|(create)
p, admin, top_institutions/*, show

p, admin, profile, (list)|(create)
p, admin, profile/*, (edit)|(show)|(delete) 

p, admin, all-places, (list)|(create)
p, admin, all-places/*, (show)|(edit)|(delete)

p, user, home, (list)|(create)

p, user, top_institutions, (list)|(create)
p, user, top_institutions/*, show

p, user, profile, list
p, user, profile/*, (edit)|(show)|(delete) 

p, user, drinker, list


p, user, my-review, list
p, user, favorite-places, list
p, user, favorite-places/*, delete

`);