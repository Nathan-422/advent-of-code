import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data   // switch to flip
console.log(input)

const cardValue = new Map(
	[
		['A', 13],
		['K', 12],
		['Q', 11],
		['J', 10],
		['T', 9],
		['9', 8],
		['8', 7],
		['7', 6],
		['6', 5],
		['5', 4],
		['4', 3],
		['3', 2],
		['2', 1]
	]
)

enum handT {
	FiveOfAKind = 7,
	FourOfAKind = 6,
	FullHouse = 5,
	ThreeOfAKind = 4,
	TwoPair = 3,
	OnePair = 2,
	HighCard = 1,
}

type Hand = {
	hand: string
	bid: number
	type: handT
	isStronger: (otherHand: Hand) => number
}

const parseHandType = (cards: string) => {
	const suitCounts = cards.split('').reduce((map, cardSuit) => {
		return map.set(cardSuit, (map.get(cardSuit) || 0) + 1)
	}, new Map<string, number>)

	switch (suitCounts.size) {
		case 1:
			return handT.FiveOfAKind
		case 2:
			for (let count of suitCounts.values()) {
				if (count === 4) {
					return handT.FourOfAKind
				}
			}
			return handT.FullHouse
		case 3:
			for (let count of suitCounts.values()) {
				if (count === 3) {
					return handT.ThreeOfAKind
				}
			}
			return handT.TwoPair
		case 4:
			return handT.OnePair
		case 5:
			return handT.HighCard
	}
}

const hands: Hand[] = input.map((hand) => {
	const parts = hand.split(' ')
	const handType = parseHandType(parts[0])

	return {
		hand: parts[0],
		bid: Number.parseInt(parts[1]),
		type: handType,
		isStronger: function(this: Hand, otherHand: Hand): number {
			if (this.type != otherHand.type) {
				return this.type - otherHand.type
			}

			if (this.hand === otherHand.hand) {
				console.log("Same hands found: " + this.hand)
			}

			for (let i = 0; i < this.hand.length; i++) {
				if (cardValue.get(this.hand[i]) !== cardValue.get(otherHand.hand[i])) {
					return cardValue.get(this.hand[i]) - cardValue.get(otherHand.hand[i])
				}
			}

			return 0
		}
	}
})


// console.log(
// 	hands
// 		.sort((a, b) => b.isStronger(a))
// 		.map((hand, i, hands) => `Hand: ${hand.hand} | Type: ${hand.type} | Score: ${(hands.length - i) * hand.bid} | Loop: ${i}`
// 		))

console.log(
	hands
		.sort((a, b) => b.isStronger(a))
		.map((hand, i, hands) => (hands.length - i) * hand.bid)
		.reduce((accu, current) => accu + current, 0)
)


