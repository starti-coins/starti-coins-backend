<<<<<<< HEAD
#!/bin/bash

=======
>>>>>>> 86e688c7af3c13e01292931075d6e079fb68fed2
starticoins(){

    case $1 in

<<<<<<< HEAD
        -run)
=======
        run)
>>>>>>> 86e688c7af3c13e01292931075d6e079fb68fed2
            echo "Starting postgres and redis in development mode..."
            docker compose -f docker-compose.dev.yml up -d
            ;;

<<<<<<< HEAD
        -stop)
=======
        stop)
>>>>>>> 86e688c7af3c13e01292931075d6e079fb68fed2
            echo "Stopping postgres and redis in development mode..."
            docker compose -f docker-compose.dev.yml down --remove-orphans
            ;;

        *)
            echo "Comando inválido! Use: run, stop"
            ;;

    esac
<<<<<<< HEAD
}
starticoins "$1"
=======
}
>>>>>>> 86e688c7af3c13e01292931075d6e079fb68fed2
