package ViDev.Victec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync; // <--- 1. IMPORTAR

@SpringBootApplication
@EnableAsync // <--- 2. AGREGAR ESTA ETIQUETA
public class VictecApplication {

	public static void main(String[] args) {
		SpringApplication.run(VictecApplication.class, args);
	}

}