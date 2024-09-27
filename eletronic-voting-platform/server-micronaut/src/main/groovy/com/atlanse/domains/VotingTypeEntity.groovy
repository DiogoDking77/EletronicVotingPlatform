
package com.atlanse.domains

import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.data.annotation.AutoPopulated

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.Id
import javax.persistence.ManyToMany
import javax.persistence.Table
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull


@Entity

@Table(name = "voting_type")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class VotingTypeEntity {
    @Id
    @AutoPopulated
    UUID id

    @Column(name = 'type')
    @NotBlank(message = 'Type can not be blank')
    @NotNull(message = 'Type can not be null')
    String type


    @Column(name = 'n_choices')
    @NotBlank(message = 'Choices number can not be blank')
    @NotNull(message = 'Choices number can not be null')
    int n_choices = 1

    /*
    @ManyToMany(mappedBy = "userTypes")
    Set<UserEntity> users = []
     */
}
