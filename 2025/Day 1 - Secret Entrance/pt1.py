# with open("pt1_example.txt") as data:
with open("pt1_data.txt") as data:
    position = 50
    zero_count = 0
    i = 0
    total_loops = 15
    start_inspection_range = 0
    end_inspection_range = start_inspection_range + total_loops

    for line in data:
        starting_zero_count = zero_count
        starting_position = position
        move = int(line[1:])
        if line[0] == "L":
            move = move * -1
        started_on_zero = position == 0

        position += move

        # Cancel full revolutions
        shift = position // 100
        position -= shift * 100
        # cancel the shifts that shouldn't count
        if shift < 0 and started_on_zero:
            print("cancled a cross that started on 0")
            shift += 1

        # count the values outside 0-99
        zero_count += abs(shift)

        # count left turns that land on 0
        if line[0] == "L" and position == 0:
            print(" landing on 0")
            zero_count += 1

        # Cancel negatives between -99 and -1
        # count the ones that did not start on 0
        if position < 0 and position > -100:
            # get back to 0-99
            position += 100

        if i >= start_inspection_range and i < end_inspection_range:
            print(f"Pos: {starting_position} -> {position}")
            print(f"Cng: {line}", end="")
            print(f"Mov: {move}")
            print(f"Sft: {shift}")
            print(f"Zst: {started_on_zero}")
            print(f"Zro: {starting_zero_count} -> {zero_count}", end="\n\n")
        i += 1

    print(zero_count)
