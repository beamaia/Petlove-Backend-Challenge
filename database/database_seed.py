import psycopg2
import names
import random

from animals import Animal
from env import DB

if __name__ == "__main__":
    test_animal = random.choice(list(Animal))
    print(test_animal.name)
    print(DB)