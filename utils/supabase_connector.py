import os
from supabase import create_client
from dotenv import load_dotenv
from csv_processing import csv_to_json

def connect_to_supabase(url, key):
    """Create and return a client connection to supabase using the provided URL and auth key."""
    supabase = create_client(url, key)
    return supabase

def insert_to_supabase(table, data, supabase_client):
    """Insert data to table using the given supabase client."""
    try:
        response = (
            supabase_client.table(table)
            .insert(data)
            .execute()
        )
        return response
    except Exception as e:
        print(f"Encountered exception while inserting to {table}: {e}")
        return None

def upsert_to_supabase(table, data, pk, supabase_client):
    """Upsert data to table using the given supabase client.
    If a row with the same value for the specified primary key
    already exists, fail.
    TODO: Write the function"""
    try:
        response = (
            supabase_client.table(table)
            .upsert(data, on_conflict=pk)
            .execute()
        )
        return response
    except Exception as e:
        print(f"Encountered exception while upserting to {table}: {e}")
        return None

def test_writing_list():
    url = os.getenv('SUPABASE_URL')
    # Other keys available for different role types.
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    supabase = connect_to_supabase(url, key)

    table = 'enriched_url_data'
    data = [{"domain_name":"test.nyc"}]

    print(data)
    print(type(data))

    response = insert_to_supabase(table, data, supabase)

    print(response)

def test_writing_file():
    url = os.getenv('SUPABASE_URL')
    # Other keys available for different role types.
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    supabase = connect_to_supabase(url, key)
    
    table = 'enriched_url_data'
    csv_file = 'files/test/test_1.csv'

    data = csv_to_json(csv_file)

    print(data)
    print(type(data))

    response = insert_to_supabase(table, data, supabase)
    
    print(response)

if __name__ == '__main__':
    load_dotenv('.env.local')

    test_writing_file()