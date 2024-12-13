import re

should_do = True
with open('data.txt', 'r') as file:
    safe_lines = 0
    total = 0
    instruction_re = re.compile(r"mul\(\d+,\d+\)|do\(\)|don't\(\)")
    for raw_line in file:
        instructions = re.findall(instruction_re,
                                  raw_line)
        for instruction in instructions:
            match instruction:
                case "do()":
                    should_do = True
                case "don't()":
                    should_do = False
                case _:
                    if (should_do is False):
                        continue
                    letters = instruction.rstrip(')').lstrip('mul(').split(',')
                    numbers = list(map(int, letters))
                    total += numbers[0] * numbers[1]
        # line = [int(x) for x in raw_line.rstrip('\n').split(' ')]
    print(total)
