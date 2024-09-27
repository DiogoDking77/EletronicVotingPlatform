
package com.atlanse.domains

import groovy.transform.ToString
import groovy.transform.TupleConstructor
import io.micronaut.data.annotation.AutoPopulated

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

@Entity
@Table(name = "theme")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class ThemeEntity {
    @Id
    @AutoPopulated
    //UUID id_theme
    UUID id

    @Column(name = 'theme')
    @NotBlank(message = 'Theme can not be blank')
    @NotNull(message = 'Theme can not be null')
    String theme

}


