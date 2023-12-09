import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data.map((history) => { return history.split(" ").map((dataPoint) => { return Number.parseInt(dataPoint) }) })
console.log(input)

const getNewDifference = (history: number[]) => {
	return history.reduce((newDiff, current, i, history) => {
		if (i + 1 < history.length) {
			return [...newDiff, history[i + 1] - current]
		} else {
			return newDiff
		}
	}, [])
}

const populateDifferences = (currentHistory: Array<number[]>): Array<number[]> => {
	const currentExtrapolation = currentHistory.at(-1)

	// Escape condition - if every element in the array is zero
	if (currentExtrapolation.reduce((accu, current) => {
		if (current !== 0) {
			return false
		}
		return accu
	}, true)) {
		return currentHistory
	}

	return populateDifferences([...currentHistory, getNewDifference(currentExtrapolation)])
}

console.log(input.map((history) => {
	return populateDifferences([history]).reverse().reduce((newDiffs, extrap, i, history) => {
		if (i < history.length) {
			// escape row of zeros
			if (i === 0) {
				return [...newDiffs, [0, ...extrap]]
			}
			return [...newDiffs, [extrap.at(0) - newDiffs[i - 1].at(0), ...extrap]]
		}

		return newDiffs.reverse()
	}, new Array<number[]>)
})
	.reduce((accu, current) => {
		return accu + current.at(-1).at(0)
	}, 0)
)
