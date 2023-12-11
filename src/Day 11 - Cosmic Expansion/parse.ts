import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data
// console.log(input)

const expansionMultiplier = 2

type galaxy = {
	x: number
	y: number
	id: number
}

const calculateDistance = (pointA: galaxy, pointB: galaxy): number => {
	return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y)
}

const verticalExpanded = input.reduce((accu, line) => {
	const isEmptySpace = line.indexOf('#')
	if (isEmptySpace === -1) {
		const newLines = (line + '\n')
			.repeat(expansionMultiplier)
			.split('\n')
			.filter((line) => line !== "")

		return [...accu, ...newLines]
	}
	return [...accu, line]
}, [])

const expandedU: string[][] = verticalExpanded.map((row) => { return row.split('') }).reduce((result, _: string[], colIndex: number, arr: string[][]) => {
	if (colIndex >= arr[0].length) {
		return result
	}
	// console.log(`Iteration/column index ${colIndex}`)
	// console.log(result.map((row: string[]) => row.join('')).join('\n'))
	// Check if all elements in the column are the same
	const isColumnUniform = arr.every(row => row[colIndex] === arr[0][colIndex]);

	// If the column is uniform, repeat it; otherwise, keep it as is
	const modifiedColumn = isColumnUniform
		? Array(verticalExpanded.length).fill('.'.repeat(2))
		: arr.map(row => row[colIndex]);

	// Update the result matrix with the modified column
	if (result[0][0] === '') {
		return result.map((_: string[], rowIndex: number) => [modifiedColumn[rowIndex]]);
	}
	return result.map((row: string[], rowIndex: number) => [...row, modifiedColumn[rowIndex]]);
}, new Array<string[]>(verticalExpanded.length).fill(['']))

console.log(expandedU.map((row: string[]) => row.join('')).join('\n'))

const galaxies = expandedU.map((line) => line.join('')).reduce((accu, line, i) => {
	const gals = [...line.matchAll(/#/g)].map((gal, loopNum) => {
		return {
			x: gal.index,
			y: i,
			id: accu.length + loopNum
		}
	})
	return [...accu, ...gals]
}, new Array<galaxy>())

console.log(galaxies)

const distances = galaxies.reduce((accu, galaxy, _, galaxies) => {
	const galsToMatch = galaxies.filter(gal => gal.id > galaxy.id)
	const dists = galsToMatch.map((gal) => {
		const distance = calculateDistance(galaxy, gal)
		console.log(`(${galaxy.id} to ${gal.id}) dist: ${distance}`)
		return distance
	})
	return [...accu, ...dists]
}, new Array<number>)

console.log(distances.length)
console.log(distances)
console.log(distances.reduce((accu, dist) => accu + dist))
