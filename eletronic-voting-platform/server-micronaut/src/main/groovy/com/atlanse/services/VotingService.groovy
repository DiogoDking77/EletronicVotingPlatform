package com.atlanse.services


import com.atlanse.domains.ThemeEntity
import com.atlanse.domains.UserEntity
import com.atlanse.domains.VotingEntity
import com.atlanse.dto.VotingDTO
import com.atlanse.repositories.VotingRepository
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Inject
import jakarta.inject.Singleton

import java.time.LocalDateTime

@Slf4j
@Singleton
class VotingService {

    @Inject
    VotingRepository votingRepository

    @Inject
    ThemeService themeService

    @Inject
    UserService userService


    VotingEntity create(VotingDTO votingdto) {
        try {
            // Tente converter o UUID do tema
            ThemeEntity theme = themeService.findById(UUID.fromString(votingdto.theme));

            // Tente converter o UUID do proprietário
            UserEntity owner = userService.findByID(UUID.fromString(votingdto.owner));

            // Se ambos os UUIDs forem válidos, crie a entidade Voting
            VotingEntity voting = new VotingEntity(
                    name: votingdto.name,
                    information: votingdto.information,
                    creationDate: LocalDateTime.now(),
                    theme: theme,
                    owner: owner
            );

            // Salve a entidade Voting
            return votingRepository.save(voting);
        } catch (IllegalArgumentException e) {
            // Se ocorrer uma exceção, trate como UUID inválido
            throw new IllegalArgumentException("Theme can not be blank.");
        }
    }


    VotingEntity findByID(UUID id) {
        return votingRepository.findById(id).orElse(null)
    }

    Page<VotingEntity> findAll(Pageable pageable) {
        return votingRepository.findAll(pageable)
    }

    VotingEntity update(UUID id, VotingDTO votingdto) {
        VotingEntity voting = votingRepository.findById(id).orElse(null)

        if (voting != null) {
            if (votingdto.name) {
                voting.name = votingdto.name
            }
            if (votingdto.information) {
                voting.information = votingdto.information
            }
            if (votingdto.creation_date) {
                voting.creationDate = votingdto.creation_date
            }

            if (votingdto.theme) {
                ThemeEntity theme = themeService.findById(UUID.fromString(votingdto.theme))
                voting.theme = theme
            }

            if (votingdto.owner) {
                UserEntity owner = userService.findByID(UUID.fromString(votingdto.owner))
                voting.owner = owner
            }

            votingRepository.update(voting)
            return voting
        }
        return null
    }

    void delete(UUID id) {
        VotingEntity votingToDelete = votingRepository.findById(id).orElse(null)
        if (votingToDelete != null) {
            votingRepository.delete(votingToDelete)
        }
    }


    Set<UUID> findUniqueUserIdsInVoterInvitations(UUID votingId) {
        return votingRepository.findUniqueUserIdsInVoterInvitations(votingId)
    }

    Set<UUID> findCategorieswithnophases(UUID votingId){
        return votingRepository.findCategorieswithnophases(votingId)
    }
}

