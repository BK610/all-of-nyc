import requests
import pandas as pd
from populate_metadata import ensure_protocol, get_status_code, get_meta_data, get_status_code_async, get_meta_data_async
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import os
import aiohttp
import asyncio
import argparse

CSV_ROWS_SCHEMA = [
    'url',
    'registration_date',
    'status_code',
    'final_url',
    'title',
    'description',
    'image'
    ]

def setup_session():
    session = requests.Session()

    # Disable SSL verification for the session to improve redirect handling
    # Not a great idea, but doing it for now
    session.verify = False

    # Suppress the InsecureRequestWarning from urllib3
    # (otherwise, there would be an extra error for every row in the file) 
    requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

    return session

def append_to_csv_from_dataframe(row, file_path, file_exists):
    pd.DataFrame([row]).to_csv(
        file_path,
        mode='a',
        sep=",",
        header=not file_exists, # Write header only if file doesn't exist
        index=False
    )

def enrich_url(url, registration_date, session):
    """Process an individual URL to get status code and Open Graph data."""
    # Ensure url starts with https or http protocol
    url_with_protocol = ensure_protocol(url)

    # Fetch HTTP status code
    status_code = get_status_code(url_with_protocol, session)

    # Fetch Open Graph metadata
    metadata = get_meta_data(url_with_protocol, session)

    return {
        # Original data
        'url': url,
        'registration_date': registration_date,
        # Status code from pinging URL
        'status_code': status_code,
        # Metadata from URL, or redirected URL
        'final_url': metadata['final_url'],
        'title': metadata['title'],
        'description': metadata['description'],
        'image': metadata['image']
    }

def enrich_urls(input_csv_path, output_csv_path):
    """Read URLs from CSV, process them, and save enriched data to a new CSV file."""
    try:
        # Check if output CSV exists
        file_exists = os.path.isfile(output_csv_path)

        # Load existing data if output CSV exists, otherwise create new DataFrame
        try:
            if file_exists:
                existing_data = pd.read_csv(output_csv_path)
            else:
                existing_data = pd.DataFrame(columns=CSV_ROWS_SCHEMA)
        except FileNotFoundError:
            existing_data = pd.DataFrame(columns=CSV_ROWS_SCHEMA)

        # Collect the list of URLs that have already been processed into the output file
        processed_urls = set(existing_data['url'])
        
        # Read URLs from CSV
        input_data = pd.read_csv(input_csv_path)

        # Check that `url` column exists
        if 'url' not in input_data.columns:
            print("CSV must contain a 'url' column")
            return
        
        # Create new requests.Session() with desired settings
        session = setup_session()

        # Get the info for each URL and add it to the array that's being built
        for index, row in input_data.iterrows():
            if row['url'] in processed_urls:
                continue # Skip URLs that we've already processed

            enriched_row = enrich_url(row['url'], row['registration_date'], session)

            # Convert enriched data to DataFrame and save it
            print(enriched_row)
            pd.DataFrame([enriched_row]).to_csv(
                output_csv_path,
                mode='a',
                sep=",",
                header=not file_exists, # Write header only if file doesn't exist
                index=False
            )
            print(f"Successfully processed: {row['url']}")
            file_exists = True  # Set to True after first write if file was created
        
        print(f"Finished processing all of: {input_csv_path}")

    except Exception as e:
        print(f"Error during processing: {e}")

async def process_urls(input_data, session, processed_urls, output_csv_path, file_exists):

    tasks_test = [
        enrich_url_async(row['url'], row['registration_date'], row['nexus_category'], session)
        for index, row in input_data.iterrows()
        if row['url'] not in processed_urls
    ]

    async for task in asyncio.as_completed(tasks_test):
        result = await task
        if result:
            append_to_csv_from_dataframe(result, output_csv_path, file_exists)
            file_exists = True
            
    # tasks = []

    # for index, row in input_data.iterrows():
    #     if row['url'] in processed_urls:
    #         continue
        
    #     print('process_urls:', row['url'])

    #     tasks.append(enrich_url_async(row['url'], row['registration_date'], row['nexus_category'], session))

    # results = await asyncio.gather(*tasks)

    # print("results:", results)

    # pd.DataFrame(results).to_csv(
    #     output_csv_path,
    #     mode='a',
    #     sep=",",
    #     header=not file_exists, # Write header only if file doesn't exist
    #     index=False,
    # )

