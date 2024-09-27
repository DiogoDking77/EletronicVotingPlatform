package com.atlanse.services

import com.atlanse.domains.OptionsToClassifyInPointsViewEntity
import com.atlanse.domains.OptionsToClassifyViewEntity
import com.atlanse.domains.PhaseEntity
import com.atlanse.domains.VoteInviteEntity
import com.atlanse.domains.VoteOptionEntity
import com.atlanse.dto.VoteOptionDTO
import com.atlanse.repositories.VoteOptionRepository

import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Inject
import jakarta.inject.Singleton

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import java.time.LocalDateTime

@Slf4j
@Singleton
class VoteOptionService {

    @Inject
    VoteOptionRepository voting_optionRepository

    @Inject
    PhaseService phaseService

    @PersistenceContext
    EntityManager entityManager

    boolean existsOptionInCategory(String name, UUID phaseId) {
        return voting_optionRepository.existsOptionInCategory(name, phaseId)
    }

    VoteOptionEntity create(VoteOptionDTO votingOptiondto) {
        PhaseEntity phase = phaseService.findByID(UUID.fromString(votingOptiondto.phase))
        def currentPhase = phase.id
        if (!existsOptionInCategory(votingOptiondto.name, currentPhase)) {
            VoteOptionEntity voting_option = new VoteOptionEntity(
                    name: votingOptiondto.name,
                    information: votingOptiondto.information,
                    phase: phase
            )

            return voting_optionRepository.save(voting_option)
        }
    }

    boolean existsByNameAndPhaseId(String name, UUID phaseId) {
        return voting_optionRepository.existsByNameAndPhaseId(name, phaseId)
    }

    VoteOptionEntity classifyOptions(UUID phaseId) {
        Set<OptionsToClassifyViewEntity> optionsToCreate = voting_optionRepository.listOptionsToClassify(phaseId)
        LocalDateTime currentDateTime = LocalDateTime.now()

        for (OptionsToClassifyViewEntity option : optionsToCreate) {
            PhaseEntity phase = phaseService.findByID(option.nextPhaseId)
            if (phase != null) {
                if (currentDateTime.isEqual(option.closingDate) || currentDateTime.isAfter(option.closingDate)) {
                    if (!existsByNameAndPhaseId(option.option, option.nextPhaseId)) {
                        VoteOptionEntity voteOption = new VoteOptionEntity(
                                name: option.option,
                                information: option.info,
                                phase: phase
                        )
                        voting_optionRepository.save(voteOption)
                    }
                }
            }
        }
    }

    boolean optionAlreadyClassify(String name, UUID nextPhaseId) {
        return voting_optionRepository.optionAlreadyClassify(name, nextPhaseId)
    }

    VoteOptionEntity classifyOptionsInPoints(UUID phaseId) {
        List<OptionsToClassifyInPointsViewEntity> optionsToCreate = voting_optionRepository.listOptionsToClassifyInPoints(phaseId)
        LocalDateTime currentDateTime = LocalDateTime.now()

        boolean isFirstIteration = true;
        int winnersCount = 0


        for (OptionsToClassifyInPointsViewEntity option : optionsToCreate) {
            PhaseEntity Phase = phaseService.findByID(option.nextPhaseId)
            if (Phase != null) {
                if (currentDateTime.isEqual(option.closingDate) || currentDateTime.isAfter(option.closingDate)) {

                    if (isFirstIteration && optionAlreadyClassify(option.option, option.nextPhaseId) == true) {
                        break;
                    }

                    isFirstIteration = false;

                        if (!existsByNameAndPhaseId(option.option, option.nextPhaseId)) {
                            VoteOptionEntity voteOption = new VoteOptionEntity(
                                    name: option.option,
                                    information: option.info,
                                    phase: Phase
                            )
                            voting_optionRepository.save(voteOption)


                            winnersCount++

                            if (winnersCount == option.NWinners) {
                                break
                            }
                        }

                }
            }
        }
    }





    VoteOptionEntity findByID(UUID id) {
        return voting_optionRepository.findById(id).orElse(null)
    }

    Page<VoteOptionEntity> findAll(Pageable pageable) {
        return voting_optionRepository.findAll(pageable)
    }

    VoteOptionEntity update(UUID id, VoteOptionDTO votingOptiondto) {
        VoteOptionEntity voting_option = voting_optionRepository.findById(id).orElse(null)
        if (voting_option) {
            if (votingOptiondto.name) {
                voting_option.name = votingOptiondto.name
            }
            if (votingOptiondto.information){
                voting_option.information = votingOptiondto.information
            }

            if (votingOptiondto.phase) {
                PhaseEntity phase = phaseService.findByID(UUID.fromString(votingOptiondto.phase))
                voting_option.phase = phase
            }

            voting_optionRepository.update(voting_option)
            return voting_option
        }
        return null
    }

    void delete(UUID id) {
        VoteOptionEntity voting_optionToDelete = voting_optionRepository.findById(id).orElse(null)
        if (voting_optionToDelete) {
            voting_optionRepository.delete(voting_optionToDelete)
        }
    }

    List<VoteOptionEntity> getVoteOptionsByPhase(UUID phaseId) {
        return voting_optionRepository.findVoteOptionsByPhase(phaseId)
    }
}

