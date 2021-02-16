package gov.cdc.usds.primedata.persistence

import gov.cdc.usds.primedata.model.User
import org.springframework.data.repository.CrudRepository

interface UserRepository : UserRepository<User, Long>