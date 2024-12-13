import re


with open('data.txt', 'r') as file:
    safe_lines = 0
    total = 0
    for raw_line in file:
        instructions = re.findall("mul\\(\\d+,\\d+\\)",
                                  raw_line)
        print(instructions)
        for instruction in instructions:
            letters = instruction.rstrip(')').lstrip('mul(').split(',')
            numbers = list(map(int, letters))
            total += numbers[0] * numbers[1]
        # line = [int(x) for x in raw_line.rstrip('\n').split(' ')]
    print(total)
