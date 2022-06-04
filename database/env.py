from dotenv import load_dotenv
import os

load_dotenv()
load_dotenv(verbose=True)

DB = {
    "name": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASS"),
    "host": 't1-beatriz-sophie-postgres-1', #\
    "port": "5432",
}