import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => {
	if (line !== "") return line
})
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => {
	if (line !== "") return line
})

const input = data
console.log(data)

type Race = {
	time: number
	recordDistance: number
}

const times = input.at(0).split(' ').slice(1).filter((string) => string !== '')
const distances = input.at(1).split(' ').slice(1).filter((string) => string !== '')

const races: Race[] = []


races.push({ time: Number.parseInt(times.join('')), recordDistance: Number.parseInt(distances.join('')) })

// for (let i = 0; i < times.length; i++) {
// 	races.push({ time: Number.parseInt(times[i]), recordDistance: Number.parseInt(distances[i]) })
// }

console.log(races)

const waysToWinByRace: number[] = []

for (let race of races) {
	let waysToWin = 0
	for (let timeHeld = 0; timeHeld < race.time; timeHeld++) {
		const timeToMove = race.time - timeHeld
		const speed = timeHeld

		const distance = timeToMove * speed
		if (distance > race.recordDistance) {
			waysToWin++
		}
	}
	waysToWinByRace.push(waysToWin)
}

console.log(waysToWinByRace.reduce((accu, race) => {
	if (accu === 0) {
		return race
	} else {
		return accu * race
	}
}, 0))

