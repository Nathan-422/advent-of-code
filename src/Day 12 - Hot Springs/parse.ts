import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

type conditionRecord = {
	record: string
	groupLengths: number[]
	// numOfGroups: number
}

function parseGroups(record: string, groupLengths: number[], stripped: string) {
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
			return parseGroups(record.substring(1), groupLengths, stripped.concat('.'))

		case '?':
			const replacedWithDot = parseGroups('.' + record.substring(1), groupLengths, stripped)
			const replacedWithOct = parseGroups('#' + record.substring(1), groupLengths, stripped)
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
				stripped + record.substring(0, numOfChars).replace(/\?/g, '#') + record.charAt(numOfChars).replace('?', '.'))

		default:
			console.log(('@'.repeat(64) + '\n').repeat(30) + `Something went super wrong (${firstChar})`)
	}
}

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data
// console.log(input)

const conditionRecords: conditionRecord[] = input.map(line => {
	const [record, groupString] = line.split(' ')
	const groupLengths = groupString.split(',').map(num => Number.parseInt(num))

	return {
		record: record,
		groupLengths: groupLengths,
		// numOfGroups: groupLengths.length,
	}
})

// console.log(conditionRecords)

const record = conditionRecords[0]
// console.log(`${record}\nREAL RECORD\n${record.record}`)
// console.log(parseGroups(record.record, record.groupLengths, ''))

let total = 0
// let limit = 0
for (let line of conditionRecords) {
	// if (limit > 10) {
	// 	break
	// }
	// console.log(line)
	// console.log(`REAL RECORD\n${line.record}\n${'|'.repeat(line.record.length)}`)
	const validConfigurations = parseGroups(line.record, line.groupLengths, '')
	// console.log(`${validConfigurations}\n\n`)
	total += validConfigurations

	// limit += 1
}
console.log(total)

// console.log(`${'#####'.replace(/'?'/g, '#')}`)
