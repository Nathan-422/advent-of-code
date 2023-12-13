import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

enum Rotation {
	v,
	h,
}

type Reflection = {
	orientation: Rotation
	width: number
	l: number
	r: number
}

const isSymetric = (line: string, a: number, b: number): boolean => {
	return line.at(a) === line.at(b)
}

const isFullReflection = (line: string, center: number[]) => {
	const [l, r] = [...center]
	for (let i = 0; l - i >= 0 && r + i < line.length; i++) {
		if (!isSymetric(line, l - i, r + i)) {
			return false
		}
	}
	return true
}

const findReflectionsInLine = (line: string, toCheck: number[][]) => {
	const symetricLines: number[][] = []

	for (let pair of toCheck) {
		if (isSymetric(line, pair[0], pair[1])) {
			symetricLines.push(pair)
		}
	}

	return symetricLines
}

const findReflection = (space: string[], isHorizontal: boolean = false): Reflection => {
	let possiblePairs: number[][] = []
	// console.log(space)

	for (let i = 0; i < space[0].length - 1; i++) {
		possiblePairs[i] = [i, i + 1]
	}

	for (let line of space) {
		possiblePairs = findReflectionsInLine(line, possiblePairs)
		if (possiblePairs.length === 0) break
	}

	// if (possiblePairs.length > 1) {
	// 	console.log((('*').repeat(40) + '\n').repeat(20))
	// 	console.log('MULTIPLE REFLECTIONS FOUND')
	// 	console.log(possiblePairs)
	// }

	const fullWidthPairs: number[][] = []
	for (let pair of possiblePairs) {
		let isFullWidth = true
		for (let line of space) {
			if (!isFullReflection(line, pair)) {
				isFullWidth = false
				break
			}
		}
		isFullWidth ? fullWidthPairs.push(pair) : null
	}

	let reflection: Reflection

	if (fullWidthPairs.length === 0) {
		// console.log("Had to flip")
		return reflection = findReflection(flipSpace(space), true)
	}

	const spaceLeft = fullWidthPairs[0][0] + 1
	const spaceRight = space[0].length - fullWidthPairs[0][1]

	reflection = {
		orientation: isHorizontal ? Rotation.h : Rotation.v,
		width: spaceLeft > spaceRight ? spaceRight : spaceLeft,
		l: fullWidthPairs[0][0],
		r: fullWidthPairs[0][1],
	}

	return reflection
}

const flipSpace = (space: string[]): string[] => {
	return space.map((_, colIndex) => space.map(row => row.at(colIndex)).join(''))
}

const data = readFileSync(dataFile, 'utf8').split("\n\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n\n").filter((line) => line !== "")

const input = data
const spaces = input.map(line => {
	return line.split('\n').filter(line => line.length !== 0)
})

const reflections: Reflection[] = []
for (let space of spaces) {
	// console.log(space)
	reflections.push(findReflection(space))
}

console.log(reflections.reduce((total, current) => {
	if (current.orientation === Rotation.v) {
		return total + current.l + 1
	}

	return total + ((current.l + 1) * 100)
}, 0))

// const testLine = '..##..###'
// console.log(isFullReflection(testLine, [6, 7]))
