import random

def conjugation_game():
    # Modular database for reliability
    # Intent -> {root: verb, suffix: ending, form_name: grammar_desc, notes: explanation}
    verb_data = [
        {
            "intent": "I bought",
            "root": "買 (ka)",
            "suffix": "った",
            "form_name": "Past Plain (Ta-form)",
            "notes": "Used in casual speech with friends."
        },
        {
            "intent": "I bought (polite)",
            "root": "買 (ka)",
            "suffix": "いました",
            "form_name": "Past Polite (Masu-form)",
            "notes": "Standard polite form used with strangers or coworkers."
        },
        {
            "intent": "I am using",
            "root": "使 (tsuka)",
            "suffix": "っています",
            "form_name": "Present Progressive (Te-iru form)",
            "notes": "Indicates an action currently in progress."
        }
    ]

    print("--- Conjugation game until v1.0 launch ---")
    
    # 1. Ask what they want to practice saying
    print("\nWhat do you want to try saying?")
    for i, entry in enumerate(verb_data):
        print(f"{i+1}. {entry['intent']}")
    
    choice = int(input("\nPick a number to start: ")) - 1
    selected = verb_data[choice]

    # 2 & 3. Give root and challenge
    print(f"\nTarget Intent: '{selected['intent']}'")
    print(f"Root provided: {selected['root']}")
    
    # 4. Take input for the 'chunk'
    guess = input(f"How do you finish '{selected['root']}...' to say '{selected['intent']}'? ").strip()

    # 5 & 6. Validation and Explanation
    if guess == selected['suffix']:
        print(f"\n✅ ¡Correcto! (Wait, wrong language...) 正解! (Seikai!)")
        print(f"Form: {selected['form_name']}")
        print(f"Explanation: {selected['notes']}")
    else:
        print(f"\n 残念！ But here's where you messed up.")
        print(f"The correct ending was: '{selected['suffix']}'")
        print(f"That would have made it: {selected['root']}{selected['suffix']}")
        print(f"Grammar breakdown: This is the {selected['form_name']}. {selected['notes']}")

if __name__ == "__main__":
    conjugation_game()
