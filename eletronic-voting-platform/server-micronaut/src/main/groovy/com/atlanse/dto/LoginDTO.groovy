package com.atlanse.dto

import io.micronaut.data.annotation.AutoPopulated

import javax.persistence.Id
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

class LoginDTO {

    UUID id

    @NotBlank(message = 'Email can not be blank')
    @NotNull(message = 'Email can not be null')
    String email

    @NotBlank(message = 'Password can not be blank')
    @NotNull(message = 'Password can not be null')
    String password

    String message

    String userRole
}
