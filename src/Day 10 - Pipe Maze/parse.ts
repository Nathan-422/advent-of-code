import { readFileSync } from 'node:fs'
const testFile = './test.txt'
const dataFile = './data.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data
// console.log(input.join('\n'))

// function getNextMove(this: string, from: direction): number[] {
// 	return [0, 1]
// }
//
// const directionMap = {
// 	"J": getNextMove,
// 	"L": getNextMove,
// 	"7": getNextMove,
// 	"F": getNextMove,
// 	"-": getNextMove,
// 	"|": getNextMove
// }

enum direction {
	LEFT,
	UP,
	RIGHT,
	DOWN,
}

function oppositeDirection(dir: direction): direction {
	switch (dir) {
		case direction.LEFT:
			return direction.RIGHT
		case direction.RIGHT:
			return direction.LEFT
		case direction.UP:
			return direction.DOWN
		case direction.DOWN:
			return direction.UP
	}
}

const pipeDirections = new Map<string, direction[]>([
	["J", [direction.LEFT, direction.UP]],
	["L", [direction.RIGHT, direction.UP]],
	["7", [direction.LEFT, direction.DOWN]],
	["F", [direction.RIGHT, direction.DOWN]],
	["-", [direction.LEFT, direction.RIGHT]],
	["|", [direction.UP, direction.DOWN]],
])

function dirToCoords(dir: direction): number[] {
	switch (dir) {
		case direction.LEFT:
			return [0, -1]
		case direction.RIGHT:
			return [0, 1]
		case direction.UP:
			return [-1, 0]
		case direction.DOWN:
			return [1, 0]
	}
}

type routeElement = {
	value: location
	next: routeElement | null | undefined
}

type location = {
	pipe: string
	pos: number[]
	from: direction
	to: direction
}

function getPipeFromDirection(maze: string[][], loc: number[], dir: direction): routeElement {
	// console.log("Direction: " + dir)
	const [y, x] = dirToCoords(dir)
	const newLocation = [loc[0] + y, loc[1] + x]
	const pipe = maze.at(newLocation[0]).at(newLocation[1])
	// console.log("New pipe: " + pipe)
	let trick, from
	if (pipe === 'S') {
		[trick, from] = validFirstDirections(maze, startingCoords)
	} else {
		const to = pipeDirections.get(pipe)
		trick = to.filter((d) => { return d !== oppositeDirection(dir) })[0]
		from = oppositeDirection(dir)
	}
	// console.log("To: " + to)
	// console.log("Filter: " + trick)
	return {
		value: {
			pipe: pipe,
			pos: newLocation,
			to: trick,
			from: from,
		},
		next: null
	}
}

// function setPos(oldPos: number[], dir: direction) {
//
// }

function validFirstDirections(maze: string[][], start: number[]): direction[] {
	// console.log(`x=${start[1]}, y=${start[0]}`)
	const directions: direction[] = []
	if (start[1] !== 0) {
		// check for LEFT: F L or -
		const left = maze[start[0]][start[1] - 1]
		// console.log(`Left pipe: ${left}`)
		if (left === 'F' || left === 'L' || left === '-') {
			// console.log("Pushing LEFT")
			directions.push(direction.LEFT)
		}
	}
	if (start[0] !== 0) {
		// check for UP: 7 F or |
		const up = maze[start[0] - 1][start[1]]
		// console.log(`Up pipe: ${up}`)
		if (up === 'F' || up === '7' || up === '|') {
			// console.log("Pushing UP")
			directions.push(direction.UP)
		}
	}

	// check for RIGHT: 7 J or -
	const right = maze[start[0]][start[1] + 1]
	// console.log(`Right pipe: ${right}`)
	if (right === 'J' || right === '7' || right === '-') {
		// console.log("Pushing RIGHT")
		directions.push(direction.RIGHT)
	}

	// check for DOWN: L J or |
	const down = maze[start[0] + 1][start[1]]
	// console.log(`Down pipe: ${down}`)
	if (down === 'L' || down === 'J' || down === '|') {
		// console.log("Pushing DOWN")
		directions.push(direction.DOWN)
	}
	return directions
}

const maze = input.map((line) => {
	return line.split('')
})

const startingCoords = input.reduce((coords, line, lineNum) => {
	const sPos = line.indexOf('S')
	if (sPos >= 0) {
		return [lineNum, sPos]
	}

	return coords
}, new Array<number>)

type LinkedList = {
	head: routeElement
	size: number
	add: (pipe: routeElement) => void
	getFirst: () => routeElement
	getLast: () => routeElement
}

// pipeDirections.get(maze[startingCoords[0]][startingCoords[1]]).at(0)

const route: LinkedList = {
	head: {
		value: {
			pipe: maze[startingCoords[0]][startingCoords[1]],
			pos: startingCoords,
			to: validFirstDirections(maze, startingCoords).at(0),
			from: validFirstDirections(maze, startingCoords).at(1),
		} as location,
		next: null

	},
	size: 1,
	getFirst: function(this: LinkedList): routeElement { return this.head },
	getLast: function(this: LinkedList): routeElement {
		let lastNode = this.head
		if (lastNode) {
			while (lastNode.next) {
				lastNode = lastNode.next
			}
		}
		return lastNode
	},
	add: function(this: LinkedList, pipe: routeElement) {
		this.getLast().next = pipe
		this.size += 1
	}
}

// console.log(route.getFirst())
// console.log(route.getLast())
route.getFirst().next = getPipeFromDirection(maze, startingCoords, route.getFirst().value.to)
// console.log(route.getLast())

let lastPipe = route.getLast()
while (true) {
	console.log(lastPipe)
	console.log("Number of pipes: " + route.size)
	if (lastPipe.value.pipe === 'S') {
		console.log("Found last pipe")
		break
	}
	const nextPipe = getPipeFromDirection(maze, lastPipe.value.pos, lastPipe.value.to)

	route.add(nextPipe)
	lastPipe = route.getLast()

}

console.log()
