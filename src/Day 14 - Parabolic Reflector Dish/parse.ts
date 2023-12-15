import { readFileSync } from 'node:fs'
function shiftBoldersLeft(platform: string[]): string[] {
	return platform.map(line => {
		return line.split('#').map(seg => {
			if (seg.length === 0) return ''
			const leftShiftedBolders = [...seg].reduce((accu, current) => {
				const value = current === 'O' ? current + accu : accu + current
				return value
			})
			return leftShiftedBolders
		}).join('#')
	})
}

function rotate(matrix: string[], rotation: Rotation): string[] {
	if (rotation === Rotation.full) {
		return matrix
	}

	const rotatedMatrix = new Array<string>(matrix[0].length).fill('')
	for (let i = 0; i < rotatedMatrix.length; i++) {
		for (let j = 0; j < matrix.length; j++) {
			rotatedMatrix[i] = rotatedMatrix[i].concat(matrix[matrix.length - 1 - j][i])
		}
	}

	return rotate(rotatedMatrix, rotation - 1)
}

function score(platform: string[]): number {
	return platform.map((line) => {
		return line.replace(/\./g, '').replace(/#/g, '')
	}).reduce((total, value, i, arr) => {
		// console.log(`Line: ${arr.length - i}. Count: ${value}`)
		return total + (value.length * (arr.length - i))
	}, 0)
}

type LoopData = {
	startOfLoop: number
	loopLength: number
	cyclesBeforeLoop: number
	positionRecords: Map<string, number>
}

function spinCycle(platform: string[]): string[] {
	let currentPosition = platform
	currentPosition = rotate(shiftBoldersLeft(currentPosition), Rotation.ninty)
	currentPosition = rotate(shiftBoldersLeft(currentPosition), Rotation.ninty)
	currentPosition = rotate(shiftBoldersLeft(currentPosition), Rotation.ninty)
	currentPosition = rotate(shiftBoldersLeft(currentPosition), Rotation.ninty)
	return currentPosition
}

function findLoopLength(platform: string[]): LoopData {
	let initialPosition = platform
	const previousPositions = new Map<string, number>()

	for (let i = 0; i < totalLoops; i++) {
		initialPosition = spinCycle(initialPosition)
		console.log(`${'='.repeat(38)}
	Cycle: ${i}
	Score: ${score(rotate(initialPosition, Rotation.ninty))}`)

		if (previousPositions.has(initialPosition.join('|'))) {
			const startOfLoop = previousPositions.get(initialPosition.join('|'))
			const cyclesBeforeLoop = startOfLoop + 1
			const loopLength = i - startOfLoop + 1

			console.log(`${'*'.repeat(38)}
	Found a repeat.
	Cycle started at index: ${startOfLoop}
	Loop is ${loopLength} cycles long
	There are ${cyclesBeforeLoop} cycles before the loop

${initialPosition.join('\n')}`)

			return {
				startOfLoop: startOfLoop,
				loopLength: loopLength,
				cyclesBeforeLoop: cyclesBeforeLoop,
				positionRecords: previousPositions,
			}
		} else {
			previousPositions.set(initialPosition.join('|'), i)
		}
	}
}

enum Rotation {
	full,
	ninty,
	oneEighty,
	twoSeventy
}

const testFile = './test.txt'
const dataFile = './data.txt'
const totalLoops = 1000000000

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data



const northFacingWest = rotate(input, Rotation.twoSeventy)
const loopData = findLoopLength(northFacingWest)

const ending = (totalLoops - loopData.startOfLoop) % loopData.loopLength
const correctBoard = rotate([...loopData.positionRecords.entries()].reduce((accu, entry) => {
	if (entry[1] === ending) {
		return entry[0]
	}
	return accu
}, '').split('|'), Rotation.ninty)
console.log(`\n${'~'.repeat(38)}
Score: ${score(correctBoard)} (should be 64)
Should need ${loopData.cyclesBeforeLoop} + ${ending} total cycles
`)
// console.log((correctBoard))

// const finalRotation = rotate(lastKey, Rotation.ninty)

// console.log('Found end of loop on cycle: ' + (previousPositions.get(lastKey.join('|')) - 1))
// console.log(finalRotation.join('\n'))
// console.log(score(finalRotation))
