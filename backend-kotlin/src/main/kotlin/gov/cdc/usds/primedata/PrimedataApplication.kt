package gov.cdc.usds.primedata

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PrimedataApplication

// https://auth0.com/blog/developing-restful-apis-with-kotlin/
fun main(args: Array<String>) {
	runApplication<PrimedataApplication>(*args)
}
