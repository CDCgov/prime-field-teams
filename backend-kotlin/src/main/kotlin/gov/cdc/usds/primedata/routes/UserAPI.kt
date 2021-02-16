package gov.cdc.usds.primedata.routes

import gov.cdc.usds.primedata.models
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

// @see https://docs.spring.io/spring-data/data-commons/docs/1.6.1.RELEASE/reference/html/repositories.html
@RestController
@RequestMapping("/user")
class UserController(val repository: UserRepository) {

    @GetMapping
    fun findAll() = repository.findAll()

    @PostMapping
    fun addUser(@RequestBody User: User) = repository.save(User)

    @PutMapping("/{id}")
    fun updateUser(@PathVariable id: Long, @RequestBody User: User) {
        assert(User.id == id)
        repository.save(User)
    }

    @DeleteMapping("/{id}")
    fun removeUser(@PathVariable id: Long) = repository.delete(id)

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) = repository.findOne(id)
}