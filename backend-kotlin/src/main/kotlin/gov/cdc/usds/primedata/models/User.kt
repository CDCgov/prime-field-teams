package gov.cdc.usds.primedata.models

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.GenerationType
import javax.persistence.GeneratedValue

@Entity
class User(
  @Id @GeneratedValue(strategy = GenerationType.AUTO)
  var id: Long = 0,
  var firstName: String = "",
  var lastName: String = "",
  var isAdmin: Boolean = false,
  var roleDescription: String = ""

)