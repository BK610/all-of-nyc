import os
from supabase import create_client
from dotenv import load_dotenv
from supabase_data_processor import SupabaseDataProcessor

if __name__ == "__main__":
    load_dotenv('.env.local')

    url = os.getenv('SUPABASE_URL')
    # Other keys available for different role types.
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    processor = SupabaseDataProcessor(
        url,
        key,
    )

    processor.process_all_records()