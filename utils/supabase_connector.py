import os
import json
from supabase import create_client
from dotenv import load_dotenv

load_dotenv('.env.local')

def connect_supabase(url, key):
    supabase = create_client(url, key)
    return supabase

def write_supabase(table, data, supabase):
    try:
        response = (
            supabase.table(table)
            .insert(data)
            .execute()
        )

        return response
    except Exception as e:
        print(f"Encountered exception while writing to {table}: {e}")

def test_supabase():
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    supabase = connect_supabase(url, key)

    table = 'enriched_url_data'
    data = {'title': 'test!'}

    write_supabase(table, data, supabase)

if __name__ == '__main__':
    test_supabase()