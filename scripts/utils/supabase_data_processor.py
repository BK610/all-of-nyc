from supabase import create_client
from datetime import datetime
from typing import List, Dict, Any
import logging
import time

class SupabaseDataProcessor:
    def __init__(self, supabase_url: str, supabase_key: str, batch_size: int = 1000):
        """
        Initialize the processor with Supabase credentials and configuration.
        
        Args:
            supabase_url: Your Supabase project URL
            supabase_key: Your Supabase API key
            batch_size: Number of records to process in each batch
        """
        self.supabase = create_client(supabase_url, supabase_key)
        self.table_name = "enriched_url_data"
        self.batch_size = batch_size

        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def get_data_by_date(self, start_date: str, end_date: str = datetime.utcnow().isoformat()) -> List[Dict[Any]]:
        """
        Get data from Supabase within the provided dates.
        """
        try:
            response = (self.supabase.table(self.table_name)
                        .select("*")
                        .gte(start_date)
                        .lte(end_date)
                        .execute())
            data = response.data
            self.logger.info(f"Successfully fetched {len(data)} rows")
            return data
        except Exception as e:
            self.logger.error(f"Error updating batch: {e}")
            raise
    
    def calculate_metadata(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate metadata fields for a single row."""
        now = datetime.utcnow().isoformat()

        # True if no conditions are true:
        #   1. Does the column not have a value?
        #   2. Is the value equal to "Error"?
        #   3. Is the value equal to "Not found"?
        is_url_found = (not
                        ((not row.get('final_url'))
                         or row.get('final_url') == "Error"
                         or row.get('final_url') == "Not found"))
        is_og_title_found = (not
                             ((not row.get('title'))
                              or row.get('title') == "Error"
                              or row.get('title') == "Not found"))
        is_og_image_found = (not ((not row.get('image'))
                                  or row.get('image') == "Error"
                                  or row.get('image') == "Not found"))
        
        if is_url_found and is_og_title_found: website_status = "is_complete"
        elif is_url_found: website_status = "is_live"
        else: website_status = "is_down"

        return {
            "is_url_found": is_url_found,
            "is_og_title_found": is_og_title_found,
            "is_og_image_found": is_og_image_found,
            "last_updated_at": now,
            "website_status": website_status
            # "last_ping": 
        }
    
    def process_batch(self, rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process a batch of rows and prepare updates."""
        updates = []
        for row in rows:
            metadata = self.calculate_metadata(row)
            updates.append({
                'domain_name': row['domain_name'], # 'domain_name' is the primary key of the database
                **metadata
            })
        return updates
    
    def update_batch(self, updates: List[Dict[str, Any]]) -> None:
        """Update a batch of rows in Supabase."""
        try:
            self.supabase.table(self.table_name).upsert(updates, on_conflict='domain_name').execute()
            self.logger.info(f"Successfully updated {len(updates)} rows")
        except Exception as e:
            self.logger.error(f"Error updating batch: {e}")
            raise
    
    def process_all_records(self) -> None:
        """Process all records in batches."""
        offset = 0
        total_processed = 0

        while True:
            response = (
                self.supabase.table(self.table_name)
                .select("domain_name, final_url, title, image")
                .range(offset, offset + self.batch_size - 1)
                .execute()
                )
            
            records = response.data
            if not records:
                break

            updates = self.process_batch(records)
            self.update_batch(updates)

            total_processed += len(records)
            offset += self.batch_size

            self.logger.info(f"Processed {total_processed} records so far")
            time.sleep(1) # Rate limiting

        self.logger.info(f"Processed all {total_processed} records")
    
    def process_all_records_by_date(self, start_date: str, end_date: str = datetime.utcnow().isoformat()) -> None:
        """Process all records in batches."""
        offset = 0
        total_processed = 0

        while True:
            response = (
                self.supabase.table(self.table_name)
                .select("domain_name, final_url, title, image")
                .gte(start_date)
                .lte(end_date)
                .range(offset, offset + self.batch_size - 1)
                .execute()
                )
            
            records = response.data
            if not records:
                break

            updates = self.process_batch(records)
            self.update_batch(updates)

            total_processed += len(records)
            offset += self.batch_size

            self.logger.info(f"Processed {total_processed} records so far")
            time.sleep(1) # Rate limiting

        self.logger.info(f"Processed all {total_processed} records")