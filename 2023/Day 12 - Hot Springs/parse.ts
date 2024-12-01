import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

type conditionRecord = {
	record: string
	groupLengths: number[]
}

function parseWithCache(record: string, groupLengths: number[]) {
	const cache = new Map<string, number>()
	return parseGroups(record, groupLengths, cache)
}

function parseGroups(record: string, groupLengths: number[], cache: Map<string, number>, stripped: string = '') {
	const numOfGroups = groupLengths.length

	// exit condition
	if (
		record.length === 0 && numOfGroups > 0 ||
		numOfGroups === 0 && record.indexOf('#') !== -1
	) {
		return 0
	} else if (numOfGroups === 0) {
		// console.log(stripped)
		return 1
	}

	const firstChar = record.at(0)
	switch (firstChar) {
		case '.':
			return parseGroups(record.substring(1), groupLengths, cache, stripped.concat('.'))

		case '?':
			const key = record + '/' + groupLengths.join(',')

			if (cache.has(key)) {
				return cache.get(key)
			}

			let replacedWithDot = parseGroups('.' + record.substring(1), groupLengths, cache, stripped)
			let replacedWithOct = parseGroups('#' + record.substring(1), groupLengths, cache, stripped)

			cache.set(key, replacedWithDot + replacedWithOct)

			return replacedWithDot + replacedWithOct

		case '#':
			const numOfChars = groupLengths[0]

			if (
				record.length < numOfChars ||
				record.substring(0, numOfChars).indexOf('.') !== -1 ||
				record.charAt(numOfChars) === '#'
			) {
				return 0
			}

			return parseGroups(
				record.substring(numOfChars + 1),
				groupLengths.slice(1),
				cache,
				stripped + record.substring(0, numOfChars).replace(/\?/g, '#') + record.charAt(numOfChars).replace('?', '.'))

		default:
			console.log(('@'.repeat(64) + '\n').repeat(30) + `Something went super wrong (${firstChar})`)
	}
}

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data

const conditionRecords: conditionRecord[] = input.map(line => {
	const [record, groupString] = line.split(' ')
	const groupLengths = [new Array(5).fill(groupString)].join(',').split(',').map(num => Number.parseInt(num))

	return {
		record: new Array<string>(5).fill(record).join('?'),
		groupLengths: groupLengths,
	}
})

// console.log(conditionRecords)

let total = 0
for (let line of conditionRecords) {
	// console.log(line)
	// console.log(`REAL RECORD\n${line.record}\n${'|'.repeat(line.record.length)}`)
	const validConfigurations = parseWithCache(line.record, line.groupLengths)
	// console.log(`${validConfigurations}\n\n`)
	total += validConfigurations
}
console.log(total)
