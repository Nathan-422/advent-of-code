import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

enum Rotation {
	v,
	h,
}

type Reflection = {
	field: string[]
	orientation: Rotation
	transformationMap: boolean[][]
	l: number
	r: number
}

const flipSpace = (space: string[]): string[] => {
	const remapped: string[][] = []
	for (let y = 0; y < space[0].length; y++) {
		remapped.push([])
		for (let x = 0; x < space.length; x++) {
			remapped[y].push(space[x][y])
			// console.log(space[x][y])
		}
	}
	return remapped.map((line) => { return line.join('') })
}

const findSingleInperfections = (field: string[], center: number[]): boolean[][] | null => {
	const [l, r] = [...center]

	const leftLinesToEdge = l + 1
	const rightLinesToEdge = field[0].length - r

	// get the distance to the edge, essentially
	const linesToCompare = leftLinesToEdge > rightLinesToEdge ? rightLinesToEdge : leftLinesToEdge


	const leftSide: boolean[][] = field
		.map((line) => {
			return line
				.split('')
				.slice(l - linesToCompare + 1, l + 1)
				.map((char) => {
					if (char === '.') return false
					return true
				})
		})

	const rightSide: boolean[][] = field
		.map((line) => {
			return line
				.split('')
				.slice(r, r + linesToCompare)
				.reverse()
				.map((char) => {
					if (char === '.') return false
					return true
				})
		})

	const halfTransformationArray = leftSide.map((line, i) => {
		return line.map((bool, j) => {
			return bool !== rightSide[i][j]
		})
	})

	const transformationArray = halfTransformationArray
		.map(line => {
			const reversed = line.slice().reverse()
			return [...line, ...reversed]
		})

	const count = transformationArray.reduce((count, line) => {
		return count + line.reduce((lineCount, bool) => {
			if (bool) {
				return lineCount + 1
			}
			return lineCount
		}, 0)
	}, 0)

	if (count === 2) {
		return transformationArray
	}

	return null
}


const findReflection = (reflection: Reflection): Reflection => {
	const space = reflection.field

	// get all possible pairs for this space
	let possiblePairs: number[][] = []
	for (let i = 0; i < reflection.field[0].length - 1; i++) {
		possiblePairs[i] = [i, i + 1]
	}

	const reflectionPairs: number[][] = []
	let transformationMap: boolean[][] = []
	for (let pair of possiblePairs) {
		const transformationMap = findSingleInperfections(space, pair)

		if (transformationMap === null) {
			continue
		}

		reflectionPairs.push(pair)
	}

	if (reflectionPairs.length === 0) {
		return findReflection({
			...reflection,
			field: flipSpace(space),
			orientation: Rotation.h
		})
	}


	return {
		...reflection,
		transformationMap: transformationMap,
		l: reflectionPairs[0][0],
		r: reflectionPairs[0][1]
	}
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
	reflections.push(findReflection({
		field: space,
		orientation: Rotation.v,
		transformationMap: [],
		l: 0,
		r: 0,
	}))
}

console.log(reflections.reduce((total, current) => {
	if (current.orientation === Rotation.v) {
		return total + current.l + 1
	}

	return total + ((current.l + 1) * 100)
}, 0))
