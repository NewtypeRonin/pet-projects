#!/usr/bin/env python3

__app_name__ = "Bunshou"

# Intentionally no executable code beyond this point. Edit the file and
# implement the small stubs described above when you're ready.


import argparse


class SentenceBuilder:
    def __init__(self, subject, object, verb):
        self.subject = subject
        self.object = object
        self.verb = verb

    def assemble(self):
        return f"{self.subject} {self.object} {self.verb}"
    

if __name__ == "__main__":
    
    test = SentenceBuilder("私は", "リンゴ", "食べる")
    print(test.assemble())
    print("The above sentence is an example of a japanese sentence in SOV order.")
    print("It's your turn now, let's build a sentence! here are some nouns for you to try:")
    print("1: 本 (book)")
    print("2: 猫 (cat)")
    print("3: 鳥 (bird)")

    print("Which would you like to use?")
    target = input("Enter the number of the noun you want to use: ")
    if target == "1":
        target = "本"
    elif target == "2":
        target = "猫"
    elif target == "3":
        target = "鳥"
    else:
        print("Invalid input. Please try again.")
        exit()


    print("for the sake of a test we'll just use the denoter for This: これは")
    subject = "これは"
    print("For now, we'll just focus on the verb meaning it is: です！")
    verb = "です！"

    print("Now let's put it all together!")
    builder = SentenceBuilder(subject, target, verb)
    print(builder.assemble())
    """parser = argparse.ArgumentParser(description="Bunshou - Japanese sentence builder")
    parser.add_argument("subject", help="The subject of the sentence")
    parser.add_argument("order", help="The object of the sentence")
    parser.add_argument("verb", help="The verb of the sentence")

    args = parser.parse_args()

    builder = SentenceBuilder(args.subject, args.order, args.verb)"""
   # print(builder.assemble())