import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

type Game = {
	id: number
	value: number
	winning: string
	yourNumbers: number[]
	matchingNumbers: number[]
	copies: number
}

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => {
	if (line !== "") return line
})
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => {
	if (line !== "") return line
})

const parseCards = (data: string[]) => {
	return data.map((line) => {
		const game = line.split(": ")
		const id = game[0].split(" ")[1]
		const [winning, yourNumbers] = game[1].split(" | ")
		const matchingNumbers = yourNumbers.split(" ")
			.filter((number) => {
				if (` ${winning} `.includes(` ${number} `)) {
					return number
				}
			})
		const value = matchingNumbers.reduce((accumulator) => {
			if (accumulator === 0) {
				return 1
			} else {
				return accumulator * 2
			}
		}, 0)

		return { id: id, value: value, winning: winning, yourNumbers: yourNumbers, matchingNumbers: matchingNumbers, copies: 1 }
	})
}

// console.log(parseCards(data))
const cards = parseCards(data)

console.log("Part 1 Answer: " + cards
	.map((card) => {
		return card.value
	})
	.reduce((accumulator, cardValue) => { return accumulator + cardValue }, 0)
)

console.log(cards)

for (let i = 0; i < cards.length; i++) {
	for (let instances = 1; instances <= cards[i].copies; instances++) {
		for (let nextCard = 1; nextCard <= cards[i].matchingNumbers.length; nextCard++) {
			cards[i + nextCard].copies += 1
			// console.log(`Card ${cards[i].id}: x${cards[i].copies}`)
		}
	}
}

console.log(cards.reduce((accumulator, card) => { return accumulator + card.copies }, 0))
