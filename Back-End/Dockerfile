# Etapa 1: Construcción (Build)
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app
COPY . .
# Damos permisos de ejecución al wrapper de Maven
RUN chmod +x mvnw
# Empaquetamos la app saltando los tests para ir más rápido
RUN ./mvnw clean package -DskipTests

# Etapa 2: Ejecución (Run)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copiamos el archivo .jar generado en la etapa anterior
COPY --from=build /app/target/Victec-0.0.1-SNAPSHOT.jar app.jar

# Exponemos el puerto 8080
EXPOSE 8080

# --- CAMBIO AQUÍ: Añadimos -Djava.net.preferIPv4Stack=true ---
ENTRYPOINT ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "app.jar"]