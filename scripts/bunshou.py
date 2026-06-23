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
    
    #to do: Add a means of checking if the sentence is gramattically correct via grammar pattern JSON
    #to do: Add a means of checking if the sentence is semantically correct via a dictionary JSON
    #to do in the far future: Add a means of checking if the sentence is culturally appropriate via a cultural norms JSON

    '''
        I'll mostly muse my thoughts here. Currently this is pretty rudimentary but it's straight forward enough that we can get it off the ground.

        Further in maybe a 2.0 or 3.0 iteration we can have things like a keigo checker which will allow us to give stricter checks on the verb forms and words beingn used. 
        i.e. A waiter talking to a customer, a student talking to a teacher, an employee talking to his boss, etc. etc. 

        For the time being we need to factor in a means of looping the service itself. 

        Would it be better to have the sentence building loop inside this class or in the main method itself....

        Maybe I should have a separate class for the sentence building loop and have this class just be responsible for building the sentence and checking it against the grammar and dictionary JSONs.
        but then again maybe that's overkill for such a simple service.

        But then again beyond that is this gonna be a simple service in the future?
        will it be a simple service that just builds sentences or will it be a more complex service that also checks for grammar and semantics and cultural appropriateness?

        Also will I want to add a means of checking for politeness levels in the future?

        What types of concepts of programming and python do I want to practice in this project? I want to practice OOP, JSON handling, and maybe some basic NLP concepts in the future.
        The best concepts for the project right now are definitely OOP and JSON handling. I can have the grammar patterns and dictionary entries stored in JSON files and have the 
        SentenceBuilder class handle loading those files and checking the sentences against them.
    '''

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