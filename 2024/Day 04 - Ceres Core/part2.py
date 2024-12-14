import re

puzzle = []
with open('./data.txt', 'r') as file:
    for line in file:
        puzzle.append(line.rstrip('\n'))

search_re = re.compile(r"XMAS")
matches = 0

for i in range(4):
    # check each line for matches
    for row in puzzle:
        matches += len(re.findall(search_re, row))

    # rotate puzzle 45 degree
    rows = len(puzzle)
    columns = len(puzzle[0])
    puzzle_dutch = ["" for x in range(rows + columns - 1)]
    for j in range(rows):
        for k in range(columns):
            puzzle_dutch[j + k] = puzzle[j][k] + puzzle_dutch[j + k]

    # check for matches again
    for row in puzzle_dutch:
        matches += len(re.findall(search_re, row))

    # Rotate puzzle for next loop
    puzzle = list([''.join(map(str, i)) for i in zip(*puzzle[::-1])])

print(matches)
