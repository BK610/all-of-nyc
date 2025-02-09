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

def csv_path_to_json(csv_path):
    """Read the CSV at csv_path, and convert it to an array of JSON objects for each row."""
    csv = pd.DataFrame(pd.read_csv(csv_path))

    return csv_to_json(csv)

def csv_to_json(csv):
    """Convert CSV file to an array of JSON objects, one for each row."""
    json_string = csv.to_json(orient="records")

    json_obj = json.loads(json_string)

    return json_obj