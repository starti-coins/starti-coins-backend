# Check if at least one argument is provided
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 databases"
    exit 1
fi

# Check wether provided directory is valid
WORK_DIR="$1"
VALID_WORK_DIRECTORIES=("databases")

IS_VALID_WORK_DIR=0
for VALID_WORK_DIR in "${VALID_WORK_DIRECTORIES[@]}"; do
    if [[ "$VALID_WORK_DIR" == "$WORK_DIR" ]]; then
        IS_VALID_WORK_DIR=1
        break
    fi
done

if [[ "$IS_VALID_WORK_DIR" -eq 0 ]]; then
    echo "Error: The first argument must be 'databases'."
    exit 1
fi

# Start databases if WORK_DIR is 'databases'
if [[ "$WORK_DIR" == "databases" ]]; then
    echo "Starting postgres and redis in development mode..."
    docker compose -f docker-compose.dev.yml up -d
    exit 0
fi