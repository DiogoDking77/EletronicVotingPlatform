package com.atlanse.services


import com.atlanse.domains.VotingTypeEntity
import com.atlanse.repositories.VotingTypeRepository
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Inject
import jakarta.inject.Singleton

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@Slf4j
@Singleton
class VotingTypeService {

    @Inject
    VotingTypeRepository votingTypeRepository

    @PersistenceContext
    EntityManager entityManager

    VotingTypeEntity create(VotingTypeEntity voting_type_) {
        if (voting_type_.type != "Simple Voting" && voting_type_.n_choices <= 1) {
            throw new IllegalArgumentException("For non-Simple Voting types, number of choices must be greater than 1")
        }
        VotingTypeEntity voting_type = new VotingTypeEntity(
                type: voting_type_.type,
                n_choices: voting_type_.n_choices,
        )

        return votingTypeRepository.save(voting_type)
    }



    VotingTypeEntity findByID(UUID id) {
        return votingTypeRepository.findById(id).orElse(null)
    }

    Page<VotingTypeEntity> findAll(Pageable pageable) {
        return votingTypeRepository.findAll(pageable)
    }

    VotingTypeEntity update(UUID id, VotingTypeEntity voting_type_) {
        VotingTypeEntity voting_type = votingTypeRepository.findById(id).orElse(null)
        if (voting_type) {
            if (voting_type_.type) {
                voting_type.type = voting_type_.type
            }

            if (voting_type.type != "Simple Voting" && voting_type_.n_choices <= 1) {
                throw new IllegalArgumentException("For non-Simple Voting types, number of choices must be greater than 1")
            }
            if (voting_type_.n_choices){
                voting_type.n_choices = voting_type_.n_choices
            }

            votingTypeRepository.update(voting_type)
            return voting_type
        }
        return null
    }

    void delete(UUID id) {
        VotingTypeEntity voting_typeToDelete = votingTypeRepository.findById(id).orElse(null)
        if (voting_typeToDelete) {
            votingTypeRepository.delete(voting_typeToDelete)
        }
    }
}

