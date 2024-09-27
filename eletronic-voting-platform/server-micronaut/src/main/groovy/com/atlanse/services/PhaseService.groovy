


package com.atlanse.services

import com.atlanse.domains.CategoryEntity
import com.atlanse.domains.MultipleVotingViewEntity
import com.atlanse.domains.NormalVotingViewEntity
import com.atlanse.domains.PhaseEntity
import com.atlanse.domains.PhasesByCategoryViewEntity
import com.atlanse.domains.PhasesUserCanVoteViewEntity
import com.atlanse.domains.PointsVotingViewEntity
import com.atlanse.domains.StatisticsPhaseInPointsViewEntity
import com.atlanse.domains.StatisticsPhaseViewEntity
import com.atlanse.domains.VotingTypeEntity

import com.atlanse.dto.PhaseDTO
import com.atlanse.repositories.MultipleVotingViewRepository
import com.atlanse.repositories.NormalVotingViewRepository
import com.atlanse.repositories.PhaseRepository
import com.atlanse.repositories.PhasesUserCanVoteViewRepository
import com.atlanse.repositories.PointsVotingViewRepository
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Slf4j
@Singleton
class PhaseService {

    @Inject
    PhaseRepository phaseRepository

    @Inject
    NormalVotingViewRepository normalVotingViewRepository

    @Inject
    MultipleVotingViewRepository multipleVotingViewRepository

    @Inject
    PointsVotingViewRepository pointsVotingViewRepository

    @Inject
    PhasesUserCanVoteViewRepository phasesUserCanVoteViewRepository

    @Inject
    VotingTypeService votingTypeService

    @Inject
    CategoryService categoryService

    boolean existsPhaseInCategory(String name, String categoryId) {
        UUID categoryUuid = UUID.fromString(categoryId)
        return phaseRepository.existsPhaseInCategory(name, categoryUuid)
    }

    PhaseEntity create(PhaseDTO phasedto) {
        CategoryEntity category = categoryService.findByID(UUID.fromString(phasedto.category))
        VotingTypeEntity votingType = votingTypeService.findByID(UUID.fromString(phasedto.votingType))

        if(!existsPhaseInCategory(phasedto.name, phasedto.category)) {
            PhaseEntity phase = new PhaseEntity(
                    n_phase: phasedto.n_phase,
                    name: phasedto.name,
                    n_winners: phasedto.n_winners,
                    openingDate: phasedto.opening_date,
                    closingDate: phasedto.closing_date,
                    privacy: phasedto.privacy,
                    category: category,
                    votingType: votingType
            )
            return phaseRepository.save(phase)
        }
    }

    PhaseEntity findByID(UUID id) {
        return phaseRepository.findById(id).orElse(null)
    }

    Page<PhaseEntity> findAll(Pageable pageable) {
        return phaseRepository.findAll(pageable)
    }



    PhaseEntity update(UUID id, PhaseDTO phasedto) {

        PhaseEntity phase = phaseRepository.findById(id).orElse(null)

        if (phase != null) {
            if (phasedto.n_phase) {
                phase.n_phase = phasedto.n_phase
            }
            if (phasedto.name) {
                phase.name = phasedto.name
            }
            if (phasedto.n_winners) {
                phase.n_winners = phasedto.n_winners
            }
            if (phasedto.opening_date) {
                phase.openingDate = phasedto.opening_date
            }

            if (phasedto.closing_date) {
                phase.closingDate = phasedto.closing_date
            }
            phase.privacy = phasedto.privacy

            if (phasedto.category) {
                CategoryEntity category = categoryService.findByID(UUID.fromString(phasedto.category))
                phase.category = category
            }

            if (phasedto.votingType) {
                VotingTypeEntity votingType = votingTypeService.findByID(UUID.fromString(phasedto.votingType))
                phase.votingType = votingType
            }

            phaseRepository.update(phase)
            return phase
        }

        return null
    }

    void delete(UUID id) {
        PhaseEntity phaseToDelete = phaseRepository.findById(id).orElse(null)
        if (phaseToDelete != null) {
            phaseRepository.delete(phaseToDelete)
        }
    }

    /*
    Set<PhaseEntity> getPhasesByCategory(UUID categoryId) {
        return phaseRepository.findPhasesByCategory(categoryId)
    }
     */

    List<PhasesByCategoryViewEntity> getPhasesByCategory(UUID categoryId) {
        return phaseRepository.findPhasesByCategory(categoryId)
    }

    List<NormalVotingViewEntity> getNormalVoting(UUID phaseId){
        return normalVotingViewRepository.getNormalVoting(phaseId)
    }

    List<MultipleVotingViewEntity> getMultipleVoting(UUID phaseId){
        return multipleVotingViewRepository.getMultipleVoting(phaseId)
    }

    List<PointsVotingViewEntity> getPointsVoting(UUID phaseId){
        return pointsVotingViewRepository.getPointsVoting(phaseId)
    }

    List<PhasesUserCanVoteViewEntity> getPhasesUserCanVote(UUID votingId, UUID userId){
        return phasesUserCanVoteViewRepository.getPhasesUserCanVote(votingId, userId)
    }

    List<StatisticsPhaseViewEntity> showStatistics(UUID phaseId) {
        return phaseRepository.showStatistics(phaseId)
    }

    /*
    List<StatisticsPhaseInPointsViewEntity> showStatisticsInPoints(UUID phaseId) {
        return phaseRepository.showStatisticsInPoints(phaseId)
    }
     */

    List<StatisticsPhaseInPointsViewEntity> showStatisticsInPoints(UUID phaseId) {
        List<StatisticsPhaseInPointsViewEntity> resultList = phaseRepository.showStatisticsInPoints(phaseId);

        // Usando um Set para garantir unicidade baseada no ID
        Set<UUID> uniqueIds = new HashSet<>();

        // Lista para armazenar os elementos únicos
        List<StatisticsPhaseInPointsViewEntity> uniqueResultList = new ArrayList<>();

        // Iterando pela lista original e adicionando apenas elementos únicos
        for (StatisticsPhaseInPointsViewEntity entity : resultList) {
            if (uniqueIds.add(entity.getId())) {
                // O ID ainda não existe no conjunto, então adiciona o elemento à lista única
                uniqueResultList.add(entity);
            }
        }

        return uniqueResultList;
    }




}

