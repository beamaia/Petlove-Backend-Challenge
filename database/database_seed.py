from time import sleep
import psycopg2
from faker import Faker
import random

from animals import Animal
from env import DB


def create_tables(cur:psycopg2.extensions.cursor) -> None:
    sql_person = """CREATE TABLE person (
                        cpf varchar(11) PRIMARY KEY,
                        full_name varchar(200),
                        data_birth date,
                        number int,
                        road varchar(200),
                        city varchar(100),
                        postal_code varchar(8),
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

    return f'INSERT INTO person (cpf, full_name, data_birth, number, road, city, postal_code, phone) VALUES ({cpf}, {name}, {birthday}, {number}, {road}, {city}, {postal_code}, {phone})'    

def create_animal():
    # bea
    pass

def create_schedule():
    # 
    pass

def insert_animal_type():
    # bea
    pass

def insert_service_type():
    # sophie
    pass
    
def insert_person():
    # bea
    pass

def insert_animal():
    # sophie
    pass

def insert_schedule():
    # 
    pass

def select_random(curr, table_name, column_name):
    sql = f"SELECT {column_name} FROM {table_name} ORDER BY RANDOM() LIMIT 1"
    curr.execute(sql)
    
    return curr.fetchone()[0]
    

if __name__ == "__main__":
    Faker.seed(10)

    conn = psycopg2.connect(
                    dbname=DB['name'],
                    user=DB['user'],
                    password=DB['password'],
                    host=DB['host'],
                    port=DB['port'],
                    options="-c search_path="+'public'
                    )
    
    cur = conn.cursor()
    
    # cur.execute("DROP TABLE test;")
    try:
        create_tables(cur)
    except psycopg2.errors.DuplicateTable as e:
        print('Table already created')
    except Exception as e:
        print('Problem with connection, closing script...')
        print(e)
        cur.close()
        conn.close()
        quit()

    for i in range(15):
        print(create_person(), end='\n\n')
    cur.close()    
    conn.commit()
    conn.close()

    # test_animal = random.choice(list(Animal))
    # print(test_animal.name)
    # print(DB)