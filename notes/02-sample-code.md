# A tiny code notebook

Code snippets are easier to revisit when they come with a little context. This note is a starter for collecting patterns, experiments, and ideas worth keeping.

## JavaScript: a small useful function

This function groups a list of items by a key. It is handy for turning a flat list into sections for a view.

```js
function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key];
    (groups[value] ??= []).push(item);
    return groups;
  }, {});
}

const notes = [
  { title: "Flexbox", topic: "Design" },
  { title: "Fetch API", topic: "Programming" },
];

console.log(groupBy(notes, "topic"));
```

## Python: a small transformation

The same idea can be expressed with a dictionary and a loop:

```python
from collections import defaultdict

def group_by(items, key):
    groups = defaultdict(list)
    for item in items:
        groups[item[key]].append(item)
    return dict(groups)
```

## Things to explore

1. What should happen when an item does not have the requested key?
2. How might this function work with immutable data?
3. Where would grouping make an interface easier to scan?
