file = "data.txt"
# file = "example.txt"

with open(file) as data:
    id_ranges = data.readline().strip("\n").split(",")
    # 11-22,95-115,998-1012

    total_invalid_ids = 0

    print(id_ranges)
    for range_unsplit in id_ranges:
        # 11-22

        # We want to count by length n/2 (rounded up) increments to skip iterating over all numbers
        # So for 11-22 we can count by 1s
        # for 100-250 we can count by 10s
        # for 1000-1227 we can count by 100s etc...

        # "11", "22" - strings
        sStart, sStop = range_unsplit.split("-")
        iStart, iStop = [int(string) for string in range_unsplit.split("-")]

        # normalize to increment by 1
        #
        # this approach may be more computationally
        # intensive but should work for odds
        #
        # count chars in first word
        # take half, rounded down i.e. 5 -> 2
        # remove same number from end
        # increment through with range()
        print()
        print(range_unsplit)

        start_len = sStart.__len__()
        stop_len = sStop.__len__()

        if start_len == 1:
            start_first_half = 0
            stop_first_half = 0
        else:
            start_first_half = int(sStart[: -1 * (start_len // 2)])
            stop_first_half = int(sStop[: -1 * (start_len // 2)])

        print(f"start num: {sStart}")
        print(f"start len: {start_len}")

        if start_len % 2 == 1:
            # print("Starting number is odd length")
            if start_len == 1:
                start_first_half = iStart
                stop_first_half = iStop
            else:
                digits_to_remove = -1 * ((start_len // 2) + 1)
                start_first_half = int(sStart[:digits_to_remove])
                stop_first_half = int(sStop[:digits_to_remove])

        for i in range(start_first_half, stop_first_half + 1):
            if start_len == 1:
                repeat = i
                if repeat > 10 and repeat in range(iStart, iStop + 1):
                    print(f"Found repeat: {repeat}")
                    total_invalid_ids += repeat
            else:
                repeat = int(f"{i}{i}")

                if repeat in range(iStart, iStop + 1):
                    print(f"Found repeat: {repeat}")
                    total_invalid_ids += repeat

            print(repeat)

        # print()
    print(total_invalid_ids)
    # for i in range(start, stop + 1):
    #     ids.setdefault(i,1,)
