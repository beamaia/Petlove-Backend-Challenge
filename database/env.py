from dotenv import load_dotenv
import os

load_dotenv()
load_dotenv(verbose=True)

# get db info to connect to it
DB = {
    "name": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASS"),
    "host": 'postgres',
    "port": "5432",
}