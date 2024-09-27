        package com.atlanse.domains

        import groovy.transform.ToString
        import groovy.transform.TupleConstructor
        import io.micronaut.core.annotation.Nullable
        import io.micronaut.data.annotation.AutoPopulated
        import io.micronaut.data.annotation.MappedEntity

        import javax.persistence.Column
        import javax.persistence.FetchType
        import javax.persistence.Id
        import javax.persistence.JoinColumn
        import javax.persistence.ManyToOne
        import javax.persistence.Table
        import javax.validation.constraints.NotBlank
        import javax.validation.constraints.NotNull
        import java.time.LocalDate
        import java.time.LocalDateTime

        @MappedEntity
        @Table(name = "getNormalVotings")
        @ToString(includePackage = false, includeNames = true, includeFields = true)
        @TupleConstructor
        class InvitedVotingsViewEntity {

            @Id
            @Column(name = "id")
            UUID id

            @Column(name = 'name')
            String name

            @Column(name = 'information', length = 1000)
            String information

            @Column(name = 'creationDate')
            LocalDateTime creationDate

            @Column(name = "idOwner")
            UUID idOwner

            @Column(name = "idTheme")
            UUID idTheme

            @Column(name = "theme")
            String theme

            @Column(name = "owner")
            String owner

            @Column(name = "maxInviteDate")
            LocalDateTime maxInviteDate

            /*
            @Column(name = "categories")
            List<String> categories
            */

            @Column(name = "phases")
            List<String> phases

        }
