const fs = require('node:fs')
const file = './data.txt'

// Methods

function parseTokens(string) {
	const colors = {
		red: [],
		green: [],
		blue: [],
	}

	Object.keys(colors).map((color) => {
		const results = string.matchAll(new RegExp('[0-9]+(?= ' + color + ')', 'g'))
		for (let result of results) {
			const destring = Number.parseInt(result[0]);
			colors[color] = [destring].concat(...colors[color]);
		}
	})

	console.log(colors)
	return colors
}

function extractId(string, pattern = '(?<=Game )[0-9]+(?=:)', flags = '') {
	console.log(string)
	let result = new RegExp(pattern, flags).exec(string)

	console.log('ID: ' + result)

	if (result === null) return null

	return Number.parseInt(result)
}

function isGamePossible() {

}

// Model

const maxCubes = {
	red: 12,
	green: 13,
	blue: 14
}

// game = {
// 	id: number
// 	cubesShown: shownCubes[]
// }

// shownCubes {
// 	blue: number
// 	red: number
// 	green: number
// }


// Execution

let data = fs.readFileSync(file, 'utf8', (err, contents) => {
	if (err) {
		console.error(err)
		return
	}
	return contents
})

let parsedData = data.split('\n')

let sum = 0

for (let line of parsedData) {
	// let tokens = (line)
	//
	// for (let i = 0; i < tokens.length; i++) {
	// 	if (tokens[i].length === 1) continue
	// 	tokens[i] = convertWord(tokens[i])
	// }
	//
	const id = extractId(line)
	const tokens = parseTokens(line)
	console.log()


	// let first = tokens[0]
	// let last = tokens[tokens.length - 1]
	//
	// if (tokens.length > 0) {
	// 	console.log(`Coordinate\t${first + last}`)
	// 	console.log('')
	// 	sum += Number.parseInt(first + last)
	// } else {
	// 	console.log('Empty line found')
	// }
}

console.log(sum)
