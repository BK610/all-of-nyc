import requests
import pandas as pd
from populate_metadata import ensure_protocol, get_status_code, get_meta_data
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import os

csv_rows_schema = [
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
                existing_data = pd.DataFrame(columns=csv_rows_schema)
        except FileNotFoundError:
            existing_data = pd.DataFrame(columns=csv_rows_schema)

        # Collect the list of URLs that have already been processed into the output file
        processed_urls = set(existing_data['url'])
        
        # Read URLs from CSV
        input_data = pd.read_csv(input_csv_path)

        # Check that `url` column exists
        if 'url' not in input_data.columns:
            print("CSV must contain a 'url' column")
            return

        new_rows = []
        
        # Create new requests.Session() with desired settings
        session = setup_session()

        # Get the info for each URL and add it to the array that's being built
        for index, row in input_data.iterrows():
            if row['url'] in processed_urls:
                continue # Skip URLs that we've already processed

            enriched_row = enrich_url(row['url'], row['registration_date'], session)
            new_rows.append(enriched_row)

            # Convert enriched data to DataFrame and save it
            pd.DataFrame([enriched_row]).to_csv(
                output_csv_path,
                mode='a',
                sep=",",
                header=not file_exists, # Write header only if file doesn't exist
                index=False
            )
            print(f"Successfully processed: {row['url']}")
            file_exists = True  # Set to True after first write if file was created

    except Exception as e:
        print(f"Error during processing: {e}")

# Test files
test_csv_path = 'test_file.csv' # Sample of ~100 rows from the real data
test_output_path = 'test_output_file.csv' # Path to save enriched test data

# Real files
real_csv_path = 'nyc_Domain_Registrations_20241115.csv'  # Path to your input CSV file
real_output_path = 'output_urls_enriched.csv'  # Path to save enriched CSV file

enrich_urls(test_csv_path, test_output_path)