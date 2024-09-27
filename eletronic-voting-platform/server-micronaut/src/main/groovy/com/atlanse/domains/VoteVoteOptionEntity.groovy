
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

@Entity
@Table(name = "vote_vote_option")
@ToString(includePackage = false, includeNames = true, includeFields = true)
@TupleConstructor
class VoteVoteOptionEntity {
    @Id
    @AutoPopulated
    UUID id

    @Column(name = 'position')
    int position

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vote_invite_id", referencedColumnName = "id")
    @Nullable
    VoteInviteEntity voteInvite

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vote_option_id", referencedColumnName = "id")
    @Nullable
    VoteOptionEntity voteOption

}



