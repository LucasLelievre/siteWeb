const merge = (left = {}, right = {}) =>
    Object.entries(right)
        .reduce
        ((acc, [k, v]) =>
            isObject(v) && isObject(left[k])
                ? { ...acc, [k]: merge(left[k], v) }
                : { ...acc, [k]: v }
            , left
        );

const empty = {};

const isObject = x => Object(x) === x;

const diff1 = (left = {}, right = {}, rel = "left") =>
    Object.entries(left)
        .map(([k, v]) =>
            isObject(v) && isObject(right[k])
                ? [k, diff1(v, right[k], rel)]
                : right[k] !== v
                    ? [k, { [rel]: v }]
                    : [k, empty]
        )
        .reduce((acc, [k, v]) =>
            v === empty
                ? acc
                : { ...acc, [k]: v }
            , empty
        );
const customDiff = (x = {}, y = {}) =>
    merge
        (diff1(x, y, "old")
            , diff1(y, x, "new")
        );