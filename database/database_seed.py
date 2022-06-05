from time import sleep
import psycopg2
from faker import Faker
import random

from animals import Animal
from services import Services
from env import DB

PERSON_SIZE = 100
ANIMAL_SIZE = 150
SCHEDULE_SIZE = 200

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

    # Generate random person in the db and animal's info
    person = select_random(cur, 'person', 'cpf')
    animal_type = select_random(cur, 'animalType', 'id_type')
    name = fake.first_name()
    birthday = fake.date_of_birth(maximum_age=10)

    return f"INSERT INTO animal (id_person, id_type, name, data_birth) VALUES ('{person}', '{animal_type}', '{name}', '{birthday}')"

def create_schedule(cur:psycopg2.extensions.cursor):
    fake = Faker(['pt-BR'])

    animal = select_random(cur, 'animal', 'id_animal')
    service = select_random(cur, 'service', 'id_service')
    date = fake.date_between(start_date='-1y', end_date='+1y')

    return f"INSERT INTO schedule (id_animal, id_service, date_service) VALUES ('{animal}', '{service}', '{date}')"

def insert_animal_type(conn:psycopg2.extensions.connection):
    # Inserts all animal's types registered
    cur = conn.cursor()

    # if table has already been filled, doesnt fill it again
    cur.execute("SELECT EXISTS(SELECT * from animalType)")
    if cur.fetchone()[0]:
        print('animalType table has already been filled...')
        cur.close()
        return

    print('Inserting values into animalType...')

    for animal_aux in list(Animal.__members__):
        sql = f"INSERT INTO animalType (type) VALUES ('{animal_aux}')"
        try:
            cur.execute(sql)
        except psycopg2.errors.UniqueViolation as e:
            print("Animal already exists..")
        sleep(0.01)
    
    cur.close()

def insert_service(conn:psycopg2.extensions.connection):
    # Inserts all services registered
    cur = conn.cursor()

    # if table has already been filled, doesnt fill it again
    cur.execute("SELECT EXISTS(SELECT * from service)")
    if cur.fetchone()[0]:
        print('service table has already been filled...')
        cur.close()
        return

    print('Inserting values into service...')

    for service_aux in Services:
        sql = f"INSERT INTO service (service_type, price) VALUES {service_aux['service'], service_aux['price']}"
        try:
            cur.execute(sql)
        except psycopg2.errors.UniqueViolation as e:
            print("Service already exists..")
        sleep(0.01)
    
    cur.close()    
    pass
    
def insert_person(conn:psycopg2.extensions.connection):
    # Creates PERSON_SIZE tuples
    cur = conn.cursor()
    print('Inserting values into person...')

    for i in range(PERSON_SIZE):
        person_sql = create_person()
        try:
            cur.execute(person_sql)
        except psycopg2.errors.UniqueViolation as e:
            print("Person already exists..")
        sleep(0.01)

    cur.close()

def insert_animal(conn:psycopg2.extensions.connection):    
    # Insert into animal's table ANIMAL_SIZE tuples
    cur = conn.cursor()
    print('Inserting values into animal...')

    for i in range(ANIMAL_SIZE):
        animal_sql = create_animal(cur)
        try:
            cur.execute(animal_sql)
        except psycopg2.errors.UniqueViolation as e:
            print("Animal already exists..")
        sleep(0.01)
    cur.close()

def insert_schedule(conn:psycopg2.extensions.connection):
    # Insert into schedule's table SCHEDULE_SIZE tuples
    cur = conn.cursor()
    print('Inserting values into schedule...')

    for i in range(SCHEDULE_SIZE):
        schedule_sql = create_schedule(cur)
        try:
            cur.execute(schedule_sql)
        except psycopg2.errors.UniqueViolation as e:
            print("Schedule already exists..")
        sleep(0.01)
    cur.close()

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
    # select a random value from a column's table
    sql = f"SELECT {column_name} FROM {table_name} ORDER BY RANDOM() LIMIT 1"
    curr.execute(sql)

    return curr.fetchone()[0]
    

if __name__ == "__main__":
    random.seed(42)
    Faker.seed(42)

    conn = psycopg2.connect(
                    dbname=DB['name'],
                    user=DB['user'],
                    password=DB['password'],
                    host=DB['host'],
                    port=DB['port'],
                    options="-c search_path="+'public'
                    )
    conn.set_session(autocommit=True)

    # Create tables
    insert_tables(conn)

    # Insert values
    insert_person(conn)
    
    insert_animal_type(conn)
    insert_service(conn)

    insert_animal(conn)
    insert_schedule(conn)

    conn.close()