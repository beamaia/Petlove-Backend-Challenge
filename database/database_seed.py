import psycopg2
import names

from animals import Animal
from env import DB

if __name__ == "__main__":
    test_animal = Animal.Lizard
    print(test_animal.name)
    print(DB)