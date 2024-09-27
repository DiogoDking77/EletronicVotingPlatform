package com.atlanse.controllers


import com.atlanse.domains.MultipleVotingViewEntity
import com.atlanse.domains.NormalVotingViewEntity
import com.atlanse.domains.PhaseEntity
import com.atlanse.domains.PhasesByCategoryViewEntity
import com.atlanse.domains.PhasesUserCanVoteViewEntity
import com.atlanse.domains.PointsVotingViewEntity
import com.atlanse.domains.StatisticsPhaseInPointsViewEntity
import com.atlanse.domains.StatisticsPhaseViewEntity
import com.atlanse.dto.PhaseDTO
import com.atlanse.services.PhaseService
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Patch
import io.micronaut.http.annotation.Post
import jakarta.inject.Inject

@Slf4j
@Controller("/api/phase")
class PhaseController {

    @Inject
    PhaseService phaseService

    @Get("/{id}")
    HttpResponse<PhaseEntity> getPhase(UUID id) {
        PhaseEntity phase = phaseService.findByID(id)
        if (phase) {
            return HttpResponse.ok(phase)
        } else {
            return HttpResponse.notFound()
        }
    }

    @Get("/")
    HttpResponse<Page<PhaseEntity>> getPhases(Pageable pageable) {
        return HttpResponse.ok(phaseService.findAll(pageable))
    }

    @Post
    HttpResponse<PhaseEntity> createPhase(@Body PhaseDTO phasedto) {
        PhaseEntity createdPhase = phaseService.create(phasedto)
        return HttpResponse.created(createdPhase)
    }

    @Patch("/{id}")
    HttpResponse<PhaseEntity> updatePhase(UUID id, @Body PhaseDTO phasedto) {
        PhaseEntity updatedPhase = phaseService.update(id, phasedto)
        if (updatedPhase) {
            return HttpResponse.ok(updatedPhase)
        } else {
            return HttpResponse.notFound()
        }
    }

    @Delete("/{id}")
    HttpResponse deletePhase(UUID id) {
        if (phaseService.findByID(id)) {
            phaseService.delete(id)
            return HttpResponse.noContent()
        } else {
            return HttpResponse.notFound()
        }
    }

    /*
    @Get("/findByCategoryId/{categoryId}")
    HttpResponse<Set<PhaseEntity>> getPhasesByCategory(UUID categoryId) {
        Set<PhaseEntity> phases = phaseService.getPhasesByCategory(categoryId)
        return HttpResponse.ok(phases)
    }
     */

    @Get("/findByCategoryId/{categoryId}")
    HttpResponse<List<PhasesByCategoryViewEntity>> getPhasesByCategory(UUID categoryId) {
        List<PhasesByCategoryViewEntity> phases = phaseService.getPhasesByCategory(categoryId)
        return HttpResponse.ok(phases)
    }


    @Get("/normal-voting/{phaseId}")
    HttpResponse<List<NormalVotingViewEntity>> getNormalVoting(UUID phaseId) {
        List<NormalVotingViewEntity> normalVoting = phaseService.getNormalVoting(phaseId)
        return HttpResponse.ok(normalVoting)
    }

    @Get("/multiple-voting/{phaseId}")
    HttpResponse<List<MultipleVotingViewEntity>> getMultipleVoting(UUID phaseId) {
        List<MultipleVotingViewEntity> multipleVoting = phaseService.getMultipleVoting(phaseId)
        return HttpResponse.ok(multipleVoting)
    }

    @Get("/points-voting/{phaseId}")
    HttpResponse<List<PointsVotingViewEntity>> getPointsVoting(UUID phaseId) {
        List<PointsVotingViewEntity> pointsVoting = phaseService.getPointsVoting(phaseId)
        return HttpResponse.ok(pointsVoting)
    }

    @Get("/phases-user-vote/{votingId}/{userId}")
    HttpResponse<List<PhasesUserCanVoteViewEntity>> getPhasesUserCanVote(UUID votingId, UUID userId) {
        List<PhasesUserCanVoteViewEntity> phases = phaseService.getPhasesUserCanVote(votingId, userId)
        return HttpResponse.ok(phases)
    }

    @Get("/showStatistics/{phaseId}")
    HttpResponse<List<StatisticsPhaseViewEntity>> showStatistics(UUID phaseId) {
        List<StatisticsPhaseViewEntity> phases = phaseService.showStatistics(phaseId)
        return HttpResponse.ok(phases)
    }

    @Get("/showStatisticsInPoints/{phaseId}")
    HttpResponse<List<StatisticsPhaseInPointsViewEntity>> showStatisticsInPoints(UUID phaseId) {
        List<StatisticsPhaseInPointsViewEntity> phases = phaseService.showStatisticsInPoints(phaseId)
        return HttpResponse.ok(phases)
    }
}



