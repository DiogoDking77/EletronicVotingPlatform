package com.atlanse.domains


import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.data.annotation.AutoPopulated

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.Id
import javax.persistence.Table
import javax.persistence.UniqueConstraint
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull
import javax.validation.constraints.Pattern
import javax.validation.constraints.Size
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = ["email"]))
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class UserEntity {
    @Id
    @AutoPopulated
    UUID id

    @Column(name = 'name')
    @NotBlank(message = 'Name can not be blank')
    @NotNull(message = 'Name can not be null')
    String name

    @Column(name = 'genre')
    @NotBlank(message = 'Genre can not be blank')
    @NotNull(message = 'Genre can not be null')
    String genre

    @Column(name = 'date_of_birth')
    @NotBlank(message = 'Date of birth can not be blank')
    @NotNull(message = 'Date of birth can not be null')
    LocalDate dateOfBirth

    @Column(name = 'nationality')
    @NotBlank(message = 'Nationality can not be blank')
    @NotNull(message = 'Nationality can not be null')
    String nationality

    @Column(name = 'email')
    @NotBlank(message = 'Email can not be blank')
    @NotNull(message = 'Email can not be null')
    @Email(message = 'Invalid email format')
    @Pattern(
            regexp = '^\\S+@\\S+\\.\\S+$',
            message = 'Invalid email format. TLD (text after a dot) is required.'
    )
    String email

    @Column(name = 'password')
    @NotBlank(message = 'Password can not be blank')
    @NotNull(message = 'Password can not be null')
    @Size(min = 8, message = 'Password must be at least 8 characters long')
    @Pattern(
            regexp = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!?]).+$',
            message = 'Password must contain at least one uppercase letter, one digit, and one special character'
    )
    String password


    @Column(name = 'creation_date')
    @NotBlank(message = 'Creation date can not be blank')
    @NotNull(message = 'Creation date can not be null')
    LocalDateTime creationDate


    @Enumerated(EnumType.STRING)
    @Column(name = 'user_role')
    UserRole userRole = UserRole.User

    @Column(name = 'deleted')
    //@Column(name = "deleted", columnDefinition = "boolean default false")
    @NotBlank(message = 'Deleted can not be blank')
    @NotNull(message = 'Deleted can not be null')
    boolean deleted


}
