export default function sumObjValues(obj) {
    const arr = Object.values(obj);

    const reducer = (acc, curVal) => {
        if (!Number.isNaN(Number(acc)) && !Number.isNaN(Number(curVal))) {
            return acc + curVal
        }
        return 0
    };

    return arr.reduce(reducer)
}
