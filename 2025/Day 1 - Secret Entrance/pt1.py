base_dir = "~/Programming/advent-of-code/2025/Day 1 - Secret Entrance/"
# with open("pt1_example.txt") as data:
with open("pt1_data.txt") as data:
    position = 50
    zero_count = 0
    for line in data:
        move = int(line[1:]) % 100
        if line[0] == "L":
            if position - move < 0:
                position += 100
            position -= move
        else:
            if position + move >= 100:
                position -= 100
            position += move
        if position == 0:
            zero_count += 1
    print(zero_count)
