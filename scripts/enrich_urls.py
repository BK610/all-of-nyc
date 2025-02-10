from utils.csv_processing import csv_path_to_json
from utils.url_data_enricher import UrlDataEnricher
from utils.supabase_connector import connect_to_supabase, fetch_from_supabase, upsert_to_supabase
import asyncio
import argparse
import time
import os
from dotenv import load_dotenv

# Set up the data in this script.
load_dotenv('.env.local')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

supabase_client = connect_to_supabase(url, key)
table = "enriched_url_data"

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog='EnrichUrls',
        description='Enrich a set of URLs from an input CSV file with HTTP status code and OpenGraph info available at the URL.'
    )
    parser.add_argument('output_csv_path', help='Path to output CSV.')
    parser.add_argument('-a', '--asynchronous', action='store_true', help='Run in asynchronous mode. Default False.')

    args = parser.parse_args()
    url_data_enricher = UrlDataEnricher()
    start_time = time.perf_counter()

    # 1. Pull data from Supabase
    response = fetch_from_supabase(table=table, supabase_client=supabase_client, limit=5, order_by="last_updated_at", order_by_desc=False)
    fetched_data = response.data

    step_1_time = time.perf_counter()

    print(f"Completed step 1 in: {step_1_time - start_time} seconds")

    # 2. Enrich that data
    if args.asynchronous:
        asyncio.run(url_data_enricher.enrich_urls_async(fetched_data, args.output_csv_path))
    else:
        url_data_enricher.enrich_urls(fetched_data, args.output_csv_path)
    
    step_2_time = time.perf_counter()

    print(f"Completed step 2 in: {step_2_time - step_1_time} seconds")
    
    # 3. Upsert that data to Supabase
    enriched_data = csv_path_to_json(args.output_csv_path)
    upsert_to_supabase(table=table, data=enriched_data, pk="domain_name", supabase_client=supabase_client)

    step_3_time = time.perf_counter()

    print(f"Completed step 3 in: {step_3_time - step_2_time} seconds")

    # 4. Delete the generated file

    try:
        os.remove(args.output_csv_path)
        print(f"File {args.output_csv_path} deleted successfully")
    except FileNotFoundError:
        print(f"File {args.output_csv_path} not found.")

    step_4_time = time.perf_counter()

    print(f"Completed step 4 in: {step_4_time - step_3_time} seconds")

    end_time = time.perf_counter()

    print(f"Completed everything in: {end_time - start_time} seconds")