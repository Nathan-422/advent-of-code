const fs = require('node:fs')
const file = './data.txt'

const numbers = {
	'zero': '0',
	'one': '1',
	'two': '2',
	'three': '3',
	'four': '4',
	'five': '5',
	'six': '6',
	'seven': '7',
	'eight': '8',
	'nine': '9',
}

const numbersAndStringsPattern = 'one|two|three|four|five|six|seven|eight|nine|1|2|3|4|5|6|7|8|9'

function convertWord(word) {
	return numbers[word]
}

function findNextToken(string) {
	let result = new RegExp(numbersAndStringsPattern).exec(string)
	return result
}

function extractTokens(string) {
	remainingString = string
	let tokens = []
	console.log()
	while (true) {
		let token = findNextToken(remainingString)

		if (token === null) break
		if (remainingString === '') break

		tokens.push(token[0])

		remainingString = remainingString.slice(token.index + 1)
	}

	return tokens
}

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
	let tokens = extractTokens(line)

	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].length === 1) continue
		tokens[i] = convertWord(tokens[i])
	}

	let first = tokens[0]
	let last = tokens[tokens.length - 1]

	if (tokens.length > 0) {
		console.log(`Coordinate\t${first + last}`)
		console.log('')
		sum += Number.parseInt(first + last)
	} else {
		console.log('Empty line found')
	}
}

console.log(sum)
