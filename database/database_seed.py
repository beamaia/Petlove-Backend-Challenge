import psycopg2
import names
import random

from animals import Animal
from env import DB


def create_tables(cur:psycopg2.extensions.cursor) -> None:
    sql_person = """CREATE TABLE person (
                        cpf varchar(11) PRIMARY KEY,
                        full_name varchar(200),
                        data_birth date,
                        postal_code varchar(8),
                        road varchar(200),
                        number int,
                        additional_info varchar(200),
                        neighborhood varchar(200)
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

if __name__ == "__main__":
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
    

    cur.close()    
    conn.commit()
    conn.close()

    # test_animal = random.choice(list(Animal))
    # print(test_animal.name)
    # print(DB)