async def enrich_url_async(url, registration_date, nexus_category, session):

    # Ensure url starts with https or http protocol
    url_with_protocol = ensure_protocol(url)

    # print("in enrich_url for", url_with_protocol)
    try:
        async with session.get(url_with_protocol) as response:
            # print('async trying: ', url_with_protocol)

            # Fetch HTTP status code
            status_code = await get_status_code_async(url_with_protocol, session)

            # status_code = 200

            # Fetch Open Graph metadata
            # if status_code != "Error":
            metadata = await get_meta_data_async(url_with_protocol, session)

            # metadata = {
            #     "final_url": "url.com",
            #     "title": "title",
            #     "description": "description",
            #     "image": "image"
            # }

            print('url:', url_with_protocol, "status:", status_code)

            return {
                # Original data
                'url': url,
                'registration_date': registration_date,
                # 'nexus_category': nexus_category,           # Uncomment later!!
                # Status code from pinging URL
                'status_code': status_code,
                # Metadata from URL, or redirected URL
                'final_url': metadata['final_url'],
                'title': metadata['title'],
                'description': metadata['description'],
                'image': metadata['image']
            }
    except Exception as e:
        print(f"Error processing URL {url}: {e}")

        return {
            # Original data
            'url': url,
            'registration_date': registration_date,
            # Status code from pinging URL
            'status_code': "Error",
            # Metadata from URL, or redirected URL
            'final_url': "Error",
            'title': "Error",
            'description': "Error",
            'image': "Error"
        }

async def enrich_urls_async(input_csv_path, output_csv_path):

    # Load existing data if output CSV exists, otherwise create new DataFrame
    try:
        file_exists = os.path.isfile(output_csv_path)

        if file_exists:
            existing_data = pd.read_csv(output_csv_path)
        else:
            existing_data = pd.DataFrame(columns=CSV_ROWS_SCHEMA)
    except FileNotFoundError:
        existing_data = pd.DataFrame(columns=CSV_ROWS_SCHEMA)
        
    try:
        processed_urls = set(existing_data['url'])
        input_data = pd.read_csv(input_csv_path)

        if 'url' not in input_data.columns:
            print("CSV must contain a 'url' column")
            return
        
        async with aiohttp.ClientSession() as session:
            await process_urls(
                input_data,
                session,
                processed_urls,
                output_csv_path,
                file_exists
            )

            print('finished process_urls')
        print('finished!')

    except Exception as e:
        print(f"Error during processing: {e}")
        


# # Test files
# test_csv_path = 'test_file.csv' # Sample of ~100 rows from the real data
# test_output_path = 'test_output_file.csv' # Path to save enriched test data

# # Real files
# real_csv_path = 'nyc_Domain_Registrations_20241115.csv'  # Path to your input CSV file
# real_output_path = 'output_urls_enriched.csv'  # Path to save enriched CSV file

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog='EnrichUrls',
        description='Enrich a set of URLs from an input CSV file with HTTP status code and OpenGraph info available at the URL.'
    )

    parser.add_argument('input_csv_path', help='Path to input CSV.')
    parser.add_argument('output_csv_path', help='Path to output CSV.')
    parser.add_argument('-a', '--asynchronous', action='store_true', help='Run in asynchronous mode. Default False.')

    args = parser.parse_args()

    if args.asynchronous:
        asyncio.run(enrich_urls_async(args.input_csv_path, args.output_csv_path))
    else:
        enrich_urls(args.input_csv_path, args.output_csv_path)