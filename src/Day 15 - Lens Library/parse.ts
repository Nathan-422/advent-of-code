import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split('\n')[0].split(',')
const test = readFileSync(testFile, 'utf8').split('\n')[0].split(',')

type Step = {
	label: string
	oporator: string
	focalLength: number | null
}

const input = data.map(line => { return line.split('') })
const steps: Step[] = data.map(line => {

	const opIndex = line.match(/-|=/).index
	const step: Step = {
		label: line.substring(0, opIndex),
		oporator: line[opIndex],
		focalLength: line[opIndex] === '=' ? Number.parseInt(line.substring(opIndex + 1)) : null
	}
	return step
})

console.log(steps)

function getCharValue(character: string): number {
	const number = character.charCodeAt(0)
	return number
}

function manipulateLetter(current: number, newVal: number) {
	const added = current + newVal
	const multiplied = added * 17
	const remainder = multiplied % 256
	return remainder
}

function hash(label: string): number {
	return label.split('').reduce((accu, char) => {
		const number = getCharValue(char)
		return manipulateLetter(accu, number)
	}, 0)
}


const initValues = input.map(val => {
	return val.reduce((accu, char) => {
		const number = getCharValue(char)
		return manipulateLetter(accu, number)
	}, 0)
})

console.log(initValues.reduce((sum, val) => {
	return sum + val
}))

const boxes = new Array<Map<string, number>>(256)

steps.forEach(step => {
	const boxNum = hash(step.label)

	if (boxes[boxNum] === undefined) {
		boxes[boxNum] = new Map<string, number>()
	}

	if (step.oporator === '=') {
		// set
		boxes[boxNum].set(step.label, step.focalLength)
	} else {
		// remove
		boxes[boxNum].delete(step.label)
	}

})

console.log(boxes.reduce((sum, lenses, boxNumZeroIdx) => {
	return sum + [...lenses.values()].reduce((boxSum, focalLength, lensNumZeroIdx) => {
		const focusingPower = ((boxNumZeroIdx + 1) * (lensNumZeroIdx + 1) * (focalLength))
		return boxSum + focusingPower
	}, 0)
}, 0))
