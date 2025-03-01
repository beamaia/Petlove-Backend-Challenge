from datetime import datetime
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
                        full_name varchar(200) NOT NULL,
                        date_birth date,
                        number int,
                        road varchar(200),
                        city varchar(100),
                        postal_code varchar(9),
                        phone varchar(20)
                        CONSTRAINT
                        cpf_check CHECK (cpf ~ '^[0-9]*$' AND LENGTH(cpf) = 11)
                        );"""
                        
    sql_animal_type = """CREATE TABLE animalType (
                        id_type SERIAL PRIMARY KEY,
                        type varchar(200) NOT NULL UNIQUE,
                        CONSTRAINT check_type CHECK (type ~ '^[A-Z]+[a-z ]*$')
                        );"""

    sql_service = """CREATE TABLE service (
                        id_service SERIAL PRIMARY KEY,
                        service_type varchar(50) UNIQUE NOT NULL ,
                        price real NOT NULL
                        CHECK (price > 0), 
                        CONSTRAINT check_service_type CHECK (service_type ~ '^[A-Z]+[a-z ]*$')
                        );"""

    sql_animal = """CREATE TABLE animal (
                        id_animal SERIAL PRIMARY KEY, 
                        id_person varchar(11) NOT NULL REFERENCES person(cpf) ON DELETE CASCADE,
                        id_type int NOT NULL REFERENCES animalType(id_type) ON DELETE CASCADE,
                        name varchar(200) NOT NULL,
                        date_birth date
                        );"""

    sql_schedule = """CREATE TABLE schedule (
                        id_schedule SERIAL PRIMARY KEY,
                        id_person varchar(11) REFERENCES person(cpf) ON DELETE CASCADE,
                        id_animal int REFERENCES animal(id_animal) ON DELETE CASCADE,
                        id_service int REFERENCES service(id_service) ON DELETE CASCADE,
                        date_service timestamp NOT NULL UNIQUE
                        );"""

    cur.execute(sql_person)
    cur.execute(sql_animal_type)
    cur.execute(sql_service)
    cur.execute(sql_animal)
    cur.execute(sql_schedule)

def create_person() -> tuple[str, str]:
    """
    Create a person with random info and the query to insert it into the Person's table

            Return:
                `tuple[str, str]`: insert query, person's cpf
    """
    fake = Faker(['pt-BR'])

    # Generate random information
    cpf = str(random.randint(10000000000, 100000000000))
    birthday = fake.date_of_birth()
    name = fake.name()
    postal_code = fake.postcode()
    road = fake.street_prefix() + ' ' + fake.street_name()
    number = fake.building_number()
    city = fake.city()
    phone = fake.phone_number()

    return f"INSERT INTO person (cpf, full_name, date_birth, number, road, city, postal_code, phone) VALUES ('{cpf}', '{name}', '{birthday}', {number}, '{road}', '{city}', '{postal_code}', '{phone}')" , cpf  

def create_animal(cur:psycopg2.extensions.cursor) -> str:
    """
    Create an animal with random info and the query to insert it into the Animal's table
            Parameter:
                `cur` (psycopg2.extensions.cursor): cursor to execute querys
            Return:
                `str`: insert query
    """

    fake = Faker(['pt-BR'])

    # Generate random person in the db and animal's info
    person = select_random(cur, 'person', 'cpf')[0]
    animal_type = select_random(cur, 'animalType', 'id_type')[0]
    name = fake.first_name()
    birthday = fake.date_of_birth(maximum_age=10)

    return f"INSERT INTO animal (id_person, id_type, name, date_birth) VALUES ('{person}', '{animal_type}', '{name}', '{birthday}')"

def create_schedule(cur:psycopg2.extensions.cursor) -> tuple[str, str]:
    """
    Create a schedule with random info and the query to insert it into the Schedule's table
            Parameter:
                `cur` (psycopg2.extensions.cursor): cursor to execute querys
            Return:
                `tuple[str, str]`: insert query, scheduled time
    """

    fake = Faker(['pt-BR'])

    # Generate random animal and service from the db
    animal, cpf  = select_random(cur, 'animal', 'id_animal, id_person')
    service = select_random(cur, 'service', 'id_service')[0]
    date = fake.date_between(start_date='-1y', end_date='+1y')
    time = f'{random.randint(8, 17) : 02d}:{random.randrange(0, 59, 15)}:00'

    return f"INSERT INTO schedule (id_person, id_animal, id_service, date_service) VALUES ('{cpf}', '{animal}', '{service}', '{date} {time}')", f'{date} {time}'

def insert_animal_type(conn:psycopg2.extensions.connection) -> None:
    """
    If not inserted, insert all registered animal's type into the AnimalType table
            Parameter:
                `conn` (psycopg2.extensions.connection): connection to the db
            Return:
                `None`
    """

    with conn:
        with conn.cursor() as cur:
            # if table has already been filled, doesnt fill it again
            cur.execute("SELECT EXISTS(SELECT * from animalType)")

            test = cur.fetchone()
            if test and test[0]:
                print('animalType table has already been filled...')
                cur.close()
                return

            print('Inserting values into animalType...')

            for animal_aux in list(Animal):
                sql = f"INSERT INTO animalType (type) VALUES ('{animal_aux.value}')"

                try:
                    cur.execute(sql)
                except psycopg2.errors.UniqueViolation as e:
                    print("Animal already exists..")
                sleep(0.01)
            
def insert_service(conn:psycopg2.extensions.connection) -> None:
    """
    If not inserted, insert all registered services into the Service table
            Parameter:
                `conn` (psycopg2.extensions.connection): connection to the db
            Return:
                `None`
    """

    with conn:
        with conn.cursor() as cur:
            # if table has already been filled, doesnt fill it again
            cur.execute("SELECT EXISTS(SELECT * from service)")

            test = cur.fetchone()
            if test and test[0]:
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
    
def insert_person(conn:psycopg2.extensions.connection) -> None:
    """
    Create PERSON_SIZE random people and insert it into the Person table
    as long as the cpf doesn't exist
            Parameter:
                `conn` (psycopg2.extensions.connection): connection to the db
            Return:
                `None`
    """

    with conn:
        with conn.cursor() as cur:
            print('Inserting values into person...')

            for i in range(PERSON_SIZE):
                person_sql, cpf = create_person()
                try:
                    cpf_check = f"SELECT cpf FROM person WHERE cpf = '{cpf}'"
                    cur.execute(cpf_check)

                    test=cur.fetchone()
                    if test and test[0]:
                        print(f'Person already exists...')
                        continue

                    cur.execute(person_sql)
                except psycopg2.errors.UniqueViolation as e:
                    print("Person already exists..")
                sleep(0.01)

def insert_animal(conn:psycopg2.extensions.connection) -> None:  
    """
    Create ANIMAL_SIZE random animals and insert it into the Animal table
            Parameter:
                `conn` (psycopg2.extensions.connection): connection to the db
            Return:
                `None`
    """

    with conn:
        with conn.cursor() as cur:
            print('Inserting values into animal...')

            for i in range(ANIMAL_SIZE):
                animal_sql = create_animal(cur)
                try:
                    cur.execute(animal_sql)
                except psycopg2.errors.UniqueViolation as e:
                    print("Animal already exists..")
                sleep(0.01)

def insert_schedule(conn:psycopg2.extensions.connection) -> None:
    """
    Create SCHEDULE_SIZE random schedules and insert it into the Schedule table
    as long as the time slot isn't busy

            Parameter:
                `conn` (psycopg2.extensions.connection): connection to the db
            Return:
                `None`
    """

    with conn:
        with conn.cursor() as cur:
            print('Inserting values into schedule...')

            for i in range(SCHEDULE_SIZE):
                schedule_sql, date = create_schedule(cur)
                try:
                    hour_check = f"SELECT EXISTS(SELECT * from schedule WHERE date_service = '{date}')"
                    cur.execute(hour_check)

                    test = cur.fetchone()
                    if test and test[0]:
                        print("Time slot occupied..")
                        continue

                    cur.execute(schedule_sql)
                except psycopg2.errors.UniqueViolation as e:
                    print("Schedule already exists..")
                sleep(0.01)

def insert_tables(conn:psycopg2.extensions.connection) -> None:
    """
    Create all tables of the bd, if it doen't exist
            Parameter:
                `conn` (psycopg2.extensions.connection): connection to the db
            Return:
                `None`
    """

    with conn:
        with conn.cursor() as cur:
    
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
            
def set_seed(conn:psycopg2.extensions.connection) -> None:
    """
    set BD's seed
            Parameter:
                `conn` (psycopg2.extensions.connection): connection to the db
            Return:
                `None`
    """
        
    with conn:
        with conn.cursor() as cur:
            print('Setting seed...')

            try:
                cur.execute('SELECT setseed(0.5);')
            except Exception as e:
                print('Problem with connection, closing script...')
                print(e)
                cur.close()
                conn.close()
                quit()

def select_random(curr:psycopg2.extensions.cursor, table_name:str, column_name:str) -> list[str]:
    """
    Select an attribute of a random tuple from the db
            Parameter:
                `cur` (psycopg2.extensions.cursor): cursor to execute querys
                `table_name` (str)
                `column_name` (str)
            Return:
                `str`: value from the table
    """
    sql = f"SELECT {column_name} FROM {table_name} ORDER BY RANDOM() LIMIT 1"
    curr.execute(sql)

    return curr.fetchone()
    
def tables_exists(conn:psycopg2.extensions.connection) -> None:
    results = []
    with conn:
        with conn.cursor() as cur:
            sql = f"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
            cur.execute(sql)

            results = cur.fetchall()
    return len(results) == 5

def set_localtime(conn:psycopg2.extensions.connection) -> None:
    #  Brazil/East
    with conn:
        with conn.cursor() as cur:
            sql = "SET TIME ZONE 'Brazil/East';"
            cur.execute(sql)

def insert_hard_values(conn:psycopg2.extensions.connection) -> None:
    with conn:
        with conn.cursor() as cur:
            sql_person = "INSERT INTO person (cpf, full_name, date_birth, number, road, city, postal_code, phone) VALUES ('12345678900', 'Testador José', '2000-01-01', 1, 'Rua Aprovacao', 'Notapolis', '10101-101', '(27)99999-9999')"
            sql_animal = "INSERT INTO animal (id_person, id_type, name, date_birth) VALUES ('12345678900', '12', 'Fetch', '2019-03-12')"
            sql_schedule = "INSERT INTO schedule (id_person, id_animal, id_service, date_service) VALUES ('12345678900', '151', '3', '2023-04-15 13:00')"

            cur.execute(sql_person)
            cur.execute(sql_animal)
            cur.execute(sql_schedule)
            conn.commit()

if __name__ == "__main__":

    # connects to the bd
    attempts = 5
    while attempts:
        
        try:
            conn = psycopg2.connect(
                            dbname=DB['name'],
                            user=DB['user'],
                            password=DB['password'],
                            host=DB['host'],
                            port=DB['port'],
                            options="-c search_path="+'public'
                            )
            
            break
        except psycopg2.OperationalError as e:
            print("Connection can't be established, trying again...")
            attempts -= 1
            sleep(1)
            continue

    conn.set_session(autocommit=True)

    if tables_exists(conn):
        print('Tables already exists!')
        set_localtime(conn)
        conn.close()
        quit()

    # Configure localtime
    set_localtime(conn)

    random.seed(42)
    Faker.seed(42)
    
    # Create tables
    insert_tables(conn)

    set_seed(conn)

    # Insert values
    insert_person(conn)
    insert_animal_type(conn)
    insert_service(conn)
    insert_animal(conn)

    # insert_animal(conn)
    insert_schedule(conn)

    # Insert raw values
    insert_hard_values(conn)
    
    conn.close()