starticoins(){

    case $1 in

        run)
            echo "Starting postgres and redis in development mode..."
            docker compose -f docker-compose.dev.yml up -d
            ;;

        stop)
            echo "Stopping postgres and redis in development mode..."
            docker compose -f docker-compose.dev.yml down --remove-orphans
            ;;

        *)
            echo "Comando inválido! Use: run, stop"
            ;;

    esac
}