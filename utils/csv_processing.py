import os
import pandas as pd
import json

def append_rows_to_csv(rows, file_path):
    """Append an array of rows to the given file. If the file doesn't exist yet, create it."""
    for row in rows:
        append_row_to_csv(row, file_path)

def append_row_to_csv(row, file_path):
    """Append a single row to the given file. If the file doesn't exist yet, create it."""
    file_exists = os.path.isfile(file_path)

    pd.DataFrame([row]).to_csv(
        file_path,
        mode='a',
        sep=",",
        header=not file_exists, # Write header only if file doesn't exist
        index=False
    )

def csv_to_json(csv_path):
    """Convert CSV file at csv_path to an array of JSON objects for each row."""
    csv_file = pd.DataFrame(pd.read_csv(csv_path))

    json_string = csv_file.to_json(orient="records")

    json_obj = json.loads(json_string)

    return json_obj