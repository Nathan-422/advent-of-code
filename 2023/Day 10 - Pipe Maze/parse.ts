import { readFileSync, writeFileSync } from 'node:fs'
const testFile = './test2.txt'
const dataFile = './data.txt'
const outFile = './output.txt'

const data = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "")
const test = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "")

const input = data

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
	return directions.reverse()
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

function outputDotToLeft(newMaze: string[][], pipe: routeElement) {
	const [y, x] = dirToCoords((pipe.value.from + 1) % 4)
	const [k, j] = dirToCoords((pipe.value.to + 4 - 1) % 4)
	const leftContentIncomming = newMaze[pipe.value.pos[0] + y][pipe.value.pos[1] + x]
	console.log(pipe.value.pos[0] + k)
	console.log(newMaze[pipe.value.pos[0] + k].join(''))
	const leftContentOutgoing = newMaze[pipe.value.pos[0] + k][pipe.value.pos[1] + j]

	// console.log("Starting char analysis. Direction: " + (pipe.value.from + 1) % 4 + ". Coords: (y=" + (pipe.value.pos[0] + y) + ", x=" + (pipe.value.pos[1] + x) + ")")
	console.log(`Coming from ${[pipe.value.pos[0] + 1, pipe.value.pos[1] + 1]}. From: ${pipe.value.from}. To: ${pipe.value.to}`)
	if (leftContentIncomming === blankStandin) {
		// console.log(leftContentIncomming + " MATCH!")
		outputMap[pipe.value.pos[0] + y][pipe.value.pos[1] + x] = '.'
	}

	if (leftContentOutgoing === blankStandin) {
		// console.log(leftContentOutgoing + " MATCH!")
		outputMap[pipe.value.pos[0] + k][pipe.value.pos[1] + j] = '.'
	}

	// console.log()
}

const blankStandin = '~'
const outputMap = (blankStandin.repeat(maze[0].length) + '\n').repeat(maze.length).split('\n').map((line) => { return line.split('') })
// console.log(route.getFirst())
// console.log(route.getLast())
// console.log(route.getLast())

route.getFirst().next = getPipeFromDirection(maze, startingCoords, route.getFirst().value.to)
outputMap[route.getFirst().value.pos[0]][route.getFirst().value.pos[1]] = route.getFirst().value.pipe

let lastPipe = route.getLast()
while (true) {
	outputMap[lastPipe.value.pos[0]][lastPipe.value.pos[1]] = lastPipe.value.pipe

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


lastPipe = route.getFirst()
while (true) {
	outputDotToLeft(outputMap, lastPipe)

	if (!lastPipe.next) {
		console.log("Found last pipe")
		break
	}

	lastPipe = lastPipe.next

}

writeFileSync(outFile, outputMap.map((line) => { return line.join('') }).join('\n'))

