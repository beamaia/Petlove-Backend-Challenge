from time import sleep
import psycopg2
from faker import Faker
import random

from animals import Animal
from env import DB

PERSON_SIZE = 500
ANIMAL_SIZE = 1000

def create_tables(cur:psycopg2.extensions.cursor) -> None:
    sql_person = """CREATE TABLE person (
                        cpf varchar(11) PRIMARY KEY,
                        full_name varchar(200),
                        data_birth date,
                        number int,
                        road varchar(200),
                        city varchar(100),
                        postal_code varchar(9),
                        phone varchar(20)
                        );"""
                        
    sql_animal_type = """CREATE TABLE animalType (
                        id_type SERIAL PRIMARY KEY,
                        type varchar(200)
                        );"""
                        
    sql_service = """CREATE TABLE service (
                        id_service SERIAL PRIMARY KEY,
                        service_type varchar(50),
                        price real
                        );"""
                        
    sql_animal = """CREATE TABLE animal (
                        id_animal SERIAL PRIMARY KEY, 
                        id_person varchar(11) REFERENCES person(cpf),
                        id_type int REFERENCES animalType(id_type),
                        name varchar(200),
                        data_birth date
                        );"""

    sql_schedule = """CREATE TABLE schedule (
                        id_schedule SERIAL PRIMARY KEY,
                        id_animal int REFERENCES animal(id_animal),
                        id_service int REFERENCES service(id_service),
                        date_service date
                        );"""

    cur.execute(sql_person)
    cur.execute(sql_animal_type)
    cur.execute(sql_service)
    cur.execute(sql_animal)
    cur.execute(sql_schedule)

def create_person():
    fake = Faker(['pt-BR'])

    # Generate random information
    cpf = str(random.randint(0, 100000000000))
    birthday = fake.date_of_birth()
    name = fake.name()
    postal_code = fake.postcode()
    road = fake.street_prefix() + ' ' + fake.street_name()
    number = fake.building_number()
    city = fake.city()
    phone = fake.phone_number()

    return f"INSERT INTO person (cpf, full_name, data_birth, number, road, city, postal_code, phone) VALUES ('{cpf}', '{name}', '{birthday}', {number}, '{road}', '{city}', '{postal_code}', '{phone}')"    

def create_animal(cur:psycopg2.extensions.cursor):
    fake = Faker(['pt-BR'])

    person = select_random(cur, 'person', 'cpf')
    animal_type = select_random(cur, 'animalType', 'id_type')
    name = fake.first_name()
    birthday = fake.date_of_birth(maximum_age=10)

    return f"INSERT INTO animal (id_person, id_type, name, data_birth) VALUES ('{person}', '{animal_type}', '{name}', '{birthday}')"

def create_schedule():
    # 
    pass

def insert_animal_type(conn:psycopg2.extensions.connection):
    cur = conn.cursor()
    print('Inserting values into animalType...')

    for animal_aux in list(Animal.__members__):
        sql = f"INSERT INTO animalType (type) VALUES ('{animal_aux}')"
        try:
            cur.execute(sql)
            conn.commit()
        except psycopg2.errors.UniqueViolation as e:
            print("Animal already exists..")
        sleep(0.01)
    
    cur.close()

def insert_service_type(conn:psycopg2.extensions.connection):
    # sophie
    pass
    
def insert_person(conn:psycopg2.extensions.connection):
    # Creates PERSON_SIZE tuples
    cur = conn.cursor()
    print('Inserting values into person...')

    for i in range(PERSON_SIZE):
        person_sql = create_person()
        try:
            cur.execute(person_sql)
            conn.commit()
        except psycopg2.errors.UniqueViolation as e:
            print("Person already exists..")
        sleep(0.01)

    cur.close()

def insert_animal(conn:psycopg2.extensions.connection):
    # sophie
    pass

def insert_schedule(conn:psycopg2.extensions.connection):
    # 
    pass

def insert_tables(conn:psycopg2.extensions.connection):
    cur = conn.cursor()
    
    try:
        # Checks if table exists
        cur.execute("select exists(select * from information_schema.tables where table_name=%s)", ('schedule',))
        if not cur.fetchone()[0]:
            create_tables(cur)

    except psycopg2.errors.DuplicateTable as e:
        print('Table already created')

    except Exception as e:
        print('Problem with connection, closing script...')
        print(e)
        cur.close()
        conn.close()
        quit()
    
    cur.close()

def select_random(curr, table_name, column_name):
    sql = f"SELECT {column_name} FROM {table_name} ORDER BY RANDOM() LIMIT 1"
    curr.execute(sql)

    return curr.fetchone()[0]
    

if __name__ == "__main__":
    random.seed(10)
    Faker.seed(10)

    conn = psycopg2.connect(
                    dbname=DB['name'],
                    user=DB['user'],
                    password=DB['password'],
                    host=DB['host'],
                    port=DB['port'],
                    options="-c search_path="+'public'
                    )
    # Create tables
    insert_tables(conn)

    # Insert values
    insert_person(conn)
    insert_animal_type(conn)
    insert_animal(conn)
    insert_schedule(conn)

    conn.commit()
    conn.close()