import os
from dotenv import load_dotenv
from utils.supabase_connector import connect_to_supabase, upsert_to_supabase
from utils.csv_processing import csv_to_json
from utils.open_api_data_processor import OpenApiDataProcessor

"""
Run this file to:
1. Check the latest registration date for rows already in Supabase
2. Get all new data from the NYC Open Data portal since that registration date
3. Add that new data to Supabase

Note: This step only adds the raw data from NYC Open Data to Supabase, without any data enriching

This is part 1 of the pipeline:
1. Add new URLs from NYC Open Data to Supabase (add_new_urls.py)
2. Enrich URLs that don't yet have metadata (enrich_urls.py)
3. Clean up the derived Supabase columns (update_all_urls.py)
"""

# Set up the data in this script.
load_dotenv('.env.local')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

supabase_client = connect_to_supabase(url, key)
table = "enriched_url_data"

api_url = "https://data.cityofnewyork.us/resource/9cw8-7heb.csv"

def get_latest_registration_date():
    """
    Get the latest domain_registration_date value in Supabase.

    Args:
        url: The URL to collect data from
    """
    column_name = "domain_registration_date"

    response = (supabase_client.table(table)
                                .select(column_name)
                                .order(column_name, desc=True)
                                .limit(1)
                                .single()
                                .execute())
    
    latest_registration_date = response.data[column_name]

    # return "2025-02-08T00:00:00"

    return latest_registration_date

if __name__ == "__main__":
    # 1. Get the latest domain_registration_date value for existing Supabase records
    latest_registration_date = get_latest_registration_date()
    print(f"Latest registration date: {latest_registration_date}")

    # 2. Fetch new data from the NYC Open Data API from the latest domain_registration_date to today

    print(f"Fetching all data since {latest_registration_date}")
    processor = OpenApiDataProcessor(api_url, 1000)
    data = processor.get_data_by_date(latest_registration_date)

    print(f"Converting data to JSON")
    data_as_json = csv_to_json(data)

    # 3. Upsert that data into Supabase

    print(f"Upserting data into {table} Supabase table")
    upsert_to_supabase(table, data_as_json, "domain_name", supabase_client)

    print("Finished adding new URLs to Supabase.")