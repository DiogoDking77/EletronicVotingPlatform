package com.atlanse.domains

import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.core.annotation.Nullable
import io.micronaut.data.annotation.AutoPopulated
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull
import java.time.LocalDateTime

@Entity
@Table(name = "voting")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class VotingEntity {
    @Id
    @AutoPopulated
    UUID id

    @Column(name = 'name')
    @NotBlank(message = 'Name can not be blank')
    @NotNull(message = 'Name can not be null')
    String name

    @Column(name = 'information', length = 1000)
    String information

    @Column(name = 'creation_date')
    @NotBlank(message = 'Creation date can not be blank')
    @NotNull(message = 'Creation date can not be null')
    LocalDateTime creationDate

    @ManyToOne(fetch = FetchType.EAGER)
    @NotBlank(message = 'Theme can not be blank')
    @NotNull(message = 'Theme can not be null')
    @JoinColumn(name = "theme_id", referencedColumnName = "id")
    ThemeEntity theme

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    @Nullable
    UserEntity owner

}

